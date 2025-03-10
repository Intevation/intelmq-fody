<template>
  <section v-if="loggedIn" class="content">
    <div class="row">
      <div class="col-md-3 col-sm-6">
        <div class='box' v-bind:class='ASNInputClass'>
          <div class="box-body">
            <h5>Lookup ASN</h5>
            <div class="input-group input-group-sm">
              <span class="input-group-addon"><i class="fa fa-hdd-o"></i></span>
              <input-unsigned-int class="form-control"
                v-model.lazy.trim:title="searchASN"
                v-on:change.native="lookupASN"
                placeholder="49234"
              />
              <span class="input-group-btn">
                <button class="btn btn-default" v-on:click="lookupASN">
                  <i class="fa fa-search"></i>
                </button>
              </span>
            </div>
          </div> <!-- .box-body -->
        </div> <!-- .box -->
      </div>
      <div class="col-md-3 col-sm-6">
        <div class='box' v-bind:class='CFNInputClass'>
          <div class="box-body">
            <h5>Search IP/CIDR/FQDN/CC</h5>
            <div class="input-group input-group-sm">
              <span class="input-group-addon"><i class="fa fa-hdd-o"></i></span>
              <input type="text" class="form-control"
                v-model.lazy.trim:title="searchCFN"
                v-on:change="lookupCFN"
                placeholder="2001:638:81e::/48"
              >
              <span class="input-group-btn">
                <button class="btn btn-default" v-on:click="lookupCFN">
                  <i class="fa fa-search"></i>
                </button>
              </span>
            </div>
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
          </div> <!-- .box-body -->
        </div> <!-- .box -->
      </div>
      <div class="col-md-4 col-sm-6">
        <div class='box' v-bind:class='TagInputClass'>
          <div class="box-body">
            <h5>Search Tag</h5>
            <div class="input-group input-group-sm">
              <span class="input-group-addon"><i class="fa fa-tag"></i></span>
              <input class="form-control"
                v-model.lazy.trim:title="searchTag"
                v-on:change="lookupTag"
                placeholder="Whitelist:DNS-Open-Resolver"
              >
              <span class="input-group-btn">
                <button class="btn btn-default" v-on:click="lookupTag">
                  <i class="fa fa-search"></i>
                </button>
              </span>
            </div>
          </div> <!-- .box-body -->
        </div> <!-- .box -->
      </div>
      <div class="col-md-3 col-sm-4">
        <div class='box' v-bind:class='DisabledEmailInputClass'>
          <div class="box-body">
            <h5>Search disabled Email ('@'=all)</h5>
            <div class="input-group input-group-sm">
              <span class="input-group-addon"><i class="fa fa-envelope-o"></i></span>
              <input class="form-control"
                v-model.lazy.trim:title="searchDisabledEmail"
                v-on:change="lookupDisabledEmail"
                placeholder="@"
              >
              <span class="input-group-btn">
                <button class="btn btn-default"
                    v-on:click="lookupDisabledEmail">
                  <i class="fa fa-search"></i>
                </button>
              </span>
            </div>
          </div> <!-- .box-body -->
        </div> <!-- .box -->
      </div>
      <div v-if="annotationHintsErrorMsg"
           class="alert alert-danger col-xs-12" role="alert">
        Could not get annotation hints from backend:
        {{ annotationHintsErrorMsg }}
      </div>
      <div v-if="searchErrorMsg"
           class="alert alert-danger col-xs-12" role="alert">
        {{ searchErrorMsg }}
      </div>
      <div v-if="limited" class="alert alert-info col-xs-12" role="alert">
        Shown entries limited to {{ loadLimit }} per auto or manual.
        Try a more specific search.
      </div>
      <div v-if="searchSuccessful"
           class="alert alert-success col-xs-12" role="alert">
        <div>
          Results for search criterion {{ searchCriterion }}
        </div>
        <div v-if="autoOrgIDs.length + manualOrgIDs.length === 0">
          Not found.
        </div>
        <div v-if="autoOrgIDs.length + manualOrgIDs.length > 0">
          Found {{ autoOrgIDs.length }} auto-imported and
                {{ manualOrgIDs.length }} manual organisations.
        </div>
      </div>
    </div> <!-- .row -->
    <div class="row">
      <org-card v-for="(org, index) of manualOrgs" v-if="org !== null"
                class="col-md-6 col-sm-6"
                v-bind:org="org" status="manual"
                v-bind:annotation-hints="annotationHints"
                v-bind:orgSchemaDraft="orgSchemaDraft"
                v-on:edit="editOrg(index)"
                v-on:delete="deleteOrg(index)"
                ></org-card>
      <org-card v-for="(org, index) of autoOrgs" v-if="org !== null"
                class="col-md-6 col-sm-6"
                v-bind:org="org" status="auto"
                v-bind:annotation-hints="annotationHints"
                v-bind:orgSchemaDraft="orgSchemaDraft"
                v-on:clone="cloneOrg(index, $event)"></org-card>

      <org-card v-for="(org, index) of pendingOrgs"
                class="col-md-6 col-sm-6"
                v-bind:org="org" v-bind:status="pendingOrgIndex[index]"
                v-bind:annotation-hints="annotationHints"
                v-bind:orgSchemaDraft="orgSchemaDraft"
                v-on:clone="cloneOrg(index, $event)"
                v-on:trash="trashOrg(index)"
                ></org-card>
    </div>
    <div v-if="commitPendingOrgsErrorMsg" class="row">
      <div class="alert alert-danger col-xs-12" role="alert">
        Committing changes to server failed with
        {{ commitPendingOrgsErrorMsg }}
      </div>
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
import { mapState } from 'vuex'
import { errorMixin } from '../../mixins/errorHelper.js'
import inputUnsignedInt from './InputUnsignedInt.vue'
import OrgCard from './OrgCard.vue'

