<template>
  <div>
    <label class="control-label">{{category}}</label>
    <select v-bind:value="selected"
            v-on:input="setSelected"
            class="form-control btn-info">
      <option value="">Default ({{tags[defaultTag]}})</option>
      <option v-for="(description, tag) in tags"
              v-bind:value="tag">{{ description }}</option>
    </select>
  </div>
</template>

<script>
module.exports = {
  name: 'tag-selection',
  props: {
    'category': String,
    'tags': Object,
    'selected': String,
    'defaultTag': String
  },
  methods: {
    setSelected: function (event) {
      this.$emit('input', {category: this.category, tag: event.target.value})
    }
  }
}
</script>
