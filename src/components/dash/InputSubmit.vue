<template>
  <input v-model="internalValue" v-on:input="$emit('input', internalValue)" v-on:keydown="$event.key === 'Enter' ? $emit('submit') : null">
</template>

<script>
module.exports = {
  name: 'input-submit',
  props: {
    'value': String
  },
  data () {
    return {internalValue: this.value}
  },
  watch: {
    value (newValue) {
      this.internalValue = newValue
    }
  }
}
</script>
