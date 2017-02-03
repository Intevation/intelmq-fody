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
                  v-model.lazy:title="searchASN"
                  v-on:change="lookupASN"
                  placeholder="1853"
                >
                <span class="input-group-addon"><i class="fa fa-search"></i></span>
              </div>
              <span v-if="searchASN !== ''">
              <span class="help-block" v-if="autoOrgIDs.length === 0">
                No auto-imported organisation found.
              </span>
              <span class="help-block" v-if="autoOrgIDs.length === 1">
                Found one auto-imporated organisation.
              </span>
              <span class="help-block"  v-if="manualOrgIDs.length > 1">
                Found {{ autoOrgIDs.length }} auto-imported organisations.
              </span>
              </span>
            </div>
          </div> <!-- .box-body -->

          <ul>
             <org-card status="manual" v-for="orgid in manualOrgIDs" v-bind:id="orgid"></org-card>
             <org-card status="auto" v-for="orgid in autoOrgIDs" v-bind:id="orgid"></org-card>
          </ul>

        </div> <!-- .box -->
      </div> <!-- .col... -->
    </div> <!-- /.row -->
  </section>
</template>

<script>
// import $ from 'jquery'

// A vue component for displaying one organisation
var OrgCard = {
  props: ['id', 'status'],
  template: '<li> OrgID: {{ id }} Status: {{status}}</li>'
}

module.exports = {
  name: 'Contacts',
  data: function () {
    return {
      searchASN: '',  // asn we are searching for
      manualOrgIDs: [], // entries we currently show
      autoOrgIDs: [], // entries we currently show
      pendingOrgIDs: [] // entries we currently edit
    }
  },
  components: {
    'org-card': OrgCard
  },
  computed: {
    ASNInputClass: function () {
      return {
        'has-error': (this.searchASN !== '' &&
                      this.manualOrgIDs.length + this.autoOrgIDs.length === 0),
        'has-success': (this.searchASN !== '' &&
                        this.manualOrgIDs.length + this.autoOrgIDs.length > 0)
      }
    }
  },
  methods: {
    lookupASN: function () {
      // FUTURE: we need some debounce or throttle function here
      // TODO: replace those manual testing values with a real search
      this.manualOrgIDs = [1, 23]
      this.autoOrgIDs = [23, 456]
    }
  }
}
</script>

<style>
</style>
