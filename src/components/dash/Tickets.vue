<template>
  <section class="content">
    <div class='row'>
      <div class='col-md-4 col-sm-4 col-xs-12'>
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
              <span class="help-block" v-if="eventsErrorMsg !== ''">
                {{ eventsErrorMsg }}
              </span>
              <span class="help-block"
                  v-else-if="eventIDs.length === 0 && ticketID !== ''">
                Not found.
              </span>
              <span class="help-block" v-if="eventIDs.length === 1">
                Found one event.
              </span>
              <span class="help-block"
                  v-if="eventIDs.length > 1 && eventIDs.length <= loadingLimit">
                Found {{ eventIDs.length }} events.
              </span>
              <span class="help-block"
                  v-if="eventIDs.length > loadingLimit">
                Found {{ eventIDs.length }} events.
                (Only showing details of {{ loadingLimit }} events
                for performance reasons.)
              </span>
            </div>
          </div> <!-- .box-body -->
        </div> <!-- .box -->
      </div> <!-- .col... -->
      <div class='col-md-6 col-sm-8 col-xs-12'>
        <div v-if="searchedForID === null">
          <div v-on:click='useLastTicket'>
            <IBoxRecentlySentTicket class='linked-info-box' />
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
      <div v-if="recipient || recipientErrorMsg !==''"
           class='col-md-6 col-sm-8 col-xs-12'>
        <router-link :to="{ path: 'contacts', query: { email: recipient? recipient.recipient_address:'' }}">
        <div class='info-box linked-info-box col-md-2'>
          <span class='info-box-icon' :class="recipientIconClass"
            ><i class='fa fa-user'></i>
          </span>
          <div class='info-box-content'>
            <table v-if="recipient" class='info-box-table'>
              <tr> <th>To:</th>
                <td><strong>{{ recipient.recipient_address }}</strong></td>
              </tr>
              <tr v-if="recipientGroup">
                <th>Recipient Group:</th>
                <td>{{ recipientGroup }}</td>
              </tr>
              <tr> <th>Date:</th>
                <td> {{ ( formatDateString(recipient.sent_at) || 'unknown') }}
                   </td>
              </tr>
              <tr> <th>Format:</th>
                   <td>{{ (recipient.notification_format || 'unknown' )
                     }}/{{ (recipient.event_data_format || 'unknown' ) }}
                   </td>
              </tr>
              <tr> <th>Medium:</th>
                <td>{{ (recipient.medium || 'unknown' ) }}</td>
              </tr>
            </table>
            <div v-else class="info-box-text text-warning">
              {{ recipientErrorMsg}}
            </div>
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
            <div v-if="eventsDetailsErrorMsg !== ''"
                class="alert alert-danger">
              {{ eventsDetailsErrorMsg }}
            </div>
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

import { mapState } from 'vuex'

import { errorMixin } from '../../mixins/errorHelper.js'
import IBoxRecentlySentTicket from '../widgets/IBoxRecentlySentTicket.vue'

module.exports = {
  name: 'Tickets',
  components: {
    IBoxRecentlySentTicket
  },
  data: function () {
    return {
      queryURL: '/api/checkticket/',  // base url for AJAJ service
      loadingLimit: 10000,  // max number of events which details will be shown
      ticketID: '',  // ticket to be examined, not searched yet
      searchedForID: null, // this ticket has been searched for
      eventIDs: [],  // list of corresponding ids for the ticket
      eventsErrorMsg: '', // has string if the lookupIDs() AJAJ call failed
      events: [],  // list of events details
      eventsDetailsErrorMsg: '', // has string if loadDetails() AJAJ call failed
      eventsTable: {}, // datatables object
      recipient: null, // information on the receiver of the ticket
      recipientErrorMsg: '' // has string if loadReceiver() AJAJ call failed
    }
  },
  computed: {
    ticketInputClass: function () {
      return {
        'has-error': this.eventsErrorMsg !== '',
        'has-warning': this.eventsErrorMsg === '' &&
                       this.eventIDs.length === 0 &&
                       this.ticketID !== '',
        'has-success': this.eventIDs.length > 0
      }
    },
    recipientIconClass: function () {
      return { 'bg-green': this.recipient }
    },
    recipientGroup: function () {
      if (this.recipient && 'aggregate_identifier' in this.recipient) {
        for (const identifier of this.recipient['aggregate_identifier']) {
          if (identifier[0] === 'recipient_group') {
            return identifier[1]
          }
        }
      }
      return null
    },
    ...mapState(['lastTicketNumber'])
  },
  mixins: [errorMixin],  // adds method setErrorMsg()
  methods: {
    lookupIDs: function () {
      this.ticketID = this.ticketID.trim()
      this.eventsErrorMsg = ''
      var url = this.queryURL + 'getEventIDsForTicket?ticket=' + this.ticketID
      this.$http.get(url).then((response) => {
        response.json().then((value) => {
          if (value) {
            this.eventIDs = value
            this.events = []
            this.loadDetails()
          } else {
            this.eventIDs = []
            this.events = []
            this.updateEventsTable()
          }
          this.searchedForID = this.ticketID
          this.loadReceiver()
        })
      }, (response) => {
        // failure
        this.eventIDs = []
        this.events = []
        this.updateEventsTable()
        this.recipient = null
        this.searchedForID = null
        this.setErrorMsg(response, 'eventsErrorMsg')
      })
    },
    loadReceiver: function () {
      this.recipientErrorMsg = ''
      var url = '/api/tickets/getRecipient?ticketnumber=' + this.ticketID
      this.$http.get(url).then((response) => {
        response.json().then((value) => {
          if (value) {
            this.recipient = value[0] // There should always be only one!
          }
        })
      }, (response) => {
        this.recipient = null
        this.setErrorMsg(response, 'recipientErrorMsg')
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
      this.eventsDetailsErrorMsg = ''
      var url = (this.queryURL + 'getEventsForTicket?ticket=' + this.ticketID +
                 '&limit=' + this.loadingLimit)
      // the following endpoint may give similiar results (without limit)
      // url = '/api/tickets/search?ticketnumber=' + this.ticketID
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
        this.setErrorMsg(response, 'eventsDetailsErrorMsg')
      })
    },
    useLastTicket: function () {
      this.ticketID = this.lastTicketNumber
      this.lookupIDs()
    },
    formatDateString: function (str) {
      // we use Date's parsing as we are with ES5
      var isostr = (new Date(str)).toISOString()
      // we want 'YYYY-MM-DD HH:mm:ss UTC'
      // assume that we always get the 24 character result from toISOString()
      return isostr.substring(0, 10) + ' ' + isostr.substring(11, 19) + ' UTC'
    }
  },  // methods
  mounted: function () {
    this.$nextTick(function () {
      this.initEventsTable()
    })
  },
  created: function () {
    // If the page was called with ?search=
    // start searching for the given parameter immediately
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

table.info-box-table {
  margin: 0 auto;
}

table.info-box-table td {
  padding-left: 5px;
  text-align: left;
}

div.child-row-el {
  text-align: left;
}

</style>
