export const SYSTEM_PROMPTS = {
  summarize:
    "Strip away the fluff and give me a high-signal, concise distillation of this text. Focus entirely on core ideas and critical takeaways. Keep the language tight, punchy, and deliberate—no filler or generic introductory phrasing.",

  formal:
    "Rewrite this draft into polished, corporate-grade communication. Elevate the vocabulary and syntax so it feels sophisticated and authoritative, yet entirely natural. The tone should be sharp, professional, and fitting for an executive environment.",

  casual:
    "Make this text sound completely natural, warm, and conversational. Soften the phrasing so it reads like an authentic message to a close colleague or friend. Keep it easygoing, approachable, and polite, without feeling forced or overly energetic.",

  simplify:
    "Break this down into plain, transparent terms. Strip out the technical jargon, heavy vocabulary, and complex sentences. Rewrite it so absolutely anyone can get the point immediately, while keeping the core meaning perfectly intact.",

  expand:
    "Flesh out this text by adding analytical depth, structural completeness, and vivid context. Elaborate on the core ideas, explore the underlying thoughts, and enrich the narrative pacing without altering the author's original intent.",
};

export const REFINEMENT_PROMPT =
  "Review the ongoing editorial history and implement the user's latest correction layer smoothly. Treat this as an iterative draft change: keep the overall context intact while precisely applying the targeted adjustments, stylistic tweaks, or structural updates requested.";
