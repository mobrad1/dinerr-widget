<template>
  <div class="dinerr-widget">
        <form-wizard  :title="restaurant_name" subtitle="" color="#ff5800" v-if="!isComplete" step-size="xs" @on-complete="onComplete" finish-button-text="Pay & Finish" shape="tab" :start-index="index" >
          <tab-content title="Order details" :before-change="beforeTabSwitch">
            <div class="form-group">
      
              <select v-model="category_id"  class="form-control" @change="updateFoods($event)">
                <option value="" disabled>Select a category</option>
                <option value="all">All Categories</option>
                <option  v-for="category in categories" :key="category.id" :value="category.id">{{category.name}}</option>
              </select>
            </div>
            <div class="food-holder">
              <food-card v-for="food in foods" :key="food.id" :food="food" :img=getImage(food.media) >

              </food-card>
              
            </div>
            
          </tab-content>
          <tab-content title="Delivery Details" :before-change="beforeDeliverySwitch">
              <div class="form-group">
                <label for="delivery-time">Delivery Time</label>
                <!-- <datetime v-model="delivery_time" class="theme-orange" @input="checkAvailibility($event)" :min-datetime="getMinDate" input-style="width:100%;border: 1px solid #ced4da;padding:.375rem .75rem;color:#495057;" type="datetime" :minute-step="30"></datetime> -->
                <VueCtkDateTimePicker button-color="#ff5800" color="#ff5800" :min-date="getMinDate" :disabled-dates="getOpenings" minute-interval="30" v-model="delivery_time" />
              </div>
              <div class="form-group">
                <label for="note">Note</label>
                <textarea v-model="note" cols="30" rows="10" class="form-control" placeholder="Enter extra note for orders"></textarea>
              </div>
          </tab-content>
          <tab-content title="Personal Details">
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="first-name">First Name</label>
                  <input type="text" class="form-control" id="first-name" v-model="firstName" placeholder="Please enter first name"/>
                </div>
                <div class="form-group col-md-6">
                  <label for="last-name">Last Name</label>
                  <input type="text" class="form-control" id="last-name" v-model="lastName" placeholder="Please enter last name"/>
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="inputEmail4">Email</label>
                  <input type="email" class="form-control" v-model="email" id="inputEmail4" placeholder="Email">
                </div>
                <div class="form-group col-md-6">
                  <label for="telephone">Telephone</label>
                  <input type="text" class="form-control" id="telephone" v-model="telephone" placeholder="Please Enter Telephone">
                </div>
              </div>
              <div class="form-group">
                <label for="inputAddress">Address</label>
                <input type="text" class="form-control" v-model="address" id="inputAddress" placeholder="1234 Main St">
              </div>
            
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="inputCity">City</label>
                  <input type="text" class="form-control" v-model="city" id="inputCity">
                </div>
                <div class="form-group col-md-6">
                  <label for="inputState">State</label>
                  <select id="inputState" class="form-control" v-model="state">
                    <option selected>Choose...</option>
                    <option>Lagos</option>
                  </select>
                </div>
               
              </div>
          </tab-content>
           <div v-if="errorMsg">
            <span class="error">{{errorMsg}}</span>
          </div>
          <div>Total Price {{total | currency}} </div>
      </form-wizard>
      <div class="success-alert" v-if="isComplete">
          <h3 class="m-2 text-center">{{restaurant_name}}</h3>
          <h4 class="m-2 text-center">Order Placed Successfully</h4>
          <button class="btn btn-dinerr" @click="resetForm">Order Again</button>
          <p class="m-2 text-center">Vendor Contact : <a :href="'tel:' + restaurant_telephone" style="color:blue">  {{restaurant_telephone}}</a></p>
      </div>
   
  </div>
