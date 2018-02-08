<template>
  <section class="content">
    <div class='row'>
      <div class='col-md-6 col-sm-6 col-xs-12'>
        <div class='box'>
          <div class='box-header'>
            <h2>Examine Ticket</h2>
          </div>
          <div class="box-body">
            <div v-bind:class='ticketInputClass'>
              <div class="input-group input-group-sm">
                <span class="input-group-addon">
                    <i class="fa fa-ticket"></i>
                </span>
                <input type="text" class="form-control"
                  v-model:title="ticketID"
                  v-on:change="lookupIDs"
                  placeholder="20161020-10000004"
                >
                <span class="input-group-btn">
                <button class="btn btn-default" v-on:click="lookupIDs">
                  <i class="fa fa-search"></i>
                </button>
                </span>
              </div>
              <span class="help-block" v-if="eventIDs.length === 0">
                Not found.
              </span>
              <span class="help-block" v-if="eventIDs.length === 1">
                Found one event.
              </span>
              <span class="help-block"  v-if="eventIDs.length > 1">
                Found {{ eventIDs.length }} events.
              </span>
            </div>
          </div> <!-- .box-body -->
        </div> <!-- .box -->
      </div> <!-- .col... -->
      <div class='col-md-6 col-sm-6 col-xs-12'>
        <div v-if="searchedForID === null">
        <div class='info-box linked-info-box col-md-2' v-on:click='useLastTicket'>
          <span class='info-box-icon bg-aqua'><i class='fa fa-ticket'></i></span>

          <div class='info-box-content'>
            <span class='info-box-text'>Recently sent</span>
            <span class='info-box-number'>
                <div v-if="lastTicketNumber != -1">
                    {{ lastTicketNumber }}
                </div>
                <div v-else>
                    Loading...
                </div>
            </span>
          </div>
        </div>
        </div>
        <div v-else>
        <div class='info-box col-md-2'>
          <span class='info-box-icon bg-green'><i class='fa fa-ticket'></i></span>

          <div class='info-box-content'>
            <span class='info-box-text'>Currently showing</span>
            <span class='info-box-number'>
                <div v-if="searchedForID != null">
                    {{ searchedForID }}
                </div>
                <div v-else>
                    Error...
                </div>
            </span>
          </div>
        </div>
        </div>
      </div>
      <div class='col-md-6 col-sm-6 col-xs-12'  v-if="recipient">
        <router-link :to="{ path: 'contacts', query: { email: recipient.recipient_address }}">
        <div class='info-box linked-info-box col-md-2'>
          <span class='info-box-icon bg-green'><i class='fa fa-user'></i></span>

          <div class='info-box-content'>
            <span class='info-box-text'>Recipient</span>
            <span class='info-box-text'>
                <div>
                    <p>
                    Sent to: <strong>{{ recipient.recipient_address }}</strong>
                    </p>
                    As {{ (recipient.notification_format  || 'unknown format') }} format at
                    {{ ( recipient.sent_at || 'unknown time') }} by {{ ( recipient.medium || 'unknown medium') }}.
                </div>
            </span>
          </div>
        </div>
        </router-link>
      </div>

    </div> <!-- /.row -->

    <div class="row">
    <!--
    <div class="row" v-if="eventIDs.length > 0 && events.length > 0">
    -->
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
    </div> <!-- .row -->

  </section>
</template>

<script>
import $ from 'jquery'

require('datatables.net')
require('datatables.net-bs')

