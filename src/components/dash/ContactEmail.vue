<template>
<div>
  <div class="col-sm-1 col-xs-1"
       ><i class="fa fa-envelope-o"></i></div>
  <div class="col-sm-11 col-xs-11">
    {{ firstname }} {{ lastname }} &lt;{{ email }}&gt;
    <small>
      <toggle-button v-model="enabled" :width=36 :height=14
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
  data: function () {
    return {
      enabled: true
    }
  }
}
</script>

<style>
i.rme {
  margin-right: 0.25em
}
i.lme {
  margin-left: 0.35em
}
</style>
