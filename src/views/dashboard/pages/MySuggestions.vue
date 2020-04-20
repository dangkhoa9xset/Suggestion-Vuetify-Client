<template>
  <v-app id="inspire">
    <v-container fluid>
      <base-material-card
        icon="mdi-clipboard-text"
        title="My Suggestions List"
        class="px-5 py-3"
      >
        <v-data-table
          :headers="headers"
          :items="items"
          :sort-desc="[false, true]"
          multi-sort
          :search="search"
          class="elevation-1"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          hide-default-footer
          :loading="tableLoading"
          loading-text="Loading... Please wait"
          @page-count="pageCount = $event"
          @click:row="details"
        >
          <template v-slot:item.status="{ item }">
            <v-chip
              :color="getColor(item.status)"
              dark
            >
              {{ item.status }}
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              color="blue"
              medium
              class="mr-2"
              @click="editSuggestion(item)"
            >
              mdi-pencil
            </v-icon>

            <v-icon
              color="red"
              medium
              @click="deleteSuggestion(item)"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
        <div class="text-center pt-2">
          <v-row
            align="center"
            justify="center"
          >
            <v-spacer />
            <v-col
              cols="12"
              md="4"
            >
              <v-pagination
                v-model="page"
                :length="pageCount"
              />
            </v-col>
            <v-spacer />
            <v-subheader>Items per page:</v-subheader>
            <v-col
              cols="12"
              md="1"
              class="pa-8"
            >
              <v-select
                v-model="pageDefault"
                :items="itemsPerPages "
                @input="itemsPerPage = parseInt($event, 10)"
              />
            </v-col>
          </v-row>
        </div>
      </base-material-card>
    </v-container>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Suggestion Preview</v-toolbar-title>
          <!-- <v-spacer />
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="dialog = false"
            >
              Edit
            </v-btn>
          </v-toolbar-items> -->
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-container class="py-0">
              <v-divider
                vertical
              />
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <base-material-card
                    color="blue lighten-3"
                    class="px-5 py-3"
                  >
                    <template v-slot:heading>
                      <div class="display-2 font-weight-light">
                        Suggestion Details
                      </div>

                      <div class="subtitle-1 font-weight-light">
                        Basic infomation created on {{ editedItem.submitTime }}
                      </div>
                    </template>
                    <v-card-text>
                      <v-simple-table>
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-left primary--text">
                                Calories
                              </th>
                              <th class="text-left primary--text">
                                Description
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td> Owner </td>
                              <td>{{ editedItem.owner }}</td>
                            </tr>
                            <tr>
                              <td> Owner Process </td>
                              <td>{{ editedItem.owner_process }}</td>
                            </tr>
                            <tr>
                              <td> Applied Process </td>
                              <td>{{ editedItem.applied_process }}</td>
                            </tr>
                            <tr>
                              <td> Area </td>
                              <td>{{ editedItem.area }}</td>
                            </tr>
                            <tr>
                              <td> Machine </td>
                              <td>{{ editedItem.machine }}</td>
                            </tr>
                            <tr>
                              <td> Catelogies </td>
                              <td>{{ editedItem.categories.join(', ') }}</td>
                            </tr>
                            <tr>
                              <td> Component </td>
                              <td>{{ editedItem.component }}</td>
                            </tr>
                            <tr>
                              <td> Suggestion Name </td>
                              <td>{{ editedItem.suggestion_name }}</td>
                            </tr>
                            <tr>
                              <td> Description </td>
                              <td>{{ editedItem.description }}</td>
                            </tr>
                            <tr>
                              <td> Benefit </td>
                              <td>{{ editedItem.benefit }}</td>
                            </tr>
                            <tr>
                              <td> Submit Time </td>
                              <td>{{ editedItem.submitTime }}</td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-card-text>
                  </base-material-card>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <base-material-card
                    icon="mdi-scoreboard-outline"
                    title="Total score:"
                    class="px-5 py-3"
                  >
                    <v-data-table
                      hide-default-footer
                      :headers="scoresheaders"
                      :items="[editedItem]"
                    />
                  </base-material-card>
                  <v-divider
                    class="mt-3"
                  />
                  <base-material-card
                    :color="getColor(editedItem.status)"
                    icon="mdi-file-eye-outline"
                    :title="editedItem.status"
                    class="px-5 py-3 mt-12"
                  >
                    <v-simple-table>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left primary--text">
                              Calories
                            </th>
                            <th class="text-left primary--text">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td> CML </td>
                            <td>{{ editedItem.cml }}</td>
                          </tr>
                          <tr>
                            <td> Approver </td>
                            <td>{{ editedItem.approver }}</td>
                          </tr>
                          <tr>
                            <td> Approver comment </td>
                            <td>{{ editedItem.comment }}</td>
                          </tr>
                          <tr>
                            <td> Approved Time </td>
                            <td>{{ editedItem.approvedTime }}</td>
                          </tr>
                          <tr>
                            <td> Implemented by owner </td>
                            <td>{{ editedItem.implementer }}</td>
                          </tr>
                          <tr>
                            <td> Implemented Time </td>
                            <td>{{ editedItem.implementedTime }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </base-material-card>
                </v-col>
              </v-row>
              <v-divider
                vertical
              />
              <base-material-card
                icon="mdi-file-multiple-outline"
                title="Attachments"
                class="px-5 py-3"
                color="blue"
              >
                <v-row>
                  <v-col
                    v-for="(attachment, n) of editedItem.attachments"
                    :key="n"
                    class="d-flex child-flex"
                  >
                    <v-card
                      outlined
                    >
                      <v-img
                        :src="imageExistData[n]"
                        :lazy-src="`https://picsum.photos/10/6?image=${n * 5 + 10}`"
                        aspect-ratio="1"
                        class="grey lighten-2"
                      >
                        <template v-slot:placeholder>
                          <v-row
                            class="fill-height ma-0"
                            align="center"
                            justify="center"
                          >
                            <v-progress-circular
                              indeterminate
                              color="grey lighten-5"
                            />
                          </v-row>
                        </template>
                      </v-img>
                      <v-card-text class="caption">
                        {{ editedfileName[n] }} ({{ (editedfileSize[n]/1024).toFixed(2) }}KB)
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer />
                        <v-btn
                          icon
                          large
                          :href="`http://localhost:3000/api/attachment/files/download/${attachment}`"
                        >
                          <v-icon>mdi-cloud-download-outline</v-icon>
                        </v-btn>
                        <v-spacer />
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </base-material-card>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      top
      color="error"
    >
      {{ snackbarText }}
      <v-btn
        v-show="deleteButton"
        color="white"
        text
        @click="agree"
      >
        Delete
      </v-btn>
      <v-btn
        color="white"
        text
        @click="cancel"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
  import axios from 'axios'
  import { server } from '@/helper'

  export default {
    name: 'MySuggestions',
    data: () => ({
      delete_able: false,
      search: '',
      dialog: false,
      disdialog: false,
      snackbar: false,
      snackbarText: 'Are you sure to delete this suggestion?',
      timeout: 0,
      deleteButton: false,
      tableLoading: false,
      page: 1,
      pageCount: 0,
      pageDefault: '15',
      itemsPerPage: 15,
      itemsPerPages: ['5', '10', '15'],
      editedItem: [],
      imageExistData: [],
      editedfileInfo: [],
      editedfileName: [],
      editedfileSize: [],
      editedIndex: -1,
      processes: ['Pre-Press', 'Printing', 'Laminator', 'Finishing', 'Maintenance', 'Office', 'Logistic & Warehouse', 'QA'],
      areas: ['Pre', 'Pri', 'Lam', 'Fin'],
      categories: ['Safety', 'Quality', 'Process', 'Operation', 'Effective', 'Visual', '5S', 'Support'],
      components: ['aa', 'bb', 'cc'],
      // eslint-disable-next-line no-sparse-arrays
      scoresheaders: [
        {
          sortable: false,
          text: 'Submitted',
          value: 'score_submit',
          width: '10%',
          align: 'center',
          class: 'primary--text',
        },
        {
          sortable: false,
          text: 'Approved',
          value: 'score_approved',
          width: '10%',
          align: 'center',
          class: 'primary--text',
        },
        {
          sortable: false,
          text: 'CML >= 4',
          value: 'score_cml4',
          width: '30%',
          align: 'center',
          class: 'primary--text',
        },
        {
          sortable: false,
          text: 'Implemented',
          value: 'score_implemented',
          width: '10%',
          align: 'center',
          class: 'primary--text',
        },
        {
          sortable: false,
          text: 'Implemented by owner',
          value: 'score_byOwner',
          width: '40%',
          align: 'center',
          class: 'primary--text',
        },
      ],
      headers: [
        {
          sortable: false,
          text: 'Owner',
          value: 'owner',
          width: '10%',
          class: 'primary--text',
        },
        {
          sortable: false,
          text: 'Applied Process',
          value: 'applied_process',
          width: '10%',
          align: 'center',
          class: 'primary--text',
        },
        {
          sortable: false,
          text: 'Machine',
          value: 'machine',
          width: '8%',
          align: 'center',
          class: 'primary--text',
        },
        {
          sortable: false,
          text: 'Area',
          value: 'area',
          width: '8%',
          align: 'center',
          class: 'primary--text',
        },
        {
          sortable: false,
          text: 'Component',
          value: 'component',
          width: '8%',
          align: 'center',
          class: 'primary--text',
        },
        {
          sortable: false,
          text: 'Categories',
          value: 'categories',
          width: '8%',
          align: 'center',
          class: 'primary--text',
        },
        {
          sortable: false,
          text: 'Suggestion Name',
          value: 'suggestion_name',
          width: '15%',
          class: 'primary--text',
        },
        {
          sortable: false,
          text: 'Status',
          value: 'status',
          width: '5%',
          align: 'center',
          class: 'primary--text',
        },
        {
          sortable: false,
          text: 'Submit Time',
          value: 'submitTime',
          width: '10%',
          align: 'center',
          class: 'primary--text',
        },
        {
          sortable: false,
          text: 'Actions',
          value: 'actions',
          width: '15%',
          align: 'center',
          class: 'primary--text',
        },
      ],
      items: [],
    }),
    computed: {

    },
    created () {
      this.$store.commit('SET_APPBAR', true)
      this.tableLoading = true
      setTimeout(() => this.fetchSuggestions(), 1000)
    },
    methods: {
      fetchSuggestions () {
        axios
          .get(`${server.baseURL}/suggestion/mysuggestions`)
          .then(data => {
            this.items = data.data
            this.tableLoading = false
          })
      },
      editSuggestion (item) {
        this.disdialog = true
        this.$router.push({ name: 'Edit Suggestion', params: { id: item._id } })
      },
      showSnackbar (snackbarText, timeout, deleteButton) {
        this.snackbar = true
        this.snackbarText = snackbarText
        this.timeout = timeout
        this.deleteButton = deleteButton
        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },
      agree () {
        this.resolve(true)
        this.snackbar = false
      },
      cancel () {
        this.resolve(false)
        this.snackbar = false
      },
      async deleteSuggestion (item) {
        this.disdialog = true
        if (await this.showSnackbar('Are you sure to delete this suggestion?', 0, true)) {
          await axios.delete(`${server.baseURL}/suggestion/id/${item._id}`)
            .then(() => {
              this.delete_able = true
              const index = this.items.indexOf(item)
              this.items.splice(index, 1)
            }).catch(err => {
              this.delete_able = false
              this.showSnackbar(err.response.data.message, 5000, false)
            })
            .then(() => {
              console.warn(this.delete_able)
              if (item.attachments && this.delete_able) {
                item.attachments.forEach(async element => {
                  await axios.delete(`${server.baseURL}/attachment/files/${element}`)
                    .catch(err => {
                      this.showSnackbar(err.response.data.message, 5000, false)
                    })
                })
              }
            })
        }
      },
      getColor (status) {
        if (status === 'Pending') return 'orange'
        else if (status === 'Approved') return 'green'
        else if (status === 'Implementing') return 'teal'
        else if (status === 'Implemented') return 'blue'
        else return 'red'
      },
      async details (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        if (!this.disdialog) {
          this.dialog = true
          await this.getfileInfo()
        }
        this.disdialog = false
      },
      getfileInfo () {
        this.editedfileInfo = []
        this.editedfileName = []
        this.editedfileSize = []
        if (!this.editedItem.attachments) {
          return
        }
        this.editedItem.attachments.forEach(element => {
          axios.get(`${server.baseURL}/attachment/files/info/${element}`)
            .then(response => {
              this.editedfileInfo.push(response.data.file.contentType)
              this.editedfileName.push(response.data.file.filename)
              this.editedfileSize.push(response.data.file.length)
              const filename = response.data.file.filename
              if (/\.(jpe?g|png|gif|svg)$/i.test(filename)) {
                this.imageExistData.push(`${server.baseURL}/attachment/files/${element}`)
              } else if (/\.(pdf)$/i.test(filename)) {
                this.imageExistData.push('https://image.flaticon.com/icons/svg/29/29587.svg')
              } else if (/\.(xlsx)$/i.test(filename)) {
                this.imageExistData.push('https://image.flaticon.com/icons/svg/28/28813.svg')
              } else if (/\.(xls)$/i.test(filename)) {
                this.imageExistData.push('https://image.flaticon.com/icons/svg/29/29046.svg')
              } else if (/\.(doc)$/i.test(filename)) {
                this.imageExistData.push('https://image.flaticon.com/icons/svg/29/29593.svg')
              } else if (/\.(docx)$/i.test(filename)) {
                this.imageExistData.push('https://image.flaticon.com/icons/svg/28/28840.svg')
              } else {
                this.imageExistData.push('https://image.flaticon.com/icons/svg/101/101671.svg')
              }
            })
        })
      },
    },
  }
</script>
