<template>
<div v-if="editable || internalValue.length > 0" v-bind:class="outerClass">
  <div v-if="!editable">National-CERT for:
  </div>
  <div v-for="(national_cert, index) in internalValue" class="list-group-item">
    <div class="list-group">
      <div v-if="editable" class="form-group">
        <label class="col-sm-2 control-label">Country</label>
        <div class="col-sm-10">
          <input type="text" v-model.trim="national_cert.country_code" v-on:input="update"
            class="col-sm-10 form-control"/>
        </div>
        <validation-error v-bind:errorMessage="errorFn(`${index}/country_code`)"
                          class="col-sm-8 col-sm-offset-4"/>
      </div>
      <div v-else>
        {{ national_cert.country_code }}
        <em v-if="national_cert.comment !== ''"
          >({{ national_cert.comment }})</em>
      </div>
      <div v-if="editable" class="form-group">
        <label class="col-sm-2 control-label">Comment</label>
          <div class="col-sm-10">
              <input type="text" v-model.trim="national_cert.comment" v-on:input="update"
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
      return this.status === 'create' || this.status === 'update'
    },
    outerClass () {
      return {
        'list-group': !this.editable,
        'list-group form-horizontal': this.editable
      }
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
      this.$emit('input', this.internalValue)
    }
  },
  watch: {
    value (newValue) {
      this.internalValue = JSON.parse(JSON.stringify(newValue))
    }
  }
}
</script>
