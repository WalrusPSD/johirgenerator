const brainRotDictionary = {
    "greatest of all time": "GOAT",
    "charisma": "Rizz",
    "charismatic": "Rizzy",
    "boring": "Skibidi",
    "talented": "Livvy Dune",
    "weird": "Ohio",
    "tax": "Fanum Tax",
    // Add more slang mappings here
};

const shakespeareanDictionary = {
    "you": "thou",
    "are": "art",
    "hello": "hail",
    "friend": "companion",
    "my": "mine",
    "your": "thy",
    "is": "be",
    "goodbye": "farewell",
    "yes": "aye",
    "no": "nay",
    // Add more translations here
};

function replaceWithBrainRot(text) {
    const words = text.split(/\b/);
    for (let i = 0; i < words.length; i++) {
        const lowerWord = words[i].toLowerCase();
        if (brainRotDictionary[lowerWord]) {
            words[i] = brainRotDictionary[lowerWord];
        }
    }
    return words.join('');
}

function replaceWithShakespearean(text) {
    const words = text.split(/\b/);
    for (let i = 0; i < words.length; i++) {
        const lowerWord = words[i].toLowerCase();
        if (shakespeareanDictionary[lowerWord]) {
            words[i] = shakespeareanDictionary[lowerWord];
        }
    }
    return words.join('');
}

async function fetchSynonyms(word) {
    const response = await fetch(`https://api.datamuse.com/words?rel_syn=${word}`);
    const data = await response.json();
    return data.map(item => item.word);
}

async function replaceWithSynonyms(text) {
    const words = text.split(/\b/);
    for (let i = 0; i < words.length; i++) {
        if (words[i].match(/\w+/)) {
            const synonyms = await fetchSynonyms(words[i]);
            if (synonyms.length > 0) {
                const randomSynonym = synonyms[Math.floor(Math.random() * synonyms.length)];
                words[i] = randomSynonym;
            }
        }
    }
    return words.join('');
}

async function addWordBeforePunctuation(text, wordToAdd) {
    return text.replace(/([.!?](?:\.\.)?)\s*/g, `, ${wordToAdd}$1 `).trim();
}

async function processText() {
    const user_input = document.getElementById('text-entry').value;
    const mode = document.getElementById('mode-select').value;
    let modified_text;

    if (mode === 'synonym') {
        modified_text = await replaceWithSynonyms(user_input);
    } else if (mode === 'brainrot') {
        modified_text = replaceWithBrainRot(user_input);
    } else if (mode === 'shakespeare') {
        modified_text = replaceWithShakespearean(user_input);
    } else {
        const wordToAdd = document.getElementById('word-to-add').value;
        modified_text = await addWordBeforePunctuation(user_input, wordToAdd);
    }

    document.getElementById('output-text').value = modified_text;
}

function handleModeChange() {
    const mode = document.getElementById('mode-select').value;
    const wordToAddContainer = document.getElementById('word-to-add-container');

    if (mode === 'word') {
        wordToAddContainer.classList.remove('hidden');
    } else {
        wordToAddContainer.classList.add('hidden');
    }
}

function copyToClipboard() {
    const outputText = document.getElementById('output-text');
    outputText.select();
    document.execCommand('copy');
}

function clearTextFields() {
    document.getElementById('text-entry').value = '';
    document.getElementById('output-text').value = '';
    document.getElementById('word-to-add').value = ''; // Clear input field
    document.getElementById('mode-select').value = 'word'; // Reset to default
    handleModeChange(); // Ensure the word input is shown/hidden correctly
}

document.addEventListener('DOMContentLoaded', () => {
    handleModeChange(); // Set the initial state of the word input field
});
