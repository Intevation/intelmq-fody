<template>
  <div class="wrapper">
    <header class="main-header">
      <a href="/" class="logo">
        <!-- mini logo for sidebar mini 40x50 pixels -->
        <span class="logo-mini"><img src="/static/img/logo_sm.png" alt="Logo" class="img-responsive center-block"></span>
        <!-- logo for regular state and mobile devices -->
        <div class="container logo-lg">
          <div class="pull-left image"><img src="/static/img/logo_sm.png" alt="Logo" class="img-responsive"></div>
          <div class="pull-left info">IntelMQ-Fody</div>
        </div>
      </a>

      <!-- Header Navbar -->
      <nav class="navbar navbar-static-top" role="navigation">
        <!-- Sidebar toggle button-->
        <a href="javascript:;" class="sidebar-toggle" data-toggle="offcanvas" role="button">
          <span class="sr-only">Toggle navigation</span>
        </a>
        <div v-if="backendProblem != null" class="backend-problem">
          {{ backendProblem }}
        </div>
        <div v-if="!(loggedIn && user === '')" class="navbar-custom-menu">
          <ul  class="nav navbar-nav">
            <li class="dropdown user user-menu">
            <div class="user">
              <ul class="nav navbar-nav user-info">
                <span>
              {{ user }}
                </span>
              </ul>
            </div>
            </li>
            <li>
              <div class="login-btn">
                <button v-if="!loggedIn" type="button" class="btn btn-default" data-toggle="modal" data-target="#modal-login">
                  Login
                </button>
                <button v-if="loggedIn" v-on:click="signOut" type="button" class="btn btn-default">
                  Logout
                </button>
              </div>
              <div class="modal fade" tabindex="-1" ref="login-modal" id="modal-login" role="dialog" data-backdrop="false" >
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span></button>
                      <h4 class="modal-title">IntelMQ-Fody - Sign in</h4>
                    </div>
                    <div class="modal-body">
                      <label v-if="wrongCredentials" class="text-red">Wrong username or password</label>
                      <div class="form-group">
                      <label for="usernameInput">Username</label>
                      <input v-model="username" class="form-control" id="usernameInput" placeholder="Name"
                        type="text" />
                      <label for="passwordInput">Password</label>
                      <input v-model="password" class="form-control" id="passwordInput" placeholder="Password" type="password" />
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button  v-on:click="signIn" type="button" class="btn btn-primary">Login</button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
     </nav>
    </header>
    <!-- Left side column. contains the logo and sidebar -->
    <aside class="main-sidebar">

      <!-- sidebar: style can be found in sidebar.less -->
      <section class="sidebar">
        <!-- search form (Optional) -->
        <form v-if="withMenuSearch" v-on:submit.prevent class="sidebar-form">
          <div class="input-group">
            <input type="text" name="search" id="search" class="search form-control" data-toggle="hideseek" placeholder="Search Menus" data-list=".sidebar-menu">
                <span class="input-group-btn">
                  <button type="submit" name="search" id="search-btn" class="btn btn-flat"><i class="fa fa-search"></i>
                  </button>
                </span>
          </div>
        </form>
        <!-- /.search form -->

        <!-- Sidebar Menu -->
        <ul class="sidebar-menu">
          <li class="header">TOOLS</li>
          <li class="active pageLink" v-on:click="toggleMenu"><router-link to="/"><i class="fa fa-desktop"></i><span class="page">Dashboard</span></router-link></li>
          <li class="pageLink" v-on:click="toggleMenu"><router-link to="tickets"><i class="fa fa-ticket"></i><span class="page">Tickets</span></router-link></li>
          <li class="pageLink" v-on:click="toggleMenu"><router-link to="contacts"><i class="fa fa-address-book-o"></i><span class="page">Contacts</span></router-link></li>
          <li class="pageLink" v-on:click="toggleMenu"><router-link to="stats"><i class="fa fa-bar-chart"></i><span class="page">Statistics</span></router-link></li>
          <li v-if="debugPages" class="header">PAGES</li>
          <li v-if="debugPages" class="pageLink" v-on:click="toggleMenu"><router-link to="/login"><i class="fa fa-circle-o text-yellow"></i> <span class="page">Login</span></router-link></li>
          <li v-if="debugPages" class="pageLink" v-on:click="toggleMenu"><router-link to="/404"><i class="fa fa-circle-o text-red"></i> <span class="page">404</span></router-link></li>
        </ul>
        <!-- /.sidebar-menu -->
      </section>
      <!-- /.sidebar -->
    </aside>

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <section class="content-header">
        <h1>
          {{$route.name.toUpperCase() }}
          <small>{{ $route.meta.description }}</small>
        </h1>
        <ol class="breadcrumb">
          <li><a href="javascript:;"><i class="fa fa-home"></i>Home</a></li>
          <li class="active">{{$route.name.toUpperCase() }}</li>
        </ol>
      </section>

      <router-view></router-view>
    </div>
    <!-- /.content-wrapper -->

    <!-- Main Footer -->
    <footer class="main-footer">
        <div class="pull-left image">
            <img src="/static/img/Sign_IntelMQ.png" alt="Sign" class="img-responsive" />
        </div>
        <span style="margin-left: 1em">
            <a href="https://github.com/Intevation/intelmq-fody">IntelMQ-Fody Source Code</a>
        </span>
        <div class="pull-right hidden-xs">
            <strong>Version: {{ version }}</strong>
        </div>
    </footer>
  </div>
  <!-- ./wrapper -->
