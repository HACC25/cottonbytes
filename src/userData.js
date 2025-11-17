import { writable } from 'svelte/store';

export const skills = writable([]);
export const possibleJobs = writable([]);
export const field = writable("");
export const userInterests = writable("");
export const userSubjects = writable("");

export const page = writable(0);

export let items = writable([]);
export let shouldCenter = writable(false)
export let job = writable("")
export let degree = writable("")

export function addComponent(name, body) {
	items.update(p => [...p, {n:name, b:body}]); // push a new "slot" for a component
        
}

export let promptAI = async function streamAI(prompt) {
    let text = "";
    console.log("getting results")

    const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'llama3.1',
            messages: [{ role: 'user', content: prompt }],
            stream: true
        })
    });


    if (!response.body) {
        console.error('No response body to stream');
        return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;
    let buffer = '';
    while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (!value) continue;

        buffer += decoder.decode(value, { stream: true });

        // Split into lines (each line should be a valid JSON object)
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // keep last partial line

        for (const line of lines) {
            if (!line.trim()) continue; // skip empty lines
            try {
                const data = JSON.parse(line);
                if (data.message?.content) {
                    text += data.message.content;
                }
            } catch (e) {
                // ignore incomplete/malformed lines
            }
        }
    }

    console.log('Streaming complete');
    return text
}