import { ClassSecond } from "src/__tests__/mocking-class/class-second";

export class ClassFirst {
  getValue() {
    const classSecond = new ClassSecond();
    return classSecond.getValue();
  }
}
