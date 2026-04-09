import  menuArray  from './data.js'

const containerEl = document.querySelector('.container')
const foodItemSection = document.getElementById('food-item-section')
const orderDetailsSection = document.getElementById('food-total-section')
const cardDetailForm = document.getElementById('card-detail-form')

const foodSelected = menuArray.reduce((acc, item) => {
    acc[item.name] = 0
    return acc
}, {})

document.addEventListener('click', (e) => {
    const selectedFoodItem = e.target.dataset.foodItem
    const removedFoodItem = e.target.dataset.remove
    if (selectedFoodItem && foodSelected.hasOwnProperty(selectedFoodItem)) {
        foodSelected[selectedFoodItem]++
        getOrderDetails()
    }
    else if(removedFoodItem && foodSelected.hasOwnProperty(removedFoodItem)){
        foodSelected[removedFoodItem] = 0
        getOrderDetails()
    }
    else if(e.target.id === "complete-order-btn") {
        getCardDetailForm()
    }
      else if(e.target.id === "pay-btn") {
        e.preventDefault()
        getOrderCompleteMsg()
    }
})

function getFoodItems() {
    return menuArray.map((foodItem) => {
        
           const {name, ingredients, price, emoji} = foodItem
           
           return  ` <div class="food-item flex padding-1">
                        <div class="food-emoji" >${emoji}</div>
                        <div>
                            <h2 class="mgn-btm fs-big">${name}</h2>
                            <p class="ingredients mgn-btm">${ingredients.join(', ')}</p>
                            <p class="mgn-btm fs-big">$${price}</p>
                        </div>
                        <button class="add-item-btn" data-food-item="${name}"><i class="fa-sharp-duotone fa-solid fa-plus plus-icon"></i></button>
                     </div> `
    }).join('')
}

render(foodItemSection, getFoodItems())

function getOrderDetails() {
    let orderDetailHtml = ''
    let totalPrice = 0
    let hasItems = false;
    
    // Loop through each selected food
    for (let [foodName, count] of Object.entries(foodSelected)) {
        if (count > 0) {
            // Find the food info from menuArray
            hasItems = true;
            const foodInfo = menuArray.find(item => item.name === foodName)
            
            const itemTotal = foodInfo.price * count
            totalPrice += itemTotal

            orderDetailHtml += `
                <div class="order-item flex padding-2">
                    <div class="flex gap-1">
                        <h2 class="fs-big-l2">${foodName} (${count})</h2>
                        <button class="remove-btn" data-remove="${foodName}">remove</button>
                    </div>
                    <p class="position-right">$${itemTotal}</p>
                </div>
            `
        }
    }
    
    if(hasItems) orderDetailHtml = '<h2 class="fs-big txt-align-center" >Your Order</h2>' + orderDetailHtml

    // Add total price section
    if (totalPrice > 0) {
        orderDetailHtml += `
            <div class="order-total">
                <h2 class="fs-big">Total Price: <span class="position-right">$${totalPrice}</span></h2>
            </div>
            <button id="complete-order-btn" class="btn">Complete order</button>
        `
    }

    // Render into some container 
    render(orderDetailsSection, orderDetailHtml)
}

function getCardDetailForm(){
    
    cardDetailForm.innerHTML = `
        <form class="flex gap-1">
            <h2 class="fs-big mgn-btm-2">Enter card details</h2>
            <input type="text" name="cardHolderName" placeholder="Enter your name" required/>
            <input type="tel" inputmode="numeric" pattern="[0-9\s]{13,19}" maxlength="19" name="cardNumber" placeholder="Card number" required/>
            <input type="tel" inputmode="numeric" pattern="[0-9]{3}" maxlength="3"  name="cardCVV" placeholder="CVV" required/>
            <button id="pay-btn" type="submit" class="btn">PAY</button>
        </form>
    `
    cardDetailForm.style.display = "flex"  // show modal
    containerEl.style.backgroundColor = "#c3c3c3"
}

function getOrderCompleteMsg() {
    const orderCompleteMsgEl = document.getElementById('order-complete-msg')
    
    const orderCompleteMsgHtml = `
        <h2>Thanks, Arjun! Your order on it's way.</h2>
    `
    
    cardDetailForm.style.display = "none"
    orderDetailsSection.style.display = "none"
    containerEl.style.backgroundColor = ""
    render(orderCompleteMsgEl, orderCompleteMsgHtml)
    orderCompleteMsgEl.style.display = "block"
}


function render(element, htmlContent){
    element.innerHTML = htmlContent;
}