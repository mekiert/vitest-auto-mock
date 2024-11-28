import { FirstClass } from "src/__tests__/mocking-relative-path/first-class";
import { SecondClass } from 'src/__tests__/mocking-relative-path/second-class';

const ClassSecondMock = vi.mocked(SecondClass);

it('mocking-relative-path', () => {
  ClassSecondMock.mockImplementation(() => {
    return {
      getValue: () => 'value-from-mock'
    };
  });

  const firstClass = new FirstClass();
  const value = firstClass.getValue();
  expect(value).toEqual('value-from-mock');
});
