import express from 'express';
import { test } from '../controllers/controller.js';
import { Configuration, OpenAIApi } from "openai";

var routes = express.Router();


const configuration = new Configuration({
  //apiKey: "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",
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

// Index 
routes.get("/", test, async (req, res, next) => {
  res.render('index', req.result);
});

routes.post("/gpt", async (req, res, next) => {
  console.log("Hola desde ChatGPT");

  let msg = req.body.msg;
  try {
    //hacer la consulta
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: msg,
      max_tokens: 15,
      n: 1,
      stop: null,
      temperature: 0.7
    });
    res.status(200).json({ data: completion.data.choices[0].text });
  }
  catch (err) {
    console.log(err.response);
  }
});

export { routes }
