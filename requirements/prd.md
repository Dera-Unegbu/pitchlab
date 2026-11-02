# Product Requirements Document (PRD) for PitchLab

## 1. Introduction

PitchLab is an AI-powered peer-review community platform for founders, developers, and creators to share startup pitches, receive structured feedback, build relationships, and iterate rapidly. The platform transforms passive pitch browsing into an active review engine where every comment is categorized, quality-checked, and synthesized into actionable product guidance.

The core problem PitchLab solves is the lack of high-quality, actionable feedback for early-stage builders. Startup communities often produce scattered reactions such as “cool idea” or unstructured criticism. PitchLab introduces structured feedback categories, AI moderation, consensus summaries, and private follow-up conversations so builders can understand what to improve next.

PitchLab’s key value proposition is a low-friction loop: discover pitches, follow promising builders, leave categorized peer feedback, receive AI-generated synthesis, and continue deeper conversations through contextual private messaging. The platform also includes a product-led growth voting CTA designed to convert engaged users into TatbiQ competition supporters.

## 2. Features

### Core Features:

- **Pitch Discovery Feed:** A two-column responsive feed where users browse startup pitches with title, tagline, category, stage, builder avatar, demo/media preview, feedback summary preview, and follow actions.
- **Explore vs Following Tabs:** Users can switch between all public pitches and a personalized feed showing pitches from followed builders.
- **Category Filters:** Users can filter pitches by `All Categories`, `SaaS`, `AI/ML`, `DevTools`, and `Mobile`.
- **Pitch Detail View:** Clicking a pitch opens a dedicated detail experience with full description, demo URL, embedded video/image area, builder info, AI consensus summary, structured comments, and private reply actions.
- **Structured Public Comments:** Users submit feedback with a category selector for `UI/UX`, `Business Model`, `Tech Stack`, or `General`. Comments are displayed with category badges, upvotes, author details, and reply actions.
- **AI Comment Moderation & Auto-Tagging:** On comment submission, the app simulates AI moderation using the PitchLab Quality Guard logic: constructiveness scoring, toxicity rejection, and category assignment when needed.
- **AI Feedback Consensus Summary:** When a pitch has 3 or more approved comments, the detail view displays a structured AI summary with:
  - Top Strengths
  - High-Priority UX/Product Risks
  - Suggested Next Steps
- **Simple Follow System:** Users can follow or unfollow pitch builders from pitch cards, the sidebar, and pitch detail views with optimistic UI feedback.
- **Private Messaging Drawer:** Clicking `Reply Privately ✉️` opens a right-side drawer showing a pitch-specific private thread between the current user and the reviewer, including AI-suggested conversation starter chips.
- **DM Contextual Conversation Starter:** The app generates two short follow-up questions based on the selected comment to help the founder start a focused conversation.
- **Viral Voting Mechanism:** Prominent `⭐ Vote for PitchLab` CTAs appear in the navbar, sidebar, and post-action toast. Clicking opens the TatbiQ vote link and records vote intent locally.
- **Submit Pitch Flow:** Users can submit a new startup pitch with title, tagline, description, demo URL, video URL, category, and stage. On success, the pitch appears in the feed and triggers a voting CTA toast.

### Additional Features:

- **Top Builders Sidebar:** A sidebar module lists high-signal builders with follower counts, headlines, avatars, and follow buttons.
- **Live Voter Counter:** Sidebar displays a simulated live supporter count that increments after voting actions.
- **Post-Action Toasts:** After submitting a pitch or approved comment, users see a toast encouraging them to support PitchLab in the TatbiQ competition.
- **Upvote Comments:** Users can upvote structured comments to surface useful feedback.
- **Responsive Navigation:** Navbar includes `PitchLab`, `Explore`, `Following`, `+ Submit Pitch`, and `⭐ Vote for PitchLab` links/actions across desktop and mobile layouts.

## 3. User Stories

- As a founder, I want to submit my startup pitch so that other builders can review it and help me improve faster.
- As a reviewer, I want to leave categorized feedback so that my comments are actionable and easy for founders to interpret.
- As a founder, I want to see an AI-generated consensus summary so that I can quickly understand common strengths, risks, and next steps.
- As a builder, when I click `Reply Privately ✉️`, I want a contextual messaging drawer with suggested questions so that I can continue the feedback conversation naturally.
- As an engaged user, when I click `⭐ Vote for PitchLab`, I want the TatbiQ voting page to open and a confirmation state to appear so that I know my support was counted.

