import {UrlManager} from "../utils/url-manager.js";

export class Result {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();

        document.getElementById('result-score').innerText = this.routeParams.score + '/' + this.routeParams.total;
        const viewingElement = document.getElementById("viewing");
        if (viewingElement) {
            viewingElement.onclick = (event) => {
                event.preventDefault();
                this.progressResult();
            };
        } else {
            console.error('Элемент с ID "viewing" не найден на странице.');
        }
    }

    progressResult() {
        location.href = `#/answers?name=${this.routeParams.name}&lastName=${this.routeParams.lastName}&email=${this.routeParams.email}&id=${this.routeParams.id}&idResult=${this.routeParams.idResult}&score=${this.routeParams.score}&total=${this.routeParams.total}`;
    }
}
