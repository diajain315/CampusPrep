import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institutionalEmail, setInstitutionalEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      login(institutionalEmail || email);
      setIsSubmitting(false);
      navigate('/workspace');
    }, 150);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-md">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Registered User Account</h1>
        <p className="text-xs text-slate-500">
          Campus Placement Intelligence Platform • Dhirubhai Ambani University
        </p>
      </div>

      <div className="cp-card p-6 sm:p-8 bg-white border border-slate-200 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Account Login Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="personal@gmail.com"
                required
                className="cp-input pl-9 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Institutional Email (@dau.ac.in, optional during registration)
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={institutionalEmail}
                onChange={(e) => setInstitutionalEmail(e.target.value)}
                placeholder="202201xxx@dau.ac.in"
                className="cp-input pl-9 text-xs sm:text-sm"
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Required later to author interview experiences or reviews.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Create Password
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

          <div className="p-3 bg-brand-50 border border-brand-200 rounded-lg text-[11px] text-brand-900 leading-relaxed">
            <strong>Pseudonymity Assurance:</strong> Your real name and institutional email are protected. Upon verification, the platform assigns you a deterministic <em>Stable Pseudonym</em> (e.g. <code>CampusExplorer_42</code>).
          </div>

          <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Create Account & Enter Platform
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already registered?{' '}
          <Link to="/login" className="text-brand-600 hover:text-brand-800 font-semibold underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
