<template>
  <div class="food-card d-flex flex-column m-2">
        <div class="food-img" :style="imageBackground(img)">
            <div class="p_input">   
                <input type="checkbox" class="p_checkbox"  @change="addItem(food)">
            </div>
        </div>

        <div class="food-details d-flex flex-grow-1 p-3 flex-column justify-content-between">
            <div class="price-name flex-column">
                <span class="h6">{{food.name}}</span>
                <b><p class="text-primary mb-0">{{food.price | currency}}</p></b>
            </div>

            <div class="food-price d-flex align-items-center">
                <label for="quantity" class="text-muted mr-2">Quantity</label>
                <input class="form-control" id="quantity" type="number" @change="updateItem(food)" v-model="quantity">
            </div>
        </div>
  </div>
</template>

<script>

export default {
    props : ["food","img"],
    data(){
        return {
            isChecked : false,
            quantity : 1
        }
    },
    methods : {
        imageBackground(img){
            return {
                "background-image" : `url(${img})`
            }
        },
        addItem(food){
          food.quantity = this.quantity  
          this.$store.dispatch('addFoodToCart',food)
        },
        updateItem(food){
          food.quantity = this.quantity
          this.$store.dispatch('updateFoodToCart',food)  
        }
    }
}
</script>

<style scoped>
    .food-card {
        width: 150px;
        margin : 5px;
        border: 1px solid whitesmoke;
        height: 285px;
    }
    .food-details {
        border-top: 1px solid whitesmoke;
    }
    .food-img{
        background-position: center;
        min-height: 124px;
        max-height: 120px;
        width: 100%;
        height: 100%;
        border-radius: 0;
        border: 0;
        background-color: #FFFFFF;
        border-bottom: 1px solid #F4F4F4;
    }

    .form-control{
        width: 50%;
        height: 20px;
        margin: 3px;
        padding: 12px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
        resize: vertical;
    }
    .p_checkbox{
        float: left;
        margin: 5px;
    }
    .text-muted{
        font-size: 0.6rem !important;
    }
    .h6{
        text-transform: capitalize !important;
    }
</style>