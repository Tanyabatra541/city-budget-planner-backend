const { OpenAI } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.generateBudget = async (req, res) => {
  const { city, budget } = req.body;

  const prompt = `Provide a detailed monthly budget breakdown for living in ${city} with a total budget of $${budget}. Include expenses categories like housing, food, transportation, utilities, and entertainment.`;

  const response = await client.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2048,
    temperature: 1,
  });

  console.log("Completion response:", response.choices[0].message.content);
  const budgetPlan = response.choices[0].message.content;

  res.status(200).json({ budgetPlan });
};
