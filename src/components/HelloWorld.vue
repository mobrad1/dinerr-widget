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
          <h4 class="m-2">Order Placed successfully</h4>
          <button class="btn btn-dinerr" @click="resetForm">Order Again</button>
          <p class="m-2 text-center">Vendor contact : <a :href="'tel:' + restaurant_telephone">  {{restaurant_telephone}}</a></p>
      </div>
   
  </div>
</template>
<script src=""></script> 
<script>
import {FormWizard, TabContent} from 'vue-form-wizard'
import FoodCard  from './FoodCard.vue';

import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'HelloWorld',
  components: {
    FormWizard,
    TabContent,
    FoodCard
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
      index : 0
    }
  },
  computed: {
    ...mapState({
      foods : state => state.foods,
      items : state => state.items
    }),
    ...mapGetters({
      total: 'cartTotalPrice'
    })
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
          this.errorMsg = "Item must be selected"
          return false;
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
                    phone : a.telephone
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
  background: ff5800;
  border-radius: 5px;
}

</style>
