<template>
  <annotation-condition-non-editable
    v-if="!editable"
    v-bind:value="internalValue" v-bind:conditionHints="conditionHints"/>
  <annotation-condition-editable
    v-else
    v-model="internalValue" v-on:input="update" v-bind:conditionHints="conditionHints"/>
</template>

<script>
import annotationConditionEditable from './AnnotationConditionEditable.vue'
import annotationConditionNonEditable from './AnnotationConditionNonEditable.vue'

module.exports = {
  name: 'annotation-condition',
  components: {annotationConditionEditable, annotationConditionNonEditable},
  props: {
    'status': String,
    'value': [Array, String, Boolean],
    'conditionHints': {
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
      this.internalValue = JSON.parse(JSON.stringify(newValue))
    }
  },
  computed: {
    editable () {
      return ['create', 'update'].includes(this.status)
    }
  },
  methods: {
    update () {
      this.$emit('input', this.internalValue)
    }
  }
}
</script>
