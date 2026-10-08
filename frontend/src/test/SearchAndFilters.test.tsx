import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchInput } from '@/components/ui/SearchInput';
import { CompanyFilters } from '@/features/companies/CompanyFilters';

describe('Search and Filter Components', () => {
  it('updates SearchInput on typing and handles clear button', () => {
    const handleChange = vi.fn();
    const handleClear = vi.fn();

    const { rerender } = render(
      <SearchInput
        value=""
        onChange={handleChange}
        onClear={handleClear}
        placeholder="Search companies..."
      />
    );

    const input = screen.getByPlaceholderText('Search companies...');
    fireEvent.change(input, { target: { value: 'Amazon' } });
    expect(handleChange).toHaveBeenCalledWith('Amazon');

    // Rerender with value present to test clear button
    rerender(
      <SearchInput
        value="Amazon"
        onChange={handleChange}
        onClear={handleClear}
        placeholder="Search companies..."
      />
    );

    const clearBtn = screen.getByLabelText('Clear search');
    fireEvent.click(clearBtn);
    expect(handleChange).toHaveBeenCalledWith('');
    expect(handleClear).toHaveBeenCalled();
  });

  it('triggers industry and difficulty filter changes in CompanyFilters', () => {
    const handleIndustryChange = vi.fn();
    const handleDifficultyChange = vi.fn();
    const handleSortChange = vi.fn();

    render(
      <CompanyFilters
        searchQuery=""
        onSearchChange={vi.fn()}
        selectedIndustry="ALL"
        onIndustryChange={handleIndustryChange}
        selectedDifficulty="ALL"
        onDifficultyChange={handleDifficultyChange}
        sortBy="DRIVES_DESC"
        onSortChange={handleSortChange}
        industries={['Cloud', 'FinTech']}
      />
    );

    const industrySelect = screen.getByLabelText('Filter by Industry');
    fireEvent.change(industrySelect, { target: { value: 'FinTech' } });
    expect(handleIndustryChange).toHaveBeenCalledWith('FinTech');

    const difficultySelect = screen.getByLabelText('Filter by Difficulty');
    fireEvent.change(difficultySelect, { target: { value: 'HARD' } });
    expect(handleDifficultyChange).toHaveBeenCalledWith('HARD');
  });
});
