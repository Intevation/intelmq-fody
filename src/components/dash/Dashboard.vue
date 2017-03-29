<template>
  <!-- Main content -->
  <section class='content'>
    <!-- Info boxes -->
    <div class='row'>
      <div class='col-md-6 col-sm-6 col-xs-12'>
        <div class='info-box col-md-2'>
          <span class='info-box-icon bg-aqua'><i class='fa fa-ticket'></i></span>

          <div class='info-box-content'>
            <span class='info-box-text'>Tickets today:</span>
            <span class='info-box-number'>{{ tickets }}</span>
          </div>
          <!-- /.info-box-content -->
        </div>
        <!-- /.info-box -->
       </div>
      <!-- /.col -->
      <div class='col-md-6 col-sm-6 col-xs-12'>
        <div class='info-box info-box col-md-2'>
          <span class='info-box-icon bg-aqua'><i class='fa fa-server'></i></span>

          <div class='info-box-content'>
            <span class='info-box-text'>Events today:</span>
            <span class='info-box-number'>{{ events }}</span>
          </div>
          <!-- /.info-box-content -->
        </div>
        <!-- /.info-box -->
      </div>
      <!-- /.col -->
      <div class='col-md-6 col-sm-6 col-xs-12'>
        <div class='info-box col-md-2'>
          <span class='info-box-icon bg-aqua'><i class='fa fa-ticket'></i></span>

          <div class='info-box-content'>
            <span class='info-box-text'>recently sent</span>
            <span class='info-box-number'>{{ lastTicketNumber }}</span>
          </div>
          <!-- /.info-box-content -->
        </div>
        <!-- /.info-box -->
       </div>
      <!-- /.col -->


      <!-- fix for small devices only -->
      <div class='clearfix visible-sm-block'></div>

    </div>
    <!-- /.row -->
  </section>
  <!-- /.content -->
</template>

<script>
module.exports = {
  data: function () {
    return {
      tickets: -1,
      events: -1,
      lastTicketNumber: -1
    }
  },
  created: function () {
    this.getLastTicketNumber()
    this.ticketsToday()
    this.eventsToday()
  },
  methods: {
    getLastTicketNumber: function () {
      var url = '/api/checkticket/getLastTicketNumber'
      this.$http.get(url).then((response) => {
        // success
        response.json().then((value) => {
          this.lastTicketNumber = value
        })
      }, (response) => {
        // failure
        this.lastTicketNumber = 'error'
      })
    },
    ticketsToday: function () {
       // show the amount of todays Tickets
      var tomorrow = new Date()
      var today = new Date()

      tomorrow.setDate(tomorrow.getDate() + 1)

      today = today.toJSON().split('T')[0]
      tomorrow = tomorrow.toJSON().split('T')[0]

      // show the amount of todays Tickets
      var url = '/api/tickets/stats?' +
          'sent-at_after=' + today +
          '&sent-at_before=' + tomorrow

      this.$http.get(url).then((response) => {
        // got valid response
        response.json().then((value) => {
          // json parsed correctly
          if (value) {
          // parse the date_trunc strings into Date objects
            this.tickets = value['total']
          }
        })
      }, (response) => {
        this.tickets = 'error'
      })
    },
    eventsToday: function () {
      // show the amount of todays Events
      var tomorrow = new Date()
      var today = new Date()

      tomorrow.setDate(tomorrow.getDate() + 1)

      today = today.toJSON().split('T')[0]
      tomorrow = tomorrow.toJSON().split('T')[0]

      // show the amount of todays Tickets
      var url = '/api/events/stats?' +
          'time-observation_after=' + today +
          '&time-observation_before=' + tomorrow

      this.$http.get(url).then((response) => {
        // got valid response
        response.json().then((value) => {
          // json parsed correctly
          if (value) {
          // parse the date_trunc strings into Date objects
            this.events = value['total']
          }
        })
      }, (response) => {
        this.events = 'error'
      })
    }
  }
}
</script>
<style>
/*.info-box {
  cursor: pointer;
}*/
.info-box-content {
  text-align: center;
  vertical-align: middle;
  display: inherit;
}
</style>
