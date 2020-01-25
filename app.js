let budgetController = (function(){

  let Expense = function(id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
  }

  let Income = function(id, desc, value) {
    this.id = id;
    this.desc = desc;
    this.value = value;
  }

  let data = {
    items : {
      exp:[],
      inc:[]
    },
    total : {
      exp:0,
      inc:0
    },
    percentage: -1
  }

  function calculateTotal(type) {
    let sum = 0;
    data.items[type].forEach(element => {
      sum += element.value;
    });
    data.total[type] = sum;
    return sum;
  }

  return {
    getDataItems : data,
    addItems : function (type, desc, value) {
      let item, id = 1;
      if(data.items[type].length > 0) {
        id = data.items[type][data.items[type].length -1 ].id+1;
      } 
      if(type === 'inc') {
        item = new Income(id, desc, value);
      } else if(type === 'exp') {
        item = new Expense(id, desc, value);
      }
      data.items[type].push(item);
      return item;
    },
    calculateBudget: (type) => {
      calculateTotal(type);
      let percentage = -1;
      if(data.total.inc > 0) {
        percentage = Math.round((data.total.exp / data.total.inc) * 100 )
      }
      data.percentage = percentage;
      console.log(data.total);
    }, 
    getBudgetData: {
      totalExpense: data.total.exp,
      totalIncome: data.total.inc,
      percentage: data.percentage
    }
  }



})()

let uiController = (function(){
  let DOMStrings = {
    type : '.add__type',
    desc : '.add__description',
    value: '.add__value',
    addBtn : '.add__btn',
    deleteBtn: '.item__delete--btn',
    expenseList: '.expenses__list',
    incomeList: '.income__list'
  }
  return {
    getInput : function () {
      return {
        type:document.querySelector(DOMStrings.type).value,
        description:document.querySelector(DOMStrings.desc).value,
        value:document.querySelector(DOMStrings.value).value
      }
    },
    
    addItemsList : (object, type) => {
      let element, id;
        if(type === 'inc') {
          element = `<div class="item clearfix" id="income-${object.id}">
              <div class="item__description">${object.desc}</div>
              <div class="right clearfix">
                  <div class="item__value">+ ${object.value}</div>
                  <div class="item__delete">
                      <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                  </div>
              </div>
          </div>`;
          id = DOMStrings.incomeList;
        } else if(type === 'exp') {
          element = `<div class="item clearfix" id="expense-${object.id}">
              <div class="item__description">${object.desc} rent</div>
              <div class="right clearfix">
                  <div class="item__value">- ${object.value}</div>
                  <div class="item__percentage">21%</div>
                  <div class="item__delete">
                      <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                  </div>
              </div>
          </div>`
          id=DOMStrings.expenseList;
      }
      document.querySelector(id).insertAdjacentHTML('afterbegin', element)
    },
    clearFields : () => {
      document.querySelector(DOMStrings.value).value = '';
      document.querySelector(DOMStrings.desc).value = '';
      document.querySelector(DOMStrings.value).focus();
    },
    getDomStrings : DOMStrings
  }
})()

let appController = (function(budgetCtrl, uiCtrl){

  let addEventListeners = () => {
    document.querySelector(uiCtrl.getDomStrings.addBtn).addEventListener('click', addItems);
    //document.querySelector(uiCtrl.getDomStrings.deleteBtn).addEventListener('click', removeItem)
    document.addEventListener('keypress', function(event){
      if(event.which == 32 || event.key == 32) {
        addItems();
      }
    })
  }

  function addItems() {
    let item, inputs;

    //1. Read the inputs
    inputs = uiCtrl.getInput();

    if(inputs.description.trim() !== '' && !isNaN(inputs.value)) {
      //2. Add the item to budget controller
      item = budgetCtrl.addItems(inputs.type, inputs.description, parseFloat(inputs.value, 2))

      //3. add the item to UI
      uiCtrl.addItemsList(item, inputs.type);

      //4. clear data elements
      uiCtrl.clearFields();

      //5. calculate the Budget
      budgetCtrl.calculateBudget(inputs.type);
      console.log(budgetCtrl.getDataItems);
      console.log(budgetCtrl.getBudgetData);

      //6. Display the budget on UI
    }
    


  }

  function removeItem() {

  }

  return {
    init: addEventListeners
  }
  
  
})(budgetController, uiController)


appController.init();