import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ModerationDashboard } from '@/features/moderation/ModerationDashboard';
import { AuthProvider } from '@/context/AuthContext';

describe('ModerationDashboard Component', () => {
  it('renders moderation queue with risk-aware severity indicators when role is Moderator', async () => {
    // Set localStorage role to MODERATOR before rendering
    localStorage.setItem('campusprep_demo_role', 'MODERATOR');

    render(
      <AuthProvider>
        <ModerationDashboard />
      </AuthProvider>
    );

    expect(await screen.findByText('Content Moderation Center')).toBeInTheDocument();
    expect(screen.getByText(/URGENT RISK/i)).toBeInTheDocument();
    expect(screen.getByText(/LEGAL OR NDA VIOLATION/i)).toBeInTheDocument();
  });
});
