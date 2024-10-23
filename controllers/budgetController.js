const { OpenAI } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.generateBudget = async (req, res) => {
  const { city, budget, selectedCategories } = req.body;

  // Log the incoming request for debugging
  console.log("City:", city);
  console.log("Budget:", budget);
  console.log("Selected Categories:", selectedCategories);

  if (
    !city ||
    !budget ||
    !selectedCategories ||
    selectedCategories.length === 0
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Prepare the prompt based on user input
  let prompt = `You are a budget planner. Provide a detailed monthly budget breakdown for living in ${city} with a total budget of $${budget}. 
  Focus on the following categories: ${selectedCategories.join(
    ", "
  )}. Provide the expenses in a table format with two columns: 
  - Category
  - Amount (in USD)
  
  Make sure the total does not exceed $${budget} and allocate the amount realistically based on the cost of living in ${city}.
  The table should include only the categories provided. The output should look like this:
  
  | Category            | Amount (USD) |
  |---------------------|--------------|
  | Housing             | $XXXX        |
  | Utilities           | $XXXX        |
  | Food                | $XXXX        |
  | Transportation      | $XXXX        |
  Ensure all amounts are precise and do not use ranges.`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
      temperature: 1,
    });

    const budgetPlan = response.choices[0].message.content;

    // Extract the budget breakdown from GPT response
    const budgetBreakdown = extractBudgetBreakdown(
      budgetPlan,
      selectedCategories
    );

    return res.status(200).json({ budgetPlan, budgetBreakdown });
  } catch (error) {
    console.error(
      "Error generating budget plan:",
      error.response ? error.response.data : error.message
    );
    return res.status(500).json({
      message: "Failed to generate budget plan",
      error: error.message,
    });
  }
};

const extractBudgetBreakdown = (budgetPlan, selectedCategories) => {
  const breakdown = [];

  // Map of categories and their corresponding regex for extracting values
  const categoryMap = {
    Housing: /Housing.*?\$(\d+)/i,
    Food: /Food.*?\$(\d+)/i,
    Utilities: /Utilities.*?\$(\d+)/i,
    Transportation: /Transportation.*?\$(\d+)/i,
    "Health Insurance": /Health Insurance.*?\$(\d+)/i,
    "Cell Phone": /Cell Phone.*?\$(\d+)/i,
    Fitness: /Fitness.*?\$(\d+)/i,
    Entertainment: /Entertainment.*?\$(\d+)/i,
    Miscellaneous: /Miscellaneous.*?\$(\d+)/i,
    Savings: /Savings.*?\$(\d+)/i,
  };

  // Iterate through selected categories and extract their values from the budget plan
  selectedCategories.forEach((category) => {
    const regex = categoryMap[category];
    if (regex) {
      const match = budgetPlan.match(regex);
      if (match && match[1]) {
        breakdown.push({ category, amount: parseFloat(match[1]) });
      }
    }
  });

  return breakdown;
};
