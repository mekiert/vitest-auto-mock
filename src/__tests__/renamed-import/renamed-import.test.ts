import { firstObject as mainObject } from "src/__tests__/renamed-import/first-object";

const mainObjectMock = vi.mocked(mainObject);

it('should mock renamed import', () => {
  mainObjectMock.getValue.mockReturnValue(7);
  const value = mainObject.getValue();
  expect(value).toBe(7);
});
