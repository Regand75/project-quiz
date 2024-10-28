import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Result {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.init();
    }

    async init() {
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        }
        if (this.routeParams.id) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result?userId=' + userInfo.userId);
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    document.getElementById('result-score').innerText = result.score + '/' + result.total;
                    this.activeViewingElement();
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        }
        location.href = '#/';
    }

    activeViewingElement() {
        const viewingElement = document.getElementById("viewing");
        const arrowImageElement = document.getElementById("arrow-image");
        if (viewingElement) {
            if (Number(this.routeParams.id) !== 1) {
                viewingElement.classList.add('disabled-link');
                arrowImageElement.src = '/images/small-arrow-answer.png';
            } else {
                viewingElement.classList.remove('disabled-link');
                arrowImageElement.src = '/images/small-arrow.png';
            }
            viewingElement.onclick = () => {
                this.progressResult();
            };
        }
    }

    progressResult() {
        location.href = '#/answers?id=' + this.routeParams.id;
    }
}