module.exports = {
  name: 'Tickets',
  data: function () {
    return {
      queryURL: '/api/checkticket/',  // base url for AJAJ service
      ticketID: '',  // ticket to be examined, not searched yet
      searchedForID: null, // this ticket has been searched for
      eventIDs: [],  // list of cosrresponding ids for the ticket
      events: [],  // list of events details
      lastTicketNumber: -1, // (approximately) the most recent server ticket#
      eventsTable: {}, // datatables object
      recipient: null // Information on the Receiver of the ticket
    }
  },
  computed: {
    ticketInputClass: function () {
      return {
        'has-error': this.eventIDs.length === 0,
        'has-success': this.eventIDs.length > 0
      }
    }
  },
  methods: {
    lookupIDs: function () {
      this.ticketID = this.ticketID.trim()
      var url = this.queryURL + 'getEventIDsForTicket?ticket=' + this.ticketID
      this.$http.get(url).then((response) => {
        response.json().then((value) => {
          if (value) {
            this.eventIDs = value
            this.events = []
            // directly load events, if we only have a few
            if (this.eventIDs.length < 20000) {
              console.log('less than 20000 events, triggering loading directly')
              this.loadDetails()
            }
          } else {
            this.eventIDs = []
            this.events = []
            this.updateEventsTable()
          }
          this.searchedForID = this.ticketID
          this.loadReceiver(this.ticketID)
        })
      }, (response) => {
        this.eventIDs = []
        this.events = []
        this.updateEventsTable()
        this.recipient = null
        this.searchedForID = null
      })
    },
    loadReceiver: function (ticket) {
      var url = '/api/tickets/getRecipient?ticketnumber=' + this.ticketID
      this.$http.get(url).then((response) => {
        response.json().then((value) => {
          if (value) {
            this.recipient = value[0] // There should always be only one!
          }
        })
      }, (response) => {
        this.recipient = null
      })
    },
    formatEventDetailRow: function (d) {
      var myEvent = this.events[d[0]]
      var div, currentRow
      var counter = 0

      div = document.createElement('div')
      div.classList.add('well')

      currentRow = document.createElement('div')
      currentRow.classList.add('row')

      for (var column of Object.keys(myEvent).sort()) {
        if (['raw', 'source.ip', 'source.port', 'classification.type',
          'time.observation', 'extra'].indexOf(column) === -1
          ) {
          if (counter > 0 && counter % 6 === 0) {
            div.appendChild(currentRow)
            currentRow = document.createElement('div')
            currentRow.classList.add('row')
          }

          currentRow.appendChild(
            this.formatEventDetailRowElement(
              ['col-md-4', 'col-sm-6', 'col-xs-12'],
                column, myEvent[column]
              )
          )
          counter++
        }
      }
      div.appendChild(currentRow)
      // place field `extra` in a row of its own
      if (myEvent.hasOwnProperty('extra')) {
        currentRow = document.createElement('div')
        currentRow.classList.add('row')
        currentRow.appendChild(
          this.formatEventDetailRowElement(
            ['col-md-12', 'col-sm-12', 'col-xs-12'],
              'extra', JSON.stringify(myEvent['extra'])
            )
        )
        div.appendChild(currentRow)
      }
      return div
    },
    formatEventDetailRowElement: function (additionalClassList, name, text) {
      var el = document.createElement('div')
      var c = document.createElement('strong')
      var v = document.createElement('span')

      el.classList.add('child-row-el')
      for (var i of additionalClassList) {
        el.classList.add(i)
      }
      c.textContent = name + ': '
      el.appendChild(c)
      v.textContent = text
      el.appendChild(v)

      return el
    },
    initEventsTable: function () {
      var that = this

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
          { 'title': 'Source IP' },
          { 'title': 'Source Port' },
          { 'title': 'Classification Type' },
          { 'title': 'Observation Time' }
        ],
        'order': [[2, 'asc']]
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
    updateEventsTable: function () {
      // loads the events into the datatable and triggers a redraw
      var e, r

      this.eventsTable.clear()
      this.eventsTable.search('')
      for (var i = 0; i < this.events.length; i++) {
        e = this.events[i]
        r = [i, '']  // first columns: internal index, child row expansion
        for (var column of ['source.ip', 'source.port', 'classification.type', 'time.observation']) {
          if (e[column]) { r.push(e[column]) } else { r.push('') }
        }
        this.eventsTable.row.add(r)
      }
      this.eventsTable.draw()
    },
    loadDetails: function () {
      var url = this.queryURL + 'getEventsForTicket?ticket=' + this.ticketID
      // URL could also be '/api/tickets/search?ticketnumber=' + this.ticketID
      this.$http.get(url).then((response) => {
        // success
        response.json().then((value) => {
          this.events = value
          this.updateEventsTable()
        })
      }, (response) => {
        // failure
        this.events = []
        this.updateEventsTable()
      })
    },
    getLastTicketNumber: function () {
      var url = this.queryURL + 'getLastTicketNumber'
      this.$http.get(url).then((response) => {
        // success
        response.json().then((value) => {
          this.lastTicketNumber = value
        })
      }, (response) => {
        // failure
        this.events = []
      })
    },
    useLastTicket: function () {
      this.ticketID = this.lastTicketNumber
      this.lookupIDs()
    }
  },  // methods
  mounted: function () {
    this.$nextTick(function () {
      this.initEventsTable()
    })
  },
  created: function () {
    this.getLastTicketNumber()
    // If the page was called with ?search=
    // Start searching for the given parameter immediately
    // and display the tickets
    if (this.$route.query.search) {
      this.ticketID = this.$route.query.search
      this.lookupIDs()
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
