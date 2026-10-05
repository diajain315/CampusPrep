import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PlusCircle } from 'lucide-react';
import { PreparationResource } from '@/types';
import { apiClient } from '@/lib/api/client';
import { ResourceCard } from '@/features/resources/ResourceCard';
import { ResourceFilters } from '@/features/resources/ResourceFilters';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const ResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<PreparationResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('ALL');

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getResources(
          selectedTopic !== 'ALL' ? selectedTopic : undefined,
          searchQuery || undefined
        );
        setResources(data);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [searchQuery, selectedTopic]);

  const topics = [
    'Data Structures & Algorithms',
    'Operating Systems',
    'DBMS',
    'System Design',
    'Computer Networks',
    'Aptitude & Quant',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Preparation Resources' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-purple-600" />
            Curated Preparation Resources
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Community-validated DSA practice sheets, core subject cheat sheets, and system design notes.
          </p>
        </div>

        <Link to="/contribute">
          <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Share a Resource
          </Button>
        </Link>
      </div>

      {/* Filter and Search */}
      <ResourceFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTopic={selectedTopic}
        onTopicChange={setSelectedTopic}
        topics={topics}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>
          Showing <strong>{resources.length}</strong> resources
        </span>
        {(searchQuery || selectedTopic !== 'ALL') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTopic('ALL');
            }}
            className="text-brand-600 hover:text-brand-800 underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Resources Grid */}
      {loading ? (
        <LoadingSpinner label="Fetching preparation resources..." className="py-20" />
      ) : resources.length === 0 ? (
        <EmptyState
          title="No resources found"
          description="We couldn't find any preparation resources matching your topic or search criteria."
          action={
            <Link to="/contribute">
              <Button variant="primary" size="sm">
                Share a Preparation Resource
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res) => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </div>
      )}
    </div>
  );
};
