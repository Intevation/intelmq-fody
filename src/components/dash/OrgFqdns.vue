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
              <input type="text" v-model.trim="fqdnObj.fqdn" v-on:input="update" class="col-sm-10 form-control"/>
            </div>
            <validation-error v-bind:errorMessage="errorMessages[index]"
                              class="col-sm-8 col-sm-offset-4"/>
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
import { unfilterArray, mapFilteredIndices } from '../../util/unfilterArray.js'
import { validateAndNormalizeDomain } from '../../util/idna.js'

var nextId = 0

const isNonEmpty = fqdnObj =>
  fqdnObj.fqdn !== '' ||
  fqdnObj.comment !== '' ||
  fqdnObj.annotations.length !== 0

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
    return {
      internalValue: JSON.parse(JSON.stringify(this.value)),
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
    processedImportData () {
      var values = this.importData.split('\n').map(x => x.trim()).filter(x => x)
      var fqdns = []
      var errors = []
      for (var v of values) {
        var { result, isError } = validateAndNormalizeDomain(v, {removeTrailingDot: true}); // ';' !!
        (isError ? errors : fqdns).push(result)
      }
      return { fqdns, errors }
    }
  },
  methods: {
    deleteMe (index) {
      this.internalValue.splice(index, 1)
    },
    newFqdn (template) {
      this.internalValue.push(template)
    },
    update () {
      this.$emit('input', this.internalValue.filter(isNonEmpty))
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
        this.internalValue.push(el)
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
      this.internalValue = JSON.parse(JSON.stringify(unfilterArray(this.internalValue, newValue, isNonEmpty)))
      if (!newValue.every(isNonEmpty)) this.update()
    }
  },
  created () {
    if (!this.internalValue.every(isNonEmpty)) this.update()
  }
}
</script>
