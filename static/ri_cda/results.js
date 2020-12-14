import { html, PolymerElement } from '/static/otree-redwood/node_modules/@polymer/polymer/polymer-element.js';

import './public_info/public_info.js';
import './info_precision/info_precision.js';
import './bond_price/bond_price.js';

class Results extends PolymerElement {
    static get properties() {
        return {
            availableAssets: Number,
            availableCash: Number,
            g: Number,
            k: Number,
            m: Number,
            default: Boolean,
            cost: Number,
            bondPayment: {
                type: Number,
                computed: '_getBondPayment(m)',
                notify: true,
                reflectToAttribute: true,
            },
            payoff: {
                type: Number,
                computed: '_getpayoff(availableAssets, bondPayment, availableCash)',
                notify: true,
                reflectToAttribute: true,
            },
            buttonLabel: {
                type: String,
                value: 'Continue',
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
                mark.red {
                    color:#ff0000;
                    background: none;
                }
            </style>
            <div id="allocation">
                <div>
                    <h4> Your bonds <mark class = "red"> [[_getDefault()]] </mark> <br/>
                    Actual held bond payment: [[ bondPayment ]]<br/>
                    Your private info cost: [[ cost ]]</h4>
                </div>
                <div>
                <h4>Your Allocation</h4>
                <div>Net Cash: $[[_formatCash(availableCash)]]<br/> Bonds held: [[availableAssets]]</div>
                <div> Payoff: Net Cash + Bond Payment * Number of Held Bonds - Information Cost <\div>
                <div> $[[_formatCash(availableCash)]] + [[availableAssets]] * [[bondPayment]] = $[[payoff]]</div>
            </div>
        `;
    }

    ready() {
        super.ready();
        console.log(this.availableCash, this.availableAssets, this.cost);
    }

    _formatCash(cash) {
        return parseFloat((cash/100).toFixed(2));
    } 

    _getBondPayment(m) {
        return this.default ? m : 100; // 0 if match
    }

    _getDefault() {
      if (this.default)
        return 'defaulted.';
      else
        return 'did not default.'
    }

    _getpayoff(availableAssets, bondPayment, availableCash) {
        let val = (availableAssets * bondPayment) + this._formatCash(availableCash);
        this.dispatchEvent(new CustomEvent('getPolymerData', {
          bubbles: true,
          composed: true,
          detail: {
              this: this,
              value: { // values to dispatch to oTree
                  'payoff': this.payoff,
              },
              eventName: 'getPolymerData'
            }
        }));
        return val;
    }


}

window.customElements.define('results-page', Results);
