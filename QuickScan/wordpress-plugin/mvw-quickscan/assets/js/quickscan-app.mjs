import quickscanData from "./data/quickscan-data.mjs";

const debug = false;

let activeInfoTooltip = null;
let activeHintModal = null;

document.addEventListener("click", () => {
  if (activeInfoTooltip) {
    activeInfoTooltip.classList.remove("mvw-visible");
    activeInfoTooltip = null;
  }
});

function debugLog(...args) {
  if (!debug) return;
  console.log(...args);
}

function showHintModal(root, text) {
  if (activeHintModal) {
    activeHintModal.remove();
  }

  const backdrop = document.createElement("div");
  backdrop.className = "mvw-hint-modal-backdrop";

  const modal = document.createElement("div");
  modal.className = "mvw-hint-modal";

  const modalHeader = document.createElement("div");
  modalHeader.className = "mvw-hint-modal-header";
  modalHeader.textContent = "Info";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "mvw-hint-modal-close";
  closeButton.innerHTML = '<span class="material-icons">close</span>';
  closeButton.addEventListener("click", () => {
    backdrop.remove();
    activeHintModal = null;
  });

  modalHeader.appendChild(closeButton);

  const modalBody = document.createElement("div");
  modalBody.className = "mvw-hint-modal-body";
  modalBody.textContent = text;

  modal.appendChild(modalHeader);
  modal.appendChild(modalBody);
  backdrop.appendChild(modal);

  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) {
      backdrop.remove();
      activeHintModal = null;
    }
  });

  root.appendChild(backdrop);
  activeHintModal = backdrop;
}

/**
 * Map option label to Material Icon name
 */
