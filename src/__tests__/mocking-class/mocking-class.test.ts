import { ClassFirst } from "src/__tests__/mocking-class/class-first";
import { ClassSecond } from "src/__tests__/mocking-class/class-second";

const ClassSecondMock = vi.mocked(ClassSecond);

it('mocking-class', () => {
  ClassSecondMock.mockImplementation(() => {
    return {
      getValue: () => 'value-from-mock'
    };
  });

  const classFirst = new ClassFirst();
  const value = classFirst.getValue();
  expect(value).toEqual('value-from-mock');
});
