// ============================================================
// CYBERSECURITY EVENT QUIZ
// ============================================================

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxP_rYorpRJD8pJ_3SQiOPEI-73DKvYZbrL6qNNP70iYIIAT1SWK7FziXe2SPojWE4CNQ/exec";


// ============================================================
// QUIZ DATA
// ============================================================

const questions = [

    {
        question:
            "What is the main purpose of a firewall?",

        options: [
            "To increase internet speed",
            "To block unauthorized network access",
            "To create passwords",
            "To store files"
        ],

        answer: 1
    },


    {
        question:
            "Which of the following is the strongest password?",

        options: [
            "password123",
            "admin2025",
            "John@123",
            "T9#vL2!qR7@x"
        ],

        answer: 3
    },


    {
        question:
            "What is phishing?",

        options: [
            "A method of encrypting files",
            "A fraudulent attempt to obtain sensitive information",
            "A type of antivirus software",
            "A method of backing up data"
        ],

        answer: 1
    },


    {
        question:
            "What does MFA stand for?",

        options: [
            "Multiple File Access",
            "Multi-Factor Authentication",
            "Managed Firewall Application",
            "Main Function Authorization"
        ],

        answer: 1
    },


    {
        question:
            "What is the safest action when receiving an unexpected email attachment?",

        options: [
            "Open it immediately",
            "Forward it to friends",
            "Verify the sender before opening it",
            "Disable antivirus software"
        ],

        answer: 2
    },


    {
        question:
            "What does HTTPS primarily provide for a website connection?",

        options: [
            "Faster downloads",
            "Encrypted communication",
            "Unlimited storage",
            "Automatic virus removal"
        ],

        answer: 1
    },


    // ========================================================
    // CASE STUDY
    // ========================================================

    {
        caseStudy: `
            <strong>Case Study: The Fake Company Email</strong>

            <p>
            Rahul works for ABC Technologies.
            One morning he receives an email claiming to be
            from IT Support.
            </p>

            <p>
            The email says that his account will be disabled
            unless he verifies his password immediately.
            It contains a link to a login page.
            </p>

            <p>
            Rahul clicks the link and enters his username
            and password. A few minutes later, he receives
            a notification that his password has been changed.
            </p>
        `,

        question:
            "What type of attack did Rahul most likely experience?",

        options: [
            "Phishing",
            "DDoS attack",
            "SQL injection",
            "Physical theft"
        ],

        answer: 0
    },


    {
        caseStudy: `
            <strong>Same Case Study</strong>

            <p>
            Rahul received an urgent email claiming to be
            from IT Support. The email asked him to verify
            his password using a suspicious link.
            </p>
        `,

        question:
            "What was the biggest warning sign in the email?",

        options: [
            "It contained text",
            "It used an urgent threat and suspicious domain",
            "It came during working hours",
            "It mentioned IT support"
        ],

        answer: 1
    },


    {
        caseStudy: `
            <strong>Same Case Study</strong>

            <p>
            Rahul receives a suspicious email asking him
            to log in through an unfamiliar link.
            </p>
        `,

        question:
            "What should Rahul have done before entering his credentials?",

        options: [
            "Click the link again",
            "Reply with his password",
            "Verify the request through an official company channel",
            "Forward his password to IT"
        ],

        answer: 2
    },


    {
        caseStudy: `
            <strong>Same Case Study</strong>

            <p>
            Rahul has already entered his username and password
            into the suspicious website.
            </p>
        `,

        question:
            "What should Rahul do first?",

        options: [
            "Ignore the incident",
            "Change the password through the legitimate company system and report the incident",
            "Send his password to his colleagues",
            "Delete the email and do nothing"
        ],

        answer: 1
    }

];


// ============================================================
// STATE
// ============================================================

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

let playerName = "";

let startTime = null;
let endTime = null;

const QUIZ_TIME = 10 * 60;

let remainingTime = QUIZ_TIME;
let timerInterval = null;


// ============================================================
// ELEMENTS
// ============================================================

const nameScreen =
    document.getElementById("nameScreen");

const quizScreen =
    document.getElementById("quizScreen");

const resultScreen =
    document.getElementById("resultScreen");

const playerNameInput =
    document.getElementById("playerName");

const startQuizButton =
    document.getElementById("startQuiz");

const questionText =
    document.getElementById("questionText");

const optionsContainer =
    document.getElementById("options");

const caseStudy =
    document.getElementById("caseStudy");

const nextButton =
    document.getElementById("nextButton");

const questionNumber =
    document.getElementById("questionNumber");

const progressPercent =
    document.getElementById("progressPercent");

const progressBar =
    document.getElementById("progressBar");

const timer =
    document.getElementById("timer");


// ============================================================
// START QUIZ
// ============================================================

startQuizButton.addEventListener(
    "click",
    startQuiz
);


