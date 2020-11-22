import { html, PolymerElement } from '/static/otree-redwood/node_modules/@polymer/polymer/polymer-element.js';

class PriceMarker extends PolymerElement {
    static get properties() {
        return {
            value: Number,
        }
    }

    static get template() {
        return html`
            <style>
                :host {
                    @apply --layout;
                    @apply --layout-justified;
                    @apply --layout-center;
                    
                    position: absolute;
                    width: 20px;
                    height: auto;
                    display: flex;
                    flex-direction: column;
                    text-align: center;
                }
                span {
                    margin-top: -10px;
                    color: var(--mark-color);
                }
                .val {
                    background-color: var(--mark-color);
                    color: white;
                    padding: 5px;
                    border-radius: 15%;
                }
                .arr {
                    font-size: 30px;
                }
            </style>
            <span hidden$="[[ hidden ]]">
                <span class="val">[[ value ]]</span>
                <span class="arr">&#8595;</span>
            </span>
        `;
    }
}

window.customElements.define('price-marker', PriceMarker);