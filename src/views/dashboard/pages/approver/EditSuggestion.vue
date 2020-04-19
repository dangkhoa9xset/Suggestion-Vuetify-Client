<template>
  <v-app id="inspire">
    <v-container fluid>
      <v-card class="elevation-12">
        <v-toolbar
          color="primary"
          dark
          flat
        >
          <v-toolbar-title>Edit suggestion</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-container class="py-0">
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="items.owner"
                    label="Owner suggestion"
                    readonly
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="3"
                >
                  <v-select
                    v-model="items.owner_process"
                    :items="processes"
                    label="Select your process"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="3"
                >
                  <v-select
                    v-model="items.applied_process"
                    :items="processes"
                    label="Suggestion for any process?"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-select
                    v-model="items.area_machine"
                    :items="areas"
                    label="Area/Machine"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-select
                    v-model="items.categories"
                    :items="categories"
                    attach
                    label="Categories"
                    multiple
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-select
                    v-model="items.component"
                    :items="components"
                    label="Component"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="12"
                >
                  <v-text-field
                    v-model="items.suggestion_name"
                    label="Suggestion Name"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="12"
                >
                  <v-textarea
                    v-model="items.description"
                    label="Description"
                    value="Enter your suggesstion desciption."
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="items.benefit"
                    label="Benefit"
                    value="Enter your suggesstion benefit."
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="12"
                >
                  <v-file-input
                    v-model="items.files"
                    label="File input"
                    filled
                    small-chips
                    multiple
                    show-size
                    counter
                    prepend-icon="$mdiImageMultiple "
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <div class="text-center">
          <v-btn
            class="ma-2"
            outlined
            color="indigo"
            :loading="saving"
            @click="editSuggestion"
          >
            Save Suggestion
          </v-btn>
        </div>
      </v-card>
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
        Delete
      </v-btn>
      <v-btn
        color="white"
        text
        @click="snackbar = false"
      >
        Cancel
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
  // import VueUploadMultipleImage from 'vue-upload-multiple-image'
  import axios from 'axios'
  import { server } from '@/helper'
  export default {
    name: 'ApproverEditSuggestions',

    // components: {
    //   VueUploadMultipleImage,
    // },
    data: () => ({
      processes: ['Prepress', 'Printing', 'Laminator', 'Finishing', 'Maintenance', 'Office', 'Logistic & Warehouse', 'QA'],
      areas: ['Pre', 'Pri', 'Lam', 'Fin'],
      categories: ['Safety', 'Quality', 'Process', 'Operation', 'Effective', 'Visual', '5S', 'Support'],
      components: ['aa', 'bb', 'cc'],
      attachments: [],
      owner: null,
      owner_process: null,
      applied_process: null,
      area_machine: null,
      category: null,
      component: null,
      suggestion_name: null,
      description: null,
      benefit: null,
      files: null,
      saving: false,
      snackbar: false,
      text: 'My timeout is set to 5000.',
      timeout: 5000,
      id: 0,
      items: {},
    }),
    computed: {
    },
    created () {
      this.$store.commit('SET_APPBAR', true)
      this.id = this.$route.params.id
      this.getSuggestion()
      var user = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user'))
        : []
      this.owner = user.email
    },
    methods: {
      async editSuggestion () {
        this.saving = true
        await this.submitFiles()
        const suggestionData = {
          owner: this.items.owner,
          owner_process: this.items.owner_process,
          applied_process: this.items.applied_process,
          area_machine: this.items.area_machine,
          categories: this.items.categories,
          component: this.items.component,
          suggestion_name: this.items.suggestion_name,
          description: this.items.description,
          benefit: this.items.benefit,
          attachments: this.items.attachments,
        }
        setTimeout(() => this.__submitToServer(suggestionData), 1000)
      },
      getSuggestion () {
        axios.get(`${server.baseURL}/suggestion/id/${this.id}`)
          .then(data => {
            this.items = data.data
          })
      },
      __submitToServer (data) {
        axios.put(`${server.baseURL}/suggestion`, data).then(data => {
          this.$router.go(-1)
        })
      },
      submitFiles () {
        if (this.files) {
          const formData = new FormData()

          // files
          for (const file of this.files) {
            formData.append('files', file, file.name)
          }

          axios
            .post(`${server.baseURL}/attachment/files`, formData)
            .then(response => {
              response.data.forEach(element => {
                console.log(element.id)
                this.attachments.push(element.id)
              })
            })
            .catch(error => {
              console.log({ error })
            })
        } else {
          console.log('there are no files.')
        }
      },
    },
  }
</script>
