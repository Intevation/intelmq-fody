<template>
<div v-if="editable || internalValue.length > 0" v-bind:class="['list-group', editable ? 'form-horizontal' : '']">
  <div v-if="!editable">National-CERT for:
  </div>
  <div v-for="(nationalCert, index) in internalValue" class="list-group-item">
    <div class="list-group">
      <div v-if="editable" class="form-group">
        <label class="col-sm-2 control-label">Country</label>
        <div class="col-sm-10">
          <input type="text" v-model.trim="nationalCert.country_code" v-on:input="update"
            class="col-sm-10 form-control"/>
        </div>
        <validation-error v-bind:errorMessage="errorFn(`${index}/country_code`)"
                          class="col-sm-8 col-sm-offset-4"/>
      </div>
      <div v-else>
        {{ nationalCert.country_code }}
        <em v-if="nationalCert.comment !== ''"
          >({{ nationalCert.comment }})</em>
      </div>
      <div v-if="editable" class="form-group">
        <label class="col-sm-2 control-label">Comment</label>
          <div class="col-sm-10">
              <input type="text" v-model.trim="nationalCert.comment" v-on:input="update"
                 class="form-control" />
          </div>
      </div>
    </div>
      <div v-if="editable" class="list-group form-horizontal">
        <button v-on:click="deleteMe(index), update()" class="btn btn-default btn-xs">
          <i class="fa fa-minus"></i>
        </button>
      </div>
  </div>
  <button v-if="editable"
      v-on:click="newNationalCert({'country_code': '', 'comment': ''}), update()"
      class="list-group-item btn btn-default">
    <i class="fa fa-plus"></i>
    National CERT
  </button>
</div>
<div v-else></div>
</template>

<script>
import validationError from './ValidationError.vue'
import { unfilterArray } from '../../util/unfilterArray.js'

const isNonEmpty = nationalCert =>
  nationalCert.country_code !== '' ||
  nationalCert.comment !== ''

module.exports = {
  name: 'org-national-certs',
  props: {
    'status': String,
    'value': Array,
    'errorFn': {
      type: Function,
      default: () => null
    }
  },
  data () {
    return {
      internalValue: JSON.parse(JSON.stringify(this.value))
    }
  },
  components: {
    validationError
  },
  computed: {
    editable () {
      return ['create', 'update'].includes(this.status)
    }
  },
  methods: {
    deleteMe (index) {
      this.internalValue.splice(index, 1)
    },
    newNationalCert (template) {
      this.internalValue.push(template)
    },
    update () {
      this.$emit('input', this.internalValue.filter(isNonEmpty))
    }
  },
  watch: {
    value (newValue) {
      this.internalValue = JSON.parse(JSON.stringify(unfilterArray(this.internalValue, newValue, isNonEmpty)))
      if (!newValue.every(isNonEmpty)) this.update()
    }
  },
  created () {
    if (!this.internalValue.every(isNonEmpty)) this.update()
  }
}
</script>
