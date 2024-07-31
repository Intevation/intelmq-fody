<template>
<div v-if="editable || value.length > 0" v-bind:class="outerClass">
  <div v-if="!editable">National-CERT for:
  </div>
  <div v-for="(national_cert, index) in value" class="list-group-item">
    <div class="list-group">
      <div v-if="editable" class="form-group">
        <label class="col-sm-2 control-label">Country</label>
        <div class="col-sm-10">
          <input type="text" v-model="national_cert.country_code"
            class="col-sm-10 form-control"/>
        </div>
      </div>
      <div v-else>
        {{ national_cert.country_code }}
        <em v-if="national_cert.comment !== ''"
          >({{ national_cert.comment }})</em>
      </div>
      <div v-if="editable" class="form-group">
        <label class="col-sm-2 control-label">Comment</label>
          <div class="col-sm-10">
              <input type="text" v-model="national_cert.comment"
                 class="form-control" />
          </div>
      </div>
    </div>
      <div v-if="editable" class="list-group form-horizontal">
        <button v-on:click="deleteMe(index)" class="btn btn-default btn-xs">
          <i class="fa fa-minus"></i>
        </button>
      </div>
  </div>
  <button v-if="editable"
      v-on:click="newFqdn({'address': '', 'comment': '', 'annotations': []})"
      class="list-group-item btn btn-default">
    <i class="fa fa-plus"></i>
    National CERT
  </button>
</div>
</template>
<script>
module.exports = {
  name: 'org-national-certs',
  props: {
    'status': String,
    'value': Array
  },
  data: function () {
    return {
    }
  },
  computed: {
    editable: function () {
      return (this.status === 'create' || this.status === 'update')
    },
    outerClass: function () {
      return {
        'list-group': !this.editable,
        'list-group form-horizontal': this.editable
      }
    }
  },
  methods: {
    deleteMe: function (index) {
      this.value.splice(index, 1)
      this.$emit('input', this.value)
    },
    newFqdn: function (template) {
      this.value.push(template)
      this.$emit('input', this.value)
    }
  }
}
</script>
