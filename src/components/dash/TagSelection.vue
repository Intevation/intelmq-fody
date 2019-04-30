<template>
<div class="container-fluid" style="margin-top: 15px;">
  <div class="row">
    <div class="col-xs-3">
      <label class="control-label">{{category}}</label>
    </div>
    <div class="col-xs-9">
      <select v-bind:value="selected"
              v-on:input="setSelected"
              class="form-control btn-info">
        <option v-for="entry in orderedTags"
                v-bind:value="entry[0]">{{ entry[1] }}</option>
      </select>
    </div>
  </div>
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
