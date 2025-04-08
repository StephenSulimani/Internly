interface IDeekseekResponse {
    message: string;
    thinking: string;
}

interface IDeepseekMessage {
    role: string;
    content: string;
}

export default class DeekSeek {
    messages: IDeepseekMessage[] = [];
    constructor(system_prompt?: string) {
        if (system_prompt) {
            this.messages.push({
                role: "system",
                content: system_prompt
            })
        }
    }

    async ask(message: string): Promise<IDeekseekResponse> {
        const body = {
            max_tokens: 100000,
            messages: [
                ...this.messages,
                {
                    role: "user",
                    content: message
                }
            ],
            model: null,
            seed: null,
            stream: false,
            temperature: 1,
            top_p: 1
        }

        const headers = {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:136.0) Gecko/20100101 Firefox/136.0",
            "Accept": "application/json",
            "Accept-Language": "en-US,en;q=0.5",
            "Referer": "https://deepseek-r1-distill-llama-70b.endpoints.kepler.ai.cloud.ovh.net/doc",
            "Content-Type": "application/json",
            "Origin": "https://deepseek-r1-distill-llama-70b.endpoints.kepler.ai.cloud.ovh.net"
        }

        const response = await fetch("https://deepseek-r1-distill-llama-70b.endpoints.kepler.ai.cloud.ovh.net/api/openai_compat/v1/chat/completions", { method: "POST", headers: headers, body: JSON.stringify(body) })



        const res_json = await response.json();

        const raw_message = res_json.choices[0].message.content;

        this.messages.push({
            role: "assistant",
            content: raw_message
        })


        const thinkingMatch = raw_message.match(/<think>([\s\S]*?)<\/think>/);
        const thinking = thinkingMatch ? thinkingMatch[1].trim() : '';

        const content = raw_message.replace(/<think>[\s\S]*?<\/think>\s*/, '').trim();


        return {
            message: content,
            thinking: thinking
        }
    }
}

