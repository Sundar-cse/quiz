const playerContent = document.getElementById("playerContent");
const playerTitle = document.getElementById("playerTitle");
const playerDescription = document.getElementById("playerDescription");
const submitQuizBtn = document.getElementById("submitQuiz");
const resultSection = document.getElementById("result");
const scoreText = document.getElementById("scoreText");
const retryQuizBtn = document.getElementById("retryQuiz");
const playerNameInput = document.getElementById("playerName");

// =====================================================
// GOOGLE APPS SCRIPT URL
// =====================================================

const GOOGLE_SCRIPT_URL =
    "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";

// =====================================================

let quiz = null;

function loadQuiz() {

    const saved = localStorage.getItem("quizMakerDraft");

    if (!saved) {
        playerContent.innerHTML =
            "<p>No quiz has been saved on this device yet.</p>";

        submitQuizBtn.disabled = true;

        return;
    }

    try {

        quiz = JSON.parse(saved);

    } catch {

        playerContent.innerHTML =
            "<p>The saved quiz could not be loaded.</p>";

        submitQuizBtn.disabled = true;

        return;
    }

    playerTitle.textContent = quiz.title || "Quiz";
    playerDescription.textContent = quiz.description || "";

    if (!Array.isArray(quiz.questions) ||
        quiz.questions.length === 0) {

        playerContent.innerHTML =
            "<p>This quiz has no questions yet.</p>";

        submitQuizBtn.disabled = true;

        return;
    }

    renderQuiz();
}


// =====================================================
// DISPLAY QUESTIONS
// =====================================================

function renderQuiz() {

    playerContent.innerHTML = quiz.questions.map((item, index) => `

        <div class="preview-question player-question">

            <h3>
                ${index + 1}.
                ${escapeHtml(item.question || "Untitled question")}
            </h3>

            <div class="player-options">

                ${item.options.map((option, optionIndex) => `

                    <label class="player-option">

                        <input
                            type="radio"
                            name="question-${index}"
                            value="${optionIndex}"
                        >

                        <span>
                            ${String.fromCharCode(65 + optionIndex)}.
                            ${escapeHtml(option || "Empty option")}
                        </span>

                    </label>

                `).join("")}

            </div>

        </div>

    `).join("");
}


// =====================================================
// SUBMIT QUIZ
// =====================================================

submitQuizBtn.addEventListener("click", async () => {

    if (!quiz) return;

    // ---------------------------------------------
    // GET PLAYER NAME
    // ---------------------------------------------

    const playerName = playerNameInput.value.trim();

    if (!playerName) {

        alert("Please enter your name.");

        playerNameInput.focus();

        return;
    }


    // ---------------------------------------------
    // CALCULATE SCORE
    // ---------------------------------------------

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

    const percentage = total > 0
        ? ((score / total) * 100).toFixed(2)
        : 0;


    // ---------------------------------------------
    // DISPLAY RESULT
    // ---------------------------------------------

    scoreText.textContent =
        `You scored ${score} out of ${total}. ` +
        `Percentage: ${percentage}%` +
        `${unanswered
            ? ` ${unanswered} question${unanswered === 1 ? "" : "s"} unanswered.`
            : ""
        }`;


    resultSection.classList.remove("hidden");

    resultSection.scrollIntoView({
        behavior: "smooth"
    });


    // ---------------------------------------------
    // SAVE RESULT TO GOOGLE SHEETS
    // ---------------------------------------------

    await saveResultToGoogleSheet({
        name: playerName,
        quiz: quiz.title || "Untitled Quiz",
        score: score,
        total: total,
        percentage: percentage,
        unanswered: unanswered
    });

});


// =====================================================
// SEND RESULT TO GOOGLE SHEETS
// =====================================================

async function saveResultToGoogleSheet(result) {

    try {

        const response = await fetch(GOOGLE_SCRIPT_URL, {

            method: "POST",

            body: JSON.stringify(result)

        });


        const data = await response.json();


        if (data.success) {

            console.log("Result successfully saved to Google Sheets.");

        } else {

            console.error(
                "Google Sheets error:",
                data.error
            );

        }

    } catch (error) {

        console.error(
            "Could not save result:",
            error
        );

    }

}


// =====================================================
// RETRY QUIZ
// =====================================================

retryQuizBtn.addEventListener("click", () => {

    resultSection.classList.add("hidden");

    renderQuiz();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


// =====================================================
// START
// =====================================================

loadQuiz();
