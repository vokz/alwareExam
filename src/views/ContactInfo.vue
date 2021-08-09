<template>
    <div>
      <b-table-simple small caption-top stacked>
        <caption  class="text-right">
            <b-button-group>
            <b-button variant="success" @click="updateState(updateStats)">Update</b-button>
            <b-button variant="info" @click="changeFavorite(person.id,person.favorite)">{{ person.favorite ? 'Remove from Favorites' : 'Add to Favorites'}}</b-button>
            <b-button variant="danger" @click="deletePerson(person.id)">Delete</b-button>
            </b-button-group>
        </caption>
        <colgroup><col><col></colgroup>
        <colgroup><col><col><col></colgroup>
        <colgroup><col><col></colgroup>
        <b-tbody>
          <b-tr>
            <b-th rowspan="3" class="text-center">Contact Info</b-th>

            <b-td stacked-heading="Firstname" class="text-left">
              <div v-if="!updateStats">
                {{ person.first_name }}
              </div>
              <div v-if="updateStats">
                <b-form-input v-model="$v.payload.first_name.$model" placeholder="Enter first name" :state="!$v.payload.first_name.$invalid"></b-form-input>
                <span class="error-message" v-if="!$v.payload.first_name.required">* Required</span>
                <span class="error-message" v-if="!$v.payload.first_name.alpha">* Should be alphabet only.</span>
              </div>
            </b-td>

            <b-td stacked-heading="Lastname" class="text-left">
              <div v-if="!updateStats">
                {{ person.last_name }}
              </div>
              <div v-if="updateStats">
                <b-form-input v-model="$v.payload.last_name.$model" placeholder="Enter last name" :state="!$v.payload.last_name.$invalid"></b-form-input>
                <span class="error-message" v-if="!$v.payload.last_name.required">* Required</span>
                <span class="error-message" v-if="!$v.payload.last_name.alpha">* Should be alphabet only.</span>
              </div>
            </b-td>

            <b-td stacked-heading="Phone Number" class="text-left">
              <div v-if="!updateStats">
                {{ person.phone_number }}
              </div>
              <div v-if="updateStats">
                <b-form-input v-model="$v.payload.phone_number.$model" placeholder="Enter phone number" :state="!$v.payload.phone_number.$invalid"></b-form-input>
                <span class="error-message" v-if="!$v.payload.phone_number.required">* Required</span>
                <span class="error-message" v-if="!$v.payload.phone_number.numeric">* Should be a numeric value.</span>
                <span class="error-message" v-if="!$v.payload.phone_number.checkNumberExist">* Phone number already exist.</span>
                <span class="error-message" v-if="!$v.payload.phone_number.isValidPhoneNumberForRegeion || !$v.payload.phone_number.isValidSeletedCountry">* Should be a valid number for {{ selected.name}}.</span>
              </div>
            </b-td>

            <b-td stacked-heading="Phone Code" class="text-left">
              <div v-if="!updateStats">
                {{ person.dial_code }}
              </div>
              <div v-if="updateStats">
                {{ selected.dial_code }}
              </div>
            </b-td>

            <b-td stacked-heading="Complete Number" class="text-left">
              {{ formatPhoneE164() }}
            </b-td>

            <b-td stacked-heading="Country" class="text-left" id="countryOptions">
              <div v-if="!updateStats">
                <img :src="'https://www.countryflags.io/' +  person.code  + '/shiny/16.png'" alt="" class="flag"> {{ person.country }}
              </div>

              <div v-if="updateStats">
                <img :src="'https://www.countryflags.io/' + selected.code +'/shiny/32.png'" alt="" class="flag">
                <v-select :options="options" label="name" @input="getSelected" :value="selected.name">
                  <template slot="option" slot-scope="option">
                    <img :src="'https://www.countryflags.io/' + option.code +'/shiny/16.png'" alt="" class="flag">
                      {{ option.name }}
                  </template>
                </v-select>
              </div>
            </b-td>
            <b-td stacked-heading="Date Created" class="text-left">{{ timeConvert(person.created_at) }}</b-td>
            <b-td class="text-right" v-if="updateStats"><b-button variant="success" @click="saveUpdate()">Save Info</b-button> <b-button @click="cancelUpdate()">Cancel</b-button></b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>

      <!-- Modal Confirm -->
      <b-modal id="confirm">{{ confirmMessage }}</b-modal>
    </div>
</template>

<script>
import _ from 'lodash';
import stateMixins from '../mixins/stateManagement'
import globalFunctions from '../mixins/globalFunctions'
import {CountryCode} from '../classes/enums/CountryCodes'
import { required, numeric, alpha } from 'vuelidate/lib/validators'

const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

