// ================================
// Get elements from the DOM
// ================================

const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");

const sourceLanguage = document.getElementById("sourceLanguage");
const targetLanguage = document.getElementById("targetLanguage");

const translateButton = document.getElementById("translateButton");
const swapButton = document.getElementById("swapButton");

const copyButton = document.getElementById("copyButton");
const speakButton = document.getElementById("speakButton");
const inputSpeakButton = document.getElementById("inputSpeakButton");
const clearButton = document.getElementById("clearButton");

const characterCount = document.getElementById("characterCount");
const status = document.getElementById("status");


// ================================
// Character Counter
// ================================

inputText.addEventListener("input", function () {

    const currentLength = inputText.value.length;

    characterCount.textContent = `${currentLength} / 500`;

});


// ================================
// Swap Languages
// ================================

swapButton.addEventListener("click", function () {

    // Swap selected languages
    const sourceValue = sourceLanguage.value;
    sourceLanguage.value = targetLanguage.value;
    targetLanguage.value = sourceValue;


    // Swap input and output text
    const inputValue = inputText.value;
    const outputValue = outputText.value;

    inputText.value = outputValue;
    outputText.value = inputValue;


    // Update character count
    characterCount.textContent =
        `${inputText.value.length} / 500`;

    // Reset status
    status.textContent = "";

});


// ================================
// Copy Translation
// ================================

copyButton.addEventListener("click", async function () {

    const translatedText = outputText.value.trim();

    // Check if translation exists
    if (translatedText === "") {
    status.textContent = "Nothing to copy.";
    status.className = "error";
    return;
}


    try {

        await navigator.clipboard.writeText(translatedText);

        copyButton.textContent = "✓ Copied";
        status.textContent = "Copied successfully.";
        status.className = "success";

        setTimeout(function () {
            copyButton.textContent = "📋 Copy";
        }, 1500);

    } catch (error) {

        console.error("Copy Error:", error);

        status.textContent = "Failed to copy text.";
        status.className = "error";
    }

});

// ================================
// Text To Speech - Input Text
// ================================

inputSpeakButton.addEventListener("click", function () {

    const text = inputText.value.trim();

    // Check if input exists
    if (text === "") {
        status.textContent = "Nothing to speak.";
        status.className = "error";
        return;
    }

    // Check browser support
    if (!("speechSynthesis" in window)) {
        status.textContent =
            "Text-to-speech is not supported in this browser.";

        status.className = "error";

        return;
    }

    // Create speech object
    const speech = new SpeechSynthesisUtterance(text);

    // Use source language
    speech.lang = sourceLanguage.value;

    // Stop previous speech
    window.speechSynthesis.cancel();

    // Speak input text
    window.speechSynthesis.speak(speech);

});


// ================================
// Text To Speech
// ================================

speakButton.addEventListener("click", function () {

    const text = outputText.value.trim();

    // Check if translation exists
    if (text === "") {
        status.textContent = "Nothing to speak.";
         status.className = "error";
        return;
    }


    // Check browser support
    if (!("speechSynthesis" in window)) {
        status.textContent =
            "Text-to-speech is not supported in this browser.";
        status.className = "error";
        return;
    }


    // Create speech object
    const speech = new SpeechSynthesisUtterance(text);

    // Set target language
    speech.lang = targetLanguage.value;


    // Stop previous speech
    window.speechSynthesis.cancel();

    // Start speech
    window.speechSynthesis.speak(speech);

});


// ================================
// Clear Button
// ================================

clearButton.addEventListener("click", function () {

    inputText.value = "";
    outputText.value = "";

    characterCount.textContent = "0 / 500";

    status.textContent = "";
    status.className = "";

    // Stop speech if running
    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }

});


// ================================
// Translate Button
// ================================

translateButton.addEventListener("click", async function () {

    const text = inputText.value.trim();


    // -------------------------------
    // Validate input
    // -------------------------------

    if (text === "") {

    outputText.value = "";

    status.textContent =
        "Please enter some text to translate.";

    status.className = "error";

    inputText.focus();

    return;
}


    // -------------------------------
    // Check same language
    // -------------------------------

    if (sourceLanguage.value === targetLanguage.value) {

        outputText.value = text;

        status.textContent = "Same language";
        status.className = "success";

        return;
    }


    // -------------------------------
    // Loading state
    // -------------------------------

    translateButton.disabled = true;

    translateButton.textContent = "Translating...";

    outputText.value = "";

    status.textContent = "Translating...";
    status.className = "loading";

    try {

        // Get selected languages
        const source = sourceLanguage.value;
        const target = targetLanguage.value;


        // Encode text for URL
        const encodedText = encodeURIComponent(text);


        // MyMemory Translation API
        const apiUrl =
            `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${source}|${target}`;


        // Send request
        const response = await fetch(apiUrl);


        // Check HTTP response
        if (!response.ok) {
            throw new Error(
                `HTTP Error: ${response.status}`
            );
        }


        // Convert response to JSON
        const data = await response.json();


        // Check API response
        if (
            !data.responseData ||
            !data.responseData.translatedText
        ) {
            throw new Error(
                "Invalid translation response."
            );
        }


        // Get translated text
        const translatedText =
            data.responseData.translatedText;


        // Display translation
        outputText.value = translatedText;

        status.textContent = "Translated";
        status.className = "success";


    } catch (error) {

        console.error(
            "Translation Error:",
            error
        );


        outputText.value =
            "Sorry, translation failed. Please try again.";

        status.textContent =
            "Translation failed.";
        status.className = "error";

    } finally {

        // Restore translate button
        translateButton.disabled = false;

        translateButton.textContent = "Translate";

    }

});

