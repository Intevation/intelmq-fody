<template>
<div v-bind:class="outerClass">
  <div v-for="(annotation, index) in value">
    <org-annotation v-model="value[index]"
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
    <button v-on:click="newAnnotation({'tag': 'inhibition', 'condition': ''})"
        class="btn btn-default btn-xs">
      <i class="fa fa-plus"></i>
      Inhibition
    </button>
  </div>
</div>
</template>
<script>
import orgAnnotation from './OrgAnnotation.vue'

module.exports = {
  name: 'org-annotations',
  props: {
    'status': String,
    'value': Array,
    'annotationHints': {
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
    orgAnnotation
  },
  computed: {
    editable: function () {
      return (this.status === 'create' || this.status === 'update')
    },
    outerClass: function () {
      return {
        'list-group': !this.editable,
        'list-group form-horizontal': this.editable
      }
    }
  },
  methods: {
    deleteMe: function (index) {
      this.value.splice(index, 1)
      this.$emit('input', this.value)
    },
    newAnnotation: function (template) {
      // preload if inhibition and ..
      if ('condition' in template &&
          'conditions' in this.annotationHints) {
        var conditions = this.annotationHints.conditions
        // .. we only have one binary_operator
        if ('binary_operators' in conditions &&
            Object.keys(conditions.binary_operators).length === 1) {
          template.condition = [
            Object.keys(conditions.binary_operators)[0], '', '']
        }
        // .. we only have one field
        if ('fields' in conditions &&
            Object.keys(conditions.fields).length === 1) {
          template.condition[1] = [Object.keys(conditions.fields)[0], '']
        }
      }
      this.value.push(template)
      this.$emit('input', this.value)
    }
  }
}

</script>
