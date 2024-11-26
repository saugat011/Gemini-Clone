import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

// Direct API key (use environment variable in production)
const apiKey = "AIzaSyA0zjkPixKp9NWxHlMwIYJ75YAVW5sQCuM";

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

async function run(prompt) {
    const chatSession = model.startChat({
        generationConfig,
        history: [],
    });

    try {
        console.log("Sending to Gemini API:", prompt); // Debug log
        const result = await chatSession.sendMessage(prompt); // Send the provided prompt
        console.log("Response from Gemini API:", result.response.text());
        return result.response.text(); // Return the response text
    } catch (error) {
        console.error("Error during API call:", error);
        return null;
    }
}

export default run;
