import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  ExternalLink,
  Gauge,
  Lightbulb,
  Lock,
  MessageCircle,
  Radio,
  ShieldAlert,
  Sparkles,
  Trophy,
  UserPlus,
  Users
} from 'lucide-react';
import { usePitchLab } from '../context/PitchLabContext.jsx';
import Sidebar from '../components/Sidebar.jsx';
import CommentSection from '../components/CommentSection.jsx';

function SummaryCluster({ title, items, icon: Icon, delay }) {
  return (
    <motion.div
      className="rounded-3xl border border-[#E7E9F6] bg-[#F7F8FC] p-5"
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-[var(--primary)] shadow-sm">
          <Icon size={18} />
        </div>
        <h3 className="text-xs font-black uppercase tracking-[0.18em] text-[var(--support)]">{title}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-[var(--text)]">
            <CheckCircle2 size={16} className="mt-1 shrink-0 text-[var(--success)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function AiConsensusConsole({ summary, commentCount }) {
  if (!summary) {
    return (
      <section className="rounded-3xl border border-[#DCDFFE] bg-white p-6 shadow-[0_18px_60px_rgba(21,26,61,0.08)]">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF1FF] text-[var(--primary)]">
            <Bot size={23} />
          </div>
          <div>
            <p className="eyebrow">AI Consensus Console</p>
            <h2 className="font-heading text-2xl font-bold text-[var(--text)]">Waiting for more approved feedback</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--support)]">
              PitchLab generates a structured advisory summary when this pitch reaches three approved comments. Current count: {commentCount}.
            </p>
          </div>
        </div>
      </section>
    );
  }
  ""

  return (
    <motion.section
      className="relative overflow-hidden rounded-3xl border border-[#DCDFFE] bg-white p-6 shadow-[0_18px_60px_rgba(21,26,61,0.08)]"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-[#635BFF] to-[#18C7FF]"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'top' }}
      />
      <div className="pl-2">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF1FF] px-4 py-2 text-sm font-bold text-[var(--primary)]">
              <Bot size={17} />
              AI Consensus Console
            </div>
            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-[var(--text)]">Advisory synthesis from approved reviewer signals</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--support)]">
              Generated from structured comments, category tags, and moderation confidence.
            </p>
          </div>
          <div className="rounded-3xl border border-[#E7E9F6] bg-[#F7F8FC] px-5 py-4 text-center">
            <p className="font-heading text-3xl font-bold text-[var(--text)]">{commentCount}</p>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--support)]">signals</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <SummaryCluster title="Top Strengths" items={summary.strengths} icon={Sparkles} delay={0.08} />
          <SummaryCluster title="UX/Product Risks" items={summary.risks} icon={ShieldAlert} delay={0.16} />
          <SummaryCluster title="Next Steps" items={summary.nextSteps} icon={Lightbulb} delay={0.24} />
        </div>
      </div>
    </motion.section>
  );
}

