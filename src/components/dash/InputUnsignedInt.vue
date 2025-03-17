<template>
  <input type="text" v-model="inputValue" v-on:input="update">
</template>

<script>
// Documentation:
// This component allows entering
// unsigned integers [0, 1, 2, .., Number.MAX_VALUE] or ''
// via a text input field; not offering increment and decrement functionality.
// It will go back to the last valid input, if a different char is entered
// and this may cause the cursor to jump to the end of the value, because
// the cursor position is not retained.

const sanitize = value => {
  if (value === '') return ''
  if (!/^[0-9]+$/.test(value)) return null
  return Number.parseInt(value, 10)
}

module.exports = {
  name: 'input-unsigned-int',
  props: {
    'value': [Number, String]
  },
  data () {
    return {
      internalValue: this.value,
      inputValue: this.value,
      wasValid: sanitize(this.value) !== null
    }
  },
  methods: {
    update () {
      var sanitizedValue = sanitize(this.inputValue)
      if (sanitizedValue === null) {
        if (this.wasValid) this.inputValue = this.internalValue
        else {
          this.internalValue = this.inputValue
          this.$emit('input', this.internalValue)
        }
      } else {
        this.wasValid = true
        if (sanitizedValue !== this.internalValue) {
          this.internalValue = sanitizedValue
          this.$emit('input', sanitizedValue)
        }
      }
    }
  },
  watch: {
    value (newValue) {
      this.internalValue = newValue
      this.inputValue = newValue
      this.wasValid = sanitize(newValue) !== null
    }
  }
}
</script>
