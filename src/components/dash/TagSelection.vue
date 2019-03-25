<template>
  <div>
    <label class="control-label">{{category}}</label>
    <select v-bind:value="selected"
            v-on:input="setSelected"
            class="form-control btn-info">
      <option value="">Default ({{tags[defaultTag]}})</option>
      <option v-for="entry in orderedTags"
              v-bind:value="entry[0]">{{ entry[1] }}</option>
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
  computed: {
    orderedTags: function () {
      return Object.entries(this.tags).sort(
        (a, b) => a[1].localeCompare(b[1], 'de')
      )
    }
  },
  methods: {
    setSelected: function (event) {
      this.$emit('input', {category: this.category, tag: event.target.value})
    }
  }
}
</script>
