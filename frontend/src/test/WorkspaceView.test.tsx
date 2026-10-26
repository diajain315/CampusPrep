import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { WorkspaceView } from '@/features/workspace/WorkspaceView';
import { AuthProvider } from '@/context/AuthContext';

describe('WorkspaceView Component', () => {
  it('renders personal preparation checklist and supports adding tasks', async () => {
    localStorage.setItem('campusprep_demo_role', 'VERIFIED_CONTRIBUTOR');

    render(
      <AuthProvider>
        <BrowserRouter>
          <WorkspaceView />
        </BrowserRouter>
      </AuthProvider>
    );

    // Verify workspace title and privacy badge
    expect(await screen.findByText('Personal Placement Workspace')).toBeInTheDocument();
    expect(screen.getByText('Preparation Tasks')).toBeInTheDocument();

    // Find input and add task
    const input = screen.getByPlaceholderText(/Add a new preparation task/i);
    const addBtn = screen.getByRole('button', { name: /Add Task/i });

    fireEvent.change(input, { target: { value: 'Revise Segment Trees for OA' } });
    fireEvent.click(addBtn);

    expect(await screen.findByText('Revise Segment Trees for OA')).toBeInTheDocument();
  });
});
