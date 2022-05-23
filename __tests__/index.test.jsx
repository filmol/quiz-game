import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import Home from '../pages/index';
import Question from '../components/question';

describe('Home', () => {
  it('Renders the header', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', {
      name: 'Welcome to Trivia',
    });
    expect(heading).toBeInTheDocument();
  });

  it('Renders the Play button', () => {
    render(<Home />);

    const addButton = screen.getByTestId('playBtn');
    expect(addButton).toBeInTheDocument();
  });

  it('Timer renders after game have started', async () => {
    render(<Home />);

    await act(async () => {
      const addButton = screen.getByTestId('playBtn');
      addButton.click();
    });
    expect(screen.getByTestId('timer')).toBeInTheDocument();
  });
});

describe('Question Component', () => {
  it('Renders the main question and options container ', () => {
    render(<Question />);

    expect(screen.getByTestId('mainQuestion')).toBeInTheDocument();
    expect(screen.getByTestId('optionsContainer')).toBeInTheDocument();
  });

  it('Lifeline buttons renders and are disabled after click ', async () => {
    render(<Question />);

    let addSecondsBtn = screen.getByTestId('addSecondsBtn');
    let removeHalfBtn = screen.getByTestId('removeHalfBtn');
    expect(addSecondsBtn).toBeInTheDocument();
    expect(removeHalfBtn).toBeInTheDocument();

    await act(async () => {
      addSecondsBtn.click();
      removeHalfBtn.click();
    });

    expect(addSecondsBtn).toBeDisabled();
    expect(removeHalfBtn).toBeDisabled();
  });
});
