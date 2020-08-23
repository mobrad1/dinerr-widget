<template>
  <div>
    <button class="btn btn-primary" @click="show">Order Now</button>
    <modal name="order-modal" height="auto" width="600px">
        <form-wizard :title="restaurant_name" subtitle="" step-size="xs" @on-complete="onComplete" finish-button-text="Pay & Finish" shape="tab" :start-index="0">
          <tab-content title="Order details" >
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
        
          
          <div>Total Price {{total | currency}} </div>
      </form-wizard>
    </modal>
  </div>
</template>
<script src=""></script> 
<script>
import {FormWizard, TabContent} from 'vue-form-wizard'
import FoodCard  from './FoodCard.vue';
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'HelloWorld',
  components: {
    FormWizard,
    TabContent,
    FoodCard
  },
  data () {
    return {
      api : "http://localhost:8000/api/",
      restaurant_name : "",
      email : "",
      firstName : "",
      lastName : "",
      city : "",
      state : "",
      address : "",
      telephone : "",
      selectedItems : [],
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
        getImage(media){
          if(media.length > 0){
             return media[0].url
          }
          return "../assets/logo.png"
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
                    a.$modal.hide('order-modal');
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
      this.axios.get(this.api + "restaurants/" + window.id).then(response => {
        this.restaurant_name = response.data.data.name
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
a {
  color: #42b983;
}
.food-holder{
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-items: stretch;
  justify-content: center;
  height: 400px;
  overflow-y: scroll;
}

</style>
