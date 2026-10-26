import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VerificationModal } from '@/features/authentication/VerificationModal';
import { AuthProvider } from '@/context/AuthContext';

describe('VerificationModal Component', () => {
  it('validates institutional email domain', async () => {
    render(
      <AuthProvider>
        <VerificationModal isOpen={true} onClose={vi.fn()} />
      </AuthProvider>
    );

    const emailInput = screen.getByLabelText(/Institutional Email Address/i);
    const submitBtn = screen.getByRole('button', { name: /Send 6-Digit OTP/i });

    // Submit invalid domain
    fireEvent.change(emailInput, { target: { value: 'user@gmail.com' } });
    fireEvent.click(submitBtn);

    expect(
      await screen.findByText(/Email must strictly end with @dau.ac.in/i)
    ).toBeInTheDocument();
  });

  it('accepts valid @dau.ac.in domain and progresses to OTP challenge', async () => {
    render(
      <AuthProvider>
        <VerificationModal isOpen={true} onClose={vi.fn()} />
      </AuthProvider>
    );

    const emailInput = screen.getByLabelText(/Institutional Email Address/i);
    const submitBtn = screen.getByRole('button', { name: /Send 6-Digit OTP/i });

    fireEvent.change(emailInput, { target: { value: '202201100@dau.ac.in' } });
    fireEvent.click(submitBtn);

    // Should transition to OTP input step
    expect(
      await screen.findByLabelText(/Enter 6-Digit Challenge OTP/i)
    ).toBeInTheDocument();
  });
});
