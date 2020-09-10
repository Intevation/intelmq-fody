<template>
    <div class='info-box col-md-2'>
        <span class='info-box-icon bg-aqua'><i class='fa fa-ticket'></i></span>
        <div class='info-box-content'>
            <span class='info-box-text'>Recently sent</span>
            <span class='info-box-number'>
              <div v-if="lastTicketNumber != -1" v-bind:class="textClass">
                    {{ lastTicketNumber }}
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
import { mapState } from 'vuex'
module.exports = {
  name: 'recently-sent',
  data: function () {
    return {
    }
  },
  computed: {
    textClass: function () {
      return { 'text-warning': this.lastTicketNumber.startsWith('Error')
      }
    },
    ...mapState(['lastTicketNumber'])
  },
  created: function () {
    this.getLastTicketNumber()
  },
  methods: {
    getLastTicketNumber: function () {
      this.$store.commit('SET_LASTTICKETNUMBER', -1)
      console.log(this.lastTicketNumber)
      console.log(this.lastTicketNumber === -1)
      var url = '/api/checkticket/getLastTicketNumber'
      this.$http.get(url).then((response) => {
        // success
        response.json().then((value) => {
          this.$store.commit('SET_LASTTICKETNUMBER', value)
        })
      }, (response) => {
        // failure
        if (response.status === 0) {
          this.$store.commit('SET_LASTTICKETNUMBER',
                             'Error: Failed to connect properly.')
        } else {
          response.text().then((bodyText) => {
            let errmsg = 'Error ' + response.status + ': ' + bodyText
            this.$store.commit('SET_LASTTICKETNUMBER', errmsg)
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
