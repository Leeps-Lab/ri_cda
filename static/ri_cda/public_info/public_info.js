import { html, PolymerElement } from '/static/otree-redwood/node_modules/@polymer/polymer/polymer-element.js';
import './pie_chart.js';

class PublicInfo extends PolymerElement {

    static get properties() {
        return {
            credits: {
                type: Number,
            },
        }
    }

    static get template() {
        return html`
            <style>
                :host {
                    text-align: center;
                }
                pie-chart {
                    margin: auto;
                    max-width: 700px;
                }
                .def {
                    color: #DF5353;
                }
                .non-def {
                    color: #55BF3B;
                }
            </style>
            <!-- <h3>Public information:</h3> -->
            <h4>This bond has <span class="def">[[ g ]]%</span> default probability
            and <span class="non-def">[[ _getNondefault(g) ]]%</span> non-default probability.</h4>
            <pie-chart
            default-prob="[[ g ]]"
            ></pie-chart>
            <!-- <h4 class="non-def">If non-default, the bond repays [[ credits ]] game credits.</h4>
            <h4 class="def">If default, the bond repays in m ratio of [[ credits ]] game credits (0 < m < 100).</h4>         -->
            `;
    }

    _getNondefault(def) {
        return 100 - def;
    }

}

window.customElements.define('public-info', PublicInfo);