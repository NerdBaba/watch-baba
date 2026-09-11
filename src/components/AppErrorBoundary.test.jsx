import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import AppErrorBoundary from './AppErrorBoundary';

test('renders a recoverable fallback when a route throws', () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  const BrokenRoute = () => {
    throw new Error('route failed');
  };

  render(
    <AppErrorBoundary>
      <BrokenRoute />
    </AppErrorBoundary>,
  );

  expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong.');
  expect(screen.getByRole('button', { name: 'Reload page' })).toBeInTheDocument();
  consoleError.mockRestore();
});
