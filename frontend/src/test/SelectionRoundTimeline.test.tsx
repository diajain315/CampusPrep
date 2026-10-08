import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SelectionRoundTimeline } from '@/features/companies/SelectionRoundTimeline';
import { SelectionRound } from '@/types';

const mockRounds: SelectionRound[] = [
  {
    id: 'r-2',
    campusDriveId: 'd-1',
    roundNumber: 2,
    roundName: 'Technical Interview 1',
    roundType: 'TECHNICAL_INTERVIEW',
    difficulty: 'HARD',
    durationMinutes: 60,
    topicsAssessed: ['Trie', 'Dynamic Programming'],
    description: 'Deep dive into data structures.',
  },
  {
    id: 'r-1',
    campusDriveId: 'd-1',
    roundNumber: 1,
    roundName: 'Online Assessment',
    roundType: 'ONLINE_ASSESSMENT',
    difficulty: 'MEDIUM',
    durationMinutes: 90,
    topicsAssessed: ['Arrays', 'Strings'],
    description: '3 coding problems on HackerEarth.',
  },
];

describe('SelectionRoundTimeline Component', () => {
  it('enforces contiguous 1..N order even when provided out of order', () => {
    render(<SelectionRoundTimeline rounds={mockRounds} />);

    // Round 1 should be displayed first
    const headings = screen.getAllByRole('heading', { level: 4 });
    expect(headings[0]).toHaveTextContent('Round 1: Online Assessment');
    expect(headings[1]).toHaveTextContent('Round 2: Technical Interview 1');
  });

  it('renders topics assessed and duration badges', () => {
    render(<SelectionRoundTimeline rounds={mockRounds} />);

    expect(screen.getByText('Trie')).toBeInTheDocument();
    expect(screen.getByText('Dynamic Programming')).toBeInTheDocument();
    expect(screen.getByText('60 mins')).toBeInTheDocument();
    expect(screen.getByText('90 mins')).toBeInTheDocument();
  });

  it('renders empty fallback when no rounds are configured', () => {
    render(<SelectionRoundTimeline rounds={[]} />);
    expect(
      screen.getByText(/Selection rounds are being configured/i)
    ).toBeInTheDocument();
  });
});
