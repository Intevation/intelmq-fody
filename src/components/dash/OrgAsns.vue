<template>
  <ul v-if="!editable" class="list-group">
    <li v-for="asnObj of internalValue" class="list-group-item">
      <i class="fa fa-hdd-o rme"></i>
      AS{{ asnObj.asn }}
      <org-annotations
        v-if="'annotations' in asnObj && asnObj.annotations.length > 0"
        v-model="asnObj.annotations" v-on:input="update" v-bind:status="status"
        v-bind:annotation-hints="annotationHints"/>
    </li>
  </ul>
  <div v-else class="list-group form-horizontal">
    <div v-for="(asnObj, index) in internalValue" class="list-group-item">
      <div class="form-group">
        <label class="col-sm-2 control-label">
          <i class="fa fa-hdd-o rme"></i>ASN</label>
          <div class="col-sm-10">
            <input-unsigned-int v-model="asnObj.asn" v-on:input="update"
              class="form-control"></input-unsigned-int>
        </div>
        <validation-error
          v-bind:errorMessage="errorMessages[index]"
          class="col-sm-8 col-sm-offset-4"/>
      </div>
      <org-annotations v-if="'annotations' in asnObj"
        v-model="asnObj.annotations" v-on:input="update" v-bind:status="status"
        v-bind:annotation-hints="annotationHints"/>
      <button v-on:click="internalValue.splice(index, 1), update()"
              class="btn btn-default btn-xs">
        <i class="fa fa-minus"></i>
      </button>
    </div>
    <button v-on:click="internalValue.push({annotations: [], asn: ''}), update()"
            class="list-group-item btn btn-default">
      <i class="fa fa-plus"></i>
      <i class="fa fa-hdd-o"></i>
    </button>
  </div>
</template>

<script>
import orgAnnotations from './OrgAnnotations.vue'
import inputUnsignedInt from './InputUnsignedInt.vue'
import validationError from './ValidationError.vue'
import { unfilterArray, mapFilteredIndices } from '../../util/unfilterArray.js'

const isNonEmpty = asnObj => asnObj.asn !== '' || (asnObj.annotations || []).length !== 0

module.exports = {
  name: 'org-asns',
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
  components: { orgAnnotations, inputUnsignedInt, validationError },
  data () {
    return {
      internalValue: JSON.parse(JSON.stringify(this.value))
    }
  },
  computed: {
    editable () {
      return ['create', 'update'].includes(this.status)
    },
    errorMessages () {
      return mapFilteredIndices(this.internalValue, isNonEmpty, i => this.errorFn(`${i}/asn`))
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
    }
  },
  created () {
    if (!this.internalValue.every(isNonEmpty)) this.update()
  }
}
</script>