## 3.5. Interactive Elements

**Button Specifications:**

- **Explore:** Navigates to the main feed route `/` → Sets feed mode to `explore` → Displays all pitches sorted by newest first → Highlights the active navigation item.
- **Following:** Navigates to `/following` → Sets feed mode to `following` → Displays pitches from followed builders only → If no builders are followed, shows a populated recommendation panel with top builders and a CTA to explore.
- **+ Submit Pitch:** Opens the right-side `Submit Pitch Drawer` → Collects `title`, `tagline`, `description`, `demo_url`, `video_embed_url`, `category`, `stage` → Validates required fields and URL format → On success: saves pitch to localStorage, closes drawer, shows “Pitch submitted successfully” toast, and triggers vote CTA toast → On error: shows field-specific validation messages.
- **⭐ Vote for PitchLab:** Opens `https://tatbiq.ai/dubai-ai-festival/entry/pitchlab-community-777777` in a new tab → Stores vote event with `source_trigger` such as `header_cta`, `post_comment`, or `post_pitch` → Increments local voter counter → Shows “Thanks for supporting PitchLab!” toast.
- **+ Follow:** Toggles follow state for a builder → On click: changes immediately to `✓ Following` with optimistic UI → Inserts/removes local follow record keyed by current user and builder → On success: updates sidebar and following feed → On error: reverts state and shows “Could not update follow state.”
- **Pitch Card:** Clicking the card body navigates to `/pitch/:pitchId` → Displays complete pitch details, comments, AI summary, and builder context.
- **Demo Link:** Opens `demo_url` in a new tab → If no demo URL exists, button is disabled and displays “Demo coming soon.”
- **Submit Feedback:** Runs local AI moderation simulation → Collects `category`, `content`, `pitch_id`, `author_id` → Validates content length minimum 30 characters and no blocked toxic phrases → On success: appends approved comment, updates AI summary if comment count is 3+, shows “Feedback published” toast, then shows voting CTA toast → On error: displays moderation reason such as “Please add more actionable detail.”
- **Upvote 🔼:** Increments selected comment’s upvote count once per session/user → Persists to localStorage → Shows updated count inline.
- **Reply Privately ✉️:** Opens `Private Message Drawer` → Preselects pitch, builder, reviewer, and source comment → Generates 2 AI prompt chips → Allows sending messages in the private thread.
- **AI Prompt Chip:** Clicking a suggested question fills the message input with that question → User can edit before sending.
- **Send Message:** Submits message text → Validates non-empty content under 500 characters → Appends to thread with timestamp → Clears input → Shows “Message sent” inline confirmation.
- **Filter Category Pills:** Clicking `All`, `UI/UX`, `Business`, `Tech`, or `General` filters visible comments or pitch feed content without page reload.
- **Close Drawer:** Closes the active drawer → Unsaved form changes prompt a small confirmation dialog if any field has been edited.

**Form Specifications:**

- **Submit Pitch Form:** Fields `title`, `tagline`, `description`, `demo_url`, `video_embed_url`, `category`, `stage` → Validation: title 5–150 characters, tagline 10–255 characters, description minimum 80 characters, URLs must start with `https://`, category/stage required → Submit action creates a new pitch record with current user as builder → Success state redirects to the new pitch detail page and shows success/vote toast → Error handling displays inline messages per field.
- **Structured Feedback Form:** Fields `category`, `content` → Validation: category required, content minimum 30 characters, content must include at least one actionable phrase or concrete suggestion based on simple keyword/length heuristics → Submit action simulates AI quality gate and saves approved comment → Success state clears textarea and updates comment list → Error handling displays moderation reason.
- **Private Message Form:** Fields `message_content` → Validation: non-empty, maximum 500 characters → Submit action appends message to the selected thread → Success state scrolls drawer thread to the newest message → Error handling shows “Message must be between 1 and 500 characters.”

**Panel / Drawer Specifications:**

