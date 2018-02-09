<template>
  <input type="text" v-bind:value="value"
    v-on:input="updateValue($event.target.value)"></input>
  </span>
</template>
<script>
module.exports = {
  name: 'input-unsigned-int',
  props: {
    'value': [Number, String]
  },
  data: function () {
    return {
    }
  },
  methods: {
    updateValue: function (value) {
      // TODO add checks that we only return an unsigned integer.
      this.$emit('input', Number(value))
    }
  }
}
</script>
