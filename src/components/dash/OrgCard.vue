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
        </span>
      </div>

      <div class="panel-body">

        <!-- contact details section -->
        <ul v-if="!editable" class="list-group">
          <li v-for="contact of org.contacts" class="list-group-item">
            <div class="row">
              <div class="col-sm-1 col-xs-1"
                ><i class="fa fa-envelope-o"></i></div>
              <div class="col-sm-10 col-xs-10">
                {{ contact.firstname }} {{ contact.lastname }}
                &lt;{{ contact.email }}&gt;
                <em v-if="contact.comment !== ''">({{ contact.comment }})</em>
              </div>
              <div v-if="contact.tel !== ''" class="col-sm-1 col-xs-1"
                ><i class="fa fa-phone"></i></div>
              <div v-if="contact.tel !== ''" class="col-sm-10 col-xs-10"
                >{{ contact.tel }}</div>
              <div v-if="contact.openpgp_fpr !== ''" class="col-sm-1 col-xs-1"
                ><i class="fa fa-key"></i></div>
              <div v-if="contact.openpgp_fpr !== ''" class="col-sm-10 col-xs-10"
                >{{ contact.openpgp_fpr }}</div>
            </div>
          </li>
        </ul>
        <div v-if="editable" class="list-group form-horizontal">
          <div v-for="(contact, index) in org.contacts" class="list-group-item">
            <div class="form-group">
              <label class="col-sm-1 control-label">
                <i class="fa fa-envelope-o"></i></label>
                <div class="col-sm-10">
                  <input v-model="org.contacts[index].email"
                    type="email" class="form-control"></input>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label">
                Firstname
              </label>
                <div class="col-sm-8">
                  <input v-model="org.contacts[index].firstname"
                    type="text" class="form-control"></input>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label">
                Lastname
              </label>
                <div class="col-sm-8">
                  <input v-model="org.contacts[index].lastname"
                    type="text" class="form-control"></input>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label">
                <em>Comment</em>
              </label>
                <div class="col-sm-8">
                  <input v-model="org.contacts[index].comment"
                    type="text" class="form-control"></input>
              </div>
            </div>
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
            <div class="form-group">
              <label class="col-sm-4 control-label">
                format_id
              </label>
                <div class="col-sm-8">
                  <input v-model="org.contacts[index].format_id"
                    type="number" class="form-control"></input>
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
            ASN{{ asn.asn }}
            <ul v-if="'annotations' in asn" class="list-group">
              Tags:
              <li v-for="anno in asn['annotations']" class="list-group-item">
                {{ anno }}
              </li>
            </ul>
          </li>
        </ul>
        <div v-if="editable" class="list-group form-horizontal">
          <div v-for="(asn, index) in org.asns" class="list-group-item">
            <div class="form-group">
              <label class="col-sm-4 control-label">
                <i class="fa fa-hdd-o rme"></i>ASN</label>
                <div class="col-sm-8">
                  <input v-model="org.asns[index].asn"
                    type="number" class="form-control"></input>
              </div>
            </div>
            <ul v-if="'annotations' in asn" class="list-group">
              <em>Tags (editing not supported):</em>
              <li v-for="anno in asn['annotations']" class="list-group-item">
                {{ anno }}
              </li>
            </ul>

            <button v-on:click="org.asns.splice(index,1)"
                    class="btn btn-default btn-xs">
              <i class="fa fa-minus"></i>
            </button>
          </div>
          <button v-on:click="org.asns.push({asn: ''})"
                  class="list-group-item btn btn-default">
            <i class="fa fa-plus"></i>
            <i class="fa fa-hdd-o"></i>
          </button>
        </div>

        <!-- other attributes -->
        <div v-if="!editable" class="well">
          <div v-for="key in Object.keys(otherAttributes).sort()">
              <strong>{{ key }}</strong>: {{ otherAttributes[key] }}
          </div>
        </div>
        <div v-if="editable" class="well form-horizontal">
          <div v-for="(value, key) in otherAttributes" class="form-group">
            <label class="col-sm-4 control-label">{{ key }}</label>
            <div class="col-sm-8">
              <input v-if="key === 'sector_id'" type="number"
                v-model="org[key]" class="form-control"></input>
              <input v-if="key !== 'sector_id'" type="text"
                v-model="org[key]" class="form-control"></input>
            </div>
          </div>
        </div>
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
      </div>
    </div>
  </div>
</template>

<script>
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
  props: ['status', 'org'],
  data: function () {
    return {
      // for knownOrgKeys, the display is handled explicitely
      knownOrgKeys: {
        'asns': 0,
        'contacts': 0,
        'organisation_id': 0,
        'name': 0
      },
      contactTemplate: {
        firstname: '',
        lastname: '',
        email: '',
        tel: '',
        comment: '',
        openpgp_fpr: '',
        format_id: 2
      }
    }
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
        'panel-primary': !this.editable,
        'panel-warning': this.editable,
        'panel-danger': this.status === 'delete'
      }
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
