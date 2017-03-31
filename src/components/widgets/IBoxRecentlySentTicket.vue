<template>
    <div class='info-box col-md-2'>
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
        <!-- /.info-box-content -->
    </div>
    <!-- /.info-box -->
</template>

<script>
module.exports = {
  name: 'recently-sent',
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