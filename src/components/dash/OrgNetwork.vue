<template>
  <div v-bind:class="outerClass">
    <div class="list-group-item">
      <div v-if="editable" class="form-group">
        <label class="col-sm-4 control-label">Address</label>
        <div class="col-sm-8">
          <input type="text" v-model="value.address" class="col-sm-8" />
        </div>
      </div>
      <div v-else>
        {{ value.address }}
      </div>
      <div  v-if="editable" class="form-group">
        <label class="col-sm-4 control-label">Comment</label>
        <div class="col-sm-8">
          <input type="text" v-model="value.comment" class="form-control" />
        </div>
      </div>
      <em v-else-if="value.comment !== ''" class="list-group-item"
      >({{ value.comment }})</em>
    </div>

    <div v-if="'annotations' in value && value.annotations.length > 0">
      <div v-for="(annotation, index) in value.annotations"
           class="list-group-item">
        <org-annotation v-model="value.annotations[index]"
                        v-bind:status="status"
                        v-on:deleteMe="value.annotations.splice(index, 1)" />
      </div>
      <button v-if="editable"
          v-on:click="org.networks.push({tag: ''})"
          class="list-group-item btn btn-default btn-xs">
        <i class="fa fa-plus"></i>
      </button>
    </div>

    <div v-if="editable" class="list-group form-horizontal">
      <button v-on:click="$emit('deleteMe')" class="btn btn-default btn-xs">
        <i class="fa fa-minus"></i>
      </button>
    </div>
  </div>
</template>
<script>
import orgAnnotation from './OrgAnnotation.vue'

module.exports = {
  name: 'org-network',
  props: ['status', 'value'],
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
  }
}

</script>
