import { ClassMain } from "src/__tests__/mocking-two-classes-from-one-import/class-main";
import { OtherClassFirst } from "src/__tests__/mocking-two-classes-from-one-import/file-with-many-classes";

const OtherClassFirstMock = vi.mocked(OtherClassFirst);

it('mocking-two-classes-from-one-import', () => {
  OtherClassFirstMock.mockImplementation(() => {
    return {
      getValue: () => 'value-from-mock'
    };
  });

  const classMain = new ClassMain();
  const result = classMain.getValues();
  expect(result).toStrictEqual(['value-from-mock', undefined]);
});
