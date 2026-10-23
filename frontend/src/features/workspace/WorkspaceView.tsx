import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookmarkCheck,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Calendar,
  Building2,
  ExternalLink,
  Lock,
  Sparkles,
} from 'lucide-react';
import { PreparationTask, Bookmark } from '@/types';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const WorkspaceView: React.FC = () => {
  const { role, currentUser } = useAuth();
  const [tasks, setTasks] = useState<PreparationTask[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  // New task draft fields
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskFilter, setTaskFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');

  useEffect(() => {
    if (role === 'PUBLIC_VISITOR') {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [fetchedTasks, fetchedBookmarks] = await Promise.all([
          apiClient.getWorkspaceTasks(),
          apiClient.getBookmarks(),
        ]);
        setTasks(fetchedTasks);
        setBookmarks(fetchedBookmarks);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [role]);

  // Task actions
  const handleToggleTask = async (taskId: string) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
    );
    await apiClient.toggleTaskCompletion(taskId);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsAddingTask(true);
    try {
      const created = await apiClient.createPreparationTask({
        title: newTitle.trim(),
        targetDate: newDate || undefined,
        companyName: newCompany.trim() || undefined,
      });
      setTasks((prev) => [created, ...prev]);
      setNewTitle('');
      setNewDate('');
      setNewCompany('');
    } finally {
      setIsAddingTask(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    await apiClient.deletePreparationTask(taskId);
  };

  const handleRemoveBookmark = async (bookmark: Bookmark) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== bookmark.id));
    await apiClient.toggleBookmark({
      contentType: bookmark.contentType,
      objectId: bookmark.objectId,
      title: bookmark.title,
      subtitle: bookmark.subtitle,
      link: bookmark.link,
    });
  };

  if (role === 'PUBLIC_VISITOR') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="cp-card p-10 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Personal Workspace is Private</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Personal Preparation Tasks and Bookmarks are isolated per student account. Please sign in or switch your demo persona from the navigation bar to access the workspace.
          </p>
          <div className="pt-2">
            <Link to="/login">
              <Button variant="primary">Sign In / Switch Persona</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner label="Loading personal workspace..." className="py-20" />;
  }

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'ACTIVE') return !t.isCompleted;
    if (taskFilter === 'COMPLETED') return t.isCompleted;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Personal Placement Workspace</h1>
            <Badge variant="brand" size="sm">
              Private
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Author Account: <strong className="font-mono text-slate-800">{currentUser?.stablePseudonym}</strong> • Isolated personal workspace
          </p>
        </div>

        {/* Readiness Metric Progress Bar */}
        <div className="w-full sm:w-64 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-700">Task Checklist Progress</span>
            <span className="font-bold text-brand-600">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>{completedCount} completed</span>
            <span>{tasks.length - completedCount} pending</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Preparation Tasks Checklist */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-600" />
              Preparation Tasks
            </h2>

            {/* Filter Tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
              <button
                onClick={() => setTaskFilter('ALL')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  taskFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({tasks.length})
              </button>
              <button
                onClick={() => setTaskFilter('ACTIVE')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  taskFilter === 'ACTIVE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active ({tasks.length - completedCount})
              </button>
              <button
                onClick={() => setTaskFilter('COMPLETED')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  taskFilter === 'COMPLETED' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Done ({completedCount})
              </button>
            </div>
          </div>

          {/* Add Task Input Form */}
          <form
            onSubmit={handleCreateTask}
            className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Add a new preparation task (e.g. Implement Dijkstra with State)..."
                required
                className="cp-input text-xs sm:text-sm flex-1"
              />
              <Button type="submit" variant="primary" size="sm" isLoading={isAddingTask} leftIcon={<Plus className="w-4 h-4" />}>
                Add Task
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700"
                  title="Target completion date"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto flex-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="Target Drive / Company (optional)"
                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 w-full"
                />
              </div>
            </div>
          </form>

          {/* Tasks List */}
          {filteredTasks.length === 0 ? (
            <EmptyState
              title="No tasks in this view"
              description="Keep your placement prep organized by tracking specific coding goals, mock interviews, and revision milestones."
            />
          ) : (
            <div className="space-y-2.5">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    task.isCompleted
                      ? 'bg-slate-50/70 border-slate-200 text-slate-400'
                      : 'bg-white border-slate-200 shadow-xs hover:border-brand-200'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      onChange={() => handleToggleTask(task.id)}
                      className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 cursor-pointer"
                      id={`task-${task.id}`}
                    />
                    <label
                      htmlFor={`task-${task.id}`}
                      className={`text-xs sm:text-sm font-medium cursor-pointer truncate ${
                        task.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                    >
                      {task.title}
                    </label>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {task.companyName && (
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-brand-50 text-brand-700 border border-brand-200">
                        {task.companyName}
                      </span>
                    )}

                    {task.targetDate && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {task.targetDate}
                      </span>
                    )}

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      title="Delete task"
                      aria-label="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Saved Bookmarks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-amber-500" />
              Saved Bookmarks ({bookmarks.length})
            </h2>
          </div>

          {bookmarks.length === 0 ? (
            <EmptyState
              title="No bookmarks saved"
              description="Click the bookmark icon on any Company, Campus Drive, or Preparation Resource to save it here for fast revision."
            />
          ) : (
            <div className="space-y-2.5">
              {bookmarks.map((bm) => (
                <div
                  key={bm.id}
                  className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-brand-600 block mb-0.5">
                      {bm.contentType}
                    </span>
                    <Link
                      to={bm.link}
                      className="text-xs sm:text-sm font-bold text-slate-900 hover:text-brand-600 truncate block transition-colors"
                    >
                      {bm.title}
                    </Link>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{bm.subtitle}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      to={bm.link}
                      className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded transition-colors"
                      title="Open bookmark"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleRemoveBookmark(bm)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Privacy Note */}
          <div className="p-3 bg-slate-100/70 border border-slate-200 rounded-lg text-[11px] text-slate-500 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <span>
              <strong>Rule 5 Enforced:</strong> Workspace records are strictly isolated to your authenticated account. Neither other students nor recruiters can see your tasks or bookmarks.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