export default {
  name: 'ContactInfo',
  data: () =>({
      person: [],
      confirmMessage: '',
      updateStats: false,

      payload:{
        id:0,
        first_name: '',
        last_name: '',
        phone_number: '',
        dial_code:'',
        code:'',
        country:'',
        created_at: '',
        favorite: false
      },

      options: [],

      selected:{
        code: '',
        dial_code:'',
        name:''
      },

      otherPersons: []

  }),

  validations:{
    payload:{
      first_name: {
          required,
          alpha
      },
      last_name: {
          required,
          alpha
      },
      phone_number: {
          required,
          numeric,
          isValidPhoneNumberForRegeion(){
            return this.isValidPhoneNumberForRegeion()
          },
          isValidSeletedCountry(){
            return this.isValidSeletedCountry()
          },
          checkNumberExist(){
            return this.checkNumberExist()
          }
      }
    }
  },

  methods:{
    confirm(params, action) {
        this.$bvModal.msgBoxConfirm(this.confirmMessage, {
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'YES',
          cancelTitle: 'NO',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
          .then(status => {
            if(action == 'DELETE'){
                if(status){
                  this.deleteContact(params)
                  this.$router.push({ path: '/' })
                }
            }

            if(action == 'DISCARD CHANGES'){
              if(status){
                this.populatePayload()
                this.updateStats = false
              }else{
                this.updateStats = true
              }
            }

            if(action == 'UPDATE'){
              if(status){
                this.updateContact(this.payload)
                this.loadPerson()
                this.updateStats = false
              }else{
                this.updateStats = false
              }
            }
          })
          .catch(err => {
            console.log(err)
          })
    },

    deletePerson(id){
      this.confirmMessage = "Are you sure you want to delete this contact person?"
      this.confirm(id,'DELETE')
    },

    updateState(stats){
      if(stats){
        this.discardChanges()
        this.updateStats = true
      }else{
        this.populatePayload()
        this.updateStats = true
      }
    },

    cancelUpdate(){
      if(this.updateStats){
        this.discardChanges()
      }

      this.updateStats = false
    },

    discardChanges(){
      this.confirmMessage = "Discard changes?"
      this.confirm(0,'DISCARD CHANGES')
    },

    getSelected(val){
      this.selected = val
    },

    populatePayload(){
      // Populate Payload for update
      const clonePerson = Object.assign({}, this.person);
      this.payload = clonePerson
    },

    loadPerson(){
      this.person = this.dataItems.find(obj => {
          return obj.id == this.$route.params.contact_id
      })
    },

    loadSelected(){
      // Load selected from Select
      this.selected = this.options.find(obj => {
            return obj.code == this.person.code
      })
    },

    saveUpdate(){
      if(!this.$v.$invalid){
        this.confirmMessage = "Save changes?"
        this.confirm(0,'UPDATE')
      }
    },

    isValidPhoneNumberForRegeion(){
      if(this.payload.phone_number && this.selected.code){
        return phoneUtil.isValidNumberForRegion(phoneUtil.parse(this.payload.phone_number, this.selected.code), this.selected.code);
      }

      return true
    },

    isValidSeletedCountry(){
      if(this.payload.phone_number && this.selected.code){
        return phoneUtil.isValidNumberForRegion(phoneUtil.parse(this.payload.phone_number, this.selected.code), this.selected.code);
      }

      return true
    },

    formatPhoneE164(){
      const number = phoneUtil.parseAndKeepRawInput(this.payload.phone_number, this.payload.code);
      return phoneUtil.format(number, PNF.E164)
    },

    checkNumberExist(){
      if(this.payload.phone_number){  
        this.otherPersons = this.dataItems.filter(obj => {
            return obj.id != this.$route.params.contact_id
        })

        let count = this.otherPersons.filter(obj => {
            return obj.phone_number == this.payload.phone_number
        })

        return count.length > 0 ? false : true
      }

      return true
    }
  },

  created(){
    this.loadPerson()
  },

  async mounted(){
    this.options = CountryCode
    this.loadSelected()
    this.populatePayload()
  },

  mixins: [stateMixins, globalFunctions]
}
</script>

<style scoped>
.flag{
    position: relative;
    bottom: 1px;
}

.form-control{
  max-width: 240px;
  width: 100%;
}

#countryOptions select{
  max-width: 300px;
}

#countryOptions .dropdown {
  display: inline-block;
  max-width: 200px;
  width: 100%;
}

#countryOptions .dropdown li {
  border-bottom: 1px solid rgba(112, 128, 144, 0.1)
}

#countryOptions .dropdown li:last-child {
  border-bottom: none;
}

#countryOptions .dropdown li a {
  padding: 10px 20px;
  display: flex;
  width: 100%;
  align-items: left;
  font-size: 1.25em;
}

#countryOptions .dropdown li a .fa {
  padding-right: 0.5em;
}

 /*prevent bootstrap-vue css conflict*/
.v-select.dropdown .dropdown-toggle::after {
content: normal!important;
}
.v-select.dropdown .form-control {
height: inherit;
}

.v-select .dropdown-menu li{
  display: block!important;
  width: 300px!important;
}

.v-select .dropdown-menu li>a{
  white-space: initial!important;
}
</style>