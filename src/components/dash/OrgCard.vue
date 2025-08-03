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
        <org-contacts v-model="internalValue.contacts" v-on:input="update" v-bind:status="status"
          v-bind:annotationHints="annotationHints" v-bind:errorFn="makeErrorFn('#/contacts/')"/>

        <!-- ASN section -->
        <org-asns v-model="internalValue.asns" v-on:input="update" v-bind:status="status"
          v-bind:annotationHints="annotationHints" v-bind:errorFn="makeErrorFn('#/asns/')"/>

        <!-- networks section -->
        <org-networks v-model="internalValue.networks" v-on:input="update" v-bind:status="status"
          v-bind:annotationHints="annotationHints" v-bind:errorFn="makeErrorFn('#/networks/')"/>

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
import orgAsns from './OrgAsns.vue'
import orgContacts from './OrgContacts.vue'
import orgFqdns from './OrgFqdns.vue'
import orgNationalCerts from './OrgNationalCerts.vue'
import orgNetworks from './OrgNetworks.vue'
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
      // for knownOrgKeys, the display is handled explicitly
      knownOrgKeys: {
        'asns': 0,
        'annotations': 0,
        'contacts': 0,
        'fqdns': 0,
        'name': 0,
        'networks': 0,
        'national_certs': 0,
        'organisation_id': 0
      }
    }
  },
  components: {
    inputUnsignedInt,
    orgAnnotations,
    orgAsns,
    orgContacts,
    orgFqdns,
    orgNationalCerts,
    orgNetworks,
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
    update () {
      this.$emit('input', this.internalValue)
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
