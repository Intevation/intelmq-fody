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
  <div v-else class="list-group form-horizontal">
    <div v-bind:class="annoClass">
      <div v-if="value.tag === 'inhibition'" class="form-group">
        Inhibition:
        <annotation-condition v-model="value.condition"
          v-bind:status="status"
          v-bind:condition-hints="conditionHints"/>
      </div>
      <div v-else class="form-group">
        <label class="col-sm-3 control-label">Tag</label>
        <div class="col-sm-8">
          <input type="text" v-model="value.tag" class="form-control" />
        </div>
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
  }
}
</script>
<style>
.label {
  display: inline-block;
}
</style>
