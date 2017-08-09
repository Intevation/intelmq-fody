<template>
  <section class="content">
    <div class="row">
      <div class='col-md-4 col-sm-4 col-xs-12'>
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
        <!-- /.box -->
      </div>
      <!-- /.col -->
      <div class='col-md-4 col-sm-4 col-xs-12'>
        <IBoxTicketsToday />
       </div>
      <!-- /.col -->
      <div class='col-md-4 col-sm-4 col-xs-12'>
        <IBoxEventsToday />
      </div>
      <!-- /.col -->
    </div>
    <!-- ./box -->
    <div class="box">
        <div class="box-header with-border">
            <h3 class="box-title">Prepare Query</h3>
            <div class="box-body">
                <div class="col-sm-12 col-xs-12">
                    <div class="form-group row">
                        <label class="col-sm-4 col-form-label">{{ getTimeResParamLabels(this.mode)[0] }}</label>
                        <div class="col-sm-7">
                            <Flatpickr v-bind:options="fpOptions" v-model:value="query.after"
                                class="form-control"/>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-4 col-form-label">{{ getTimeResParamLabels(this.mode)[1] }}</label>
                        <div class="col-sm-7">
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
                            <div class="col-sm-7">
                                <input v-model.trim="sq.value" type="text" v-on:keyup.enter='loadStats' class="form-control" autofocus>
                            </div>
                            <span class="input-group-btn">
                                <button class="btn btn-default" v-on:click="removeFilter(index)">
                                    <i class="fa fa-times"></i>
                                </button>
                            </span>
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
    <!-- Area where some statistics are shown -->
    <div class="row">
        <div v-if='mode == "events"'>
            <div v-if="queryData.total > 0">
                <div class='col-md-5 col-sm-8 col-xs-12'>
                    <div class='info-box info-box col-md-3'>
                        <span class='info-box-icon bg-green'><i class='fa fa-server'></i></span>
                        <div class='info-box-content'>
                            <span class='info-box-text'>Events Total for this Query</span>
                            <span class='info-box-number'>
                                {{queryData.total}}
                            </span>
                             <div v-if="checkLoadingLimitStatus === 'auto'">
                                <span class='info-box-text'>Events loaded automatically</span>
                            </div>
                            <div v-else-if="checkLoadingLimitStatus === 'stop'">
                                <span class='info-box-text'>too much Events</span>
                            </div>
                            <div v-else-if="checkLoadingLimitStatus === 'ask'">
                                <button class="btn btn-default" v-on:click="loadEvents">
                                    Load Events?
                                </button>
                            </div> 
                            
                            <!-- ./ v-if -->
                            <!--
                            <div v-else>
                                <button class="btn btn-disabled">
                                    Load Events
                                </button>
                            </div>
                            -->
                            <!-- ./ v-else -->
                        </div>
                        <!-- /.info-box-content -->
                    </div>
                    <!-- /.info-box -->
                </div>
                <!-- ./col -->
              <div>
                  <button class="btn btn-success" v-on:click="exportTableData">
                      Export Table to CSV
                  </button>
              </div>
            </div>
            <!-- ./ v-if -->
        </div>
        <!-- ./ v-if -->
        <div v-if='mode == "tickets"'>
            <div v-if="queryData.total > 0">
                <div class='col-md-4 col-sm-4 col-xs-12'>
                    <div class='info-box info-box col-md-2'>
                        <span class='info-box-icon bg-green'><i class='fa fa-ticket'></i></span>
                        <div class='info-box-content'>
                            <span class='info-box-text'>Tickets Total for this Query</span>
                            <span class='info-box-number'>
                                {{queryData.total}}
                            </span>
                        </div>
                        <!-- /.info-box-content -->
                    </div>
                    <!-- /.info-box -->
                </div>
                <!-- ./col -->
            </div>
       </div>
    </div>
    <!-- ./row -->
    <!-- Area where Data might be shown -->
    <div class="row" v-if='mode == "events"'>
    <div class="col-md-12">
        <div class="box">
          <div class="box-header">
            <h3 class="box-title">Events</h3>
          </div>
          <!-- /.box-header -->
          <div class="box-body">
            <div class="dataTables_wrapper form-inline dt-bootstrap" id="events_wrapper">
              <div class="row">
                <div class="col-sm-6">
                  <div id="events_length" class="dataTables_length">

                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-sm-12 table-responsive">
                  <table id="events" class="display" width="100%"></table>
                </div>
              </div>
            </div>
          </div> <!-- .box-body -->
        </div> <!-- .box -->
      </div> <!-- .col... -->
    </div>
    <!-- ./row -->
    <!-- Area where Charts are shown -->
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
import $ from 'jquery'

