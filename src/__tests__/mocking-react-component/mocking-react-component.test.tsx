import { render } from '@testing-library/react';
import { ComponentFirst } from "src/__tests__/mocking-react-component/component-first";
import { ComponentSecond } from "src/__tests__/mocking-react-component/component-second";

const mockedComponentB = vi.mocked(ComponentSecond);

it('mocking-react-component', () => {
  render(<ComponentFirst />);
  expect(mockedComponentB).toBeCalledWith({ arg: 5 }, {});
});
