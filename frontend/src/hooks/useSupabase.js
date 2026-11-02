import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { isSupabaseConfigured } from '../lib/supabase.js';
import seedData from '../data/app-data.json';

export const STORAGE_KEYS = {
  currentUser: 'pitchlab_current_user',
  pitches: 'pitchlab_pitches',
  comments: 'pitchlab_comments',
  messages: 'pitchlab_messages',
  follows: 'pitchlab_follows',
  votes: 'pitchlab_votes'
};

const voteUrl = 'https://tatbiq.ai/dubai-ai-festival/entry/pitchlab-community-777777';

const categories = ['SaaS', 'AI/ML', 'DevTools', 'Mobile'];
const commentCategories = ['UI/UX', 'Business Model', 'Tech Stack', 'General'];
const toxicPhrases = ['stupid', 'idiot', 'trash', 'garbage', 'worthless', 'shut up'];
const actionableTerms = [
  'suggest',
  'consider',
  'recommend',
  'add',
  'show',
  'clarify',
  'test',
  'improve',
  'include',
  'focus',
  'reduce',
  'explain',
  'next step',
  'pricing',
  'workflow',
  'buyer',
  'demo'
];

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function readStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  return safeParse(window.localStorage.getItem(key), fallback);
}

function writeStorage(key, value) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function uid(prefix) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function isValidHttpsUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

function normalizeText(value) {
  return String(value || '').trim();
}

function getInitialCurrentUser() {
  return readStorage(STORAGE_KEYS.currentUser, seedData.currentUser);
}

function getInitialPitches() {
  return readStorage(STORAGE_KEYS.pitches, seedData.pitches);
}

function getInitialComments() {
  return readStorage(STORAGE_KEYS.comments, seedData.comments);
}

function getInitialMessages() {
  return readStorage(STORAGE_KEYS.messages, seedData.messages);
}

function getInitialFollows() {
  return readStorage(STORAGE_KEYS.follows, seedData.follows);
}

function getInitialVotes() {
  return readStorage(STORAGE_KEYS.votes, seedData.competitionVotes);
}

function showVoteCtaToast(sourceTrigger, recordVote) {
  toast.custom(
    (t) => (
      null
    ),
    { duration: 1 }
  );
  toast(
    (t) => {
      const container = document.createElement('div');
      return container;
    },
    { duration: 1 }
  );
  toast.success('Enjoying PitchLab? Help us win TatbiQ with a 1-click vote!', {
    duration: 8000,
    icon: null
  });
  window.setTimeout(() => {
    toast(
      'Use the glowing Vote for PitchLab button to support the community.',
      { duration: 5000, icon: null }
    );
  }, 350);
}

function validatePitchForm(form) {
  const errors = {};
  const title = normalizeText(form.title);
  const tagline = normalizeText(form.tagline);
  const description = normalizeText(form.description);

  if (title.length < 5 || title.length > 150) errors.title = 'Title must be between 5 and 150 characters.';
  if (tagline.length < 10 || tagline.length > 255) errors.tagline = 'Tagline must be between 10 and 255 characters.';
  if (description.length < 80) errors.description = 'Description must be at least 80 characters.';
  if (!form.category || !categories.includes(form.category)) errors.category = 'Choose a valid category.';
  if (!form.stage) errors.stage = 'Stage is required.';
  if (form.demoUrl && !isValidHttpsUrl(form.demoUrl)) errors.demoUrl = 'Demo URL must start with https://';
  if (form.videoEmbedUrl && !isValidHttpsUrl(form.videoEmbedUrl)) errors.videoEmbedUrl = 'Video URL must start with https://';

  return errors;
}

function moderateComment({ category, content }) {
  const clean = normalizeText(content);
  const lower = clean.toLowerCase();

  if (!category || !commentCategories.includes(category)) {
    return { approved: false, reason: 'Please choose a feedback category.' };
  }

  if (clean.length < 30) {
    return { approved: false, reason: 'Please add more actionable detail.' };
  }

  if (toxicPhrases.some((phrase) => lower.includes(phrase))) {
    return { approved: false, reason: 'Feedback rejected because it contains language that is not constructive.' };
  }

  const hasActionableTerm = actionableTerms.some((term) => lower.includes(term));
  const enoughDetail = clean.length >= 90;

  if (!hasActionableTerm && !enoughDetail) {
    return { approved: false, reason: 'Please include a concrete suggestion, recommendation, or next step.' };
  }

  let autoTag = category;
  if (lower.includes('pricing') || lower.includes('buyer') || lower.includes('revenue')) autoTag = 'Business Model';
  if (lower.includes('interface') || lower.includes('workflow') || lower.includes('screen') || lower.includes('ux')) autoTag = 'UI/UX';
  if (lower.includes('api') || lower.includes('stack') || lower.includes('integration') || lower.includes('data')) autoTag = 'Tech Stack';

  return {
    approved: true,
    score: Math.min(98, Math.max(72, Math.round(clean.length / 3) + (hasActionableTerm ? 26 : 10))),
    autoTag
  };
}

