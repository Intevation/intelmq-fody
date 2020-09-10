<template>
    <div class='info-box col-md-2'>
        <span class='info-box-icon bg-aqua'><i class='fa fa-ticket'></i></span>
        <div class='info-box-content'>
            <span class='info-box-text'>Tickets today</span>
            <span class='info-box-number'>
                <div v-if="tickets != -1" v-bind:class="textClass">
                    {{ tickets }}
                </div>
                <div v-else class="text-info">
                    Loading...
                </div>
            </span>
        </div>
        <!-- /.info-box-content -->
    </div>
    <!-- /.info-box -->
</template>

<script>
module.exports = {
  name: 'tickets-today',
  data: function () {
    return {
      tickets: -1
    }
  },
  computed: {
    textClass: function () {
      return { 'text-warning': String(this.tickets).startsWith('Error')
      }
    }
  },
  created: function () {
    this.ticketsToday()
  },
  methods: {
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

      this.tickets = -1 // loading (if this function is called a second time)
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
        // failure
        if (response.status === 0) {
          this.tickets = 'Error: Failed to connect properly.'
        } else {
          response.text().then((bodyText) => {
            this.tickets = 'Error ' + response.status + ': ' + bodyText
          })
        }
      })
    }
  }
}
</script>
<style>
.linked-info-box {
  cursor: pointer;
  color: rgb(51, 51, 51);
}
.info-box-content {
  text-align: center;
  vertical-align: middle;
  display: inherit;
}
</style>
