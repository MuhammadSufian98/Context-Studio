/**
 * Simple token estimation utility.
 * In a real app, you'd use a library like tiktoken, but for this exercise,
 * an approximation is sufficient.
 */

// Llama 3.3 70B approximate cost per 1M tokens
// Input: $0.59 / 1M tokens
// Output: $0.79 / 1M tokens
const INPUT_COST_PER_TOKEN = 0.59 / 1000000;
const OUTPUT_COST_PER_TOKEN = 0.79 / 1000000;

export const estimateTokens = (text) => {
  if (!text) return 0;
  // Rule of thumb: 4 characters per token
  return Math.ceil(text.length / 4);
};

export const calculateCost = (inputTokens, outputTokens) => {
  return (inputTokens * INPUT_COST_PER_TOKEN) + (outputTokens * OUTPUT_COST_PER_TOKEN);
};