function createSummary(comments) {
  const approved = Array.isArray(comments) ? comments : [];
  const categoriesSeen = [...new Set(approved.map((comment) => comment.category))];

  return {
    strengths: [
      categoriesSeen.includes('Business Model')
        ? 'Reviewers see a credible wedge and a monetization path that can be tested with early customers.'
        : 'Reviewers agree the pitch communicates a focused customer problem with strong founder-market intent.',
      'The strongest comments point to a clear opportunity to turn the demo into a more decision-ready narrative.'
    ],
    risks: [
      categoriesSeen.includes('UI/UX')
        ? 'The current experience may need a more explicit before-and-after workflow to make value instantly legible.'
        : 'The pitch should reduce ambiguity around the first user journey and the activation moment.',
      categoriesSeen.includes('Tech Stack')
        ? 'Technical buyers will want more proof that integrations, data quality, and implementation complexity are manageable.'
        : 'The team should make the proof layer more concrete so reviewers can evaluate feasibility faster.'
    ],
    nextSteps: [
      'Add one concrete scenario that shows the product before, during, and after the core workflow.',
      'Clarify the primary buyer, the first paid use case, and the success metric for the next pilot.',
      'Use reviewer replies to pressure-test pricing, onboarding friction, and the highest-risk assumption.'
    ]
  };
}

function createPromptChips(comment) {
  const category = comment?.category || 'General';
  if (category === 'UI/UX') {
    return [
      'Which screen would you change first to make the value clearer?',
      'Would a before-and-after demo flow address your main concern?'
    ];
  }
  if (category === 'Business Model') {
    return [
      'What pricing test would you run with the first ten customers?',
      'Which buyer persona do you think should be prioritized first?'
    ];
  }
  if (category === 'Tech Stack') {
    return [
      'Which technical proof point would reduce implementation risk for you?',
      'What integration detail would you expect to see in the demo?'
    ];
  }
  return [
    'What is the most useful next improvement you would recommend?',
    'Would you be open to reviewing a revised version of this pitch?'
  ];
}

function buildVoteIntent(sourceTrigger) {
  return {
    id: uid('vote'),
    sourceTrigger,
    createdAt: nowIso()
  };
}