</template>

<script>
import { mapState } from 'vuex'
// FIXME const appVersion = require('./package.json').version; https://stackoverflow.com/questions/64993118/error-should-not-import-the-named-export-version-imported-as-version
import { version } from '../../package.json'
import $ from 'jquery'

require('hideseek')

export default {
  name: 'DashView',
  data: function () {
    return {
      section: 'Dash',
      me: '',
      withMenuSearch: false,
      debugPages: false,
      username: null,
      password: null,
      wrongCredentials: false,
      api: {
        servers: {
          url: '', // Back end server
          result: []
        }
      }
    }
  },
  computed: {
    store: function () {
      return this.$parent.$store
    },
    state: function () {
      return this.store.state
    },
    version: function () {
      return version
    },
    ...mapState(['backendProblem', 'user', 'loggedIn'])
  },
  methods: {
    signIn: function () {
      this.$http.post('api/login', {
        username: this.username,
        password: this.password
      }).then(response => response.json().then(data => {
        if (data && data.login_token !== null && data.login_token !== undefined && data.username !== undefined && data.username !== '') {
          this.$store.state.user = data.username
          this.$store.state.token = data.login_token
          this.$store.state.loggedIn = true
          this.wrongCredentials = false
          $('#modal-login').hide()
          // If the user accesses a sub-page, the frontend already tried to retrieve data from the backend without authentication, leading to errors.
          // Clean the frontend now, so the user sees a clean interface and the frontend loads the necessary data when switching to the requested page
          this.$router.push('/')
        } else {
          this.wrongCredentials = true
        }
      }))
    },
    signOut: function () {
      this.username = ''
      this.password = ''
      this.wrongCredentials = false
      this.$store.state.token = null
      this.$store.state.user = null
      this.$store.state.loggedIn = false
      // this.$router.push('/')
    },
    changeloading: function () {
      this.store.dispatch('TOGGLE_SEARCHING')
    },
    toggleMenu: function (event) {
      // remove active from li
      window.$('li.pageLink').removeClass('active')

      // Add it to the item that was clicked
      if (event.target && event.target.parentElement) {
        event.target.parentElement.className = 'pageLink active'
      }
    }
  },
  mounted: function () {
    // Page is ready. Let's load our functions!
  }
}
</script>

<style>
.backend-problem {
  color: #ffa0a0;
}

.user-panel {
  height: 4em;
}

.user-info {
  padding: 12px;
  color: white;
}

.login-btn{
  padding: 7px;
  color: white;
}
</style>
