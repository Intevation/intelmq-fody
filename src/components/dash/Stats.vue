<template>
  <section class="content">
    <div class="row">
      <div class="col-md-12 col-sm-12" id="chart_container">
        <button class="btn btn-default" v-on:click="loadStats">
          Load data
        </button>
        <h2>Events processed</h2>
        <!-- for SVG downloading to result in usable file we want
             the styling within each element as style attribute -->
        <svg id="chart1" v-bind:width="width" v-bind:height="height">
          <g style="transform: translate(0, 10px)"> <!-- margins left, top -->
            <path class="line" :d="line"
              style="fill: none; stroke: #76BF8A; stroke-width: 2px"/>
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
      <pre>
        {{ queryData }}
      </pre>
    </div>
  </section>
</template>

<script>
import * as d3 from 'd3'

module.exports = {
  name: 'Stats',
  data: function () {
    return {
      width: 0,
      height: 0,
      baseQueryURL: '/api/events',  // base url for AJAJ service
      data: [3, 12, 7, 11, 6, 18],
      line: '',
      svgXML: '',
      queryData: {}
    }
  },
  mounted: function () {
    window.addEventListener('resize', this.onResize)
    this.onResize()  // initialize size and chart on first mount
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.onResize)
  },
  watch: {
    width: function widthChanged () {
      this.initialize()
    }
  },
  methods: {
    onResize: function () {
      this.width = document.getElementById('chart_container').offsetWidth
      this.height = this.width / 1.61803 // golden ratio
    },
    getScales: function () {
      const x = d3.scaleTime().range([0, this.width])
      const y = d3.scaleLinear().range([this.height, 0])
      d3.axisLeft().scale(x)
      d3.axisBottom().scale(y)
      x.domain(d3.extent(this.data, (d, i) => i))
      y.domain([0, d3.max(this.data, d => d)])
      return {x, y}
    },
    initialize: function () {
      const scale = this.getScales()
      const path = d3.line()
        .x((d, i) => scale.x(i))
        .y(d => scale.y(d))
      this.line = path(this.data)
    },
    loadStats: function () {
      var today = (new Date()).toJSON().slice(0, 10)
      var url = this.baseQueryURL + '/stats?' +
        'time-observation_after=2016-03-01' +
        '&time-observation_before=' + today + '&timeres=day'

      this.$http.get(url).then((response) => {
        // got valid response
        response.json().then((value) => {
          // json parsed correctly
          if (value) {
            this.queryData = value
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
