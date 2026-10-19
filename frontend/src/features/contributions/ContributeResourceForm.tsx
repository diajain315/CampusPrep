import React, { useState } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/context/AuthContext';

export const ContributeResourceForm: React.FC = () => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [topic, setTopic] = useState('Data Structures & Algorithms');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      await apiClient.submitPreparationResource({
        title: title.trim(),
        url: url.trim(),
        topic,
        description: description.trim(),
        author: {
          stablePseudonym: currentUser?.stablePseudonym || 'FalconCoder_87',
          affiliationLabel: 'Institution-verified email',
        },
        tags: tagsInput
          .split(',')
          .map((t: string) => t.trim())
          .filter(Boolean),
      });
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="cp-card p-10 text-center max-w-lg mx-auto space-y-4">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Resource Published</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          In accordance with the <strong>Post-Publication Moderation Policy</strong>, validated preparation resources publish immediately and are discoverable in the repository.
        </p>
        <div className="pt-2">
          <Button variant="primary" onClick={() => setSubmitted(false)}>
            Share Another Resource
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Resource Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Operating Systems Paging & Virtual Memory Handbook"
          required
          className="cp-input text-xs sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Subject Topic
          </label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="cp-select text-xs font-medium"
            required
          >
            <option value="Data Structures & Algorithms">Data Structures & Algorithms</option>
            <option value="Operating Systems">Operating Systems</option>
            <option value="DBMS">Database Management Systems (DBMS)</option>
            <option value="System Design">System Design</option>
            <option value="Computer Networks">Computer Networks</option>
            <option value="Aptitude & Quant">Aptitude & Quant</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            External URL Link
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/... or https://drive.google.com/..."
            required
            className="cp-input text-xs sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Description & Summary of Contents
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What specific placement topics, problems, or cheat sheets does this cover?"
          required
          className="cp-input text-xs sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Search Tags (Comma Separated)
        </label>
        <input
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="e.g. LeetCode, Virtual Memory, Linux, Thread Safety"
          className="cp-input text-xs"
        />
      </div>

      <div className="flex justify-end pt-3">
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Publish Preparation Resource
        </Button>
      </div>
    </form>
  );
};
