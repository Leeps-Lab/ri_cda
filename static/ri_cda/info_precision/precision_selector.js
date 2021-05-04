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
            height: Number,
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
                <input id="precise" type="range" min="0" max=[[ scale ]] value="{{ precision::input }}" disabled$="[[ disableSelect ]]" >
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
            if(x == 100 || x == 70 ||x == 50 || x == 30 || x == 10 || x == 1) {
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
        this.cost_round = Math.round(point.y * 100)/100;
        // Snap to markers, maybe find a better solution later - but this works for now
        if(this.precision >= 85) {
            this.precision = 100;
        }
        else if(this.precision < 85 && this.precision >= 60) {
            this.precision = 70;
        }
        else if(this.precision < 60 && this.precision >= 40) {
            this.precision = 50;
        }
        else if(this.precision < 40 && this.precision >= 20) {
            this.precision = 30;
        }
        else if(this.precision < 20 && this.precision >= 6) {
            this.precision = 10;
        }
        else if(this.precision < 6) {
            this.precision = 1;
        }
        //Edge case irrelevant now
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
                    if(this.point.x == 1 || this.point.x == 10 || this.point.x == 30 || this.point.x == 50 || this.point.x ==70 || this.point.x ==100) {
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
                max: this.height,
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
                tickInterval: 10,
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            plotOptions: {
                line: { marker: { enabled: false } },
                series: {
                    allowPointSelect: false,
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
