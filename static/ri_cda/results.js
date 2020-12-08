import { html, PolymerElement } from '/static/otree-redwood/node_modules/@polymer/polymer/polymer-element.js';
import '/static/otree-redwood/src/redwood-channel/redwood-channel.js';
import '/static/otree-redwood/src/otree-constants/otree-constants.js';

import '/static/otree_markets/trader_state.js'
// import '/static/otree_markets/order_list.js';
// import '/static/otree_markets/trade_list.js';
import '/static/otree_markets/simple_modal.js';
// import '/static/otree_markets/event_log.js';

import './order_enter_widget.js';

import './public_info/public_info.js';
import './info_precision/info_precision.js';
import './bond_price/bond_price.js';

import './otree_markets_components/event_log.js';
import './otree_markets_components/order_list.js';
import './otree_markets_components/trade_list.js';

/*
    this component is a single-asset market, implemented using otree_markets' trader_state component and some of
    otree_markets' reusable UI widgets.
*/

class Results extends PolymerElement {

    static get properties() {
        return {
            bids: Array,
            asks: Array,
            trades: Array,
            // settledAssets: Number,
            availableAssets: Number,
            // settledCash: Number,
            availableCash: Number,
            g: Number,
            k: Number,
            m: Number,
            timeRemaining: Number,
        };
    }

    static get template() {
        return html`
            <style>
                .container {
                    display: flex;
                    justify-content: space-evenly;
                }
                .container > div {
                    display: flex;
                    flex-direction: column;
                }
                .flex-fill {
                    flex: 1 0 0;
                    min-height: 0;
                }
                #main-container {
                    height: 40vh;
                    margin-bottom: 10px;
                }
                #main-container > div {
                    flex: 0 1 20%;
                }

                #log-container {
                    height: 20vh;
                }
                #log-container > div {
                    flex: 0 1 90%;
                }
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
            <otree-constants
                id="constants"
            ></otree-constants>
            <trader-state
                id="trader_state"
                bids="{{bids}}"
                asks="{{asks}}"
                trades="{{trades}}"
                settled-assets="{{settledAssets}}"
                available-assets="{{availableAssets}}"
                settled-cash="{{settledCash}}"
                available-cash="{{availableCash}}"
                on-confirm-trade="_confirm_trade"
                on-confirm-cancel="_confirm_cancel"
                on-error="_handle_error"
            ></trader-state>
            <div id="allocation">
                <div>
                    <h4>Your Allocation</h4>
                </div>
                <div>Net Cash: $[[availableCash]]</div>
                <div>Bonds held: $[[availableAssets]]</div>
            </div>
        `;
    }

    ready() {
        super.ready();
        this.pcode = this.$.constants.participantCode;
        console.log(this.availableCash, this.availableAssets);
    }
}

window.customElements.define('results-page', Results);
