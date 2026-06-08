import quickscanData from "./data/quickscanData.mjs";

const app = document.getElementById("app");
const progressTemplate = document.getElementById("progress-template");
const questionTemplate = document.getElementById("question-template");
const outcomeTemplate = document.getElementById("outcome-template");
const ctaTemplate = document.getElementById("cta-template");

let currentQuestionId = "start";
let selectedCategory = null;
let questionHistory = [];

/**
 * Render progress bar showing current and previous step
 */
function renderProgress() {
  const container = document.createElement("div");
  container.className = "progress-container";

  if (questionHistory.length === 0) return container;

  const progressFragment = progressTemplate.content.cloneNode(true);
  const stepsContainer = progressFragment.querySelector(".progress-steps");

  questionHistory.forEach((historyItem, index) => {
    const stepNum = historyItem.step + 1;
    const stepButton = document.createElement("button");
    stepButton.type = "button";
    stepButton.className = "progress-step";
    stepButton.textContent = stepNum;
    stepButton.title = historyItem.title;

    if (index === questionHistory.length - 1) {
      stepButton.classList.add("current");
    }

    if (index < questionHistory.length - 1) {
      stepButton.classList.add("clickable");
      stepButton.addEventListener("click", () => jumpToStep(index));
    }

    stepsContainer.appendChild(stepButton);
  });

  container.appendChild(progressFragment);
  return container;
}

/**
 * Jump back to a previous step and clear history after it
 */
function jumpToStep(historyIndex) {
  questionHistory = questionHistory.slice(0, historyIndex + 1);
  const targetQuestion = questionHistory[historyIndex];
  currentQuestionId = targetQuestion.id;

  const themaIndex = questionHistory.findIndex(
    (item) => quickscanData.questions[item.id]?.id === "thema",
  );
  if (themaIndex === -1 || historyIndex < themaIndex) {
    selectedCategory = null;
  }

  renderQuestion(currentQuestionId, true);
}

/**
 * Render a question and its options
 */
function renderQuestion(questionId, isJump = false) {
  const question = quickscanData.questions[questionId];
  if (!question) return;

  currentQuestionId = questionId;

  if (!isJump) {
    questionHistory.push({
      id: questionId,
      title: question.title,
      step: question.step,
      selectedOption: null,
    });
  }

  app.innerHTML = "";

  if (question.step > 0) {
    app.appendChild(renderProgress());
  }

  const fragment = questionTemplate.content.cloneNode(true);
  fragment.querySelector(".question-title").textContent = question.title;
  const optionsContainer = fragment.querySelector(".question-options");
  optionsContainer.innerHTML = "";

  const currentHistoryItem = questionHistory[questionHistory.length - 1];
  const selectedOptionLabel = currentHistoryItem?.selectedOption;

  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-button";

    if (selectedOptionLabel === option.label) {
      button.classList.add("selected");
    }

    button.textContent = option.label;
    if (option.hint) {
      button.innerHTML = `<span class="button-label">${option.label}</span><span class="button-hint">${option.hint}</span>`;
    }
    button.addEventListener("click", () => handleAnswer(option));
    optionsContainer.appendChild(button);
  });

  app.appendChild(fragment);
}

/**
 * Handle answer selection and navigate to next question or outcome
 */
function handleAnswer(option) {
  // Record selected option in current history item
  if (questionHistory.length > 0) {
    questionHistory[questionHistory.length - 1].selectedOption = option.label;
  }

  // Store category if this is from the thema question
  if (currentQuestionId === "thema" && option.category) {
    selectedCategory = option.category;
  }

  // Handle routing: categoriecheck needs special logic
  if (option.next === "categoriecheck") {
    const categoryCheckId = quickscanData.getCategoriecheck(selectedCategory);
    renderQuestion(categoryCheckId);
    return;
  }

  // Normal next question
  if (option.next) {
    renderQuestion(option.next);
    return;
  }

  // Outcome
  if (option.outcome) {
    renderOutcome(option.outcome);
  }
}

/**
 * Render an outcome/result
 */
function renderOutcome(outcomeId) {
  const outcome = quickscanData.outcomes[outcomeId];
  if (!outcome) return;

  const fragment = outcomeTemplate.content.cloneNode(true);

  fragment.querySelector(".outcome-title").textContent = outcome.title;
  fragment.querySelector(".outcome-body").textContent = outcome.body;

  const ctasContainer = fragment.querySelector(".outcome-ctas");
  ctasContainer.innerHTML = "";

  outcome.ctas.forEach((cta) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "cta-button";
    button.textContent = cta.label;
    button.addEventListener("click", () => handleCTA(cta.action));
    ctasContainer.appendChild(button);
  });

  // Add "Go back and change answer" button
  const goBackButton = document.createElement("button");
  goBackButton.type = "button";
  goBackButton.className = "cta-button cta-secondary";
  goBackButton.textContent = "Go back and change answer";
  goBackButton.addEventListener("click", () => handleCTA("go_back"));
  ctasContainer.appendChild(goBackButton);

  // Add "Reset" button
  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.className = "cta-button cta-secondary";
  resetButton.textContent = "Reset";
  resetButton.addEventListener("click", () => handleCTA("reset"));
  ctasContainer.appendChild(resetButton);

  app.innerHTML = "";
  app.appendChild(fragment);
}

/**
 * Handle CTA actions (restart, contact, etc.)
 */
function handleCTA(action) {
  if (action === "herstart" || action === "reset") {
    selectedCategory = null;
    questionHistory = [];
    renderQuestion("start");
  } else if (action === "go_back") {
    // Go back to the last question
    if (questionHistory.length > 0) {
      const lastQuestion = questionHistory[questionHistory.length - 1];
      renderQuestion(lastQuestion.id, true);
    }
  }
  // Add other CTA handlers as needed (contact, bekijk_routes, etc.)
}

// Initialize
renderQuestion("start");
