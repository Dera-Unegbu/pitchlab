import { motion } from 'framer-motion';
import { ArrowRight, Eye, MessageCircle, Radio, Sparkles, TrendingUp, UserPlus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePitchLab } from '../context/PitchLabContext.jsx';

const categoryStyles = {
  SaaS: 'bg-[#EEF1FF] text-[#635BFF] border-[#DCDFFE]',
  'AI/ML': 'bg-[#EAFBFF] text-[#0788B8] border-[#CBEFFF]',
  DevTools: 'bg-[#EAFBFF] text-[#0788B8] border-[#CBEFFF]',
  Mobile: 'bg-[#FFF6DF] text-[#A76900] border-[#FFE4A6]'
};

function formatCount(value) {
  const number = Number(value || 0);
  if (number >= 1000) return `${(number / 1000).toFixed(1)}k`;
  return String(number);
}

export default function PitchCard({ pitch, index = 0 }) {
  const navigate = useNavigate();
  const {
    getBuilderForPitch,
    comments,
    isFollowingBuilder,
    toggleFollow,
    currentUser
  } = usePitchLab();

  const builder = getBuilderForPitch(pitch);
  const pitchComments = comments.filter((comment) => comment.pitchId === pitch.id);
  const followed = isFollowingBuilder(pitch.builderId);
  const isOwn = currentUser.id === pitch.builderId;

  const handleCardClick = () => {
    navigate(`/pitch/${pitch.id}`);
  };

  const handleFollow = async (event) => {
    event.stopPropagation();
    await toggleFollow(pitch.builderId);
  };

  return (
    <motion.article
      className="group cursor-pointer overflow-hidden rounded-3xl border border-[#E7E9F6] bg-white/90 shadow-[0_18px_60px_rgba(21,26,61,0.08)] backdrop-blur transition-colors duration-200 hover:border-[#C8CCFF]"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, scale: 1.01 }}
      onClick={handleCardClick}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter') handleCardClick();
      }}
      role="button"
      aria-label={`Open pitch ${pitch.title}`}
    >
      <div className="relative h-52 overflow-hidden bg-[#EEF1FF]">
        <img
          src={pitch.mediaUrl}
          alt={pitch.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#151A3D]/72 via-[#151A3D]/10 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${categoryStyles[pitch.category] || categoryStyles.SaaS}`}>
            {pitch.category}
          </span>
          <span className="rounded-full border border-white/25 bg-white/88 px-3 py-1 text-xs font-bold text-[var(--text)] backdrop-blur">
            {pitch.stage}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-[0.18em] text-white/80">
              <Radio size={13} />
              Signal score {pitch.score}
            </p>
            <h3 className="mt-1 font-heading text-2xl font-bold tracking-tight text-white">{pitch.title}</h3>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/15 px-3 py-2 text-right text-white backdrop-blur-md">
            <p className="text-xs font-bold">Reviews</p>
            <p className="font-heading text-xl font-bold">{pitchComments.length}</p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <p className="text-sm leading-6 text-[var(--support)]">{pitch.tagline}</p>

        <div className="flex items-center gap-3 rounded-2xl bg-[#F7F8FC] p-3">
          {builder?.avatarUrl ? (
            <img src={builder.avatarUrl} alt={builder.fullName} className="h-11 w-11 rounded-2xl object-cover" />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary)] font-heading font-bold text-white">
              {builder?.fullName?.slice(0, 1)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-sm font-bold text-[var(--text)]">{builder?.fullName}</p>
            <p className="truncate text-xs text-[var(--support)]">{builder?.headline}</p>
          </div>
          {!isOwn && (
            <motion.button
              type="button"
              className={`rounded-full px-3 py-2 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${followed ? 'bg-[#EAF8F0] text-[var(--success)]' : 'bg-white text-[var(--text)] ring-1 ring-[#DCDFFE] hover:bg-[#EEF1FF]'}`}
              onClick={handleFollow}
              whileTap={{ scale: 0.97 }}
            >
              {followed ? 'Following' : (
                <span className="inline-flex items-center gap-1">
                  <UserPlus size={13} />
                  Follow
                </span>
              )}
            </motion.button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs font-bold text-[var(--support)]">
          <div className="rounded-2xl border border-[#E7E9F6] bg-white p-3">
            <Eye size={15} className="mb-1 text-[var(--primary)]" />
            {formatCount(pitch.views)} views
          </div>
          <div className="rounded-2xl border border-[#E7E9F6] bg-white p-3">
            <MessageCircle size={15} className="mb-1 text-[var(--secondary)]" />
            {pitchComments.length} signals
          </div>
          <div className="rounded-2xl border border-[#E7E9F6] bg-white p-3">
            <TrendingUp size={15} className="mb-1 text-[var(--accent)]" />
            Live trend
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#EEF1FF] pt-4">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary)]">
            <Sparkles size={14} />
            AI synthesis ready
          </span>
          <span className="inline-flex items-center gap-1 font-heading text-sm font-bold text-[var(--text)] transition group-hover:text-[var(--primary)]">
            Review
            <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
