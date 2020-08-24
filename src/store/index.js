import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios'
import VueAxios from 'vue-axios'

const api = "http://localhost:8000/api/"
Vue.use(Vuex);
Vue.use(VueAxios, axios)

export default new Vuex.Store({
    state: {
        foods : [],
        items : []
    },
    getters: {
        foods: (state) => state.foods,
        cartFoods: (state, getters, rootState) => {
            return state.items.map(({ id, quantity }) => {
              const food = rootState.foods.find(food => food.id === id)
              return {
                price: food.price,
                quantity
              }
            })
          },
        cartTotalPrice: (state, getters) => {
            return getters.cartFoods.reduce((total, food) => {
              return total + food.price * food.quantity
            }, 0)
        }
    
    },
    mutations: {
        setFoods(state,foods){
            state.foods = foods
        },
        pushFoodToCart (state, { id , quantity , price }) {
            state.items.push({
                id,
                quantity,
                price
            })
        },
    
        setCartItems (state, { items }) {
            state.items = items
        },
        popFoodFromCart(state,{id}){
           var index = state.items.findIndex(function(o){
                return o.id === id;
           })
        
           if (index !== -1) state.items.splice(index, 1);
        }
        
    },
    actions: {
        getAllFoods({commit}){
            axios.get(api + "foods",{
                params : {
                  with : "restaurant",
                  search : `restaurant_id:${window.id}`,
                  searchField: "restaurant.id:="
                }
              }).then(response => {
                  commit('setFoods',response.data.data)
              })
        },
        addFoodToCart ({ state, commit }, food) {
           
            const cartItem = state.items.find(item => item.id === food.id)
            if(!cartItem){
                //Add else remove
               commit('pushFoodToCart', { id: food.id ,quantity : food.quantity,price : food.price})
            }else{
               commit('popFoodFromCart',{id: food.id})
            }
              
          },
          updateFoodToCart({state,commit},food) {
              const cartItem = state.items.find(item => item.id == food.id)
              {
                  if(cartItem){
                    commit('popFoodFromCart',{id: food.id})
                    commit('pushFoodToCart', { id: food.id ,quantity : food.quantity,price : food.price})
                  }
              }
          }
    },
    modules: {},
});


