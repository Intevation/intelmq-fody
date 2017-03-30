<template>
  <section class="content">
    <div class="box">
        <div class="box-header with-border">
            <h3 class="box-title">Switch Statistics Mode</h3>
            <div class="box-body">
                <div class="col-sm-12 col-xs-12">
                    <!-- Switch the mode of the Statistics Interface -->
                    <button class="btn" v-bind:class="[mode === 'events' ? 'btn-primary' : ' btn-default']" v-on:click="doEventStats">
                        Events
                    </button>
                    <button class="btn" v-bind:class="[mode === 'tickets' ? 'btn-primary' : ' btn-default']" v-on:click="doTicketStats">
                        Tickets
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- ./box -->
    <div class="box">
        <div class="box-header with-border">
            <h3 class="box-title">Prepare Query</h3>
            <div class="box-body">
                <div class="col-sm-12 col-xs-12">
                    <div class="form-group row">
                        <label class="col-sm-4 col-form-label">{{ getTimeResParamLabels(this.mode)[0] }}</label>
                        <div class="col-sm-8">
                            <Flatpickr v-bind:options="fpOptions" v-model:value="query.after"
                                class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-4 col-form-label">{{ getTimeResParamLabels(this.mode)[1] }}</label>
                        <div class="col-sm-8">
                            <Flatpickr v-bind:options="fpOptions" v-model:value="query.before"
                                class="form-control"/>
                        </div>
                    </div>
                    <div v-for="(sq, index) of query.subs">
                        <div class="form-group row">
                            <div class="col-sm-4 col-form-label">
                                <select v-model="sq.cond" class="form-control">
                                    <option value=""></option>
                                    <option v-for="k in Object.keys(allowedSubs).sort()">
                                        {{ k }}
                                    </option>
                                </select>
                            </div>
                            <!-- <p class="form-control-static">:</p> -->
                            <div class="col-sm-8">
                                <input v-model="sq.value" type="text" class="form-control">
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-sm-12 col-xs-12">
                <div class="form-group">
                    <div class="col-sm-4 col-form-label">
                        <label>Resolution</label>
                    </div>
                    <div class="col-sm-6">
                        <select v-model="query.timeres" class="form-control">
                            <option value="">(automatic)</option>
                            <option>hour</option>
                            <option>day</option>
                            <option>week</option>
                            <option>month</option>
                        </select>
                    </div>
                    <div class="col-sm-2">
                        <button class="btn btn-primary" v-on:click="loadStats">
                            Load data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- ./box -->
    <!-- Area where Charts and Data are shown -->
    <div class="box">
        <div class="box-header with-border">
            <h3 class="box-title">{{ modeHeader }}</h3>
            <div class="box-body">
                <div class="col-md-12 col-sm-12" id="chart_container">
                    <!-- for SVG downloading to result in usable file we want
                    the styling within each element as style attribute -->
                    <svg id="chart1" v-bind:width="width" v-bind:height="height">
                        <g id="chart1_g"
                            v-bind:transform="'translate(' + margin.left +
                               ', ' + margin.top + ')'"></g>
                    </svg>
                </div>

                <div>
                <!-- using encodeURIComponent because IE and Firefox need this for
                non-base64 SVG and using base64 is even more cumbersome as it would 
                require an encoding function that can deal with unicode (atob can't).
                -->
                    <button v-if="svgXML === ''" class="btn btn-warning"
                        v-on:click="prepareDownloads">
                            Prepare Exports
                    </button>
                    <a v-if="svgXML !== ''" class="btn btn-success"
                        v-bind:href="'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgXML)"
                        v-bind:download="'intelmq-fody-stats-' + queryData.timeres + 'ly.svg'"
                        >Download SVG</a>

                    <a v-if="dataCSV !== ''" class="btn btn-success"
                        v-bind:href="'data:text/csv;charset=utf-8;header=present,' + encodeURIComponent(dataCSV)"
                        v-bind:download="'intelmq-fody-' + queryData.timeres + 'ly.csv'"
                        >Download CSV</a>
                </div>
                <!--
                <pre>
                    {{ queryData }}
                </pre>
                -->
            </div>
        </div>
    </div>
  </section>
</template>

<script>
import * as d3 from 'd3'
import VueFlatpickr from 'vue-flatpickr'
import 'vue-flatpickr/theme/airbnb.css'

module.exports = {
  name: 'Stats',
  components: {
    'Flatpickr': VueFlatpickr
  },
  data: function () {
    var tomorrow = new Date()
    var today = new Date()

    tomorrow.setDate(tomorrow.getDate() + 1)

    today = today.toJSON().split('T')[0]
    tomorrow = tomorrow.toJSON().split('T')[0]

    return {
      width: 0,
      height: 0,
      margin: {'top': 20, 'right': 52, 'bottom': 30, 'left': 52},
      baseQueryURL: '',  // base url for AJAJ service
      eventsModeUrl: '/api/events',
      ticketsModeUrl: '/api/tickets',
      modeHeader: '',
      mode: '',
      allowedSubs: {},  // allowed subqueries as returned from the backend
      svgXML: '',  // SVG string for download
      dataCSV: '',  // CVS of data for download
      queryData: {'results': []}, // Data used for statistics
      query: {
        timeres: 'hour',
        after: today,
        before: tomorrow,
        subs: [{cond: '', value: ''}]
      },
      fpOptions: {
        onValueUpdate: null,
        allowInput: true,
        time_24hr: true,
        enableTime: true,
        weekNumbers: true,
        maxDate: tomorrow
      }
    }
  },
  computed: {
    padded: function () {
      const width = this.width - this.margin.left - this.margin.right
      const height = this.height - this.margin.top - this.margin.bottom
      return { width, height }
    }
  },
  mounted: function () {
    window.addEventListener('resize', this.onResize)

    this.$watch('query.subs', function (newVal, oldVal) {
      var lastSub = this.query.subs[this.query.subs.length - 1]
      if (lastSub.cond !== '') {
        this.query.subs.push({cond: '', value: ''})
      }
      for (var i = 0; i < this.query.subs.length - 1; i++) {
        if (this.query.subs[i].cond === '') {
          this.query.subs.splice(i, 1)
        }
      }
    }, {deep: true})

    this.setMode('events')
    this.initialize()
    this.onResize()  // initialize size and chart on first mount
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.onResize)
  },
  watch: {
    width: function widthChanged () {
      this.update()
    },
    queryData: function queryDataChanged () {
      this.update()
    }
  },
  methods: {
    onResize: function () {
      this.width = document.getElementById('chart_container').offsetWidth
      this.height = this.width / 1.61803 // golden ratio
    },
    updateQuerySubs: function () {
      //
    },
    getScales: function (data) {
      var x = d3.scaleTime().range([0, this.padded.width])
      var y = d3.scaleLinear().rangeRound([this.padded.height, 0])
      x.domain(d3.extent(data, d => d.date_trunc)).nice()
      y.domain([0, d3.max(data, d => d.count)])
      return {x, y}
    },
    initialize: function () {
      var g = d3.select('#chart1_g')

      g.append('g')
        .attr('class', 'axis axis--x')

      g.append('g')
          .attr('class', 'axis axis--y')
        .append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '0.71em')
          .attr('text-anchor', 'end')
          .attr('style', 'fill:black')
          .text('count')
    },
    ticksX: function () {
      // how many ticks shall we display?
      return Math.floor(this.padded.width / 110)
    },
    formatXTick: function () {
      if (this.queryData.timeres === 'day') {
        return d => d.toISOString().slice(0, 10)
      } else {
        return d => d.toISOString().slice(0, 10) + '.' +
                    d.toISOString().slice(11, 13)
      }
    },
    update: function () {
      var data = this.queryData.results
      var scale = this.getScales(data)
      var g = d3.select('#chart1_g')

      var bar = g.selectAll('.bar').data(data)

      bar.enter().append('rect')
          .attr('class', 'bar')
          .attr('style', 'fill: steelblue')
        .merge(bar)
          .attr('x', d => scale.x(d.date_trunc) - 1)  // minus .05*width
          .attr('y', d => scale.y(d.count))
          .attr('width', 2)  // TODO better width calculation
          .attr('height', d => {
            //  could be temporarily negative for small d.count
            var diff = this.padded.height - scale.y(d.count)
            return diff < 0 ? 0 : diff
          })

      bar.exit().remove()

      g.select('.axis--x')
        .attr('transform', 'translate(0,' + this.padded.height + ')')
        .call(d3.axisBottom(scale.x)
          .ticks(this.ticksX())
          .tickFormat(this.formatXTick()))

      g.select('.axis--y')
        .call(d3.axisLeft(scale.y).ticks(10))

      // once updated we have to clearout the old export data
      this.svgXML = ''
      this.dataCSV = ''
    },
    getSubQueries: function () {
      // ask the server what kind of subqueries are allowed
      var url = this.baseQueryURL + '/subqueries'
      this.$http.get(url).then((response) => {
        // got valid response
        response.json().then((value) => {
          // json parsed correctly
          if (value) {
            this.allowedSubs = value
          }
        })
      })
    },
    setMode: function (mode) {
      this.mode = mode
      if (mode === 'tickets') {
        this.baseQueryURL = this.ticketsModeUrl
        this.modeHeader = 'Tickets created'
      } else {
        this.baseQueryURL = this.eventsModeUrl
        this.modeHeader = 'Events processed'
      }
      this.getSubQueries()
      // Clear graph an QueryData etc.
      this.queryData.results = []
      this.update()
    },
    doEventStats: function () {
      this.setMode('events')
    },
    doTicketStats: function () {
      this.setMode('tickets')
    },
    getTimeResParams: function (mode) {
      if (mode === 'tickets') {
        return ['sent-at_after', 'sent-at_before']
      } else {
        return ['time-observation_after', 'time-observation_before']
      }
    },
    getTimeResParamLabels: function (mode) {
      if (mode === 'tickets') {
        return ['Sent after', 'Sent before']
      } else {
        return ['Observed after', 'Observed before']
      }
    },
    loadStats: function () {
      var qParams = this.getTimeResParams(this.mode)
      var url = this.baseQueryURL + '/stats?' +
        qParams[0] + '=' + this.query.after +
        '&' + qParams[1] + '=' + this.query.before +
        '&timeres=' + this.query.timeres

      // add optional subqueries
      // we don't mind if some conditions appear several times
      url += '&' +
        this.query.subs
          .filter(q => q.cond !== '')
          .map(q => q.cond + '=' + q.value)
          .join('&')

      this.$http.get(url).then((response) => {
        // got valid response
        response.json().then((value) => {
          // json parsed correctly
          if (value) {
            // parse the date_trunc strings into Date objects
            this.queryData = {
              timeres: value.timeres,
              results: value.results.map(d => {
                return {
                  count: d.count,
                  date_trunc: new Date(d.date_trunc)
                }
              })
            }
          } else {
            this.queryData = {}
          }
        })
      }, (response) => {
        // no valid response
        this.queryData = {}
      })
    },
    prepareDownloads: function () {
      var svg = document.getElementById('chart1')

      /* global XMLSerializer */
      /* eslint no-undef: "error" */
      /* eslint-env browser */
      var svgXML = (new XMLSerializer()).serializeToString(svg)
      this.svgXML = svgXML

      this.dataCSV = d3.csvFormat(this.queryData.results)
    }
  }
}
</script>