import { Draft2019, config } from 'json-schema-library'
const ipaddr = require('ipaddr.js')

// customize some of the messages so that they don't contain the
// pointer (JSON path) that we don't need in Fody. E.g. The message
//    "A value is required in `{{pointer}}`"
// is replaced by
//    'A value is required'
config.strings.MinLengthOneError = 'A value is required'
config.strings.PatternError = 'Value should match \'{{description}}\', but received \'{{received}}\''
config.strings.TypeError = 'Expected \'{{value}}\' ({{received}}) to be of type \'{{expected}}\''

const validateCIDR = value => {
  var parsed
  try {
    parsed = ipaddr.parseCIDR(value)
  } catch (e) {
    return 'Cannot be parsed as CIDR'
  }
  const nwaddr = parsed[0].kind() === 'ipv4'
        ? ipaddr.IPv4.networkAddressFromCIDR(value)
        : ipaddr.IPv6.networkAddressFromCIDR(value)
  if (parsed[0].toNormalizedString() !== nwaddr.toNormalizedString()) {
    return `${value} has host bits set`
  }
  return null
}

module.exports = {
  name: 'Contacts',
  data: function () {
    return {
      baseQueryURL: '/api/contactdb',  // base url for AJAJ service
      searchASN: '',  // asn we want to look up
      searchEmail: '',  // email we are searching for
      searchDisabledEmail: '',  // disabled email substr we are searching for
      searchName: '',  // org name we are searching for
      searchCFN: '', // contents of multi search field for cidr, fqdn and nc
      searchTag: '', // annotation.tag substring we are searching for
      lastSearchCriterion: '',
      lastSearchValue: '',
      manualOrgIDs: [],  // list of ids of manual orgs we currently show
      manualOrgs: [],
      autoOrgIDs: [],  // list of ids of auto entries we currently show
      autoOrgs: [],
      orgSchemaDraft: null, // Draft2019 instance
      searchErrorMsg: '', // !=='' if getOrdIDs()' backend call failed
      loadLimit: 100, // max number of manual- and autoorgs to load
      limited: false,  // if we are only loading some of the search results
      annotationHints: {},  // from the server to help editing annotations
      annotationHintsErrorMsg: '',  // !=='' if getAnnotationHints() failed
      // state of the entries in pendingOrgs, three values
      //   'delete' for removing the manual entry with org.id
      //   'create' for adding a new manual entry
      //   'update' for replacing the manual entry
      pendingOrgIndex: [],
      pendingOrgs: [],  // objects, potentially changed, to be written back
      commitPendingOrgsErrorMsg: '' // !== '' if commitPendingOrgs() failed
    }
  },
  components: {
    inputUnsignedInt, OrgCard
  },
  computed: {
    ...mapState(['loggedIn']),
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
    DisabledEmailInputClass: function () {
      return {
        'has-error': (this.searchDisabledEmail !== '' &&
                      this.manualOrgIDs.length + this.autoOrgIDs.length === 0),
        'has-success': (this.searchDisabledEmail !== '' &&
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
    CFNInputClass: function () {
      return {
        'has-error': (this.searchCFN !== '' &&
                      this.manualOrgIDs.length + this.autoOrgIDs.length === 0),
        'has-success': (this.searchCFN !== '' &&
                        this.manualOrgIDs.length + this.autoOrgIDs.length > 0)
      }
    },
    TagInputClass: function () {
      // only manual orgs may have annotations
      return {
        'has-error': (this.searchTag !== '' &&
                      (this.manualOrgIDs.length === 0 ||
                      this.autoOrgIDs.length > 0)),
        'has-success': (this.searchTag !== '' &&
                        this.manualOrgIDs.length > 0 &&
                        this.autoOrgIDs.length === 0)
      }
    },
    ActionDisabled: function () {
      return {
        'disabled': (this.pendingOrgs.length === 0)
      }
    },
    searchSuccessful: function () {
      return this.lastSearchCriterion && !this.searchErrorMsg
    },
    searchCriterion: function () {
      var prefix = ''
      switch (this.lastSearchCriterion) {
        case 'asn':
          prefix = 'ASN'
          break
        case 'email':
          prefix = 'Email'
          break
        case 'disabled-email':
          prefix = 'Disabled Email'
          break
        case 'name':
          prefix = 'Name'
          break
        case 'cfn':
          prefix = 'IP/CIDR/FQDN/CC'
          break
        case 'tag':
          prefix = 'Tag'
          break
        default:
          prefix = ''
      }

      if (prefix !== '') {
        return prefix + ' "' + this.lastSearchValue + '"'
      }
      return ''
    }
  },
  watch: {
    manualOrgIDs: function (newManualOrgIDs) {
      var numberToLoad

      if (newManualOrgIDs.length > this.loadLimit) {
        numberToLoad = this.loadLimit
        this.limited = true
      } else {
        numberToLoad = newManualOrgIDs.length
        this.limited = false
      }
      // deleting all objects and reloading them, as even the existing ones
      // could have changed
      this.manualOrgs = Array(numberToLoad).fill(null)
      for (var i = 0; i < numberToLoad; i++) {
        this.lookupOrg(this.manualOrgs, 'manual', this.manualOrgIDs, i)
      }
    },
    autoOrgIDs: function (newAutoOrgIDs) {
      var numberToLoad

      if (newAutoOrgIDs.length > this.loadLimit) {
        numberToLoad = this.loadLimit
        this.limited = true
      } else {
        numberToLoad = newAutoOrgIDs.length
        this.limited = false
      }
      // deleting all objects and reloading them, as even the existing ones
      // could have changed
      this.autoOrgs = Array(numberToLoad).fill(null)
      for (var i = 0; i < numberToLoad; i++) {
        this.lookupOrg(this.autoOrgs, 'auto', this.autoOrgIDs, i)
      }
    }
  },
  mixins: [errorMixin],  // adds method setErrorMsg()
  methods: {
    getOrgIDs: function (queryPartStr) {
      this.searchErrorMsg = ''
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
        }, (response) => {
          this.searchErrorMsg = 'Error: got invalid json from server.'
        })
      }, (response) => {
        // no valid response
        this.autoOrgIDs = []
        this.manualOrgIDs = []
        this.setErrorMsg(response, 'searchErrorMsg')
      })
    },
    lookupASN: function () {
      // FUTURE: we may need some debounce or throttle function here

      // fixed testing values with our AJAJ request:
      // this.manualOrgIDs = [1, 23]
      // this.autoOrgIDs = [23, 456]

      this.searchEmail = ''
      this.searchDisabledEmail = ''
      this.searchName = ''
      this.searchCFN = ''
      this.searchTag = ''
      this.getOrgIDs('/searchasn?asn=' + this.searchASN)
      this.lastSearchCriterion = 'asn'
      this.lastSearchValue = this.searchASN

      // Modify the URL, this enables bookmarking of this search.
      this.$router.replace({query: {asn: this.searchASN}})
    },
    lookupEmail: function () {
      // FUTURE: we may need some debounce or throttle function here

      this.searchASN = ''
      this.searchDisabledEmail = ''
      this.searchName = ''
      this.searchCFN = ''
      this.searchTag = ''
      this.getOrgIDs('/searchcontact?email=' + this.searchEmail)
      this.lastSearchCriterion = 'email'
      this.lastSearchValue = this.searchEmail

      // Modify the URL, this enables bookmarking of this search.
      this.$router.replace({query: {email: this.searchEmail}})
    },
    lookupDisabledEmail: function () {
      // FUTURE: we may need some debounce or throttle function here

      this.searchASN = ''
      this.searchEmail = ''
      this.searchName = ''
      this.searchCFN = ''
      this.searchTag = ''
      this.getOrgIDs('/searchdisabledcontact?email=' + this.searchDisabledEmail)
      this.lastSearchCriterion = 'disabled-email'
      this.lastSearchValue = this.searchDisabledEmail

      // Modify the URL, this enables bookmarking of this search.
      this.$router.replace({query: {disabledemail: this.searchDisabledEmail}})
    },
    lookupName: function () {
      // FUTURE: we may need some debounce or throttle function here

      this.searchASN = ''
      this.searchEmail = ''
      this.searchDisabledEmail = ''
      this.searchCFN = ''
      this.searchTag = ''
      this.getOrgIDs('/searchorg?name=' + this.searchName)
      this.lastSearchCriterion = 'name'
      this.lastSearchValue = this.searchName

      // Modify the URL, this enables bookmarking of this search.
      this.$router.replace({query: {name: this.searchName}})
    },
    lookupCFN: function () {
      // FUTURE: we may need some debounce or throttle function here

      this.searchASN = ''
      this.searchEmail = ''
      this.searchDisabledEmail = ''
      this.searchName = ''
      this.searchTag = ''
      if (this.searchCFN.length === 2) {
        this.getOrgIDs('/searchnational?countrycode=' + this.searchCFN)
      } else if (/\.[^0-9:.]+$|^[^0-9:.]+$|\.xn--[^.]*$/.test(this.searchCFN)) {
        this.getOrgIDs('/searchfqdn?domain=' + this.searchCFN)
      } else {
        this.getOrgIDs('/searchcidr?address=' + this.searchCFN)
      }
      this.lastSearchCriterion = 'cfn'
      this.lastSearchValue = this.searchCFN

      // Modify the URL, this enables bookmarking of this search.
      this.$router.replace({query: {cfn: this.searchCFN}})
    },
    lookupTag: function () {
      // (general comments of other lookup*() functions apply.)
      this.searchASN = ''
      this.searchEmail = ''
      this.searchDisabledEmail = ''
      this.searchName = ''
      this.searchCFN = ''
      this.getOrgIDs('/annotation/search?tag=' + this.searchTag)
      this.lastSearchCriterion = 'tag'
      this.lastSearchValue = this.searchTag

      this.$router.replace({query: {tag: this.searchTag}})
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
      if (this.searchCFN !== '') {
        this.lookupCFN()
        return
      }
      if (this.searchTag !== '') {
        this.lookupTag()
        return
      }
      if (this.searchDisabledEmail !== '') {
        this.lookupDisabledEmail()
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
        }, (response) => {
          let errOrg = {name: ids[index], errorMsg: 'Error: got invalid json.'}
          orgList.splice(index, 1, errOrg)
        })
      }, (response) => {
        // no valid response
        let errOrg = {name: ids[index], errorMsg: ''}
        if (response.status === 0) {
          errOrg.errorMsg = 'Error: Failed to connect properly.'
          orgList.splice(index, 1, errOrg)
        } else {
          response.text().then((bodyText) => {
            errOrg.errorMsg = 'Error ' + response.status + ': ' + bodyText
            orgList.splice(index, 1, errOrg)
          })
        }
      })
    },
    getAnnotationHints () {
      if (!this.loggedIn) {
        // otherwise we trigger an "Invalid Authentication" and "Could not get annotation hints from backend" error
        return
      }
      var url = this.baseQueryURL + '/annotation/hints'
      this.annotationHintsErrorMsg = ''
      this.$http.get(url).then((response) => {
        // got valid response
        response.json().then((value) => {
          // json parsed correctly
          if (value) {
            this.annotationHints = value
          }
        }, (response) => {
          this.annotationHintsErrorMsg = 'Error: got invalid json from server.'
        })
      }, (response) => {
        // no valid response
        this.setErrorMsg(response, 'annotationHintsErrorMsg')
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
        'contacts': [],
        'networks': [],
        'fqdns': [],
        'national_certs': []
      })
      this.pendingOrgIndex.push('create')
    },
    cloneOrg: function (index, event) {
      // console.log('cloneOrg() called with index: ' + index +
      //            ' and argument: ' + JSON.stringify(event))

      // deep-copy the org so we can create a new one
      var newOrg = JSON.parse(JSON.stringify(this.autoOrgs[index]))
      // remove values that are only used within _automatic tables
      delete newOrg['import_source']
      delete newOrg['import_time']
      delete newOrg['organisation_id']
      // add values that are needed for manual tables
      newOrg['annotations'] = []

      for (var asn of newOrg['asns']) {
        asn['annotations'] = []
        delete asn['import_source']
        delete asn['import_time']
        delete asn['organisation_automatic_id']
      }
      for (var network of newOrg['networks']) {
        network['annotations'] = []
      }
      for (var fqdn of newOrg['fqdns']) {
        fqdn['annotations'] = []
      }

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
      if (this.pendingOrgs.length === 0) {
        return
      }

      // TODO clear out empty values for asns, networks, fqdns, annotations
      // those will fail when commiting

      var url = this.baseQueryURL + '/org/manual/commit'
      var commitObject = {
        'commands': this.pendingOrgIndex,
        'orgs': this.pendingOrgs
      }

      // TODO block until we have a response
      this.commitPendingOrgsErrorMsg = ''
      this.$http.post(url, commitObject).then(response => {
        // TODO unblock

        // getting a list of new or updated manual Org IDs back
        response.json().then(value => {
          // json parsed correctly

          if (value) {
            // TODO updates ids that have changed to manualOrgIDs
            // (which will then trigger an update)

            // request was good, remove pending items
            this.pendingOrgIndex = []
            this.pendingOrgs = []

            // using the more simple approach now to redo the current search
            this.refreshCurrentSearch()
          }
        }, (response) => {
          this.commitPendingOrgsErrorMsg = 'Error: got invalid json from server.'
        })
      }, response => {
        // error callback
        this.setErrorMsg(response, 'commitPendingOrgsErrorMsg')
      })
    }
  },
  mounted: function () {
    // Start getting the annotationHints
    this.getAnnotationHints()
  },
  created: function () {
    // If the page was called with parameters
    // Start searching for the first machting parameter immediately
    // and display the tickets
    if (this.$route.query.disabledemail) {
      this.searchDisabledEmail = this.$route.query.disabledemail
      this.lookupDisabledEmail()
    } else if (this.$route.query.email) {
      this.searchEmail = this.$route.query.email
      this.lookupEmail()
    } else if (this.$route.query.asn) {
      this.searchASN = this.$route.query.asn
      this.lookupASN()
    } else if (this.$route.query.name) {
      this.searchName = this.$route.query.name
      this.lookupName()
    } else if (this.$route.query.cfn) {
      this.searchCFN = this.$route.query.cfn
      this.lookupCFN()
    } else if (this.$route.query.tag) {
      this.searchTag = this.$route.query.tag
      this.lookupTag()
    }

    this.$http.get(this.baseQueryURL + '/org/schema.json').then((response) => {
      // got a valid response
      response.json().then((schema) => {
        // json parsed correctly
        this.orgSchemaDraft = new Draft2019(schema, {
          validateFormat: {
            cidr: (node, value) => {
              const { schema, pointer } = node
              if (typeof value === 'string' && value) {
                const err = validateCIDR(value)
                if (err) {
                  return {
                    type: 'error',
                    code: 'cidr-error',
                    name: 'CidrError',
                    message: err,
                    data: { value, schema, pointer }
                  }
                }
              }
            }
          }
        })
      }, (response) => {
        this.searchErrorMsg = 'Error: got invalid json from server.'
      })
    }, (response) => {
      // no valid response
      this.setErrorMsg(response, 'searchErrorMsg')
    })
  }
}
</script>
