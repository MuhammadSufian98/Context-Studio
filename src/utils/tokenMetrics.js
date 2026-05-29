const INPUT_COST_PER_TOKEN = 0.59 / 1000000;
const OUTPUT_COST_PER_TOKEN = 0.79 / 1000000;

export const estimateTokens = (text) => {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
};

export const calculateCost = (inputTokens, outputTokens) => {
  return (inputTokens * INPUT_COST_PER_TOKEN) + (outputTokens * OUTPUT_COST_PER_TOKEN);
};
