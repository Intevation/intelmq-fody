<template>
  <div v-if="!editable && internalValue.length === 0">
  <!-- empty -->
  </div>
  <div v-else class="list-group">
    <div v-if="!editable">Domains:
    </div>
    <div v-for="(fqdnObj, index) in internalValue" class="list-group-item">
      <div v-bind:class="['list-group', editable ? 'form-horizontal' : '']">
        <div class="list-group-item">
          <div v-if="editable" class="form-group">
            <label class="col-sm-2 control-label">FQDN</label>
            <div class="col-sm-10">
              <input type="text" v-model.trim="fqdnObj.fqdn" v-on:input="updateFqdn(index), update()" class="col-sm-10 form-control"/>
            </div>
            <validation-error v-bind:errorMessage="errorMessages[index]"
                              class="col-sm-10 col-sm-offset-2"/>
            <div v-show="showOverrideCheckbox[index]" class="help-block col-sm-10 col-sm-offset-2">
              This doesn't look like a complete FQDN. Use anyway?
              <input type="checkbox" v-model="overrideArray[index]"/> Yes
            </div>
          </div>
          <div v-else>
            {{ fqdnObj.fqdn }}
            <em v-if="fqdnObj.comment">({{ fqdnObj.comment }})</em>
          </div>
          <div v-if="editable" class="form-group">
            <label class="col-sm-2 control-label">Comment</label>
            <div class="col-sm-10">
              <input type="text" v-model.trim="fqdnObj.comment" v-on:input="update" class="form-control" />
            </div>
          </div>
        </div>

        <org-annotations
          v-if="'annotations' in fqdnObj"
          v-model="fqdnObj.annotations" v-on:input="update" v-bind:status="status"
          v-bind:annotation-hints="annotationHints"/>
        <div v-if="editable" class="list-group form-horizontal">
          <button v-on:click="deleteMe(index), update()" class="btn btn-default btn-xs">
            <i class="fa fa-minus"></i>
          </button>
        </div>
      </div>
    </div>
    <template v-if="editable">
      <button type="button" class="list-group-item btn btn-default"
          v-on:click="newFqdn({'fqdn': '', 'comment': '', 'annotations': []}), update()">
        <i class="fa fa-plus"></i>
        Domain
      </button>
      <button type="button" class="list-group-item btn btn-default" data-toggle="modal"
          v-bind:data-target="`#modal-fqdns-import-${getUid()}`">
        <i class="fa fa-list-ul"></i>
        Bulk Import
      </button>
      <div class="modal fade" tabindex="-1" role="dialog" data-backdrop="false"
        v-bind:id="`modal-fqdns-import-${getUid()}`">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                  v-bind:id="`modal-fqdns-close-${getUid()}`">
                <span aria-hidden="true">×</span></button>
              <h4 class="modal-title">Bulk Import of Domains</h4>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label v-bind:for="`fqdns-import-data-${getUid()}`">FQDNs (separated by newlines)</label>
                <textarea class="form-control" placeholder="www.example.com" v-model="importData"
                    v-bind:id="`fqdns-import-data-${getUid()}`"/>
                <label v-bind:for="`fqdns-import-comment-${getUid()}`">Comment</label>
                <input type="text" class="form-control" v-model="importComment"
                  v-bind:id="`fqdns-import-comment-${getUid()}`"/>
                <ul>
                  <li v-for="msg in processedImportData.errors">{{ msg }}</li>
                </ul>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary"
                  v-bind:disabled="processedImportData.errors.length > 0 || processedImportData.fqdns.length === 0"
                  v-on:click="doImport">
                Import
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import orgAnnotations from './OrgAnnotations.vue'
import validationError from './ValidationError.vue'
import { getFilteredIndices, unfilterWithIndices, mapFilteredIndices } from '../../util/unfilterArray.js'
import { validateAndNormalizeDomain, getDomainRelation } from '../../util/idna.js'

import psl from 'psl'

var nextId = 0

const isIncompleteFqdn = fqdn => psl.get(fqdn) === null

const isNonEmpty = fqdnObj =>
  fqdnObj.fqdn !== '' ||
  fqdnObj.comment !== '' ||
  fqdnObj.annotations.length !== 0

const checkFQDNRedundant = (check, checkStr, existing, existingStr, origin) => {
  var relPhrase
  switch (getDomainRelation(check, existing)) {
    case '==':
      relPhrase = 'equivalent to'
      break
    case '<':
      relPhrase = 'a less-specific variant of'
      break
    case '>':
      relPhrase = 'a more-specific variant of'
      break
    default:
      return null
  }
  return `"${checkStr}" is ${relPhrase} "${existingStr}"${origin}`
}

