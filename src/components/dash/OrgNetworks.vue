<template>
  <div v-if="editable || internalValue.length > 0" class="list-group">
    <div v-if="!editable">Networks:</div>
    <div v-for="(network, index) in internalValue"
        class="list-group-item">
      <org-network v-model="internalValue[index]" v-on:input="update" v-bind:status="status"
        v-on:deleteMe="internalValue.splice(index, 1)"
        v-bind:annotation-hints="annotationHints"
        v-bind:errorMessage="errorMessages[index]"/>
    </div>
    <template v-if="editable">
      <button type="button" class="list-group-item btn btn-default"
              v-on:click="internalValue.push({address: '', annotations: [], comment: ''}), update()">
        <i class="fa fa-plus"></i>
        Network
      </button>
      <button type="button" class="list-group-item btn btn-default" data-toggle="modal"
          v-bind:data-target="`#modal-networks-import-${getUid()}`">
        <i class="fa fa-list-ul"></i>
        Bulk Import
      </button>
      <div class="modal fade" tabindex="-1" role="dialog" data-backdrop="false"
        v-bind:id="`modal-networks-import-${getUid()}`">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                  v-bind:id="`modal-networks-close-${getUid()}`">
                <span aria-hidden="true">×</span></button>
              <h4 class="modal-title">Bulk Import of Network Addresses (CIDRs)</h4>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label v-bind:for="`networks-import-data-${getUid()}`">Networks (separated by newlines)</label>
                <textarea class="form-control" placeholder="141.39.0.0/16" v-model="importData"
                    v-bind:id="`networks-import-data-${getUid()}`"/>
                <label v-bind:for="`networks-import-comment-${getUid()}`">Comment</label>
                <input type="text" class="form-control" v-model="importComment"
                  v-bind:id="`networks-import-comment-${getUid()}`"/>
                <ul>
                  <li v-for="msg in processedImportData.errors">{{ msg }}</li>
                </ul>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary"
                  v-bind:disabled="processedImportData.errors.length > 0 || processedImportData.cidrs.length === 0"
                  v-on:click="doImport">
                Import
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
  <div v-else></div>
</template>

<script>
import orgNetwork from './OrgNetwork.vue'
import { unfilterArray, mapFilteredIndices } from '../../util/unfilterArray.js'

const ipaddr = require('ipaddr.js')

var nextId = 0

const isNonEmpty = network =>
  network.address !== '' ||
  network.comment !== '' ||
  network.annotations.length !== 0

module.exports = {
  name: 'org-networks',
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
  components: { orgNetwork },
  data () {
    return {
      internalValue: JSON.parse(JSON.stringify(this.value)),
      uniqueId: null,
      importData: '',
      importComment: ''
    }
  },
  computed: {
    editable () {
      return ['create', 'update'].includes(this.status)
    },
    errorMessages () {
      return mapFilteredIndices(this.internalValue, isNonEmpty, i => this.errorFn(`${i}/address`))
    },
    processedImportData () {
      var values = this.importData.split('\n').map(x => x.trim()).filter(x => x)
      var cidrs = []
      var errors = []
      var parsed
      var noBits = {}
      for (var v of values) {
        try {
          parsed = ipaddr.parseCIDR(v)
        } catch (e) {
          try {
            parsed = [ipaddr.parse(v), noBits]
          } catch (e2) {
            errors.push(`${v} cannot be parsed as CIDR or IP address`)
            continue
          }
        }
        if (parsed[1] === noBits) {
          if (parsed[0].kind() === 'ipv4') {
            if (parsed[0].toByteArray()[3] === 0) {
              errors.push(`${v} looks like a network (ends in .0) but has no netmask`)
              continue
            }
            parsed[1] = 32
          } else {
            errors.push(`${v}: behavior for IPv6 addresses without netmask not implemented`)
            continue
          }
        } else {
          if (
            parsed[0].toNormalizedString() !==
            (parsed[0].kind() === 'ipv4' ? ipaddr.IPv4 : ipaddr.IPv6).networkAddressFromCIDR(v).toNormalizedString()
          ) {
            errors.push(`${v} has host bits set`)
            continue
          }
        }
        cidrs.push(`${parsed[0].toString()}/${parsed[1]}`)
      }
      return { cidrs, errors }
    }
  },
  watch: {
    value (newValue) {
      this.internalValue = JSON.parse(JSON.stringify(unfilterArray(this.internalValue, newValue, isNonEmpty)))
      if (!newValue.every(isNonEmpty)) this.update()
    }
  },
  methods: {
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
      for (var el of processed.cidrs.map(address => ({address, annotations: [], comment})).filter(isNonEmpty)) {
        this.internalValue.push(el)
      }
      this.update()
      this.importData = ''
      this.importComment = ''
      document.getElementById(`modal-networks-close-${this.getUid()}`).click()
      // FIXME: The proper way tho close the modal would be:
      // $(`#modal-networks-import-${this.getUid()}`).modal('hide')
      // but that currently throws "[...].modal is not a function" for some reason
      // See also OrgFqdns.vue, Dash.vue
    }
  },
  created () {
    if (!this.internalValue.every(isNonEmpty)) this.update()
  }
}
</script>
