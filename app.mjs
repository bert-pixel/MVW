import quickscanData from "./data/quickscanData.mjs";

const app = document.getElementById("app");
const progressTemplate = document.getElementById("progress-template");
const questionTemplate = document.getElementById("question-template");
const outcomeTemplate = document.getElementById("outcome-template");
const ctaTemplate = document.getElementById("cta-template");

let currentQuestionId = "start";
let selectedCategory = null;
let questionHistory = [];
let viewMode = "card";

/**
 * Map option label to Material Icon name
 */
function getIconForOption(label) {
  const labelLower = label.toLowerCase();

  const iconMap = {
    project: "folder",
    persoon: "person",
    organisatie: "domain",
    kerk: "church",
    ondersteuning: "help",
    diaconie: "favorite",
    onderwijs: "school",
    duurzaam: "eco",
    versterking: "trending_up",
    vernieuw: "refresh",
    migrant: "public",
    intercultureel: "public",
    pionier: "flag",
    gebouw: "domain",
    orgel: "music_note",
    inloop: "location_city",
    presentie: "groups",
    hulp: "support_agent",
    faciliteiten: "home",
    recreatie: "videogame_asset",
    vorming: "palette",
    identiteit: "account_circle",
    alfabetisering: "menu_book",
    mezelf: "person",
    hulpverlener: "person_search",
    intermediair: "handshake",
  };

  if (/\bja\b/.test(labelLower)) {
    return "check";
  }
  if (/\bnee\b/.test(labelLower)) {
    return "close";
  }
  if (labelLower.includes("nog niet")) {
    return "hourglass_empty";
  }

  for (const [keyword, icon] of Object.entries(iconMap)) {
    if (labelLower.includes(keyword)) {
      return icon;
    }
  }

  return "help_outline";
}

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

  if (viewMode === "card") {
    const cardContainer = document.createElement("div");
    cardContainer.className = "question-options-cards";

    question.options.forEach((option) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "option-card";

      if (selectedOptionLabel === option.label) {
        card.classList.add("selected");
      }

      const icon = getIconForOption(option.label);
      card.innerHTML = `<span class="material-icons option-icon">${icon}</span><span class="option-card-label">${option.label}</span>`;
      card.addEventListener("click", () => handleAnswer(option));
      cardContainer.appendChild(card);
    });

    optionsContainer.appendChild(cardContainer);
  } else {
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
  }

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

function getOutcomeIcon(outcomeId) {
  const outcomeIconMap = {
    waarschijnlijk_passend: "check_circle",
    bekijk_voorwaarden: "hourglass_empty",
    neem_contact_op: "contact_support",
    niet_passend: "close",
    partnerroute: "share",
  };
  return outcomeIconMap[outcomeId] || "info";
}

/**
 * Render an outcome/result
 */
function renderOutcome(outcomeId) {
  const outcome = quickscanData.outcomes[outcomeId];
  if (!outcome) return;

  const fragment = outcomeTemplate.content.cloneNode(true);

  fragment.querySelector(".outcome-icon").textContent =
    getOutcomeIcon(outcomeId);
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
  goBackButton.innerHTML = `<span class="material-icons">arrow_back</span><span>Ga terug en pas antwoorden aan</span>`;
  goBackButton.addEventListener("click", () => handleCTA("go_back"));
  ctasContainer.appendChild(goBackButton);

  // Add "Reset" button
  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.className = "cta-button cta-secondary";
  resetButton.innerHTML = `<span class="material-icons">replay</span><span>Herstart Quick Scan</span>`;
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

/**
 * Setup view toggle event listeners
 */
function setupViewToggle() {
  const toggleButtons = document.querySelectorAll(".toggle-btn");
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const newView = e.currentTarget.dataset.view;
      if (newView !== viewMode) {
        viewMode = newView;
        toggleButtons.forEach((b) => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
        // Re-render current question with new view mode
        if (questionHistory.length > 0) {
          const currentQuestion = questionHistory[questionHistory.length - 1];
          renderQuestion(currentQuestion.id, true);
        }
      }
    });
  });
}

// Initialize
setupViewToggle();
renderQuestion("start");
