const deeplApiKey = '1c4140e9-f78f-4a98-8533-1a6502eadd86:fx';
const targetLang = 'EN-US';

const captionsDiv = document.getElementById('captions');

if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ES';

    recognition.onresult = async (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            console.log('Transcribed text:', transcript); // Log transcribed text
            if (event.results[i].isFinal) {
                const translatedText = await translateText(transcript);
                console.log('Translated text:', translatedText); // Log translated text
                addTranslatedText(translatedText);
            }
        }
    };

    recognition.start();
} else {
    captionsDiv.textContent = "Speech recognition not supported in this browser.";
}

async function translateText(text) {
    const url = 'https://api-free.deepl.com/v2/translate';
    const params = new URLSearchParams({
        auth_key: deeplApiKey,
        text: text,
        target_lang: targetLang
    });

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.translations[0].text;
}

function addTranslatedText(text) {
    const captionLine = document.createElement('div');
    captionLine.textContent = text;
    captionsDiv.appendChild(captionLine);

    const captionLines = captionsDiv.getElementsByTagName('div');
    while (captionLines.length > 3) {
        captionsDiv.removeChild(captionLines[0]);
    }

    captionsDiv.scrollTop = captionsDiv.scrollHeight;
}