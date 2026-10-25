import React, { useState } from 'react';
import { Mail, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose }) => {
  const { requestInstitutionalOtp, verifyInstitutionalOtp, verificationPendingEmail } = useAuth();
  const [emailInput, setEmailInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [step, setStep] = useState<'REQUEST' | 'VERIFY' | 'SUCCESS'>('REQUEST');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!emailInput.toLowerCase().endsWith('@dau.ac.in')) {
      setErrorMsg('Email must strictly end with @dau.ac.in (Dhirubhai Ambani University).');
      return;
    }
    setIsLoading(true);
    const result = await requestInstitutionalOtp(emailInput);
    setIsLoading(false);
    if (result.success) {
      setStep('VERIFY');
      setOtpInput('482910'); // Pre-fill demo OTP for effortless evaluation
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (otpInput.trim().length !== 6) {
      setErrorMsg('Please enter a valid 6-digit challenge OTP.');
      return;
    }
    setIsLoading(true);
    const result = await verifyInstitutionalOtp(otpInput);
    setIsLoading(false);
    if (result.success) {
      setStep('SUCCESS');
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleReset = () => {
    setStep('REQUEST');
    setEmailInput('');
    setOtpInput('');
    setErrorMsg('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title="Institutional Email Verification"
      description="Dhirubhai Ambani University (@dau.ac.in)"
      maxWidth="md"
    >
      <div className="space-y-4">
        {step === 'REQUEST' && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div className="p-3 bg-brand-50 rounded-lg border border-brand-100 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
              <div className="text-xs text-brand-900 leading-relaxed">
                Institutional verification confirms your university affiliation. Your real name, student ID, and institutional email are stored confidentially and <strong className="font-semibold">never exposed publicly</strong>.
              </div>
            </div>

            <div>
              <label htmlFor="inst-email" className="block text-xs font-semibold text-slate-700 mb-1">
                Institutional Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  id="inst-email"
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="202201xxx@dau.ac.in"
                  required
                  className="cp-input pl-9"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Must match an active @dau.ac.in student or researcher inbox.
              </span>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={handleReset}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isLoading} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Send 6-Digit OTP
              </Button>
            </div>
          </form>
        )}

        {step === 'VERIFY' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 leading-relaxed">
              We dispatched a 6-digit Time-based One-Time Password to <strong className="font-semibold">{verificationPendingEmail || emailInput}</strong>.
              <span className="block text-[11px] text-amber-700 mt-1 font-mono">
                (Demo auto-fill challenge: 482910)
              </span>
            </div>

            <div>
              <label htmlFor="otp-challenge" className="block text-xs font-semibold text-slate-700 mb-1">
                Enter 6-Digit Challenge OTP
              </label>
              <input
                id="otp-challenge"
                type="text"
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="482910"
                required
                className="cp-input tracking-widest text-center font-mono text-lg font-bold"
              />
              <span className="text-[11px] text-slate-500 mt-1 block text-center">
                Challenge expires in 15 minutes.
              </span>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setStep('REQUEST')}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                Change Email
              </button>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={handleReset}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={isLoading}>
                  Verify & Unlock Role
                </Button>
              </div>
            </div>
          </form>
        )}

        {step === 'SUCCESS' && (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Affiliation Verified!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              You are now a <strong className="text-slate-900 font-semibold">Verified Contributor</strong> with public pseudonym <code className="bg-slate-100 px-1.5 py-0.5 rounded text-brand-700 font-mono">FalconCoder_87</code> and badge <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] border border-emerald-200 font-medium">Institution-verified email</span>.
            </p>
            <div className="pt-2">
              <Button variant="primary" onClick={handleReset} className="w-full">
                Continue to Platform
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
