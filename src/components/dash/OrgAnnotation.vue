<template>
  <div v-if="!editable">
    <span v-if="value.tag !== 'inhibition'" class="label label-info"
      >{{ value.tag }}</span>
    <span v-else class="label label-warning"
      >{{ value.condition }}</span>
  </div>
  <div v-else class="list-group form-horizontal">
    <div class="list-group-item">
      <div class="form-group">
      </div>
      <div class="form-group">
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
    }
  }
}
</script>