function getIconForOption(label) {
  const labelLower = label.toLowerCase();

  const iconMap = {
    project: "architecture",
    persoon: "person",
    organisatie: "domain",
    kerk: "church",
    ondersteuning: "groups",
    samenleving: "groups",
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
    hulp: "family_restroom",
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

function getOutcomeIcon(outcomeId) {
  const outcomeIconMap = {
    start_aanvraag: "check_circle",
    noodhulp_contact: "remove",
    mvw_al_reeds_toegekend: "remove",
    project_passend: "check_circle",
    project_niet_passend: "remove",
    project_kerk: "check_circle",
    project_samenleving: "check_circle",
    project_onderwijs: "check_circle",
    bekijk_voorwaarden: "hourglass_empty",
    neem_contact_op: "contact_support",
    neem_contact_op_vermogen: "contact_support",
    niet_aanmerking_donatie: "remove",
  };
  return (
    outcomeIconMap[outcomeId] ||
    (quickscanData.outcomes[outcomeId] ? "check" : "info")
  );
}

/**
 * Initialize one QuickScan instance scoped to a root element, so multiple
 * shortcode instances can coexist on the same page without sharing state.
 */
function createQuickScan(root) {
  const app = root.querySelector(".mvw-app");
  const progressTemplate = root.querySelector(".mvw-progress-template");
  const questionTemplate = root.querySelector(".mvw-question-template");
  const outcomeTemplate = root.querySelector(".mvw-outcome-template");
  const disclaimer = root.querySelector(".mvw-disclaimer");

  const CTA_URLS = {
    contact: root.dataset.contactUrl || "/contact",
    bekijk_voorwaarden: root.dataset.voorwaardenUrl || "/donatie-aanvragen",
    start_aanvraag:
      root.dataset.aanvraagUrl || "https://aanvragen.mvw.nl/Account/Login",
    zie_kerk:
      root.dataset.kerkUrl || "/donatie-aanvragen/donatie-aanvragen-kerk/",
    zie_samenleving:
      root.dataset.samenlevingUrl ||
      "/donatie-aanvragen/donatie-aanvragen-samenleving/",
    zie_onderwijs:
      root.dataset.onderwijsUrl ||
      "/donatie-aanvragen/donatie-aanvragen-onderwijs/",
  };

  let currentQuestionId = "start";
  let selectedCategory = null;
  let questionHistory = [];
  let viewMode = "card";

  function updateDisclaimerVisibility(shouldShow) {
    if (!disclaimer) return;
    disclaimer.style.display = shouldShow ? "" : "none";
  }

  /**
   * Render progress bar showing current and previous step
   */
  function renderProgress() {
    const container = document.createElement("div");
    container.className = "mvw-progress-container";

    if (questionHistory.length === 0) return container;

    const progressFragment = progressTemplate.content.cloneNode(true);
    const stepsContainer = progressFragment.querySelector(
      ".mvw-progress-steps",
    );

    questionHistory.forEach((historyItem, index) => {
      const stepNum = historyItem.step + 1;
      const stepButton = document.createElement("button");
      stepButton.type = "button";
      stepButton.className = "mvw-progress-step";
      stepButton.title = historyItem.title;

      const stepNumberEl = document.createElement("span");
      stepNumberEl.className = "mvw-progress-step-number";
      stepNumberEl.textContent = stepNum;
      stepButton.appendChild(stepNumberEl);

      if (historyItem.label) {
        const stepLabelEl = document.createElement("span");
        stepLabelEl.className = "mvw-progress-step-label";
        stepLabelEl.textContent = historyItem.label;
        stepButton.appendChild(stepLabelEl);
      }

      if (index === questionHistory.length - 1) {
        stepButton.classList.add("mvw-current");
      }

      if (index < questionHistory.length - 1) {
        stepButton.classList.add("mvw-clickable");
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
    updateDisclaimerVisibility(questionId === "start");

    if (!isJump) {
      questionHistory.push({
        id: questionId,
        title: question.title,
        label: question.label,
        step: question.step,
        selectedOption: null,
      });
    }

    app.innerHTML = "";

    if (question.step > 0) {
      app.appendChild(renderProgress());
    }

    const fragment = questionTemplate.content.cloneNode(true);
    const titleElement = fragment.querySelector(".mvw-question-title");
    titleElement.textContent = question.title;

    if (question.info) {
      const header = fragment.querySelector(".mvw-question-header");
      header.classList.add("mvw-question-header-with-info");

      const infoWrapper = document.createElement("div");
      infoWrapper.className = "mvw-question-tooltip";

      const infoButton = document.createElement("button");
      infoButton.type = "button";
      infoButton.className = "mvw-question-info-button";
      infoButton.setAttribute("aria-label", "Meer info");
      infoButton.setAttribute("aria-expanded", "false");
      infoButton.innerHTML = '<span class="material-icons">info</span>';

      const tooltip = document.createElement("div");
      tooltip.className = "mvw-question-tooltip-content";
      tooltip.textContent = question.info;

      infoButton.addEventListener("click", (event) => {
        event.stopPropagation();
        const isVisible = tooltip.classList.toggle("mvw-visible");
        infoButton.setAttribute("aria-expanded", String(isVisible));

        if (isVisible) {
          if (activeInfoTooltip && activeInfoTooltip !== tooltip) {
            activeInfoTooltip.classList.remove("mvw-visible");
          }
          activeInfoTooltip = tooltip;
        } else {
          activeInfoTooltip = null;
        }
      });

      infoWrapper.appendChild(infoButton);
      infoWrapper.appendChild(tooltip);
      header.appendChild(infoWrapper);
    }

    const optionsContainer = fragment.querySelector(".mvw-question-options");
    optionsContainer.innerHTML = "";

    const currentHistoryItem = questionHistory[questionHistory.length - 1];
    const selectedOptionLabel = currentHistoryItem?.selectedOption;

    if (viewMode === "card") {
      const cardContainer = document.createElement("div");
      cardContainer.className = "mvw-question-options-cards";

      question.options.forEach((option) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "mvw-option-card";

        if (selectedOptionLabel === option.label) {
          card.classList.add("mvw-selected");
        }

        const icon = getIconForOption(option.label);
        const iconEl = document.createElement("span");
        iconEl.className = "material-icons mvw-option-icon";
        iconEl.textContent = icon;

        const labelEl = document.createElement("span");
        labelEl.className = "mvw-option-card-label";
        labelEl.innerHTML = option.label;

        card.appendChild(iconEl);
        card.appendChild(labelEl);

        if (option.hint) {
          const infoButton = document.createElement("button");
          infoButton.type = "button";
          infoButton.className = "mvw-option-info-button";
          infoButton.setAttribute("aria-label", "Toon extra informatie");
          infoButton.innerHTML = '<span class="material-icons">info</span>';

          infoButton.addEventListener("click", (event) => {
            event.stopPropagation();
            showHintModal(root, option.hint);
          });

          card.appendChild(infoButton);
        }

        card.addEventListener("click", () => handleAnswer(option));
        cardContainer.appendChild(card);
      });

      optionsContainer.appendChild(cardContainer);
    } else {
      question.options.forEach((option) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "mvw-option-button";

        if (selectedOptionLabel === option.label) {
          button.classList.add("mvw-selected");
        }

        button.textContent = option.label;
        if (option.hint) {
          button.innerHTML = `<span class="mvw-button-label">${option.label}</span><span class="mvw-button-hint">${option.hint}</span>`;
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
    if (questionHistory.length > 0) {
      questionHistory[questionHistory.length - 1].selectedOption =
        option.label;
    }

    debugLog("QuickScan choice:", {
      questionId: currentQuestionId,
      questionTitle: quickscanData.questions[currentQuestionId]?.title,
      selectedOption: option.label,
      history: questionHistory.map((item) => ({
        id: item.id,
        title: item.title,
        selectedOption: item.selectedOption,
      })),
    });

    if (currentQuestionId === "thema" && option.category) {
      selectedCategory = option.category;
    }

    if (option.next === "categoriecheck") {
      const categoryCheckId = quickscanData.getCategoriecheck(selectedCategory);
      renderQuestion(categoryCheckId);
      return;
    }

    if (option.next) {
      renderQuestion(option.next);
      return;
    }

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

    currentQuestionId = "outcome";
    updateDisclaimerVisibility(true);

    const fragment = outcomeTemplate.content.cloneNode(true);

    fragment.querySelector(".mvw-outcome-icon").textContent =
      getOutcomeIcon(outcomeId);
    fragment.querySelector(".mvw-outcome-title").textContent = outcome.title;
    fragment.querySelector(".mvw-outcome-body").textContent = outcome.body;
    fragment.querySelector(".mvw-outcome-list").innerHTML = "";
    fragment.querySelector(".mvw-outcome-post").textContent =
      outcome.post || "";

    if (outcome.list) {
      const listContainer = fragment.querySelector(".mvw-outcome-list");
      outcome.list.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        listContainer.appendChild(listItem);
      });
    }

    const ctasContainer = fragment.querySelector(".mvw-outcome-ctas");
    ctasContainer.innerHTML = "";

    outcome.ctas.forEach((cta) => {
      if (CTA_URLS[cta.action]) {
        const link = document.createElement("a");
        link.className = "mvw-cta-button";
        link.href = CTA_URLS[cta.action];
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = cta.label;
        ctasContainer.appendChild(link);
      } else {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "mvw-cta-button";
        button.textContent = cta.label;
        button.addEventListener("click", () => handleCTA(cta.action));
        ctasContainer.appendChild(button);
      }
    });

    const goBackButton = document.createElement("button");
    goBackButton.type = "button";
    goBackButton.className = "mvw-cta-button mvw-cta-secondary";
    goBackButton.innerHTML = `<span class="material-icons">arrow_back</span><span>Ga terug en pas antwoorden aan</span>`;
    goBackButton.addEventListener("click", () => handleCTA("go_back"));
    ctasContainer.appendChild(goBackButton);

    const resetButton = document.createElement("button");
    resetButton.type = "button";
    resetButton.className = "mvw-cta-button mvw-cta-secondary mvw-cta-reset";
    resetButton.innerHTML = `<span class="material-icons">replay</span><span>Herstart Quick Scan</span>`;
    resetButton.addEventListener("click", () => handleCTA("reset"));
    ctasContainer.appendChild(resetButton);

    app.innerHTML = "";
    app.appendChild(fragment);

    debugLog("QuickScan outcome:", {
      outcomeId,
      outcomeTitle: outcome.title,
      history: questionHistory.map((item) => ({
        id: item.id,
        title: item.title,
        selectedOption: item.selectedOption,
      })),
    });
  }

  /**
   * Handle CTA actions (restart, contact, etc.)
   */
  function handleCTA(action) {
    if (action === "herstart" || action === "reset") {
      selectedCategory = null;
      questionHistory = [];
      renderQuestion("start");
      return;
    }

    if (action === "go_back") {
      if (questionHistory.length > 0) {
        const lastQuestion = questionHistory[questionHistory.length - 1];
        renderQuestion(lastQuestion.id, true);
      }
      return;
    }

    if (CTA_URLS[action]) {
      window.location.href = CTA_URLS[action];
      return;
    }
  }

  /**
   * Setup view toggle event listeners
   */
  function setupViewToggle() {
    const toggleButtons = root.querySelectorAll(".mvw-toggle-btn");
    toggleButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const newView = e.currentTarget.dataset.view;
        if (newView !== viewMode) {
          viewMode = newView;
          toggleButtons.forEach((b) => b.classList.remove("mvw-active"));
          e.currentTarget.classList.add("mvw-active");
          if (questionHistory.length > 0) {
            const currentQuestion =
              questionHistory[questionHistory.length - 1];
            renderQuestion(currentQuestion.id, true);
          }
        }
      });
    });
  }

  setupViewToggle();
  renderQuestion("start");
}

function init() {
  document
    .querySelectorAll(".mvw-quickscan-wrap[data-mvw-quickscan]")
    .forEach((root) => {
      if (root.dataset.mvwInitialized) return;
      root.dataset.mvwInitialized = "true";
      createQuickScan(root);
    });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
