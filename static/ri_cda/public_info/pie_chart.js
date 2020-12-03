import { html, PolymerElement } from '/static/otree-redwood/node_modules/@polymer/polymer/polymer-element.js';

class PieChart extends PolymerElement {
    static get properties() {
        return {
            defaultProb: {
                type: Number,
            }
        }
    }

    static get template() {
        return html`
            <style>
                :host {
                    display: block;
                }
            </style>
            <figure class="highcharts-figure">
                <div id="chart"></div>
            </figure>
        `;
    }

    _getNondefault(def) {
        return 100 - def;
    }

    ready() {
        super.ready();
        this._initHighchart();
    }

    _initHighchart() {
        Highcharts.setOptions({
            colors: ['#55BF3B', '#DF5353'],
        });
        this.graphObj = Highcharts.chart({
            chart: {
                renderTo: this.$.chart,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
            },
            title: {
                text: ''
            },
            tooltip: {
                pointFormat: '<b>{point.percentage:.1f}%</b>'
            },
            accessibility: {
                point: {
                    valueSuffix: '%'
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        formatter: function() {
                            if (this.point.name === 'Default Probability')
                                return 'pays m < 100';
                            else
                                return 'pays 100';
                        }
                    },
                    showInLegend: true
                }
            },
            series: [{
                colorByPoint: true,
                data: [
                    {
                        name: 'Non-default Probability',
                        y: this._getNondefault(this.defaultProb),
                    },
                    {
                        name: 'Default Probability',
                        y: this.defaultProb,

                    },]
            },],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 800
                    },
                }]
            }
        });
    }
}

window.customElements.define('pie-chart', PieChart);