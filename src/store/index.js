import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios'
import VueAxios from 'vue-axios'

const api = "https://dev.dinerr.app/api/"
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
            return state.items.map(({ id, amount }) => {
              const food = rootState.foods.find(food => food.id === id)
              return {
                price: food.price,
                amount
              }
            })
          },
        cartTotalPrice: (state, getters) => {
            return getters.cartFoods.reduce((total, food) => {
              return total + food.price * food.amount
            }, 0)
        }
    
    },
    mutations: {
        setFoods(state,foods){
            state.foods = foods
        },
        pushFoodToCart (state, { id , amount , price,variant_id }) {
            state.items.push({
                id,
                amount,
                price,
                variant_id
            })
        },
        resetItems(state){
            state.items = []
        },
    
        setCartItems (state, { items }) {
            state.items = items
        },
        popFoodFromCart(state,{id}){
           var index = state.items.findIndex(function(o){
                return o.id === id;
           })
        
           if (index !== -1) state.items.splice(index, 1);
        },
        updateFoods(state,foods){
            state.foods = foods
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
        updateAllFoods({commit},data){
            if(data == "all" || data == "0"){
                axios.get(api + "foods",{
                    params : {
                      with : "restaurant",
                      search : `restaurant_id:${window.id}`,
                      searchField: "restaurant.id:="
                    }
                  }).then(response => {
                      commit('setFoods',response.data.data)
                  })
                  return
            }
            axios.get(api + "foods",{
                params : {
                  with : "restaurant",
                  search : `category_id:${data}`,
                  searchField: "category_id:="
                }
              }).then(response => {
                  commit('updateFoods',response.data.data)
              })
        },
        resetItems({commit}){
            commit("resetItems")
        },
        addFoodToCart ({ state, commit }, food) {
           
            const cartItem = state.items.find(item => item.id === food.id)
            if(!cartItem){
                //Add else remove
               commit('pushFoodToCart', { id: food.id ,amount : food.amount,price : food.price,variant_id : food.variant_id})
            }else{
               commit('popFoodFromCart',{id: food.id})
            }
              
          },
          updateFoodToCart({state,commit},food) {
              const cartItem = state.items.find(item => item.id == food.id)
              {
                  if(cartItem){
                    commit('popFoodFromCart',{id: food.id})
                    commit('pushFoodToCart', { id: food.id ,amount : food.amount,price : food.price,variant_id:food.variant_id})
                  }
              }
          }
    },
    modules: {},
});


