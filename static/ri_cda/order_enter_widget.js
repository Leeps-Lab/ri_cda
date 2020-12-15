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
            settledAssets: Number,
            availableAssets: Number,
            buyPrice: {
                type: Number,
                value: 0,
            },
            sellPrice: {
                type: Number,
                value: 100,
            },
            displayFormat: {
                type: Object,
                value: function() {
                    return cash => `$${parseFloat((cash/100).toFixed(1))}`;
                },
            },
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
                    width: 75%;
                }
                #allocation > div:first-child {
                    text-align: center;
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
                text-align: left;
                }
                .val {
                    font-weight: bold;
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
            </style>

            <div id="container">
                <div id="allocation">
                    <div>
                        <h4>Your Allocation</h4>
                    </div>
                    <div>Net Cash: [[ displayFormat(availableCash) ]]</div>
                    <div>Bonds held: [[ availableAssets ]]</div>
                </div>
                <div id="order-input">
                    <h4>Submit an Order</h4>

                    
        <h4 hidden$="[[ sellOption ]]">Select the price for which you'd like to <span class="buy val">buy</span> the bond by sliding
        <img src="../../../../../static/ri_call_market/shared/buy_marker.png" alt="buy marker failed to load :(">
        <span class="buy val">(bid)</span>.</h4>

        <h4 hidden$="[[ buyOption ]]">Select the price for which you'd like to <span class="sell val">sell</span> the bond by sliding
        <img src="../../../../../static/ri_call_market/shared/sell_marker.png" alt="buy marker failed to load :(">
        <span class="sell val">(ask)</span>.</h4>

        <p class="buy-sell-text" hidden$="[[ _hideOption(buyOption, sellOption) ]]">
            Select the price for which you'd like to <span class="buy val">buy</span> the bond by sliding
        <img src="../../../../../static/ri_call_market/shared/buy_marker.png" alt="buy marker failed to load :(">
        <span class="buy val">(bid)</span>, and the price for which you'd like to <span class="sell val">sell</span>
        the bond by sliding
        <img src="../../../../../static/ri_call_market/shared/sell_marker.png" alt="buy marker failed to load :(">
        <span class="sell val">(ask)</span>.</p>
        <p class="buy-sell-text">Click <span class="buy val">Enter bid</span> and <span class="sell val">Enter ask</span>
        to submit the corresponding value.</p>

                    <buysell-slider
                        low-value="[[ lowValue ]]"
                        high-value="[[ highValue ]]"
                        buy-option="[[ buyOption ]]"
                        sell-option="[[ sellOption ]]"
                        buy-price="{{ buyPrice }}"
                        sell-price="{{ sellPrice }}"
                    ></buysell-slider>

                    <div>
                        <paper-button class="bid-btn btn" on-click="_enter_bid">Enter bid</paper-button>
                        <paper-button class="ask-btn btn" on-click="_enter_ask">Enter ask</paper-button>
                    </div>
                </div>
            </div>
        `;
    }


    _enter_bid() {
        const price = this.buyPrice; // must be whole numbers, breaks with decimals
        const order = {
            price: parseInt(price * 100),
            volume: 1,
            is_bid: true,
        }
        this.dispatchEvent(new CustomEvent('order-entered', { detail: order }));
    }

    _enter_ask() {
        const price = this.sellPrice;
        const order = {
            price: parseInt(price * 100),
            volume: 1,
            is_bid: false,
        }
        this.dispatchEvent(new CustomEvent('order-entered', { detail: order }));
    }

    _hideOption(buyOption, sellOption) {
        // buy = 0, sell = 1
        if (buyOption && sellOption)
            return false;
        else
            return true;
    }

}

window.customElements.define('order-enter-widget', OrderEnterWidget);
