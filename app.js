let budgetController = (function(){

  

})()

let uiController = (function(){

  return {
    getInput : function () {
      return {
        type:document.querySelector('.add__type').value,
        description:document.querySelector('.add__description').value,
        value:document.querySelector('.add__value').value
      }
    }
  }
})()

let appController = (function(budgetCtrl, uiCtrl){

  function addItems() {

    console.log("input>>",uiCtrl.getInput())
    //1. Read the inputs

    //2. Add the item to budget controller

    //3 add the item to UI
    
    //4 calculate the Budget

    //5 Display the budget on UI
    

  }

  function removeItem() {

  }

  document.querySelector('.add__btn').addEventListener('click', addItems);
  document.querySelector('.item__delete--btn').addEventListener('click', removeItem)

  document.addEventListener('keypress', function(event){
    if(event.which == 32 || event.key == 32) {
      console.log('ENTER pressed')
      addItems();
    }
  })
  
})(budgetController, uiController)