import "dotenv/config";

const getOpenAIAPIResponse = async(message) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === "your_openai_api_key_here") {
        console.log("No OPENAI_API_KEY environment variable found. Returning mock response.");
        return `Hello! This is a simulated SigmaGPT response.

To enable real GPT-4o-mini responses, please set your OpenAI API key in a \`.env\` file in the \`Backend\` directory:
\`\`\`env
OPENAI_API_KEY=your_actual_api_key_here
\`\`\`
Your message was: "${message}"`;
    }

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{
                role: "user",
                content: message
            }]
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