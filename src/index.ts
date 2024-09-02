import { Mocked, MockedClass, MockedFunction } from "vitest";

type Procedure = (...args: any[]) => any;
type Constructable = { new(...args: any[]): any; };

type VitestMock<T> = (T extends Procedure
  ? MockedFunction<T>
  : (T extends Constructable
    ? MockedClass<T>
    : (T extends Record<PropertyKey, any> ? Mocked<T> : never)));

export const vitestAutoMock = <T>(elementToMock: T): VitestMock<T> => {
  return elementToMock as VitestMock<T>;
};
