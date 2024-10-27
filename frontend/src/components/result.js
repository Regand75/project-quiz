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
                    const viewingElement = document.getElementById("viewing");
                    if (viewingElement) {
                        viewingElement.onclick = (event) => {
                            event.preventDefault();
                            this.progressResult();
                        };
                    }
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        }
        location.href = '#/';
    }
    progressResult() {
        location.href = '#/answers?id=' + this.routeParams.id;
    }
}