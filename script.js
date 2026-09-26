const questionList = document.getElementById("questionList");
const questionCount = document.getElementById("questionCount");
const addQuestionBtn = document.getElementById("addQuestion");
const previewBtn = document.getElementById("previewQuiz");
const closePreviewBtn = document.getElementById("closePreview");
const saveQuizBtn = document.getElementById("saveQuiz");
const previewSection = document.getElementById("preview");
const previewContent = document.getElementById("previewContent");

let questions = [];

function addQuestion() {
    questions.push({
        question: "",
        options: ["", "", "", ""],
        answer: ""
    });

    renderQuestions();
}

function renderQuestions() {
    questionList.innerHTML = "";

    questions.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "question-card";

        card.innerHTML = `
            <button type="button" class="delete-btn" data-index="${index}">Delete</button>
            <h3>Question ${index + 1}</h3>

            <label>Question</label>
            <textarea class="question-input" data-index="${index}" placeholder="Enter your question">${item.question}</textarea>

            <label>Answer Options</label>
            <div class="option-grid">
                ${item.options.map((option, optionIndex) => `
                    <input
                        type="text"
                        class="option-input"
                        data-index="${index}"
                        data-option="${optionIndex}"
                        placeholder="Option ${String.fromCharCode(65 + optionIndex)}"
                        value="${option}"
                    >
                `).join("")}
            </div>

            <label>Correct Answer</label>
            <select class="answer-input" data-index="${index}">
                <option value="">Select correct answer</option>
                <option value="0" ${item.answer === "0" ? "selected" : ""}>Option A</option>
                <option value="1" ${item.answer === "1" ? "selected" : ""}>Option B</option>
                <option value="2" ${item.answer === "2" ? "selected" : ""}>Option C</option>
                <option value="3" ${item.answer === "3" ? "selected" : ""}>Option D</option>
            </select>
        `;

        questionList.appendChild(card);
    });

    questionCount.textContent = `${questions.length} question${questions.length === 1 ? "" : "s"}`;
}

questionList.addEventListener("input", (event) => {
    const index = Number(event.target.dataset.index);

    if (event.target.classList.contains("question-input")) {
        questions[index].question = event.target.value;
    }

    if (event.target.classList.contains("option-input")) {
        const optionIndex = Number(event.target.dataset.option);
        questions[index].options[optionIndex] = event.target.value;
    }
});

questionList.addEventListener("change", (event) => {
    if (event.target.classList.contains("answer-input")) {
        const index = Number(event.target.dataset.index);
        questions[index].answer = event.target.value;
    }
});

questionList.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
        const index = Number(event.target.dataset.index);
        questions.splice(index, 1);
        renderQuestions();
    }
});

addQuestionBtn.addEventListener("click", addQuestion);

previewBtn.addEventListener("click", () => {
    const title = document.getElementById("quizTitle").value.trim() || "Untitled Quiz";
    const description = document.getElementById("quizDescription").value.trim();

    previewContent.innerHTML = `
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(description)}</p>
        ${questions.length === 0
            ? "<p>No questions added yet.</p>"
            : questions.map((item, index) => `
                <div class="preview-question">
                    <strong>${index + 1}. ${escapeHtml(item.question || "Untitled question")}</strong>
                    <ol type="A">
                        ${item.options.map(option => `<li>${escapeHtml(option || "Empty option")}</li>`).join("")}
                    </ol>
                </div>
            `).join("")}
    `;

    previewSection.classList.remove("hidden");
    previewSection.scrollIntoView({ behavior: "smooth" });
});

closePreviewBtn.addEventListener("click", () => {
    previewSection.classList.add("hidden");
});

saveQuizBtn.addEventListener("click", () => {
    const quiz = {
        title: document.getElementById("quizTitle").value.trim(),
        description: document.getElementById("quizDescription").value.trim(),
        questions
    };

    localStorage.setItem("quizMakerDraft", JSON.stringify(quiz));
    alert("Quiz saved on this device.");
});

function loadSavedQuiz() {
    const saved = localStorage.getItem("quizMakerDraft");

    if (!saved) {
        addQuestion();
        return;
    }

    try {
        const quiz = JSON.parse(saved);
        document.getElementById("quizTitle").value = quiz.title || "";
        document.getElementById("quizDescription").value = quiz.description || "";
        questions = Array.isArray(quiz.questions) ? quiz.questions : [];
        renderQuestions();

        if (questions.length === 0) {
            addQuestion();
        }
    } catch {
        addQuestion();
    }
}

function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
}

loadSavedQuiz();