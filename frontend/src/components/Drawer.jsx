import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Bot,
  Check,
  ExternalLink,
  MessageSquare,
  Save,
  Send,
  Sparkles,
  UploadCloud,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { usePitchLab } from '../context/PitchLabContext.jsx';

const initialPitchForm = {
  title: '',
  tagline: '',
  description: '',
  demoUrl: '',
  videoEmbedUrl: '',
  category: 'SaaS',
  stage: 'MVP'
};

function hasEditedFields(form) {
  return Object.values(form).some((value) => String(value || '').trim().length > 0) && (
    form.title !== initialPitchForm.title ||
    form.tagline !== initialPitchForm.tagline ||
    form.description !== initialPitchForm.description ||
    form.demoUrl !== initialPitchForm.demoUrl ||
    form.videoEmbedUrl !== initialPitchForm.videoEmbedUrl ||
    form.category !== initialPitchForm.category ||
    form.stage !== initialPitchForm.stage
  );
}

function ConfirmDiscardDialog({ onKeep, onDiscard }) {
  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(21,26,61,0.22)] px-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        className="w-full max-w-sm rounded-3xl border border-[#DCDFFE] bg-white p-6 shadow-[0_24px_80px_rgba(21,26,61,0.18)]"
        initial={{ y: 18, scale: 0.96 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 18, scale: 0.96 }}
      >
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF1FF] text-[var(--primary)]">
          <UploadCloud size={21} />
        </div>
        <h3 className="font-heading text-xl font-bold text-[var(--text)]">Discard unsaved changes?</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--support)]">
          Your pitch form has edits that have not been published or saved as a draft.
        </p>
        <div className="mt-6 flex gap-3">
          <button className="btn-secondary flex-1" type="button" onClick={onKeep}>
            Keep Editing
          </button>
          <button className="btn-primary flex-1" type="button" onClick={onDiscard}>
            Discard
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SubmitPitchDrawer({ requestClose }) {
  const navigate = useNavigate();
  const { categories, submitPitch, saveDraft, assets } = usePitchLab();
  const [form, setForm] = useState(initialPitchForm);
  const [errors, setErrors] = useState({});
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  const edited = hasEditedFields(form);

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: '' }));
  };

  const closeWithCheck = () => {
    if (edited) {
      setConfirmDiscard(true);
      return;
    }
    requestClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await submitPitch({ ...form, mediaUrl: assets.pitchImage });
    if (!result.ok) {
      setErrors(result.errors || {});
      return;
    }
    setForm(initialPitchForm);
    requestClose();
    navigate(`/pitch/${result.pitch.id}`);
  };

  const handleSaveDraft = async () => {
    await saveDraft(form);
  };

  return (
    <>
      <div className="sticky top-0 z-10 flex items-start justify-between gap-5 border-b border-[#E7E9F6] bg-white/95 px-6 py-5 backdrop-blur-xl sm:px-8">
        <div>
          <p className="eyebrow">Submit Pitch</p>
          <h2 className="mt-1 font-heading text-2xl font-bold text-[var(--text)]">Route your startup through the circuit</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--support)]">
            Share enough context for builders to leave structured, high-signal feedback.
          </p>
        </div>
        <button className="icon-button" type="button" onClick={closeWithCheck} aria-label="Close submit pitch drawer">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6 sm:px-8">
          <label className="field-label">
            Title
            <input
              className={`field-input ${errors.title ? 'field-error' : ''}`}
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              placeholder="PulseDesk"
            />
            {errors.title && <span className="field-message">{errors.title}</span>}
          </label>

          <label className="field-label">
            Tagline
            <input
              className={`field-input ${errors.tagline ? 'field-error' : ''}`}
              value={form.tagline}
              onChange={(event) => updateField('tagline', event.target.value)}
              placeholder="AI triage for customer feedback signals"
            />
            {errors.tagline && <span className="field-message">{errors.tagline}</span>}
          </label>

          <label className="field-label">
            Description
            <textarea
              className={`field-input min-h-[150px] resize-none ${errors.description ? 'field-error' : ''}`}
              value={form.description}
              onChange={(event) => updateField('description', event.target.value)}
              placeholder="Explain the customer, pain, solution, wedge, and what feedback would help most."
            />
            {errors.description && <span className="field-message">{errors.description}</span>}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="field-label">
              Demo URL
              <input
                className={`field-input ${errors.demoUrl ? 'field-error' : ''}`}
                value={form.demoUrl}
                onChange={(event) => updateField('demoUrl', event.target.value)}
                placeholder="https://example.com"
              />
              {errors.demoUrl && <span className="field-message">{errors.demoUrl}</span>}
            </label>

            <label className="field-label">
              Video URL
              <input
                className={`field-input ${errors.videoEmbedUrl ? 'field-error' : ''}`}
                value={form.videoEmbedUrl}
                onChange={(event) => updateField('videoEmbedUrl', event.target.value)}
                placeholder="https://example.com/demo"
              />
              {errors.videoEmbedUrl && <span className="field-message">{errors.videoEmbedUrl}</span>}
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="field-label">
              Category
              <select
                className={`field-input ${errors.category ? 'field-error' : ''}`}
                value={form.category}
                onChange={(event) => updateField('category', event.target.value)}
              >
                {categories.map((category) => (
                  <option value={category} key={category}>{category}</option>
                ))}
              </select>
              {errors.category && <span className="field-message">{errors.category}</span>}
            </label>

            <label className="field-label">
              Stage
              <select
                className={`field-input ${errors.stage ? 'field-error' : ''}`}
                value={form.stage}
                onChange={(event) => updateField('stage', event.target.value)}
              >
                <option value="Idea">Idea</option>
                <option value="MVP">MVP</option>
                <option value="Private Alpha">Private Alpha</option>
                <option value="Beta">Beta</option>
                <option value="Pilot">Pilot</option>
                <option value="Launched">Launched</option>
              </select>
              {errors.stage && <span className="field-message">{errors.stage}</span>}
            </label>
          </div>

          <div className="rounded-3xl border border-[#DCDFFE] bg-[#F6F7FF] p-5">
            <div className="flex items-start gap-3">
              <Sparkles size={20} className="mt-1 text-[var(--primary)]" />
              <div>
                <h3 className="font-heading text-base font-bold text-[var(--text)]">Quality Guard preview</h3>
                <p className="mt-1 text-sm leading-6 text-[var(--support)]">
                  After publishing, reviewers will be prompted to leave categorized feedback and PitchLab will synthesize consensus once three approved comments arrive.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 flex flex-col gap-3 border-t border-[#E7E9F6] bg-white/95 px-6 py-5 backdrop-blur-xl sm:flex-row sm:px-8">
          <button type="submit" className="btn-primary flex-1">
            Publish Pitch
            <ArrowRight size={18} />
          </button>
          <button type="button" className="btn-secondary flex-1" onClick={handleSaveDraft}>
            <Save size={18} />
            Save Draft
          </button>
          <button type="button" className="btn-ghost flex-1" onClick={closeWithCheck}>
            Cancel
          </button>
        </div>
      </form>

      <AnimatePresence>
        {confirmDiscard && (
          <ConfirmDiscardDialog
            onKeep={() => setConfirmDiscard(false)}
            onDiscard={() => {
              setConfirmDiscard(false);
              requestClose();
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function PrivateMessageDrawer({ payload, requestClose }) {
  const {
    currentUser,
    messages,
    sendMessage,
    getUserById,
    pitches,
    comments,
    generatePromptChips
  } = usePitchLab();

  const pitch = pitches.find((item) => item.id === payload?.pitchId);
  const comment = comments.find((item) => item.id === payload?.commentId);
  const reviewer = getUserById(payload?.reviewerId || comment?.authorId);
  const promptChips = useMemo(() => generatePromptChips(comment), [comment, generatePromptChips]);
  const [message, setMessage] = useState('');
  const [inlineStatus, setInlineStatus] = useState('');
  const threadRef = useRef(null);

  const thread = messages.filter((item) => (
    item.pitchId === pitch?.id &&
    (
      (item.senderId === currentUser.id && item.recipientId === reviewer?.id) ||
      (item.senderId === reviewer?.id && item.recipientId === currentUser.id)
    )
  ));

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [thread.length]);

  const handleSend = async (event) => {
    event.preventDefault();
    const result = await sendMessage({
      pitchId: pitch?.id,
      recipientId: reviewer?.id,
      sourceCommentId: comment?.id,
      content: message
    });

    if (!result.ok) {
      setInlineStatus(result.reason);
      return;
    }

    setMessage('');
    setInlineStatus('Message sent');
    toast.success('Message sent');
  };

  if (!pitch || !reviewer || !comment) {
    return (
      <div className="p-8">
        <button className="icon-button mb-6" type="button" onClick={requestClose} aria-label="Close drawer">
          <X size={20} />
        </button>
        <p className="text-[var(--support)]">Conversation context could not be loaded.</p>
      </div>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-10 flex items-start justify-between gap-5 border-b border-[#E7E9F6] bg-white/95 px-6 py-5 backdrop-blur-xl sm:px-8">
        <div>
          <p className="eyebrow">Private Reply</p>
          <h2 className="mt-1 font-heading text-2xl font-bold text-[var(--text)]">Continue with {reviewer.fullName}</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--support)]">Context stays attached to {pitch.title} and the selected feedback.</p>
        </div>
        <button className="icon-button" type="button" onClick={requestClose} aria-label="Close private message drawer">
          <X size={20} />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div ref={threadRef} className="flex-1 space-y-5 overflow-y-auto px-6 py-6 sm:px-8">
          <div className="overflow-hidden rounded-3xl border border-[#DCDFFE] bg-[#F6F7FF]">
            <img src={pitch.mediaUrl} alt={pitch.title} className="h-36 w-full object-cover" />
            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-heading text-lg font-bold text-[var(--text)]">{pitch.title}</h3>
                <a href={pitch.demoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-[var(--primary)] hover:text-[var(--secondary)]">
                  Demo <ExternalLink size={13} />
                </a>
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--support)]">{pitch.tagline}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-[#E7E9F6] bg-white p-5 shadow-[0_12px_38px_rgba(21,26,61,0.06)]">
            <div className="flex items-start gap-3">
              <img src={reviewer.avatarUrl} alt={reviewer.fullName} className="h-11 w-11 rounded-2xl object-cover" />
              <div>
                <p className="font-heading font-bold text-[var(--text)]">{reviewer.fullName}</p>
                <p className="text-xs text-[var(--support)]">@{reviewer.handle}</p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-[#F7F8FC] p-4 text-sm leading-6 text-[var(--support)]">
              {comment.content}
            </div>
          </div>

          <div className="rounded-3xl border border-[#DCDFFE] bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <Bot size={18} className="text-[var(--primary)]" />
              <h3 className="font-heading text-base font-bold text-[var(--text)]">AI conversation starters</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {promptChips.map((chip) => (
                <button
                  type="button"
                  key={chip}
                  className="rounded-full border border-[#DCDFFE] bg-[#F6F7FF] px-4 py-2 text-left text-sm font-bold text-[var(--text)] transition hover:-translate-y-0.5 hover:border-[#C8CCFF] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  onClick={() => setMessage(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {thread.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#DCDFFE] bg-white p-6 text-center">
                <MessageSquare className="mx-auto text-[var(--primary)]" size={26} />
                <p className="mt-3 font-heading font-bold text-[var(--text)]">No private messages yet</p>
                <p className="mt-1 text-sm text-[var(--support)]">Send a focused follow-up to turn public feedback into a working relationship.</p>
              </div>
            ) : (
              thread.map((item) => {
                const own = item.senderId === currentUser.id;
                const author = getUserById(item.senderId);
                return (
                  <div key={item.id} className={`flex ${own ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[82%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm ${own ? 'bg-[var(--primary)] text-white' : 'border border-[#E7E9F6] bg-white text-[var(--text)]'}`}>
                      <p className="mb-1 text-xs font-bold opacity-75">{author?.fullName}</p>
                      <p>{item.content}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <form onSubmit={handleSend} className="sticky bottom-0 border-t border-[#E7E9F6] bg-white/95 px-6 py-5 backdrop-blur-xl sm:px-8">
          <label className="field-label">
            Message
            <textarea
              className="field-input min-h-[92px] resize-none"
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                setInlineStatus('');
              }}
              maxLength={500}
              placeholder="Ask a focused follow-up question..."
            />
          </label>
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className={`text-xs font-bold ${inlineStatus === 'Message sent' ? 'text-[var(--success)]' : 'text-[var(--risk)]'}`}>
              {inlineStatus}
            </p>
            <button className="btn-primary" type="submit">
              <Send size={18} />
              Send Message
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default function Drawer() {
  const { activeDrawer, closeDrawer } = usePitchLab();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && activeDrawer) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeDrawer, closeDrawer]);

  const transition = reduceMotion
    ? { duration: 0.01 }
    : { type: 'spring', stiffness: 360, damping: 34 };

  return (
    <AnimatePresence>
      {activeDrawer && (
        <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button
            type="button"
            aria-label="Close drawer backdrop"
            onClick={closeDrawer}
            className="absolute inset-0 h-full w-full cursor-default bg-[rgba(21,26,61,0.24)] backdrop-blur-sm"
          />
          <motion.aside
            className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col overflow-hidden bg-white shadow-[0_24px_90px_rgba(21,26,61,0.25)]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={transition}
            role="dialog"
            aria-modal="true"
          >
            {activeDrawer.type === 'submitPitch' && <SubmitPitchDrawer requestClose={closeDrawer} />}
            {activeDrawer.type === 'privateMessage' && <PrivateMessageDrawer payload={activeDrawer.payload} requestClose={closeDrawer} />}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
