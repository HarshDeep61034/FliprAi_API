const express = require("express");
const bodyParser = require("body-parser");
const OpenAI = require("openai");
require("dotenv").config();

// Fetching Api key from .env file
const apiKey = process.env.OPENAI_API_KEY;

const app = express();
const port = 6969; // Replace with your desired port number

// Set up OpenAI with your API key
const openai = new OpenAI({
  apiKey: apiKey,
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

app.get("/", (req, res) => {
  res.send("Hello, this is the Node.js and Express version of your Flask app!");
});

app.post("/api", async (req, res) => {
  const { message: user_message } = req.body;
  const prompt = {
    "When it comes to writing content, two factors are crucial, perplexity and burstiness. ":
      "",
    "Perplexity measures the complexity of text. Separately, burstiness compares the variations of sentences. ":
      "",
    "Humans tend to write with greater burstiness, for example, with some longer or complex sentences alongside shorter ones. ":
      "",
    "AI sentences tend to be more uniform. Therefore, when writing the following content I am going to ask you to create, ":
      "",
    "I need it to have a good amount of perplexity and burstiness. Using the concepts written above, rewrite this article with a high degree of perplexity and burstiness: ":
      "",
  };

  const prompt_with_user_input = `${prompt[0]} ${user_message}`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt_with_user_input }],
      model: "gpt-3.5-turbo",
    });
    if (completion.choices[0].message) {
      res.json({ response: completion.choices[0].message.content });
    } else {
      res.status(500).json({ error: "Failed to generate response!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
