import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Layers3,
  MessageSquare,
  Plus,
  Radio,
  Search,
  Sparkles,
  UserPlus,
  Users,
  Zap
} from 'lucide-react';
import { usePitchLab } from '../context/PitchLabContext.jsx';
import PitchCard from '../components/PitchCard.jsx';
import Sidebar from '../components/Sidebar.jsx';

const feedCategories = ['All Categories', 'SaaS', 'AI/ML', 'DevTools', 'Mobile'];

function SignalHero() {
  const { assets, openDrawer, recordVote } = usePitchLab();

  const chips = [
    { label: 'UI/UX signal', icon: MessageSquare, x: '9%', y: '18%' },
    { label: 'AI consensus', icon: Bot, x: '34%', y: '54%' },
    { label: 'Founder reply', icon: Users, x: '63%', y: '25%' },
    { label: 'Vote momentum', icon: Zap, x: '76%', y: '68%' }
  ];

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[#DADDFE] bg-[#F6F7FF] shadow-[0_24px_80px_rgba(83,70,255,0.10)]">
      <div className="absolute inset-0 circuit-grid opacity-70" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 420" preserveAspectRatio="none" aria-hidden="true">
        <path d="M80 95 C220 80 230 245 365 230 S520 90 662 112 S780 275 920 260" fill="none" stroke="#BFC5FF" strokeWidth="2" strokeDasharray="8 10" />
        <path d="M110 315 C250 250 340 360 455 286 S620 245 760 330" fill="none" stroke="#A7E9FF" strokeWidth="2" strokeDasharray="6 12" />
      </svg>

      {chips.map((chip, index) => {
        const Icon = chip.icon;
        return (
          <motion.div
            key={chip.label}
            className="absolute hidden items-center gap-2 rounded-2xl border border-white/80 bg-white/90 px-3 py-2 text-xs font-bold text-[var(--text)] shadow-[0_14px_36px_rgba(83,70,255,0.12)] backdrop-blur md:flex"
            style={{ left: chip.x, top: chip.y }}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.42, delay: 0.18 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <Icon size={15} className="text-[var(--primary)]" />
            {chip.label}
          </motion.div>
        );
      })}

      <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
        <div className="flex min-h-[360px] flex-col justify-center">
          <motion.div
            className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#DCDFFE] bg-white/75 px-4 py-2 text-sm font-bold text-[var(--primary)] shadow-sm"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          >
            <Radio size={16} />
            AI-powered peer review community
          </motion.div>
          <motion.h1
            className="font-heading text-4xl font-bold tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            Turn startup pitches into structured founder signals.
          </motion.h1>
          <motion.p
            className="mt-5 max-w-2xl text-base leading-8 text-[var(--support)] sm:text-lg"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          >
            Browse new ideas, follow promising builders, leave categorized feedback, and let PitchLab synthesize the next most useful product moves.
          </motion.p>
          <motion.div
            className="mt-7 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.52, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <button type="button" className="btn-primary justify-center" onClick={() => openDrawer('submitPitch')}>
              <Plus size={18} />
              Submit Pitch
            </button>
            <button type="button" className="btn-secondary justify-center" onClick={() => recordVote('hero_cta')}>
              <Sparkles size={18} />
              Vote for PitchLab
            </button>
          </motion.div>
        </div>

        <motion.div
          className="relative min-h-[360px]"
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.62, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute -right-6 top-6 h-52 w-52 rounded-full bg-[#18C7FF]/25 blur-3xl" />
          <div className="absolute -bottom-8 left-0 h-60 w-60 rounded-full bg-[#635BFF]/18 blur-3xl" />
          <div className="relative h-full overflow-hidden rounded-[2rem] border border-white/80 bg-white p-3 shadow-[0_24px_70px_rgba(21,26,61,0.14)]">
            <img src={assets.heroImage} alt="Product design team reviewing startup signals" className="h-full min-h-[340px] w-full rounded-[1.45rem] object-cover" />
            <div className="absolute inset-3 rounded-[1.45rem] bg-gradient-to-t from-[#151A3D]/68 via-transparent to-transparent" />
            <div className="absolute bottom-7 left-7 right-7 rounded-3xl border border-white/20 bg-white/14 p-4 text-white backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/72">Consensus Console</p>
                  <p className="mt-1 font-heading text-xl font-bold">3 approved signals routed</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[var(--primary)]">
                  <CheckCircle2 size={22} />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="h-2 rounded-full bg-[#635BFF]" />
                <div className="h-2 rounded-full bg-[#18C7FF]" />
                <div className="h-2 rounded-full bg-[#FFB020]" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FollowingEmptyState() {
  const { users, toggleFollow, updateFilter } = usePitchLab();
  const navigate = useNavigate();

  return (
    <div className="rounded-3xl border border-[#DADDFE] bg-white p-7 shadow-[0_18px_60px_rgba(21,26,61,0.08)]">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-[#EEF1FF] text-[var(--primary)]">
          <UserPlus size={26} />
        </div>
        <h2 className="mt-4 font-heading text-2xl font-bold text-[var(--text)]">Follow builders to tune your feed</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--support)]">
          Your following feed will show new pitches from builders you track. Start with these high-signal founders or return to Explore.
        </p>
      </div>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {users.slice(0, 3).map((builder) => (
          <div key={builder.id} className="rounded-3xl border border-[#E7E9F6] bg-[#F7F8FC] p-4">
            <img src={builder.avatarUrl} alt={builder.fullName} className="h-20 w-full rounded-2xl object-cover" />
            <h3 className="mt-3 font-heading font-bold text-[var(--text)]">{builder.fullName}</h3>
            <p className="mt-1 text-xs text-[var(--support)]">{builder.headline}</p>
            <button className="btn-secondary mt-4 w-full justify-center" type="button" onClick={() => toggleFollow(builder.id)}>
              <UserPlus size={16} />
              Follow
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            updateFilter('feedMode', 'explore');
            navigate('/');
          }}
        >
          Explore all pitches
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default function FeedPage({ mode = 'explore' }) {
  const {
    pitches,
    follows,
    currentUser,
    filters,
    updateFilter,
    comments
  } = usePitchLab();
  const location = useLocation();

  useEffect(() => {
    updateFilter('feedMode', mode);
  }, [mode, updateFilter]);

  const visiblePitches = useMemo(() => {
    const followedBuilderIds = follows
      .filter((follow) => follow.followerId === currentUser.id)
      .map((follow) => follow.builderId);

    return pitches
      .filter((pitch) => mode === 'following' ? followedBuilderIds.includes(pitch.builderId) : true)
      .filter((pitch) => filters.category === 'All Categories' ? true : pitch.category === filters.category)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [currentUser.id, filters.category, follows, mode, pitches]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
      <SignalHero />

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          <div className="rounded-3xl border border-[#E7E9F6] bg-white/80 p-4 shadow-[0_14px_42px_rgba(21,26,61,0.05)] backdrop-blur">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="eyebrow">{mode === 'following' ? 'Following Feed' : 'Explore Feed'}</p>
                <h2 className="font-heading text-2xl font-bold text-[var(--text)]">
                  {mode === 'following' ? 'Pitches from builders you follow' : 'Newest startup pitches'}
                </h2>
                <p className="mt-1 text-sm text-[var(--support)]">
                  {visiblePitches.length} visible pitches with {comments.length} structured feedback signals.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {feedCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={`rounded-full px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                      filters.category === category
                        ? 'bg-[#151A3D] text-white shadow-[0_10px_28px_rgba(21,26,61,0.18)]'
                        : 'border border-[#E1E5F5] bg-white text-[var(--support)] hover:border-[#C8CCFF] hover:text-[var(--text)]'
                    }`}
                    onClick={() => updateFilter('category', category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {visiblePitches.length > 0 ? (
            <div className="grid gap-6 xl:grid-cols-2">
              {visiblePitches.map((pitch, index) => (
                <PitchCard pitch={pitch} key={pitch.id} index={index} />
              ))}
            </div>
          ) : mode === 'following' ? (
            <FollowingEmptyState />
          ) : (
            <div className="rounded-3xl border border-dashed border-[#DCDFFE] bg-white p-10 text-center">
              <Search className="mx-auto text-[var(--primary)]" size={34} />
              <h2 className="mt-4 font-heading text-2xl font-bold text-[var(--text)]">No pitches match this filter</h2>
              <p className="mt-2 text-[var(--support)]">Try another category or submit a pitch to seed this node.</p>
            </div>
          )}
        </div>

        <Sidebar />
      </div>
    </div>
  );
}
