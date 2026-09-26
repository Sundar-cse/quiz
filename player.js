const playerContent = document.getElementById("playerContent");
const playerTitle = document.getElementById("playerTitle");
const playerDescription = document.getElementById("playerDescription");
const submitQuizBtn = document.getElementById("submitQuiz");
const resultSection = document.getElementById("result");
const scoreText = document.getElementById("scoreText");
const retryQuizBtn = document.getElementById("retryQuiz");

let quiz = null;

function loadQuiz() {
    const saved = localStorage.getItem("quizMakerDraft");

    if (!saved) {
        playerContent.innerHTML = "<p>No quiz has been saved on this device yet.</p>";
        submitQuizBtn.disabled = true;
        return;
    }

    try {
        quiz = JSON.parse(saved);
    } catch {
        playerContent.innerHTML = "<p>The saved quiz could not be loaded.</p>";
        submitQuizBtn.disabled = true;
        return;
    }

    playerTitle.textContent = quiz.title || "Quiz";
    playerDescription.textContent = quiz.description || "";

    if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
        playerContent.innerHTML = "<p>This quiz has no questions yet.</p>";
        submitQuizBtn.disabled = true;
        return;
    }

    renderQuiz();
}

function renderQuiz() {
    playerContent.innerHTML = quiz.questions.map((item, index) => `
        <div class="preview-question player-question">
            <h3>${index + 1}. ${escapeHtml(item.question || "Untitled question")}</h3>
            <div class="player-options">
                ${item.options.map((option, optionIndex) => `
                    <label class="player-option">
                        <input type="radio" name="question-${index}" value="${optionIndex}">
                        <span>${String.fromCharCode(65 + optionIndex)}. ${escapeHtml(option || "Empty option")}</span>
                    </label>
                `).join("")}
            </div>
        </div>
    `).join("");
}

submitQuizBtn.addEventListener("click", () => {
    if (!quiz) return;

    let score = 0;
    let unanswered = 0;

    quiz.questions.forEach((item, index) => {
        const selected = document.querySelector(
            `input[name="question-${index}"]:checked`
        );

        if (!selected) {
            unanswered++;
            return;
        }

        if (selected.value === String(item.answer)) {
            score++;
        }
    });

    const total = quiz.questions.length;
    scoreText.textContent =
        `You scored ${score} out of ${total}.${unanswered ? ` ${unanswered} question${unanswered === 1 ? "" : "s"} unanswered.` : ""}`;

    resultSection.classList.remove("hidden");
    resultSection.scrollIntoView({ behavior: "smooth" });
});

retryQuizBtn.addEventListener("click", () => {
    resultSection.classList.add("hidden");
    renderQuiz();
    window.scrollTo({ top: 0, behavior: "smooth" });
});

function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}

loadQuiz();