<template>
  <div class="panel" v-bind:class="computedPanelClass">
    <div class="panel-heading">
      <h3 class="panel-title">
        <span v-if="!editable">
          <i class="fa fa-address-book-o rme"></i>
          {{ org.name }}
          <span class="badge primary">{{ status }}</span>
        </span>
        <span v-if="editable">
            <div class="input-group">
              <span class="input-group-addon">
                <i class="fa fa-address-book-o input-group-addon"></i>
              </span>
              <input v-model="org.name" type="text" class="form-control">
              <span class="input-group-addon">
                <span class="badge danger">{{ status }}</span>
              </span>
            </div>
        </span>
      </h3>
    </div>
    <div class="panel-body">
      <ul class="list-group">
        <li v-for="contact of org.contacts" class="list-group-item">
          <i class="fa fa-envelope-o rme"></i>
          {{ contact.email }}
          <em v-if="contact.comment !== ''">
            ({{ contact.comment }})
          </em>
        </li>
      </ul>
      <ul class="list-group">
        <li v-for="asn of org.asns" class="list-group-item">
          <i class="fa fa-hdd-o rme"></i>
          ASN{{ asn.number }}
        </li>
      </ul>
      <div v-if="!editable" class="well">
        <div v-for="(value, key) in otherAttributes">
            <strong>{{ key }}</strong>: {{ value }}
        </div>
      </div>
      <div v-if="editable" class="well form-horizontal">
        <div v-for="(value, key) in otherAttributes" class="form-group">
          <label class="col-sm-4 control-label">{{ key }}</label>
          <div class="col-sm-8">
            <input v-model="org[key]" class="form-control"></input>
          </div>
        </div>
      </div>
      <button v-if="status === 'auto'" v-on:click="cloneMe">Clone</button>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: 'org-card',
  // because our prop 'org' is an object it is passed by reference (see
  // warning at // https://vuejs.org/v2/guide/components.html#One-Way-Data-Flow)
  // and we use this pecularity to be able to change the properties of org
  // when in status === 'pending' so that changes directly affect our parent
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
        'id': 0,
        'name': 0
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
      return this.status === 'pending'
    },
    computedPanelClass: function () {
      return {
        'panel-primary': !this.editable,
        'panel-danger': this.editable
      }
    }

  },
  methods: {
    cloneMe: function () {
      this.$emit('clone', this.org)
    }
  }
}
</script>

<style>
i.rme {
  margin-right: 0.25em
}
</style>
