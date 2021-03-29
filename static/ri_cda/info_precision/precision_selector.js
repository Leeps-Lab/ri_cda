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
            zeroprecision: {
                type: Number,
                value: 100,
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
                <input type="range" min="0" max=[[ scale ]] step ="20" value="{{ precision::input }}" disabled$="[[ disableSelect ]]" >
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
                    <h2>width: [[ zeroprecision ]]<br/>cost: [[ cost_round ]]</h2>
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
            if(x == 100 || x == 80 ||x == 60 || x == 40 || x == 20 || x == 1) {
              data.push({
                  x: x,
                  y: val,
                  marker: {
                    enabled: true,
                    radius: 8,
                  },
                  tooltip: {
                      enabled: true,
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

              });
            }
            else {
              data.push([x, val]);
            }
            if( x == 1) {
              data.push([0,val]);
            }
        }
        return data;

    }

    _updateSelected() {
        if (!this.graphObj)
            return;
        const point = this.graphObj.series[0].data[this.precision];
        point.select();
        this.graphObj.tooltip.refresh(point);
        this.cost = point.y;
        //Change later
        if(point.y < .01)
          this.cost_round = 0;
        else
          this.cost_round = Math.round(point.y * 100)/100;
        if (this.precision == 0) {
            this.zeroprecision = 1;
            this.precision = 1;
          }
        else {
          this.zeroprecision = this.precision;
        }

    }


    _initHighchart() {
        this.graphObj = Highcharts.chart({
            chart: {
                renderTo: this.$.chart,
            marginLeft: 50
            // Fix visual bug
            },
            tooltip: {
                enabled: true,
                crosshairs: true,
                formatter: function() {
                    if(this.point.x == 1 || this.point.x == 20 || this.point.x == 40 || this.point.x == 60 || this.point.x ==80 || this.point.x ==100) {
                        return 'Width: ' + this.point.x + '<br/>Cost: ' + Math.round(this.point.y * 100)/100;
                    }

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
                min: 0,
                max: 25,
                title: {
                    text: 'Cost',
                    style: {
                        fontSize: '20px'
                    },

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
