<template>
<div>
  <div class="col-sm-1 col-xs-1"
       ><i class="fa fa-envelope-o"></i></div>
  <div class="col-sm-11 col-xs-11">
    {{ firstname }} {{ lastname }} &lt;{{ email }}&gt;
    <small>
      <toggle-button :value="mailEnabled" :sync="true"
                     :width=36 :height=14
                     v-on:change="setEmailStatus"
                     :labels="{checked: 'on', unchecked: 'off'}"
                     :color="{checked: '#d4d4d4', unchecked: '#d73925'}"/>
    </small>
    <em v-if="comment !== ''">({{ comment }})</em>
  </div>
</div>
</template>

<script>
module.exports = {
  name: 'contact-email',
  props: {
    'firstname': String,
    'lastname': String,
    'email': String,
    'comment': String
  },
  computed: {
    mailEnabled: function () {
      this.$store.dispatch('FETCH_EMAIL_STATUS', this.email)
      return this.$store.state.emailStatusMap[this.email] !== 'disabled'
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
