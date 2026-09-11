import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Header from './components/Header';
import { themes } from './theme';

jest.mock('axios', () => {
  const request = jest.fn(() => Promise.resolve({ data: { results: [], genres: [] } }));
  const client = { get: request };

  return {
    __esModule: true,
    default: {
      create: jest.fn(() => client),
      get: request,
    },
  };
});

test('renders the current Watch Baba header shell', () => {
  render(
    <ThemeProvider theme={themes.default}>
      <BrowserRouter>
        <Header toggleSidebar={() => {}} toggleTopbar={() => {}} />
      </BrowserRouter>
    </ThemeProvider>,
  );

  expect(screen.getByText('watchbaba')).toBeInTheDocument();
});
