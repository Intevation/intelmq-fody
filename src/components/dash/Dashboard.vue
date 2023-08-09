<template>
  <!-- Main content -->
  <section v-if="loggedIn" class='content'>
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
          <IBoxRecentlySentTicket class='linked-info-box' />
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
import { mapState } from 'vuex'
import IBoxTicketsToday from '../widgets/IBoxTicketsToday.vue'
import IBoxEventsToday from '../widgets/IBoxEventsToday.vue'
import IBoxRecentlySentTicket from '../widgets/IBoxRecentlySentTicket.vue'

export default {
  name: 'DashBoard',
  components: {
    IBoxTicketsToday,
    IBoxEventsToday,
    IBoxRecentlySentTicket
  },
  data: function () {
    return {
    }
  },
  computed: mapState(['lastTicketNumber', 'loggedIn'])
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
