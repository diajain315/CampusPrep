import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Building2,
  FileText,
  BookOpen,
  BookmarkCheck,
  ShieldAlert,
  PlusCircle,
  Menu,
  X,
  UserCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { VerificationModal } from '@/features/authentication/VerificationModal';

export const Navbar: React.FC = () => {
  const { currentUser, role, switchRole, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const navLinks = [
    { label: 'Companies', path: '/companies', icon: <Building2 className="w-4 h-4" /> },
    { label: 'Interview Experiences', path: '/experiences', icon: <FileText className="w-4 h-4" /> },
    { label: 'Preparation Resources', path: '/resources', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Workspace', path: '/workspace', icon: <BookmarkCheck className="w-4 h-4" /> },
  ];

  const roleLabels: Record<UserRole, { title: string; color: string; desc: string }> = {
    PUBLIC_VISITOR: { title: 'Public Visitor', color: 'bg-slate-100 text-slate-700', desc: 'Read-only access' },
    REGISTERED_USER: { title: 'Registered User', color: 'bg-blue-50 text-blue-700', desc: 'Workspace & Bookmarks' },
    VERIFIED_CONTRIBUTOR: { title: 'Verified Contributor', color: 'bg-emerald-50 text-emerald-800', desc: '@dau.ac.in verified' },
    ALUMNI_CONTRIBUTOR: { title: 'Alumni Contributor', color: 'bg-purple-50 text-purple-800', desc: 'Company reviews qualified' },
    MODERATOR: { title: 'Moderator', color: 'bg-amber-50 text-amber-800', desc: 'Content triage & revisions' },
    ADMINISTRATOR: { title: 'Administrator', color: 'bg-rose-50 text-rose-800', desc: 'Full institutional authority' },
  };

  const isModeratorOrAdmin = role === 'MODERATOR' || role === 'ADMINISTRATOR';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand Title */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-2.5 group">
                <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-sm group-hover:bg-brand-700 transition-colors">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                    CampusPrep
                    <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                      DAU
                    </span>
                  </span>
                  <span className="block text-[11px] font-medium text-slate-500 -mt-0.5">
                    Placement Intelligence Platform
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const isActive = location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs lg:text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-100 text-brand-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {/* Moderation Link (for Staff roles) */}
              {isModeratorOrAdmin && (
                <Link
                  to="/moderation"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs lg:text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/moderation')
                      ? 'bg-amber-100 text-amber-900 font-semibold'
                      : 'text-amber-800 hover:bg-amber-50'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Moderation</span>
                </Link>
              )}
            </nav>

            {/* Right Action Area: Role Switcher & Contribute CTA */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Contribute Button */}
              <Link
                to="/contribute"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 shadow-xs transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Contribute</span>
              </Link>

              {/* Interactive Role Switcher for Demo & Academic Evaluation */}
              <div className="relative">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200 transition-all ${roleLabels[role].color}`}
                  title="Switch User Role to test permissions"
                  aria-expanded={roleDropdownOpen}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="font-semibold">{roleLabels[role].title}</span>
                  <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn">
                    <div className="px-3 py-1.5 border-b border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-800 uppercase tracking-wider">
                        Interactive RBAC Role Tester
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Switch persona to evaluate permissions and public vs private views.
                      </p>
                    </div>

                    <div className="p-1 space-y-0.5">
                      {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            switchRole(r);
                            setRoleDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-xs flex flex-col transition-colors ${
                            role === r ? 'bg-brand-50 text-brand-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{roleLabels[r].title}</span>
                            {role === r && <span className="text-[10px] text-brand-600 font-bold">Active</span>}
                          </div>
                          <span className="text-[10px] text-slate-400 font-normal">{roleLabels[r].desc}</span>
                        </button>
                      ))}
                    </div>

                    {role === 'REGISTERED_USER' && (
                      <div className="p-2 border-t border-slate-100 bg-slate-50/60 rounded-b-xl">
                        <button
                          onClick={() => {
                            setRoleDropdownOpen(false);
                            setIsVerificationModalOpen(true);
                          }}
                          className="w-full text-center text-xs text-brand-600 hover:text-brand-800 font-semibold py-1 inline-flex items-center justify-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          Verify @dau.ac.in Email
                        </button>
                      </div>
                    )}

                    {role !== 'PUBLIC_VISITOR' && (
                      <div className="p-2 border-t border-slate-100">
                        <div className="px-1 text-[11px] text-slate-500 mb-1">
                          Author: <strong className="text-slate-800">{currentUser?.stablePseudonym}</strong>
                        </div>
                        <button
                          onClick={() => {
                            logout();
                            setRoleDropdownOpen(false);
                          }}
                          className="w-full text-left px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded"
                        >
                          Sign Out (Return to Visitor)
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`px-2 py-1 rounded-full text-xs font-semibold ${roleLabels[role].color}`}
              >
                {roleLabels[role].title.split(' ')[0]}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Tray */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 animate-fadeIn">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  location.pathname.startsWith(link.path)
                    ? 'bg-brand-50 text-brand-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}

            {isModeratorOrAdmin && (
              <Link
                to="/moderation"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-amber-800 bg-amber-50"
              >
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Moderation Queue</span>
              </Link>
            )}

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/contribute"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-1.5 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Contribute Intelligence</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Institutional Email Verification Modal */}
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
      />
    </>
  );
};
