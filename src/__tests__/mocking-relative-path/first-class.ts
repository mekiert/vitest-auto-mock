import { SecondClass } from "./second-class";

export class FirstClass {
  getValue() {
    const classSecond = new SecondClass();
    return classSecond.getValue();
  }
}
