// Get DOM elements
const searchForm = document.querySelector("form");
const searchInput = document.querySelector("input");
const wordOfTheDay = document.getElementById("word-of-the-day");

// Array of common words for Word of the Day
const commonWords = [
  {
    word: "serendipity",
    definitions: [
      "The occurrence of finding valuable things not sought for",
      "A happy accident or pleasant surprise",
    ],
    examples: [
      "Finding your dream job while looking for something else is serendipity",
      "Their chance meeting was pure serendipity",
    ],
  },
  {
    word: "ephemeral",
    definitions: ["Lasting for a very short time", "Temporary or brief"],
    examples: [
      "The ephemeral beauty of cherry blossoms",
      "Social media posts are often ephemeral",
    ],
  },
  {
    word: "luminescent",
    definitions: ["Producing or showing soft light", "Glowing without heat"],
    examples: [
      "The luminescent jellyfish lit up the ocean",
      "The stars appeared luminescent in the night",
    ],
  },
];

// Function to fetch word details from the API
async function fetchWordDetails(word) {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    if (!response.ok) {
      // Fallback to local definitions if API fails
      const localWord = commonWords.find(
        (w) => w.word.toLowerCase() === word.toLowerCase()
      );
      if (localWord) {
        return [
          {
            word: localWord.word,
            meanings: [
              {
                partOfSpeech: "adjective",
                definitions: localWord.definitions.map((def) => ({
                  definition: def,
                  example:
                    localWord.examples[
                      Math.floor(Math.random() * localWord.examples.length)
                    ],
                })),
              },
            ],
          },
        ];
      }
      throw new Error("Word not found");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// Function to display word details
function displayWordDetails(data, container) {
  if (!data || !data[0]) {
    container.innerHTML = "<p>No results found</p>";
    return;
  }

  const word = data[0];
  let html = `
        <h3>${word.word}</h3>
        <p class="phonetic">${word.phonetic || ""}</p>
    `;

  word.meanings.forEach((meaning) => {
    html += `
            <div class="meaning">
                <p class="part-of-speech">${meaning.partOfSpeech}</p>
                <div class="definition-group">
        `;

    meaning.definitions.forEach((def) => {
      html += `
                <div class="definition">
                    <p><strong>Definition:</strong> ${def.definition}</p>
                    ${
                      def.example
                        ? `<p><strong>Example:</strong> "${def.example}"</p>`
                        : ""
                    }
                </div>
            `;
    });

    if (meaning.synonyms.length > 0) {
      html += `<p><strong>Synonyms:</strong> ${meaning.synonyms.join(
        ", "
      )}</p>`;
    }

    html += `
                </div>
            </div>
        `;
  });

  container.innerHTML = html;
}

// Handle search form submission
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const word = searchInput.value.trim();
  if (!word) return;

  const searchResults = document.createElement("div");
  searchResults.className = "search-results";
  searchForm.parentElement.appendChild(searchResults);

  const data = await fetchWordDetails(word);
  displayWordDetails(data, searchResults);
});

// Display Word of the Day
async function displayWordOfTheDay() {
  const randomWord =
    commonWords[Math.floor(Math.random() * commonWords.length)].word;
  const data = await fetchWordDetails(randomWord);
  if (data) {
    displayWordDetails(data, wordOfTheDay);
  }
}

// Initialize Word of the Day when page loads
window.addEventListener("load", displayWordOfTheDay);
