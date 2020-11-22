import { html, PolymerElement } from '/static/otree-redwood/node_modules/@polymer/polymer/polymer-element.js';
import './shared/buysell_slider.js';

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
                notify: true,
                value: 0,
                reflectToAttribute: true,
            },
            sellPrice: {
                type: Number,
                notify: true,
                value: 100,
                reflectToAttribute: true,
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
                }
                #allocation > div:first-child {
                    text-align: center;
                }
            </style>

            <div id="container">
                <div id="allocation">
                    <div>
                        <h4>Your Allocation</h4>
                    </div>
                    <div>Available Cash: $[[availableCash]]</div>
                    <div>Settled Cash: $[[settledCash]]</div>
                    <div>Available Assets: [[availableAssets]]</div>
                    <div>Settled Assets: [[settledAssets]]</div>
                </div>
                <div id="order-input">
                    <h4>Submit an Order</h4>
                    
                    <buysell-slider
                        low-value="0"
                        high-value="100"
                        buy-option
                        sell-option
                        buy-price="{{ buyPrice }}"
                        sell-price="{{ sellPrice }}"
                        hide-before-submit
                    ></buysell-slider>

                    <label for="price_input">Price</label>
                    <input id="price_input" type="number" min="0">
                    <label for="volume_input">Volume</label>
                    <input id="volume_input" type="number" min="1">
                    <div>
                        <button type="button" on-click="_enter_order" value="bid">Enter Bid</button>
                        <button type="button" on-click="_enter_order" value="ask">Enter Ask</button>
                    </div>
                </div>
            </div>
        `;
    }

    _enter_bid() {
        const price = this.buyPrice
        const volume = 1;
        const is_bid = true;
        const order = {
            price: price,
            volume: volume,
            is_bid: is_bid,
        }
        this.dispatchEvent(new CustomEvent('order-entered', {detail: order}));
    }

    _enter_ask() {
        const price = this.sellPrice;
        const volume = 1;
        const is_bid = false;
        const order = {
            price: price,
            volume: volume,
            is_bid: is_bid,
        }
        this.dispatchEvent(new CustomEvent('order-entered', {detail: order}));
    }

    _enter_order(event) {
        const price = parseInt(this.$.price_input.value);
        const volume = parseInt(this.$.volume_input.value);
        const is_bid = (event.target.value == "bid");
        const order = {
            price: price,
            volume: volume,
            is_bid: is_bid,
        }
        this.dispatchEvent(new CustomEvent('order-entered', {detail: order}));
    }

}

window.customElements.define('order-enter-widget', OrderEnterWidget);
