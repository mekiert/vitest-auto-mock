import { firstObject } from "src/__tests__/renamed-import/first-object";
import { Mocked } from "vitest";

vi.mocked(firstObject);

it('should mock renamed import', () => {
  const firstObjectMock = firstObject as Mocked<typeof firstObject>;
  firstObjectMock.getValue.mockReturnValue(13);
  const value = firstObject.getValue();
  expect(value).toBe(13);
});
