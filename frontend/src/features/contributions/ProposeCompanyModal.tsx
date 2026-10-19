import React, { useState } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export interface ProposeCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProposeCompanyModal: React.FC<ProposeCompanyModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setName('');
    setIndustry('');
    setWebsiteUrl('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Propose New Recruiting Company"
      description="Approved Decision 1: Curated directory prevents fragmented duplicates"
      maxWidth="md"
    >
      {submitted ? (
        <div className="text-center py-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Proposal Dispatched</h3>
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
            Thank you! Your suggestion for <strong className="font-semibold text-slate-800">{name}</strong> has been forwarded to the university placement admin queue. Once verified against past DAU records, it will appear in the directory.
          </p>
          <div className="pt-2">
            <Button variant="primary" onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Company Legal Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Goldman Sachs, Atlassian, De Shaw"
              required
              className="cp-input text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Industry / Sector
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g. FinTech & High Frequency Trading"
              required
              className="cp-input text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Official Careers / Corporate URL
            </label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://www.company.com/careers"
              className="cp-input text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Submit Proposal
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
