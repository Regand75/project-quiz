import { UrlManager } from "../utils/url-manager.js";

export class Answers {
    constructor() {
        this.answersBlockQuestions = null;
        this.quiz = null;
        this.quizRight = [];
        this.routeParams = UrlManager.getQueryParams();

        if (this.routeParams.id) {
            this.fetchQuizData();
        } else {
            this.redirectToHome();
        }
    }

    fetchQuizData() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://testologia.ru/get-quiz?id=${this.routeParams.id}`, false);
        xhr.send();
        if (xhr.status === 200 && xhr.responseText) {
            try {
                this.quiz = JSON.parse(xhr.responseText);
                this.processAnswers();
            } catch (e) {
                this.redirectToHome();
            }
        } else {
            this.redirectToHome();
        }
    }

    processAnswers() {
        // Название теста
        document.getElementById('answers-info-title-test').innerText = this.quiz?.name || "Название теста";

        // Информация о пользователе
        const { name, lastName, email } = this.routeParams;
        document.getElementById('answers-user').innerHTML = `Тест выполнил <span>${name} ${lastName}, ${email}</span>`;

        // Обработка кнопки "Обратно к результату теста"
        const answersBackResult = document.getElementById("back-result");
        answersBackResult.onclick = (event) => {
            event.preventDefault();
            this.progressAnswersBackResult();
        }

        // Показ вопросов и ответов
        this.showAnswers();
    }

    progressAnswersBackResult() {
        location.href = `#/result?name=${this.routeParams.name}&lastName=${this.routeParams.lastName}&email=${this.routeParams.email}&id=${this.routeParams.id}&idResult=${this.routeParams.idResult}&score=${this.routeParams.score}&total=${this.routeParams.total}`;
    }

    showAnswers() {
        // Получаем правильные ответы
        this.getRightAnswers();
        const idAnswers = (this.routeParams.idResult || "").split(',').map(Number);

        this.answersBlockQuestions = document.getElementById('answers-questions');

        this.quiz.questions.forEach((question, index) => {
            // Заголовок вопроса
            const answersQuestionTitleElement = document.createElement('div');
            answersQuestionTitleElement.className = 'answers-question-title';
            answersQuestionTitleElement.innerHTML = `<span>Вопрос ${index + 1}: </span>${question.question}`;

            // Варианты ответов
            const questionOptionsElement = document.createElement('div');
            questionOptionsElement.className = 'answers-question-options';

            question.answers.forEach((answer) => {
                const optionArrowElement = document.createElement('div');
                optionArrowElement.className = 'answers-option-indicator';
                const optionAnswerElement = document.createElement('div');
                optionAnswerElement.className = 'answers-option-answer';
                optionAnswerElement.innerText = answer.answer;

                // Проверка правильности ответа
                if (answer.id === idAnswers[index]) {
                    if (idAnswers[index] === this.quizRight[index]) {
                        optionArrowElement.classList.add('right');
                        optionAnswerElement.classList.add('right');
                    } else {
                        optionArrowElement.classList.add('not-right');
                        optionAnswerElement.classList.add('not-right');
                    }
                }

                const questionOptionElement = document.createElement('div');
                questionOptionElement.className = 'answers-question-option';
                questionOptionElement.appendChild(optionArrowElement);
                questionOptionElement.appendChild(optionAnswerElement);

                questionOptionsElement.appendChild(questionOptionElement);
            });

            const questionElement = document.createElement('div');
            questionElement.className = 'answers-question';
            questionElement.appendChild(answersQuestionTitleElement);
            questionElement.appendChild(questionOptionsElement);

            this.answersBlockQuestions.appendChild(questionElement);
        });
    }

    getRightAnswers() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://testologia.ru/get-quiz-right?id=${this.routeParams.id}`, false);
        xhr.send();
        if (xhr.status === 200 && xhr.responseText) {
            try {
                this.quizRight = JSON.parse(xhr.responseText);
            } catch (e) {
                this.redirectToHome();
            }
        } else {
            this.redirectToHome();
        }
    }
    redirectToHome() {
        location.href = '#/';
    }
}

