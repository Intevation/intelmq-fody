<template>
  <div v-if="!editable">
    {{ value.address }}
    <div v-if="annotations in value && value.annotations.length > 0"
      >({{ value.annotations }})</div>
    <em v-if="value.comment !== ''">({{ value.comment }})</em>
  </div>
  <div v-else class="list-group form-horizontal">
    <div class="list-group-item">
      <div class="form-group">
        <label class="col-sm-4 control-label">Address</label>
        <div class="col-sm-8">
          <input type="text" v-model="value.address" class="col-sm-8" />
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-4 control-label">Comment</label>
        <div class="col-sm-8">
          <input type="text" v-model="value.comment" class="form-control" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
module.exports = {
  name: 'org-network',
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
