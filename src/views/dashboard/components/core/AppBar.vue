<template>
  <v-app-bar
    id="app-bar"
    v-model="appbar"
    absolute
    app
    color="transparent"
    flat
    height="75"
  >
    <v-btn
      class="mr-3"
      elevation="1"
      fab
      small
      @click="setDrawer(!drawer)"
    >
      <v-icon v-if="value">
        mdi-view-quilt
      </v-icon>

      <v-icon v-else>
        mdi-dots-vertical
      </v-icon>
    </v-btn>

    <v-toolbar-title
      class="hidden-sm-and-down font-weight-light"
      v-text="$route.name"
    />

    <v-spacer />

    <v-text-field
      :label="$t('search')"
      color="secondary"
      hide-details
      style="max-width: 165px;"
    >
      <template
        v-if="$vuetify.breakpoint.mdAndUp"
        v-slot:append-outer
      >
        <v-btn
          class="mt-n2"
          elevation="1"
          fab
          small
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <div class="mx-3" />

    <v-btn
      class="ml-2"
      min-width="0"
      text
      to="/"
    >
      <v-icon>mdi-view-dashboard</v-icon>
    </v-btn>

    <v-menu
      bottom
      left
      offset-y
      origin="top right"
      transition="scale-transition"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          class="ml-2"
          min-width="0"
          text
          v-bind="attrs"
          v-on="on"
        >
          <v-badge
            color="red"
            overlap
            bordered
          >
            <template v-slot:badge>
              <span>5</span>
            </template>

            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-list
        :tile="false"
        nav
      >
        <div>
          <app-bar-item
            v-for="(n, i) in notifications"
            :key="`item-${i}`"
          >
            <v-list-item-title v-text="n" />
          </app-bar-item>
        </div>
      </v-list>
    </v-menu>

    <v-menu
      bottom
      left
      offset-y
      origin="top right"
      transition="scale-transition"
    >
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          class="ml-2"
          min-width="0"
          text
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>

      <v-list
        :tile="false"
        nav
        max-width="350px"
      >
        <v-list-item>
          <v-list-item-avatar
            class="align-self-center"
            color="grey lighten-3"
            contain
          >
            <v-img
              :src="userPhoto"
            />
          </v-list-item-avatar>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title @click="onClick(accountoption)">
                {{ email }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ jobTitle }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item>
      </v-list>
      <v-divider />
      <v-list>
        <app-bar-item
          v-for="accountoption in accountoptions"
          :key="accountoption"
        >
          <v-list-item-title
            class="text-center"
            @click="onClick(accountoption)"
            v-text="accountoption"
          />
        </app-bar-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
  // Components
  import { VHover, VListItem } from 'vuetify/lib'

  // Utilities
  import { mapState, mapMutations } from 'vuex'

  import { msalMixin } from 'vue-msal'

  export default {
    name: 'DashboardCoreAppBar',

    components: {
      AppBarItem: {
        render (h) {
          return h(VHover, {
            scopedSlots: {
              default: ({ hover }) => {
                return h(VListItem, {
                  attrs: this.$attrs,
                  class: {
                    'black--text': !hover,
                    'white--text secondary elevation-12': hover,
                  },
                  props: {
                    activeClass: '',
                    dark: hover,
                    link: true,
                    ...this.$attrs,
                  },
                }, this.$slots.default)
              },
            },
          })
        },
      },
    },
    mixins: [msalMixin],

    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },

    data: () => ({
      notifications: [
        'Mike John Responded to your email',
        'You have 5 new tasks',
        'You\'re now friends with Andrew',
        'Another Notification',
        'Another one',
      ],
      accountoptions: [
        'User Profile',
        'Sign out',
      ],
    }),

    computed: {
      ...mapState(['drawer']),
      appbar: {
        get () {
          return this.$store.state.appbar
        },
        set (val) {
          this.$store.commit('SET_APPBAR', val)
        },
      },
      email: {
        get () {
          return this.$store.state.email
        },
        set (val) {
          this.$store.commit('SET_EMAIL', val)
        },
      },
      jobTitle: {
        get () {
          return this.$store.state.jobTitle
        },
        set (val) {
          this.$store.commit('SET_JOBTITLE', val)
        },
      },
      userPhoto: {
        get () {
          return this.$store.state.userPhoto
        },
        set (val) {
          this.$store.commit('SET_USERPHOTO', val)
        },
      },
    },
    created () {

    },
    mounted () {
      var user = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user'))
        : []
      var userPhoto = localStorage.getItem('userPhoto')
      this.$store.commit('SET_EMAIL', user.mail)
      this.$store.commit('SET_JOBTITLE', user.jobTitle)
      if (userPhoto) {
        this.$store.commit('SET_USERPHOTO', userPhoto)
      } else {
        this.$store.commit('SET_USERPHOTO', 'https://image.flaticon.com/icons/svg/535/535850.svg')
      }
    },

    methods: {
      ...mapMutations({
        setDrawer: 'SET_DRAWER',
      }),
      onClick: function (accountoption) {
        if (accountoption === 'Sign out') {
          this.logout()
        } else if (accountoption === 'User Profile') {
          this.$router.push({ name: 'User Profile' })
        }
      },
      logout: function () {
        this.$store.dispatch('logout').then(() => {
          this.$msal.signOut().then(() => this.$router.push({ name: 'Login' }))
        })
      },
    },
  }
</script>
