/* =========================
   設定
========================= */

const STORAGE_KEY = "englishWordTrainerWords";
const QUIZ_COUNT = 10;


/* =========================
   初期単語
========================= */

const defaultWords = [
  { word: "refer", meaning: "参照する、言及する" },
  { word: "opening", meaning: "開始、空き" },
  { word: "construction", meaning: "建設" },
  { word: "indicate", meaning: "示す" },
  { word: "include", meaning: "含む" },
  { word: "currently", meaning: "現在" },
  { word: "charge", meaning: "料金、請求する" },
  { word: "application", meaning: "応募、申請" },
  { word: "management", meaning: "経営、管理" },
  { word: "pleased", meaning: "喜んで、満足して" }
];


/* =========================
   DOM
========================= */

const wordInput = document.getElementById("word-input");
const meaningInput = document.getElementById("meaning-input");
const addButton = document.getElementById("add-button");
const message = document.getElementById("message");

const wordBookButton = document.getElementById("word-book-button");
const wordBookModal = document.getElementById("word-book-modal");
const closeWordBook = document.getElementById("close-word-book");

const wordCount = document.getElementById("word-count");
const wordList = document.getElementById("word-list");

const startQuizButton =
  document.getElementById("start-quiz-button");

const quizScreen =
  document.getElementById("quiz-screen");

const resultScreen =
  document.getElementById("result-screen");

const questionNumber =
  document.getElementById("question-number");

const scoreDisplay =
  document.getElementById("score");

const progressBar =
  document.getElementById("progress-bar");

const quizWord =
  document.getElementById("quiz-word");

const choices =
  document.getElementById("choices");

const feedback =
  document.getElementById("feedback");

const nextButton =
  document.getElementById("next-button");

const finalScore =
  document.getElementById("final-score");

const resultMessage =
  document.getElementById("result-message");

const restartButton =
  document.getElementById("restart-button");


/* =========================
   クイズ用変数
========================= */

let quizWords = [];
let currentQuestion = 0;
let score = 0;


/* =========================
   localStorage
========================= */

function getWords() {

  const savedWords =
    localStorage.getItem(STORAGE_KEY);

  if (!savedWords) {

    saveWords(defaultWords);

    return defaultWords;

  }

  try {

    return JSON.parse(savedWords);

  } catch (error) {

    saveWords(defaultWords);

    return defaultWords;

  }

}


function saveWords(words) {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(words)
  );

}


/* =========================
   シャッフル
========================= */

function shuffle(array) {

  const result = [...array];

  for (
    let i = result.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] =
      [result[j], result[i]];

  }

  return result;

}


/* =========================
   単語リスト表示
========================= */

function renderWords() {

  const words = getWords();

  wordCount.textContent =
    `${words.length} words`;

  wordList.innerHTML = "";


  if (words.length === 0) {

    wordList.innerHTML =
      "<p>まだ単語が登録されていません。</p>";

    return;

  }


  const displayWords =
    [...words].reverse();


  displayWords.forEach((item) => {

    const wordItem =
      document.createElement("div");

    wordItem.className =
      "word-item";


    const wordInfo =
      document.createElement("div");

    wordInfo.className =
      "word-info";


    const word =
      document.createElement("strong");

    word.textContent =
      item.word;


    const meaning =
      document.createElement("span");

    meaning.textContent =
      item.meaning;


    wordInfo.appendChild(word);
    wordInfo.appendChild(meaning);


    const deleteButton =
      document.createElement("button");

    deleteButton.className =
      "delete-button";

    deleteButton.textContent =
      "削除";


    const originalIndex =
      words.indexOf(item);


    deleteButton.addEventListener(
      "click",
      () => deleteWord(originalIndex)
    );


    wordItem.appendChild(wordInfo);
    wordItem.appendChild(deleteButton);

    wordList.appendChild(wordItem);

  });

}


/* =========================
   単語追加
========================= */

function addWord() {

  const word =
    wordInput.value.trim();

  const meaning =
    meaningInput.value.trim();


  if (!word || !meaning) {

    showMessage(
      "英単語と意味を入力してください。",
      "error"
    );

    return;

  }


  const words = getWords();


  const duplicate =
    words.some(
      item =>
        item.word.toLowerCase() ===
        word.toLowerCase()
    );


  if (duplicate) {

    showMessage(
      "その英単語はすでに登録されています。",
      "error"
    );

    return;

  }


  words.push({
    word,
    meaning
  });


  saveWords(words);

  renderWords();


  wordInput.value = "";
  meaningInput.value = "";


  showMessage(
    "単語を登録しました！",
    "success"
  );


  wordInput.focus();

}


/* =========================
   単語削除
========================= */

function deleteWord(index) {

  const words = getWords();

  const target = words[index];


  const result =
    confirm(
      `${target.word} を削除しますか？`
    );


  if (!result) {
    return;
  }


  words.splice(index, 1);

  saveWords(words);

  renderWords();

  showMessage(
    "単語を削除しました。",
    "success"
  );

}


/* =========================
   メッセージ
========================= */

function showMessage(text, type) {

  message.textContent = text;


  if (type === "error") {

    message.style.color =
      "#ff477f";

  } else {

    message.style.color =
      "#35a866";

  }


  setTimeout(() => {

    message.textContent = "";

  }, 2500);

}


/* =========================
   単語帳を開く
========================= */

function openWordBook() {

  renderWords();

  wordBookModal.classList.remove("hidden");

  wordBookModal.setAttribute(
    "aria-hidden",
    "false"
  );


  // 背景のスクロールを止める
  document.body.style.overflow = "hidden";


  setTimeout(() => {

    closeWordBook.focus();

  }, 50);

}


/* =========================
   単語帳を閉じる
========================= */

