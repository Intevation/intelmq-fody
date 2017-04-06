<template>
  <div>
    {{ value.address }}
    {{ value.annotations }}
    <em v-if="!editable && value.comment !== ''">({{ value.comment }})</em>
    <div v-if="editable">
      Comment:
      <input type="text" v-model="value.comment" class="form-control"></input>
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
