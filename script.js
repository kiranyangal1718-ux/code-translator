const translateBtn = document.getElementById('translateBtn');
const inputCode = document.getElementById('inputCode');
const outputCode = document.getElementById('outputCode');
const debugConsole = document.getElementById('debugConsole');
const programOutput = document.getElementById('programOutput');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');

// 1. Rename the button to reflect the new safe behavior
copyBtn.innerHTML = "💾 Save Code";

translateBtn.addEventListener('click', async () => {
    const code = inputCode.value;
    const from = document.getElementById('sourceLang').value;
    const to = document.getElementById('targetLang').value;

    if (!code.trim()) return;

    translateBtn.innerText = "⏳ Processing...";
    translateBtn.disabled = true;
    debugConsole.innerHTML = "Connecting to secure local server...";
    programOutput.innerHTML = "Waiting for simulation...";

    try {
const response = await fetch('/api/translate', {
        method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                prompt: `Act as a senior dev. 1. Debug this ${from} code. 2. Translate to ${to}. 3. Provide predicted console output. Format strictly as: DEBUG: [findings] OUTPUT: [predicted output] CODE: [translated code]. Code: ${code}`
            })
        });

        if (!response.ok) throw new Error("Unable to connect");

        const data = await response.json();
        const result = data.candidates[0].content.parts[0].text;

        const debugPart = result.split("OUTPUT:")[0].replace("DEBUG:", "").trim();
        const outputPart = result.split("OUTPUT:")[1].split("CODE:")[0].trim();
        const codePart = result.split("CODE:")[1].trim();

        // Cleaning logic (Removes comments and AI backticks)
        const cleanCode = codePart
            .replace(/```[a-z]*\n/g, "")
            .replace(/```/g, "")
            .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*|([^\\:]|^)#.*/g, "$1$2")
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

// Clear All Feature
clearBtn.addEventListener('click', () => {
    inputCode.value = "";
    outputCode.value = "";
    debugConsole.innerHTML = "System reset.";
    programOutput.innerHTML = "No output to show yet.";
});

// ✅ SAFE SAVE FEATURE: Avoids "Access other apps" permission popups
copyBtn.addEventListener('click', () => {
    if (!outputCode.value) return;

    const code = outputCode.value;
    const targetLang = document.getElementById('targetLang').value;
    
    // Auto-detect extension based on selected language
    let extension = ".txt";
    if (targetLang === "python") extension = ".py";
    else if (targetLang === "cpp") extension = ".cpp";
    else if (targetLang === "java") extension = ".java";
    else if (targetLang === "javascript") extension = ".js";

    // Create a virtual file (Blob)
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    
    // Create a hidden link and "click" it to trigger browser download
    const link = document.createElement("a");
    link.href = url;
    link.download = `translated_code${extension}`;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup to free up memory
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Visual Feedback
    const originalText = copyBtn.innerText;
    copyBtn.innerText = "✅ Saved!";
    setTimeout(() => { copyBtn.innerText = originalText; }, 2000);
});