</template>
<script src=""></script> 
<script>
import {FormWizard, TabContent} from 'vue-form-wizard'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';
import FoodCard  from './FoodCard.vue';
import moment from 'moment'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'HelloWorld',
  template: '...',
  components: {
    FormWizard,
    TabContent,
    FoodCard,
   
    VueCtkDateTimePicker: VueCtkDateTimePicker
  },
  props : ["button"],
  data () {
    return {
      api : "https://dev.dinerr.app/api/",
      restaurant_name : "",
      errorMsg : null,
      email : "",
      firstName : "",
      lastName : "",
      city : "",
      state : "",
      address : "",
      telephone : "",
      selectedItems : [],
      restaurant_telephone : "",
      isComplete : false,
      categories : [],
      category_id : '',
      delivery_time : '',
      index : 0,
      lead_time : '',
      note : '',
      openings : null,
      canSwitch : false,
      days : {
        sunday : [
            "2020-08-30",
            "2020-09-06",
            "2020-09-13",
            "2020-09-20",
            "2020-09-27",
            "2020-10-04",
            "2020-10-11",
            "2020-10-18",
            "2020-10-25",
            "2020-11-01",
            "2020-11-08",
            "2020-11-15",
            "2020-11-22",
            "2020-11-29",
            "2020-12-06",
            "2020-12-13",
            "2020-12-20",
            "2020-12-27",
            "2021-01-03",
            "2021-01-10",
            "2021-01-17",
            "2021-01-24",
            "2021-01-31",
            "2021-02-07",
            "2021-02-14",
            "2021-02-21",
            "2021-02-28",
            "2021-03-07",
            "2021-03-14",
            "2021-03-21",
            "2021-03-28",
            "2021-04-04",
            "2021-04-11",
            "2021-04-18",
            "2021-04-25",
            "2021-05-02",
            "2021-05-09",
            "2021-05-16",
            "2021-05-23",
            "2021-05-30",
            "2021-06-06",
            "2021-06-13",
            "2021-06-20",
            "2021-06-27",
            "2021-07-04",
            "2021-07-11",
            "2021-07-18",
            "2021-07-25",
            "2021-08-01",
            "2021-08-08",
            "2021-08-15",
            "2021-08-22",
        ],
        saturday : [
          "2020-08-29",
          "2020-09-05",
          "2020-09-12",
          "2020-09-19",
          "2020-09-26",
          "2020-10-03",
          "2020-10-10",
          "2020-10-17",
          "2020-10-24",
          "2020-10-31",
          "2020-11-07",
          "2020-11-14",
          "2020-11-21",
          "2020-11-28",
          "2020-12-05",
          "2020-12-12",
          "2020-12-19",
          "2020-12-26",
          "2021-01-02",
          "2021-01-09",
          "2021-01-16",
          "2021-01-23",
          "2021-01-30",
          "2021-02-06",
          "2021-02-13",
          "2021-02-20",
          "2021-02-27",
          "2021-03-06",
          "2021-03-13",
          "2021-03-20",
          "2021-03-27",
          "2021-04-03",
          "2021-04-10",
          "2021-04-17",
          "2021-04-24",
          "2021-05-01",
          "2021-05-08",
          "2021-05-15",
          "2021-05-22",
          "2021-05-29",
          "2021-06-05",
          "2021-06-12",
          "2021-06-19",
          "2021-06-26",
          "2021-07-03",
          "2021-07-10",
          "2021-07-17",
          "2021-07-24",
          "2021-07-31",
          "2021-08-07",
          "2021-08-14",
          "2021-08-21",
          "2021-08-28",
        ],
        monday : [
          "2020-08-31",
          "2020-09-07",
          "2020-09-14",
          "2020-09-21",
          "2020-09-28",
          "2020-10-05",
          "2020-10-12",
          "2020-10-19",
          "2020-10-26",
          "2020-11-02",
          "2020-11-09",
          "2020-11-16",
          "2020-11-23",
          "2020-11-30",
          "2020-12-07",
          "2020-12-14",
          "2020-12-21",
          "2020-12-28",
          "2021-01-04",
          "2021-01-11",
          "2021-01-18",
          "2021-01-25",
          "2021-02-01",
          "2021-02-08",
          "2021-02-15",
          "2021-02-22",
          "2021-03-01",
          "2021-03-08",
          "2021-03-15",
          "2021-03-22",
          "2021-03-29",
          "2021-04-05",
          "2021-04-12",
          "2021-04-19",
          "2021-04-26",
          "2021-05-03",
          "2021-05-10",
          "2021-05-17",
          "2021-05-24",
          "2021-05-31",
          "2021-06-07",
          "2021-06-14",
          "2021-06-21",
          "2021-06-28",
          "2021-07-05",
          "2021-07-12",
          "2021-07-19",
          "2021-07-26",
          "2021-08-02",
          "2021-08-09",
          "2021-08-16",
          "2021-08-23",
        ],
        tuesday :[
          "2020-09-01",
          "2020-09-08",
          "2020-09-15",
          "2020-09-22",
          "2020-09-29",
          "2020-10-06",
          "2020-10-13",
          "2020-10-20",
          "2020-10-27",
          "2020-11-03",
          "2020-11-10",
          "2020-11-17",
          "2020-11-24",
          "2020-12-01",
          "2020-12-08",
          "2020-12-15",
          "2020-12-22",
          "2020-12-29",
          "2021-01-05",
          "2021-01-12",
          "2021-01-19",
          "2021-01-26",
          "2021-02-02",
          "2021-02-09",
          "2021-02-16",
          "2021-02-23",
          "2021-03-02",
          "2021-03-09",
          "2021-03-16",
          "2021-03-23",
          "2021-03-30",
          "2021-04-06",
          "2021-04-13",
          "2021-04-20",
          "2021-04-27",
          "2021-05-04",
          "2021-05-11",
          "2021-05-18",
          "2021-05-25",
          "2021-06-01",
          "2021-06-08",
          "2021-06-15",
          "2021-06-22",
          "2021-06-29",
          "2021-07-06",
          "2021-07-13",
          "2021-07-20",
          "2021-07-27",
          "2021-08-03",
          "2021-08-10",
          "2021-08-17",
          "2021-08-24",
        ],
        wednesday :[
          "2020-09-02",
          "2020-09-09",
          "2020-09-16",
          "2020-09-23",
          "2020-09-30",
          "2020-10-07",
          "2020-10-14",
          "2020-10-21",
          "2020-10-28",
          "2020-11-04",
          "2020-11-11",
          "2020-11-18",
          "2020-11-25",
          "2020-12-02",
          "2020-12-09",
          "2020-12-16",
          "2020-12-23",
          "2020-12-30",
          "2021-01-06",
          "2021-01-13",
          "2021-01-20",
          "2021-01-27",
          "2021-02-03",
          "2021-02-10",
          "2021-02-17",
          "2021-02-24",
          "2021-03-03",
          "2021-03-10",
          "2021-03-17",
          "2021-03-24",
          "2021-03-31",
          "2021-04-07",
          "2021-04-14",
          "2021-04-21",
          "2021-04-28",
          "2021-05-05",
          "2021-05-12",
          "2021-05-19",
          "2021-05-26",
          "2021-06-02",
          "2021-06-09",
          "2021-06-16",
          "2021-06-23",
          "2021-06-30",
          "2021-07-07",
          "2021-07-14",
          "2021-07-21",
          "2021-07-28",
          "2021-08-04",
          "2021-08-11",
          "2021-08-18",
          "2021-08-25",
        ],
        thursday :[
          "2020-09-03",
          "2020-09-10",
          "2020-09-17",
          "2020-09-24",
          "2020-10-01",
          "2020-10-08",
          "2020-10-15",
          "2020-10-22",
          "2020-10-29",
          "2020-11-05",
          "2020-11-12",
          "2020-11-19",
          "2020-11-26",
          "2020-12-03",
          "2020-12-10",
          "2020-12-17",
          "2020-12-24",
          "2020-12-31",
          "2021-01-07",
          "2021-01-14",
          "2021-01-21",
          "2021-01-28",
          "2021-02-04",
          "2021-02-11",
          "2021-02-18",
          "2021-02-25",
          "2021-03-04",
          "2021-03-11",
          "2021-03-18",
          "2021-03-25",
          "2021-04-01",
          "2021-04-08",
          "2021-04-15",
          "2021-04-22",
          "2021-04-29",
          "2021-05-06",
          "2021-05-13",
          "2021-05-20",
          "2021-05-27",
          "2021-06-03",
          "2021-06-10",
          "2021-06-17",
          "2021-06-24",
          "2021-07-01",
          "2021-07-08",
          "2021-07-15",
          "2021-07-22",
          "2021-07-29",
          "2021-08-05",
          "2021-08-12",
          "2021-08-19",
          "2021-08-26",
        ],
        friday : [
          "2020-08-28",
          "2020-09-04",
          "2020-09-11",
          "2020-09-18",
          "2020-09-25",
          "2020-10-02",
          "2020-10-09",
          "2020-10-16",
          "2020-10-23",
          "2020-10-30",
          "2020-11-06",
          "2020-11-13",
          "2020-11-20",
          "2020-11-27",
          "2020-12-04",
          "2020-12-11",
          "2020-12-18",
          "2020-12-25",
          "2021-01-01",
          "2021-01-08",
          "2021-01-15",
          "2021-01-22",
          "2021-01-29",
          "2021-02-05",
          "2021-02-12",
          "2021-02-19",
          "2021-02-26",
          "2021-03-05",
          "2021-03-12",
          "2021-03-19",
          "2021-03-26",
          "2021-04-02",
          "2021-04-09",
          "2021-04-16",
          "2021-04-23",
          "2021-04-30",
          "2021-05-07",
          "2021-05-14",
          "2021-05-21",
          "2021-05-28",
          "2021-06-04",
          "2021-06-11",
          "2021-06-18",
          "2021-06-25",
          "2021-07-02",
          "2021-07-09",
          "2021-07-16",
          "2021-07-23",
          "2021-07-30",
          "2021-08-06",
          "2021-08-13",
          "2021-08-20",
          "2021-08-27",

        ]
      },
      allDisabled:[]
      
    }
  },
  computed: {
    ...mapState({
      foods : state => state.foods,
      items : state => state.items
    }),
    ...mapGetters({
      total: 'cartTotalPrice'
    }),
    getMinDate(){
      var dt = moment().add(this.lead_time,"hours").format()
      return dt;
    },
    getOpenings(){
       if(this.openings != null){
          let object = this.openings
            for (const property in object) {
              if(this.openings[property] == ""){
                this.allDisabled.push(this.days[property])
              }
            }
        }
         return this.allDisabled = this.allDisabled.flat()
       
      },
  },
   methods: {
       
        show () {
            this.$modal.show('order-modal');
        },
        hide () {
            this.$modal.hide('order-modal');
        },
        beforeTabSwitch: function(){
          if(this.total > 0){
            this.errorMsg = null
            return true
          }
          this.errorMsg = "Please select an item"
          return false;
        },
        beforeDeliverySwitch(){
          if(this.delivery_time == ""){
            this.errorMsg = "Please select delivery time"
            return false
          }
         
          this.errorMsg = null
          return true
        },
        checkAvailibility(event){
          if(this.openings != null){
            let object = this.openings
            var dayName = this.dayName(moment(event).weekday())
            console.log(dayName)
            if(this.getIfOpened(dayName) == true){
              this.canSwitch = true
              return this.canSwitch
            }
            this.errorMsg = "Restaurant Closed on " + dayName
            this.canSwitch = false
            return false
          }
           
        },
        dayName(num){
         
        },
       
        getImage(media){
          if(media.length > 0){
             return media[0].url
          }
          return "../assets/logo.png"
        },
       
        resetForm(){
          this.isComplete = false;
          this.index = 0
          this.$isLoading(true)
          this.$store.dispatch("resetItems")
          this.$isLoading(false)
        },
        updateFoods(event){
          
          this.$store.dispatch("updateAllFoods",event.target.value)
        },
        onComplete(){
            let a = this;
            let handler = PaystackPop.setup({
            key: 'pk_test_636c9a1c3f12f53b7812c201cc3abd07432eda85', // Replace with your public key
            email: this.email,
            amount: this.total * 100,
            firstname: this.firstName,
            lastname: this.lastName,
          
        
              // label: "Optional string that replaces customer email"
            onClose: function(){
                alert('Window closed.');
            },
            callback: function send(response){
                
                let message = 'Payment complete! Reference: ' + response.reference;
                 return new Promise ((resolve, reject) => {
                   a.$isLoading(true)
                  a.axios.post(a.api + "order/restaurant",{
                    payment : {
                      method : "Paystack"
                    },
                    order_status_id : 1,
                    foods : a.items,
                    email : a.email,
                    name : a.firstName + " " + a.lastName,
                    address : a.address,
                    reference : response.reference,
                    phone : a.telephone,
                    note : a.note,
                    delivery_time : a.delivery_time
                  }).then(response => {
                
                    a.isComplete = true
                    a.$isLoading(false)
                  }).catch(e => {
                    console.log(e)
                  })
                  })
                  
              }
            });

            handler.openIframe();
        }
    },
    mounted(){
      let recaptchaScript = document.createElement('script')
      recaptchaScript.setAttribute('src', 'https://js.paystack.co/v1/inline.js')
      document.head.appendChild(recaptchaScript)
      this.$isLoading(true)
      this.axios.get(this.api + "restaurants/" + window.id + "?with=categories").then(response => {
        this.restaurant_name = response.data.data.name
        this.restaurant_telephone = response.data.data.phone
        this.categories = response.data.data.categories
        this.lead_time = response.data.data.lead_time
        this.openings = response.data.data.openings
        this.$isLoading(false)
      })
      this.$store.dispatch("getAllFoods")
    }
   
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
.success-alert{
  display: flex;
  flex-direction: column;
  margin : 5px;
}
a {
  color: #42b983;
}
.error{
  color: red;
  text-transform: capitalize;
}
.vue-form-wizard{
  width: 100%;
}

.dinerr-widget{
  width: 600px;
  display: flex;
  min-height: 300px;
  justify-content: center;
  align-items: center;
  height: 100%;
  box-shadow:  #cccccc 5px 20px 15px 0px;
}
.btn-dinerr{
  color: white;
  background: #ff5800;
}
.food-holder{
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  min-height : 400px;
  max-height: 450px;
  justify-content: center;
  overflow-y: auto;
}
/* width */
::-webkit-scrollbar {
  width: 10px;
}


/* Track */
::-webkit-scrollbar-track {
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #ff5800;
  border-radius: 5px;
}

</style>
