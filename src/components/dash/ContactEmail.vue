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
  </div>
</div>
<div v-else>
  <div class="form-group">
    <label class="col-sm-1 control-label">
      <i class="fa fa-envelope-o"></i></label>
      <div class="col-sm-10">
        <input v-model="value.email"
          type="email" class="form-control"></input>
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
module.exports = {
  name: 'contact-email',
  props: {
    'value': Object,
    'status': String
  },
  created: function () {
    this.$store.dispatch('GET_EMAIL_STATUS', this.email)
  },
  computed: {
    email: function () {
      return this.value.email
    },
    mailEnabled: function () {
      return this.$store.state.emailStatusMap[this.email].status !== 'disabled'
    },
    editable: function () {
      return (this.status === 'create' || this.status === 'update')
    }
  },
  watch: {
    email: function (val) {
      this.$store.dispatch('GET_EMAIL_STATUS', val)
    }
  },
  methods: {
    setEmailStatus: function (event) {
      this.$store.dispatch('SET_EMAIL_STATUS',
                           {email: this.email, value: event.value})
    }
  }
}
</script>
