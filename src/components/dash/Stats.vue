<template>
  <section class="content">
    <div class="row">
      <div class="col-md-12 col-sm-12" id="chart_container">
        <div class="form-inline">
          <div class="form-group">
            <label>after</label>
            <Flatpickr v-bind:options="fpOptions" v-model:value="query.after"
               class="form-control"
            />
            <label>before</label>
            <Flatpickr v-bind:options="fpOptions" v-model:value="query.before"
               class="form-control"/>
          </div>

          <div v-for="(sq, index) of query.subs" class="form-group">
            <select v-model="sq.cond" class="form-control">
              <option value=""></option>
              <option v-for="(v, k) of allowedSubs">{{ k }}</option>
            </select>
            <!-- <p class="form-control-static">:</p> -->
            <input v-model="sq.value" type="text" class="form-control">
          </div>

          <div class="form-group pull-right">
            <label>Resolution</label>
            <select v-model="query.timeres" class="form-control">
              <option value="">(automatic)</option>
              <option>hour</option>
              <option>day</option>
              <option>week</option>
              <option>month</option>
            </select>
            <button class="btn btn-default" v-on:click="loadStats">
              Load data
            </button>
          </div>
          </div>
        </div>

        <h2>Events processed</h2>
        <!-- for SVG downloading to result in usable file we want
             the styling within each element as style attribute -->
        <svg id="chart1" v-bind:width="width" v-bind:height="height">
          <g id="chart1_g"
            v-bind:style="{transform: `translate(${margin.left}px, ${margin.top}px)`}">
          </g>
        </svg>
      </div>
      <div>

      <!-- using encodeURIComponent because IE and Firefox need this for
           non-base64 SVG and using base64 is even more cumbersome as it would
           require an encoding function that can deal with unicode (atob can't).
      -->
      <button v-if="svgXML === ''" class="btn btn-warning"
        v-on:click="saveSVG">
        Prepare SVG Export
      </button>
      <a v-if="svgXML !== ''" class="btn btn-success"
        :href="'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgXML)"
        download="fody.svg">Download SVG</a>
      </div>
      <!-- 
      <pre>
        {{ queryData }}
      </pre>
      -->
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
    return {
      width: 0,
      height: 0,
      margin: {'top': 20, 'right': 52, 'bottom': 30, 'left': 40},
      baseQueryURL: '/api/events',  // base url for AJAJ service
      allowedSubs: {},  // allowed subqueries as returned from the backend
      svgXML: '',
      queryData: {'results': []},
      query: {
        timeres: '',
        after: '2017-01-01 00:00',
        before: (new Date()).toJSON().slice(0, 19),  // today
        subs: [{cond: '', value: ''}]
      },
      fpOptions: {
        onValueUpdate: null,
        // allowInput: true,
        enableTime: true
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

    this.getSubQueries()
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

      // once updated we have to clearout the old svgXML
      this.svgXML = ''
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
    loadStats: function () {
      // var today = (new Date()).toJSON().slice(0, 10)
      var url = this.baseQueryURL + '/stats?' +
        'time-observation_after=2016-03-01' +
        '&time-observation_before=' + this.query.before +
        '&timeres=' + this.query.timeres

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
    saveSVG: function () {
      // console.log('saveSVG called, resulting SVG:')
      var svg = document.getElementById('chart1')

      /* global XMLSerializer */
      /* eslint no-undef: "error" */
      /* eslint-env browser */
      var svgXML = (new XMLSerializer()).serializeToString(svg)
      // console.log(svgXML)
      this.svgXML = svgXML
    }
  }
}
</script>
