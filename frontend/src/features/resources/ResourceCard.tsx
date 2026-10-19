import React, { useState } from 'react';
import { ExternalLink, Bookmark, BookmarkCheck, ShieldCheck } from 'lucide-react';
import { PreparationResource } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/context/AuthContext';

export interface ResourceCardProps {
  resource: PreparationResource;
  initialBookmarked?: boolean;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  initialBookmarked = false,
}) => {
  const { role } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isToggling, setIsToggling] = useState(false);

  const handleBookmarkToggle = async () => {
    if (role === 'PUBLIC_VISITOR') {
      alert('Please switch to a Registered User or Verified Contributor role to save bookmarks.');
      return;
    }
    setIsToggling(true);
    try {
      const res = await apiClient.toggleBookmark({
        contentType: 'RESOURCE',
        objectId: resource.id,
        title: resource.title,
        subtitle: resource.topic,
        link: resource.url,
      });
      setIsBookmarked(res.bookmarked);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="cp-card p-5 flex flex-col justify-between hover:border-slate-300 transition-all">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <Badge variant="brand" size="sm">
            {resource.topic}
          </Badge>
          <button
            onClick={handleBookmarkToggle}
            disabled={isToggling}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark resource'}
            className={`p-1.5 rounded-lg border transition-colors ${
              isBookmarked
                ? 'bg-amber-50 border-amber-200 text-amber-600'
                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
            title={isBookmarked ? 'Bookmarked in Workspace' : 'Save to Personal Workspace'}
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-2 line-clamp-2">
          {resource.title}
        </h3>

        <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
          {resource.description}
        </p>

        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {resource.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-mono text-slate-700 font-medium">
            {resource.author.stablePseudonym}
          </span>
        </div>

        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg border border-brand-200/60 transition-colors"
        >
          <span>Open Resource</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
