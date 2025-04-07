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
    <button v-if="editable"
            v-on:click="internalValue.push({address: '', annotations: [], comment: ''}), update()"
        class="list-group-item btn btn-default">
      <i class="fa fa-plus"></i>
      Network
    </button>
  </div>
  <div v-else></div>
</template>

<script>
import orgNetwork from './OrgNetwork.vue'
import { unfilterArray, mapFilteredIndices } from '../../util/unfilterArray.js'

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
      internalValue: JSON.parse(JSON.stringify(this.value))
    }
  },
  computed: {
    editable () {
      return ['create', 'update'].includes(this.status)
    },
    errorMessages () {
      return mapFilteredIndices(this.internalValue, isNonEmpty, i => this.errorFn(`${i}/address`))
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
