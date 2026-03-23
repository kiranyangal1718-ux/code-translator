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
        // ✅ Calling your local Node.js backend instead of Google directly
        const response = await fetch('http://localhost:3000/api/translate', {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                prompt: `Act as a senior dev. 
                1. Debug this ${from} code. 
                2. Translate to ${to}. 
                3. Provide predicted console output.
                
                Format strictly as: 
                DEBUG: [findings]
                OUTPUT: [predicted output]
                CODE: [translated code]
                
                Code: ${code}`
            })
        });

        // ✅ Check if the local server returned an error
        if (!response.ok) {
            throw new Error("Unable to connect");
        }

        const data = await response.json();

        // Safety check for backend or API errors
        if (data.error) {
            throw new Error(data.error);
        }

        const result = data.candidates[0].content.parts[0].text;

        // --- SPLITTING LOGIC ---
        const debugPart = result.split("OUTPUT:")[0].replace("DEBUG:", "").trim();
        const outputPart = result.split("OUTPUT:")[1].split("CODE:")[0].trim();
        const codePart = result.split("CODE:")[1].trim();

        // --- CLEANING LOGIC (Removes Comments & Markdown) ---
        const cleanCode = codePart
            .replace(/```[a-z]*\n/g, "")      // Remove opening backticks
            .replace(/```/g, "")             // Remove closing backticks
            .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*|([^\\:]|^)#.*/g, "$1$2") // Remove //, #, and /* */ comments
            .trim();

        // Update the UI with results
        debugConsole.innerHTML = `<b>Debug Report:</b> ${debugPart}`;
        programOutput.innerHTML = outputPart || "Process finished with no output.";
        outputCode.value = cleanCode;

    } catch (error) {
        // ✅ Displays the requested error message if connection fails
        debugConsole.innerHTML = `<span style="color: #f87171;">❌ Unable to connect</span>`;
        programOutput.innerHTML = "Check if your Node.js server is running.";
        console.error("Detailed Error:", error);
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

// Copy Feature
copyBtn.addEventListener('click', () => {
    if (!outputCode.value) return;
    outputCode.select();
    document.execCommand('copy');
    alert("Code copied to clipboard!");
});