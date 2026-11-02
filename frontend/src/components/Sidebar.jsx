import { motion } from 'framer-motion';
import { BarChart3, Check, Radio, RotateCcw, Sparkles, Trophy, UserPlus, Users, Zap } from 'lucide-react';
import { usePitchLab } from '../context/PitchLabContext.jsx';

function formatCount(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat('en-US').format(number);
}

function BuilderCard({ builder, index }) {
  const { toggleFollow, isFollowingBuilder, currentUser } = usePitchLab();
  const followed = isFollowingBuilder(builder.id);
  const isOwn = currentUser.id === builder.id;

  return (
    <motion.div
      className="rounded-3xl border border-[#E7E9F6] bg-white/90 p-4 shadow-[0_12px_38px_rgba(21,26,61,0.05)]"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-start gap-3">
        <img src={builder.avatarUrl} alt={builder.fullName} className="h-12 w-12 rounded-2xl object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-heading text-sm font-bold text-[var(--text)]">{builder.fullName}</p>
          <p className="truncate text-xs text-[var(--support)]">{builder.headline}</p>
          <div className="mt-2 flex items-center gap-2 text-xs font-bold text-[var(--support)]">
            <Users size={13} className="text-[var(--primary)]" />
            {formatCount(builder.followers)} followers
          </div>
        </div>
      </div>
      <p className="mt-3 rounded-2xl bg-[#F7F8FC] px-3 py-2 text-xs font-bold text-[var(--success)]">{builder.trend}</p>
      {!isOwn && (
        <motion.button
          type="button"
          className={`mt-3 w-full rounded-full px-4 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${followed ? 'bg-[#EAF8F0] text-[var(--success)]' : 'border border-[#DCDFFE] bg-white text-[var(--text)] hover:bg-[#EEF1FF]'}`}
          onClick={() => toggleFollow(builder.id)}
          whileTap={{ scale: 0.97 }}
        >
          {followed ? (
            <span className="inline-flex items-center justify-center gap-2">
              <Check size={16} />
              Following
            </span>
          ) : (
            <span className="inline-flex items-center justify-center gap-2">
              <UserPlus size={16} />
              Follow Builder
            </span>
          )}
        </motion.button>
      )}
    </motion.div>
  );
}

export default function Sidebar() {
  const {
    users,
    competitionVotes,
    recordVote,
    resetDemoData
  } = usePitchLab();

  const topBuilders = users.slice().sort((a, b) => Number(b.followers || 0) - Number(a.followers || 0)).slice(0, 4);

  return (
    <aside className="space-y-5 lg:sticky lg:top-24">
      <motion.section
        className="overflow-hidden rounded-3xl border border-[#DADDFE] bg-[#151A3D] text-white shadow-[0_24px_80px_rgba(83,70,255,0.16)]"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative p-5">
          <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#18C7FF]/25 blur-3xl" />
          <div className="absolute -bottom-20 left-8 h-44 w-44 rounded-full bg-[#635BFF]/35 blur-3xl" />
          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/90">
              <Radio size={14} />
              Live voter counter
            </div>
            <p className="font-heading text-4xl font-bold tracking-tight">{formatCount(competitionVotes.counter)}</p>
            <p className="mt-2 text-sm leading-6 text-white/72">
              Supporters are helping PitchLab reach more founders during the TatbiQ competition.
            </p>
            <motion.button
              type="button"
              className="vote-button mt-5 w-full justify-center"
              onClick={() => recordVote('sidebar_cta')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="vote-dot" />
              <Trophy size={18} />
              Vote for PitchLab
            </motion.button>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="rounded-3xl border border-[#E7E9F6] bg-white/80 p-5 shadow-[0_18px_60px_rgba(21,26,61,0.07)] backdrop-blur"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="eyebrow">High Signal</p>
            <h2 className="font-heading text-xl font-bold text-[var(--text)]">Top Builders</h2>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EEF1FF] text-[var(--primary)]">
            <Sparkles size={20} />
          </div>
        </div>
        <div className="space-y-3">
          {topBuilders.map((builder, index) => (
            <BuilderCard builder={builder} key={builder.id} index={index} />
          ))}
        </div>
      </motion.section>

      <motion.section
        className="rounded-3xl border border-[#E7E9F6] bg-white/80 p-5 shadow-[0_18px_60px_rgba(21,26,61,0.07)] backdrop-blur"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EAFBFF] text-[#0788B8]">
            <BarChart3 size={20} />
          </div>
          <div>
            <p className="eyebrow">Consensus Loop</p>
            <h2 className="font-heading text-lg font-bold text-[var(--text)]">Review Quality</h2>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Actionable comments', value: 86, color: '#635BFF' },
            { label: 'Private follow-ups', value: 64, color: '#18C7FF' },
            { label: 'AI summaries generated', value: 72, color: '#FFB020' }
          ].map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex justify-between text-xs font-bold text-[var(--support)]">
                <span>{item.label}</span>
                <span>{item.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#EEF1FF]">
                <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }} />
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="btn-secondary mt-5 w-full justify-center" onClick={resetDemoData}>
          <RotateCcw size={16} />
          Restore demo data
        </button>
      </motion.section>

      <motion.section
        className="rounded-3xl border border-[#DCDFFE] bg-[#F6F7FF] p-5"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-start gap-3">
          <Zap size={20} className="mt-1 text-[var(--primary)]" />
          <div>
            <h3 className="font-heading font-bold text-[var(--text)]">Signal-routing rule</h3>
            <p className="mt-1 text-sm leading-6 text-[var(--support)]">
              Comments with enough concrete detail are routed into AI consensus summaries once a pitch reaches three approved reviews.
            </p>
          </div>
        </div>
      </motion.section>
    </aside>
  );
}