import VueFlatpickr from 'vue-flatpickr'
import 'vue-flatpickr/theme/airbnb.css'

import IBoxTicketsToday from '../widgets/IBoxTicketsToday.vue'
import IBoxEventsToday from '../widgets/IBoxEventsToday.vue'

module.exports = {
  name: 'Stats',
  components: {
    'Flatpickr': VueFlatpickr,
    IBoxTicketsToday,
    IBoxEventsToday
  },
  data: function () {
    var beforeDate = new Date()
    var afterDate = new Date()

    beforeDate.setDate(beforeDate.getDate() + 1)
    afterDate.setMonth(afterDate.getMonth() - 1)

    afterDate = afterDate.toJSON().split('T')[0]
    beforeDate = beforeDate.toJSON().split('T')[0]

    return {
      width: 0,
      height: 0,
      margin: {'top': 20, 'right': 52, 'bottom': 30, 'left': 52},
      baseQueryURL: '',  // base url for AJAJ service
      eventsModeUrl: '/api/events',
      ticketsModeUrl: '/api/tickets',
      lastQueryURL: '',
      modeHeader: '',
      mode: '',
      checkLoadingLimitStatus: 'ask',
      allowedSubs: {},  // allowed subqueries as returned from the backend
      svgXML: '',  // SVG string for download
      dataCSV: '',  // CVS of data for download
      queryData: {}, // Data used for statistics
      eventData: {}, // Events
      eventsTable: null, // datatables object
      query: {
        timeres: 'hour',
        after: afterDate,
        before: beforeDate,
        subs: [{cond: 'source-ip_is', value: ''}]
      },
      fpOptions: {
        onValueUpdate: null,
        allowInput: true,
        time_24hr: true,
        enableTime: true,
        weekNumbers: true,
        maxDate: beforeDate
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
    removeFilter: function (cond) {
      this.query.subs[cond].cond = ''
    },
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
      if (this.queryData.timeres === 'hour') {
        return Math.floor(this.padded.width / 145)
      } else {
        return Math.floor(this.padded.width / 110)
      }
    },
    formatXTick: function () {
      // Needed for x-axis label and CSV export (see usage below).
      // Using UTC for simplicity (there is no simple javascript function
      // to get a timezone-shifted ISO 8601 style string and there is no
      // easy way to find out in which time zone the browser would want it
      // displayed in).
      if (this.queryData.timeres === 'hour') {
        return d => d.toISOString().slice(0, 10) + ' ' +
                    d.toISOString().slice(11, 16)
      } else {
        return d => d.toISOString().slice(0, 10)
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
      this.resetQueryData()
      this.update()
    },
    resetEventData: function () {
      this.eventData = {}
    },
    resetQueryData: function () {
      this.queryData = {
        results: [],
        total: -1,
        timeres: ''
      }
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
        return ['time-source_after', 'time-source_before']
      }
    },
    getTimeResParamLabels: function (mode) {
      if (mode === 'tickets') {
        return ['Sent after', 'Sent before']
      } else {
        return ['Time source after', 'Time source before']
      }
    },
    loadEvents: function () {
      var url = this.baseQueryURL + '/search?' +
        this.lastQueryURL
      this.$http.get(url).then((response) => {
        // got valid response
        response.json().then((value) => {
          // json parsed correctly
          if (value) {
            this.initEventsTable()
            // parse the date_trunc strings into Date objects
            this.eventData = value
            this.updateEventsTable()
          }
        })
      }, (response) => {
        // no valid response
        this.eventData = {}
        this.updateEventsTable()
      })
    },
    loadStats: function () {
      var qParams = this.getTimeResParams(this.mode)

      // Build a Query-URL so that other functions
      // will perform the SAME query.
      // add timeres later...
      this.lastQueryURL = qParams[0] + '=' + this.query.after +
        '&' + qParams[1] + '=' + this.query.before

      // add optional subqueries
      // we don't mind if some conditions appear several times
      this.lastQueryURL += '&' +
        this.query.subs
          .filter(q => q.cond !== '')
          .map(q => q.cond + '=' + q.value)
          .join('&')

      // now add timeres
      var url = this.baseQueryURL + '/stats?' +
        this.lastQueryURL +
        '&timeres=' + this.query.timeres

      this.$http.get(url).then((response) => {
        // got valid response
        response.json().then((value) => {
          // json parsed correctly
          if (value) {
            // parse the date_trunc strings into Date objects
            this.resetEventsTable()
            this.checkLoadingLimits(value.total)
            this.queryData = {
              total: value.total,
              timeres: value.timeres,
              results: value.results.map(d => {
                return {
                  count: d.count,
                  date_trunc: new Date(d.date_trunc)
                }
              })
            }
          } else {
            this.resetQueryData()
          }
        })
      }, (response) => {
        // no valid response
        this.resetQueryData()
      })

      if (this.mode === 'events') {
        this.destroyEventsTable()
      }
    },
    checkLoadingLimits: function (amount) {
      var lowerLimit = 1000
      var upperLimit = 100000

      if (amount < lowerLimit) {
        this.loadEvents()
        this.checkLoadingLimitStatus = 'auto'
      } else if ((amount >= lowerLimit) && (amount < upperLimit)) {
        this.checkLoadingLimitStatus = 'ask'
      } else {
        this.checkLoadingLimitStatus = 'stop'
      }
    },
    exportTableData: function () {
      // ensure beeing json
      var currentEventData = typeof this.eventData !== 'object' ? JSON.parse(this.eventData) : this.eventData

      var csvData = ''
      var row = ''

      // extract field names using 1st element
      for (var field in currentEventData[0]) {
        // concat comma seperated
        row += field + ','
      }

      // delete last comma
      row = row.slice(0, -1)
      // add line break
      csvData += row + '\r\n'

      // extract rows
      for (var i = 0; i < currentEventData.length; i++) {
        row = ''
        // extract and convert columns
        for (var index in currentEventData[i]) {
          if ((index === 'raw') && (currentEventData[i][index] !== null)) {
            // decode base64 value and replace all double quotes with double double quotes
            row += '"' + atob(currentEventData[i][index]).replace(/"/g, '""') + '",'
          } else if ((index === 'extra') && (currentEventData[i][index] !== null)) {
            // stringify json
            row += '"' + JSON.stringify(currentEventData[i][index]).replace(/"/g, '""') + '",'
          } else {
            // simply add value
            row += '"' + currentEventData[i][index] + '",'
          }
        }

        // remove last comma
        row.slice(0, row.length - 1)

        // line break after row
        csvData += row + '\r\n'
      }

      if ((csvData === '') || (csvData === null)) {
        alert('Invalid data')
        return
      }

      var fileName = 'export'
      var uri = 'data:text/csv;charset=utf-8,' + escape(csvData)
      var link = document.createElement('a')
      link.href = uri

      // hide it
      link.style = 'visibility:hidden'
      link.download = fileName + '.csv'

      // append and remove anchor tag
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    prepareDownloads: function () {
      var svg = document.getElementById('chart1')

      /* global XMLSerializer */
      /* eslint no-undef: "error" */
      /* eslint-env browser */
      var svgXML = (new XMLSerializer()).serializeToString(svg)
      this.svgXML = svgXML

      // we use d3.csvFormatRows() instead of d3.csvFormat() to be
      // able to explicitely transform the values into an ISO 8601 format
      // that libreoffice can read as a date (tested with libreoffice 5.2.7).
      // We still give the original Date object coerced as string in an
      // additional column for showing the timezone.
      var dateToUTC = this.formatXTick()
      this.dataCSV = d3.csvFormatRows([[
        'count', 'date_trunc_utc', 'date_trunc'
      ]].concat(this.queryData.results.map(d => {
        return [d.count, dateToUTC(d.date_trunc), d.date_trunc]
      })))
    },
    initEventsTable: function () {
      var that = this

      this.resetEventsTable()
      this.eventsTable = $('#events').DataTable({
        'data': [],
        'columns': [
          { 'visible': false },  // internal index to this.events array
          {
            'className': 'details-control',
            'orderable': false,
            'title': '',
            'defaultContent': ''
          },
          { 'title': 'time.source' },
          { 'title': 'classification.type' },
          { 'title': 'classification.identifier' },
          { 'title': 'feed.name' },
          { 'title': 'feed.provider' },
          { 'title': 'source.ip' },
          { 'title': 'source.asn' },
          { 'title': 'source.fqdn' },
          { 'title': 'source.port' },
          { 'title': 'source.revers_dns' },
          { 'title': 'destination.ip' },
          { 'title': 'destination.fqdn' },
          { 'title': 'destination.url' },
          { 'title': 'malware.name' },
          { 'title': 'rtir_report' },
          { 'title': 'rtir_investigation_id' }
        ],
        'order': [[0, 'desc'], [5, 'asc']]
      })

      $('#events tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr')
        var row = that.eventsTable.row(tr)

        if (row.child.isShown()) {
          // This row is already open - close it
          row.child.hide()
          tr.removeClass('shown')
        } else {
          // Open this row
          row.child(that.formatEventDetailRow(row.data())).show()
          tr.addClass('shown')
        }
      })
    },
    destroyEventsTable: function () {
      this.resetEventData()
      if (this.eventsTable) {
        this.updateEventsTable()
        this.eventsTable.destroy()
        this.eventsTable = null
      }
    },
    resetEventsTable: function () {
      if (this.eventsTable !== null) {
        this.eventsTable.clear()
      }
    },
    updateEventsTable: function () {
      // loads the events into the datatable and triggers a redraw
      var e, r
      this.resetEventsTable()
      this.eventsTable.search('')
      for (var i = 0; i < this.eventData.length; i++) {
        e = this.eventData[i]
        r = [i, '']  // first columns: internal index, child row expansion
        for (var column of ['time.source', 'classification.type', 'classification.identifier', 'feed.name', 'feed.provider', 'source.ip', 'source.asn', 'source.fqdn', 'source.port', 'source.reverse_dns', 'destination.ip', 'destination.fqdn', 'destination.url', 'malware.name', 'rtir_report_id', 'rtir_investigation_id']) {
          if (e[column]) { r.push(e[column]) } else { r.push('') }
        }
        this.eventsTable.row.add(r)
      }
      this.eventsTable.draw()
    },
    formatEventDetailRow: function (d) {
      var myEvent = this.eventData[d[0]]
      var div, currentRow
      var counter = 0

      div = document.createElement('div')
      div.classList.add('well')

      currentRow = document.createElement('div')
      currentRow.classList.add('row')

      for (var column of Object.keys(myEvent).sort()) {
        if (myEvent[column] !== null) {
          if (['time.source', 'classification.type', 'classification.identifier', 'feed.name', 'feed.provider', 'source.ip', 'source.asn', 'source.fqdn', 'source.port', 'source.reverse_dns', 'destination.ip', 'destination.fqdn', 'destination.url', 'malware.name', 'rtir_report_id', 'rtir_investigation_id'].indexOf(column) === -1) {
            // mod calculation used for number of columns within details
            if (counter > 0 && counter % 2 === 0) {
              div.appendChild(currentRow)
              currentRow = document.createElement('div')
              currentRow.classList.add('row')
            }
            var el = document.createElement('div')
            var c = document.createElement('strong')
            var v
            if (column === 'raw') {
              v = document.createElement('span')
              v.textContent = atob(myEvent[column])
            } else if (column === 'extra') {
              v = document.createElement('span')
              v.textContent = JSON.stringify(myEvent[column])
            } else {
              v = document.createElement('span')
              v.textContent = myEvent[column]
            }

            el.classList.add('child-row-el', 'col-md-4', 'col-sm-6', 'col-xs-12')
            c.textContent = column + ': '
            el.appendChild(c)
            el.appendChild(v)
            currentRow.appendChild(el)
            counter++
          }
        }
      }
      div.appendChild(currentRow)

      return div
    }
  }
}
</script>
<style>
/* Using the bootstrap style, but overriding the font to not draw in
   the Glyphicons Halflings font as an additional requirement for sorting icons.

   An alternative to the solution active below is to use the jquery style
   which uses images, but the color on the images does not match adminlte.

@import url('/static/js/plugins/datatables/jquery.dataTables.min.css');
*/
@import url('/static/js/plugins/datatables/dataTables.bootstrap.css');

table.dataTable thead > tr > th {
  text-align: right;
  padding-left: 2px;
  padding-right: 14px;
}

table.dataTable td {
  text-align: right;
}

table.dataTable thead .sorting:after, table.dataTable thead .sorting_asc:after, table.dataTable thead .sorting_desc:after {
  top: 2px;
  right: 0px;
  font-family: 'FontAwesome';
}

table.dataTable thead .sorting:after {
  content: "\f0dc";
}

table.dataTable thead .sorting_asc:after {
  content: "\f0dd";
}

table.dataTable thead .sorting_desc:after {
  content: "\f0de";
}

td.details-control::after {
  cursor: pointer;
  font-family: 'FontAwesome';
  content: "\f196";
}

tr.shown td.details-control::after {
  content: "\f147";
}

div.child-row-el {
  text-align: left;
}

</style>
