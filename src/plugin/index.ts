import type {
  CallExpression,
  Expression,
  Identifier,
  ImportDeclaration,
  ImportSpecifier,
  SpreadElement,
  Super
} from 'estree';
import type { ParseAst } from 'rollup';
import { createFilter, Plugin, ResolvedConfig } from 'vite';
import { configDefaults } from 'vitest/config';

const MOCKING_FUNCTION_NAME = 'vitestAutoMock';

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
    if (!isIdentifier(callee)) {
      return false;
    }
    if (callee.name === MOCKING_FUNCTION_NAME) {
      return true;
    }
    const remapedImportSpecifier = bodyImports
      .flatMap(importDeclaration => importDeclaration.specifiers)
      .find(importSpecifier => importSpecifier.local.name === callee.name);
    if (remapedImportSpecifier && isImportSpecifier(remapedImportSpecifier)) {
      return true;
    }
  };

  const applyMock = (mockDefinition: CallExpression): OptionalImportPath => {
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
  const importPathsToMock = allAutoMockUsages.map(applyMock);
  const additionalCodeToAdd = prepareCodeToAdd(importPathsToMock);
  return additionalCodeToAdd.concat(code);
};

const isVariableDeclaratorCallExpression = (expression: OptionalExpression): expression is CallExpression => {
  return !!expression && expression.type === 'CallExpression';
};

const isIdentifier = (elem: Expression | Super | SpreadElement): elem is Identifier => {
  return elem.type === 'Identifier';
};

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
  return paths
    .filter(path => !!path)
    .map(path => `vi.mock(${path});`)
    .join('\n');
};

const isImportSpecifier = (importDefinition: ImportDefinition): importDefinition is ImportSpecifier => {
  return importDefinition.type === 'ImportSpecifier';
};

type ImportDefinition = ImportSpecifier | any;
type OptionalExpression = Expression | null | undefined;
type OptionalImportPath = string | null | undefined;
