<template>
  <div v-if="!editable && internalValue.length === 0">
  <!-- empty -->
  </div>
  <div v-else class="list-group">
    <div v-if="!editable">Domains:
    </div>
    <div v-for="(fqdn, index) in internalValue" class="list-group-item">
      <div v-bind:class="outerClass">
        <div class="list-group-item">
          <div v-if="editable" class="form-group">
            <label class="col-sm-2 control-label">FQDN</label>
            <div class="col-sm-10">
              <input type="text" v-model.trim="fqdn.fqdn" v-on:input="update" class="col-sm-10 form-control"/>
            </div>
            <validation-error v-bind:errorMessage="errorMessageGetter(index)"
                              class="col-sm-8 col-sm-offset-4"/>
          </div>
          <div v-else>
            {{ fqdn.fqdn }}
            <em v-if="fqdn.comment !== ''">({{ fqdn.comment }})</em>
          </div>
          <div v-if="editable" class="form-group">
            <label class="col-sm-2 control-label">Comment</label>
            <div class="col-sm-10">
              <input type="text" v-model.trim="fqdn.comment" v-on:input="update" class="form-control" />
            </div>
          </div>
        </div>

        <org-annotations
          v-if="'annotations' in fqdn"
          v-model="fqdn.annotations" v-on:input="update" v-bind:status="status"
          v-bind:annotation-hints="annotationHints"/>
        <div v-if="editable" class="list-group form-horizontal">
          <button v-on:click="deleteMe(index), update()" class="btn btn-default btn-xs">
            <i class="fa fa-minus"></i>
          </button>
        </div>
      </div>
    </div>
    <button v-if="editable"
        v-on:click="newFqdn({'address': '', 'comment': '', 'annotations': []}), update()"
        class="list-group-item btn btn-default">
      <i class="fa fa-plus"></i>
      Domain
    </button>
  </div>
</template>

<script>
import orgAnnotations from './OrgAnnotations.vue'
import validationError from './ValidationError.vue'

module.exports = {
  name: 'org-fqdns',
  props: {
    'status': String,
    'value': Array,
    'annotationHints': {
      type: Object,
      default: () => ({})
    },
    'errorMessageGetter': {
      type: Function,
      default: () => null
    }
  },
  data () {
    return {
      internalValue: JSON.parse(JSON.stringify(this.value))
    }
  },
  components: {
    orgAnnotations, validationError
  },
  computed: {
    editable () {
      return this.status === 'create' || this.status === 'update'
    },
    outerClass () {
      return {
        'list-group': !this.editable,
        'list-group form-horizontal': this.editable
      }
    }
  },
  methods: {
    deleteMe (index) {
      this.internalValue.splice(index, 1)
    },
    newFqdn (template) {
      this.internalValue.push(template)
    },
    update () {
      this.$emit('input', this.internalValue)
    }
  },
  watch: {
    value (newValue) {
      this.internalValue = JSON.parse(JSON.stringify(newValue))
    }
  }
}
</script>
