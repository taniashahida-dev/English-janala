const creatElement = (arr) => {
  const htmlElement = arr.map((el) => `<span class="btn">${el}</span>`);
  return htmlElement.join(" ");
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const loadingSpinner = (status) => {
  let spinner = document.getElementById("spinner");
  let wordContainer = document.getElementById("word-container");

  if (status == true) {
    spinner.classList.remove("hidden");
    wordContainer.classList.add("hidden");
  } else {
    wordContainer.classList.remove("hidden");
    spinner.classList.add("hidden");
  }
};

const levelContent = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((data) => displayLevel(data.data));
};
const removeActive = () => {
  const lessonBtn = document.querySelectorAll(".lesson-btn");
  lessonBtn.forEach((btn) => btn.classList.remove("active"));
};

const loadLevelWord = (id) => {
  loadingSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive();
      const clickedBtn = document.getElementById(`click-btn-${id}`);
      clickedBtn.classList.add("active");
      displayLevelWord(data.data);
    });
};

const loadWordDetails = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};
const displayWordDetails = (word) => {
  // console.log(word)
  const modalContainer = document.getElementById("modal-container");
  modalContainer.innerHTML = `
        <h1 class="font-bold text-2xl">${word.word}(<i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation})</h1>
        <div>
          <h5 class="font-bold">Meaning</h5>
          <p>${word.meaning}</p>
        </div>
        <div>
          <h5 class="font-bold">Example</h5>
          <p>${word.sentence}</p>
        </div>
        <div>
          <h5 class="font-bold">সমার্থক শব্দ গুলো</h5>
           <div class="">  ${creatElement(word.synonyms)}  </div>
        </div>
        <button class="btn btn-primary">Complete Learning</button>
      
    `;
  document.getElementById("word_modal").showModal();
};

const displayLevelWord = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (words.length == 0) {
    wordContainer.innerHTML = `
        <div class=" col-span-3  bangla-font space-y-5 text-center m-6 py-6">
        <img class="mx-auto" src="./assets/alert-error.png" alt="">
  <p class="text-gray-500 text-2xl">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
  <h3 class=" text-4xl ">নেক্সট Lesson এ যান</h3>

</div>

        `;
    loadingSpinner(false);
    return;
  }

  words.forEach((word) => {
    const card = document.createElement("div");
    card.innerHTML = `
      <div class="bg-white rounded-xl text-center py-14 px-5 m-4 shadow-sm space-y-2" >
  <h1 class="font-bold text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h1>
  <p  class="font-semibold">${word.pronunciation ? word.pronunciation : "উচ্চারণ পাওয়া যায়নি"}</p>
  <p class="bangla-font font-medium text-2xl">${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"}</p>
  <div class="flex justify-between">
  <button  onclick="loadWordDetails(${word.id})" class="btn bg-gray-200 hover:bg-gray-400"><i class="fa-solid fa-circle-info"></i></button>
  <button onclick="pronounceWord('${word.word}')" class="btn bg-gray-200 hover:bg-gray-400"><i class="fa-solid fa-volume-high"></i></button>
</div>
</div>
       `;
    wordContainer.append(card);
    loadingSpinner(false);
  });
};

const displayLevel = (levels) => {
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";

  for (const level of levels) {
    const divBtn = document.createElement("div");

    divBtn.innerHTML = `
    <button onclick="loadLevelWord(${level.level_no})" id="click-btn-${level.level_no}" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i>Learn ${level.level_no} </button>
    `;

    levelContainer.append(divBtn);
  }
};
levelContent();

document.getElementById("btn-search").addEventListener("click", () => {
  removeActive();
  const input = document.getElementById("input-search");
  const value = input.value.trim().toLowerCase();

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const filterWord = allWords.filter((word) =>
        word.word.toLowerCase().includes(value),
      );
      displayLevelWord(filterWord);
    });
});
