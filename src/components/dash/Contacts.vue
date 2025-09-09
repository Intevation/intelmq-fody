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
                v-model.trim="searchASN"
                v-on:submit="lookupASN"
                placeholder="49234"
              />
              <span class="input-group-btn">
                <button type="button" class="btn btn-default" v-on:click="lookupASN">
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
              <input-submit type="text" class="form-control"
                v-model.trim="searchCFN"
                v-on:submit="lookupCFN"
                placeholder="2001:638:81e::/48"/>
              <span class="input-group-btn">
                <button type="button" class="btn btn-default" v-on:click="lookupCFN">
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
              <input-submit class="form-control"
                v-model.trim="searchEmail"
                v-on:submit="lookupEmail"
                placeholder="abuse@bund.de"/>
              <span class="input-group-btn">
                <button type="button" class="btn btn-default" v-on:click="lookupEmail">
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
              <input-submit class="form-control"
                v-model.trim="searchName"
                v-on:submit="lookupName"
                placeholder="Bundesamt fuer Sicherheit in der Informationstechnik"/>
              <span class="input-group-btn">
                <button type="button" class="btn btn-default" v-on:click="lookupName">
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
              <input-submit class="form-control"
                v-model.trim="searchTag"
                v-on:submit="lookupTag"
                placeholder="Whitelist:DNS-Open-Resolver"/>
              <span class="input-group-btn">
                <button type="button" class="btn btn-default" v-on:click="lookupTag">
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
              <input-submit class="form-control"
                v-model.trim="searchDisabledEmail"
                v-on:submit="lookupDisabledEmail"
                placeholder="@"/>
              <span class="input-group-btn">
                <button type="button" class="btn btn-default" v-on:click="lookupDisabledEmail">
                  <i class="fa fa-search"></i>
                </button>
              </span>
            </div>
          </div> <!-- .box-body -->
        </div> <!-- .box -->
      </div>
      <div v-if="schemaErrorMsg"
           class="alert alert-danger col-xs-12" role="alert">
        Could not get schema.json from backend, will be unable to validate inputs:<br>
        <span style="white-space: pre-line;">{{ schemaErrorMsg }}</span>
      </div>
      <div v-if="annotationHintsErrorMsg"
           class="alert alert-danger col-xs-12" role="alert">
        Could not get annotation hints from backend:<br>
        <span style="white-space: pre-line;">{{ annotationHintsErrorMsg }}</span>
      </div>
      <div v-if="searchErrorMsg"
           class="alert alert-danger col-xs-12" role="alert">
        Search for criterion {{ searchCriterion }} failed:<br>
        <span style="white-space: pre-line;">{{ searchErrorMsg }}</span>
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
      <div>
      <org-card v-for="(org, index) of manualOrgs" v-if="org !== null"
                class="col-md-6 col-sm-6"
                v-model="manualOrgs[index]" status="manual"
                v-bind:annotation-hints="annotationHints"
                v-bind:orgSchemaDraft="orgSchemaDraft"
                v-on:edit="editOrg(index)"
                v-on:delete="deleteOrg(index)"/>
      </div><div>
      <org-card v-for="(org, index) of autoOrgs" v-if="org !== null"
                class="col-md-6 col-sm-6"
                v-model="autoOrgs[index]" status="auto"
                v-bind:annotation-hints="annotationHints"
                v-bind:orgSchemaDraft="orgSchemaDraft"
                v-on:clone="cloneOrg(index, $event)"/>
      </div><div>
      <org-card v-for="(org, index) of pendingOrgs"
                class="col-md-6 col-sm-6"
                v-bind:id="'pending-org-' + index"
                v-model="pendingOrgs[index]" v-bind:status="pendingOrgIndex[index]"
                v-bind:annotation-hints="annotationHints"
                v-bind:orgSchemaDraft="orgSchemaDraft"
                v-on:clone="cloneOrg(index, $event)"
                v-on:trash="trashOrg(index)"/>
      </div>
    </div>
    <div v-if="commitPendingOrgsErrorMsg" class="row">
      <div class="alert alert-danger col-xs-12" role="alert">
        Committing changes to server failed:<br>
        <span style="white-space: pre-line;">{{ commitPendingOrgsErrorMsg }}</span>
      </div>
    </div>
    <div class="row">
      <div class="col-md-4 col-sm-4">
        <button type="button" class="btn btn-primary btn-lg btn-block" v-on:click="newOrg">
          <i class="fa fa-plus-square-o" style="margin-right:.2em"></i>New
        </button>
      </div>
      <div class="col-md-4 col-sm-4">
        <button type="button" v-on:click="commitPendingOrgs"
                class="btn btn-warning btn-lg btn-block" v-bind:class="ActionDisabled">
          <i class="fa fa-pencil-square-o" style="margin-right:.2em"></i>Commit
        </button>
      </div>
      <div class="col-md-4 col-sm-4">
        <button type="button" v-on:click="clearPendingOrgs"
                class="btn btn-danger btn-lg btn-block" v-bind:class="ActionDisabled">
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
import inputSubmit from './InputSubmit.vue'
import OrgCard from './OrgCard.vue'

