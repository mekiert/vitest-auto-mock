import { OtherClassFirst, OtherClassSecond } from "src/__tests__/mocking-two-classes-from-one-import/file-with-many-classes";

export class ClassMain {
  getValues(): string[] {
    const otherClassFirst = new OtherClassFirst();
    const otherClassSecond = new OtherClassSecond();
    return [otherClassFirst.getValue(), otherClassSecond.getValue()];
  }
}
