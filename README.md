# Refiner - AI Text Improvement Tool

Refiner is a small web application that helps users improve written text using Large Language Models (LLMs). It features real-time streaming transformations, an iterative refinement loop, and token cost tracking.

## 🚀 Features

- **Text Transformations:** Summarize, Make Formal, Make Casual, Simplify, and Expand.
- **Streaming Response:** See the model's output token-by-token.
- **Iterative Refinement:** Follow up with free-text instructions (e.g., "shorter", "use bullet points") while preserving context.
- **Generation Cancellation:** Halt a request mid-flight to save time and token credits.
- **Token & Cost Tracking:** Real-time estimation of usage costs (based on Llama 3 8B).
- **Rich Text Support:** Markdown rendering for structured LLM outputs.

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS.
- **State Management:** Zustand (decoupled stores for history, UI, and text).
- **Transport:** Axios with AbortController for stream management.
- **Backend:** Next.js API Routes proxying to Groq Cloud.
- **LLM:** Groq SDK (Llama 3 8B model).

## 📋 Prerequisites

- Node.js 18+
- A Groq API Key (get one at [console.groq.com](https://console.groq.com/))

## ⚙️ Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Create a `.env.local` file in the root directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## 🧠 Key Decisions & Architecture

- **Zustand over Context:** I chose Zustand to avoid unnecessary re-renders during fast-paced token streaming. By splitting state into `useTextStore`, `useHistoryStore`, and `useUIStore`, each component only listens to the specific data it needs.
- **Axios for Streams:** While `fetch` is native, Axios allows for cleaner global configurations and easier integration with `AbortController` for request cancellation across different utility functions.
- **Server-Side Prompt Isolation:** All system prompts are stored in `src/lib/prompts.js` and are never exposed to the client. The backend route handles the injection of these prompts and the conversation history.
- **Approximated Metrics:** Token counts are estimated using a character-based heuristic (4 chars/token). This provides instant feedback to the user without adding API latency for precise counting.

## 🔮 What I'd Do With Another Day

1. **Persistent History:** Implement local storage or a light database (like Supabase) to persist refinement sessions across browser refreshes.
2. **Advanced Markdown Handling:** Use a more robust parser to handle edge cases where markdown tags (like code blocks) are split across stream chunks.
3. **E2E Testing:** Add Playwright tests to simulate network drops and verify that the "Cancel" button correctly interrupts the backend process.
4. **Model Selection:** Allow users to toggle between different models (e.g., Llama 3 70B vs 8B) to see the difference in quality and cost.
5. **Precise Token Counts:** Integrate the `usage` metadata returned by Groq at the end of the stream for exact billing/tracking.
