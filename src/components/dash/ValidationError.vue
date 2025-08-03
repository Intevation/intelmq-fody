<template>
  <div v-show="errorMessage" class="help-block" style="color: maroon;">
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
