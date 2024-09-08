import { render, screen } from '@testing-library/react';
import { vitestAutoMock } from 'src';
import ComponentFirst from 'src/__tests__/mocking-react-component-default-import/component-first';

const ComponentFirstMock = vitestAutoMock(ComponentFirst);

it('mocking-react-component-default-import', () => {
  ComponentFirstMock.mockImplementation(() => <div>ComponentFirstMock</div>);
  render(<ComponentFirstMock/>);
  expect(screen.getByText('ComponentFirstMock')).toBeVisible();
});
