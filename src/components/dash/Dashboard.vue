<template>
  <!-- Main content -->
  <section class='content'>
    <!-- Info boxes -->
    <div class='row'>
      <div class='col-md-6 col-sm-6 col-xs-12'>
        <div class='info-box'>
          <span class='info-box-icon bg-aqua'><i class='fa fa-server'></i></span>

          <div class='info-box-content'>
            <span class='info-box-text'>Example CPU Traffic</span>
            <span class='info-box-number'>30<small>%</small></span>
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

    <div class='col-xs-12'>
      <div class="box">
        <div class="box-header with-border">
          <h3 class="box-title"></h3>
          <div class="box-body">
            <div class="col-sm-12 col-xs-12">
              <p class="text-center">
                <strong>Example Web Traffic Overview</strong>
              </p>
              <canvas id="trafficBar" ></canvas>
            </div>
          </div>
        </div>
        <small class="space"><b>Pro Tip:</b> Hover over the diagrams for more details!</small>
      </div>
    </div>
    <!-- /.row -->
  </section>
  <!-- /.content -->
</template>

<script>
import Chart from 'chart.js'

module.exports = {
  data: function () {
    return {
      generateRandomNumbers: function (numbers, max, min) {
        var a = []
        for (var i = 0; i < numbers; i++) {
          a.push(Math.floor(Math.random() * (max - min + 1)) + max)
        }
        return a
      }
    }
  },
  computed: {
    coPilotNumbers: function () {
      return this.generateRandomNumbers(12, 1000000, 10000)
    },
    personalNumbers: function () {
      return this.generateRandomNumbers(12, 1000000, 10000)
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      var ctx = document.getElementById('trafficBar').getContext('2d')
      var config = {
        type: 'line',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          datasets: [{
            label: 'Testdata',
            fill: false,
            borderColor: '#284184',
            pointBackgroundColor: '#284184',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: this.coPilotNumbers
          }, {
            label: 'Personal Site',
            borderColor: '#4BC0C0',
            pointBackgroundColor: '#4BC0C0',
            backgroundColor: 'rgba(0, 0, 0, 0)',
            data: this.personalNumbers
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          legend: {
            position: 'bottom',
            display: true
          },
          tooltips: {
            mode: 'label',
            xPadding: 10,
            yPadding: 10,
            bodySpacing: 10
          }
        }
      }

      new Chart(ctx, config) // eslint-disable-line no-new
    })
  }
}
</script>
<style>
.info-box {
  cursor: pointer;
}
.info-box-content {
  text-align: center;
  vertical-align: middle;
  display: inherit;
}
.fullCanvas {
  width: 100%;
}
</style>
