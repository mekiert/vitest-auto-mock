import { ClassFirst } from "src/__tests__/mocking-class/class-first";
import { ClassSecond as NamedClassImport } from "src/__tests__/mocking-class/class-second";
import { vitestAutoMock } from 'src/index';

const NamedClassImportMock = vitestAutoMock(NamedClassImport);

it('mocking-class-with-named-import', () => {
  NamedClassImportMock.mockImplementation(() => {
    return {
      getValue: () => 'value-from-mock'
    };
  });

  const classFirst = new ClassFirst();
  const value = classFirst.getValue();
  expect(value).toEqual('value-from-mock');
});
