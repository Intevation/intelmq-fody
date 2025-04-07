<template>
<div v-bind:class="['list-group', editable ? 'form-horizontal' : '']">
  <div v-for="(annotation, index) in internalValue">
    <org-annotation v-model="internalValue[index]" v-on:input="update"
              v-bind:status="status"
              v-bind:annotation-hints="annotationHints"
              v-on:deleteMe="deleteMe(index)" />
  </div>
  <div v-if="editable" class="list-group-item">
    <button v-on:click="newAnnotation({'tag': ''})"
        class="btn btn-default btn-xs">
      <i class="fa fa-plus"></i>
      Tag
    </button>
    <button v-on:click="newAnnotation({'tag': 'inhibition', 'condition': null})"
        class="btn btn-default btn-xs">
      <i class="fa fa-plus"></i>
      Inhibition
    </button>
  </div>
</div>
</template>

<script>
import orgAnnotation from './OrgAnnotation.vue'
import { unfilterArray } from '../../util/unfilterArray.js'

const isNonEmpty = v => v !== null

module.exports = {
  name: 'org-annotations',
  props: {
    'status': String,
    'value': Array,
    'annotationHints': {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      internalValue: JSON.parse(JSON.stringify(this.value))
    }
  },
  watch: {
    value (newValue) {
      this.internalValue = JSON.parse(JSON.stringify(unfilterArray(this.internalValue, newValue, isNonEmpty)))
    }
  },
  components: {
    orgAnnotation
  },
  computed: {
    editable () {
      return ['create', 'update'].includes(this.status)
    }
  },
  methods: {
    update () {
      this.$emit('input', this.internalValue.filter(isNonEmpty))
    },
    deleteMe (index) {
      this.internalValue.splice(index, 1)
      this.update()
    },
    newAnnotation (template) {
      this.internalValue.push(template)
      this.update()
    }
  }
}
</script>
