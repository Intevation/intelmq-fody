<template>
  <div class="container"> <!-- Container for column layout -->
    <div class="panel" v-bind:class="computedPanelClass">
      <div class="panel-heading clearfix">
        <span v-if="!editable">
          <h3 class="panel-title pull-left">
            <i class="fa fa-id-badge rme"></i>
            {{ org.name }}
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
              v-model="org.name"
              type="text">
            <span class="input-group-addon">
              <span class="badge warning pull-right">{{ status }}</span>
            </span>
          </span>
          <div v-if="validationErrors['#/name']">
            {{ validationErrors['#/name'].message }}
          </div>
        </span>
      </div>

      <div v-if='org.errorMsg' class="panel-body text-warning">
        Loading failed with
        {{ org.errorMsg }}
      </div>
      <div v-else class="panel-body">

        <!-- contact details section -->
        <ul v-if="!editable" class="list-group">
          <li v-for="(contact, index) of org.contacts" class="list-group-item">
            <div class="row">
              <contact-email v-model="org.contacts[index]"
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
          <div v-for="(contact, index) in org.contacts" class="list-group-item">
            <contact-email v-model="org.contacts[index]"
                           v-bind:status="status"
                           v-bind:annotationHints="annotationHints"
                           v-bind:errors="validationErrors"
                           v-bind:error-prefix="`#/contacts/${index}`"/>
            <div class="form-group">
              <label class="col-sm-1 control-label">
                <i class="fa fa-phone"></i></label>
                <div class="col-sm-10">
                  <input v-model="org.contacts[index].tel"
                    type="tel" class="form-control"></input>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-1 control-label">
                <i class="fa fa-key"></i></label>
                <div class="col-sm-10">
                  <input v-model="org.contacts[index].openpgp_fpr"
                    type="text" class="form-control"></input>
              </div>
            </div>
            <button v-on:click="org.contacts.splice(index,1)"
                    class="btn btn-default btn-xs">
              <i class="fa fa-minus"></i>
            </button>
          </div>
          <button v-on:click="org.contacts.push(newContactTemplate())"
                  class="list-group-item btn btn-default">
            <i class="fa fa-plus"></i>
            <i class="fa fa-envelope-o"></i>
          </button>
        </div>

        <!-- ASN section -->
        <ul v-if="!editable" class="list-group">
          <li v-for="asn of org.asns" class="list-group-item">
            <i class="fa fa-hdd-o rme"></i>
            AS{{ asn.asn }}
            <org-annotations
              v-if="'annotations' in asn && asn.annotations.length > 0"
              v-model="asn.annotations" v-bind:status="status"
              v-bind:annotation-hints="annotationHints"/>
          </li>
        </ul>
        <div v-if="editable" class="list-group form-horizontal">
          <div v-for="(asn, index) in org.asns" class="list-group-item">
            <div class="form-group">
              <label class="col-sm-2 control-label">
                <i class="fa fa-hdd-o rme"></i>ASN</label>
                <div class="col-sm-10">
                  <input-unsigned-int v-model="org.asns[index].asn"
                    class="form-control"></input-unsigned-int>
              </div>
              <div v-if="validationErrors[`#/asns/${index}/asn`]"
                   class="help-block col-sm-8 col-sm-offset-4">
                {{ validationErrors[`#/asns/${index}/asn`].message }}
              </div>
            </div>
            <org-annotations v-if="'annotations' in asn"
              v-model="asn.annotations" v-bind:status="status"
              v-bind:annotation-hints="annotationHints"/>
            <button v-on:click="org.asns.splice(index,1)"
                    class="btn btn-default btn-xs">
              <i class="fa fa-minus"></i>
            </button>
          </div>
          <button v-on:click="org.asns.push({annotations: [], asn: ''})"
                  class="list-group-item btn btn-default">
            <i class="fa fa-plus"></i>
            <i class="fa fa-hdd-o"></i>
          </button>
        </div>

        <!-- networks section -->
        <div v-if="editable || org.networks.length > 0" class="list-group">
          <div v-if="!editable">Networks:</div>
          <div v-for="(network, index) in org.networks"
              class="list-group-item">
            <org-network v-model="org.networks[index]" v-bind:status="status"
              v-on:deleteMe="org.networks.splice(index, 1)"
              v-bind:annotation-hints="annotationHints"
              v-bind:errors="validationErrors"
              v-bind:error-prefix="`#/networks/${index}`"/>
          </div>
          <button v-if="editable"
                  v-on:click="org.networks.push({address: '', annotations: [], comment: ''})"
              class="list-group-item btn btn-default">
            <i class="fa fa-plus"></i>
            Network
          </button>
        </div>

        <!-- fqdns section -->
        <org-fqdns v-model="org.fqdns" v-bind:status="status"
                   v-bind:annotation-hints="annotationHints"
                   v-bind:errors="validationErrors"/>

        <!-- national_certs -->
        <org-national-certs v-model="org.national_certs"
                            v-bind:status="status"
                            v-bind:errors="validationErrors"/>

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
                v-model="org[key]" class="form-control"></input-unsigned-int>
              <input v-if="key !== 'sector_id'" type="text"
                v-model="org[key]" class="form-control"></input>
            </div>
          </div>
        </div>

        <!-- annotations -->
        <org-annotations v-if="'annotations' in org" v-model="org.annotations"
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
import { Draft2019, config } from 'json-schema-library'

