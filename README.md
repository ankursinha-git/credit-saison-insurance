# Credit Saison — Protection Score Quiz

A gamified, mobile-first prototype for Credit Saison India to validate user interest in insurance products (health, life, motor) as a cross-sell opportunity from their lending platform.

## Quick Start

```bash
npm install
npm run dev
```

## What This Is

A **frontend-only prototype** — no backend, no APIs. It's a quiz-style flow that feels like a financial health check, not an insurance form. Designed to test:

- Do users **start** the quiz?
- Do they **complete** it?
- Do they **opt-in** at the end?
- Which insurance type generates more interest?

## User Flow

```
Landing Page (A/B variants)
    ↓
Category Selector (Health / Life / Motor)
    ↓
Gamified Quiz (5 questions, points + rewards)
    ↓
Results (Protection Score + Persona + Insights)
    ↓
Lead Capture (Navi-style, value-first)
    ↓
Thank You (Summary + Funnel Metrics)
```

## Key Features

### Gamification System
- **Points per answer** — each option earns +5 to +15 points based on protection value
- **Micro-rewards** — animated toast after each answer ("Smart move! +12 pts")
- **Protection Score** — 0-100 score calculated from all answers, shown as an animated gauge
- **Persona assignment** — "Family Protector", "Smart Planner", "Risk Taker", "Rising Star", "Safety First"
- **Progress nudges** — "Halfway there! Looking good" instead of "3/5"

### Three Insurance Flows
- **Health Shield** — coverage, age, existing insurance, conditions, budget
- **Life Shield** — life stage, dependents, income, existing cover, protection goals
- **Motor Shield** — vehicle type/age, usage, current insurance, priority

### Real-Time Personalization
- Inline insights appear during the quiz (not just at the end)
- Conditional insights based on specific answers
- Dynamic coverage calculation based on all answers
- Risk level assessment with contextual tips

### Conversion Design (Navi-style)
- Build value first (score, persona, insights) → ask for contact later
- CTA: "Get your personalized plans at launch" — NOT a direct sell
- Three interest options: launch notification, expert call, or both
- Skip option always available
- Privacy-first messaging throughout

### A/B Testing
- Landing page variant A: "What's your protection score?"
- Landing page variant B: "Are you actually protected?" (fear-of-loss + stats)

## Tech Stack

- **React 18** + **Vite**
- **Framer Motion** — page transitions, score gauge animation, reward toasts
- **CSS custom properties** — full theming
- **Context + useReducer** — state management with gamification state

## Project Structure

```
src/
├── main.jsx
├── App.jsx                    # Screen router
├── index.css                  # Global styles + CSS variables
├── context/
│   └── AppContext.jsx         # State (points, persona, screen, answers)
├── components/
│   ├── Landing.jsx            # Landing page (A/B variants)
│   ├── InsuranceSelector.jsx  # Category picker (3 cards)
│   ├── QuizFlow.jsx           # Quiz engine with gamification
│   ├── Results.jsx            # Score gauge + persona + coverage
│   ├── LeadCapture.jsx        # Value-first lead form
│   └── ThankYou.jsx           # Summary + debug metrics
├── data/
│   ├── healthQuestions.js     # Health quiz (5 questions + rewards)
│   ├── lifeQuestions.js       # Life quiz (5 questions + rewards)
│   ├── motorQuestions.js      # Motor quiz (5 questions + rewards)
│   └── recommendations.js    # Score calc, persona, coverage logic
├── utils/
│   └── analytics.js           # Mock event tracking
└── styles/
    ├── Landing.css
    ├── Quiz.css
    ├── Results.css
    └── LeadCapture.css
```

## Analytics (Mock)

```js
window.__CS_ANALYTICS__.getEvents()      // all events
window.__CS_ANALYTICS__.getFunnelMetrics() // funnel summary
```

Events tracked: `screen_view`, `cta_clicked`, `insurance_selected`, `question_answered` (with points), `quiz_completed`, `recommendation_generated` (with score + persona), `lead_submitted`.

## Deployment

```bash
npm run build
# Deploy dist/ to any static host (Vercel, Netlify, GitHub Pages, S3)
```
