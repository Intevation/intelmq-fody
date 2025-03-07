<template>
<div v-if="!editable">
  <div class="container-fluid">
    <div class="row">
      <div class="col-xs-3" style="width:20%"
           ><i class="fa fa-envelope-o"></i></div>
      <div class="col-xs-9" style="width:80%">
        {{ value.firstname }} {{ value.lastname }} &lt;{{ email }}&gt;
        <small>
          <toggle-button :value="mailEnabled" :sync="true"
                         :width=36 :height=14
                         v-on:change="setEmailStatus"
                         :labels="{checked: 'on', unchecked: 'off'}"
                         :color="{checked: '#d4d4d4', unchecked: '#d73925'}"/>
        </small>
        <em v-if="value.comment !== ''">({{ value.comment }})</em>
      </div>
    </div>
  </div>
  <div v-for="entry in annotationHints.email_tags" :key="category"
       class="container-fluid" style="margin-top: 15px;">
    <div class="row" style="display:flex;align-items:center;">
      <div class="col-xs-3" style="width:20%">
        <label class="control-label" style="font-weight:normal;margin-bottom:0;"
               >{{entry[0]}}</label>
      </div>
      <tag-selection v-bind:category="entry[0]"
                     v-bind:tags="entry[1].tags"
                     v-bind:defaultTag="entry[1].default_tag"
                     v-bind:selected="chosenTags.tags[entry[0]]"
                     v-on:input="setEmailTag"
                     class="col-xs-9" style="width:80%" />
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
    <validation-error v-bind:errorMessage="errorMessage"
                      class="col-sm-9 col-sm-offset-1"/>
  </div>
  <div v-for="entry in annotationHints.email_tags" :key="category"
       class="form-group">
    <label class="col-sm-2 control-label">{{entry[0]}}</label>
    <tag-selection v-bind:category="entry[0]"
                   v-bind:tags="entry[1].tags"
                   v-bind:defaultTag="entry[1].default_tag"
                   v-bind:selected="chosenTags.tags[entry[0]]"
                   v-on:input="setEmailTag"
                   class="col-sm-10" />
  </div>
    <div class="form-group">
    <label class="col-sm-2 control-label">
      Firstname
    </label>
      <div class="col-sm-10">
        <input v-model="value.firstname"
          type="text" class="form-control"></input>
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-2 control-label">
      Lastname
    </label>
      <div class="col-sm-10">
        <input v-model="value.lastname"
          type="text" class="form-control"></input>
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-2 control-label">
      <em>Comment</em>
    </label>
      <div class="col-sm-10">
        <input v-model="value.comment"
          type="text" class="form-control"></input>
    </div>
  </div>
</div>
</template>

<script>
import debounce from 'lodash.debounce'
import tagSelection from './TagSelection.vue'
import validationError from './ValidationError.vue'

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
    },
    'errorMessage': String
  },
  components: {
    tagSelection, validationError
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
