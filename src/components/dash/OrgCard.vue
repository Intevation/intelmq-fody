<template>
  <div class="panel" v-bind:class="computedPanelClass">
    <div class="panel-heading">
      <h3 class="panel-title">
        <i class="fa fa-address-book-o rme"></i>
        {{ org.name }}
        <span class="badge primary">{{ status }}</span>
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
      <div class="well">
        <div v-for="(value, key) in otherAttributes">
          <strong>{{ key }}</strong>: {{ value }}
        </div>
      </div>
      <button v-if="status === 'auto'" v-on:click="cloneMe">Clone</button>
    </div>
  </div>
</template>

<script>
module.exports = {
  name: 'org-card',
  props: ['status', 'org'],
  data: function () {
    return {
      // for knownOrgKeys, the display is handled explicitely
      knownOrgKeys: { 'name': 0, 'asns': 0, 'contacts': 0, 'id': 0 }
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
    computedPanelClass: function () {
      return {
        'panel-primary': this.status !== 'pending',
        'panel-danger': this.status === 'pending'
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
