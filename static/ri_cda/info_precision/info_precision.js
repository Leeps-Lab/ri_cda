import { html, PolymerElement } from '/static/otree-redwood/node_modules/@polymer/polymer/polymer-element.js';
import './precision_selector.js';

class InfoPrecision extends PolymerElement {
   
    static get properties() {
        return {
            precision: {
                type: Number,
                notify: true,
                reflectToAttribute: true,
            },
            cost: {
                type: Number,
                value: 0,
                notify: true,
                reflectToAttribute: true,
            },
            disableSelect: {
                type: Boolean,
                value: false,
            }
        }
    }

    static get template() {
        return html`
         <div>
            <!-- <h3>Select the precision of your private information about m (slide and submit).</h3> -->
            <precision-selector
                k="[[ k ]]"
                precision="{{ precision }}"
                cost="{{ cost }}"
                disable-select="[[ disableSelect ]]"
            ></precision-selector>
         </div>
        `;
    }

}

window.customElements.define('info-precision', InfoPrecision);