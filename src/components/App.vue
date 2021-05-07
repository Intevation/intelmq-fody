<template>
  <div>
    <router-view></router-view>
    <div id="app"></div>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data: function () {
      return {
        section: 'Head'
      }
    },
    mounted () {
      this.$http.post('api/login', {
        username: '',
        password: ''
      }).then(response => response.json().then(data => {
        if (data && data.login_token === null) {
          this.$store.state.loggedIn = true
          this.$store.state.user = ''
        }
      }))
    },
    methods: {
      logout: function () {
        this.$store.dispatch('SET_USER', null)
        this.$store.dispatch('SET_TOKEN', null)

        if (window.localStorage) {
          window.localStorage.setItem('user', null)
          window.localStorage.setItem('token', null)
        }

        this.$router.push('/login')
      }
    }
  }
</script>
