import { ClassMain } from "src/__tests__/mocking-two-classes-from-one-import/class-main";
import { OtherClassFirst, OtherClassSecond } from "src/__tests__/mocking-two-classes-from-one-import/file-with-many-classes";
import { vitestAutoMock } from 'src/index';

const OtherClassSecondMock = vitestAutoMock(OtherClassSecond);

it('mocking-two-imported-classes-from-one-import', () => {
  OtherClassSecondMock.mockImplementation(() => {
    return {
      getValue: () => 'value-from-mock'
    };
  });

  const classMain = new ClassMain();
  const result = classMain.getValues();
  expect(result).toStrictEqual([undefined, 'value-from-mock']);
});

it('should also mock other-class-first', () => {
  const otherClassFirst = new OtherClassFirst();
  expect(otherClassFirst.getValue()).toBeUndefined();
});
