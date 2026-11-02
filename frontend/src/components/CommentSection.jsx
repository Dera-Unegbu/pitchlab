import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUp,
  Bot,
  CheckCircle2,
  MessageCircle,
  MessageSquareText,
  Send,
  ShieldCheck
} from 'lucide-react';
import { usePitchLab } from '../context/PitchLabContext.jsx';

const badgeClasses = {
  'UI/UX': 'bg-[#EEF1FF] text-[#635BFF] border-[#DCDFFE]',
  'Business Model': 'bg-[#FFF6DF] text-[#A76900] border-[#FFE4A6]',
  'Tech Stack': 'bg-[#EAFBFF] text-[#0788B8] border-[#CBEFFF]',
  General: 'bg-[#F2F4F8] text-[#59607A] border-[#E1E5F5]'
};

const tabLabels = [
  { label: 'All', value: 'All' },
  { label: 'UI/UX', value: 'UI/UX' },
  { label: 'Business', value: 'Business Model' },
  { label: 'Tech', value: 'Tech Stack' },
  { label: 'General', value: 'General' }
];

export default function CommentSection({ pitch }) {
  const {
    comments,
    users,
    currentUser,
    getUserById,
    submitComment,
    upvoteComment,
    openDrawer,
    filters,
    updateFilter,
    commentCategories
  } = usePitchLab();

  const [form, setForm] = useState({
    category: 'UI/UX',
    content: ''
  });
  const [reason, setReason] = useState('');

  const pitchComments = useMemo(() => (
    comments.filter((comment) => comment.pitchId === pitch.id)
  ), [comments, pitch.id]);

  const filteredComments = useMemo(() => (
    filters.commentCategory === 'All'
      ? pitchComments
      : pitchComments.filter((comment) => comment.category === filters.commentCategory)
  ), [filters.commentCategory, pitchComments]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setReason('');
    const result = await submitComment({
      pitchId: pitch.id,
      category: form.category,
      content: form.content
    });
    if (!result.ok) {
      setReason(result.reason);
      return;
    }
    setForm({ category: form.category, content: '' });
  };

  const handlePrivateReply = (comment) => {
    openDrawer('privateMessage', {
      pitchId: pitch.id,
      commentId: comment.id,
      reviewerId: comment.authorId
    });
  };

  return (
    <section className="rounded-3xl border border-[#E7E9F6] bg-white/90 p-5 shadow-[0_18px_60px_rgba(21,26,61,0.08)] sm:p-7">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Structured Feedback</p>
          <h2 className="font-heading text-2xl font-bold text-[var(--text)]">Peer review circuit</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--support)]">
            Each comment is categorized, quality-checked, and used to build consensus guidance.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF8F0] px-4 py-2 text-sm font-bold text-[var(--success)]">
          <ShieldCheck size={17} />
          AI moderated
        </div>
      </div>

      <div className="relative mb-7 overflow-x-auto pb-1">
        <div className="absolute left-4 right-4 top-1/2 hidden h-px -translate-y-1/2 bg-[#DCDFFE] sm:block" />
        <div className="relative flex min-w-max gap-2">
          {tabLabels.map((tab) => (
            <button
              type="button"
              key={tab.value}
              className={`relative z-10 rounded-full px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                filters.commentCategory === tab.value
                  ? 'bg-[#151A3D] text-white shadow-[0_12px_30px_rgba(21,26,61,0.22)]'
                  : 'border border-[#E1E5F5] bg-white text-[#59607A] hover:border-[#C8CCFF] hover:text-[var(--text)]'
              }`}
              onClick={() => updateFilter('commentCategory', tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-7 rounded-3xl border border-[#DCDFFE] bg-[#F6F7FF] p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-[220px_1fr]">
          <label className="field-label">
            Category
            <select
              className="field-input bg-white"
              value={form.category}
              onChange={(event) => setForm((previous) => ({ ...previous, category: event.target.value }))}
            >
              {commentCategories.map((category) => (
                <option value={category} key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label className="field-label">
            Feedback
            <textarea
              className="field-input min-h-[120px] resize-none bg-white"
              value={form.content}
              onChange={(event) => {
                setForm((previous) => ({ ...previous, content: event.target.value }));
                setReason('');
              }}
              placeholder="Share a concrete suggestion, risk, workflow improvement, pricing note, or technical proof point..."
            />
          </label>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2 text-xs leading-5 text-[var(--support)]">
            <Bot size={16} className="mt-0.5 shrink-0 text-[var(--primary)]" />
            <span>Quality Guard rejects toxic or vague feedback and can auto-route your category.</span>
          </div>
          <button className="btn-primary justify-center" type="submit">
            <Send size={18} />
            Submit Feedback
          </button>
        </div>
        {reason && <p className="mt-3 text-sm font-bold text-[var(--risk)]">{reason}</p>}
      </form>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredComments.length > 0 ? (
            filteredComments.map((comment, index) => {
              const author = getUserById(comment.authorId) || users[0];
              const upvoted = Array.isArray(comment.upvotedBy) && comment.upvotedBy.includes(currentUser.id);
              return (
                <motion.article
                  key={comment.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                  className="rounded-3xl border border-[#E7E9F6] bg-white p-5 shadow-[0_10px_30px_rgba(21,26,61,0.05)]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <img src={author.avatarUrl} alt={author.fullName} className="h-12 w-12 rounded-2xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading font-bold text-[var(--text)]">{author.fullName}</h3>
                        <span className="text-xs font-bold text-[var(--support)]">@{author.handle}</span>
                        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${badgeClasses[comment.category] || badgeClasses.General}`}>
                          {comment.category}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-[var(--support)]">{comment.content}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                            upvoted
                              ? 'bg-[#EAF8F0] text-[var(--success)]'
                              : 'border border-[#E1E5F5] bg-white text-[var(--support)] hover:border-[#C8CCFF] hover:text-[var(--text)]'
                          }`}
                          onClick={() => upvoteComment(comment.id)}
                        >
                          <ArrowUp size={15} />
                          {comment.upvotes}
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-full border border-[#E1E5F5] bg-white px-3 py-2 text-xs font-bold text-[var(--support)] transition hover:border-[#C8CCFF] hover:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                          onClick={() => handlePrivateReply(comment)}
                        >
                          <MessageCircle size={15} />
                          Reply Privately
                        </button>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--success)]">
                          <CheckCircle2 size={14} />
                          Score {comment.moderation?.score}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })
          ) : (
            <motion.div
              className="rounded-3xl border border-dashed border-[#DCDFFE] bg-[#F7F8FC] p-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <MessageSquareText className="mx-auto text-[var(--primary)]" size={30} />
              <h3 className="mt-3 font-heading text-lg font-bold text-[var(--text)]">No feedback in this node yet</h3>
              <p className="mt-2 text-sm text-[var(--support)]">Switch categories or publish the first structured signal for this pitch.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
