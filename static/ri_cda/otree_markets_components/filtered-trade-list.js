import { html, PolymerElement } from '/static/otree-redwood/node_modules/@polymer/polymer/polymer-element.js';
import { TradeList } from '/trade_list.js';

import '/static/otree-redwood/src/otree-constants/otree-constants.js';

class FilteredTradeList extends TradeList {

    static get properties() {
        return {
            limitNum: {
                type: Number,
                value: 0,
            },
            showOwnOnly: {
                type: Boolean,
                value: false,
            },
            sortTrades: {
                type: Boolean,
                value: false,
            }
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
                .my-bid {
                    background-color: #ffb3b3;
                }
                .my-ask {
                    background-color: #c6ffb3;
                }
            </style>
            <otree-constants
                id="constants"
            ></otree-constants>
            <div id="container">
                <template is="dom-repeat" items="{{ filterTrades(trades.*, limitNum, showOwnOnly, sortTrades) }}" as="trade" filter="{{_getAssetFilterFunc(assetName)}}">
                    <template is="dom-repeat" items="{{trade.making_orders}}" as="making_order">
                        <div class$="[[ getCellClass(making_order, trade.taking_order) ]]">
                            <span>[[displayFormat(making_order, trade.taking_order)]]</span>
                        </div>
                    </template>
                </template>
            </div>
        `;
    }

    ready() {
        super.ready();
        this.pcode = this.$.constants.participantCode;
    }

    getCellClass(making, taking) {
        if (this.pcode == taking.pcode){
            if (taking.is_bid) {
                return 'my-bid'
            } else{
                return 'my-ask'
            }
        }
        if (this.pcode == making.pcode){
            if (making.is_bid){
                return 'my-bid'
            } else{
                return 'my-ask'
            }
        }
    }

    filterTrades(tradesChange, limitNum, showOwnOnly, sortTrades) {
        const trades = tradesChange.base;
        if (typeof trades === 'undefined') return;

        // given a trade, return true if the current player participated in that trade
        const player_participated = trade => {
            return trade.taking_order.pcode == this.pcode || trade.making_orders.some(order => order.pcode == this.pcode);
        };

        const filtered_trades = trades.filter((trade, i) => {
            return player_participated(trade) || (!showOwnOnly && (limitNum == 0 || i < limitNum));
        });

        // if sortTrades is true, sort the trades by price in decreasing order
        if (sortTrades){
            filtered_trades.sort((a, b) => {
                return b.making_order.price - a.making_order.price;
            });
        }
        return filtered_trades;
    }

}

window.customElements.define('filtered-trade-list', FilteredTradeList);
