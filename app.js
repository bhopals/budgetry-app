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
    budget: 0,
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
    calculateBudget: () => {
      calculateTotal('exp');
      calculateTotal('inc');
      let percentage = -1;
      if(data.total.inc > 0) {
        percentage = Math.round((data.total.exp / data.total.inc) * 100 )
      }
      budget = data.total.inc - data.total.exp;
      data.percentage = percentage;
      data.budget = budget;
    }, 
    deleteDataItem : (type, id) => {
      let temp = data.items[type].filter((item)=> item.id != id);
      data.items[type] = temp;
    },
    getBudgetData: () => {
      return {
        totalExpense: data.total.exp,
        totalIncome: data.total.inc,
        percentage: data.percentage,
        budget: data.budget
      }
    }
  }
})()

let uiController = (function(){
  let DOMStrings = {
    type : '.add__type',
    desc : '.add__description',
    value: '.add__value',
    addBtn : '.add__btn',
    deleteBtn: '.item__delete',
    expenseList: '.expenses__list',
    incomeList: '.income__list',
    budgetLabel:'.budget__value',
    incomeLabel:'.budget__income--value',
    expenseLabel:'.budget__expenses--value',
    percentLabel:'.budget__expenses--percentage',
    container: '.container',
    idContainer:'.container-'
  }
  return {
    getInput : function () {
      return {
        type:document.querySelector(DOMStrings.type).value,
        description:document.querySelector(DOMStrings.desc).value,
        value:document.querySelector(DOMStrings.value).value
      }
    },
    
    displayBudget: (object) => {
      document.querySelector(DOMStrings.budgetLabel).textContent = object.budget
      document.querySelector(DOMStrings.incomeLabel).textContent = object.totalIncome
      document.querySelector(DOMStrings.expenseLabel).textContent = object.totalExpense

      if(object.percentage > 0) {
        document.querySelector(DOMStrings.percentLabel).textContent = object.percentage+'%'
      } else {
        document.querySelector(DOMStrings.percentLabel).textContent = '---'
      }
    },

    addItemsList : (object, type) => {
      let element, id;
        if(type === 'inc') {
          element = `<div class="item clearfix container-inc-${object.id}">
              <div class="item__description">${object.desc}</div>
              <div class="right clearfix">
                  <div class="item__value">+ ${object.value}</div>
                  <div class="item__delete" >
                      <button class="item__delete--btn"><i id="inc-${object.id}" class="ion-ios-close-outline"></i></button>
                  </div>
              </div>
          </div>`;
          id = DOMStrings.incomeList;
        } else if(type === 'exp') {
          element = `<div class="item clearfix container-exp-${object.id}">
              <div class="item__description">${object.desc} rent</div>
              <div class="right clearfix">
                  <div class="item__value">- ${object.value}</div>
                  <div class="item__delete" >
                      <button class="item__delete--btn"><i id="exp-${object.id}" class="ion-ios-close-outline"></i></button>
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
    deleteListItems : (itemID) => {
      let elem = document.querySelector(DOMStrings.idContainer+itemID);
      elem.parentNode.removeChild(elem);
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
    document.querySelector(uiCtrl.getDomStrings.container).addEventListener('click', removeItem);
  }
  
  function updateBudget() {
    //1. calculate the Budget
    budgetCtrl.calculateBudget();
    console.log(budgetCtrl.getDataItems);
    console.log(budgetCtrl.getBudgetData());

    //2. Display the budget on UI
    uiCtrl.displayBudget(budgetCtrl.getBudgetData())
  }

  function addItems() {
    let item, inputs;

    //1. Read the inputs
    inputs = uiCtrl.getInput();

    if(inputs.description.trim() !== '' && inputs.value.trim() !== '' && !isNaN(inputs.value)) {
      //2. Add the item to budget controller
      item = budgetCtrl.addItems(inputs.type, inputs.description, parseFloat(inputs.value, 2))

      //3. add the item to UI
      uiCtrl.addItemsList(item, inputs.type);

      //4. clear data elements
      uiCtrl.clearFields();

      //5. updateBudget
      updateBudget();
    }
  }

  function removeItem(event) {
    let item = event.target.id;
    if(item) {
      let list = item.split('-');
      let type = list[0];
      let id = list[1];
      if(type && id) {
        budgetCtrl.deleteDataItem(type, id);
        uiCtrl.deleteListItems(event.target.id);
        updateBudget();
      }
    }
  }

  return {
    init: () => {
      uiCtrl.displayBudget({
        totalExpense: 0,
        totalIncome: 0,
        percentage: 0,
        budget: 0})
      addEventListeners()
  }
} 
  
})(budgetController, uiController)


appController.init();