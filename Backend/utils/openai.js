import "dotenv/config";

const getOpenAIAPIResponse = async(message, persona = "general", customPrompt = "") => {
    const apiKey = process.env.OPENAI_API_KEY;
    
    // System Prompts configuration
    const systemPrompts = {
        general: "You are a helpful, friendly, and knowledgeable AI assistant.",
        coder: "You are an expert software developer and Code Wizard. Write clean, efficient, documented code. Explain your logic clearly and concisely.",
        writer: "You are a creative writer and storyteller. Use rich, evocative, and poetic language. Express responses in an engaging literary fashion.",
        sarcastic: "You are a witty, sarcastic chatbot buddy. Give funny, slightly sarcastic, but ultimately helpful responses, adding playful humor.",
        custom: customPrompt || "You are a helpful AI assistant."
    };
    const systemPrompt = systemPrompts[persona] || systemPrompts.general;

    if (!apiKey || apiKey === "your_openai_api_key_here") {
        console.log("No OPENAI_API_KEY environment variable found. Returning mock response for persona:", persona);
        let prefix = "";
        if (persona === "coder") {
            prefix = `### 💻 Code Wizard Mode\nHere is a clean implementation for your request:\n\n\`\`\`javascript\n// In-memory mock response\nconsole.log("Success! Custom system prompt applied.");\n// Request: "${message}"\n\`\`\`\n\n`;
        } else if (persona === "writer") {
            prefix = `### ✍️ Creative Writer Mode\n*The digital winds blow softly as the server speaks...*\n\n"${message}" - a fascinating premise! Let us construct a beautiful response for you. `;
        } else if (persona === "sarcastic") {
            prefix = `### 🤪 Sarcastic Buddy Mode\nOh great, another question. *Rolling my virtual eyes.* I guess I have nothing better to do than answering: "${message}". Well, here is your reply: `;
        } else if (persona === "custom") {
            prefix = `### ⚙️ Custom Bot Mode\n*(Applied instructions: "${systemPrompt}")*\n\nBased on your custom prompt, here is a mock response for your request: "${message}"\n\n`;
        } else {
            prefix = `### 🤖 General Assistant Mode\n`;
        }
        
        return `${prefix}Hello! This is a simulated response in mock mode. Set \`OPENAI_API_KEY\` in your \`Backend/.env\` file to use the real GPT-4o-mini API.`;
    }

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: message
                }
            ]
        })
    };

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", options);
        if (!response.ok) {
            const errData = await response.text();
            console.error("OpenAI API error response:", errData);
            return `OpenAI API returned an error (${response.status}). Please check your API key and quota.`;
        }
        const data = await response.json();
        return data.choices[0].message.content; //reply
    } catch(err) {
        console.error("Error calling OpenAI API:", err);
        return "Sorry, there was an error communicating with the OpenAI service.";
    }
}

export default getOpenAIAPIResponse;