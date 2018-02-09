<template>
  <input ref="input" type="text" v-bind:value="value"
    v-on:input="updateValue($event.target.value)"></input>
  </span>
</template>
<script>
// Documentation:
// This component allows entering
// unsigned integers [0, 1, 2, .., Number.MAX_VALUE] or ''
// via a text input field; not offering increment and decrement functionality.
// It will go back to the last valid input, if a different char is entered
// and this may cause the cursor to jump to the end of the value, because
// the cursor position is not retained.
module.exports = {
  name: 'input-unsigned-int',
  props: {
    'value': [Number, String]
  },
  data: function () {
    return {
      previousValue: (/^[0-9]+$/.test(this.value)
                      ? Number.parseInt(this.value, 10) : '')
    }
  },
  methods: {
    updateValue: function (value) {
      var sanitizedValue = Number.parseInt(value, 10)

      if (value === '') {
        sanitizedValue = ''
      } else if (!/^[0-9]+$/.test(value)) {
        sanitizedValue = this.previousValue
      }

      this.previousValue = sanitizedValue

      // see vue guide section: # Form Input Components using Custom Events
      if (sanitizedValue !== Number(value)) {
        this.$refs.input.value = sanitizedValue
      }

      this.$emit('input', sanitizedValue)
    }
  }
}
</script>
