import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CompanyCard } from '@/features/companies/CompanyCard';
import { Company } from '@/types';

const mockCompany: Company = {
  id: 'test-1',
  name: 'Test Corp',
  slug: 'test-corp',
  industry: 'FinTech Engineering',
  overview: 'Building low-latency algorithmic trading infrastructure.',
  totalHistoricalDrives: 4,
  averageInterviewDifficulty: 'HARD',
  alumniOverallRating: 4.5,
};

describe('CompanyCard Component', () => {
  it('renders company name, industry, and overview', () => {
    render(
      <BrowserRouter>
        <CompanyCard company={mockCompany} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Corp')).toBeInTheDocument();
    expect(screen.getByText('FinTech Engineering')).toBeInTheDocument();
    expect(
      screen.getByText('Building low-latency algorithmic trading infrastructure.')
    ).toBeInTheDocument();
  });

  it('displays difficulty badge and historical drive counts', () => {
    render(
      <BrowserRouter>
        <CompanyCard company={mockCompany} />
      </BrowserRouter>
    );

    expect(screen.getByText(/HARD Difficulty/i)).toBeInTheDocument();
    expect(screen.getByText(/Drives at DAU/i)).toBeInTheDocument();
    expect(screen.getByText(/4.5/)).toBeInTheDocument();
  });

  it('links to company detail view', () => {
    render(
      <BrowserRouter>
        <CompanyCard company={mockCompany} />
      </BrowserRouter>
    );

    const link = screen.getByRole('link', { name: /View Drive Timeline/i });
    expect(link).toHaveAttribute('href', '/companies/test-corp');
  });
});
