import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Plus, Radio, Trophy, X, Zap } from 'lucide-react';
import { usePitchLab } from '../context/PitchLabContext.jsx';
import Drawer from './Drawer.jsx';
import Toast from './Toast.jsx';

function navClass({ isActive }) {
  return `rounded-full px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
    isActive
      ? 'bg-[#151A3D] text-white shadow-[0_10px_28px_rgba(21,26,61,0.18)]'
      : 'text-[var(--support)] hover:bg-white hover:text-[var(--text)]'
  }`;
}

export default function Layout() {
  const { openDrawer, recordVote, updateFilter } = usePitchLab();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const goExplore = () => {
    updateFilter('feedMode', 'explore');
    setMobileOpen(false);
    navigate('/');
  };

  const goFollowing = () => {
    updateFilter('feedMode', 'following');
    setMobileOpen(false);
    navigate('/following');
  };

  const openSubmit = () => {
    setMobileOpen(false);
    openDrawer('submitPitch');
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <motion.header
        className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-2xl"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <Link to="/" className="group flex items-center gap-3" onClick={() => updateFilter('feedMode', 'explore')}>
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[#151A3D] text-white shadow-[0_14px_34px_rgba(21,26,61,0.22)]">
              <Radio size={21} />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[var(--secondary)] ring-4 ring-white" />
            </div>
            <div>
              <p className="font-heading text-xl font-bold tracking-tight text-[var(--text)]">PitchLab</p>
              <p className="hidden text-xs font-bold uppercase tracking-[0.18em] text-[var(--support)] sm:block">Consensus Circuit</p>
            </div>
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-[#E7E9F6] bg-[#F7F8FC]/80 p-1 lg:flex">
            <NavLink to="/" end className={navClass} onClick={() => updateFilter('feedMode', 'explore')}>
              Explore
            </NavLink>
            <NavLink to="/following" className={navClass} onClick={() => updateFilter('feedMode', 'following')}>
              Following
            </NavLink>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <button type="button" className="btn-secondary" onClick={() => openDrawer('submitPitch')}>
              <Plus size={18} />
              Submit Pitch
            </button>
            <motion.button
              type="button"
              className="vote-button"
              onClick={() => recordVote('header_cta')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="vote-dot" />
              <Trophy size={18} />
              Vote for PitchLab
            </motion.button>
          </div>

          <button
            type="button"
            className="icon-button lg:hidden"
            aria-label="Open mobile menu"
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {mobileOpen && (
          <motion.div
            className="border-t border-[#E7E9F6] bg-white px-6 py-4 lg:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid gap-3">
              <button type="button" className={`mobile-nav-button ${location.pathname === '/' ? 'mobile-nav-active' : ''}`} onClick={goExplore}>
                <Zap size={18} />
                Explore
              </button>
              <button type="button" className={`mobile-nav-button ${location.pathname === '/following' ? 'mobile-nav-active' : ''}`} onClick={goFollowing}>
                <Radio size={18} />
                Following
              </button>
              <button type="button" className="btn-secondary justify-center" onClick={openSubmit}>
                <Plus size={18} />
                Submit Pitch
              </button>
              <button type="button" className="vote-button justify-center" onClick={() => {
                setMobileOpen(false);
                recordVote('mobile_header_cta');
              }}>
                <span className="vote-dot" />
                <Trophy size={18} />
                Vote for PitchLab
              </button>
            </div>
          </motion.div>
        )}
      </motion.header>

      <main>
        <Outlet />
      </main>

      <footer className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="flex flex-col justify-between gap-4 rounded-3xl border border-[#E7E9F6] bg-white/70 p-6 text-sm text-[var(--support)] shadow-[0_14px_42px_rgba(21,26,61,0.05)] sm:flex-row sm:items-center">
          <p>PitchLab routes founder feedback into consensus, action, and relationships.</p>
          <button type="button" className="inline-flex items-center gap-2 font-bold text-[var(--primary)] transition hover:text-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" onClick={() => recordVote('footer_cta')}>
            <Trophy size={16} />
            Support PitchLab
          </button>
        </div>
      </footer>

      <Drawer />
      <Toast />
    </div>
  );
}
