<template>
  <div v-if="!editable && value.length === 0">
  <!-- empty -->
  </div>
  <div v-else class="list-group">
    <div v-if="!editable">Domains:
    </div>
    <div v-for="(fqdn, index) in value" class="list-group-item">
      <div v-bind:class="outerClass">
        <div class="list-group-item">
          <div v-if="editable" class="form-group">
            <label class="col-sm-4 control-label">FQDN</label>
            <div class="col-sm-8">
              <input type="text" v-model="fqdn.fqdn" class="col-sm-8"/>
            </div>
          </div>
          <div v-else>
            {{ fqdn.fqdn }}
            <em v-if="fqdn.comment !== ''">({{ fqdn.comment }})</em>
          </div>
          <div v-if="editable" class="form-group">
            <label class="col-sm-4 control-label">Comment</label>
            <div class="col-sm-8">
              <input type="text" v-model="fqdn.comment" class="form-control" />
            </div>
          </div>
        </div>

        <org-annotations
          v-if="'annotations' in fqdn"
          v-model="fqdn.annotations" v-bind:status="status"
          v-bind:annotation-hints="annotationHints"/>
        <div v-if="editable" class="list-group form-horizontal">
          <button v-on:click="deleteMe(index)" class="btn btn-default btn-xs">
            <i class="fa fa-minus"></i>
          </button>
        </div>
      </div>
    </div>
    <button v-if="editable"
        v-on:click="newFqdn({'address': '', 'comment': '', 'annotations': []})"
        class="list-group-item btn btn-default">
      <i class="fa fa-plus"></i>
      Domain
    </button>
  </div>
</template>
<script>
import orgAnnotations from './OrgAnnotations.vue'

module.exports = {
  name: 'org-fqdns',
  props: {
    'status': String,
    'value': Array,
    'annotationHints': {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data: function () {
    return {
    }
  },
  components: {
    orgAnnotations
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
