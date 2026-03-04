const levelContent = ()=>{
    fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res)=>res.json())
    .then((data)=> displayLevel(data.data))
}
const removeActive =()=>{
    const lessonBtn = document.querySelectorAll(".lesson-btn")
    lessonBtn.forEach((btn)=>btn.classList.remove('active'))
}

const loadLevelWord=(id)=>{
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
    .then((res)=>res.json())
    .then((data)=>{
removeActive()
        const clickedBtn = document.getElementById(`click-btn-${id}`)
        clickedBtn.classList.add('active')
        displayLevelWord(data.data)
    })
}
const displayLevelWord=(words)=>{

    const wordContainer = document.getElementById('word-container')
    wordContainer.innerHTML=""
    
    if (words.length == 0) {
       wordContainer.innerHTML=
        `
        <div class=" col-span-3  bangla-font space-y-5 text-center m-6 py-6">
        <img class="mx-auto" src="./assets/alert-error.png" alt=""
  <p class="text-gray-500 text-2xl">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
  <h3 class=" text-4xl ">নেক্সট Lesson এ যান</h3>

</div>

        `;
        return
    }


    words.forEach(word => {
       const card = document.createElement('div')
       card.innerHTML =    `
      <div class="bg-white rounded-xl text-center py-14 px-5 m-4 shadow-sm space-y-2" >
  <h1 class="font-bold text-2xl">${word.word? word.word:"Word Pawa Jayni"}</h1>
  <p  class="font-semibold">${word.pronunciation?word.pronunciation:"pronunciation Pawa jayni"}</p>
  <p class="bangla-font font-medium text-2xl">${word.meaning?word.meaning:"Meaning Pawa Jayni"}</p>
  <div class="flex justify-between">
  <button class="btn bg-gray-200 hover:bg-gray-400"><i class="fa-solid fa-circle-info"></i></button>
  <button class="btn bg-gray-200 hover:bg-gray-400"><i class="fa-solid fa-volume-high"></i></button>
</div>
</div>
       `
       wordContainer.append(card)

    });
}


const displayLevel = (levels)=>{

    const levelContainer = document.getElementById('level-container')
    levelContainer.innerHTML= "";

  for (const level of levels) {
 
    const divBtn = document.createElement("div")
    
    divBtn.innerHTML= `
    <button onclick="loadLevelWord(${level.level_no})" id="click-btn-${level.level_no}" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i>Learn ${level.level_no} </button>
    `

    levelContainer.append(divBtn)
  }
}
levelContent()