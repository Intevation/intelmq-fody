<template>
  <div v-if="!editable">
    <span v-if="value.tag !== 'inhibition'" class="label label-info"
      style="display:box"
      >{{ value.tag }}</span>
    <div v-else class="list-group-item list-group-item-warning row">
      <div>Inhibition:
      </div>
      <annotation-condition class="col-sm-10"
        v-model="value.condition" v-bind:status="status"
        v-bind:condition-hints="conditionHints"/>
    </div>
  </div>
  <div v-else class="list-group form-inline">
    <div v-bind:class="annoClass">
      <div v-if="value.tag === 'inhibition'" class="form-group-sm">
        Inhibition:
        <annotation-condition v-model="value.condition"
          v-bind:status="status"
          v-bind:condition-hints="conditionHints"/>
      </div>
      <div v-else class="form-group-sm">
        <label class="control-label">Tag</label>
        <select v-model='selectionValue' class="form-control btn-info">
          <option disabled value="">(custom)</option>
          <option v-for="tag in annotationHints.tags">{{ tag }}</option>
        </select>
        <input type="text" v-model="value.tag" class="form-control" />
      </div>
    </div>
    <button v-on:click="$emit('deleteMe')" class="btn btn-default btn-xs">
      <i class="fa fa-minus"></i>
    </button>
  </div>
</template>
<script>
import annotationCondition from './AnnotationCondition.vue'

module.exports = {
  name: 'org-annotation',
  props: {
    'status': String,
    'value': Object,
    'annotationHints': {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data: function () {
    return {
      selectionValue: ''  // value of tag's <select>
    }
  },
  components: {
    annotationCondition
  },
  computed: {
    conditionHints: function () {
      if ('conditions' in this.annotationHints) {
        return this.annotationHints.conditions
      } else {
        return {}
      }
    },
    editable: function () {
      return (this.status === 'create' || this.status === 'update')
    },
    annoClass: function () {
      return {
        'list-group-item': this.value.tag !== 'inhibition',
        'list-group-item list-group-item-warning row':
          this.value.tag === 'inhibition'
      }
    }
  },
  watch: {
    // we want to allow value.tag to have either a value from the
    // <select> options from annotationHints.tags or a custom,
    // so we have to use a second variable 'selectionValue' and functions
    // to implement that behaviour via watching it an value.tag:
    selectionValue: function (newSelectionValue) {
      if (newSelectionValue !== '') {
        this.value.tag = newSelectionValue
      }
    },
    value: {
      handler: function (newValue) { this.updateSelection(newValue) },
      deep: true
    }
  },
  methods: {
    updateSelection: function (newValue) {
      if (this.annotationHints.tags.indexOf(newValue.tag) >= 0) {
        this.selectionValue = newValue.tag
      } else {
        this.selectionValue = ''
      }
    }
  },
  mounted: function () {
    // make sure the select choice reflects the initial value.tag.
    this.updateSelection(this.value)
  }
}
</script>
<style>
.label {
  display: inline-block;
}
</style>