- **Submit Pitch Drawer:** Triggered by `+ Submit Pitch` → Slides in from the right with dimmed backdrop, sticky header, scrollable body, and sticky footer actions → Displays pitch creation form → User actions: `Publish Pitch`, `Save Draft`, `Cancel` → Close behavior: closes on `Esc`, backdrop click, or cancel; prompts if unsaved changes exist → Data flow: writes new pitch to `pitchlab_pitches`.
- **Private Message Drawer:** Triggered by `Reply Privately ✉️` → Displays pitch context, reviewer card, source comment, AI suggested prompt chips, message history, and message input → User actions: send message, click prompt chip, close drawer → Close behavior: closes without losing sent messages → Data flow: reads/writes messages for matching `pitch_id`, `sender_id`, and `recipient_id`.
- **Vote CTA Toast:** Triggered after approved comment submission, pitch submission, and vote button clicks → Displays “Enjoying PitchLab? Help us win TatbiQ with a 1-click vote!” → User actions: `Vote Now`, `Dismiss` → Close behavior: auto-dismiss after 8 seconds unless hovered → Data flow: writes competition vote intent when CTA is clicked.
- **Confirm Discard Dialog:** Triggered only when closing a drawer with unsaved form data → Displays “Discard unsaved changes?” → User actions: `Keep Editing`, `Discard` → Close behavior: `Discard` closes drawer; `Keep Editing` returns to form.

## 4. Design & Styling

### 4.0 Design Direction

- **Direction:** Consensus Circuit
- **Why it fits:** PitchLab should feel like a bright, high-trust founder operating room where raw startup ideas are routed through structured peer signals, AI synthesis, and relationship-building momentum.
- **Signature elements (developer MUST implement all):**
  1. **Signal-Routing Hero Band:** At the top of the feed, implement a wide rounded `bg-[#F6F7FF]` hero/banner with thin neon-violet connector lines drawn using absolutely positioned divs/SVG strokes behind floating pitch/comment chips; use `rounded-[2rem]`, `border border-[#DADDFE]`, and subtle `shadow-[0_24px_80px_rgba(83,70,255,0.10)]`.
  2. **AI Consensus Console:** In pitch detail, the AI summary box must look like a premium advisory terminal on a light surface: `bg-white`, `border border-[#DCDFFE]`, `rounded-3xl`, left rail gradient `from-[#635BFF] to-[#18C7FF]`, section labels in uppercase tracking, and three distinct bullet clusters for strengths, risks, and next steps.
  3. **Category Feedback Tabs as Circuit Nodes:** Comment category filters should be pill-shaped nodes connected by a faint horizontal line; active tab uses `bg-[#151A3D] text-white`, inactive tabs use `bg-white text-[#59607A] border border-[#E1E5F5]`.
  4. **Founder Trust Cards:** Pitch cards and top-builder cards include real imagery/avatars, monogram fallbacks, follower counts, status badges, and micro trend text; cards use `rounded-3xl`, `bg-white/90`, `border border-[#E7E9F6]`, and soft hover lift.
  5. **Glowing Vote Beacon:** The `⭐ Vote for PitchLab` CTA uses a controlled violet/cyan glow, `bg-gradient-to-r from-[#635BFF] to-[#18C7FF]`, white text, `shadow-[0_0_30px_rgba(99,91,255,0.35)]`, and a tiny pulsing dot indicating live competition momentum.

### 4.1 Color Palette

- Primary Color: #635BFF (Signal Violet)
- Secondary Color: #18C7FF (Consensus Cyan)
- Accent Color: #FFB020 (Momentum Gold)
- Background Color: #F7F8FC (Founder Cloud)
- Text Color: #151A3D (Deep Ink)
- Surface/Card Color: #FFFFFF (Clean Panel)
- Muted Surface Color: #EEF1FF (Soft Circuit)
- Supporting Text Color: #59607A (Advisor Slate)
- Success Color: #18A058 (Approved Green)
- Risk Color: #E5484D (Moderation Red)

### 4.2 Typography

- Heading Font: 'Space Grotesk'
- Body Font: 'DM Sans'
- The developer MUST load both via Google Fonts @import at the top of index.css and set :root CSS variables --font-heading and --font-body

### 4.3 Visual Style