import inputUnsignedInt from './InputUnsignedInt.vue'
import orgAnnotations from './OrgAnnotations.vue'
import orgFqdns from './OrgFqdns.vue'
import orgNationalCerts from './OrgNationalCerts.vue'
import orgNetwork from './OrgNetwork.vue'
import contactEmail from './ContactEmail.vue'

const ipaddr = require('ipaddr.js')

const annotationSchema = {
  'type': 'object',
  'properties': {
    'tag': {'type': 'string', 'minLength': 1},
    'condition': {'type': 'array'}
  },
  'required': ['tag']
}

const asnSchema = {
  'type': 'object',
  'properties': {
    'asn': {'type': 'integer', 'minimum': 0},
    'annotations': {
      'type': 'array',
      'items': annotationSchema
    }
  },
  'required': ['asn']
}

const contactSchema = {
  'type': 'object',
  'properties': {
    'firstname': {'type': 'string'},
    'lastname': {'type': 'string'},
    'email': {'type': 'string', 'minLength': 1},
    'tel': {'type': 'string'},
    'comment': {'type': 'string'},
    'openpgp_fpr': {'type': 'string'}
  },
  'required': [
    'firstname',
    'lastname',
    'tel',
    'openpgp_fpr',
    'email',
    'comment'
  ]
}

const nationalCertSchema = {
  'type': 'object',
  'properties': {
    'address': {'type': 'string'},
    'comment': {'type': 'string'},
    'country_code': {'type': 'string', 'pattern': '^[a-zA-Z][a-zA-Z]$'}
  },
  'required': ['address']
}

const networkSchema = {
  'type': 'object',
  'properties': {
    'address': {'type': 'string', 'minLength': 1, 'format': 'cidr'},
    'comment': {'type': 'string'},
    'annotations': {
      'type': 'array',
      'items': annotationSchema
    }
  },
  'required': ['address']
}

const fqdnSchema = {
  'type': 'object',
  'properties': {
    'address': {'type': 'string', 'minLength': 1},
    'comment': {'type': 'string'},
    'annotations': {
      'type': 'array',
      'items': annotationSchema
    }
  },
  'required': ['address']
}

const orgSchemaDef = {
  'type': 'object',
  'properties': {
    'name': {'type': 'string', 'minLength': 1},
    'comment': {'type': 'string'},
    'ripe_org_hdl': {'type': 'string'},
    'ti_handle': {'type': 'string'},
    'first_handle': {'type': 'string'},
    'annotations': {
      'type': 'array',
      'items': annotationSchema
    },
    'asns': {
      'type': 'array',
      'items': asnSchema
    },
    'contacts': {
      'type': 'array',
      'items': contactSchema
    },
    'fqdns': {
      'type': 'array',
      'items': fqdnSchema
    },
    'networks': {
      'type': 'array',
      'items': networkSchema
    },
    'national_certs': {
      'type': 'array',
      'items': nationalCertSchema
    }
  },
  'required': ['name']
}

