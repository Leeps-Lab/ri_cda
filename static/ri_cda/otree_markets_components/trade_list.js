import { html, PolymerElement } from '/static/otree-redwood/node_modules/@polymer/polymer/polymer-element.js';
import '/static/otree-redwood/node_modules/@polymer/polymer/lib/elements/dom-repeat.js';

/*
    this component represents a list of trades which have occured in this market.
    it expects `trades` to be a sorted list of objects representing trades
*/

class TradeList extends PolymerElement {

    static get properties() {
        return {
            trades: Array,
            assetName: String,
            displayFormat: {
                type: Object,
                value: function() {
                    return trade => `@ $${parseFloat((trade.making_orders[0].price/100).toFixed(1))}`;
                },
            },
            displayColor: {
                type: Object,
                value: function() {
                    return trade => trade.taking_order.type;
                }
            },
        };
    }

    static get template() {
        return html`
            <style>
                #container {
                    width: 100%;
                    height: 100%;
                    overflow-y: auto;
                    box-sizing: border-box;
                }
                #container div {
                    border: 1px solid black;
                    text-align: center;
                    margin: 3px;
                }
                .bid {
                    color: #ffffff;
                    background-color: #2F3238;
                }
                .ask {
                    background-color: #007bff;
                    color: #ffffff;
                }
                .other {
                    background-color: #a9a9a9;
                    color: #ffffff;
                }
            </style>

            <div id="container">
                <template is="dom-repeat" items="{{trades}}" filter="{{_getAssetFilterFunc(assetName)}}">
                    <div class$="[[displayColor(item)]]">
                        <span class$="[[displayColor(item)]]">[[displayFormat(item)]]</span>
                    </div>
                </template>
            </div>
        `;
    }

    ready() {
        super.ready();
    }

    _getAssetFilterFunc(assetName) {
        if(!assetName) {
            return null;
        }
        return function(trade) {
            return trade.asset_name == assetName;
        }
    }

    setColor(index, type) {
        this.trades[index].taking_order.type = type;
    }

}

window.customElements.define('trade-list', TradeList);
