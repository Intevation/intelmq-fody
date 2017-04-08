<template>
<!-- Binary Operator -->
<div v-if="isBinaryOperator(value[0])" class="group-inline">
  <annotation-condition v-model="value[1]" v-bind:status="status"
    v-bind:condition-hints="conditionHints"/>
  <div v-if="editable" class="col-sm-2">
      TODO select operator {{ conditionHints.binary_operators[value[0]] }}
  </div>
  <div v-else class="col-sm-1 inline"
    >{{ conditionHints.binary_operators[value[0]]}}
  </div>
  <annotation-condition v-model="value[2]" v-bind:status="status"
    v-bind:condition-hints="conditionHints"/>
</div>

<!-- Field (or unary operator) -->
<div v-else-if="isField(value[0])" class="col-sm-6 inline">
  <div v-if="editable" class="col-sm-5 inline">
    TODO select field {{value[0]}}
  </div>
  <div v-else class="col-sm-6 inline">
  {{value[0]}}
  </div>
  [<annotation-condition v-model="value[1]"
    v-bind:status="status"
    v-bind:condition-hints="conditionHints"/>]
</div>

<!-- Constant -->
<div v-else class="col-sm-5 inline">
  <div v-if="editable">
  TODO select constant '{{ value }}'
  </div>
  <div v-else>
  '{{ value }}'
  </div>
</div>
</template>
<script>
import annotationCondition from './AnnotationCondition.vue'

module.exports = {
  name: 'annotation-condition',
  props: {
    'status': String,
    'value': [Array, String],
    'conditionHints': {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data: function () {
    return {
    }
  },
  components: {
    annotationCondition
  },
  computed: {
    editable: function () {
      return (this.status === 'create' || this.status === 'update')
    }
  },
  methods: {
    isBinaryOperator: function (node) {
      return ('binary_operators' in this.conditionHints &&
              node in this.conditionHints.binary_operators)
    },
    isField: function (node) {
      return ('fields' in this.conditionHints &&
              node in this.conditionHints.fields)
    }
  }
}
</script>
<style>
div.inline {
  display: inline-block;
}
</style>
