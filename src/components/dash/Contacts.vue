<template>
  <section class="content">
    <div class="row">
      <div class='col-xs-12'>
        <div class='box'>
          <div class='box-header with-border col-md-3 col-sm-3'>
            <h2>Search for ASN</h2>
          </div>

          <div class="box-body">
            <div class="forum-control" v-bind:class='ASNInputClass'>
              <div class="input-group">
                <span class="input-group-addon"><i class="fa fa-hdd-o"></i></span>
                <input class="form-control"
                  v-model.lazy.trim:title="searchASN"
                  v-on:change="lookupASN"
                  placeholder="49234"
                >
                <span class="input-group-addon"><i class="fa fa-search"></i></span>
              </div>
              <span v-if="searchASN !== ''">
                <span class="help-block"
                    v-if="autoOrgIDs.length + manualOrgIDs.length === 0">
                  Not found.
                </span>
                <span class="help-block"
                      v-if="autoOrgIDs.length + manualOrgIDs.length > 0">
                  Found {{ autoOrgIDs.length }} auto-imported and
                        {{ manualOrgIDs.length }} manual organisations.
                </span>
              </span>
            </div>
          </div> <!-- .box-body -->
        </div> <!-- .box -->

        <div class='box'>
          <div class='box-header with-border col-md-3 col-sm-6'>
            <h2>Search for email</h2>
          </div>

          <div class="box-body">
            <div class="forum-control" v-bind:class='EmailInputClass'>
              <div class="input-group">
                <span class="input-group-addon"><i class="fa fa-envelope-o"></i></span>
                <input class="form-control"
                  v-model.lazy.trim:title="searchEmail"
                  v-on:change="lookupEmail"
                  placeholder="abuse@bund.de"
                >
                <span class="input-group-addon"><i class="fa fa-search"></i></span>
              </div>
              <span v-if="searchEmail !== ''">
                <span class="help-block"
                    v-if="autoOrgIDs.length + manualOrgIDs.length === 0">
                  Not found.
                </span>
                <span class="help-block"
                      v-if="autoOrgIDs.length + manualOrgIDs.length > 0">
                  Found {{ autoOrgIDs.length }} auto-imported and
                        {{ manualOrgIDs.length }} manual organisations.
                </span>
              </span>
            </div>
          </div> <!-- .box-body -->
        </div> <!-- .box -->

        <div class='box'>
          <div class='box-header with-border col-md-3 col-sm-6'>
            <h2>Lookup name</h2>
          </div>

          <div class="box-body">
            <div class="forum-control" v-bind:class='NameInputClass'>
              <div class="input-group">
                <span class="input-group-addon"><i class="fa fa-address-book-o"></i></span>
                <input class="form-control"
                  v-model.lazy.trim:title="searchName"
                  v-on:change="lookupName"
                  placeholder="Bundesamt fuer Sicherheit in der Informationstechnik"
                >
                <span class="input-group-addon"><i class="fa fa-search"></i></span>
              </div>
              <span v-if="searchName !== ''">
                <span class="help-block"
                    v-if="autoOrgIDs.length + manualOrgIDs.length === 0">
                  Not found.
                </span>
                <span class="help-block"
                      v-if="autoOrgIDs.length + manualOrgIDs.length > 0">
                  Found {{ autoOrgIDs.length }} auto-imported and
                        {{ manualOrgIDs.length }} manual organisations.
                </span>
              </span>
            </div>
          </div> <!-- .box-body -->
        </div> <!-- .box -->

        <org-card v-for="org of manualOrgs" class="col-md-6 col-sm-6"
                  v-bind:org="org" status="manual"></org-card>
        <org-card v-for="(org, index) of autoOrgs" class="col-md-6 col-sm-6"
                  v-bind:org="org" status="auto"
                  v-on:clone="cloneOrg(index, $event)"></org-card>

        <button class="btn btn-primary btn-lg btn-block"
                v-on:click="newOrg"><i class="fa fa-plus-square-o" style="margin-right:.2em"></i>New
        </button>

        <div v-if="pendingOrgIndex.length !== 0"
             class="box" style="margin-top:20px">
          <org-card v-for="(org, index) of pendingOrgs"
                    class="col-md-6 col-sm-6"
                    v-bind:org="org" status="pending"
                    v-on:clone="cloneOrg(index, $event)"></org-card>

          <button class="btn btn-warning btn-lg btn-block"
                  v-on:click="commitPendingOrgs"
                  ><i class="fa fa-pencil-square-o"
                      style="margin-right:.2em"></i>Commit
          </button>

          <button class="btn btn-danger btn-lg btn-block"
                  v-on:click="clearPendingOrgs"
                  ><i class="fa fa-trash-o"
                      style="margin-right:.2em"></i>Clear
          </button>

        </div>

      </div> <!-- .col... -->
    </div> <!-- /.row -->
  </section>
