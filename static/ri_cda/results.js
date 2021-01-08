import { html, PolymerElement } from '/static/otree-redwood/node_modules/@polymer/polymer/polymer-element.js';

import './public_info/public_info.js';
import './info_precision/info_precision.js';
import './bond_price/bond_price.js';
import './polymer-elements/paper-button.js';
import '/static/otree-redwood/src/redwood-channel/redwood-channel.js';
import '/static/otree-redwood/src/otree-constants/otree-constants.js';


// import '/static/otree_markets/order_list.js';
// import '/static/otree_markets/trade_list.js';
import '/static/otree_markets/simple_modal.js';
// import '/static/otree_markets/event_log.js';

import './order_enter_widget.js';

import './otree_markets_components/event_log.js';
import './otree_markets_components/order_list.js';
import './otree_markets_components/trade_list.js';

class Results extends PolymerElement {
    static get properties() {
        return {
            availableAssets: Number,
            availableCash: Number,
            settledCash: Number,
            settledAssets: Number,
            g: Number,
            k: Number,
            m: Number,
            y: Number,
            isdefault: {
                type: Boolean,
                computed: '_getisdefault(y,g)',
                nofity: true,
                reflectToAttribute: true,
            },
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
                computed: '_getpayoff(settledAssets, bondPayment, settledCash, cost)',
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
                    color: #ff0000;
                    background: none;
                }
                mark.green {
                    color: #00FF00;
                    background: none;
                }
            </style>
            <div id="allocation">
                <div>
                    <h4> Your bonds <mark class$ = [[_getDefaultcolor(isdefault)]]> [[_getDefault()]] </mark><br/>
                    Actual held bond payment: [[ bondPayment ]]<br/>
                    Your private info cost: [[ cost ]]</h4>
                </div>
                <div>
                <h4>Your Allocation</h4>
                <div>Net Cash: [[_formatCash(settledCash)]]<br/> Bonds held: [[settledAssets]]</div>
                <div> Payoff = Net Cash + Bond Payment * Number of Held Bonds - Information Cost </div>
                <div > [[payoff]] = [[_formatCash(settledCash)]] + [[bondPayment]] * [[settledAssets]] - [[cost]] </div>
                <paper-button class="btn" on-click="next">Continue</paper-button>
            </div>
        `;
    }

    _formatCash(cash) {
        return parseFloat((cash/100).toFixed(2));
    }
    _getisdefault(y,g) {
        return y < g;
    }

    _getBondPayment(m) {
        return this.isdefault ? m : 100; // 0 if match
    }
    _getDefaultcolor(isdefault) {
        if (isdefault)
          return 'red';
        else
          return 'green';
    }

    _getDefault() {
      if (this.isdefault)
        return 'defaulted.';
      else
        return 'did not default.'
    }

    _getpayoff(settledAssets, bondPayment, settledCash, cost) {
        return parseFloat(((settledAssets * bondPayment) + this._formatCash(settledCash) - cost).toFixed(2));
    }

    next() {
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
    }

}

window.customElements.define('results-page', Results);
