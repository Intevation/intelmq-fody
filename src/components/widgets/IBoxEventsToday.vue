<template>
    <div class='info-box info-box col-md-2'>
        <span class='info-box-icon bg-aqua'><i class='fa fa-server'></i></span>
        <div class='info-box-content'>
            <span class='info-box-text'>Events today</span>
            <span class='info-box-number'>
                <div v-if="events >= 0">
                    {{ events }}
                </div>
                <div v-else>
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
  name: 'events-today',
  data: function () {
    return {
      events: -1
    }
  },
  created: function () {
    this.eventsToday()
  },
  methods: {
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