function closeWordBookModal() {

  wordBookModal.classList.add("hidden");

  wordBookModal.setAttribute(
    "aria-hidden",
    "true"
  );


  // 背景スクロールを戻す
  document.body.style.overflow = "";

}


/* =========================
   モーダル操作
========================= */

wordBookButton.addEventListener(
  "click",
  openWordBook
);


closeWordBook.addEventListener(
  "click",
  closeWordBookModal
);


/*
  モーダルの黒い背景部分を
  クリックしても閉じる
*/

wordBookModal.addEventListener(
  "click",
  (event) => {

    if (
      event.target === wordBookModal
    ) {

      closeWordBookModal();

    }

  }
);


/*
  ESCキーでも閉じる
*/

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      !wordBookModal.classList.contains("hidden")
    ) {

      closeWordBookModal();

    }

  }
);


/* =========================
   クイズ開始
========================= */

function startQuiz() {

  const words = getWords();


  if (words.length < 4) {

    alert(
      "クイズには最低4単語必要です。\nあと少し登録しましょう！"
    );

    return;

  }


  quizWords =
    shuffle(words).slice(
      0,
      Math.min(QUIZ_COUNT, words.length)
    );


  currentQuestion = 0;

  score = 0;


  scoreDisplay.textContent =
    "SCORE 0";


  quizScreen.classList.remove("hidden");

  resultScreen.classList.add("hidden");


  quizScreen.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });


  showQuestion();

}


/* =========================
   問題表示
========================= */

function showQuestion() {

  const currentWord =
    quizWords[currentQuestion];


  questionNumber.textContent =
    `QUESTION ${currentQuestion + 1} / ${quizWords.length}`;


  scoreDisplay.textContent =
    `SCORE ${score}`;


  const progress =
    ((currentQuestion + 1) /
      quizWords.length) * 100;


  progressBar.style.width =
    `${progress}%`;


  quizWord.textContent =
    currentWord.word;


  choices.innerHTML = "";

  feedback.textContent = "";

  nextButton.classList.add("hidden");


  /*
    正解
  */

  const correctAnswer =
    currentWord.meaning;


  /*
    他の単語から
    3つの意味を取得
  */

  const otherWords =
    quizWords.filter(
      item =>
        item.word !== currentWord.word
    );


  const wrongAnswers =
    shuffle(otherWords)
      .slice(0, 3)
      .map(item => item.meaning);


  /*
    正解＋不正解をシャッフル
  */

  const answerChoices =
    shuffle([
      correctAnswer,
      ...wrongAnswers
    ]);


  answerChoices.forEach(
    answer => {

      const button =
        document.createElement("button");

      button.className =
        "choice-button";

      button.textContent =
        answer;


      button.addEventListener(
        "click",
        () =>
          checkAnswer(
            button,
            answer,
            correctAnswer
          )
      );


      choices.appendChild(button);

    }
  );

}


/* =========================
   回答チェック
========================= */

function checkAnswer(
  selectedButton,
  selectedAnswer,
  correctAnswer
) {

  const buttons =
    document.querySelectorAll(
      ".choice-button"
    );


  /*
    二重クリック防止
  */

  buttons.forEach(button => {

    button.disabled = true;

  });


  /*
    正解ボタンを緑にする
  */

  buttons.forEach(button => {

    if (
      button.textContent ===
      correctAnswer
    ) {

      button.classList.add(
        "correct"
      );

    }

  });


  /*
    正解
  */

  if (
    selectedAnswer ===
    correctAnswer
  ) {

    score++;

    scoreDisplay.textContent =
      `SCORE ${score}`;

    feedback.textContent =
      "⭕ CORRECT!";


    feedback.style.color =
      "#35a866";

  }

  /*
    不正解
  */

  else {

    selectedButton.classList.add(
      "wrong"
    );

    feedback.textContent =
      `❌ WRONG... 正解は「${correctAnswer}」`;

    feedback.style.color =
      "#ff477f";

  }


  nextButton.classList.remove(
    "hidden"
  );

}


/* =========================
   次の問題
========================= */

function nextQuestion() {

  currentQuestion++;


  if (
    currentQuestion >=
    quizWords.length
  ) {

    showResult();

    return;

  }


  showQuestion();

}


/* =========================
   結果
========================= */

function showResult() {

  quizScreen.classList.add(
    "hidden"
  );

  resultScreen.classList.remove(
    "hidden"
  );


  finalScore.textContent =
    `${score} / ${quizWords.length}`;


  const percentage =
    Math.round(
      score /
      quizWords.length *
      100
    );


  if (percentage === 100) {

    resultMessage.textContent =
      "PERFECT! 🎉 すごい！";

  }

  else if (percentage >= 80) {

    resultMessage.textContent =
      "GREAT! 👍 かなり覚えています！";

  }

  else if (percentage >= 60) {

    resultMessage.textContent =
      "GOOD! ✨ もう少しで完璧！";

  }

  else {

    resultMessage.textContent =
      "KEEP GOING! 💪 もう一度挑戦しよう！";

  }


  resultScreen.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

}


/* =========================
   イベント
========================= */

addButton.addEventListener(
  "click",
  addWord
);


startQuizButton.addEventListener(
  "click",
  startQuiz
);


nextButton.addEventListener(
  "click",
  nextQuestion
);


restartButton.addEventListener(
  "click",
  startQuiz
);


/* =========================
   Enterキー
========================= */

wordInput.addEventListener(
  "keydown",
  event => {

    if (event.key === "Enter") {

      meaningInput.focus();

    }

  }
);


meaningInput.addEventListener(
  "keydown",
  event => {

    if (event.key === "Enter") {

      addWord();

    }

  }
);


/* =========================
   HTMLエスケープ
========================= */

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}


/* =========================
   初期表示
========================= */

renderWords();