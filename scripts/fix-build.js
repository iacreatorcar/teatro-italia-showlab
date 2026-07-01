const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic();

async function fixBuildError() {
  const errorMsg = process.argv[2] || "Build error generico";

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `Fix Next.js error: ${errorMsg}. Solo codice, no spiegazioni.`,
        },
      ],
    });

    if (response.stop_reason === "refusal") {
      console.error("Request refused");
      process.exit(1);
    }

    const block = response.content[0];
    if (block?.type === "text") console.log(block.text);
  } catch (err) {
    console.error("API error:", err.message);
    process.exit(1);
  }
}

fixBuildError();