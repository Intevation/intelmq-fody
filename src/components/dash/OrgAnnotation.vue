<template>
  <div v-if="!editable">
    <div v-if="internalValue.tag === 'inhibition'" :class="'list-group-item row list-group-item-' + (expired ? 'danger' : 'warning')">
      <div>Inhibition:
      </div>
      <annotation-condition class="col-sm-10" v-model="internalValue.condition" v-on:input="update" v-bind:status="status"
        v-bind:condition-hints="conditionHints" />
      <div style="float: left; clear: both;">
        <span v-if="expired">Expired {{ internalValue.expires }}</span>
        <span v-if="internalValue.expires && !expired">Expires {{ internalValue.expires }}</span>
      </div>
    </div>
    <div v-else>
      <span v-if="internalValue.tag !== 'inhibition'" v-bind:class="tagLabelClass" style="display:box">{{ internalValue.tag }}</span>
      <span v-if="expired">Expired {{ internalValue.expires }}</span>
      <span v-if="internalValue.expires && !expired">Expires {{ internalValue.expires }}</span>
    </div>
  </div>
  <div v-else class="list-group form-horizontal">
    <div v-if="internalValue.tag === 'inhibition'" v-bind:class="annoClass">
      <div class="form-group">
        Inhibition:
        <annotation-condition v-model="internalValue.condition" v-on:input="update" v-bind:status="status" v-bind:condition-hints="conditionHints" />
      </div>
    </div>
    <div class="list-group-item">
      <div v-if="internalValue.tag !== 'inhibition'" class="row flex-center" style="margin-bottom: 5px;">
        <label class="col-sm-2 control-label">Tag</label>
        <div class="col-sm-5">
          <select v-model="tagSelect" v-on:change="tagSelected(), update()" class="form-control btn-info">
            <option value="custom"><i>Custom</i></option>
            <option v-for="(tag, i) of annotationHints.tags" v-bind:value="i">{{ tag }}</option>
          </select>
        </div>
        <div class="col-sm-5">
          <input type="text" v-model.trim="internalValue.tag" v-on:input="tagSet(), update()" class="form-control" placeholder="tag value" />
        </div>
      </div>
      <div class="form-group row flex-center">
        <label class="col-sm-2 control-label">Expires</label>
        <div class="col-sm-4">
          <Flatpickr v-bind:options="flatpickrOptions" v-model:value="internalValue.expires" class="form-control"
            placeholder="optional expiry date" v-on:change="flatpickrDateSelected(), update()" />
        </div>
        <div class="col-sm-1" style="padding-left: 0;">
          <button class="btn btn-default btn-xs" v-on:click="clearExpiryDate(), update()" title="Clear expiry date"><i
              class="fa fa-trash-o rme"></i></button>
        </div>
        <div class="col-sm-5">
          <select name="relative-date" class="form-control relative-date" v-model="relativeDate" v-on:change="relativeDateSelected(), update()">
            <option value="not-relative" disabled style="display: none;"></option>
            <option value="never">Never</option>
            <option value="30-days">30 Days</option>
            <option value="90-days">90 Days</option>
            <option value="180-days">180 Days</option>
            <option value="1-years">1 Year</option>
            <option value="2-years">2 Years</option>
            <option value="3-years">3 Years</option>
          </select>
        </div>
      </div>
    </div>
    <button v-on:click="$emit('deleteMe')" class="btn btn-default btn-xs">
      <i class="fa fa-minus"></i>
    </button>
  </div>
</template>
<script>
import annotationCondition from './AnnotationCondition.vue'
import VueFlatpickr from 'vue-flatpickr'
import 'vue-flatpickr/theme/airbnb.css'

module.exports = {
  name: 'org-annotation',
  props: {
    'status': String,
    'value': Object,
    'annotationHints': {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    var today = new Date().toJSON().split('T')[0]
    return {
      internalValue: JSON.parse(JSON.stringify(this.value)),
      today: today,
      tagSelect: 'custom',  // value of tag's <select> ('custom' or tag index)
      flatpickrOptions: {
        allowInput: true, // allow direct input
        enableTime: false,
        weekNumbers: true,
        minDate: today,
        onChange: this.flatpickrDateSelected
      },
      relativeDate: this.value.expires ? 'not-relative' : 'never'
    }
  },
  components: {
    annotationCondition,
    'Flatpickr': VueFlatpickr
  },
  computed: {
    conditionHints () {
      return 'conditions' in this.annotationHints
        ? this.annotationHints.conditions : {}
    },
    editable () {
      return this.status === 'create' || this.status === 'update'
    },
    annoClass () {
      return {
        'list-group-item': this.internalValue.tag !== 'inhibition',
        'list-group-item list-group-item-warning row':
          this.internalValue.tag === 'inhibition'
      }
    },
    expired () {
      // A tag is expired when it's past the expiry date
      return this.internalValue.expires && this.internalValue.expires < this.today
    },
    tagLabelClass () {
      return this.expired ? 'label label-danger' : 'label label-info'
    }
  },
  watch: {
    value (newValue) {
      this.internalValue = JSON.parse(JSON.stringify(newValue))
      this.tagSet()
    }
  },
  methods: {
    tagSelected () {
      this.internalValue.tag = this.tagSelect === 'custom'
        ? '' : this.annotationHints.tags[this.tagSelect]
    },
    tagSet () {
      var i = (this.annotationHints.tags || []).indexOf(this.internalValue.tag)
      this.tagSelect = i >= 0 ? i : 'custom'
    },
    relativeDateSelected () {
      var r = this.relativeDate
      if (r === 'never') {
        this.internalValue.expires = ''
        return
      }
      var d = new Date()
      if (r.endsWith('-days')) d.setDate(d.getDate() + +r.slice(0, -5))
      else if (r.endsWith('-years')) d.setFullYear(d.getFullYear() + +r.slice(0, -6))
      else return
      this.internalValue.expires = d.toJSON().split('T')[0]
    },
    flatpickrDateSelected (selectedDates, dateStr, instance) {
      // Clear the quick selector after manual input
      this.relativeDate = 'not-relative'
    },
    clearExpiryDate () {
      this.internalValue.expires = ''
      this.relativeDate = 'never'
    },
    update () {
      this.$emit('input', this.internalValue)
    }
  },
  created () {
    // Make sure the select choice reflects the initial internalValue.tag
    this.tagSet()
  }
}
</script>

<style>
.label {
  display: inline-block;
}
/* Vertically-align the trash-icon, it was aligned to the top before (default behaviour). Thanks to https://stackoverflow.com/a/9431007/2851664 */
.flex-center {
  display: flex;
  align-items: center;
}
</style>
