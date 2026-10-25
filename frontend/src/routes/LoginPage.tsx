import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { UserRole } from '@/types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, switchRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      login(email);
      setIsSubmitting(false);
      navigate('/workspace');
    }, 150);
  };

  const handleQuickPersona = (role: UserRole) => {
    switchRole(role);
    navigate('/workspace');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sign In to CampusPrep</h1>
        <p className="text-xs text-slate-500">
          Campus Placement Intelligence Platform • Dhirubhai Ambani University
        </p>
      </div>

      <div className="cp-card p-6 sm:p-8 bg-white border border-slate-200 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@dau.ac.in or personal email"
                required
                className="cp-input pl-9 text-xs sm:text-sm"
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Tip: Enter an @dau.ac.in email to unlock Verified Contributor permissions.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Account Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="cp-input pl-9 text-xs sm:text-sm"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Sign In to Workspace
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-100">
          <p className="text-center text-xs text-slate-500 mb-3 font-semibold uppercase tracking-wider text-[10px]">
            Academic Demo: One-Click Persona Login
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickPersona('VERIFIED_CONTRIBUTOR')}
              className="p-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg font-medium border border-emerald-200 transition-colors text-left"
            >
              <span className="block font-bold">Verified Contributor</span>
              <span className="text-[10px] text-emerald-600">@dau.ac.in Contributor</span>
            </button>
            <button
              onClick={() => handleQuickPersona('ALUMNI_CONTRIBUTOR')}
              className="p-2 bg-purple-50 text-purple-800 hover:bg-purple-100 rounded-lg font-medium border border-purple-200 transition-colors text-left"
            >
              <span className="block font-bold">Alumni Contributor</span>
              <span className="text-[10px] text-purple-600">Company Reviews</span>
            </button>
            <button
              onClick={() => handleQuickPersona('MODERATOR')}
              className="p-2 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-lg font-medium border border-amber-200 transition-colors text-left"
            >
              <span className="block font-bold">Moderator</span>
              <span className="text-[10px] text-amber-600">Moderation Queue Access</span>
            </button>
            <button
              onClick={() => handleQuickPersona('REGISTERED_USER')}
              className="p-2 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-lg font-medium border border-slate-200 transition-colors text-left"
            >
              <span className="block font-bold">Registered User</span>
              <span className="text-[10px] text-slate-600">Personal Workspace Only</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 pt-2">
          New to CampusPrep?{' '}
          <Link to="/register" className="text-brand-600 hover:text-brand-800 font-semibold underline">
            Register Account
          </Link>
        </div>
      </div>

      <div className="p-3 bg-slate-100/70 border border-slate-200 rounded-xl text-[11px] text-slate-500 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
        <span>
          <strong>Backend Boundary Notice:</strong> This preview uses local development adapters. Cryptographic sessions and JWT authentication will connect to Django REST Framework in the backend phase.
        </span>
      </div>
    </div>
  );
};