export default function PitchDetailPage() {
  const { pitchId } = useParams();
  const navigate = useNavigate();
  const {
    pitches,
    comments,
    getBuilderForPitch,
    isFollowingBuilder,
    toggleFollow,
    generateSummary,
    recordVote,
    currentUser
  } = usePitchLab();

  const pitch = pitches.find((item) => item.id === pitchId);
  const pitchComments = comments.filter((comment) => comment.pitchId === pitchId);
  const summary = generateSummary(pitchId);

  const commentStats = useMemo(() => {
    const byCategory = ['UI/UX', 'Business Model', 'Tech Stack', 'General'].map((category) => ({
      category,
      count: pitchComments.filter((comment) => comment.category === category).length
    }));
    return byCategory;
  }, [pitchComments]);

  if (!pitch) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#EEF1FF] text-[var(--primary)]">
          <Radio size={30} />
        </div>
        <h1 className="mt-5 font-heading text-3xl font-bold text-[var(--text)]">Pitch not found</h1>
        <p className="mt-2 text-[var(--support)]">The pitch may have been removed or your demo data was reset.</p>
        <Link to="/" className="btn-primary mt-6">
          Back to Explore
        </Link>
      </div>
    );
  }

  const builder = getBuilderForPitch(pitch);
  const followed = isFollowingBuilder(pitch.builderId);
  const isOwn = currentUser.id === pitch.builderId;
  const hasDemo = Boolean(pitch.demoUrl);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
      <button type="button" className="btn-ghost mb-5" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          <motion.section
            className="overflow-hidden rounded-[2rem] border border-[#DADDFE] bg-white shadow-[0_24px_80px_rgba(83,70,255,0.10)]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative h-[360px] overflow-hidden bg-[#EEF1FF]">
              <img src={pitch.mediaUrl} alt={pitch.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#151A3D]/82 via-[#151A3D]/18 to-transparent" />
              <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/25 bg-white/90 px-4 py-2 text-sm font-bold text-[var(--primary)] backdrop-blur">
                  {pitch.category}
                </span>
                <span className="rounded-full border border-white/25 bg-white/90 px-4 py-2 text-sm font-bold text-[var(--text)] backdrop-blur">
                  {pitch.stage}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-white/75">
                  <Gauge size={16} />
                  Signal score {pitch.score}
                </p>
                <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight text-white sm:text-6xl">{pitch.title}</h1>
                <p className="mt-3 max-w-3xl text-base leading-7 text-white/82 sm:text-lg">{pitch.tagline}</p>
              </div>
            </div>

            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_280px]">
              <div>
                <p className="eyebrow">Full Description</p>
                <p className="mt-3 text-base leading-8 text-[var(--support)]">{pitch.description}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {hasDemo ? (
                    <a href={pitch.demoUrl} target="_blank" rel="noreferrer" className="btn-primary">
                      Open Demo
                      <ExternalLink size={18} />
                    </a>
                  ) : (
                    <button type="button" className="btn-disabled" disabled>
                      Demo coming soon
                    </button>
                  )}
                  <button type="button" className="btn-secondary" onClick={() => recordVote('pitch_detail_cta')}>
                    <Trophy size={18} />
                    Vote for PitchLab
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-[#E7E9F6] bg-[#F7F8FC] p-5">
                <div className="flex items-start gap-3">
                  <img src={builder?.avatarUrl} alt={builder?.fullName} className="h-14 w-14 rounded-2xl object-cover" />
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-[var(--text)]">{builder?.fullName}</p>
                    <p className="text-xs text-[var(--support)]">@{builder?.handle}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--support)]">{builder?.headline}</p>
                  </div>
                </div>
                {!isOwn && (
                  <button type="button" className="btn-secondary mt-5 w-full justify-center" onClick={() => toggleFollow(pitch.builderId)}>
                    <UserPlus size={18} />
                    {followed ? 'Following' : 'Follow Builder'}
                  </button>
                )}
              </div>
            </div>
          </motion.section>

          <div className="grid gap-4 sm:grid-cols-4">
            {commentStats.map((stat) => (
              <div key={stat.category} className="rounded-3xl border border-[#E7E9F6] bg-white p-5 shadow-[0_12px_38px_rgba(21,26,61,0.05)]">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--support)]">{stat.category}</p>
                <p className="mt-2 font-heading text-3xl font-bold text-[var(--text)]">{stat.count}</p>
              </div>
            ))}
          </div>

          <AiConsensusConsole summary={summary} commentCount={pitchComments.length} />

          <section className="rounded-3xl border border-[#E7E9F6] bg-white p-6 shadow-[0_18px_60px_rgba(21,26,61,0.08)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF1FF] text-[var(--primary)]">
                <Lock size={20} />
              </div>
              <div>
                <p className="eyebrow">Private follow-up layer</p>
                <h2 className="font-heading text-xl font-bold text-[var(--text)]">Turn comments into relationships</h2>
              </div>
            </div>
            <p className="text-sm leading-6 text-[var(--support)]">
              Use Reply Privately on any structured comment to open a pitch-specific drawer with AI-generated conversation starters and thread history.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF1FF] px-4 py-2 text-sm font-bold text-[var(--primary)]">
                <MessageCircle size={17} />
                Contextual threads
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#EAFBFF] px-4 py-2 text-sm font-bold text-[#0788B8]">
                <Users size={17} />
                Founder to reviewer
              </div>
            </div>
          </section>

          <CommentSection pitch={pitch} />
        </div>

        <Sidebar />
      </div>
    </div>
  );
}
