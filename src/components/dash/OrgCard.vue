<template>
  <div class="container"> <!-- Container for column layout -->
    <div class="panel" v-bind:class="computedPanelClass">
      <div class="panel-heading clearfix">
        <span v-if="!editable">
          <h3 class="panel-title pull-left">
            <i class="fa fa-id-badge rme"></i>
            {{ internalValue.name }}
          </h3>
          <span v-if="status !=='delete'"
                class="badge primary pull-right">{{ status }}</span>
          <span v-if="status ==='delete'"
                class="badge danger pull-right">{{ status }}</span>
        </span>
        <span v-if="editable">
          <span class="input-group input-group-sm">
            <span class="input-group-addon">
              <i class="fa fa-id-badge rme"></i>
            </span>
            <input class="form-control"
              placeholder="Name"
              v-model.trim="internalValue.name" v-on:input="update"
              type="text">
            <span class="input-group-addon">
              <span class="badge warning pull-right">{{ status }}</span>
            </span>
          </span>
          <validation-error v-bind:errorMessage="getErrorMessage('#/name')"/>
        </span>
      </div>

      <div v-if='internalValue.errorMsg' class="panel-body text-warning">
        Loading failed:<br>
        <span style="white-space: pre-line;">{{ internalValue.errorMsg }}</span>
      </div>
      <div v-else class="panel-body">

        <!-- contact details section -->
        <ul v-if="!editable" class="list-group">
          <li v-for="(contact, index) of internalValue.contacts" class="list-group-item">
            <div class="row">
              <contact-email v-model="internalValue.contacts[index]" v-on:input="update"
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
        <div v-if="editable" class="list-group form-horizontal">
          <div v-for="(contact, index) in internalValue.contacts" class="list-group-item">
            <contact-email
              v-model="internalValue.contacts[index]" v-on:input="update"
              v-bind:status="status"
              v-bind:annotationHints="annotationHints"
              v-bind:errorMessage="getErrorMessage(`#/contacts/${index}/email`)"/>
            <div class="form-group">
              <label class="col-sm-1 control-label">
                <i class="fa fa-phone"></i></label>
                <div class="col-sm-10">
                  <input v-model.trim="internalValue.contacts[index].tel" v-on:input="update"
                    type="tel" class="form-control"></input>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-1 control-label">
                <i class="fa fa-key"></i></label>
                <div class="col-sm-10">
                  <input v-model.trim="internalValue.contacts[index].openpgp_fpr" v-on:input="update"
                    type="text" class="form-control"></input>
              </div>
            </div>
            <button v-on:click="internalValue.contacts.splice(index, 1), update()"
                    class="btn btn-default btn-xs">
              <i class="fa fa-minus"></i>
            </button>
          </div>
          <button v-on:click="internalValue.contacts.push(newContactTemplate()), update()"
                  class="list-group-item btn btn-default">
            <i class="fa fa-plus"></i>
            <i class="fa fa-envelope-o"></i>
          </button>
        </div>

        <!-- ASN section -->
        <ul v-if="!editable" class="list-group">
          <li v-for="asn of internalValue.asns" class="list-group-item">
            <i class="fa fa-hdd-o rme"></i>
            AS{{ asn.asn }}
            <org-annotations
              v-if="'annotations' in asn && asn.annotations.length > 0"
              v-model="asn.annotations" v-on:input="update" v-bind:status="status"
              v-bind:annotation-hints="annotationHints"/>
          </li>
        </ul>
        <div v-if="editable" class="list-group form-horizontal">
          <div v-for="(asn, index) in internalValue.asns" class="list-group-item">
            <div class="form-group">
              <label class="col-sm-2 control-label">
                <i class="fa fa-hdd-o rme"></i>ASN</label>
                <div class="col-sm-10">
                  <input-unsigned-int v-model="internalValue.asns[index].asn" v-on:input="update"
                    class="form-control"></input-unsigned-int>
              </div>
              <validation-error
                v-bind:errorMessage="getErrorMessage(`#/asns/${index}/asn`)"
                class="col-sm-8 col-sm-offset-4"/>
            </div>
            <org-annotations v-if="'annotations' in asn"
              v-model="asn.annotations" v-on:input="update" v-bind:status="status"
              v-bind:annotation-hints="annotationHints"/>
            <button v-on:click="internalValue.asns.splice(index, 1), update()"
                    class="btn btn-default btn-xs">
              <i class="fa fa-minus"></i>
            </button>
          </div>
          <button v-on:click="internalValue.asns.push({annotations: [], asn: ''}), update()"
                  class="list-group-item btn btn-default">
            <i class="fa fa-plus"></i>
            <i class="fa fa-hdd-o"></i>
          </button>
        </div>

        <!-- networks section -->
        <div v-if="editable || internalValue.networks.length > 0" class="list-group">
          <div v-if="!editable">Networks:</div>
          <div v-for="(network, index) in internalValue.networks"
              class="list-group-item">
            <org-network v-model="internalValue.networks[index]" v-on:input="update" v-bind:status="status"
              v-on:deleteMe="internalValue.networks.splice(index, 1)"
              v-bind:annotation-hints="annotationHints"
              v-bind:errorMessage="getErrorMessage(`#/networks/${index}/address`)"/>
          </div>
          <button v-if="editable"
                  v-on:click="internalValue.networks.push({address: '', annotations: [], comment: ''}), update()"
              class="list-group-item btn btn-default">
            <i class="fa fa-plus"></i>
            Network
          </button>
        </div>

        <!-- fqdns section -->
        <org-fqdns
          v-model="internalValue.fqdns" v-on:input="update" v-bind:status="status"
          v-bind:annotation-hints="annotationHints"
          v-bind:errorFn="makeErrorFn('#/fqdns/')"/>

        <!-- national_certs -->
        <org-national-certs v-model="internalValue.national_certs" v-on:input="update"
                            v-bind:status="status"
                            v-bind:errorFn="makeErrorFn('#/national_certs/')"/>

        <!-- other attributes -->
        <div v-if="!editable" class="well">
          <div v-for="key in Object.keys(otherAttributes).sort()">
              <strong>{{ key }}</strong>: {{ otherAttributes[key] }}
          </div>
        </div>
        <div v-else class="well form-horizontal">
          <div v-for="key in Object.keys(otherAttributes).sort()"
               class="form-group">
            <label class="col-sm-2 control-label">{{ key }}</label>
            <div class="col-sm-10">
              <input-unsigned-int v-if="key === 'sector_id'"
                v-model="internalValue[key]" v-on:input="update" class="form-control"></input-unsigned-int>
              <input v-if="key !== 'sector_id'" type="text"
                v-model.trim="internalValue[key]" v-on:input="update" class="form-control"></input>
            </div>
          </div>
        </div>

        <!-- annotations -->
        <org-annotations v-if="'annotations' in internalValue" v-model="internalValue.annotations" v-on:input="update"
          v-bind:status="status" v-bind:annotation-hints="annotationHints"/>

        <button v-if="editable || status === 'delete'" v-on:click="trashMe"
          ><i class="fa fa-trash-o rme"></i>Scratch</button>
        <button v-if="status === 'auto'" v-on:click="cloneMe"
          class="btn btn-default btn-xs"
          ><i class="fa fa-clone rme"></i>Clone</button>
        <button v-if="status === 'manual'" v-on:click="deleteMe"
          class="btn btn-default btn-xs"
          ><i class="fa fa-trash-o rme"></i>Delete</button>
        <button v-if="status === 'manual'" v-on:click="editMe"
          class="btn btn-default btn-xs"
          ><i class="fa fa-pencil-square-o rme"></i>Edit</button>

      </div> <!-- class="panel-body" -->
    </div>
  </div>
