<template>
  <ul v-if="!editable" class="list-group">
    <li v-for="(contact, index) of internalValue" class="list-group-item">
      <div class="row">
        <contact-email v-model="internalValue[index]" v-on:input="update"
                        v-bind:status="status"
                        v-bind:annotationHints="annotationHints"/>
        <div v-if="contact.tel !== ''" class="col-sm-1 col-xs-1"
          ><i class="fa fa-phone"></i></div>
        <div v-if="contact.tel !== ''" class="col-sm-11 col-xs-11"
          >{{ contact.tel }}</div>
        <div v-if="contact.openpgp_fpr !== ''" class="col-sm-1 col-xs-1"
          ><i class="fa fa-key"></i></div>
        <div v-if="contact.openpgp_fpr !== ''" class="col-sm-11 col-xs-11"
          >{{ contact.openpgp_fpr }}</div>
      </div>
    </li>
  </ul>
  <div v-else class="list-group form-horizontal">
    <div v-for="(contact, index) in internalValue" class="list-group-item">
      <contact-email
        v-model="internalValue[index]" v-on:input="update"
        v-bind:status="status"
        v-bind:annotationHints="annotationHints"
        v-bind:errorMessage="errorMessages[index]"/>
      <div class="form-group">
        <label class="col-sm-1 control-label">
          <i class="fa fa-phone"></i></label>
          <div class="col-sm-10">
            <input v-model.trim="contact.tel" v-on:input="update"
              type="tel" class="form-control"></input>
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-1 control-label">
          <i class="fa fa-key"></i></label>
          <div class="col-sm-10">
            <input v-model.trim="contact.openpgp_fpr" v-on:input="update"
              type="text" class="form-control"></input>
        </div>
      </div>
      <button v-on:click="delContact(index), update()"
              class="btn btn-default btn-xs">
        <i class="fa fa-minus"></i>
      </button>
    </div>
    <button v-on:click="newContact(), update()"
            class="list-group-item btn btn-default">
      <i class="fa fa-plus"></i>
      <i class="fa fa-envelope-o"></i>
    </button>
  </div>
</template>

<script>
import contactEmail from './ContactEmail.vue'
import { unfilterArray, mapFilteredIndices } from '../../util/unfilterArray.js'

// NOTE: email, firstname, lastname, and comment are managed by <contact-email>
const isNonEmpty = contact =>
  contact.email !== '' ||
  contact.firstname !== '' ||
  contact.lastname !== '' ||
  contact.comment !== '' ||
  contact.tel !== '' ||
  contact.openpgp_fpr !== ''

module.exports = {
  name: 'org-contacts',
  props: {
    'status': String,
    'value': Array,
    'annotationHints': {
      type: Object,
      default: () => ({})
    },
    'errorFn': {
      type: Function,
      default: () => null
    }
  },
  components: { contactEmail },
  data () {
    return {
      internalValue: JSON.parse(JSON.stringify(this.value))
    }
  },
  computed: {
    editable () {
      return ['create', 'update'].includes(this.status)
    },
    errorMessages () {
      return mapFilteredIndices(this.internalValue, isNonEmpty, i => this.errorFn(`${i}/email`))
    }
  },
  watch: {
    value (newValue) {
      this.internalValue = JSON.parse(JSON.stringify(unfilterArray(this.internalValue, newValue, isNonEmpty)))
      if (!newValue.every(isNonEmpty)) this.update()
    }
  },
  methods: {
    update () {
      this.$emit('input', this.internalValue.filter(isNonEmpty))
    },
    newContact () {
      this.internalValue.push({
        email: '',
        firstname: '',
        lastname: '',
        comment: '',
        tel: '',
        openpgp_fpr: ''
      })
    },
    delContact (index) {
      this.internalValue.splice(index, 1)
    }
  },
  created () {
    if (!this.internalValue.every(isNonEmpty)) this.update()
  }
}
</script>
