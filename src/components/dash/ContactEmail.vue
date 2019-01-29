<template>
<div v-if="!editable">
  <div class="col-sm-1 col-xs-1"
       ><i class="fa fa-envelope-o"></i></div>
  <div class="col-sm-11 col-xs-11">
    {{ value.firstname }} {{ value.lastname }} &lt;{{ email }}&gt;
    <small>
      <toggle-button :value="mailEnabled" :sync="true"
                     :width=36 :height=14
                     v-on:change="setEmailStatus"
                     :labels="{checked: 'on', unchecked: 'off'}"
                     :color="{checked: '#d4d4d4', unchecked: '#d73925'}"/>
    </small>
    <em v-if="value.comment !== ''">({{ value.comment }})</em>
    <div v-for="(tags, category) in annotationHints.email_tags" :key="category">
      <tag-selection v-bind:category="category"
                     v-bind:tags="tags"
                     v-bind:selected="chosenTags.tags[category]"
                     v-on:input="setEmailTag"
/>
    </div>
  </div>
</div>
<div v-else>
  <div class="form-group">
    <label class="col-sm-1 control-label">
      <i class="fa fa-envelope-o"></i></label>
    <div class="col-sm-9 com-xs-9">
      <input v-model="value.email"
        type="email" class="form-control"></input>
    </div>
    <div class="col-sm-2 col-xs-2" style="padding-left:3px; padding-right:3px">
      <small>
        <toggle-button :value="mailEnabled" :sync="true"
                       :width=36 :height=14
                       v-on:change="setEmailStatus"
                       :labels="{checked: 'on', unchecked: 'off'}"
                       :color="{checked: '#d4d4d4', unchecked: '#d73925'}"/>
      </small>
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-4 control-label">
      Firstname
    </label>
      <div class="col-sm-8">
        <input v-model="value.firstname"
          type="text" class="form-control"></input>
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-4 control-label">
      Lastname
    </label>
      <div class="col-sm-8">
        <input v-model="value.lastname"
          type="text" class="form-control"></input>
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-4 control-label">
      <em>Comment</em>
    </label>
      <div class="col-sm-8">
        <input v-model="value.comment"
          type="text" class="form-control"></input>
    </div>
  </div>
</div>
</template>

<script>
import debounce from 'lodash.debounce'
import tagSelection from './TagSelection.vue'

module.exports = {
  name: 'contact-email',
  props: {
    'value': Object,
    'status': String,
    'annotationHints': {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  components: {
    tagSelection
  },
  created: function () {
    // this has to be done early and for all email addresses
    // so we cannot use a function that is debounced
    this.$store.dispatch('GET_EMAIL_STATUS', this.email)
  },
  computed: {
    email: function () {
      return this.value.email
    },
    mailEnabled: function () {
      if (this.email in this.$store.state.emailStatusMap) {
        return (this.$store.state.emailStatusMap[this.email].status !==
                'disabled')
      } else {
        return true
      }
    },
    editable: function () {
      return (this.status === 'create' || this.status === 'update')
    },
    chosenTags: function () {
      if (this.email in this.$store.state.emailStatusMap) {
        return this.$store.state.emailStatusMap[this.email]
      } else {
        return {tags: {}}
      }
    }
  },
  watch: {
    email: function (val) {
      // this.$store.dispatch('GET_EMAIL_STATUS', this.email)
      this.getStatusForModifiedEmail(val)
    }
  },
  methods: {
    setEmailStatus: function (event) {
      this.$store.dispatch('SET_EMAIL_STATUS',
                           {email: this.email, value: event.value})
    },
    getStatusForModifiedEmail: debounce(function (email) {
      this.$store.dispatch('GET_EMAIL_STATUS', email)
    }, 800),
    setEmailTag: function (event) {
      this.$store.dispatch('SET_EMAIL_TAG',
                           {email: this.email, category: event.category, tag: event.tag})
    }
  }
}
</script>
