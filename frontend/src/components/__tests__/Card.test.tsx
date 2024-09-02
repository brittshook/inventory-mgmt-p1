import { render, screen } from '@testing-library/react';
import { Card } from '../card/Card';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent } from '@testing-library/react';

test('renders Card component with title and subtitle', () => {
  render(
    <MemoryRouter>
      <Card
        title="Test Title"
        subtitle="Test Subtitle"
        loaded={false}
        path="/test-path"
        updateItem={jest.fn()}
        deleteItem={jest.fn()}
        id={1}
      />
    </MemoryRouter>
  );

  expect(screen.getByText('Test Title')).toBeDefined();
  expect(screen.getByText('Test Subtitle')).toBeDefined();
});

test('opens the edit modal', () => {
  const { getByTestId, queryByRole } = render(
    <MemoryRouter>
      <Card
        title="Test Title"
        subtitle="Test Subtitle"
        loaded={false}
        path="/test-path"
        updateItem={jest.fn()}
        deleteItem={jest.fn()}
        id={1}
        testId="test-card"
      />
    </MemoryRouter>
  );

  fireEvent.click(getByTestId('edit-card-button'));

  expect(queryByRole('dialog')).toBeDefined();
});

test('calls the deleteItem function', async () => {
  const deleteItemMock = jest.fn();

  render(
    <MemoryRouter>
      <Card
        title="Test Title"
        subtitle="Test Subtitle"
        loaded={false}
        path="/test-path"
        updateItem={jest.fn()}
        deleteItem={deleteItemMock}
        id={1}
        testId="test-card"
      />
    </MemoryRouter>
  );

  const ellipsisButton = screen.getByTestId('card-ellipsis-button');
  fireEvent.mouseOver(ellipsisButton);

  const deleteAction = await screen.findByText('Delete');
  fireEvent.click(deleteAction);

  expect(deleteItemMock).toHaveBeenCalledWith(1);
});

test('handles errors with the deleteItem function', async () => {
  const deleteItemMock = jest.fn();
  deleteItemMock.mockRejectedValue(() => new Error());

  render(
    <MemoryRouter>
      <Card
        title="Test Title"
        subtitle="Test Subtitle"
        loaded={false}
        path="/test-path"
        updateItem={jest.fn()}
        deleteItem={deleteItemMock}
        id={1}
        testId="test-card"
      />
    </MemoryRouter>
  );

  const ellipsisButton = screen.getByTestId('card-ellipsis-button');
  fireEvent.mouseOver(ellipsisButton);

  const deleteAction = await screen.findByText('Delete');
  fireEvent.click(deleteAction);

  expect(deleteItemMock).toHaveBeenCalledWith(1);
  expect(screen.getByText("Test Title")).toBeDefined();
});
