<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col
        cols="12"
        md="8"
      >
        <base-material-card>
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Exist Suggestion
            </div>

            <div class="subtitle-1 font-weight-light">
              Edit your suggesstion profile
            </div>
          </template>
          <v-form>
            <v-container class="py-0">
              <v-row>
                <v-col
                  cols="12"
                  md="3"
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
                  md="3"
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
                    v-model="items.machine"
                    :items="getMachine(items.applied_process)"
                    label="Machine"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-select
                    v-model="items.area"
                    :items="getArea(items.machine)"
                    label="Area"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-select
                    v-model="items.component"
                    :items="getComponent(items.machine, items.area)"
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
                  class="text-center"
                >
                  <v-btn
                    class="mr-0"
                    outlined
                    color="primary"
                    :loading="saving"
                    @click="editSuggestion"
                  >
                    Save Suggestion
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </base-material-card>
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-card
          v-cloak
          @drop.prevent="addDropFile"
          @dragover.prevent
        >
          <v-container fluid>
            <v-row>
              <v-col
                v-for="(attachment, n) in items.attachments"
                :key="n"
                class="d-flex child-flex"
                cols="6"
              >
                <v-card
                  outlined
                >
                  <v-img
                    :src="imageExistData[n]"
                    :lazy-src="`https://picsum.photos/10/6?image=${n * 5 + 10}`"
                    aspect-ratio="1"
                    class="grey lighten-2 align-end"
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
                      @click="removeExistFile(n)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
            <v-divider />
            <v-row>
              <v-col>
                <v-file-input
                  v-model="files"
                  :rules="rules"
                  label="Select Files from your computer"
                  filled
                  small-chips
                  multiple
                  show-size
                  counter
                  @change="onFileChange"
                />
                <v-card-text class="text-center grey--text">
                  Or
                </v-card-text>
                <v-card-text class="text-center display-4">
                  Drag files here
                </v-card-text>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                v-for="(file, i) in files"
                :key="i"
                class="d-flex child-flex"
                cols="6"
              >
                <v-card
                  outlined
                >
                  <v-img
                    :src="imageData[i]"
                    :lazy-src="`https://picsum.photos/10/6?image=${i * 5 + 10}`"
                    aspect-ratio="1"
                    class="grey lighten-2 align-end"
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
                    {{ file.name }} ({{ (file.size/1024).toFixed(2) }}KB)
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      icon
                      large
                      @click="removeFile(file, i)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
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
  </v-container>
</template>

