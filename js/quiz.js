/**
 * quiz.js - Interactive quiz engine for Oil 101 presentation
 */

const QUIZZES = {
  quiz1: {
    title: "Quiz: Crude Oil Basics",
    questions: [
      {
        q: "What does a higher API gravity number indicate?",
        options: ["Heavier oil", "Lighter oil", "More sulfur content", "Less sulfur content"],
        correct: 1,
      },
      {
        q: "Which type of crude commands the highest price?",
        options: ["Heavy sour", "Heavy sweet", "Light sweet", "Light sour"],
        correct: 2,
      },
      {
        q: "How much oil does the world consume daily?",
        options: ["~50 mb/d", "~75 mb/d", "100+ mb/d", "~200 mb/d"],
        correct: 2,
      },
    ],
  },
  quiz2: {
    title: "Quiz: Refining, Value Chain & Benchmarks",
    questions: [
      {
        q: "What percentage of a barrel of crude becomes gasoline?",
        options: ["~27%", "~43%", "~9%", "~65%"],
        correct: 1,
      },
      {
        q: "Which oil industry segment has INVERSE sensitivity to oil prices?",
        options: ["Upstream (E&P)", "Midstream", "Downstream (Refining)", "Oilfield Services"],
        correct: 2,
      },
      {
        q: "Which benchmark crude prices approximately 75% of world oil?",
        options: ["WTI", "Brent", "Dubai/Oman", "Urals"],
        correct: 1,
      },
      {
        q: "What makes a refinery 'complex'?",
        options: [
          "More employees and larger facilities",
          "Ability to process heavy sour crude via cracking & coking",
          "Larger storage tank capacity",
          "Proximity to shipping ports",
        ],
        correct: 1,
      },
    ],
  },
  quiz3: {
    title: "Quiz: Companies & Pricing",
    questions: [
      {
        q: "What is the #1 valuation metric for E&P companies today?",
        options: ["P/E ratio", "Free Cash Flow Yield", "Revenue growth rate", "EV/EBITDA"],
        correct: 1,
      },
      {
        q: "'Backwardation' in the oil futures market means:",
        options: [
          "Spot prices exceed futures prices (tight supply)",
          "Futures prices exceed spot prices (oversupply)",
          "Prices are flat across all months",
          "The market is temporarily closed",
        ],
        correct: 0,
      },
      {
        q: "Which company is the largest US LNG exporter?",
        options: ["Enterprise Products (EPD)", "Energy Transfer (ET)", "Cheniere Energy (LNG)", "Williams Companies (WMB)"],
        correct: 2,
      },
    ],
  },
  quiz4: {
    title: "Quiz: Geopolitics & the 2026 Crisis",
    questions: [
      {
        q: "How much oil transits the Strait of Hormuz daily?",
        options: ["~5 mb/d", "~10 mb/d", "~20 mb/d", "~50 mb/d"],
        correct: 2,
      },
      {
        q: "What was Brent crude's peak price during the 2026 Iran crisis?",
        options: ["$90/bbl", "$102/bbl", "$126/bbl", "$150/bbl"],
        correct: 2,
      },
      {
        q: "What event led to the IRGC closing the Strait of Hormuz?",
        options: [
          "US-Israel military strikes on Iran",
          "OPEC+ production cut disagreement",
          "Hurricane damage to Gulf infrastructure",
          "Pipeline explosion in Saudi Arabia",
        ],
        correct: 0,
      },
    ],
  },
  quiz5: {
    title: "Final Quiz: Comprehensive Review",
    questions: [
      {
        q: "Venezuela has the world's largest...",
        options: ["Oil production rate", "Proven oil reserves", "Refining capacity", "LNG export volume"],
        correct: 1,
      },
      {
        q: "Which company is the clear first-mover in Venezuela's oil reopening?",
        options: ["ExxonMobil (XOM)", "Chevron (CVX)", "SLB (Schlumberger)", "Valero Energy (VLO)"],
        correct: 1,
      },
      {
        q: "Which sub-sector offers the best risk-adjusted play during the Hormuz crisis?",
        options: ["Pure-play E&P", "Integrated Supermajors", "Downstream Refiners", "Oilfield Services"],
        correct: 1,
      },
      {
        q: "The 3-2-1 crack spread measures:",
        options: ["E&P production margins", "Refiner gross margin", "Pipeline transportation fees", "LNG export pricing"],
        correct: 1,
      },
    ],
  },
};

// Track global score
let totalCorrect = 0;
let totalAnswered = 0;

function initQuizzes() {
  document.querySelectorAll('.quiz-slide').forEach(slide => {
    const quizId = slide.dataset.quiz;
    const quiz = QUIZZES[quizId];
    if (!quiz) return;
    renderQuiz(slide, quiz, quizId);
  });
}

function renderQuiz(container, quiz, quizId) {
  const wrapper = container.querySelector('.quiz-container') || container;
  let answeredCount = 0;

  let html = `
    <div class="quiz-header">
      <h2>${quiz.title}</h2>
      <div class="quiz-score" id="score-${quizId}">Answer all questions to continue</div>
    </div>
  `;

  quiz.questions.forEach((q, qi) => {
    html += `
      <div class="quiz-question" data-qi="${qi}">
        <div class="quiz-question-text">${qi + 1}. ${q.q}</div>
        <div class="quiz-options">
          ${q.options.map((opt, oi) => `
            <button class="quiz-option" data-qi="${qi}" data-oi="${oi}">${opt}</button>
          `).join('')}
        </div>
      </div>
    `;
  });

  wrapper.innerHTML = html;

  // Attach click handlers
  wrapper.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', function() {
      const qi = parseInt(this.dataset.qi);
      const oi = parseInt(this.dataset.oi);
      const question = quiz.questions[qi];
      const qContainer = wrapper.querySelector(`.quiz-question[data-qi="${qi}"]`);

      // Already answered?
      if (qContainer.classList.contains('done')) return;
      qContainer.classList.add('done');

      const allOptions = qContainer.querySelectorAll('.quiz-option');
      allOptions.forEach(o => o.classList.add('answered'));

      if (oi === question.correct) {
        this.classList.add('correct');
        totalCorrect++;
      } else {
        this.classList.add('incorrect');
        allOptions[question.correct].classList.add('show-correct');
      }
      totalAnswered++;
      answeredCount++;

      const scoreEl = document.getElementById(`score-${quizId}`);
      if (answeredCount === quiz.questions.length) {
        const quizCorrect = wrapper.querySelectorAll('.quiz-option.correct').length;
        scoreEl.innerHTML = `Score: <strong style="color:var(--accent)">${quizCorrect}/${quiz.questions.length}</strong> &mdash; Overall: ${totalCorrect}/${totalAnswered}`;
      } else {
        scoreEl.textContent = `${answeredCount}/${quiz.questions.length} answered`;
      }
    });
  });
}

// Auto-init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuizzes);
} else {
  initQuizzes();
}
