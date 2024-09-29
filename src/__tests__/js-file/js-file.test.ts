import { jsFileObject } from 'src/__tests__/js-file/js-file.js';

const jsFileObjectMock = vi.mocked(jsFileObject);

it('should mock an import in JS file', () => {
  jsFileObjectMock.getValue.mockReturnValue(5);

  const result = jsFileObject.getValue();
  expect(result).toBe(5);
});
