import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Platform Branding & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-md bg-brand-600 flex items-center justify-center text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 text-sm tracking-tight">CampusPrep DAU</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Preserving and surfacing historical placement intelligence, selection timelines, and interview experiences for Dhirubhai Ambani University students.
            </p>
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero PII exposure & Stable Pseudonyms</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">Placement Intel</h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/companies" className="hover:text-brand-600 transition-colors">
                  Recruiting Companies
                </Link>
              </li>
              <li>
                <Link to="/experiences" className="hover:text-brand-600 transition-colors">
                  Interview Experiences
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-brand-600 transition-colors">
                  Preparation Resources
                </Link>
              </li>
              <li>
                <Link to="/workspace" className="hover:text-brand-600 transition-colors">
                  Personal Workspace
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic & Product Boundaries */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">Academic Reference</h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Course: <strong className="text-slate-800">IT643 — Software Design and Testing</strong>
              <br />
              Instructor: Prof. Ankush Chander
              <br />
              Target Institution: Dhirubhai Ambani University (DAU), Gandhinagar
            </p>
            <p className="text-[11px] text-slate-500 pt-1">
              <strong>Boundary Notice:</strong> This platform is exclusively for student placement intelligence and peer preparation. It is not an ATS and does not replace official Placement Cell operations.
            </p>
          </div>

          {/* Col 4: Guidelines & Privacy */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">Community Guardrails</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-600">
              <li>• Institutional email verification via @dau.ac.in</li>
              <li>• Pre-publication review on all interview logs</li>
              <li>• Strict continuous round numbering (1..N)</li>
              <li>• Whitelisted serialization preventing data leaks</li>
              <li>• Author identity masked with Stable Pseudonyms</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <p>© {new Date().getFullYear()} Campus Placement Intelligence Platform. Built for Dhirubhai Ambani University cohorts.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" /> for DAU aspirants
          </p>
        </div>
      </div>
    </footer>
  );
};
