<template>
  <div v-bind:class="outerClass">
    <div class="list-group-item">
      <div v-if="editable" class="form-group">
        <label class="col-sm-2 control-label">Address</label>
        <div class="col-sm-10">
          <input type="text" v-model.trim="value.address" class="col-sm-10 form-control"/>
        </div>
        <validation-error v-bind:errorMessage="errorMessage"
                          class="col-sm-8 col-sm-offset-4"/>
      </div>
      <div v-else>
        {{ value.address }}
        <em v-if="value.comment !== ''"
        >({{ value.comment }})</em>
      </div>
      <div v-if="editable" class="form-group">
        <label class="col-sm-2 control-label">Comment</label>
        <div class="col-sm-10">
          <input type="text" v-model="value.comment" class="form-control" />
        </div>
      </div>
    </div>

    <org-annotations
      v-if="'annotations' in value" v-model="value.annotations"
      v-bind:status="status" v-bind:annotation-hints="annotationHints"/>
    <div v-if="editable" class="list-group form-horizontal">
      <button v-on:click="$emit('deleteMe')" class="btn btn-default btn-xs">
        <i class="fa fa-minus"></i>
      </button>
    </div>
  </div>
</template>

<script>
import orgAnnotations from './OrgAnnotations.vue'
import validationError from './ValidationError.vue'

module.exports = {
  name: 'org-network',
  props: {
    'status': String,
    'value': Object,
    'annotationHints': {
      type: Object,
      default: function () {
        return {}
      }
    },
    'errorMessage': String
  },
  data: function () {
    return {
    }
  },
  components: {
    orgAnnotations, validationError
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
  }
}
</script>
