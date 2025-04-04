<template>
  <div class="row flex-center form-group" style="margin-bottom: 5px;">
    <label class="col-sm-2 control-label">{{ label }}</label>
    <div class="col-sm-5">
      <select v-model="selectValue" v-on:change="selectValueChanged(), update()" class="form-control">
        <option value="custom"><i>Custom</i></option>
        <option v-for="(h, i) of hintValues" v-bind:value="i">{{ h }}</option>
      </select>
    </div>
    <div class="col-sm-5">
      <input type="text" v-model.trim="internalValue" v-on:input="inputValueChanged(), update()" class="form-control" v-bind:placeholder="placeholder">
    </div>
  </div>
</template>

<script>
const parseHints = hints => {
  hints = hints || []
  if (hints instanceof Array) {
    hints = hints.filter(x => x)
    return [hints, hints]
  }
  var k = Object.keys(hints).filter(x => x)
  var v = k.map(x => hints[x])
  return [k, v]
}

module.exports = {
  name: 'select-or-custom',
  props: {
    value: String,
    hints: [Array, Object],
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data () {
    var [hintKeys, hintValues] = parseHints(this.hints)
    return {
      internalValue: this.value,
      selectValue: 'custom',
      hintKeys,
      hintValues
    }
  },
  methods: {
    selectValueChanged () {
      var v = this.selectValue
      this.internalValue = v === 'custom' ? '' : this.hintKeys[v]
    },
    inputValueChanged () {
      var i = this.hintKeys.indexOf(this.internalValue)
      this.selectValue = i >= 0 ? i : 'custom'
    },
    update () {
      this.$emit('input', this.internalValue)
    }
  },
  watch: {
    value (newValue) {
      this.internalValue = this.value
      this.inputValueChanged()
    },
    hints (newHints) {
      [ this.hintKeys, this.hintValues ] = parseHints(newHints)
      this.$nextTick(() => this.inputValueChanged())
    }
  },
  created () {
    this.inputValueChanged()
  }
}
</script>
