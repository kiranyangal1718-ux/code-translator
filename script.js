const translateBtn = document.getElementById('translateBtn');
const inputCode = document.getElementById('inputCode');
const outputCode = document.getElementById('outputCode');
const debugConsole = document.getElementById('debugConsole');
const programOutput = document.getElementById('programOutput');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');

translateBtn.addEventListener('click', async () => {
    const code = inputCode.value;
    const from = document.getElementById('sourceLang').value;
    const to = document.getElementById('targetLang').value;

    if (!code.trim()) return;

    // UI Feedback
    translateBtn.innerText = "⏳ Processing...";
    translateBtn.disabled = true;
    debugConsole.innerHTML = "Connecting to secure local server...";
    programOutput.innerHTML = "Waiting for simulation...";

    try {
        // NOTE: If testing on mobile via GitHub Pages, localhost:3000 won't work 
        // unless your phone is on the same Wi-Fi and using your PC's IP address.
        const response = await fetch('http://localhost:3000/api/translate', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                prompt: `Act as a senior dev. 1. Debug this ${from} code. 2. Translate to ${to}. 3. Provide predicted console output. Format strictly as: DEBUG: [findings] OUTPUT: [predicted output] CODE: [translated code]. Code: ${code}`
            })
        });

        if (!response.ok) throw new Error("Unable to connect");

        const data = await response.json();
        const result = data.candidates[0].content.parts[0].text;

        // Splitting logic
        const debugPart = result.split("OUTPUT:")[0].replace("DEBUG:", "").trim();
        const outputPart = result.split("OUTPUT:")[1].split("CODE:")[0].trim();
        const codePart = result.split("CODE:")[1].trim();

        // Cleaning logic (Removes comments and backticks)
        const cleanCode = codePart
            .replace(/```[a-z]*\n/g, "")
            .replace(/```/g, "")
            .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*|([^\\:]|^)\#.*/g, "$1$2")
            .trim();

        debugConsole.innerHTML = `<b>Debug Report:</b> ${debugPart}`;
        programOutput.innerHTML = outputPart || "Process finished with no output.";
        outputCode.value = cleanCode;

    } catch (error) {
        debugConsole.innerHTML = `<span style="color: #f87171;">❌ Unable to connect</span>`;
        programOutput.innerHTML = "Check if your Node.js server is running.";
    } finally {
        translateBtn.innerText = "Translate & Debug";
        translateBtn.disabled = false;
    }
});

// Clear Feature
clearBtn.addEventListener('click', () => {
    inputCode.value = "";
    outputCode.value = "";
    debugConsole.innerHTML = "System reset.";
    programOutput.innerHTML = "No output to show yet.";
});

// ✅ FIX: Modern Copy Feature (No Permission Popups)
copyBtn.addEventListener('click', async () => {
    if (!outputCode.value) return;

    try {
        // Uses the browser's modern Clipboard API
        await navigator.clipboard.writeText(outputCode.value);
        
        // Visual feedback on the button
        const originalContent = copyBtn.innerHTML;
        copyBtn.innerHTML = "✅ Copied!";
        setTimeout(() => {
            copyBtn.innerHTML = originalContent;
        }, 2000);
        
    } catch (err) {
        // Fallback for very old browsers if needed
        outputCode.select();
        document.execCommand('copy');
        console.warn("Clipboard API failed, using fallback.");
    }
});