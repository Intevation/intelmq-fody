<template>
  <div v-if="!editable">
    <span v-if="value.tag !== 'inhibition'" class="label label-info"
      >{{ value.tag }}</span>
    <span v-else v-bind:class="annoClass"
      >{{ value.condition }}</span>
  </div>
  <div v-else class="list-group form-horizontal">
    <div v-bind:class="annoClass">
      <div v-if="value.tag === 'inhibition'" class="form-group">
        (inhibition editing not supported yet) {{ value.condition }}
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
module.exports = {
  name: 'org-annotation',
  props: ['status', 'value'],
  data: function () {
    return {
    }
  },
  computed: {
    editable: function () {
      return (this.status === 'create' || this.status === 'update')
    },
    annoClass: function () {
      return {
        'list-group-item': this.value.tag !== 'inhibition',
        'list-group-item list-group-item-warning':
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
