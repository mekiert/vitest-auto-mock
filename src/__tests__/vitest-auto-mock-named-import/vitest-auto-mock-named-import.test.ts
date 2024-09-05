import { objectImported } from "src/__tests__/vitest-auto-mock-named-import/object-imported";
import { vitestAutoMock as mockingTool } from 'src/index';

const objectImportedMock = mockingTool(objectImported);

it('vitest-auto-mock-named-import', () => {
  objectImportedMock.getValue.mockImplementation(() => 'mocked-value');
  expect(objectImportedMock.getValue()).toBe('mocked-value');
});
