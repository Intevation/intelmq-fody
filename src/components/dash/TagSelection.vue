<template>
  <div>
    <label class="control-label">{{category}}</label>
    <select v-bind:value="selected"
            v-on:input="setSelected"
            class="form-control btn-info">
      <option value="">----</option>
      <option v-for="tag in tags">{{ tag }}</option>
    </select>
  </div>
</template>

<script>
module.exports = {
  name: 'tag-selection',
  props: {
    'category': String,
    'tags': Array,
    'selected': String
  },
  methods: {
    setSelected: function (event) {
      this.$emit('input', {category: this.category, tag: event.target.value})
    }
  }
}
</script>
