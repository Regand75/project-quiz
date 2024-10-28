import {UrlManager} from "../utils/url-manager.js";
import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Answers {
    constructor() {
        this.answersBlockQuestions = null;
        this.userInfo = null;
        this.userEmail = null;
        this.infoAboutTest = null;
        this.routeParams = UrlManager.getQueryParams();
        this.init();
    }

    async init() {
        // Извлекаем значение из localStorage
        this.userInfo = Auth.getUserInfo();
        this.userEmail = Auth.getUserEmail();
        this.userEmail = this.userEmail.replace(/^"|"$/g, ''); // Убираем лишние кавычки
        if (!this.userInfo || !this.userEmail) {
            location.href = '#/';
        }
        if (this.routeParams.id) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + this.userInfo.userId);

                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    this.infoAboutTest = result.test;
                    this.processAnswers();
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        }
        location.href = '#/';
    }

    processAnswers() {
        // Название теста
        document.getElementById('answers-info-title-test').innerText = this.infoAboutTest?.name || "Название теста";

        // Информация о пользователе
        const { fullName } = this.userInfo;
        const email = this.userEmail;
        document.getElementById('answers-user').innerHTML = `Тест выполнил <span>${fullName}, ${email}</span>`;

        // Обработка кнопки "Обратно к результату теста"
        const answersBackResult = document.getElementById("back-result");
        answersBackResult.onclick = (event) => {
            event.preventDefault();
            this.progressAnswersBackResult();
        }

        this.showAnswers();
    }

    showAnswers() {
        // Очищаем блок с ответами перед добавлением новых данных
        this.answersBlockQuestions = document.getElementById('answers-questions');
        // this.answersBlockQuestions.innerHTML = '';

        // Проходим по каждому вопросу в данных
        this.infoAboutTest.questions.forEach((question, index) => {
            // Создаем элемент для заголовка вопроса
            const answersQuestionTitleElement = document.createElement('div');
            answersQuestionTitleElement.className = 'answers-question-title';
            answersQuestionTitleElement.innerHTML = `<span>Вопрос ${index + 1}: </span>${question.question}`;

            // Создаем контейнер для вариантов ответов на текущий вопрос
            const questionOptionsElement = document.createElement('div');
            questionOptionsElement.className = 'answers-question-options';

            // Проходим по каждому ответу для текущего вопроса
            question.answers.forEach((answer) => {
                const optionArrowElement = document.createElement('div');
                optionArrowElement.className = 'answers-option-indicator';

                const optionAnswerElement = document.createElement('div');
                optionAnswerElement.className = 'answers-option-answer';
                optionAnswerElement.innerText = answer.answer;

                // Проверка правильности ответа
                if (answer.correct) {
                    optionArrowElement.classList.add('right');
                    optionAnswerElement.classList.add('right');
                } else if (answer.correct === false) {
                    optionArrowElement.classList.add('not-right');
                    optionAnswerElement.classList.add('not-right');
                }

                // Объединяем стрелку и текст ответа в один элемент
                const questionOptionElement = document.createElement('div');
                questionOptionElement.className = 'answers-question-option';
                questionOptionElement.appendChild(optionArrowElement);
                questionOptionElement.appendChild(optionAnswerElement);

                // Добавляем вариант ответа в контейнер вариантов для текущего вопроса
                questionOptionsElement.appendChild(questionOptionElement);
            });

            // Объединяем заголовок вопроса и его варианты в один контейнер вопроса
            const questionElement = document.createElement('div');
            questionElement.className = 'answers-question';
            questionElement.appendChild(answersQuestionTitleElement);
            questionElement.appendChild(questionOptionsElement);

            // Добавляем контейнер вопроса в основной блок с ответами
            this.answersBlockQuestions.appendChild(questionElement);
        });
    }

    progressAnswersBackResult() {
        location.href = '#/result?id=' + this.routeParams.id;
    }
}

