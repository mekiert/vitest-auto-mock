import { objectFirst } from "src/__tests__/mocking-object/object-first";
import { objectSecond } from "src/__tests__/mocking-object/object-second";

const objectSecondMock = vi.mocked(objectSecond);

it('mocking-object', () => {
  objectSecondMock.getValue.mockImplementation(() => 'value-from-mock');

  const value = objectFirst.getValue();
  expect(value).toEqual('value-from-mock');
});
