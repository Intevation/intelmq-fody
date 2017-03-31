<template>
  <!-- Main content -->
  <section class='content'>
    <!-- Info boxes -->
    <div class='row'>
      <div class='col-md-6 col-sm-6 col-xs-12'>
        <IBoxTicketsToday />
       </div>
      <!-- /.col -->
      <div class='col-md-6 col-sm-6 col-xs-12'>
        <IBoxEventsToday />
      </div>
      <!-- /.col -->
      <div class='col-md-6 col-sm-6 col-xs-12'>
        <router-link :to="{ path: 'tickets', query: { search: lastTicketNumber }}">
            <div class='info-box col-md-2 linked-info-box'>
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
        </router-link>
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
import IBoxTicketsToday from '../widgets/IBoxTicketsToday.vue'
import IBoxEventsToday from '../widgets/IBoxEventsToday.vue'

module.exports = {
  components: {
    IBoxTicketsToday,
    IBoxEventsToday
  },
  data: function () {
    return {
      lastTicketNumber: -1
    }
  },
  created: function () {
    this.getLastTicketNumber()
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