</template>

<script>
// import $ from 'jquery'

import OrgCard from './OrgCard.vue'

module.exports = {
  name: 'Contacts',
  data: function () {
    return {
      baseQueryURL: '/api/contactdb',  // base url for AJAJ service
      searchASN: '',  // asn we are searching for
      searchEmail: '',  // email we are searching for
      searchName: '',  // org name we want to look up
      manualOrgIDs: [], // list of ids of manual orgs we currently show
      manualOrgs: [],
      autoOrgIDs: [], // list of ids of auto entries we currently show
      autoOrgs: [],
      // state of the entries in pendingOrgs, three values
      //   'delete' for removing the manual entry with org.id
      //   'create' for adding a new manual entry
      //   'update' for replacing the manual entry
      pendingOrgIndex: [],
      pendingOrgs: []  // objects, potentially changed, to be written back
    }
  },
  components: {
    OrgCard
  },
  computed: {
    ASNInputClass: function () {
      return {
        'has-error': (this.searchASN !== '' &&
                      this.manualOrgIDs.length + this.autoOrgIDs.length === 0),
        'has-success': (this.searchASN !== '' &&
                        this.manualOrgIDs.length + this.autoOrgIDs.length > 0)
      }
    },
    EmailInputClass: function () {
      return {
        'has-error': (this.searchEmail !== '' &&
                      this.manualOrgIDs.length + this.autoOrgIDs.length === 0),
        'has-success': (this.searchEmail !== '' &&
                        this.manualOrgIDs.length + this.autoOrgIDs.length > 0)
      }
    },
    NameInputClass: function () {
      return {
        'has-error': (this.searchName !== '' &&
                      this.manualOrgIDs.length + this.autoOrgIDs.length === 0),
        'has-success': (this.searchName !== '' &&
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
    getOrgIDs: function (queryPartStr) {
      var url = this.baseQueryURL + queryPartStr
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
    lookupASN: function () {
      // FUTURE: we may need some debounce or throttle function here

      // fixed testing values with out AJAJ request:
      // this.manualOrgIDs = [1, 23]
      // this.autoOrgIDs = [23, 456]

      this.searchEmail = ''
      this.searchName = ''
      this.getOrgIDs('/searchasn?asn=' + this.searchASN)
    },
    lookupEmail: function () {
      // FUTURE: we may need some debounce or throttle function here

      this.searchASN = ''
      this.searchName = ''
      this.getOrgIDs('/searchcontact?email=' + this.searchEmail)
    },
    lookupName: function () {
      // FUTURE: we may need some debounce or throttle function here

      this.searchASN = ''
      this.searchEmail = ''
      this.getOrgIDs('/searchorg?name=' + this.searchName)
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
    },
    newOrg: function () {
      // TODO get a template from the api
      // push it to pendingOrgs
      this.pendingOrgs.push({'name': ''})
      this.pendingOrgIndex.push('create')
    },
    cloneOrg: function (index, event) {
      // console.log('cloneOrg() called with index: ' + index +
      //            ' and argument: ' + JSON.stringify(event))

      // deep-copy the org so we can create a new one
      var newOrg = JSON.parse(JSON.stringify(this.autoOrgs[index]))
      // remove values that are only within _automatic tables
      delete newOrg['import_source']
      delete newOrg['import_time']
      delete newOrg['id']

      // add in commit queue as CREATE
      this.pendingOrgs.push(newOrg)
      this.pendingOrgIndex.push('create')
    },
    deleteOrg: function (index, event) {
      this.pendingOrgs.push('delete')
      this.pendingOrgIndex.push(this.manualOrgs[index].id)
    },
    clearPendingOrgs () {
      // TODO add some debounce, throttle or other saftey function
      //  like the necessity to press the button twice
      //  right now we just throw away
      this.pendingOrgs = []
      this.pendingOrgIndex = []
    },
    commitPendingOrgs () {
      console.log('commitPendingOrgs() called')
      var url = this.baseQueryURL + '/org/manual/commit'
      var commitObject = {
        'commands': this.pendingOrgIndex,
        'orgs': this.pendingOrgs
      }

      // TODO block until we have a response
      this.$http.post(url, commitObject).then(response => {
        // request was good, remove pending items
        this.pendingOrgIndex = []
        this.pendingOrgs = []
        // TODO unblock

        // getting a list of new or updated manual Org IDs back
        response.json().then(value => {
          // json parsed correctly
          if (value) {
            // TODO add ids we do not have already to the displayed manualOrgs
            // (which also shall trigger an update)
          }
        })
      }, response => {
        // error callback
        // TODO display error message
        // TODO unblock
      })
    }
  }
}
</script>

