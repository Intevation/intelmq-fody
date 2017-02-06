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
      baseQueryURL: '/api/contactdb',  // base url for AJAJ service
      searchASN: '',  // asn we are searching for
      manualOrgIDs: [], // list of ids of manual orgs we currently show
      autoOrgIDs: [], // list of ids of auto entries we currently show
      autoOrgs: [], // list of auto entries itself
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
  watch: {
    autoOrgIDs: function (newAutoOrgIDs) {
      for (var index in newAutoOrgIDs) {
        this.lookupOrg(this.autoOrgs, index)
      }
    }
  },
  methods: {
    lookupASN: function () {
      // fixes testing values with out AJAJ request:
      // this.manualOrgIDs = [1, 23]
      // this.autoOrgIDs = [23, 456]

      // FUTURE: we may need some debounce or throttle function here
      var url = this.baseQueryURL + '/searchasn?asn=' + this.searchASN
      this.$http.get(url).then((response) => {
        // got a valid response
        response.json().then((value) => {
          // json parsed correctly
          if (value) {
            this.autoOrgIDs = value['auto']
            this.manualOrgIDs = value['manual']
          } else {
            this.autoOrgIDs = []
            this.manualOrgIDs = []
          }
        })
      }, (response) => {
        // no valid response
        this.autoOrgIDs = []
        this.manualOrgIDs = []
      })
    },
    lookupOrg: function (orgList, index) {
      // TODO replace hardcoded testing value with async request
      orgList[index] = {'yo': 'man', 'id': index}
    }
  }
}
</script>

<style>
</style>
