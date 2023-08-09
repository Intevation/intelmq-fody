<template>
<div>
  <select v-bind:value="selected"
          v-on:input="setSelected"
          class="form-control btn-info">
    <option v-for="entry in orderedTags"
            v-bind:key="entry[0]"
            v-bind:value="entry[0]">{{ entry[1] }}</option>
  </select>
</div>
</template>

<script>
export default {
  name: 'tag-selection',
  props: {
    'category': String,
    'tags': Object,
    'selected': String,
    'defaultTag': String
  },
  computed: {
    orderedTags: function () {
      var defaultLabel = 'Default'
      if (this.defaultTag !== '') {
        defaultLabel += ' (' + this.tags[this.defaultTag] + ')'
      }
      var sorted = Object.entries(this.tags).sort(
        (a, b) => a[1].localeCompare(b[1], 'de')
      )
      sorted.unshift(['', defaultLabel])
      return sorted
    }
  },
  methods: {
    setSelected: function (event) {
      this.$emit('input', {category: this.category, tag: event.target.value})
    }
  }
}
</script>
