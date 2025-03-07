<template>
  <div v-show="errorMessage" class="help-block">
    {{ errorMessage }}
  </div>
</template>

<script>
module.exports = {
  name: 'validation-error',
  props: {
    errorMessage: String
  }
}
</script>
