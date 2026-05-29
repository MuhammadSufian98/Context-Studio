# Context Studio

Context Studio is a premium, full-stack AI-native workspace designed for deep focus and surgical text refinement. Moving away from standard, high-noise chat interfaces, it provides an elegant, distraction-free environment that treats AI interaction like a deliberate, tactile editorial craft.

---

## 🚀 Architectural Core Features

- **Tactile Workspace Configuration:** Features an elegant editorial vertical stack layout rather than cramped, traditional side-by-side viewports, optimizing reading pacing and layout legibility.
- **Spring-Animated Tab Slider:** Powered by a high-fidelity Framer Motion slider navigation element (`stiffness: 400, damping: 32`) to seamlessly swap view contexts without breaking underlying state layers.
- **Surgical Paragraph Targeting:** Users can tap individual text paragraphs inside an AI response card to dynamically isolate that specific text layer and pass it as a targeted segment wrapper for precision corrections.
- **Alternative Model Variance Streams:** Intercepts runtime string events to visually flag alternative model regenerations with a custom UI layout box, separating regular edits from speculative creative alternatives.
- **Live Metrics & Telemetry Telemetry:** Real-time, character-based calculations mapping total token usage and compute costs on the fly, alongside inline live character counters.
- **Real-time Streaming & Cancellation:** Sub-second Groq inference loop delivery via Axios streams, completely integrated with an instant `AbortController` cancellation switch to halt text generation mid-flight.

---

## 🛠️ The Full-Stack Layer Architecture

- **Frontend framework:** Next.js (App Router), React, Tailwind CSS.
- **Animation Engine:** Framer Motion (leveraging layout-stable `<AnimatePresence>`).
- **State Management:** Decoupled Zustand context stores (`useTextStore`, `useHistoryStore`, `useUIStore`) to restrict component re-renders entirely during fast text streaming.
- **Inference Pipeline Backend:** Next.js Server API routes proxying stream events directly to Groq Cloud.
- **Core Inference Model:** Llama 3.3 70B / Llama 3 8B through the Groq SDK.
- **Human-Crafted Prompt Isolation:** Isolated, high-signal system prompt sheets that focus on text texture, spatial rhythm, and crisp syntactic changes.

---

## ⚙️ Development Quickstart

1. **Install Local Dependencies:**
   ```bash
   npm install
   ```
 
# Configure Environment Parameters:
 Create a .env file in the root project directory:

GROQ_API_KEY=your_groq_api_key_here

# Launch the Development Server:
npm run dev
Navigate your browser tab to http://localhost:3000.