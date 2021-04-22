import { html, PolymerElement } from '/static/otree-redwood/node_modules/@polymer/polymer/polymer-element.js';

import './public_info/public_info.js';
import './info_precision/info_precision.js';
import './bond_price/bond_price.js';
import './polymer-elements/paper-button.js';

class RICda extends PolymerElement {
    static get properties() {
        return {
            step: {
                type: Number,
                value: 0, // set for dev, should default to 0
                observer: function (step, isResultPage) {
                    setTimeout(function () {
                        if (step && step < 3 && !isResultPage) {  // auto scroll down to next step/screen
                            window.scrollBy({ top: 480, behavior: 'smooth' });
                        }
                    }, 500);
                },
                notify: true,
                reflectToAttribute: true,
            },
            e: Number,
            g: Number,
            k: Number,
            m: Number,
            precision: Number,
            cost: Number,
            mLow: Number,
            mHigh: Number,
            lowValue: Number,
            highValue: Number,
            bidPrice: Number,
            askPrice: Number,
            buttonLabel: {
                type: String,
                value: 'Next',
            },
            displayFormat: {
                type: Object,
                value: function() {
                    return cash => `$${parseFloat((cash/100).toFixed(2))}`;
                },
            },
        }
    }

    static get template() {
        return html`
            <style>
                .btn {
                    position: relative;
                    margin: 30px 25% auto 90%;
                    width: 50px;
                }
                .bids {
                    border: 2px solid #2F3238;
                    flex: 1 0 0;
                    min-height: 0;
                }
                .asks {
                    border: 2px solid #007bff;
                    flex: 1 0 0;
                    min-height: 0;
                }
            </style>
            <div class="first">
                <public-info
                    g="[[ g ]]"
                    credits="[[ participation_fee ]]"
                ></public-info>
            </div>
            <div hidden$="{{ _hideStep(step, 1) }}">
                <info-precision
                    k="[[ k ]]"
                    precision="{{ precision }}"
                    cost="{{ cost }}"
                    disable-select="{{ _disableStep(step, 1) }}"
                ></info-precision>
            </div>
            <div class="step" hidden$="{{ _hideStep(step, 2) }}">
                <bond-price
                    g="[[ g ]]"
                    m="[[ m ]]"
                    q="[[ q ]]"
                    e = "[[ e ]]"
                    buy-option="[[ buyOption ]]"
                    sell-option="[[ sellOption ]]"
                    precision="[[ precision ]]"
                    default-prob="[[ g ]]"
                    m-low="{{ mLow }}"
                    m-high="{{ mHigh }}"
                    low-value="{{ lowValue }}"
                    high-value="{{ highValue }}"
                    buy-price="{{ bidPrice }}"
                    sell-price="{{ askPrice }}"
                    expected-value="{{ expectedVal }}"
                    disable-select="[[ _disableStep(step, 2) ]]"
                ></bond-price>
            </div>
            <paper-button class="btn" on-click="nextStep" hidden$="[[ _updateButtonLabel(step)]]">[[ buttonLabel ]]</paper-button>
       `;
    }

    nextStep() {
        this.step++;
        this.dispatchEvent(new CustomEvent('getPolymerData', {
            bubbles: true,
            composed: true,
            detail: {
                this: this,
                value: { // values to dispatch to oTree
                    'step': this.step,
                    'precision': this.precision,
                    'cost': this.cost,
                    'mLow': this.mLow,
                    'mHigh': this.mHigh,
                    'lowValue': this.lowValue,
                    'highValue': this.highValue,
                },
                eventName: 'getPolymerData'
            }
        }));
        return this.step;
    }

    _hideStep(step, num) {
        return step < num;
    }

    _disableStep(step, num) {
        return step != num;
        // return false; // allow changes to previous steps for debugging
    }

    _updateButtonLabel(step) {
        if (step === 2)
            this.buttonLabel = 'Continue';
        else if (step)
            this.buttonLabel = 'Submit';
        else
            this.buttonLabel = 'Next';
        // determines when bid/ask prices submitted to hide button
        return step > 2;
    }
}

window.customElements.define('ri-cda', RICda);
