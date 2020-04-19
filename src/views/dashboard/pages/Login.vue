<template>
  <v-app id="inspire">
    <v-container
      class="fill-height"
      fluid
    >
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          md="4"
        >
          <v-card class="elevation-12">
            <v-progress-linear
              :active="showProgress"
              indeterminate
              color="yellow darken-2"
            />
            <v-card-text class="text-center">
              <v-form>
                <v-card-text>
                  Sign in with
                </v-card-text>
                <v-btn
                  x-large
                  color="white"
                  class="text-center mt-2 mb-6"
                  @click="loginwithmicrosoft"
                >
                  <v-img
                    src="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31"
                    alt=""
                    max-width="100"
                    max-height="100"
                  />
                </v-btn>
                <v-divider />
                <v-card-text class="text-center">
                  Or sign in with credentials
                </v-card-text>
                <v-text-field
                  v-model="email"
                  label="Enter your email"
                  name="login"
                  prepend-icon="mdi-account"
                  type="text"
                />

                <v-text-field
                  id="password"
                  v-model="password"
                  label="Enter your Password"
                  name="password"
                  prepend-icon="mdi-textbox-password"
                  type="password"
                />
              </v-form>
            </v-card-text>
            <div class="text-center">
              <v-btn
                class="ma-4"
                outlined
                color="primary"
                :loading="loading"
                @click="login"
              >
                Login
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      top
      color="error"
    >
      {{ text }}
      <v-btn
        color="white"
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    <v-overlay :value="false">
      <v-progress-circular
        indeterminate
        size="64"
      />
    </v-overlay>
  </v-app>
</template>

<script>
  import { msalMixin } from 'vue-msal'

  export default {
    name: 'Login',
    mixins: [msalMixin],
    props: {

    },
    data () {
      return {
        email: '',
        password: '',
        snackbar: false,
        text: 'My timeout is set to 5000.',
        timeout: 5000,
        overlay: false,
        loading: false,
      }
    },
    computed: {
      showProgress () {
        return this.$store.getters.authStatus === 'loading' ? true : this.overlay
      },
      userRole: {
        get: function () {
          return localStorage.getItem('user')
            ? JSON.parse(localStorage.getItem('user'))
            : []
        },
      },
    },
    created () {
      this.$store.commit('SET_DRAWER', false)
      this.$store.commit('SET_APPBAR', false)
      if (this.$store.getters.isLoggedIn) {
        this.$router.push({ name: 'Dashboard' })
      }
    },
    methods: {
      loginwithmicrosoft () {
        if (!this.$msal.isAuthenticated()) {
          this.$msal.signIn()
        } else {
          this.$router.push({ name: 'Dashboard' })
        }
      },
      login: async function () {
        this.loading = true
        const email = this.email
        const password = this.password
        await this.$store
          .dispatch('login', { email, password })
          .then(() => {
            setTimeout(() => {
              this.$router.push({ name: 'Dashboard' })
            }, 1000)
          })
          // eslint-disable-next-line no-return-assign
          .catch(err => {
            this.text = err
            this.snackbar = true
          })
      },
    },
  }
</script>
