import { objectFirst } from "src/__tests__/mocking-object/object-first";
import { objectSecond } from "src/__tests__/mocking-object/object-second";
import { vitestAutoMock } from 'src/index';

const objectSecondMock = vitestAutoMock(objectSecond);

it('mocking-object', () => {
  objectSecondMock.getValue.mockImplementation(() => 'value-from-mock');

  const value = objectFirst.getValue();
  expect(value).toEqual('value-from-mock');
});
