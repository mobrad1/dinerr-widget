<template>
  <div class="food-card d-flex flex-column m-2">
        <div class="food-img" :style="imageBackground(food.media[0].thumb)">
            <div class="p_input">
                <label>
                    <input type="checkbox" class="p_checkbox"  @change="addItem(food)"> 
                    <span class="checkmark"></span>
                </label>   
                
            </div>
        </div>

        <div class="food-details d-flex flex-grow-1 p-3 flex-column justify-content-between" @click="openMenu">
            <div class="price-name flex-column">
                <span class="h6">{{food.name | truncate(35,"...")}}</span>
                <b><p class="text-primary mb-0">{{food.price | currency}}</p></b>
            </div>

            <div class="food-price d-flex align-items-center">
                <label for="quantity" class="text-muted mr-2">Quantity</label>
                <input class="form-control" id="quantity" type="number" @change="updateItem(food)" v-model="quantity">
            </div>
        </div>
        <modal :name="'menu-item-' + food.id" height="auto" :adaptive="true">
            <div class="food-preview">
                <img :src="img" :alt="food.name" class="responsive">
                <h5 class="mt-2 text-center">{{food.name}}</h5>
            </div>
        </modal>
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
        openMenu(){
            this.$modal.show('menu-item' + '-' + this.food.id);
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
    .food-preview{
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .food-details {
        border-top: 1px solid whitesmoke;
        cursor: pointer;
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
    .responsive {
        object-fit: cover;
        width: 320px;
        max-height: 480px;
     }
     .p_input > label {
         display: block;
        position: relative;
        padding-left: 35px;
        cursor: pointer;
        font-size: 22px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
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
        width: 20px; 
        height: 20px; 
        border: 1px solid red;
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }
    .checkmark {
        position: absolute;
        top: 0;
        left: 0;
        margin:5px;
        height: 25px;
        width: 25px;
        background-color:white ;
        border: 2px solid #ff5800;
    }
    .p_input > label:hover input ~ .checkmark {
        background-color: white;
    }

/* When the checkbox is checked, add a blue background */
.p_input > label input:checked ~ .checkmark {
  background-color: #2196F3;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.p_input > label input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.p_input > label .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

    .text-muted{
        font-size: 0.6rem !important;
    }
    .h6{
        text-transform: capitalize !important;
    }
</style>