function startQuiz() {

    playerName =
        playerNameInput.value.trim();

    if (!playerName) {

        playerNameInput.focus();

        playerNameInput.classList.add("input-error");

        setTimeout(() => {

            playerNameInput.classList.remove(
                "input-error"
            );

        }, 500);

        return;
    }


    startTime = Date.now();

    currentQuestion = 0;

    score = 0;

    remainingTime = QUIZ_TIME;


    nameScreen.classList.add("hidden");

    quizScreen.classList.remove("hidden");


    startTimer();

    showQuestion();
}


// ============================================================
// TIMER
// ============================================================

function startTimer() {

    updateTimer();

    timerInterval =
        setInterval(() => {

            remainingTime--;

            updateTimer();

            if (remainingTime <= 0) {

                clearInterval(timerInterval);

                finishQuiz();

            }

        }, 1000);
}


function updateTimer() {

    const minutes =
        Math.floor(remainingTime / 60);

    const seconds =
        remainingTime % 60;

    timer.textContent =
        `${minutes}:${seconds
            .toString()
            .padStart(2, "0")}`;


    if (remainingTime <= 60) {

        timer.classList.add("timer-warning");

    }

}


// ============================================================
// DISPLAY QUESTION
// ============================================================

function showQuestion() {

    selectedAnswer = null;

    nextButton.disabled = true;


    const question =
        questions[currentQuestion];


    const number =
        currentQuestion + 1;

    const percentage =
        Math.round(
            (number / questions.length) * 100
        );


    questionNumber.textContent =
        `Question ${number} of ${questions.length}`;


    progressPercent.textContent =
        `${percentage}%`;


    progressBar.style.width =
        `${percentage}%`;


    questionText.textContent =
        question.question;


    // CASE STUDY

    if (question.caseStudy) {

        caseStudy.innerHTML =
            question.caseStudy;

        caseStudy.classList.remove("hidden");

    } else {

        caseStudy.classList.add("hidden");

    }


    // OPTIONS

    optionsContainer.innerHTML = "";


    question.options.forEach(
        (option, index) => {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "option";

            button.innerHTML = `
                <span class="option-letter">
                    ${String.fromCharCode(65 + index)}
                </span>

                <span>
                    ${escapeHtml(option)}
                </span>
            `;


            button.addEventListener(
                "click",
                () => selectAnswer(
                    index,
                    button
                )
            );


            optionsContainer.appendChild(button);

        }
    );


    // Animation

    const card =
        document.getElementById("questionCard");

    card.classList.remove("question-enter");

    void card.offsetWidth;

    card.classList.add("question-enter");
}


// ============================================================
// SELECT ANSWER
// ============================================================

function selectAnswer(
    index,
    button
) {

    selectedAnswer = index;


    document
        .querySelectorAll(".option")
        .forEach(option => {

            option.classList.remove(
                "selected"
            );

        });


    button.classList.add(
        "selected"
    );


    nextButton.disabled = false;
}


// ============================================================
// NEXT
// ============================================================

nextButton.addEventListener(
    "click",
    () => {

        if (selectedAnswer === null) {

            return;

        }


        if (
            selectedAnswer ===
            questions[currentQuestion].answer
        ) {

            score++;

        }


        currentQuestion++;


        if (
            currentQuestion >=
            questions.length
        ) {

            finishQuiz();

        } else {

            showQuestion();

        }

    }
);


// ============================================================
// FINISH QUIZ
// ============================================================

async function finishQuiz() {

    clearInterval(timerInterval);


    endTime = Date.now();


    const total =
        questions.length;


    const percentage =
        Math.round(
            (score / total) * 100
        );


    const timeTaken =
        Math.round(
            (endTime - startTime) / 1000
        );


    quizScreen.classList.add(
        "hidden"
    );


    resultScreen.classList.remove(
        "hidden"
    );


    document.getElementById(
        "resultName"
    ).textContent =
        playerName;


    document.getElementById(
        "score"
    ).textContent =
        score;


    document.getElementById(
        "percentage"
    ).textContent =
        `${percentage}%`;


    document.getElementById(
        "savingMessage"
    ).textContent =
        "Saving your result...";


    // SEND TO GOOGLE SHEETS

    await saveResult({

        name: playerName,

        score: score,

        total: total,

        percentage: percentage,

        timeTaken: timeTaken

    });

}


// ============================================================
// GOOGLE SHEETS
// ============================================================

async function saveResult(result) {

    try {

        const response =
            await fetch(
                GOOGLE_SCRIPT_URL,
                {
                    method: "POST",

                    body: JSON.stringify(result)
                }
            );


        const data =
            await response.json();


        if (data.success) {

            document.getElementById(
                "savingMessage"
            ).textContent =
                "Your result has been saved ✓";

        } else {

            document.getElementById(
                "savingMessage"
            ).textContent =
                "Result displayed. Please contact the organizer.";

        }

    } catch (error) {

        console.error(error);

        document.getElementById(
            "savingMessage"
        ).textContent =
            "Result displayed. Please contact the organizer.";

    }

}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value;

    return div.innerHTML;

}

