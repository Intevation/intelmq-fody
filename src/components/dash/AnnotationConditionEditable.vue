<template>
  <div v-if="parseError">
    Error: Format of condition is invalid or editing is not implemented for it: <code>{{ jsonValue }}</code>
  </div>
  <div v-else>
    <div class="row flex-center" style="margin-bottom: 5px;">
      <div class="col-sm-5">
        <select v-model="isBoolean" v-on:change="typeChanged(), update()" class="form-control">
          <option v-bind:value="true">Boolean Constant</option>
          <option v-bind:value="false">Field Check</option>
        </select>
      </div>
    </div>
    <div v-if="parsedBoolean !== null" class="row flex-center">
      <div class="col-sm-5">
        <select v-model="parsedBoolean" v-on:change="update" class="form-control">
          <option v-bind:value="false">false</option>
          <option v-bind:value="true">true</option>
        </select>
      </div>
    </div>
    <div v-else>
      <select-or-custom v-model="parsedNamespace" v-on:input="fieldNamespaceChanged(), update()" v-bind:hints="fieldNamespaceHints" label="Field Namespace" placeholder="Field Namespace"/>
      <select-or-custom v-model="parsedField" v-on:input="update" v-bind:hints="fieldNameHints" label="Field Name" placeholder="Field Name"/>
      <select-or-custom v-model="parsedOperator" v-on:input="update" v-bind:hints="operatorHints" label="Operator" placeholder="Operator"/>
      <div class="row flex-center form-group">
        <label class="col-sm-2 control-label">Value</label>
        <div class="col-sm-5">
          <input type="text" v-model.trim="parsedConstant" v-on:input="update" placeholder="String Constant" class="form-control">
        </div>
      </div>
      <div>
        <span v-if="isEmpty">Incomplete condition</span>
        <code v-else style="color: #000; background-color: transparent;">{{ preview }}</code>
      </div>
    </div>
  </div>
</template>

<script>
import selectOrCustom from './SelectOrCustom.vue'

const parse = value =>
  typeof value === 'boolean'
  ? {
    parseError: false,
    parsedBoolean: value,
    parsedOperator: null,
    parsedNamespace: null,
    parsedField: null,
    parsedConstant: null
  } : value instanceof Array && value.length === 3 &&
      typeof value[0] === 'string' &&
      value[1] instanceof Array && value[1].length === 2 &&
        typeof value[1][0] === 'string' &&
        typeof value[1][1] === 'string' &&
      typeof value[2] === 'string'
  ? {
    parseError: false,
    parsedBoolean: null,
    parsedOperator: value[0],
    parsedNamespace: value[1][0],
    parsedField: value[1][1],
    parsedConstant: value[2]
  } : {
    parseError: true,
    parsedBoolean: null,
    parsedOperator: null,
    parsedNamespace: null,
    parsedField: null,
    parsedConstant: null
  }

const unparse = (obj, fallback) =>
  obj.parseError ? fallback
  : obj.parsedBoolean !== null ? obj.parsedBoolean
  : [obj.parsedOperator, [obj.parsedNamespace, obj.parsedField], obj.parsedConstant]

const fieldsDefault = obj =>
  (obj.conditionHints || {}).fields || {}
const binaryOperatorsDefault = obj =>
  (obj.conditionHints || {}).binary_operators || {}

// This can't be a method because it's used in data()
const makeDefault = obj => {
  var opArray = Object.keys(binaryOperatorsDefault(obj))
  var op = opArray.length === 0 ? '' : opArray.includes('eq') ? 'eq' : opArray[0]
  var nsArray = Object.keys(fieldsDefault(obj))
  var ns = nsArray.length === 0 ? '' : nsArray.includes('event_field') ? 'event_field' : nsArray[0]
  var field = ''
  var value = ''
  return [op, [ns, field], value]
}

module.exports = {
  name: 'annotation-condition-editable',
  components: {selectOrCustom},
  props: {
    'value': [Array, String, Boolean],
    'conditionHints': Object
  },
  data () {
    var value = this.value === null ? makeDefault(this) : this.value
    return {
      internalValue: JSON.parse(JSON.stringify(value)),
      ...parse(value),
      isBoolean: typeof value === 'boolean'
    }
  },
  watch: {
    value (newValue) {
      if (newValue === null) {
        if (this.isEmpty) return
        newValue = makeDefault(this)
      }
      this.internalValue = JSON.parse(JSON.stringify(newValue))
      Object.assign(this, parse(newValue))
      this.isBoolean = typeof newValue === 'boolean'
    }
  },
  computed: {
    jsonValue () {
      return JSON.stringify(this.internalValue)
    },
    fieldNamespaceHints () {
      return Object.keys(fieldsDefault(this))
    },
    fieldNameHints () {
      return fieldsDefault(this)[this.parsedNamespace] || []
    },
    operatorHints () {
      return binaryOperatorsDefault(this)
    },
    isEmpty () {
      return !this.parseError && this.parsedBoolean === null && (
        !this.parsedOperator ||
        !this.parsedNamespace ||
        !this.parsedField
      )
    },
    preview () {
      var op = this.parsedOperator
      op = binaryOperatorsDefault(this)[op] || JSON.stringify(op)
      var ns = this.parsedNamespace
      var field = JSON.stringify(this.parsedField)
      var value = JSON.stringify(this.parsedConstant)
      return `${ns}[${field}] ${op} ${value}`
    }
  },
  methods: {
    update () {
      this.internalValue = unparse(this, this.internalValue)
      this.$emit('input', this.isEmpty ? null : this.internalValue)
    },
    typeChanged () {
      var value = this.internalValue = this.isBoolean ? true : makeDefault(this)
      Object.assign(this, parse(value))
    },
    fieldNamespaceChanged () {
      this.parsedField = ''
    }
  }
}
</script>
