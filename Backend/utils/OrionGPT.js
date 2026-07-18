import "dotenv/config";

// messages: array of { role: "user" | "assistant", content: string }
// Gemini expects role "model" instead of "assistant", and a max recent-history
// window is kept so token usage doesn't grow unbounded on long threads.
const MAX_HISTORY_MESSAGES = 20;

const getGeminiAPIResponse = async(messages) => {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent";

    const recentMessages = messages.slice(-MAX_HISTORY_MESSAGES);

    const contents = recentMessages.map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
    }));

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({ contents })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if(!data.candidates?.length) {
            console.log("Gemini API error/empty response:", data);
            return "Sorry, I couldn't generate a response right now.";
        }

        return data.candidates[0].content.parts[0].text; // reply
    } catch(err) {
        console.log(err);
        return "Sorry, something went wrong reaching Gemini.";
    }
}

export default getGeminiAPIResponse;