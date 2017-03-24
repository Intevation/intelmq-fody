<template>
  <section class="content">
    <div class="row">
      <div class="col-md-12 col-sm-12">
        <h2>Events processed</h2>
        <!-- for SVG downloading to result in usable file we want
             the styling within each element as style attribute -->
        <svg id="chart1" width="100%" height="100%">
          <g style="transform: translate(0, 10px)">
            <path class="line" :d="line"
              style="fill: none; stroke: #76BF8A; stroke-width: 2px"/>
          </g>
        </svg>
      </div>

      <!-- using encodeURIComponent because IE and Firefox need this for
           non-base64 SVG and using base64 is even more cumbersome as it would
           require an encoding function that can deal with unicode (atob can't).
      -->
      <button v-if="svgXML === ''" class="btn btn-warning"
        v-on:click="saveSVG()">
        Prepare SVG Export
      </button>
      <a v-if="svgXML !== ''" class="btn btn-success"
        :href="'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgXML)"
        download="fody.svg">Download SVG</a>
    </div>
  </section>
</template>

<script>
import * as d3 from 'd3'

module.exports = {
  name: 'Stats',
  data: function () {
    return {
      baseQueryURL: '/api/stats',  // base url for AJAJ service
      data: [3, 12, 7, 11, 6, 18],
      line: '',
      svgXML: ''
    }
  },
  mounted: function () {
    this.calculateLine()
  },
  methods: {
    getScales: function () {
      const x = d3.scaleTime().range([0, 330])
      const y = d3.scaleLinear().range([200, 0])
      d3.axisLeft().scale(x)
      d3.axisBottom().scale(y)
      x.domain(d3.extent(this.data, (d, i) => i))
      y.domain([0, d3.max(this.data, d => d)])
      return {x, y}
    },
    calculateLine: function () {
      const scale = this.getScales()
      const path = d3.line()
        .x((d, i) => scale.x(i))
        .y(d => scale.y(d))
      this.line = path(this.data)
    },
    saveSVG: function () {
      console.log('saveSVG called, resulting SVG:')
      var svg = document.getElementById('chart1')

      /* global XMLSerializer */
      /* eslint no-undef: "error" */
      /* eslint-env browser */
      var svgXML = (new XMLSerializer()).serializeToString(svg)
      console.log(svgXML)
      this.svgXML = svgXML
    }
  }
}
</script>
