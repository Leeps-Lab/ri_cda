import { html, PolymerElement } from '/static/otree-redwood/node_modules/@polymer/polymer/polymer-element.js';

class PrecisionSelector extends PolymerElement {

    static get properties() {
        return {
            precision: {
                type: Number,
                value: 100,
                observer: '_updateSelected',
                notify: true,
                reflectToAttribute: true,
            },
            cost: {
                type: Number,
                value: 0,
                notify: true,
                reflectToAttribute: true,
            },
            cost_round: {
                type: Number,
                value: 0,
                notify: true,
                reflectToAttribute: true,
            },
            data: {
                type: Array,
                value: [],
                computed: '_getCosts(k)'
            },
            scale: {
                type: Number,
                value: 100,
            },
            disableSelect: {
                type: Boolean,
                value: false,
            },
        }
    }

    static get template() {
        return html`
            <style>
                .container {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                }
                input {
                    width: 96%;
                    margin-left: 4%;
                }
                .display {
                    margin-top: 10%;
                }
                .sliderticks {
                    display: flex;
                    justify-content: space-between;
                    width: 98%;
                }
                .sliderticks p {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    text-align: center;
                    margin: 0;
                }
            </style>
            <div class="container">
                <figure class="highcharts-figure">
                <div id="chart"></div>
                <input type="range" min="1" max=[[ scale ]] step="1" value="{{ precision::input }}" disabled$="[[ disableSelect ]]" >
                <div class="sliderticks">
                    <p>precise</p>
                    <p></p>
                    <p></p>
                    <p></p>
                    <p></p>
                    <p>imprecise</p>
                </div>
                </figure>
                <div class="display">
                    <h2>width: [[ precision ]]<br/>cost: [[ cost ]]</h2>
                </div>
            </div>`;
    }

    ready() {
        super.ready();
        this._initHighchart();
    }

    _getCosts(k) {
        // Cost Function: -k ln w , where k (or kappa) > 0 is read from config
        let data = [];
        for(let x = 1; x <= this.scale; x++) {
            // scale back to 0 ~ 1 for calculating costs (y-coordinates)
            let xs = parseFloat((x/100).toFixed(2));
            let val = parseFloat((-k * Math.log(xs)).toFixed(4));
            data.push([x, val]);
        }
        return data;

    }

    _updateSelected() {
        if (!this.graphObj)
            return;
        const point = this.graphObj.series[0].data[this.precision - 1];
        point.select();
        this.graphObj.tooltip.refresh(point);
        if(point.y < .01 && point.x < 100)
          this.cost = .01;
        else
          this.cost = Math.round(point.y * 100)/100;
    }

    _initHighchart() {
        this.graphObj = Highcharts.chart({
            chart: {
                renderTo: this.$.chart,
            marginLeft: 50
            // Fix visual bug

            },
            tooltip: {
                crosshairs: true,
                formatter: function() {
                    return 'Width: ' + this.point.x + '<br/>Cost: ' + this.point.y;
                },
                valueSuffix: ' credits',
                style: {
                    width: '500px',
                    fontSize: '16px'
                }
            },
            title: {
                text: '',
            },
            yAxis: {
                title: {
                    text: 'Cost',
                    style: {
                        fontSize: '20px'
                    },
                    margin: 30
                }
            },
            xAxis: {
                min: 0,
                max: this.scale,
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            plotOptions: {
                line: { marker: { enabled: false } },
                series: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    events: {
                        click: function (event) {
                            console.log(event.point.x, event.point.y);
                        }
                    },
                    label: {
                        allowPointSelect: true,
                        connectorAllowed: false
                    },
                },
            },
            series: [{
                name: 'Width',
                data: this.data,
                pointStart: 0
            },],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 1000
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        });
    }
}

window.customElements.define('precision-selector', PrecisionSelector);