import { validateAndNormalizeCIDROrIP } from '../../util/ipParse.js'
import { validateAndNormalizeDomain } from '../../util/idna.js'
import { Draft07, config } from 'json-schema-library'

// customize some of the messages so that they don't contain the
// pointer (JSON path) that we don't need in Fody. E.g. The message
//    "A value is required in `{{pointer}}`"
// is replaced by
//    'A value is required'
config.strings.MinLengthOneError = 'A value is required'
config.strings.PatternError = 'Value should match \'{{description}}\', but received \'{{received}}\''
config.strings.TypeError = 'Expected \'{{value}}\' ({{received}}) to be of type \'{{expected}}\''

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
      schemaErrorMsg: '', // !== '' if could not load schema.json
      orgSchemaDraft: null, // Draft07 instance
      searchErrorMsg: '', // !== '' if invalid search term or getOrdIDs() backend call failed
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
    inputUnsignedInt, inputSubmit, OrgCard
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
        case 'cfn-cc':
          prefix = 'CC'
          break
        case 'cfn-fqdn':
          prefix = 'FQDN'
          break
        case 'cfn-ip-cidr':
          prefix = 'IP/CIDR'
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
          this.autoOrgIDs = []
          this.manualOrgIDs = []
          this.searchErrorMsg = 'Got invalid JSON from server.'
        })
      }, (response) => {
        // no valid response
        this.autoOrgIDs = []
        this.manualOrgIDs = []
        this.setErrorMsg(response, 'searchErrorMsg')
      })
    },
    lookupASN: function () {
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
      this.searchASN = ''
      this.searchEmail = ''
      this.searchDisabledEmail = ''
      this.searchName = ''
      this.searchTag = ''
      if (/^[a-z]{2}$/i.test(this.searchCFN)) {
        this.getOrgIDs('/searchnational?countrycode=' + this.searchCFN)
        this.lastSearchCriterion = 'cfn-cc'
      } else if (/^(?:[0-9]{1,}(?:\.[0-9]{1,}){3}|[0-9a-f]*:[0-9a-f:]+)(?:\/[0-9]*)?$/i.test(this.searchCFN)) {
        let { result, isError } = validateAndNormalizeCIDROrIP(this.searchCFN)
        if (isError) {
          this.autoOrgIDs = []
          this.manualOrgIDs = []
          this.searchErrorMsg = result
        } else {
          this.getOrgIDs('/searchcidr?address=' + this.searchCFN)
        }
        this.lastSearchCriterion = 'cfn-ip-cidr'
      } else {
        let { result, isError } = validateAndNormalizeDomain(this.searchCFN)
        if (isError) {
          this.autoOrgIDs = []
          this.manualOrgIDs = []
          this.searchErrorMsg = result
        } else {
          this.getOrgIDs('/searchfqdn?domain=' + result)
        }
        this.lastSearchCriterion = 'cfn-fqdn'
      }
      this.lastSearchValue = this.searchCFN

      // Modify the URL, this enables bookmarking of this search.
      this.$router.replace({query: {cfn: this.searchCFN}})
    },
    lookupTag: function () {
      this.searchASN = ''
      this.searchEmail = ''
      this.searchDisabledEmail = ''
      this.searchName = ''
      this.searchCFN = ''
      this.getOrgIDs('/annotation/search?tag=' + this.searchTag)
      this.lastSearchCriterion = 'tag'
      this.lastSearchValue = this.searchTag

      // Modify the URL, this enables bookmarking of this search.
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
          let errOrg = {name: ids[index], errorMsg: 'Got invalid JSON.'}
          orgList.splice(index, 1, errOrg)
        })
      }, (response) => {
        // no valid response
        let errOrg = {name: ids[index], errorMsg: ''}
        if (response.status === 0) {
          errOrg.errorMsg = 'Failed to connect properly.'
          orgList.splice(index, 1, errOrg)
        } else {
          response.text().then((bodyText) => {
            // FIXME: use logic from errorHelper.js
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
          this.annotationHintsErrorMsg = 'Got invalid JSON from server.'
        })
      }, (response) => {
        // no valid response
        this.setErrorMsg(response, 'annotationHintsErrorMsg')
      })
    },
    newOrg () {
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
      this.highlightPendingOrg(this.pendingOrgs.length - 1)
    },
    cloneOrg (index, event) {
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
      this.highlightPendingOrg(this.pendingOrgs.length - 1)
    },
    editOrg (index) {
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
            this.highlightPendingOrg(index)
            return
          }
          if (this.pendingOrgIndex[index] === 'delete') {
            // change it to update
            // (We have to use splice for Vue to notice the change
            // see https://vuejs.org/v2/guide/list.html#Caveats)
            this.pendingOrgIndex.splice(index, 1, 'update')
            this.highlightPendingOrg(index)
            return
          }
        }
      }

      // deep-copy the org
      var editingOrg = JSON.parse(strMe)

      // add it to commit queue as UPDATE
      this.pendingOrgs.push(editingOrg)
      this.pendingOrgIndex.push('update')
      this.highlightPendingOrg(this.pendingOrgs.length - 1)
    },
    trashOrg (index) {
      // remove a pendingOrg
      this.pendingOrgIndex.splice(index, 1)
      this.pendingOrgs.splice(index, 1)
    },
    deleteOrg (index) {
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
    highlightPendingOrg (index) {
      // scroll to a created/updated pending orgcard and play a highlighting
      // animation
      this.$nextTick(function () {
        const el = document.getElementById('pending-org-' + index).children[0]
        const {top} = el.getBoundingClientRect()
        document.documentElement.scroll({
          top: window.scrollY + top - window.innerHeight * 0.05,
          behavior: 'smooth'
        })
        el.animate(
          {outline: ['solid #ffa50000', 'solid #ffa500ff', 'solid #ffa50000']},
          1300
        )
      })
    },
    clearPendingOrgs () {
      // TODO add some debounce, throttle or other safety function
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
      // those will fail when committing

      // https://github.com/vuejs/vue/issues/1953#issuecomment-567855890
      if (this.$children.some(child =>
        child.$options.name === 'org-card' && (
          Object.keys(child.validationErrors).length !== 0 ||
          child.$children.some(child2 => child2.$options.name === 'org-fqdns' && child2.commitVeto)
        )
      )) {
        this.commitPendingOrgsErrorMsg = 'Some field(s) failed validation.'
        // console.log(this.$children.filter(c => c.$options.name === 'org-card').map(c => c.validationErrors))
        return
      }

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
          this.commitPendingOrgsErrorMsg = 'Got invalid JSON from server.'
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
        this.orgSchemaDraft = new Draft07(schema, {
          validateFormat: {
            cidr: (node, value) => {
              const { schema, pointer } = node
              if (typeof value === 'string' && value) {
                const { result, isError } = validateAndNormalizeCIDROrIP(value)
                if (isError) {
                  return {
                    type: 'error',
                    code: 'cidr-error',
                    name: 'CidrError',
                    message: result,
                    data: { value, schema, pointer }
                  }
                }
              }
            }
          }
        })
      }, (response) => {
        this.schemaErrorMsg = 'Got invalid JSON from server.'
      })
    }, (response) => {
      // no valid response
      this.setErrorMsg(response, 'schemaErrorMsg')
    })
  }
}
</script>
