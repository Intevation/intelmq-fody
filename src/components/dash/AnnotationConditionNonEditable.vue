<template>
  <div v-if="parsed.error">
    Error: Got invalid condition: <code>{{ json }}</code>
  </div>
  <div v-else>
    <code>{{ parsed.str }}</code>
  </div>
</template>

<script>
function ParseError () {}

const parseRecursive = (v, bo) => {
  if (typeof v === 'string' || typeof v === 'boolean') return JSON.stringify(v)
  if (v instanceof Array) {
    if (v.length === 2 && typeof v[0] === 'string' &&
                          typeof v[1] === 'string') {
      return `${v[0]}[${JSON.stringify(v[1])}]`
    } else if (v.length === 3 && typeof v[0] === 'string') {
      return `${parseRecursive(v[1], bo)} ${bo[v[0]] || JSON.stringify(v[0])} ${parseRecursive(v[2], bo)}`
    }
  }
  throw new ParseError()
}

module.exports = {
  name: 'annotation-condition-non-editable',
  props: {
    'value': [Array, String, Boolean],
    'conditionHints': Object
  },
  computed: {
    parsed () {
      try {
        return {str: parseRecursive(this.value, (this.conditionHints || {}).binary_operators || {})}
      } catch (e) {
        if (!(e instanceof ParseError)) throw e
        return {error: true}
      }
    },
    json () {
      return JSON.stringify(this.value)
    }
  }
}
</script>