</template>

<script>
import inputUnsignedInt from './InputUnsignedInt.vue'
import orgAnnotations from './OrgAnnotations.vue'
import orgFqdns from './OrgFqdns.vue'
import orgNationalCerts from './OrgNationalCerts.vue'
import orgNetwork from './OrgNetwork.vue'
import contactEmail from './ContactEmail.vue'
import validationError from './ValidationError.vue'

module.exports = {
  name: 'org-card',
  props: {
    'status': String,
    'value': Object,
    'annotationHints': {
      type: Object,
      default: () => ({})
    },
    'orgSchemaDraft': {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      internalValue: JSON.parse(JSON.stringify(this.value)),
      // for knownOrgKeys, the display is handled explicitely
      knownOrgKeys: {
        'asns': 0,
        'annotations': 0,
        'contacts': 0,
        'fqdns': 0,
        'name': 0,
        'networks': 0,
        'national_certs': 0,
        'organisation_id': 0
      },
      contactTemplate: {
        firstname: '',
        lastname: '',
        email: '',
        tel: '',
        comment: '',
        openpgp_fpr: ''
      }
    }
  },
  components: {
    inputUnsignedInt,
    orgAnnotations,
    orgFqdns,
    orgNationalCerts,
    orgNetwork,
    contactEmail,
    validationError
  },
  computed: {
    otherAttributes () {
      // copy over the attributes we are interested in,
      //   otherwise we would modify in place
      var newOrg = {}
      for (var key in this.internalValue) {
        if (this.knownOrgKeys.hasOwnProperty(key) === false) {
          newOrg[key] = this.internalValue[key]
        }
      }
      return newOrg
    },
    editable () {
      return ['create', 'update'].includes(this.status)
    },
    computedPanelClass () {
      return {
        'panel-primary': !this.editable &&
                         this.internalValue.hasOwnProperty('errorMsg') === false,
        'panel-warning': this.editable &&
                         this.internalValue.hasOwnProperty('errorMsg') === false,
        'panel-danger': this.status === 'delete' &&
                        this.internalValue.hasOwnProperty('errorMsg') === false
      }
    },
    validationErrors () {
      if (!this.editable || !this.orgSchemaDraft) {
        return {}
      }
      var newOrg = JSON.parse(JSON.stringify(this.internalValue))
      const validationErrors = this.orgSchemaDraft.validate(newOrg)
      var errors = {}
      for (const err of validationErrors) {
        errors[err.data.pointer] = err
      }
      return errors
    }
  },
  watch: {
    value (newValue) {
      this.internalValue = JSON.parse(JSON.stringify(newValue))
    }
  },
  methods: {
    cloneMe () {
      this.$emit('clone', this.internalValue)
    },
    trashMe () {
      this.$emit('trash')
    },
    deleteMe () {
      this.$emit('delete')
    },
    editMe () {
      this.$emit('edit')
    },
    newContactTemplate () {
      return JSON.parse(JSON.stringify(this.contactTemplate))
    },
    update () {
      var sanitizedValue = JSON.parse(JSON.stringify(this.internalValue))
      // TODO
      this.$emit('input', sanitizedValue)
    },
    getErrorMessage (s) {
      var o = this.validationErrors[s]
      if (!o) return null
      return o.message
    },
    makeErrorFn (prefix) {
      return suffix => this.getErrorMessage(`${prefix}${suffix}`)
    }
  }
}
</script>

<style>
i.rme {
  margin-right: 0.25em
}
i.lme {
  margin-left: 0.35em
}
</style>
