import { html, PolymerElement } from '/static/otree-redwood/node_modules/@polymer/polymer/polymer-element.js';
import '/static/otree-redwood/src/redwood-channel/redwood-channel.js';
import '/static/otree-redwood/src/otree-constants/otree-constants.js';

import '/static/otree_markets/trader_state.js'
// import '/static/otree_markets/order_list.js';
// import '/static/otree_markets/trade_list.js';
import '/static/otree_markets/simple_modal.js';
// import '/static/otree_markets/event_log.js';

import './order_enter_widget.js';

import './otree_markets_components/event_log.js';
import './otree_markets_components/order_list.js';
import './otree_markets_components/trade_list.js';
class SingleAssetTextInterface extends PolymerElement {

    static get properties() {
        return {
            bids: Array,
            asks: Array,
            trades: Array,
            // settledAssets: Number,
            availableAssets: Number,
            // settledCash: Number,
            availableCash: Number,
            timeRemaining: Number,
            displayFormat: {
                type: Object,
                value: function() {
                    return cash => `$${parseFloat((cash/100).toFixed(2))}`;
                },
            },
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
                .top-corner {
                    position: fixed;
                    top: 0;
                    right: 5%;
                }
                order-list, trade-list, event-log {
                    border: 1px solid black;
                }
            </style>
                <simple-modal
                    id="modal"
                ></simple-modal>
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
                    time-remaining="{{timeRemaining}}"
                    on-confirm-trade="_confirm_trade"
                    on-confirm-cancel="_confirm_cancel"
                    on-error="_handle_error"
                ></trader-state>

            <div class="container" id="main-container">
                <div>
                    <h3>Bids</h3>
                    <order-list
                        class="bids"
                        type="bid"
                        orders="[[bids]]"
                        on-order-canceled="_order_canceled"
                        on-order-accepted="_order_accepted"
                    ></order-list>
                </div>
                <div>
                    <h3>Trades</h3>
                    <trade-list
                        class="flex-fill"
                        id="trades"
                        trades="[[trades]]"
                        pcode="[[pcode]]"
                    ></trade-list>
                </div>
                <div>
                    <h3>Asks</h3>
                    <order-list
                        class="asks"
                        type="ask"
                        orders="[[asks]]"
                        on-order-canceled="_order_canceled"
                        on-order-accepted="_order_accepted"
                    ></order-list>
                </div>
                <div>
                    <h3>Cash Flow</h3>
                    <event-log
                        class="flex-fill"
                        id="log"
                        max-entries=100
                    ></event-log>
                </div>
            </div>
            <div>
                <order-enter-widget
                    class="flex-fill"
                    settled-assets="{{settledAssets}}"
                    available-assets="{{availableAssets}}"
                    settled-cash="{{settledCash}}"
                    available-cash="{{availableCash}}"
                    buy-price="[[ bidPrice ]]"
                    sell-price="[[ askPrice ]]"
                    low-value="[[ lowValue ]]"
                    high-value="[[ highValue ]]"
                    buy-option="[[ buyOption ]]"
                    sell-option="[[ sellOption ]]"
                    on-order-entered="_order_entered"
                ></order-enter-widget>
            </div>
       `;
    }

    ready() {
        super.ready();
        this.pcode = this.$.constants.participantCode;
        // (re)assign colors for trade list (on page refresh)
        for (let i = 0; i < this.trades.length; i++) {
            let trade = this.trades[i];
            let type = 'other';
            if (trade.taking_order.pcode === this.pcode)
                type = trade.taking_order.is_bid ? 'bid' : 'ask';
            else if (trade.making_orders[0].pcode === this.pcode)
                type = trade.making_orders[0].is_bid ? 'bid' : 'ask';
            this.$.trades.setColor(i, type);
        }
    }

    // triggered when this player enters an order
    _order_entered(event) {
        const order = event.detail;
        if (isNaN(order.price) || isNaN(order.volume)) {
            this.$.log.error('Invalid order entered');
            return;
        }
        // replace previous order if higher bid or lower ask, ignores otherwise
        if (order.is_bid) {
            const bids = this.bids.filter(b => b.pcode === this.pcode);
            if (bids.length > 0)
                this.$.trader_state.cancel_order(bids[0]);
            this.$.trader_state.enter_order(order.price, order.volume, order.is_bid);
        } else {
            const asks = this.asks.filter(a => a.pcode === this.pcode);
            if (asks.length > 0)
                this.$.trader_state.cancel_order(asks[0]);
            this.$.trader_state.enter_order(order.price, order.volume, order.is_bid);
        }
    }

    // triggered when this player cancels an order
    _order_canceled(event) {
        const order = event.detail;

        this.$.modal.modal_text = 'Are you sure you want to remove this order?';
        this.$.modal.on_close_callback = (accepted) => {
            if (!accepted)
                return;

            this.$.trader_state.cancel_order(order);
        };
        this.$.modal.show();
    }

    // triggered when this player accepts someone else's order
    _order_accepted(event) {
        const order = event.detail;
        if (order.pcode == this.pcode)
            return;

        this.$.modal.modal_text = `Do you want to ${order.is_bid ? 'buy' : 'sell'} for $${parseFloat((order.price/100).toFixed(2))}?`
        this.$.modal.on_close_callback = (accepted) => {
            if (!accepted)
                return;

            this.$.trader_state.accept_order(order);
        };
        this.$.modal.show();
    }

    // react to the backend confirming that a trade occurred
    _confirm_trade(event) {
        const trade = event.detail;
        trade.taking_order.price = trade.making_orders[0].price; // show trade price for both
        const all_orders = trade.making_orders.concat([trade.taking_order]);
        for (let order of all_orders) {
        if (order.pcode == this.pcode) {
            const type = order.is_bid ? 'bid' : 'ask';
            // this.$.log.info(`You ${order.is_bid ? 'bought' : 'sold'} for $${order.price}`, type);
            this.$.log.info(`${order.is_bid ? '-' : '+'} $${parseFloat((order.price/100).toFixed(2))}`, type);
            }
            // this.$.log.info(`You ${order.is_bid ? 'bought' : 'sold'} ${order.traded_volume} ${order.traded_volume == 1 ? 'unit' : 'units'}`);
        }
        // assign color code for trade list
        let type = 'other';
        if (this.trades[0].taking_order.pcode === this.pcode)
            type = this.trades[0].taking_order.is_bid ? 'bid' : 'ask';
        else if (this.trades[0].making_orders[0].pcode === this.pcode)
            type = this.trades[0].making_orders[0].is_bid ? 'bid' : 'ask';
        this.$.trades.setColor(0, type);
    }

    // react to the backend confirming that an order was canceled
    _confirm_cancel(event) {
        const order = event.detail;
        if (order.pcode == this.pcode) {
            this.$.log.info(`You canceled your ${msg.is_bid ? 'bid' : 'ask'}`);
        }
    }

    // handle an error sent from the backend
    _handle_error(event) {
        let message = event.detail;
        this.$.log.error(message)
    }

    _timeFormat(time) {
        if (time === 0)
            this.isResultPage = true;
        const minutes = parseInt(time / 60);
        const seconds = parseInt(time % 60);
        return seconds >= 10 ? minutes + ":" + seconds : minutes + ":0" + seconds;
    }

}

window.customElements.define('single-asset-text-interface', SingleAssetTextInterface);
