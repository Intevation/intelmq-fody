<template>
  <section class="content">
    <div class="row">
      <div class='col-xs-12'>
        <div class='box'>
          <div class='box-header with-border'>
            <h2>Search for ASN in ContactDB</h2>
          </div>

          <div class="box-body">
            <div class="forum-control" v-bind:class='ASNInputClass'>
              <div class="input-group">
                <span class="input-group-addon"><i class="fa fa-hdd-o"></i></span>
                <input class="form-control"
                  v-model:title="searchASN"
                  v-on:keyup.enter="lookupASN"
                  placeholder="20161020-10000004"
                >
                <span class="input-group-addon"><i class="fa fa-search"></i></span>
              </div>
              <span class="help-block" v-if="eventIDs.length === 0">
                Not found.
              </span>
              <span class="help-block" v-if="eventIDs.length === 1">
                Found one event.
              </span>
              <span class="help-block"  v-if="eventIDs.length > 1">
                Found {{ eventIDs.length }} events.
              </span>
            </div>
          </div> <!-- .box-body -->

        </div> <!-- .box -->
      </div> <!-- .col... -->
    </div> <!-- /.row -->
  </section>
</template>

<script>
// import $ from 'jquery'

module.exports = {
  name: 'Contacts',
  data: function () {
    return {
      searchASN: null,  // asn we are searching for
      manualOrgIDs: [], // entries we currently show
      autoOrgIDs: [], // entries we currently show
    }
  },
  computed: {
    ASNInputClass: function () {
      return {
        'has-error': false,
        'has-success': false
      }
    }
  },
  methods: {
    lookupASN: function () { }
  }
}
</script>

<style>
</style>
