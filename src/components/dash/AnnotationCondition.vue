<template>
<!-- Binary Operator -->
<div v-if="condition[0] in binary_operators" class="group-inline">
  <annotation-condition v-model="condition[1]" v-bind:status="status"
    v-bind:condition-hints="conditionHints"/>
  <div v-if="editable" class="col-sm-2">
    <div v-if="Object.keys(binary_operators).length === 1">
      {{ binary_operators[condition[0]] }}
    </div>
    <div v-else>
      TODO select operator {{ conditionHints.binary_operators[condition[0]] }}
    </div>
  </div>
  <div v-else class="col-sm-1 inline"
    >{{ conditionHints.binary_operators[condition[0]]}}
  </div>
  <annotation-condition v-model="condition[2]" v-bind:status="status"
    v-bind:condition-hints="conditionHints"/>
</div>

<!-- Field (or unary operator) -->
<div v-else-if="condition[0] in fields" class="col-sm-6 inline">
  <div v-if="editable" class="col-sm-5 inline">
    <div v-if="Object.keys(fields).length === 1">
      {{ Object.keys(fields)[0] }}
    </div>
    <div v-else>
      TODO select field {{condition[0]}}
    </div>
  </div>
  <div v-else class="col-sm-6 inline">
  {{condition[0]}}
  </div>
  [<annotation-condition v-model="condition[1]"
    v-bind:status="status"
    v-bind:condition-hints="conditionHints"/>]
</div>

<!-- Constant -->
<div v-else class="col-sm-5 inline">
  <div v-if="editable">
    <input class="form-control" type="text" v-bind:value="condition"
    v-on:input="updateValue($event.target.value)"/>
  </div>
  <div v-else>
  '{{ condition }}'
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
      condition: this.value
    }
  },
  components: {
    annotationCondition
  },
  computed: {
    editable: function () {
      return (this.status === 'create' || this.status === 'update')
    },
    binary_operators: function () {
      if ('binary_operators' in this.conditionHints) {
        return this.conditionHints.binary_operators
      } else {
        return {}
      }
    },
    fields: function () {
      if ('fields' in this.conditionHints) {
        return this.conditionHints.fields
      } else {
        return {}
      }
    }
  },
  methods: {
    updateValue: function (value) {
      this.$emit('input', String(value))
    }
  }
}
</script>
<style>
div.inline {
  display: inline-block;
}
</style>
