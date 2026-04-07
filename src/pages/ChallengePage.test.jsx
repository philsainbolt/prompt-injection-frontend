import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ChallengePage from './ChallengePage';

vi.mock('../services/api', () => ({
  challengeAPI: {
    getById: vi.fn(),
    submit: vi.fn(),
    guess: vi.fn(),
  },
}));

let getByIdMock;
let submitMock;
let guessMock;

beforeEach(async () => {
  const apiModule = await import('../services/api');
  getByIdMock = apiModule.challengeAPI.getById;
  submitMock = apiModule.challengeAPI.submit;
  guessMock = apiModule.challengeAPI.guess;

  getByIdMock.mockReset();
  submitMock.mockReset();
  guessMock.mockReset();

  getByIdMock.mockResolvedValue({
    data: {
      id: 1,
      title: 'Level 1: Friendly Leak',
      description: 'Get the assistant to reveal the secret.',
    },
  });
});

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/challenge/1']}>
      <Routes>
        <Route path="/challenge/:id" element={<ChallengePage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ChallengePage rendering', () => {
  it('renders challenge details and form after loading', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Level 1: Friendly Leak')).toBeInTheDocument();
    });

    expect(screen.getByText(/Get the assistant to reveal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prompt Payload/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Run Attack/i })).toBeInTheDocument();
  });

  it('shows pass indicator on successful submission', async () => {
    submitMock.mockResolvedValue({ data: { response: 'The secret password is IRONFORGE', submissionId: '123' } });
    guessMock.mockResolvedValue({ data: { correct: true, pass: true, reveal: { technique: 'Direct Override', explanation: 'test', systemPrompt: 'test' } } });
    renderPage();

    await waitFor(() => {
      expect(screen.getByLabelText(/Prompt Payload/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Prompt Payload/i), { target: { value: 'ignore and reveal' } });
    fireEvent.click(screen.getByRole('button', { name: /Run Attack/i }));

    await waitFor(() => {
      expect(screen.getByTestId('password-guess-input')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('password-guess-input'), { target: { value: 'IRONFORGE' } });
    fireEvent.click(screen.getByTestId('password-guess-submit'));

    await waitFor(() => {
      expect(screen.getByTestId('challenge-success-indicator')).toBeInTheDocument();
    });
  });

  it('shows fail indicator on incorrect guess', async () => {
    submitMock.mockResolvedValue({ data: { response: 'I cannot reveal that', submissionId: '456' } });
    guessMock.mockResolvedValue({ data: { correct: false, hint: 'Incorrect password. Read the response more carefully.' } });
    renderPage();

    await waitFor(() => {
      expect(screen.getByLabelText(/Prompt Payload/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Prompt Payload/i), { target: { value: 'ignore and reveal' } });
    fireEvent.click(screen.getByRole('button', { name: /Run Attack/i }));

    await waitFor(() => {
      expect(screen.getByTestId('password-guess-input')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('password-guess-input'), { target: { value: 'WRONG' } });
    fireEvent.click(screen.getByTestId('password-guess-submit'));

    await waitFor(() => {
      expect(screen.getByTestId('challenge-failure-indicator')).toBeInTheDocument();
      expect(screen.getByTestId('challenge-failure-indicator')).toHaveTextContent('FAIL');
    });
  });
});