export function useSupabaseState() {
  const [currentUser, setCurrentUser] = useState(getInitialCurrentUser);
  const [users] = useState(seedData.users);
  const [assets] = useState(seedData.assets);
  const [pitches, setPitches] = useState(getInitialPitches);
  const [comments, setComments] = useState(getInitialComments);
  const [messages, setMessages] = useState(getInitialMessages);
  const [follows, setFollows] = useState(getInitialFollows);
  const [competitionVotes, setCompetitionVotes] = useState(getInitialVotes);
  const [activeDrawer, setActiveDrawer] = useState(null);
  const [filters, setFilters] = useState({
    feedMode: 'explore',
    category: 'All Categories',
    commentCategory: 'All'
  });
  const [authState] = useState({
    isAuthenticated: true,
    provider: 'demo',
    role: 'builder'
  });

  const getPitches = useCallback(async () => {
    if (isSupabaseConfigured()) {
      return pitches;
    }
    return pitches;
  }, [pitches]);

  const getComments = useCallback(async () => {
    if (isSupabaseConfigured()) {
      return comments;
    }
    return comments;
  }, [comments]);

  const getMessages = useCallback(async () => {
    if (isSupabaseConfigured()) {
      return messages;
    }
    return messages;
  }, [messages]);

  const getFollows = useCallback(async () => {
    if (isSupabaseConfigured()) {
      return follows;
    }
    return follows;
  }, [follows]);

  const getUserById = useCallback((userId) => {
    if (currentUser.id === userId) return currentUser;
    return users.find((user) => user.id === userId);
  }, [currentUser, users]);

  const getBuilderForPitch = useCallback((pitch) => {
    return getUserById(pitch?.builderId);
  }, [getUserById]);

  const isFollowingBuilder = useCallback((builderId) => {
    return follows.some((follow) => follow.followerId === currentUser.id && follow.builderId === builderId);
  }, [currentUser.id, follows]);

  const openDrawer = useCallback((type, payload = {}) => {
    setActiveDrawer({ type, payload });
  }, []);

  const closeDrawer = useCallback(() => {
    setActiveDrawer(null);
  }, []);

  const updateFilter = useCallback((key, value) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
  }, []);

  const submitPitch = useCallback(async (form) => {
    if (isSupabaseConfigured()) {
      await Promise.resolve();
    }

    const errors = validatePitchForm(form);
    if (Object.keys(errors).length > 0) {
      toast.error('Please fix the highlighted fields.');
      return { ok: false, errors };
    }

    const newPitch = {
      id: uid('pitch'),
      title: normalizeText(form.title),
      tagline: normalizeText(form.tagline),
      description: normalizeText(form.description),
      demoUrl: normalizeText(form.demoUrl),
      videoEmbedUrl: normalizeText(form.videoEmbedUrl),
      category: form.category,
      stage: form.stage,
      mediaUrl: form.mediaUrl || seedData.assets.pitchImage,
      builderId: currentUser.id,
      createdAt: nowIso(),
      views: 0,
      score: 81
    };

    const nextPitches = [newPitch, ...pitches];
    setPitches(nextPitches);
    writeStorage(STORAGE_KEYS.pitches, nextPitches);
    toast.success('Pitch submitted successfully');
    showVoteCtaToast('post_pitch');
    return { ok: true, pitch: newPitch };
  }, [currentUser.id, pitches]);

  const saveDraft = useCallback(async (form) => {
    if (isSupabaseConfigured()) {
      await Promise.resolve();
    }
    writeStorage('pitchlab_pitch_draft', {
      ...form,
      savedAt: nowIso()
    });
    toast.success('Draft saved');
    return { ok: true };
  }, []);

  const toggleFollow = useCallback(async (builderId) => {
    if (builderId === currentUser.id) {
      toast.error('You are viewing your own builder profile.');
      return { ok: false };
    }

    try {
      if (isSupabaseConfigured()) {
        await Promise.resolve();
      }

      const exists = follows.some((follow) => follow.followerId === currentUser.id && follow.builderId === builderId);
      const nextFollows = exists
        ? follows.filter((follow) => !(follow.followerId === currentUser.id && follow.builderId === builderId))
        : [
            ...follows,
            {
              id: uid('follow'),
              followerId: currentUser.id,
              builderId,
              createdAt: nowIso()
            }
          ];

      setFollows(nextFollows);
      writeStorage(STORAGE_KEYS.follows, nextFollows);
      toast.success(exists ? 'Builder unfollowed' : 'Builder followed');
      return { ok: true };
    } catch (error) {
      toast.error('Could not update follow state.');
      return { ok: false, error };
    }
  }, [currentUser.id, follows]);

  const submitComment = useCallback(async ({ pitchId, category, content }) => {
    if (isSupabaseConfigured()) {
      await Promise.resolve();
    }

    const moderation = moderateComment({ category, content });

    if (!moderation.approved) {
      toast.error(moderation.reason);
      return { ok: false, reason: moderation.reason };
    }

    const newComment = {
      id: uid('comment'),
      pitchId,
      authorId: currentUser.id,
      category: moderation.autoTag || category,
      content: normalizeText(content),
      upvotes: 0,
      upvotedBy: [],
      moderation: {
        status: 'approved',
        score: moderation.score,
        autoTag: moderation.autoTag || category
      },
      createdAt: nowIso()
    };

    const nextComments = [newComment, ...comments];
    setComments(nextComments);
    writeStorage(STORAGE_KEYS.comments, nextComments);
    toast.success('Feedback published');
    showVoteCtaToast('post_comment');
    return { ok: true, comment: newComment };
  }, [comments, currentUser.id]);

  const upvoteComment = useCallback(async (commentId) => {
    if (isSupabaseConfigured()) {
      await Promise.resolve();
    }

    let alreadyVoted = false;
    const nextComments = comments.map((comment) => {
      if (comment.id !== commentId) return comment;
      const upvotedBy = Array.isArray(comment.upvotedBy) ? comment.upvotedBy : [];
      if (upvotedBy.includes(currentUser.id)) {
        alreadyVoted = true;
        return comment;
      }
      return {
        ...comment,
        upvotes: Number(comment.upvotes || 0) + 1,
        upvotedBy: [...upvotedBy, currentUser.id]
      };
    });

    if (alreadyVoted) {
      toast.error('You already upvoted this feedback.');
      return { ok: false };
    }

    setComments(nextComments);
    writeStorage(STORAGE_KEYS.comments, nextComments);
    return { ok: true };
  }, [comments, currentUser.id]);

  const sendMessage = useCallback(async ({ pitchId, recipientId, sourceCommentId, content }) => {
    if (isSupabaseConfigured()) {
      await Promise.resolve();
    }

    const clean = normalizeText(content);
    if (clean.length < 1 || clean.length > 500) {
      toast.error('Message must be between 1 and 500 characters.');
      return { ok: false, reason: 'Message must be between 1 and 500 characters.' };
    }

    const newMessage = {
      id: uid('message'),
      pitchId,
      senderId: currentUser.id,
      recipientId,
      sourceCommentId,
      content: clean,
      createdAt: nowIso()
    };

    const nextMessages = [...messages, newMessage];
    setMessages(nextMessages);
    writeStorage(STORAGE_KEYS.messages, nextMessages);
    return { ok: true, message: newMessage };
  }, [currentUser.id, messages]);

  const recordVote = useCallback(async (sourceTrigger = 'header_cta') => {
    if (isSupabaseConfigured()) {
      await Promise.resolve();
    }

    const event = buildVoteIntent(sourceTrigger);
    const nextVotes = {
      counter: Number(competitionVotes.counter || 0) + 1,
      events: [...(Array.isArray(competitionVotes.events) ? competitionVotes.events : []), event]
    };

    setCompetitionVotes(nextVotes);
    writeStorage(STORAGE_KEYS.votes, nextVotes);

    if (typeof window !== 'undefined') {
      window.open(voteUrl, '_blank', 'noopener,noreferrer');
    }

    toast.success('Thanks for supporting PitchLab!');
    return { ok: true, event };
  }, [competitionVotes]);

  const generateSummary = useCallback((pitchId) => {
    const pitchComments = comments.filter((comment) => comment.pitchId === pitchId && comment.moderation?.status === 'approved');
    if (pitchComments.length < 3) return null;
    return createSummary(pitchComments);
  }, [comments]);

  const generatePromptChips = useCallback((comment) => {
    return createPromptChips(comment);
  }, []);

  const resetDemoData = useCallback(async () => {
    if (isSupabaseConfigured()) {
      await Promise.resolve();
    }
    setCurrentUser(seedData.currentUser);
    setPitches(seedData.pitches);
    setComments(seedData.comments);
    setMessages(seedData.messages);
    setFollows(seedData.follows);
    setCompetitionVotes(seedData.competitionVotes);
    writeStorage(STORAGE_KEYS.currentUser, seedData.currentUser);
    writeStorage(STORAGE_KEYS.pitches, seedData.pitches);
    writeStorage(STORAGE_KEYS.comments, seedData.comments);
    writeStorage(STORAGE_KEYS.messages, seedData.messages);
    writeStorage(STORAGE_KEYS.follows, seedData.follows);
    writeStorage(STORAGE_KEYS.votes, seedData.competitionVotes);
    toast.success('Demo data restored');
    return { ok: true };
  }, []);

  return useMemo(() => ({
    currentUser,
    users,
    assets,
    pitches,
    comments,
    messages,
    follows,
    competitionVotes,
    activeDrawer,
    filters,
    authState,
    categories,
    commentCategories,
    voteUrl,
    getPitches,
    getComments,
    getMessages,
    getFollows,
    getUserById,
    getBuilderForPitch,
    isFollowingBuilder,
    openDrawer,
    closeDrawer,
    updateFilter,
    submitPitch,
    saveDraft,
    toggleFollow,
    submitComment,
    upvoteComment,
    sendMessage,
    recordVote,
    generateSummary,
    generatePromptChips,
    resetDemoData
  }), [
    currentUser,
    users,
    assets,
    pitches,
    comments,
    messages,
    follows,
    competitionVotes,
    activeDrawer,
    filters,
    authState,
    getPitches,
    getComments,
    getMessages,
    getFollows,
    getUserById,
    getBuilderForPitch,
    isFollowingBuilder,
    openDrawer,
    closeDrawer,
    updateFilter,
    submitPitch,
    saveDraft,
    toggleFollow,
    submitComment,
    upvoteComment,
    sendMessage,
    recordVote,
    generateSummary,
    generatePromptChips,
    resetDemoData
  ]);
}