- Use a bright premium SaaS/community interface: `bg-[#F7F8FC]` canvas, white elevated cards, soft violet/cyan gradients, and crisp dark text.
- Layout rhythm should use generous desktop spacing: `max-w-7xl mx-auto px-6 lg:px-8 py-8`, with major sections separated by `gap-8`.
- Cards should use `rounded-3xl`, `border border-[#E7E9F6]`, and layered shadows such as `shadow-[0_18px_60px_rgba(21,26,61,0.08)]`.
- Primary buttons should be rounded-full with gradient fill, while secondary buttons use white background, subtle border, and dark text.
- Feedback category badges should be color-coded: UI/UX violet, Business gold, Tech cyan, General slate.

### 4.4 Page Header / Hero

UTILITY-style community product with public discovery feed: use an App-Shell-inspired responsive web layout with a compact premium hero/banner band above the feed, not a phone mockup. The hero/banner should use the first Section 6 image as a soft masked visual panel on the right and a signal-routing graphic on the left. Navigation remains fixed/sticky at the top with a translucent white backdrop blur and visible links to Explore and Following.

### 4.6 Animation Choreography (framer-motion is PREINSTALLED - the developer MUST use it)

- **Hero entrance:** Navbar fades down over `0.35s`; hero title slides up `24px` over `0.55s` with ease `[0.22, 1, 0.36, 1]`; floating signal chips stagger in every `0.08s` with slight scale from `0.96` to `1`.
- **Scroll reveals:** Pitch cards and sidebar modules use `whileInView` with `opacity: 0 → 1`, `y: 22 → 0`, duration `0.45s`, stagger `0.06s`, viewport `{ once: true, amount: 0.2 }`.
- **Hover micro-interactions:** Pitch cards lift `y: -5`, scale `1.01`, and intensify border color to `#C8CCFF`; vote button glow expands slightly with scale `1.03`; follow buttons compress to scale `0.97` on tap.
- **Special moments:** The vote beacon dot pulses every `1.8s`; AI Consensus Console renders its three summary groups with a left-to-right gradient rail wipe over `0.6s` when a pitch detail page opens.

## 5. Technical Implementation

### 5.1 Directory Structure

```
/src
  App.jsx
  main.jsx
  index.css
  components/
    Layout.jsx
    PitchCard.jsx
    Sidebar.jsx
    Drawer.jsx
    Toast.jsx
    CommentSection.jsx
  pages/
    FeedPage.jsx
    PitchDetailPage.jsx
  hooks/
    useSupabase.js
  data/
    app-data.json
/index.html
```

### 5.2 Data Persistence
- **Data Layer:** needed via /src/hooks/useSupabase.js
- **Authentication:** needed (Supabase Auth unified hooks)
- **LocalStorage Keys:**
  - `pitchlab_current_user`: Current authenticated/demo user profile and session fallback
  - `pitchlab_pitches`: Submitted and seeded pitch records
  - `pitchlab_comments`: Structured public comments and moderation results
  - `pitchlab_messages`: Private pitch-specific message threads
  - `pitchlab_follows`: Follow relationships between current user and builders
  - `pitchlab_votes`: Competition vote events and voter counter state
- **JSON File Locations:**
  - `/src/data/app-data.json`: Seed users, pitches, comments, messages, follows, and competition vote counter (imported as ES modules, never fetched from public/)
- **Requires Database:** false (client-side Supabase when configured)

### 5.3 State Management

- Use React Context API for global state
- **Global State Structure:**
  - `currentUser`: Active logged-in/demo user with id, full_name, handle, avatar_url, bio, and headline.
  - `pitches`: Array of pitch objects including builder reference, media URLs, category, stage, timestamps, and engagement metadata.
  - `comments`: Array of approved public comments with moderation metadata, category, upvotes, and author reference.
  - `messages`: Array of private messages grouped by pitch and participants.
  - `follows`: Array of follower-builder relationships used for follow buttons and Following feed.
  - `competitionVotes`: Vote events and aggregate voter count.
  - `activeDrawer`: Drawer state for `submitPitch` or `privateMessage`.
  - `toastQueue`: Active success/error/vote CTA notifications.
  - `filters`: Current feed mode, category filter, and comment category filter.
  - `authState`: Login/session state and lightweight role-free user identity.

