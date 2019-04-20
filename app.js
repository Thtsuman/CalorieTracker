// Storage Controller
const StorageCtrl = (function () {

    // public methods
    return {
        storeItem: function (item) {
            let items;
            // check if there any data in LS
            if (localStorage.getItem('items') === null) {
                items = [];
                // push new item to items
                items.push(item);
                // set ls
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                // get already present data from ls
                items = JSON.parse(localStorage.getItem('items'));

                // push new item into items
                items.push(item);

                // set ls
                localStorage.setItem('items', JSON.stringify(items));
            }
        },

        getItemsFromStorage: function () {
            let item;
            // check if there any data in LS
            if (localStorage.getItem('items') === null) {
                items = [];
            } else {
                // get already present data from ls
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        },
        updateItemFromStorage: function (updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function (item, index) {
                if (item.id === updatedItem.id) {
                    items.splice(index, 1, updatedItem);
                }
            });

            // set localStorage again
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function (id) {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function (item, index) {
                if (id === item.id) {
                    items.splice(index, 1);
                }
            });

            // set LS 
            localStorage.setItem('items', JSON.stringify(items));
        },
        removeAllItems: function () {
            localStorage.removeItem('items');
        }
    }
})();


// Item Controller
const ItemCtrl = (function () {
    // Item contstructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data structure / State
    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    // Public function
    return {
        getItems: function () {
            return data.items;
        },
        addItem: function (name, calories) {
            // create ID
            let ID;
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            calories = parseInt(calories);

            // create new item
            newItem = new Item(ID, name, calories);

            // push to data structure
            data.items.push(newItem);

            return newItem;
        },
        getTotalCalories: function () {
            let total = 0;

            data.items.forEach(function (item) {
                total += item.calories;
            });

            // assign total calories to data structure
            data.totalCalories = total;

            // return total calories
            return data.totalCalories;
        },
        updateItem: function (name, calories) {
            // calories to number
            calories = parseInt(calories);

            let found = null;
            data.items.forEach(function (item) {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;

        },
        deleteItem: function (id) {
            // Get ids
            const ids = data.items.map(function (item) {
                return item.id;
            });

            // get index
            const index = ids.indexOf(id);

            // remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function () {
            data.items = [];
        },
        getItemById: function (id) {
            let found = null;
            data.items.forEach(function (item) {
                if (item.id === id) {
                    found = item;
                }
            });

            return found;
        },
        setCurrentItem: function (item) {
            data.currentItem = item;
        },
        getCurrentItem: function () {
            return data.currentItem;
        },
        logData: function () {
            return data;
        }
    }
})();



// UI Controller
const UICtrl = (function () {

    // UI selector names
    const UISelectors = {
        itemList: '#item-list',
        listItem: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        clearBtn: '.clear-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    // public function
    return {
        populateItemList: function (items) {
            let html = '';
            items.forEach(function (item) {
                html += `
                    <li class="collection-item" id="item-${item.id}">
                        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pen-square"></i>
                        </a>
                    </li>
                `;
            });

            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value,
            }
        },
        addListItem: function (item) {
            // show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // create li element for new item 
            const li = document.createElement('li');
            // add clssses
            li.className = 'collection-item';
            // add id
            li.id = `item-${item.id}`;

            // add html 
            li.innerHTML = `
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pen-square"></i>
                </a>
            `;

            // adding li to the list
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: function (item) {
            let listItems = document.querySelectorAll(UISelectors.listItem);
            // change node list to array
            listItems = Array.from(listItems);

            listItems.forEach(function (listItem) {
                const itemID = listItem.getAttribute('id');

                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `
                        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pen-square"></i>
                        </a>
                    `;
                }
            })
        },
        delelteListItem: function (id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        removeItems: function () {
            // get all list item
            let listItems = document.querySelectorAll(UISelectors.listItem);

            // convert node to array
            listItems = Array.from(listItems);

            // remove from UI
            listItems.forEach(function (item) {
                item.remove();
            });
        },
        addItemToForm: function () {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        showTotalCalories: function (totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        showEditState: function () {
            document.querySelector(UISelectors.addBtn).style.display = 'none';
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
        },
        clearEditState: function () {
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
        },
        clearField: function () {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        getSelectors: function () {
            return UISelectors;
        }
    }
})();



// App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {

    // Load event listeners
    const loadEventListeners = function () {
        const UISelector = UICtrl.getSelectors();

        // add event listener
        document.querySelector(UISelector.addBtn).addEventListener('click', itemAddSubmit);

        // disable enter button
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });

        // edit icon click event
        document.querySelector(UISelector.itemList).addEventListener('click', itemEditClick);

        // update click event
        document.querySelector(UISelector.updateBtn).addEventListener('click', itemUdpdateSubmit);

        // delete click event
        document.querySelector(UISelector.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // back click event
        document.querySelector(UISelector.backBtn).addEventListener('click', backClickEvent);

        // clearAll click event
        document.querySelector(UISelector.clearBtn).addEventListener('click', clearAllItems);
    };

    // add item submit
    const itemAddSubmit = (e) => {
        // get form input from ui controller
        const input = UICtrl.getItemInput();

        // check for name and calorie input
        if (input.name !== '' && input.calories !== '') {
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // Add new item to UI list
            UICtrl.addListItem(newItem);

            // calculate total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // put total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Store in LocalStorage
            StorageCtrl.storeItem(newItem);

            // clear fields
            UICtrl.clearField();
        }

        e.preventDefault();
    }

    // click edit item
    const itemEditClick = function (e) {
        if (e.target.classList.contains('edit-item')) {
            const listId = e.target.parentNode.parentNode.id;
            // split itemId for id
            const listIdArr = listId.split('-');
            // get item id from the array
            const itemId = parseInt(listIdArr[1]);

            // get item
            const itemToEdit = ItemCtrl.getItemById(itemId);

            // set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // add item info to form
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }

    // update click event
    const itemUdpdateSubmit = function (e) {
        // get form data
        const input = UICtrl.getItemInput();

        // update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
        // update UI
        UICtrl.updateListItem(updatedItem);

        // calculate total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // put total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // update item in LS
        StorageCtrl.updateItemFromStorage(updatedItem);

        UICtrl.clearEditState();
        UICtrl.clearField();

        e.preventDefault();
    }

    // item delete event listener
    const itemDeleteSubmit = function (e) {
        // get current item
        const currentItem = ItemCtrl.getCurrentItem();

        // delelte item from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // delete from UI
        UICtrl.delelteListItem(currentItem.id);

        const totalCalories = ItemCtrl.getTotalCalories();
        // put total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // delelte item from LS
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();
        UICtrl.clearField();

        e.preventDefault();
    }

    // back button event listener
    const backClickEvent = function (e) {
        UICtrl.clearEditState();
        UICtrl.clearField();

        e.preventDefault();
    }

    // clearAll event listener
    const clearAllItems = function (e) {
        // clear all data from data structure
        ItemCtrl.clearAllItems();

        // remove from UI
        UICtrl.removeItems();

        // remove items from LS
        StorageCtrl.removeAllItems();

        const totalCalories = ItemCtrl.getTotalCalories();
        // put total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearEditState();
        UICtrl.clearField();
        UICtrl.hideList();

        e.preventDefault();
    }

    // public function 
    return {
        init: function () {
            // clear buttons 
            UICtrl.clearEditState();
            UICtrl.clearField();
            // fetch data structure form ItemCtrl
            const items = ItemCtrl.getItems();

            // check if there any data
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                // populate the items
                UICtrl.populateItemList(items);
            }

            // calculate total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // put total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App
App.init();