<template>
  <section class="content">
    <div class='row'>
      <div class='col-md-6 col-sm-6 col-xs-12'>
        <div class="info-box" v-if='lastTicketNumber' v-on:click='useLastTicket'>
          <span class='info-box-icon bg-aqua'><i class='fa fa-ticket'></i></span>
          <div class='info-box-content'>
            <span class='info-box-text'>recently send</span>
            <span class='info-box-number'>{{ lastTicketNumber }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="row center-block">
      <h2>Examine send CERT-Bund Report</h2>
      <div>
          Search for</br>
          Ticket#
      </div>
      <input
        v-model:title="ticketID"
        v-on:keyup.enter="lookupIDs"
        placeholder="20161020-10000004"
      >
    </div>

  <p v-if="eventIDs.length === 0">
    Not found.
  </p>

  <p v-if="eventIDs.length === 1">
    Found one event:
  </p>

  <p v-if="eventIDs.length > 1">
  Found {{ eventIDs.length }} events:
  </p>

  </section>
</template>

<script>
// only if needed:
// import $ from 'jquery'

module.exports = {
  name: 'Tickets',
  data: function () {
    return {
      queryURL: 'http://localhost:8000/',  // base url for AJAJ service
      ticketID: '',  // ticket to be examined
      eventIDs: [],  // list of corresponding ids for the ticket
      events: [],  // list of events details
      lastTicketNumber: '' // (approximately) the most recent server ticket#
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
            if (this.eventIDs.length < 50) {
              console.log('less than 50 events, triggering loading directly')
              this.loadDetails()
            }
          } else {
            this.eventIDs = []
            this.events = []
          }
        })
      }, (response) => {
        this.eventIDs = []
        this.events = []
      })
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
        })
      }, (response) => {
        // failure
        this.events = []
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
  },
  created: function () {
    this.getLastTicketNumber()
  }
}
</script>

<style>
</style>
