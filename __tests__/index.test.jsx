import { render, screen } from '@testing-library/react';
import Home from '../pages/index';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';

describe('Home', () => {
  it('Renders the header', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', {
      name: 'Welcome to Trivia',
    });

    expect(heading).toBeInTheDocument();
  });

  it('Clicks the the Play button', async () => {
    render(<Home />);
    await act(() => {
      // events that update the state (act)
      const addButton = screen.getByTestId('playBtn');
      try {
        addButton.click();
      } catch (error) {}
      expect(addButton).toBeInTheDocument(); // TODO - Change to lifeline buttons
    });
  });

  it('Renders the Play button', async () => {
    render(<Home />);
    const addButton = screen.getByTestId('playBtn');
    expect(addButton).toBeInTheDocument();
  });
});
