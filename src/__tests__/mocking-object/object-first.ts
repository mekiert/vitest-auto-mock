import { objectSecond } from "src/__tests__/mocking-object/object-second";

export const objectFirst = {
  getValue: () => {
    return objectSecond.getValue();
  }
}
