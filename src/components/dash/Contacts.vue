<template>
  <section class="content">
    <div class="row">
      <div class="col-md-3 col-sm-6">
        <div class='box' v-bind:class='ASNInputClass'>
          <div class="box-body">
            <h5>Lookup ASN</h5>
            <div class="input-group input-group-sm">
              <span class="input-group-addon"><i class="fa fa-hdd-o"></i></span>
              <input type="text" class="form-control"
                v-model.lazy.trim:title="searchASN"
                v-on:change="lookupASN"
                placeholder="49234"
              >
              <span class="input-group-btn">
                <button class="btn btn-default" v-on:click="lookupASN">
                  <i class="fa fa-search"></i>
                </button>
              </span>
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
          </div> <!-- .box-body -->
        </div> <!-- .box -->
      </div>
      <div class="col-md-4 col-sm-6">
        <div class='box' v-bind:class='EmailInputClass'>
          <div class="box-body">
            <h5>Search Email</h5>
            <div class="input-group input-group-sm">
              <span class="input-group-addon"><i class="fa fa-envelope-o"></i></span>
              <input class="form-control"
                v-model.lazy.trim:title="searchEmail"
                v-on:change="lookupEmail"
                placeholder="abuse@bund.de"
              >
              <span class="input-group-btn">
                <button class="btn btn-default" v-on:click="lookupEmail">
                  <i class="fa fa-search"></i>
                </button>
              </span>
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
          </div> <!-- .box-body -->
        </div> <!-- .box -->
      </div>
      <div class="col-md-5 col-sm-12">
        <div class='box' v-bind:class='NameInputClass'>
          <div class="box-body">
            <h5>Search Name</h5>
            <div class="input-group input-group-sm">
              <span class="input-group-addon"><i class="fa fa-address-book-o"></i></span>
              <input class="form-control"
                v-model.lazy.trim:title="searchName"
                v-on:change="lookupName"
                placeholder="Bundesamt fuer Sicherheit in der Informationstechnik"
              >
              <span class="input-group-btn">
                <button class="btn btn-default" v-on:click="lookupName">
                  <i class="fa fa-search"></i>
                </button>
              </span>
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
          </div> <!-- .box-body -->
        </div> <!-- .box -->
      </div>
    </div>
    <div class="row">
      <org-card v-for="(org, index) of manualOrgs" v-if="org !== null"
                class="col-md-6 col-sm-6"
                v-bind:org="org" status="manual"
                v-on:edit="editOrg(index)"
                v-on:delete="deleteOrg(index)"
                ></org-card>
      <org-card v-for="(org, index) of autoOrgs" v-if="org !== null"
                class="col-md-6 col-sm-6"
                v-bind:org="org" status="auto"
                v-on:clone="cloneOrg(index, $event)"></org-card>

      <org-card v-for="(org, index) of pendingOrgs"
                class="col-md-6 col-sm-6"
                v-bind:org="org" v-bind:status="pendingOrgIndex[index]"
                v-on:clone="cloneOrg(index, $event)"
                v-on:trash="trashOrg(index)"
                ></org-card>
    </div>
    <div class="row">
      <div class="col-md-4 col-sm-4">
        <button class="btn btn-primary btn-lg btn-block"
                v-on:click="newOrg">
          <i class="fa fa-plus-square-o" style="margin-right:.2em"></i>New
        </button>
      </div>
      <div class="col-md-4 col-sm-4">
        <button class="btn btn-warning btn-lg btn-block"
                v-on:click="commitPendingOrgs"
                v-bind:class="ActionDisabled">
          <i class="fa fa-pencil-square-o" style="margin-right:.2em"></i>Commit
        </button>
      </div>
      <div class="col-md-4 col-sm-4">
        <button class="btn btn-danger btn-lg btn-block"
                v-on:click="clearPendingOrgs"
                v-bind:class="ActionDisabled">
          <i class="fa fa-trash-o" style="margin-right:.2em"></i>Clear
        </button>
      </div>
    </div>
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
    },
    ActionDisabled: function () {
      return {
        'disabled': (this.pendingOrgs.length === 0)
      }
    }
  },
  watch: {
    manualOrgIDs: function (newManualOrgIDs) {
      // deleting all objects and reloading them. (A more clever approach
      // is unnecessary, because we expect only to load a few
      this.manualOrgs = Array(newManualOrgIDs.length).fill(null)
      for (var index in newManualOrgIDs) {
        this.lookupOrg(this.manualOrgs, 'manual', this.manualOrgIDs, index)
      }
    },
    autoOrgIDs: function (newAutoOrgIDs) {
      // deleting all objects and reloading them. (A more clever approach
      // is unnecessary, because we expect only to load a few
      this.autoOrgs = Array(newAutoOrgIDs.length).fill(null)
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
    refreshCurrentSearch: function () {
      // simple version to just repeat the search we'd done before
      if (this.searchASN !== '') {
        this.lookupASN()
        return
      }
      if (this.searchEmail !== '') {
        this.lookupEmail()
        return
      }
      if (this.searchName !== '') {
        this.lookupName()
        return
      }
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
            orgList.splice(index, 1, null)
          }
        })
      }, (response) => {
        // no valid response
        orgList[index] = null
      })
    },
    newOrg: function () {
      // TODO get a template from the api
      // push it to pendingOrgs
      this.pendingOrgs.push({
        'annotations': [],
        'name': '',
        'sector_id': null,
        'comment': '',
        'ripe_org_hdl': '',
        'ti_handle': '',
        'first_handle': '',
        'asns': [],
        'contacts': []
      })
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

      // add to commit queue as CREATE
      this.pendingOrgs.push(newOrg)
      this.pendingOrgIndex.push('create')
    },
    editOrg: function (index) {
      // edit a manual organisation

      // TODO: Check if we are already in the queue and if so possibly change
      //   status and do not add it again
      var toBeUpdatedOrgID = this.manualOrgs[index].id

      var strMe = JSON.stringify(this.manualOrgs[index])

      for (index in this.pendingOrgs) {
        if ('id' in this.pendingOrgs[index] &&
            this.pendingOrgs[index].id === toBeUpdatedOrgID) {
          console.log('Selected "edit", but org is already in edit mode.')
          if (this.pendingOrgIndex[index] === 'update') {
            // we are already editing it, doing nothing
            return
          }
          if (this.pendingOrgIndex[index] === 'delete') {
            // change it to update
            // (We have to use splice for Vue to notice the change
            // see https://vuejs.org/v2/guide/list.html#Caveats)
            this.pendingOrgIndex.splice(index, 1, 'update')
            return
          }
        }
      }

      // deep-copy the org
      var editOrg = JSON.parse(strMe)

      // add it to commit queue as UPDATE
      this.pendingOrgs.push(editOrg)
      this.pendingOrgIndex.push('update')
    },
    trashOrg: function (index) {
      // remove a pendingOrg
      this.pendingOrgIndex.splice(index, 1)
      this.pendingOrgs.splice(index, 1)
    },
    deleteOrg: function (index) {
      // schedule manual organisation for deletion

      // Check if we are already in the queue and if so possibly change
      // status and do not add it again
      var strMe = JSON.stringify(this.manualOrgs[index])
      for (index in this.pendingOrgs) {
        if (JSON.stringify(this.pendingOrgs[index]) === strMe) {
          // it is okay to just set delete,
          // because no value has been changed
          // (We have to use splice for Vue to notice the change
          // see https://vuejs.org/v2/guide/list.html#Caveats)
          this.pendingOrgIndex.splice(index, 1, 'delete')
          return
        }
      }

      // deep-copy the org
      var toBeDeletedOrg = JSON.parse(strMe)

      this.pendingOrgs.push(toBeDeletedOrg)
      this.pendingOrgIndex.push('delete')
    },
    clearPendingOrgs () {
      // TODO add some debounce, throttle or other saftey function
      //  like the necessity to press the button twice
      //  right now we just throw away
      this.pendingOrgs = []
      this.pendingOrgIndex = []
    },
    commitPendingOrgs () {
      // console.log('commitPendingOrgs() called')
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
            // TODO updates ids that have changed to manualOrgIDs
            // (which will then trigger an update)

            // using the more simple approach now to redo the current search
            this.refreshCurrentSearch()
          }
        })
      }, response => {
        // error callback
        console.log('Committing changes to server failed, status code = ' +
                    response.status + ' (' + response.statusText + ').')
        // TODO display error message
        if (response.status === 400) {  // we get json for "bad request"s
          response.json().then(value => {
            // json parsed correctly
            console.log('Server answer:' + JSON.stringify(value))
          })
        }
        // TODO unblock
      })
    }
  }
}
</script>

