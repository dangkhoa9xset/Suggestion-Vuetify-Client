<template>
  <v-app id="inspire">
    <v-container fluid>
      <v-card>
        <v-toolbar
          color="primary"
          dark
          flat
        >
          <v-toolbar-title>All Suggestion List</v-toolbar-title>
          <v-spacer />
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify "
            label="Search"
            single-line
            hide-details
          />
        </v-toolbar>
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
              small
              class="mr-2"
              @click="editSuggestion(item)"
            >
              $mdiPencil
            </v-icon>
            <v-icon
              small
              @click="deleteSuggestion(item)"
            >
              $mdiDelete
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
      </v-card>
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
            <v-icon>$mdiClose</v-icon>
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
                  <v-card>
                    <v-toolbar
                      color="primary"
                      dark
                      flat
                    >
                      <v-toolbar-title>Suggestion Detail</v-toolbar-title>
                    </v-toolbar>
                    <template>
                      <v-simple-table>
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-left">
                                Calories
                              </th>
                              <th class="text-left">
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
                    </template>
                  </v-card>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-card>
                    <v-toolbar
                      color="primary"
                      dark
                      flat
                    >
                      <v-toolbar-title>Approve Status</v-toolbar-title>
                    </v-toolbar>
                    <template>
                      <v-simple-table>
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-left">
                                Calories
                              </th>
                              <th class="text-left">
                                Description
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td> Status </td>
                              <td>
                                <v-chip
                                  :color="getColor(editedItem.status)"
                                  dark
                                >
                                  {{ editedItem.status }}
                                </v-chip>
                              </td>
                            </tr>
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
                    </template>
                  </v-card>
                  <v-card class="mt-8">
                    <v-toolbar
                      color="primary"
                      dark
                      flat
                    >
                      <v-toolbar-title>Scores Status</v-toolbar-title>
                    </v-toolbar>
                    <template>
                      <v-data-table
                        hide-default-footer
                        :headers="scoresheaders"
                        :items="[editedItem]"
                      />
                    </template>
                  </v-card>
                </v-col>
              </v-row>
              <v-divider
                vertical
              />
              <v-card>
                <v-toolbar
                  color="primary"
                  dark
                  flat
                >
                  <v-toolbar-title>Attachments</v-toolbar-title>
                </v-toolbar>
                <v-container fluid>
                  <v-row>
                    <v-carousel
                      show-arrows-on-hover
                    >
                      <v-carousel-item
                        v-for="(attachment, i) of editedItem.attachments"
                        :key="i"
                      >
                        <v-hover
                          v-slot:default="{ hover }"
                        >
                          <template>
                            <v-img
                              v-if="editedfileInfo[i] === 'image/jpeg'
                                || editedfileInfo[i] === 'image/jpg'
                                || editedfileInfo[i] === 'image/gif'
                                || editedfileInfo[i] === 'image/png'"
                              :aspect-ratio="16/9"
                              :src="`http://localhost:3000/api/attachment/files/${attachment}`"
                              class="carousel-img"
                              contain
                            >
                              <v-card-title class="justify-center fill-height white--text">
                                {{ editedfileName[i] }}
                              </v-card-title>
                              <v-expand-transition>
                                <div
                                  v-if="hover"
                                  class="d-flex transition-fast-in-fast-out darken-2 v-card--reveal display-3 white--button"
                                  style="height: 100%;"
                                >
                                  <v-btn
                                    :href="`http://localhost:3000/api/attachment/files/download/${attachment}`"
                                    class="hover--button"
                                    large
                                    fab
                                    color="primary"
                                  >
                                    <v-icon>$mdiCloudDownload</v-icon>
                                  </v-btn>
                                </div>
                              </v-expand-transition>
                            </v-img>
                            <v-card-title
                              v-else
                              class="justify-center fill-height"
                            >
                              {{ editedfileName[i] }}
                              <v-expand-transition>
                                <div
                                  v-if="hover"
                                  class="d-flex transition-fast-in-fast-out darken-2 v-card--reveal display-3 white--button"
                                  style="height: 100%;"
                                >
                                  <v-btn
                                    :href="`http://localhost:3000/api/attachment/files/download/${attachment}`"
                                    class="hover--button"
                                    large
                                    fab
                                    color="primary"
                                  >
                                    <v-icon>$mdiCloudDownload</v-icon>
                                  </v-btn>
                                </div>
                              </v-expand-transition>
                            </v-card-title>
                          </template>
                        </v-hover>
                      </v-carousel-item>
                    </v-carousel>
                  </v-row>
                </v-container>
              </v-card>
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
  import axios from 'axios'
  import { server } from '@/helper'

  export default {
    name: 'ApproverViewSuggestions',
    data: () => ({
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
      editedfileInfo: [],
      editedfileName: [],
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
        },
        {
          sortable: false,
          text: 'Approved',
          value: 'score_approved',
          width: '5%',
          align: 'center',
        },
        {
          sortable: false,
          text: 'CML >= 4',
          value: 'score_cml4',
          width: '5%',
          align: 'center',
        },
        {
          sortable: false,
          text: 'Implemented',
          value: 'score_implemented',
          width: '5%',
          align: 'center',
        },
        {
          sortable: false,
          text: 'Implemented by owner',
          value: 'score_byOwner',
          width: '5%',
          align: 'center',
        },
      ],
      headers: [
        {
          sortable: false,
          text: 'Owner',
          value: 'owner',
          width: '10%',
        },
        {
          sortable: false,
          text: 'Process',
          value: 'owner_process',
          width: '5%',
        },
        {
          sortable: false,
          text: 'Applied Process',
          value: 'applied_process',
          width: '7%',
        },
        {
          sortable: false,
          text: 'Machine',
          value: 'machine',
          width: '5%',
        },
        {
          sortable: false,
          text: 'Area',
          value: 'area',
          width: '5%',
        },
        {
          sortable: false,
          text: 'Categories',
          value: 'categories',
          width: '5%',
        },
        {
          sortable: false,
          text: 'Component',
          value: 'component',
          width: '5%',
        },
        {
          sortable: false,
          text: 'Suggestion Name',
          value: 'suggestion_name',
          width: '20%',
        },
        {
          sortable: false,
          text: 'Description',
          value: 'description',
          width: '20%',
        },
        {
          sortable: false,
          text: 'Status',
          value: 'status',
          width: '5%',
          align: 'center',
        },
        {
          sortable: false,
          text: 'Created at',
          value: 'createdAt',
          width: '5%',
        },
        // {
        //   sortable: false,
        //   text: 'Actions',
        //   value: 'actions',
        //   align: 'center',
        // },
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
          .get(`${server.baseURL}/suggestion`)
          .then(data => {
            this.items = data.data
            this.tableLoading = false
          })
      },
      editSuggestion (item) {
        this.disdialog = true
        this.$router.push({ name: 'editsuggestion', params: { id: item._id } })
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
            .then(data => {
              const index = this.items.indexOf(item)
              this.items.splice(index, 1)
            }).catch(err => {
              this.showSnackbar(err.response.data.message, 5000, false)
            })
          item.attachments.forEach(async element => {
            await axios.delete(`${server.baseURL}/attachment/files/${element}`)
              .catch(err => {
                this.showSnackbar(err.response.data.message, 5000, false)
              })
          })
        }
      },
      getColor (status) {
        if (status === 'Pending') return 'orange'
        else if (status === 'Approved') return 'green'
        else if (status === 'Implementing') return 'teal'
        else if (status === 'Implemented') return 'indigo'
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
        if (!this.editedItem.attachments) {
          return
        }
        this.editedItem.attachments.forEach(element => {
          axios.get(`${server.baseURL}/attachment/files/info/${element}`)
            .then(response => {
              this.editedfileInfo.push(response.data.file.contentType)
              this.editedfileName.push(response.data.file.filename)
            })
        })
      },
    },
  }
</script>
