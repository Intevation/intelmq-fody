<template>
  <div class="panel panel-primary">
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
    </div>
  </div>
</template>

<script>
module.exports = {
  name: 'org-card',
  props: ['status', 'org'],
  template: ` <div class="panel panel-primary">
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
                </div>
              </div>`,
  data: function () {
    return {
      // for knownOrgKeys, the display is handled explicitely
      knownOrgKeys: [ 'name', 'asns', 'contacts', 'id' ]
    }
  },
  computed: {
    otherAttributes: function () {
      var newOrg = this.org
      for (var key of this.knownOrgKeys) {
        delete newOrg[key]
      }
      return newOrg
    }
  }
}
</script>

<style>
i.rme {
  margin-right: 0.25em
}
</style>
