import { Configuration, OpenAIApi } from "openai";
import { PromptableApi } from "promptable";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

const chatgpt = async (req, res) => {
  const {message, promptId} = req.body;
  if(!message || !message.length){
    res.status(400).json({error: 'Message is required!'});
    return;
  }
  // call prompt api and openai api
  const reply = await getReply(message, promptId);
  res.status(200).json({reply});
  return;
}

const getReply = async (message, promptId) => {
  // get prompt from prompt ai  api based on promptId
  const promptDeployment = await PromptableApi.getActiveDeployment({
    promptId
  });
  if(!promptDeployment) throw new Error('Prompt deployment not found!');

  const finalPrompt = {...promptDeployment, text: promptDeployment.text.replace("{{user_input}}", message)}

  const openAiRes = await openai.createCompletion({
    model: finalPrompt.config.model,
    prompt: finalPrompt.text,
    temperature: finalPrompt.config.temperature,
    max_tokens: finalPrompt.config.max_tokens,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop: finalPrompt.config.stop,
  });
  if (openAiRes.data.choices && openAiRes.data.choices.length > 0) {
    return openAiRes.data.choices[0].text;
  } else {
    return "I'm sorry, I don't understand.";
  }
}

export default chatgpt;