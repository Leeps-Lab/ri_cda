import { html, PolymerElement } from '/static/otree-redwood/node_modules/@polymer/polymer/polymer-element.js';
import '/static/otree-redwood/node_modules/@polymer/polymer/lib/elements/dom-repeat.js';

/*
    this component is a message box which displays either info messages or error messages.
    call either the `info` or `error` method with a message to add a message to the list.
    the box always stays scrolled to the bottom unless the player has scrolled the message box up at all
*/

class EventLog extends PolymerElement {

    static get properties() {
        return {
            // if set, the max number of entries shown will be limited to this number
            maxEntries: Number,
            _entries: {
                type: Array,
                value: function() {
                    return [];
                },
            },
            // true if the player is scrolled to the bottom of the log
            _scrolled_to_bottom: {
                type: Boolean,
                value: true,
            }
        };
    }

    static get template() {
        return html`
            <style>
                #container {
                    width: 100%;
                    height: 100%;
                    padding: 10px;
                    overflow-y: scroll;
                    box-sizing: border-box;
                }
                #container div {
                    font-family: monospace;
                }
                .error {
                    color: red;
                }
                .warn {
                    color: darkorange;
                }
                .bid {
                    color: #2F3238;
                }
                .ask {
                    color: #007bff;
                }
            </style>

            <div id="container" on-scroll="_container_scroll">
                <template is="dom-repeat" items="{{_entries}}">
                    <div>
                        <span class$="[[item.type]]">[[item.text]]</span>
                    </div>
                </template>
            </div>
        `;
    }

    ready() {
        super.ready();
        // check if log contents are stored in session storage
        const prev_entries = sessionStorage.getItem('event-log-history');
        if (prev_entries !== null) {
            this.set('_entries', JSON.parse(prev_entries));
        }
        // write log contents into session storage on page unload
        window.addEventListener('unload', () => {
            sessionStorage.setItem('event-log-history', JSON.stringify(this.get('_entries')));
        });

        setTimeout(() => {
            const container = this.$.container;
            container.scrollTop = container.scrollHeight- container.clientHeight;
        })
    }

    add(text, type) {
        this.unshift('_entries', {
            type: type,
            text: text,
        });
        
        if (this.maxEntries && this._entries.length > this.maxEntries) {
            this.shift('_entries');
        }

        if (this._scrolled_to_bottom) {
            // have to wait because we need to calculate scrollTop after the new entry is added
            setTimeout(() => {
                const container = this.$.container;
                container.scrollTop = container.scrollHeight- container.clientHeight;
            });
        }
    }

    error(text) {
        this.add(text, 'error');
    }

    info(text, type) {
        if (type === undefined)
            this.add(text, 'info');
        else
            this.add(text, type);
    }

    warn(text) {
        this.add(text, 'warn');
    }

    _container_scroll(event) {
        const container = event.target;
        this._scrolled_to_bottom = (container.scrollHeight - container.clientHeight <= container.scrollTop + 1);
    }

}

window.customElements.define('event-log', EventLog);