- **Component Access:**
  All pages and components access global state/actions through the unified data hook from `/src/hooks/useSupabase.js`. The hook exposes CRUD-style methods for pitches, comments, follows, messages, vote events, moderation simulation, synthesis generation, and toast dispatching.

### 5.4 Component Architecture

**Key Components (one line each - cover EVERY file from Section 5.1):**

- **App**: Defines routes, provides global state provider, and renders layout with feed and pitch detail pages.
- **main**: React/Vite entry point that mounts the app.
- **index.css**: Global Tailwind styles, Google Font imports, CSS variables, base body styles, and custom utility classes.
- **Layout**: Sticky navbar, responsive navigation, global action buttons, page shell, and mobile menu.
- **PitchCard**: Reusable card for displaying pitch preview, builder metadata, badges, follow action, media thumbnail, and comment/vote indicators.
- **Sidebar**: Displays top builders, follow controls, live voter counter, and PitchLab competition CTA.
- **Drawer**: Shared right-side slide-over drawer for submit pitch and private messaging flows.
- **Toast**: Global toast stack for success, error, moderation, and vote CTA notifications.
- **CommentSection**: Structured comment tabs, comment list, comment form, upvote actions, and private reply trigger.
- **FeedPage**: Main Explore/Following feed with compact hero/banner, tabs, category filters, pitch list, and sidebar.
- **PitchDetailPage**: Full pitch view with description, media/demo link, AI consensus summary, comments, builder profile, and messaging trigger.
- **useSupabase**: Unified data/auth/local persistence hook with mock AI moderation, synthesis, DM prompt generation, and CRUD actions.
- **app-data.json**: Seed data for users, pitches, comments, messages, follows, and vote counter.

**Component Hierarchy:**

```
App
 └─ Layout
     ├─ FeedPage
     │   ├─ PitchCard
     │   └─ Sidebar
     ├─ PitchDetailPage
     │   ├─ CommentSection
     │   ├─ Sidebar
     │   └─ Drawer
     ├─ Drawer
     └─ Toast
```

## 6. Images & Assets

IMAGE_SEARCH_CRITERIA: startup founders workspace, product design team, developer coding laptop, founder portrait office, startup pitch presentation, networking meetup founders

2. [Product Design Team](https://images.unsplash.com/photo-1587440871875-191322ee64b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NTEwMDV8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwZGVzaWduJTIwdGVhbXxlbnwxfDB8fHwxNzkzMTg2NTE2fDA&ixlib=rb-4.1.0&q=80&w=1080)
3. [Developer Coding Laptop](https://images.unsplash.com/photo-1587620962725-abab7fe55159?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NTEwMDV8MHwxfHNlYXJjaHwxfHxkZXZlbG9wZXIlMjBjb2RpbmclMjBsYXB0b3B8ZW58MXwwfHx8MTc5MzE4NjUxNnww&ixlib=rb-4.1.0&q=80&w=1080)
4. [Founder Portrait Office](https://images.unsplash.com/photo-1758691737644-ef8be18256c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NTEwMDV8MHwxfHNlYXJjaHwxfHxmb3VuZGVyJTIwcG9ydHJhaXQlMjBvZmZpY2V8ZW58MXwwfHx8MTc5MzE4NjUxNnww&ixlib=rb-4.1.0&q=80&w=1080)
5. [Startup Pitch Presentation](https://images.unsplash.com/photo-1505373877841-8d25f7d46678?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NTEwMDV8MHwxfHNlYXJjaHwxfHxzdGFydHVwJTIwcGl0Y2glMjBwcmVzZW50YXRpb258ZW58MXwwfHx8MTc5MzE4NjUxNnww&ixlib=rb-4.1.0&q=80&w=1080)
6. [Networking Meetup Founders](https://images.unsplash.com/photo-1675716921224-e087a0cca69a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NTEwMDV8MHwxfHNlYXJjaHwxfHxuZXR3b3JraW5nJTIwbWVldHVwJTIwZm91bmRlcnN8ZW58MXwwfHx8MTc5MzE4NjUxNnww&ixlib=rb-4.1.0&q=80&w=1080)