// customize some of the messages so that they don't contain the
// pointer (JSON path) that we don't need in Fody. E.g. The message
//    "A value is required in `{{pointer}}`"
// is replaced by
//    'A value is required'

config.strings.MinLengthOneError = 'A value is required'
config.strings.PatternError = 'Value should match \'{{description}}\', but received \'{{received}}\''
config.strings.TypeError = 'Expected \'{{value}}\' ({{received}}) to be of type \'{{expected}}\''

const isValidCIDR = function (value) {
  var parsed
  try {
    parsed = ipaddr.parseCIDR(value)
  } catch (e) {
    return 'Cannot be parsed as CIDR'
  }

  const nwaddr = parsed[0].kind() === 'ipv4'
        ? ipaddr.IPv4.networkAddressFromCIDR(value)
        : ipaddr.IPv6.networkAddressFromCIDR(value)

  if (parsed[0].toNormalizedString() !== nwaddr.toNormalizedString()) {
    return `${value} has host bits set`
  }

  return ''
}

const orgSchema = new Draft2019(orgSchemaDef, {
  validateFormat: {
    cidr: (node, value) => {
      const { schema, pointer } = node
      if (typeof value !== 'string' || value === '') {
        return undefined
      }
      const err = isValidCIDR(value)
      if (err !== '') {
        return {
          type: 'error',
          code: 'cidr-error',
          name: 'CidrError',
          message: err,
          data: { value, schema, pointer }
        }
      }
    }
  }
})

module.exports = {
  name: 'org-card',
  // because our prop 'org' is an object it is passed by reference (see
  // warning at // https://vuejs.org/v2/guide/components.html#One-Way-Data-Flow)
  // and we use this pecularity to be able to change the properties of org
  // when editable() so that changes directly affect our parent
  // which should use v-bind and an object ready for manipulation.
  // HINT: This makes "our app’s data flow harder to reason about" and violates
  // vue's intentions, but a better encapsulation can be developed later, if
  // at all necessary.
  props: {
    'status': String,
    'org': Object,
    'annotationHints': {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data: function () {
    return {
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
    inputUnsignedInt, orgAnnotations, orgFqdns, orgNationalCerts, orgNetwork, contactEmail
  },
  computed: {
    otherAttributes: function () {
      // copy over the attributes we are interested in,
      //   otherwise we would modify in place
      var newOrg = {}
      for (var key in this.org) {
        if (this.knownOrgKeys.hasOwnProperty(key) === false) {
          newOrg[key] = this.org[key]
        }
      }
      return newOrg
    },
    editable: function () {
      return (this.status === 'create' || this.status === 'update')
    },
    computedPanelClass: function () {
      return {
        'panel-primary': !this.editable &&
                         this.org.hasOwnProperty('errorMsg') === false,
        'panel-warning': this.editable &&
                         this.org.hasOwnProperty('errorMsg') === false,
        'panel-danger': this.status === 'delete' &&
                        this.org.hasOwnProperty('errorMsg') === false
      }
    },
    validationErrors: function () {
      var newOrg = JSON.parse(JSON.stringify(this.org))
      const validationErrors = orgSchema.validate(newOrg)
      var errors = {}
      for (const err of validationErrors) {
        errors[err.data.pointer] = err
      }
      return errors
    }
  },
  methods: {
    cloneMe: function () {
      this.$emit('clone', this.org)
    },
    trashMe: function () {
      this.$emit('trash')
    },
    deleteMe: function () {
      this.$emit('delete')
    },
    editMe: function () {
      this.$emit('edit')
    },
    newContactTemplate: function () {
      return JSON.parse(JSON.stringify(this.contactTemplate))
    },
    errorsFor: function (path) {
      const err = this.validationErrors['#/' + path]
      return err
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
