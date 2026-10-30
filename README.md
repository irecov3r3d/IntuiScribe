<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# IntuiScribe Therapy AI

**Accessible mental health support through AI, grounded in personal belief systems and historical wisdom.**

IntuiScribe is a comprehensive platform offering real-time emotion tracking, RAG-powered personal knowledge, and historical voice-guided therapeutic conversations. Speak with figures such as Rumi, Marcus Aurelius, Viktor Frankl, C.S. Lewis, or Carl Rogers—aligned to your chosen tradition.

Supports Christian, Islamic, Baháʼí, Gnostic, Stoic, and Secular frameworks.

> **Important Disclaimer**  
> This is an AI companion tool for reflection and support. It is **not** a replacement for professional mental health care, diagnosis, or crisis intervention.  
> If you are in crisis or experiencing thoughts of self-harm, please contact local emergency services, a qualified professional, or a helpline (e.g., 988 in the US). Prioritize human connection.

## Features

- **Therapy Chat**: Historical voices grounded in your selected doctrine (KJV/NIV Bible, Quran translations, Meditations, CBT principles, Nag Hammadi texts, etc.). Empathetic, tradition-respecting guidance.
- **Emotion Mesh (VibeViz)**: Real-time visual emotion tracking via MediaPipe.
- **Knowledge Base**: Upload personal documents for contextual RAG in sessions.
- **Onboarding**: Sets your name, belief system, and preferred doctrine; auto-applies matching themes.
- **Analytics & Accessibility**: Custom analytics tab with sign-language considerations; keyboard and screen-reader friendly interactions.
- **Live Panel**: Advanced real-time features (tiered access).
- Belief-adapted themes and local data persistence.

## Safety, Ethics & Accessibility

- Responses stay in character and are grounded in the user’s chosen doctrine to avoid conflicting methodologies.
- Accessibility: ARIA labels, focus-visible indicators, and keyboard navigation on interactive elements.
- Local-first data storage (SQLite). Gemini API key required for AI features.
- Designed for reflection within one’s tradition; not for medical advice.

## Run Locally

**Prerequisites:** Node.js (v18+)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and set your `GEMINI_API_KEY`.
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Original AI Studio view: https://ai.studio/apps/fe8d7f11-b193-470e-a941-84fcf697bb85

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion, Recharts, React Markdown
- **Backend:** Express + better-sqlite3
- **AI:** Google Gemini (@google/genai)
- **Vision:** MediaPipe Tasks Vision

## Contributing

Contributions that improve safety, clarity, accessibility, cultural respect, and reach are welcome. Prior accessibility notes live in `.Jules/palette.md`.

---

*Built for accessible, tradition-respecting support on the path of awakening and human flourishing.*