module.exports = {
  name: 'org-fqdns',
  props: {
    'status': String,
    'value': Array,
    'annotationHints': {
      type: Object,
      default: () => ({})
    },
    'errorFn': {
      type: Function,
      default: () => null
    }
  },
  data () {
    var value = this.value
    var fqdns = value.map(x => x.fqdn || null)
    return {
      internalValue: JSON.parse(JSON.stringify(value)),
      overrideArray: fqdns.map(isIncompleteFqdn),
      initialFqdns: fqdns,
      uniqueId: null,
      importData: '',
      importComment: ''
    }
  },
  components: {
    orgAnnotations, validationError
  },
  computed: {
    editable () {
      return ['create', 'update'].includes(this.status)
    },
    errorMessages () {
      return mapFilteredIndices(this.internalValue, isNonEmpty, i => this.errorFn(`${i}/fqdn`))
    },
    showOverrideCheckbox () {
      return this.internalValue.map((v, i) => isNonEmpty(v) && !this.errorMessages[i] && isIncompleteFqdn(v.fqdn))
    },
    commitVeto () { // Used by Contacts.vue
      return this.editable && this.showOverrideCheckbox.some((v, i) => v && !this.overrideArray[i])
    },
    nonEmptyValues () {
      return this.internalValue.filter(isNonEmpty)
    },
    normalizedAndUnnormalizedValidFQDNs () {
      return this.nonEmptyValues.flatMap(v => {
        var f = v.fqdn
        var r = validateAndNormalizeDomain(f)
        return r.isError ? [] : [[r.result, f]]
      })
    },
    processedImportData () {
      var values = this.importData.split('\n').map(x => x.trim()).filter(x => x)
      var fqdns = []
      var unnormalizedFqdns = []
      var errors = []
      for (var v of values) {
        var { result, isError } = validateAndNormalizeDomain(v, {removeTrailingDot: true})
        if (isError) {
          errors.push(result)
          continue
        }
        for (var [normalized, unnormalized] of this.normalizedAndUnnormalizedValidFQDNs) {
          var e = checkFQDNRedundant(result, v, normalized, unnormalized, ', which is already registered for this organization')
          if (e) errors.push(e)
        }
        for (var i = 0; i < fqdns.length; ++i) {
          e = checkFQDNRedundant(result, v, fqdns[i], unnormalizedFqdns[i], ' above it')
          if (e) errors.push(e)
        }
        fqdns.push(result)
        unnormalizedFqdns.push(v)
      }
      return { fqdns, errors }
    }
  },
  methods: {
    deleteMe (index) {
      this.internalValue.splice(index, 1)
      this.overrideArray.splice(index, 1)
      this.initialFqdns.splice(index, -1)
    },
    newFqdn (template) {
      this.internalValue.push(template)
      this.overrideArray.push(false)
      this.initialFqdns.push(null)
    },
    update () {
      this.$emit('input', this.nonEmptyValues)
    },
    updateFqdn (index) {
      this.overrideArray[index] = this.internalValue[index].fqdn === this.initialFqdns[index]
    },
    getUid () {
      var uid = this.uniqueId
      if (uid !== null) return uid
      uid = this.uniqueId = ++nextId
      return uid
    },
    doImport () {
      var processed = this.processedImportData
      if (processed.errors.length > 0) return
      var comment = this.importComment.trim()
      for (var el of processed.fqdns.map(fqdn => ({fqdn, comment, annotations: []})).filter(isNonEmpty)) {
        this.newFqdn(el)
      }
      this.update()
      this.importData = ''
      this.importComment = ''
      document.getElementById(`modal-fqdns-close-${this.getUid()}`).click()
      // FIXME: The proper way tho close the modal would be:
      // $(`#modal-fqdns-import-${this.getUid()}`).modal('hide')
      // but that currently throws "[...].modal is not a function" for some reason
      // See also OrgNetworks.vue, Dash.vue
    }
  },
  watch: {
    value (newValue) {
      var filteredIndices = getFilteredIndices(this.internalValue, isNonEmpty)
      if (this.internalValue.length - filteredIndices.length !== newValue.length) {
        this.internalValue = JSON.parse(JSON.stringify(newValue))
        this.overrideArray = Array(newValue.length).fill(false)
        this.initialFqdns = Array(newValue.length).fill(null)
      } else {
        this.internalValue = JSON.parse(JSON.stringify(unfilterWithIndices(this.internalValue, newValue, filteredIndices)))
      }
      if (!newValue.every(isNonEmpty)) this.update()
    }
  },
  created () {
    if (!this.internalValue.every(isNonEmpty)) this.update()
  }
}
</script>
