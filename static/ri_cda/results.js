import { html, PolymerElement } from '/static/otree-redwood/node_modules/@polymer/polymer/polymer-element.js';
import './shared/buysell_slider.js';
import './public_info/public_info.js';
import './info_precision/info_precision.js';
import './bond_price/bond_price.js';
import './polymer-elements/paper-button.js';
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

class Results extends PolymerElement {
  static get properties() {
      return {
          bids: Array,
          asks: Array,
          trades: Array,
          settledAssets: Number,
          availableAssets: Number,
          settledCash: Number,
          availableCash: Number,
          timeRemaining: Number,
          g: Number,
          k: Number,
          m: Number,
          y: Number,
          mLow: Number,
          mHigh: Number,
          lowValue: Number,
          highValue: Number,
          buyOption: {
              type: Boolean,
              value: true,
          },
          sellOption: {
              type: Boolean,
              value: true,
          },
          displayFormat: {
              type: Object,
              value: function() {
                  return cash => `$${parseFloat((cash/100).toFixed(2))}`;
              },
          },
          currentBid: {
              type: Number,
              computed: '_getCurrentBid(bids)',
          },
          currentAsk: {
              type: Number,
              computed: '_getCurrentAsk(asks)',
          },
          roundNumber: Number,
          hidden: {
              type: Boolean,
              value: false,
          },
          disableSelect: {
              type: Boolean,
              value: true,
          },
          animatePrice: {
              type: Boolean,
              value: true,
            },
            hideBeforeSubmit: {
                type: Boolean,
                value: false,
            },
            buyPrice: {
                type: Number,
                value: 0,
            },
            sellPrice: {
                type: Number,
                value: 100,
            },
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
            expectedValue: {
              type: Number,
              computed: '_expectedBondVal(m)',
              notify: true,
              reflectToAttribute: true,
            },
            step: {
              type: Number,
              value: 0,
            },
            cost_round: {
              type: Number,
              computed: '_roundCost(cost)',
              notify: true,
              reflectToAttribute: true,
            },
      };
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
                mark.exp-val {
                    color: #E11584;
                    background: none;
                }
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
                  trades="{{trades}}"
                  settled-assets="{{settledAssets}}"
                  available-assets="{{availableAssets}}"
                  settled-cash="{{settledCash}}"
                  available-cash="{{availableCash}}"
              ></trader-state>
          <div class="container" id="main-container">

              <div>
                  <h3>Trades</h3>
                  <trade-list
                      class="flex-fill"
                      id="trades"
                      trades="[[trades]]"
                      pcode="[[pcode]]"
                  ></trade-list>
              </div>
              </div>
              <buysell-slider
                  low-value="[[ lowValue ]]"
                  high-value="[[ highValue ]]"
                  buy-option="[[ buyOption ]]"
                  sell-option="[[ sellOption ]]"
                  buy-price="{{ buyPrice }}"
                  sell-price="{{ sellPrice }}"
                  price-to-show="[[ expectedValue ]]"
                  animate-price="[[ animatePrice ]]"
                  hide-before-submit="[[ hideBeforeSubmit ]]"
                  disable-select="[[ disableSelect ]]"
                  hidden= "[[hidden]]"
              ></buysell-slider>
              <div>
              <h2>Actual m: [[ m ]]</h2>
              <h3>Expected bond value:
              <span class="non-def">[[ _getNondefault(g) ]]%</span> * 100 + <span class="def">[[ g ]]%</span>
                  * [[ m ]] = <mark class="exp-val">[[ expectedValue ]]</mark>
              </h3>
              </div>
            <paper-button class="btn" on-click="next_step" hidden$="{{_disable(step)}}"> Next </paper-button>
            <div id="allocation" hidden$="{{_hide(step)}}">
                <div>
                    <h4> Your bonds <mark class$ = [[_getDefaultcolor(isdefault)]]> [[_getDefault()]] </mark><br/>
                    Actual held bond payment: [[ bondPayment ]]<br/>
                    Your private info cost: [[ cost_round ]]</h4>
                </div>
                <div>
                <h4>Your Allocation</h4>
                <div>Net Cash: [[_formatCash(settledCash)]]<br/> Bonds held: [[settledAssets]]</div>
                <h3> Payoff = Net Cash + Bond Payment * Number of Held Bonds - Information Cost </h3>
                <h3> [[payoff]] = [[_formatCash(settledCash)]] + [[bondPayment]] * [[settledAssets]] - [[cost_round]] </h3>
                <paper-button class="btn" on-click="next" hidden$="{{_hide(step)}}" >Continue</paper-button>
            </div>
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
  _roundCost(cost) {
    return Math.round(cost * 100)/100;
  }
  // triggered when this player enters an order
  _order_entered(event) {
      const order = event.detail;
      if (isNaN(order.price) || isNaN(order.volume)) {
          this.$.widget.setLimitText('Invalid order entered');
          return;
      }
      const bids = this.bids.filter(b => b.pcode === this.pcode);
      const asks = this.asks.filter(a => a.pcode === this.pcode);

      if (order.is_bid) {
          // cannot bid higher than previous ask price, if exists
          if (asks.length > 0 && asks[0].price <= order.price) {
              this.$.widget.setLimitText(`Order rejected: bid price (${order.price/100}) must be less than existing ask of ${asks[0].price/100}`);
              return;
          }
          // replace previous bid, if exists
          for(let i = 0; i < bids.length; i++) {
              this.$.trader_state.cancel_order(bids[i]);
          }
          this.$.trader_state.enter_order(order.price, order.volume, order.is_bid);
          this.$.widget.disableSubmit('bid');
      } else {
          // cannot ask lower than previous bid, if exists
          if (bids.length > 0 && bids[0].price >= order.price) {
              this.$.widget.setLimitText(`Order rejected: ask price (${order.price/100}) must be greater than existing bid of ${bids[0].price/100}`);
              return;
          }
          // replace previous ask, if exists
          for(let i = 0; i < asks.length; i++) {
              this.$.trader_state.cancel_order(asks[i]);
          }
          this.$.trader_state.enter_order(order.price, order.volume, order.is_bid);
          this.$.widget.disableSubmit('ask');
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

      if ((this.settledAssets === 0 && order.is_bid) || (this.settledAssets === 2 && !order.is_bid)) {
          this.$.widget.setLimitText(`Cannot accept ${order.is_bid ? 'bid' : 'ask'}: holding ${this.settledAssets} bonds`);
          return;
      }

      this.$.modal.modal_text = `Do you want to ${order.is_bid ? 'sell' : 'buy'} for $${parseFloat((order.price/100).toFixed(1))}?`
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
          this.$.log.info(`${order.is_bid ? '-' : '+'} $${parseFloat((order.price/100).toFixed(1))}`, type);
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

  _getCurrentBid(bids) {
      const myBids = bids.filter(b => b.pcode === this.pcode);
      return myBids[0];
  }

  _getCurrentAsk(asks) {
      const myAsks = asks.filter(a => a.pcode === this.pcode);
      return myAsks[0];
  }
  _formatCash(cash) {
      return parseFloat((cash/100).toFixed(2));
  }
  _getisdefault(y,g) {
      return y < g;
  }
  _expectedBondVal(m) {
      return parseFloat((this._getNondefault(this.g) + this.g * m / 100).toFixed(2));
  }
  _getBondPayment(m) {
      return this.isdefault ? m : 100; // 0 if match
  }
  _getNondefault(def) {
      return 100 - def;
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
  next_step() {
      this.step = 1;
  }
  _disable(step) {
    return this.step == 1;
  }
  _hide(step) {
      return this.step != 1;
  }
  next() {
      this.dispatchEvent(new CustomEvent('getPolymerData', {
          bubbles: true,
          composed: true,
          detail: {
              this: this,
              value: { // values to dispatch to oTree
                  'payoff': this.payoff,
                  'settledAssets' : this.settledAssets,
              },
              eventName: 'getPolymerData'
            }
        }));
  }

}

window.customElements.define('results-page', Results);
