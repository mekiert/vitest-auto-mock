import { firstObject } from "src/__tests__/renamed-import/first-object";

vi.mocked(firstObject);

it('should mock renamed import', () => {
  const firstObjectMock = firstObject as any;
  firstObjectMock.getValue.mockReturnValue(13);
  const value = firstObject.getValue();
  expect(value).toBe(13);
});
