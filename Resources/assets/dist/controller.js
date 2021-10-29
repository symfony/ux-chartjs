import { Controller } from '@hotwired/stimulus';
import { Chart } from 'chart.js';

class controller extends Controller {
    connect() {
        if (!(this.element instanceof HTMLCanvasElement)) {
            throw new Error('Invalid element');
        }
        const viewData = this.element.getAttribute('data-view');
        if (!viewData) {
            throw new Error('Missing data-view attribute.');
        }
        const payload = JSON.parse(viewData);
        if (Array.isArray(payload.options) && 0 === payload.options.length) {
            payload.options = {};
        }
        this._dispatchEvent('chartjs:pre-connect', { options: payload.options });
        const canvasContext = this.element.getContext('2d');
        if (!canvasContext) {
            throw new Error('Could not getContext() from Element');
        }
        const chart = new Chart(canvasContext, payload);
        this._dispatchEvent('chartjs:connect', { chart });
    }
    _dispatchEvent(name, payload = null, canBubble = false, cancelable = false) {
        const userEvent = document.createEvent('CustomEvent');
        userEvent.initCustomEvent(name, canBubble, cancelable, payload);
        this.element.dispatchEvent(userEvent);
    }
}

export { controller as default };
