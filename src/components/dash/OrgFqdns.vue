<template>
  <div v-if="!editable && internalValue.length === 0">
  <!-- empty -->
  </div>
  <div v-else class="list-group">
    <div v-if="!editable">Domains:
    </div>
    <div v-for="(fqdnObj, index) in internalValue" class="list-group-item">
      <div v-bind:class="['list-group', editable ? 'form-horizontal' : '']">
        <div class="list-group-item">
          <div v-if="editable" class="form-group">
            <label class="col-sm-2 control-label">FQDN</label>
            <div class="col-sm-10">
              <input type="text" v-model.trim="fqdnObj.fqdn" v-on:input="update" class="col-sm-10 form-control"/>
            </div>
            <validation-error v-bind:errorMessage="errorMessages[index]"
                              class="col-sm-8 col-sm-offset-4"/>
          </div>
          <div v-else>
            {{ fqdnObj.fqdn }}
            <em v-if="fqdnObj.comment">({{ fqdnObj.comment }})</em>
          </div>
          <div v-if="editable" class="form-group">
            <label class="col-sm-2 control-label">Comment</label>
            <div class="col-sm-10">
              <input type="text" v-model.trim="fqdnObj.comment" v-on:input="update" class="form-control" />
            </div>
          </div>
        </div>

        <org-annotations
          v-if="'annotations' in fqdnObj"
          v-model="fqdnObj.annotations" v-on:input="update" v-bind:status="status"
          v-bind:annotation-hints="annotationHints"/>
        <div v-if="editable" class="list-group form-horizontal">
          <button v-on:click="deleteMe(index), update()" class="btn btn-default btn-xs">
            <i class="fa fa-minus"></i>
          </button>
        </div>
      </div>
    </div>
    <button v-if="editable"
        v-on:click="newFqdn({'fqdn': '', 'comment': '', 'annotations': []}), update()"
        class="list-group-item btn btn-default">
      <i class="fa fa-plus"></i>
      Domain
    </button>
  </div>
</template>

<script>
import orgAnnotations from './OrgAnnotations.vue'
import validationError from './ValidationError.vue'
import { unfilterArray, mapFilteredIndices } from '../../util/unfilterArray.js'

const isNonEmpty = fqdnObj =>
  fqdnObj.fqdn !== '' ||
  fqdnObj.comment !== '' ||
  fqdnObj.annotations.length !== 0

module.exports = {
  name: 'org-fqdns',
  props: {
    'status': String,
    'value': Array,
    'annotationHints': {
      type: Object,
      default: () => ({})
    },
    'errorFn': {
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
      return ['create', 'update'].includes(this.status)
    },
    errorMessages () {
      return mapFilteredIndices(this.internalValue, isNonEmpty, i => this.errorFn(`${i}/fqdn`))
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
      this.$emit('input', this.internalValue.filter(isNonEmpty))
    }
  },
  watch: {
    value (newValue) {
      this.internalValue = JSON.parse(JSON.stringify(unfilterArray(this.internalValue, newValue, isNonEmpty)))
      if (!newValue.every(isNonEmpty)) this.update()
    }
  },
  created () {
    if (!this.internalValue.every(isNonEmpty)) this.update()
  }
}
</script>
