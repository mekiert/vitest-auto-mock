import type {
  CallExpression,
  Expression,
  Identifier,
  ImportDeclaration,
  SpreadElement,
  Super,
  MemberExpression,
  PrivateIdentifier
} from 'estree';
import type { ParseAst } from 'rollup';
import { createFilter, Plugin, ResolvedConfig } from 'vite';
import { configDefaults } from 'vitest/config';

const MOCKING_OBJECT_NAME = 'vi';
const MOCKING_FUNCTION_NAME = 'mocked';

export default function vitestAutoMockPlugin(): Plugin {
  type FileFilter = ReturnType<typeof createFilter>;
  let fileFilter: FileFilter | null = null;

  return {
    name: 'vite-plugin-vitest-auto-mock',
    configResolved: ({ test }: ResolvedConfig) => {
      const include = test?.include ?? configDefaults.include;
      fileFilter = createFilter(include);
    },
    transform(code: string, id: string) {
      if (!fileFilter || !fileFilter(id)) {
        return;
      }
      const result = applyAutoMocksUsingAst(code, this.parse);

      return { code: result };
    }
  };
}

const applyAutoMocksUsingAst = (code: string, parse: ParseAst) => {
  const ast = parse(code);
  const body = ast.body;
  const bodyImports = body.filter(elem => elem.type === 'ImportDeclaration');

  const isAutoMockUsage = (callExpression: CallExpression) => {
    const callee = callExpression.callee;
    if (!isMemberExpression(callee)) {
      return false;
    }
    const calleeObject = callee.object;
    if(!isIdentifier(calleeObject)) {
      return false;
    }
    if (calleeObject.name !== MOCKING_OBJECT_NAME) {
      return false;
    }
    const calleeProperty = callee.property;
    if (!isIdentifier(calleeProperty)) {
      return false;
    }
    return calleeProperty.name === MOCKING_FUNCTION_NAME;
  };

  const getImportPathOfMockedElement = (mockDefinition: CallExpression): OptionalImportPath => {
    const argument = mockDefinition.arguments[0];
    if (!isIdentifier(argument)) {
      return null;
    }
    return findImportPathOfElement(bodyImports, argument.name);
  };

  const allVariablesDeclarations = body
    .filter(elem => elem.type === 'VariableDeclaration');
  const allAutoMockUsages = allVariablesDeclarations
    .map(variableDeclaration => variableDeclaration.declarations[0].init)
    .filter(isVariableDeclaratorCallExpression)
    .filter(isAutoMockUsage);
  if (allAutoMockUsages.length === 0) {
    return code;
  }
  const importPathsToMock = allAutoMockUsages.map(getImportPathOfMockedElement);
  const additionalCodeToAdd = prepareCodeToAdd(importPathsToMock);
  return additionalCodeToAdd.concat(code);
};

const isVariableDeclaratorCallExpression = (expression: OptionalExpression): expression is CallExpression => {
  return !!expression && expression.type === 'CallExpression';
};

const isIdentifier = (elem: Expression | Super | SpreadElement | PrivateIdentifier): elem is Identifier => {
  return elem.type === 'Identifier';
};

const isMemberExpression = (elem: Expression | Super | SpreadElement): elem is MemberExpression => {
  return elem.type === 'MemberExpression';
}

const findImportPathOfElement = (bodyImports: ImportDeclaration[], elementToMockName: string): OptionalImportPath => {
  return bodyImports
    .filter(elem => isImportNameCorrect(elem, elementToMockName))
    .map(elem => elem.source.raw)[0] ?? null;
};

const isImportNameCorrect = (elem: ImportDeclaration, elementToMockName: string) => {
  return elem.specifiers.some(specifier => {
    return specifier.local.name === elementToMockName;
  });
};

const prepareCodeToAdd = (paths: OptionalImportPath[]): string => {
  return ('\n') + paths
    .filter(path => !!path)
    .map(path => `vi.mock(${path});`)
    .join('\n');
};

type OptionalExpression = Expression | null | undefined;
type OptionalImportPath = string | null | undefined;
