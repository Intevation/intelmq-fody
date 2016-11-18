<template>
  <section class="content">
    <div class='row'>
      <div class='col-md-6 col-sm-6 col-xs-12'>
        <div class="info-box" v-if='lastTicketNumber' v-on:click='useLastTicket'>
          <span class='info-box-icon bg-aqua'><i class='fa fa-ticket'></i></span>
          <div class='info-box-content'>
            <span class='info-box-text'>recently sent</span>
            <span class='info-box-number'>{{ lastTicketNumber }}</span>
          </div>
        </div>
      </div>
    </div> <!-- /.row -->

    <div class='row'>
      <div class='col-xs-12'>
        <div class='box'>
          <div class='box-header with-border'>
            <h2>Examine sent CERT-Bund Report</h2>
          </div>

          <div class="box-body">
            <div class="forum-control" v-bind:class='ticketInputClass'>
              <div class="input-group">
                <span class="input-group-addon"><i class="fa fa-ticket"></span>
                <input class="form-control"
                  v-model:title="ticketID"
                  v-on:keyup.enter="lookupIDs"
                  placeholder="20161020-10000004"
                >
                <span class="input-group-addon"><i class="fa fa-search"></i></span>
              </div>
              <span class="help-block" v-if="eventIDs.length === 0">Not found.</span>
            </div>


            <p v-if="eventIDs.length === 1">
              Found one event.
            </p>

            <p v-if="eventIDs.length > 1">
            Found {{ eventIDs.length }} events.
            </p>

          </div>
        </div> <!-- .box -->
      </div> <!-- .col... -->
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
                <div class="col-sm-12">
                  <table aria-describedby="events_info" role="grid" id="events" class="table table-bordered table-striped dataTable">
                    <thead>
                      <tr role="row">
                        <th aria-label="Source IP: activate to sort column descending" aria-sort="ascending" style="width: 150px;" colspan="1" rowspan="1" aria-controls="events" tabindex="0" class="sorting_asc">Source IP</th>
                        <th aria-label="Source Port: activate to sort column ascending" style="width: 150px;" colspan="1" rowspan="1" aria-controls="events" tabindex="0" class="sorting">Source Port</th>
                        <th aria-label="Classfication Type: activate to sort column ascending" style="width: 182px;" colspan="1" rowspan="1" aria-controls="events" tabindex="0" class="sorting">Classification Type</th>
                        <th aria-label="Observation Time: activate to sort column ascending" style="width: 182px;" colspan="1" rowspan="1" aria-controls="events" tabindex="0" class="sorting">Observation Time</th>
                      </tr>
                    </thead>
                    <tbody>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colspan="1" rowspan="1">Source IP</th>
                        <th colspan="1" rowspan="1">Source Port</th>
                        <th colspan="1" rowspan="1">Classification Type</th>
                        <th colspan="1" rowspan="1">Observation Time</th>
                      </tr>
                    </tfoot>
                  </table>
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
      queryURL: 'http://localhost:8000/',  // base url for AJAJ service
      ticketID: '',  // ticket to be examined
      eventIDs: [],  // list of corresponding ids for the ticket
      events: [],  // list of events details
      lastTicketNumber: '', // (approximately) the most recent server ticket#
      eventsTable: {} // datatables object
    }
  },
  computed: {
    ticketInputClass: function () {
      return {
        'has-error': this.eventIDs.length === 0
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
            if (this.eventIDs.length < 100) {
              console.log('less than 100 events, triggering loading directly')
              this.loadDetails()
            }
          } else {
            this.eventIDs = []
            this.events = []
            this.updateEventsTable()
          }
        })
      }, (response) => {
        this.eventIDs = []
        this.events = []
        this.updateEventsTable()
      })
    },
    initEventsTable: function () {
      this.eventsTable = $('#events').DataTable()
    },
    updateEventsTable: function () {
      // loads the events into the datatable and triggers a redraw
      var r

      this.eventsTable.clear()
      this.eventsTable.search('')
      for (var e of this.events) {
        r = []
        for (var column of ['source.ip', 'source.port', 'classification.type', 'time.observation']) {
          if (e[column]) { r.push(e[column]) } else { r.push('') }
        }
        this.eventsTable.row.add(r)
      }
      this.eventsTable.draw()
    },
    loadDetails: function () {
      var url = this.queryURL + 'getEvents?'
      for (var i = 0, size = this.eventIDs.length; i < size; i++) {
        url += 'ids=' + this.eventIDs[i] + '&'
      }
      console.log('Trying to load ' + url)

      this.$http.get(url).then((response) => {
        // success
        console.log('Result: ' + response.body)
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

table.dataTable thead .sorting:after, table.dataTable thead .sorting_asc:after, table.dataTable thead .sorting_desc:after {
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
</style>