<script>
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
  import axios from 'axios'
  import { server } from '@/helper'
  export default {
    name: 'EditSuggestions',
    data: () => ({
      rules: [
        value => !value || value.size < 25000000 || 'File size should be less than 25MB!',
      ],
      processes: ['Prepress', 'Printing', 'Laminator', 'Finishing', 'Maintenance', 'Office', 'Logistic & Warehouse', 'QA'],
      areas: [],
      categories: ['Safety', 'Quality', 'Process', 'Operation', 'Effective', 'Visual', '5S', 'Support'],
      components: [],
      attachments: [],
      owner: null,
      owner_process: null,
      applied_process: null,
      area: null,
      machine: null,
      category: null,
      component: null,
      suggestion_name: null,
      description: null,
      benefit: null,
      files: [],
      saving: false,
      snackbar: false,
      snackbarText: 'My timeout is set to 5000.',
      timeout: 5000,
      deleteButton: false,
      id: 0,
      items: {},
      imageData: [],
      imageExistData: [],
      editedfileInfo: [],
      editedfileName: [],
      editedfileSize: [],
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
          id: this.id,
          owner: this.items.owner,
          owner_process: this.items.owner_process,
          applied_process: this.items.applied_process,
          area: this.items.area,
          machine: this.items.machine,
          categories: this.items.categories,
          component: this.items.component,
          suggestion_name: this.items.suggestion_name,
          description: this.items.description,
          benefit: this.items.benefit,
          attachments: this.items.attachments,
        }
        setTimeout(() => this.__submitToServer(suggestionData), 1000)
      },
      async getSuggestion () {
        await axios.get(`${server.baseURL}/suggestion/id/${this.id}`)
          .then(async data => {
            this.items = data.data
            await this.getfileInfo()
          })
      },
      __submitToServer (data) {
        axios.put(`${server.baseURL}/suggestion`, data).then(data => {
          this.$router.go(-1)
        })
      },
      addDropFile (e) {
        // this.files = Array.from(e.dataTransfer.files)
        const droppedFiles = e.dataTransfer.files
        if (!droppedFiles) return
        // this tip, convert FileList to array, credit: https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
        ([...droppedFiles]).forEach(f => {
          this.files.push(f)
        })
        this.onFileChange()
      },
      removeFile (file, n) {
        this.imageData.splice(n, 1)
        this.files = this.files.filter(f => {
          return f !== file
        })
      },
      async removeExistFile (i) {
        if (await this.showSnackbar('Are you sure to delete this item?', 0, true)) {
          await axios.delete(`${server.baseURL}/attachment/files/${this.items.attachments[i]}`).then(() => {
            const data = {
              id: this.id,
              attachID: this.items.attachments[i],
            }
            axios.put(`${server.baseURL}/suggestion/dltattch`, data)
            this.imageExistData.splice(i, 1)
            this.editedfileInfo.splice(i, 1)
            this.editedfileName.splice(i, 1)
            this.editedfileSize.splice(i, 1)
            this.items.attachments.splice(i, 1)
          }).catch(err => {
            this.showSnackbar(err.response.data.message, 5000, false)
          })
        }
      },
      onFileChange () {
        const files = this.files
        this.imageData = []
        if (files && files[0]) {
          for (const file of files) {
            if (file.size < 25000000) {
              if (/\.(jpe?g|png|gif|svg)$/i.test(file.name)) {
                const reader = new FileReader()
                reader.onload = e => {
                  this.imageData.push(e.target.result)
                }
                reader.readAsDataURL(file)
              } else if (/\.(pdf)$/i.test(file.name)) {
                this.imageData.push('https://image.flaticon.com/icons/svg/29/29587.svg')
              } else if (/\.(xlsx)$/i.test(file.name)) {
                this.imageData.push('https://image.flaticon.com/icons/svg/28/28813.svg')
              } else if (/\.(xls)$/i.test(file.name)) {
                this.imageData.push('https://image.flaticon.com/icons/svg/29/29046.svg')
              } else if (/\.(doc)$/i.test(file.name)) {
                this.imageData.push('https://image.flaticon.com/icons/svg/29/29593.svg')
              } else if (/\.(docx)$/i.test(file.name)) {
                this.imageData.push('https://image.flaticon.com/icons/svg/28/28840.svg')
              } else {
                this.imageData.push('https://image.flaticon.com/icons/svg/101/101671.svg')
              }
            } else {
              files.pop()
            }
          }
        }
      },
      async submitFiles () {
        if (this.files) {
          const formData = new FormData()

          // files
          for (const file of this.files) {
            formData.append('files', file, file.name)
          }

          await axios
            .post(`${server.baseURL}/attachment/files`, formData)
            .then(response => {
              response.data.forEach(element => {
                this.items.attachments.push(element.id)
              })
            })
            .catch(error => {
              console.error({ error })
            })
        } else {
          console.warn('There are no files.')
        }
      },
      async getfileInfo () {
        this.editedfileInfo = []
        this.editedfileName = []
        this.editedfileSize = []
        if (!this.items.attachments) {
          return
        }
        await this.items.attachments.forEach(async element => {
          await axios.get(`${server.baseURL}/attachment/files/info/${element}`)
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
      agree () {
        this.resolve(true)
        this.snackbar = false
      },
      cancel () {
        this.resolve(false)
        this.snackbar = false
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
      getMachine (process) {
        if (process === 'Prepress') {
          return ['asdasd']
        } else if (process === 'Printing') {
          return ['']
        } else if (process === 'Laminator') {
          return ['Laminator']
        } else if (process === 'Finishing') {
          return ['Slitter T2E', 'T2E cell', 'CL Slitter', 'Ethena Doctor', 'Main conveyor line 2',
                  'Reel shrink wrap', 'Post Wrapping Conveyor Lines', 'Palletizing', 'Palletizing 1',
                  'Empty Pallet Area', 'Pallet Finishing Area 1', 'Pallet Finishing Area 2']
        } else return ['Please select applied process']
      },
      getArea (machine) {
        if (process === 'Prepress') {
          return ['asdasd']
        } else if (process === 'Printing') {
          return ['']
        } else if (machine === 'Laminator') {
          return ['Unwinder', 'Festoon', 'Flame treater', 'Foil station',
                  'EGS', 'Extruder carriage', 'Lam station', 'Trim cutting',
                  'Lasor', 'Rewinder', 'Silo', 'Control room', 'Pump room', 'General']
        } else if (machine === 'Slitter T2E') {
          return ['Unwinder', 'Pull and Brake', 'Web guide', 'Knife', 'Rewinder',
                  'Shaft Handler', 'Reel Handler']
        } else if (machine === 'T2E cell') {
          return ['Reel Conveyor 3 m w/2 Sections 010', 'InLine Label Printer Slitter Infeed 025',
                  'Lifting Belt Conveyor 1,2 m 4 Belts 011', 'Reel Conveyor 3 m w/2 Sections 012',
                  'Lifting Belt Conveyor 1,2 m 4 Belts 014', 'Reel Tilter w/Front Infeed 013',
                  'InLine Label Printer Doctor Infeed 026', 'Loose Winding Detection Unit 016',
                  'Reel Elevator w/Roller Conv. 018', 'Lifting Belt Conveyor 1,2 m 4 Belts 017',
                  'Reel Conveyor 1,5 m 019', 'Reel Tilter for Doctor Outfeed Table 020', 'Reel Carriage w/7 m Table 021']
        } else if (machine === 'CL Slitter') {
          return ['Unwinder', 'Web thread', 'Splice table', 'Web guide', 'Pull & Brake',
                  'ETC', 'Slitting', 'Rewinder', 'Label application', 'Core handling',
                  'Rell Handling', 'Platform', 'Common Pneumatics', 'Common Electrics', 'CLS General safety']
        } else if (machine === 'Ethena Doctor') {
          return ['Unwinder', 'Splice table', 'Web handling', 'Rewinder',
                  'Electrical control', 'Structure', 'Common', 'Quality Inspection']
        } else if (machine === 'Main conveyor line 2') {
          return ['Reel Elevator w/Roller Conv. 071', 'Lifting Belt Conveyor 1,2 m 4 Belts 083',
                  'Reel Conveyor 1,5 m 072', 'Reel Conveyor 1,7 m 080',
                  'Lifting Belt Conveyor 1,2 m 4 Belts 081', 'Reel Conveyor 3 m w/2 Sections 082']
        } else if (machine === 'Reel shrink wrap') {
          return ['Reel Conveyor 1,5 m 085', 'Reel Wrapper 086', 'Reel Conveyor 3 m w/2 Sections 087',
                  'Reel Conveyor 3 m w/2 Sections 088', 'Copy Label Printer 089']
        } else if (machine === 'Post Wrapping Conveyor Lines') {
          return ['Reel Conveyor 1,7 m 106', 'Lifting Belt Conveyor 1,2 m 4 Belts 105',
                  'Reel Conveyor 2 m 107', 'Reel Conveyor 1,5 m 108', 'Lifting Belt Conveyor 1,2 m 4 Belts 109',
                  'Reel Conveyor 2,2 m 110', 'Reel Conveyor 3 m w/2 Sections 111',
                  'Lifting Belt Conveyor 1,2 m 4 Belts 112', 'Reel Conveyor 1,5 m 113',
                  'Reel Conveyor 3 m w/2 Sections 114', 'Reel Conveyor 1,5 m 115',
                  'Lifting Belt Conveyor 1,2 m 4 Belts 116', 'Reel Conveyor 1,5 m 117', 'Reel Elevator w/Roller Conv. 121']
        } else if (machine === 'Palletizing') {
          return ['Shuttle Cart w/3 Pos. 134', 'Pallet Conveyor 2,4 m 166', 'Turntable 180d w/1,5 m Pal. Conv. 167',
                  'Pallet Conveyor 3,0 m 176', 'Turntable 180d w/1,5 m Pal. Conv. 177', 'Pallet Conveyor 3,0 m 178']
        } else if (machine === 'Palletizing 1') {
          const result = []
          let i
          for (i = 123; i <= 126; i++) {
            result.push(`Reel Conveyor 3 m w/2 Sections ${i}`)
          }
          result.push('Reel Conveyor 1,8 m 128', 'Pallet Conveyor 3,0 m 178',
                      'Lifting Belt Conveyor 1,2 m 4 Belts 127', 'Centering for Jumbo Reels 129', 'Reel Conveyor 1,7 m 130',
                      'Gantry Palletizer 2-Axis 133')
          for (i = 136; i <= 152; i++) {
            result.push(`Gantry Load Pos ${i}`)
          }
          return result
        } else if (machine === 'Empty Pallet Area') {
          return ['Pallet Magazine 155', 'Chain Conveyor wo/Stop 156',
                  'Nail Detector 157', 'Chain Conveyor w/Stop 158',
                  'Pallet Magazine 160', 'Chain Conveyor wo/Stop 161', 'Nail Detector 162',
                  'Chain Conveyor w/Stop 163', 'Bottom Sheet Magazine and Applicator 164']
        } else if (machine === 'Pallet Finishing Area 1') {
          const result = []
          result.push('Pallet Conveyor 2,0 m 168', 'Pallet Conveyor 3,0 m 169',
                      'Top Sheet Mag. Round 165', 'Pallet Conveyor 1,5m w/Lift Tab. 170',
                      'Stretch Wrapper w/Top Film Disp. 171', 'Pallet Conveyor 3,0 m 172', 'Pallet Conveyor 1,5 m 173',
                      'Pallet Label Printer 175', 'Pallet Conveyor 2,4 m 224',
                      'Pallet Conveyor 2,0 m 235', 'Pallet Conveyor 2,6 m 220',
                      'Pallet Conveyor 3,0 m 227', 'Shuttle Cart w/2 Pos. 228')
          let i
          for (i = 229; i <= 231; i++) {
            result.push(`Pallet Conveyor 3,0 m ${i}`)
          }
          result.push('Pallet Conveyor 1,8 m 242', 'Turntable 180d w/1,5 m Pal. Conv. 234',
                      'Pallet Conveyor 0,7 m 247', 'Turntable 180d w/1,5 m Pal. Conv. 246', 'Pallet Conveyor 2,6 m 248')
          return result
        } else if (machine === 'Pallet Finishing Area 2') {
          return ['Pallet Conveyor 2,0 m 179', 'Pallet Conveyor 3,0 m 180',
                  'Top Sheet Mag. Round 174', 'Pallet Conveyor 1,5m w/Lift Tab. 181',
                  'Stretch Wrapper w/Top Film Disp. 182', 'Pallet Conveyor 3,0 m 183', 'Pallet Conveyor 1,5 m 184',
                  'Pallet Label Printer 185', 'Pallet Conveyor 2,4 m 219',
                  'Turntable 180d w/1,5 m Pal. Conv. 221', 'Pallet Conveyor 3,0 m 222',
                  'Pallet Conveyor 1,5 m 237', 'Pallet Conveyor 2,4 m 236']
        } else return ['Please select machine']
      },
      getComponent (machine, area) {
        if (machine === 'Laminator' && area === 'Unwinder') { // Laminator
          return ['Turret', 'U/w conveyor', 'Splice unit', 'Core basket', 'Control panel']
        } else if (machine === 'Laminator' && area === 'Festoon') {
          return ['Festoon', 'Dancer']
        } else if (machine === 'Laminator' && area === 'Flame treater') {
          return ['Flame treater']
        } else if (machine === 'Laminator' && area === 'Foil station') {
          return ['Foil general', 'Spindle arm', 'Control panel']
        } else if (machine === 'Laminator' && area === 'EGS') {
          return ['EGS 1', 'EGS 2', 'EGS 3']
        } else if (machine === 'Laminator' && area === 'Extruder carriage') {
          return ['Extruder', 'Hopper', 'Weight hopper', 'Loader', 'Feedblock',
                  'Die', 'Exhaust', 'Heater', 'Screen pack', 'Breaker plate']
        } else if (machine === 'Laminator' && area === 'Lam station') {
          return ['Belt dancer', 'Control panel', 'PE tray', 'Ozone']
        } else if (machine === 'Laminator' && area === 'Trim cutting') {
          return ['Knife', 'Counter-knife', 'Vaccum system']
        } else if (machine === 'Laminator' && area === 'Lasor') {
          return ['HMI system']
        } else if (machine === 'Laminator' && area === 'Rewinder') {
          return ['Rewinder', 'Shaft handle', 'Core magazine', 'Glue machine', 'Sample checking table']
        } else if (machine === 'Laminator' && area === 'Silo') {
          return ['Mesh', 'Hopper', 'Pipe']
        } else if (machine === 'Laminator' && area === 'Control room') {
          return ['HMI system', 'Tool']
        } else if (machine === 'Laminator' && area === 'Pump room') {
          return ['Filter', 'Dust bag']
        } else if (machine === 'Laminator' && area === 'General') {
          return ['Layout', 'Door', 'Fence', 'Safety barrier', 'Roller',
                  'Platform', 'Cover', 'Crane', 'Tool', 'Safety equipment']
        } else if (area === 'Slitter T2E') { // Finishing
          return ['Unwinder', 'Pull and Brake']
        } else if (area === 'T2E cell') {
          return []
        } else if (area === 'CL Slitter') {
          return []
        } else if (area === 'Ethena Doctor') {
          return []
        } else if (area === 'Main conveyor line 2') {
          return []
        } else if (area === 'Reel shrink wrap') {
          return []
        } else if (area === 'Post Wrapping Conveyor Lines') {
          return []
        } else if (area === 'Palletizing') {
          return []
        } else if (area === 'Palletizing 1') {
          return []
        } else if (area === 'Pallet Finishing Area 1') {
          return []
        } else if (area === 'Pallet Finishing Area 2') {
          return []
        } else return ['Please select Area/Machine']
      },
    },
  }
</script>
