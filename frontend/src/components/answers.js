import { UrlManager } from "../utils/url-manager.js";
import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Answers {
    constructor() {
        this.answersBlockQuestions = null;
        // this.quiz = null;
        this.infoAboutTest = null;
        // this.quizRight = null;
        this.routeParams = UrlManager.getQueryParams();
        this.init();
        // if (this.routeParams.id) {
        //     this.fetchQuizData();
        // } else {
        //     this.redirectToHome();
        // }
    }

    async init() {
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        }
        if (this.routeParams.id) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + userInfo.userId);
                // const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result?userId=' + userInfo.userId);
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    this.infoAboutTest = result.test;
                    console.log(this.infoAboutTest);
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
        // this.getRightAnswers();
        console.log(this.infoAboutTest.name);
        // Название теста
        document.getElementById('answers-info-title-test').innerText = this.infoAboutTest?.name || "Название теста";

        // Информация о пользователе
        // const { name, lastName, email } = this.routeParams;
        // document.getElementById('answers-user').innerHTML = `Тест выполнил <span>${name} ${lastName}, ${email}</span>`;

        // Обработка кнопки "Обратно к результату теста"
        // const answersBackResult = document.getElementById("back-result");
        // answersBackResult.onclick = (event) => {
        //     event.preventDefault();
        //     this.progressAnswersBackResult();
        // }

        // Показ вопросов и ответов
        // this.getRightAnswers();
        this.showAnswers();
    }

    progressAnswersBackResult() {
        // location.href = `#/result?name=${this.routeParams.name}&lastName=${this.routeParams.lastName}&email=${this.routeParams.email}&id=${this.routeParams.id}&idResult=${this.routeParams.idResult}&score=${this.routeParams.score}&total=${this.routeParams.total}`;
    }

    showAnswers() {
        // Очищаем блок с ответами перед добавлением новых данных
        this.answersBlockQuestions = document.getElementById('answers-questions');
        // console.log(this.answersBlockQuestions);
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


    // showAnswers() {
        // Получаем правильные ответы
        // this.getRightAnswers();
        // const idAnswers = (this.routeParams.idResult || "").split(',').map(Number);

        // this.answersBlockQuestions = document.getElementById('answers-questions');
        //
        // this.quizRight.questions.forEach((question, index) => {
        //     // Заголовок вопроса
        //     const answersQuestionTitleElement = document.createElement('div');
        //     answersQuestionTitleElement.className = 'answers-question-title';
        //     answersQuestionTitleElement.innerHTML = `<span>Вопрос ${index + 1}: </span>${question.question}`;
        //
        //     // Варианты ответов
        //     const questionOptionsElement = document.createElement('div');
        //     questionOptionsElement.className = 'answers-question-options';
        //
        //     question.answers.forEach((answer) => {
        //         const optionArrowElement = document.createElement('div');
        //         optionArrowElement.className = 'answers-option-indicator';
        //         const optionAnswerElement = document.createElement('div');
        //         optionAnswerElement.className = 'answers-option-answer';
        //         optionAnswerElement.innerText = answer.answer;

                // Проверка правильности ответа
                // if (answer.id === idAnswers[index]) {
                //     if (idAnswers[index] === this.quizRight[index]) {
                //         optionArrowElement.classList.add('right');
                //         optionAnswerElement.classList.add('right');
                //     } else {
                //         optionArrowElement.classList.add('not-right');
                //         optionAnswerElement.classList.add('not-right');
                //     }
                // }

    //             const questionOptionElement = document.createElement('div');
    //             questionOptionElement.className = 'answers-question-option';
    //             questionOptionElement.appendChild(optionArrowElement);
    //             questionOptionElement.appendChild(optionAnswerElement);
    //
    //             questionOptionsElement.appendChild(questionOptionElement);
    //         });
    //
    //         const questionElement = document.createElement('div');
    //         questionElement.className = 'answers-question';
    //         questionElement.appendChild(answersQuestionTitleElement);
    //         questionElement.appendChild(questionOptionsElement);
    //
    //         this.answersBlockQuestions.appendChild(questionElement);
    //     });
    // }

    // async getRightAnswers() {
    //     // const userInfo = Auth.getUserInfo();
    //     // if (!userInfo) {
    //     //     location.href = '#/';
    //     // }
    //     if (this.routeParams.id) {
    //         try {
    //             const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + userInfo.userId);
    //             if (result) {
    //                 if (result.error) {
    //                     throw new Error(result.error);
    //                 }
    //                 this.quiz = result;
    //                 console.log(this.quiz);
    //                 // this.processAnswers();
    //             }
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    //     location.href = '#/';
    // }

    redirectToHome() {
        // location.href = '#/';
    }
}

