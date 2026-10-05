import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Star, ArrowUpRight, Award } from 'lucide-react';
import { Company, Difficulty } from '@/types';
import { Badge } from '@/components/ui/Badge';

export interface CompanyCardProps {
  company: Company;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const difficultyVariants: Record<Difficulty, 'success' | 'warning' | 'danger'> = {
    EASY: 'success',
    MEDIUM: 'warning',
    HARD: 'danger',
  };

  return (
    <div className="cp-card-interactive flex flex-col justify-between p-5 group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700 font-bold text-base group-hover:bg-brand-50 group-hover:border-brand-200 group-hover:text-brand-700 transition-colors">
              {company.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors flex items-center gap-1.5">
                {company.name}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1">{company.industry}</p>
            </div>
          </div>
          <Badge variant={difficultyVariants[company.averageInterviewDifficulty]} size="sm">
            {company.averageInterviewDifficulty} Difficulty
          </Badge>
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {company.overview}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-2 py-2.5 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>
              <strong>{company.totalHistoricalDrives}</strong> Drives at DAU
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>
              <strong>{company.alumniOverallRating ?? '4.2'}</strong> / 5 Alumni Rating
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-brand-500" />
          Verified Intel
        </span>
        <Link
          to={`/companies/${company.slug}`}
          className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform"
        >
          <span>View Drive Timeline</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
