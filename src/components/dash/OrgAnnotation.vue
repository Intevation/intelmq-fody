<template>
  <div v-if="!editable">
    <span v-if="value.tag !== 'inhibition'" v-bind:class="tagLabelClass" style="display:box">{{ value.tag }}</span>
    <span v-if="value.expires && expired">Expired {{ value.expires }}</span>
    <span v-if="value.expires && !expired">Expires {{ value.expires }}</span>
    <div v-if="value.tag === 'inhibition'" class="list-group-item list-group-item-warning row">
      <div>Inhibition:
      </div>
      <annotation-condition class="col-sm-10" v-model="value.condition" v-bind:status="status"
        v-bind:condition-hints="conditionHints" />
    </div>
  </div>
  <div v-else class="list-group form-horizontal">
    <div class="list-group-item">
      <div class="form-group-sm row" style="margin-bottom: 5px;">
        <label class="col-sm-4 control-label">Tag</label>
        <div class="col-sm-4">
          <select v-model='selectionValue' class="form-control btn-info">
            <option disabled value="">(custom)</option>
            <option v-for="tag in annotationHints.tags">{{ tag }}</option>
          </select>
        </div>
        <div class="col-sm-4">
          <input type="text" v-model="value.tag" class="form-control" placeholder="tag value" />
        </div>
      </div>
      <div class="form-group-sm row">
        <label class="col-sm-4 control-label">Expires</label>
        <div class="col-sm-3">
          <Flatpickr v-bind:options="flatpickrOptions" v-model:value="value.expires" class="form-control"
            placeholder="optional expiry date" v-on:change="onExpiresFlatpickrChange" />
        </div>
        <div class="col-sm-1" style="padding-left: 0;">
          <button class="btn btn-default btn-xs" v-on:click="clearExpires" title="Clear expiry date"><i
              class="fa fa-trash-o rme"></i></button>
        </div>
        <div class="col-sm-4">
          <select name="relative-date" class="form-control relative-date" v-model="relativeDate">
            <option value="no-selection">Never</option>
            <option value="1-month">1 Month</option>
            <option value="3-months">3 Months</option>
            <option value="6-months">6 Months</option>
            <option value="1-year">1 Year</option>
            <option value="2-years">2 Years</option>
            <option value="3-years">3 Years</option>
          </select>
        </div>
      </div>
    </div>
    <div v-if="value.tag === 'inhibition'" v-bind:class="annoClass">
      <div class="form-group-sm">
        Inhibition:
        <annotation-condition v-model="value.condition" v-bind:status="status" v-bind:condition-hints="conditionHints" />
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
      default: function () {
        return {}
      }
    }
  },
  data: function () {
    var today = new Date().toJSON().split('T')[0]
    return {
      today: today,
      selectionValue: '',  // value of tag's <select> (Tag Name)
      flatpickrOptions: {
        allowInput: true, // allow direct input
        enableTime: false,
        weekNumbers: true,
        minDate: today,
        onChange: this.onExpiresFlatpickrChange
      },
      relativeDate: ''
    }
  },
  components: {
    annotationCondition,
    'Flatpickr': VueFlatpickr
  },
  computed: {
    conditionHints: function () {
      if ('conditions' in this.annotationHints) {
        return this.annotationHints.conditions
      } else {
        return {}
      }
    },
    editable: function () {
      return (this.status === 'create' || this.status === 'update')
    },
    annoClass: function () {
      return {
        'list-group-item': this.value.tag !== 'inhibition',
        'list-group-item list-group-item-warning row':
          this.value.tag === 'inhibition'
      }
    },
    expired: function () {
      // a tag is expired when it's past the expiry date
      return this.value.expires && this.value.expires < this.today
    },
    tagLabelClass: function () {
      if (this.expired) {
        return 'label label-danger'
      } else {
        return 'label label-info'
      }
    }
  },
  watch: {
    // we want to allow value.tag to have either a value from the
    // <select> options from annotationHints.tags or a custom,
    // so we have to use a second variable 'selectionValue' and functions
    // to implement that behaviour via watching it an value.tag:
    selectionValue: function (newSelectionValue) {
      if (newSelectionValue !== '') {
        this.value.tag = newSelectionValue
      }
    },
    value: {
      handler: function (newValue) { this.updateSelection(newValue) },
      deep: true
    },
    relativeDate: function (newValue) {
      var newDate = new Date()
      switch (newValue) {
        case 'no-selection': this.value.expires = ''; return
        case '1-month': newDate.setMonth(newDate.getMonth() + 1); break
        case '3-months': newDate.setMonth(newDate.getMonth() + 3); break
        case '6-months': newDate.setMonth(newDate.getMonth() + 6); break
        case '1-year': newDate.setFullYear(newDate.getFullYear() + 1); break
        case '2-years': newDate.setFullYear(newDate.getFullYear() + 2); break
        case '3-years': newDate.setFullYear(newDate.getFullYear() + 3)
      }
      this.value.expires = newDate.toJSON().split('T')[0]
    }
  },
  methods: {
    updateSelection: function (newValue) {
      if (this.annotationHints.tags.indexOf(newValue.tag) >= 0) {
        this.selectionValue = newValue.tag
      } else {
        this.selectionValue = ''
      }
      if (!newValue.expires) { // never
        this.relativeDate = 'no-selection'
      }
    },
    onExpiresFlatpickrChange: function (selectedDates, dateStr, instance) {
      // clear the quick selector after manual input
      this.relativeDate = ''
    },
    clearExpires: function (event) {
      this.value.expires = ''
    }
  },
  mounted: function () {
    // make sure the select choice reflects the initial value.tag.
    this.updateSelection(this.value)
  }
}
</script>
<style>
.label {
  display: inline-block;
}
</style>
