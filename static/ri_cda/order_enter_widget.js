import { html, PolymerElement } from '/static/otree-redwood/node_modules/@polymer/polymer/polymer-element.js';
import './shared/buysell_slider.js';
import './polymer-elements/paper-button.js';

/*
    this component contains displays of the player's cash and asset allocations, and has inputs
    which allow the player to enter orders. when an order is entered,
    this component emits an 'order-entered' event.
*/

class OrderEnterWidget extends PolymerElement {

    static get properties() {
        return {
            cash: Number,
            settledCash: Number,
            settledAssets: Number,
            availableAssets: Number,
            settledAssets: Number,
            buyPrice: {
                type: Number,
                value: 0,
            },
            sellPrice: {
                type: Number,
                value: 100,
            },
            hidden: {
                type: Boolean,
                value: true,
            },
            displayFormat: {
                type: Object,
                value: function () {
                    return cash => `${parseFloat((cash / 100).toFixed(1))}`;
                },
            },
            disableBid: {
                type: Boolean,
                computed: "_disableBid(settledAssets)",
            },
            disableAsk: {
                type: Boolean,
                computed: "_disableAsk(settledAssets)",
            },
            box: {
              type: Boolean,
              value: false,
            },
            limitText: String,
        };
    }

    static get template() {
        return html`
            <style>
                #container {
                    height: 100%;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                }
                #container > div {
                    margin: 5px;
                    padding: 5px;
                    border: 1px solid black;
                }
                #container h4 {
                    margin: 0.2em;
                }
                #order-input {
                    text-align: center;
                    width: 100%;
                }
                #allocation > div:first-child {
                    text-align: center;
                    color: orange;
                }
                #bonds {
                    text-align: left;
                    color: orange;
                    font-weight: bold;
                }
                .btn {
                    height: 35px;
                    margin: 10px;
                }
                .bid-btn {
                    background-color: #2F3238;
                }
                .ask-btn {
                    background-color: #007bff;
                }
                .buy-sell-text {
                text-align: center;
                }
                .val {
                font-weight: bold;
                }
                .low {
                    color: #7A70CC;
                }
                .high {
                    color: #CCCC00;
                }
                .buy {
                    color: #2F3238;
                }
                .sell {
                    color: #007bff;
                }
                img {
                    height: 2em;
                }
                .limit-text {
                    color: red;
                }
            </style>
            <div id="bonds">Net Cash: [[displayFormat(settledCash) ]]<br/>Bonds held: [[ settledAssets ]]</div>
                <div id="order-input">

                    <buysell-slider
                        hidden = "[[hidden]]"
                        low-value="[[ lowValue ]]"
                        high-value="[[ highValue ]]"
                        buy-option="[[ buyOption ]]"
                        sell-option="[[ sellOption ]]"
                        buy-price="{{ buyPrice }}"
                        sell-price="{{ sellPrice }}"
                        box = "[[ box ]]"
                    ></buysell-slider>
                    <h4 class="limit-text">[[ limitText ]]</h4>
                    <div>
                        <paper-button class="bid-btn btn" on-click="_enter_bid" disabled="[[ disableBid ]]">Enter bid</paper-button>
                        <paper-button class="ask-btn btn" on-click="_enter_ask" disabled="[[ disableAsk ]]">Enter ask</paper-button>
                    </div>

                    <p>Lowest expected bond value: <span class="non-def">[[ _getNondefault(defaultProb) ]]%</span> * 100 + <span class="def">[[ defaultProb ]]%</span>
                    * [[ mLow ]] = <span class="low val">[[ lowValue ]]</span></p>
                    <p>Highest expected bond value: <span class="non-def">[[ _getNondefault(defaultProb) ]]%</span> * 100 + <span class="def">[[ defaultProb ]]%</span>
                    * [[ mHigh ]] = <span class="high val">[[ highValue ]]</span></p>

                    <h4>Submit an Order</h4>

                    <p class="buy-sell-text">
                        Select the price for which you'd like to <span class="buy val">buy</span> the bond by sliding
                    <img src="../../../../../static/ri_call_market/shared/buy_marker.png" alt="buy marker failed to load :(">
                    <span class="buy val">(bid)</span> or entering a number in the box labled Enter Bid, and the price for which you'd like to <span class="sell val">sell</span>
                    the bond by sliding
                    <img src="../../../../../static/ri_call_market/shared/sell_marker.png" alt="buy marker failed to load :(">
                    <span class="sell val">(ask)</span> or entering a number in the box labled Enter Ask.</p>

                    <p class="buy-sell-text">Click <span class="buy val">Enter bid</span> and <span class="sell val">Enter ask</span>
                    to submit the corresponding value.</p>

                </div>
            </div>
        `;
    }


    _enter_bid() {
        this.last_order_entry = this.last_order_entry || 0;

        const now = performance.now();
        // throttle rate in ms
        // this value is the minimum amount of time between order entries
        const throttle_rate = 1000;
        const updateOrder = () => {
            this.disableSubmit('bid');
            const price = this.buyPrice; // must be whole numbers, breaks with decimals
            const order = {
                price: parseInt(price * 100),
                volume: 1,
                is_bid: true,
            }
            this.limitText = "";
            this.dispatchEvent(new CustomEvent('order-entered', { detail: order }));
            this.last_order_entry = now;
        }
        clearTimeout(this.order_enter_timeout);
        this.order_enter_timeout = setTimeout(updateOrder, this.last_order_entry + throttle_rate - now);
    }

    _enter_ask() {
        this.last_order_entry = this.last_order_entry || 0;

        const now = performance.now();
        // throttle rate in ms
        // this value is the minimum amount of time between order entries
        const throttle_rate = 1000;
        const updateOrder = () => {
            this.disableSubmit('ask');
            const price = this.sellPrice;
            const order = {
                price: parseInt(price * 100),
                volume: 1,
                is_bid: false,
            }
            this.limitText = "";
            this.dispatchEvent(new CustomEvent('order-entered', { detail: order }));
            this.last_order_entry = now;
        }
        clearTimeout(this.order_enter_timeout);
        this.order_enter_timeout = setTimeout(updateOrder, this.last_order_entry + throttle_rate - now);
    }

    _hideOption(buyOption, sellOption) {
        // buy = 0, sell = 1
        if (buyOption && sellOption)
            return false;
        else
            return true;
    }

    _disableBid(settledAssets) {
        // prevents holding more than 2 bonds
        if (settledAssets === 2) {
            this.limitText = "Cannot submit bid: holding 2 bonds";
            return true;
        }

        // if (buyPrice * 100 > currentAsk) {
        //     console.error(`Bid price (${buyPrice}) must be less than existing ask of ${currentAsk/100}`);
        // }
        this.limitText = "";
        return false;
    }

    _disableAsk(settledAssets) {
        // prevents short selling
        if (settledAssets === 0) {
            this.limitText = "Cannot submit ask: holding 0 bonds";
            return true;
        }

        // if (sellPrice * 100 < currentBid) {
        //     console.error(`Ask price (${sellPrice}) must be greater than existing bid of ${currentBid/100}`);
        //     return true;
        // }
        this.limitText = "";
        return false;
    }

    setLimitText(text) {
        this.limitText = text;
    }

    disableSubmit(type) {
        if (type === 'bid')
            this.disableBid = !this.disableBid;
        else if (type === 'ask')
            this.disableAsk = !this.disableAsk;
    }

    _getNondefault(def) {
        return 100 - def;
    }
}

window.customElements.define('order-enter-widget', OrderEnterWidget);
