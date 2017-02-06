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
                  placeholder="49234"
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
             <org-card status="manual" v-for="org in manualOrgs" v-bind:org="org"></org-card>
             <org-card status="auto" v-for="org in autoOrgs" v-bind:org="org"></org-card>
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
  props: ['status', 'org'],
  template: '<li> Status: {{status}} {{ org }} </li>'
}

module.exports = {
  name: 'Contacts',
  data: function () {
    return {
      baseQueryURL: '/api/contactdb',  // base url for AJAJ service
      searchASN: '',  // asn we are searching for
      manualOrgIDs: [], // list of ids of manual orgs we currently show
      manualOrgs: [],
      autoOrgIDs: [], // list of ids of auto entries we currently show
      autoOrgs: [],
      pendingOrgIDs: [], // entries we currently edit
      pendingOrgs: []
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
    manualOrgIDs: function (newManualOrgIDs) {
      // deleting all objects and reloading them. (A more clever approach
      // is unnecessary, because we expect only to load a few
      this.manualOrgs = []
      for (var index in newManualOrgIDs) {
        this.lookupOrg(this.manualOrgs, 'manual', this.manualOrgIDs, index)
      }
    },
    autoOrgIDs: function (newAutoOrgIDs) {
      // deleting all objects and reloading them. (A more clever approach
      // is unnecessary, because we expect only to load a few
      this.autoOrgs = []
      for (var index in newAutoOrgIDs) {
        this.lookupOrg(this.autoOrgs, 'auto', this.autoOrgIDs, index)
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
    lookupOrg: function (orgList, type, ids, index) {
      var url = this.baseQueryURL + '/org/' + type + '/' + ids[index]
      this.$http.get(url).then((response) => {
        // got valid response
        response.json().then((value) => {
          // json parsed correctly
          if (value) {
            // instead of orgList[index] = value
            // we have to use splice for Vue to notice the change
            // see https://vuejs.org/v2/guide/list.html#Caveats
            orgList.splice(index, 1, value)
          } else {
            delete orgList[index]
          }
        })
      }, (response) => {
        // no valid response
        delete orgList[index]
      })
    }
  }
}
</script>

<style>
</style>
