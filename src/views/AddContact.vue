<template>
    <div>
      <b-table-simple small caption-top stacked>
        <colgroup><col><col></colgroup>
        <colgroup><col><col><col></colgroup>
        <colgroup><col><col></colgroup>
        <b-tbody>
          <b-tr>
            <b-th rowspan="3" class="text-center">Add New Contact</b-th>

            <b-td stacked-heading="Firstname" class="text-left">
              <div>
                <b-form-input 
                    v-model="$v.payload.first_name.$model" 
                    placeholder="Enter first name" 
                    :state="!$v.payload.first_name.$invalid"
                    @input="$v.payload.first_name.$touch()"
                ></b-form-input>
                <span class="error-message" v-if="!$v.payload.first_name.required">* Required</span>
                <span class="error-message" v-if="!$v.payload.first_name.alpha">* Should be alphabet only.</span>
              </div>
            </b-td>

            <b-td stacked-heading="Lastname" class="text-left">
              <div>
                <b-form-input v-model="$v.payload.last_name.$model" placeholder="Enter last name" :state="!$v.payload.last_name.$invalid"></b-form-input>
                <span class="error-message" v-if="!$v.payload.last_name.required">* Required</span>
                <span class="error-message" v-if="!$v.payload.last_name.alpha">* Should be alphabet only.</span>
              </div>
            </b-td>

            <b-td stacked-heading="Country" class="text-left" id="countryOptions">
              <div>
                <img :src="'https://www.countryflags.io/' + selected.code +'/shiny/32.png'" alt="" class="flag">
                <v-select :options="options" label="name" @input="getSelected" :value="selected.name">
                  <template slot="option" slot-scope="option">
                    <img :src="'https://www.countryflags.io/' + option.code +'/shiny/16.png'" alt="" class="flag">
                      {{ option.name }}
                  </template>
                </v-select>
              </div>
            </b-td>

            <b-td stacked-heading="Phone Number" class="text-left">
              <div>
                <b-form-input 
                    v-model="$v.payload.phone_number.$model" 
                    placeholder="Enter phone number" 
                    :state="!$v.payload.phone_number.$invalid"
                    @blur="$v.payload.phone_number.$touch()"
                ></b-form-input>
                <span class="error-message" v-if="!$v.payload.phone_number.required">* Required</span>
                <span class="error-message" v-if="!$v.payload.phone_number.numeric">* Should be a numeric value.</span>
                <span class="error-message" v-if="!$v.payload.phone_number.checkNumberExist">* Phone number already exist.</span>
                <span class="error-message" v-if="!$v.payload.phone_number.isValidPhoneNumberForRegeion || !$v.payload.phone_number.isValidSeletedCountry">* Should be a valid number for {{ selected.name}}.</span>
              </div>
            </b-td>

            <b-td stacked-heading="Phone Code" class="text-left">
              <div>
                {{ selected.dial_code ? selected.dial_code : '' }}
              </div>
            </b-td>

            <b-td stacked-heading="Complete Number" class="text-left">
              {{ formatPhoneE164() }}
            </b-td>

            <b-td class="text-right"><b-button variant="success" @click="saveContact()">Save Info</b-button> <b-button @click="cancelAdd()">Cancel</b-button></b-td>
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
import moment from 'moment'

const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

export default {
  name: 'AddContact',
  data: () =>({
      person: [],
      confirmMessage: '',

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
        name:null
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

  watch:{
      'selected.name'(){
          this.payload.phone_number = ''
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
            if(action == 'DISCARD'){
              if(status){
                this.$router.push({ path: '/' })
              }
            }

            if(action == 'SAVE'){
              if(status){
                  this.addContact(this.payload)
                  this.$router.push({ path: '/' })
              }else{
                  this.$router.push({ path: '/' })
              }
            }
          })
          .catch(err => {
            console.log(err)
          })
    },

    cancelAdd(){
      this.confirmMessage = "Discared changes?"
      this.confirm(0,'DISCARD')
    },

    getSelected(val){
      this.selected = val
    },

    saveContact(){
      if(!this.$v.$invalid){
        this.confirmMessage = "Save contact?"
        
        // Setting payload data that not included in form
        this.payload.id = this.dataItems[this.dataItems.length - 1].id + 1
        this.payload.dial_code = this.selected.dial_code
        this.payload.code = this.selected.code
        this.payload.country = this.selected.name
        this.payload.created_at = moment().format('YYYY-MM-DD hh:mm:ss a')


        this.confirm(0,'SAVE')
      }
    },

    isValidPhoneNumberForRegeion(){
        if(this.selected.code && this.payload.phone_number){
            return phoneUtil.isValidNumberForRegion(phoneUtil.parse(this.payload.phone_number, this.selected.code), this.selected.code);
        }

        return true
    },

    isValidSeletedCountry(){
        if(this.payload.phone_number && this.selected.code){
            this.payload.phone_number
            return phoneUtil.isValidNumberForRegion(phoneUtil.parse(this.payload.phone_number, this.selected.code), this.selected.code)
        }

        return true
    },

    formatPhoneE164(){
        if(this.payload.phone_number && this.selected.code){
            const number = phoneUtil.parseAndKeepRawInput(this.payload.phone_number, this.selected.code);
            return phoneUtil.format(number, PNF.E164)
        }

        return ''
    },

    checkNumberExist(){
      if(this.payload.phone_number){    
          let count = this.dataItems.filter(obj => {
              return obj.phone_number == this.payload.phone_number
          })
    
          return count.length > 0 ? false : true
      }

      return true
    }
  },

  async mounted(){
    this.options = CountryCode

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