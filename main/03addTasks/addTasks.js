/**
 * Searches for the element with class 'popup' in the DOM tree.
 * @type {HTMLElement}
 */
const popup = document?.querySelector('.popup');


/**
 * Initialization of tasks including HTML inclusion, backend initialization, 
 * user list rendering, task loading, categories loading and rendering.
 * Also sets up the priority event listener and compares date.
 * This function uses async/await syntax to ensure all these steps are done sequentially.
 * @async
 */
async function initTasks() {
    await includeHTML();
    await initBackend();
    await renderUserList();
    invitedUsers = await loadFromBackend('invitedUsers', invitedUsers);
    tasks = await loadFromBackend('tasks', tasks);
    categories = await loadFromBackend('categories', categories);
    console.log(invitedUsers, tasks, categories)
    await renderCategories();
    startPriorityEventListener();
    compareDate();
}


/**
 * Adds a new task to the tasks array. It processes the task inputs, 
 * assigns an id, saves the tasks and gives user a feedback on successful submission.
 * If function 'myFunction' is defined, it also renders the boards with the new tasks.
 * @param {string} board - The id of the board to which the task is to be added.
 * @function
 */
function addToTasks(board) {
    event.preventDefault();
    const task = processTaskInputs(board);
    task.id = tasks.length + 1; // set id when creating the task
    tasks.push(task);
    saveToBackend('tasks', tasks)
    openContainer('successfulSubmit');
    setTimeout(function () {
        closeContainer('successfulSubmit');
        window.location.href = '/main/02board/board.html';
    }, 2500);
    if (typeof myFunction === 'function') renderBoards(tasks);
}


/**
 * Checks the data's validity. It sets 'required' attribute for the element if the array is empty.
 * Otherwise, it removes 'required' attribute.
 * @param {string} id - The id of the HTML element to be validated.
 * @param {Array} array - The array to be checked for emptiness.
 * @function
 */
function validateData(id, array) {
    let validateId = getId(id);
    if (array.length === 0) validateId.setAttribute('required', '');
    else validateId.removeAttribute('required');
}


/**
 * Processes and returns a task object from the inputs. 
 * If no board is provided, 'board-0' is used by default.
 * @param {string} [board='board-0'] - The id of the board to which the task is to be added.
 * @returns {object} The task object.
 */
function processTaskInputs(board) {
    if (board == undefined) board = 'board-0';
    else board = chosenBoard
    let [title, description, category, date] = getIds('title', 'description', 'category', 'date');
    let urgency = getUrgency();
    let task = {
        'title': title.value,
        'description': description.value,
        'category': categories[category.value],
        'urgency': urgency,
        'date': date.value,
        'board': board,
        'assignedTo': assignedUsers,
        'subtasks': subtasks,
    };
    return task;
}


/**
 * Gets the value of the checked priority radio button.
 * @returns {string} The value of the checked radio button or undefined if no radio button is checked.
 */
function getUrgency() {
    let urgency;
    let selectedUrgency = document.querySelector('#urgency input.priority-radio:checked');
    if (selectedUrgency) urgency = selectedUrgency.value;
    return urgency;
}


/**
 * Changes the layout for a new category input, and renders a color picker.
 */
function newCategory() {
    let newCategory = getId('categoryContainer');
    newCategory.classList.remove('assign-btn-container');
    newCategory.innerHTML = `
    <div class="subtasks-container">
        <div class="category-input-color">
            <input minlength="3" id="categoryInput" type="text" placeholder="New category name">     
            <div class="chosen-color" id="chosenColor"></div>       
        </div>
        <div class="button-container">
            <button type="button" class="cancel-button" onclick="cancelNewCategory()"><img
                    src="/assets/img/cancelDark.png"></button>
            <button type="button" class="add-button" onclick="addCategory()"><img src="/assets/img/checkDark.png"></button>
        </div>
    </div>
    <div id="colorPicker" class="color-picker"></div>       
    `
    renderColorPicker();
}


/**
 * Cancels the category creation process and reverts the layout changes made in newCategory function. 
 * Then it re-renders the categories.
 */
function cancelNewCategory() {
    let newCategory = getId('categoryContainer')
    newCategory.classList.add('assign-btn-container');
    newCategory.innerHTML = `
    <button type="button" class="assign-btn" onclick="toggleContainer('categoryMenu');">
    <div class="chosen-category-container" id="categorySelect">Select task category</div>
    <div id="imgArrow"><img src="/assets/img/open.png"></div>
    <input id="validateCategory" required class="hidden-input">
    </button>
        <div class="user-menu d-none" id="categoryMenu">
            <button id="newCategoryBtn" type="button" class="new-category-btn"
            onclick="newCategory()">New category</button>
            <div class="category-list" id="categoryList"></div>
        </div>            
 `
    renderCategories();
}


/**
 * Renders a color picker with colors fetched from the 'colorPicker' array.
 */
function renderColorPicker() {
    let pickColor = getId('colorPicker');
    for (let i = 0; i < colorPicker.length; i++) {
        const color = colorPicker[i];
        pickColor.innerHTML += `<button type="button" onclick="chooseCategoryColor(${i})" class="category-color" style="background-color: ${color}"></button>`
    }
}


/**
 * Chooses a color for the new category to be added from the color picker.
 * @param {number} index - The index of the chosen color in the 'colorPicker' array.
 */
function chooseCategoryColor(index) {
    let colorId = getId('chosenColor');
    chosenColor = colorPicker[index];
    colorId.innerHTML = `<div style="background-color: ${chosenColor}" class="category-color"></div>`;
}


/**
 * Adds a new category with the provided topic and color. 
 * If no color is chosen, a default color '#E200BE' is assigned.
 * It then saves the new categories to the backend, cancels the new category input layout and re-renders the categories.
 */
function addCategory() {
    let topic = getId('categoryInput').value;
    let color = chosenColor;
    if (chosenColor == undefined) color = '#E200BE';
    let newCategory = {
        'topic': topic,
        'color': color,
        'index': categories.length
    }
    categories.push(newCategory);
    saveToBackend('categories', categories);
    cancelNewCategory();
    renderCategories();
}


/**
 * Renders categories to the HTML element with id 'categoryList'.
 * Iterates through the 'categories' array and creates a button for each category.
 */
function renderCategories() {
    let categoryOption = getId('categoryList');
    categoryOption.innerHTML = '';
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        categoryOption.innerHTML += `
        <button type="button" onclick="saveCategory(${i})" class="each-category-container">
        <div class="category" id="category-${i}">${category.topic}</div>
        <div class="category-color" style="background-color: ${category.color}"></div>
        </button>
        `
    };
};


/**
 * Saves a category from the categories list by its index. It then validates the category and closes the category menu.
 * @param {number} index - The index of the category in the 'categories' array.
 */
function saveCategory(index) {
    let chosenCategoryOption = getId('categorySelect');
    let category = categories[index];
    chosenCategoryOption.innerHTML = ` 
    <button type="button" id="category" class="category" value="${category.index}">
    <span>${category.topic}</span>
    <div class="category-color" style="background-color: ${category.color}"></div></button>  
      `
    validateData('validateCategory', category);
    closeContainer('categoryMenu');
}


/**
 * Starts an event listener for each priority radio button.
 * It adds the 'selected' class to the label of the checked radio button and removes it when another radio button is selected.
 * @param {string} [selectedValue] - The value of the radio button that is initially selected. 
 */
function startPriorityEventListener(selectedValue) {
    const radioEls = document.querySelectorAll('.priority-radio');
    radioEls.forEach(radioEl => {
        const parentLabel = radioEl.parentElement;
        if (radioEl.value === selectedValue) {
            // If the radio value matches the selectedValue, set its parent label as 'selected'
            parentLabel.classList.add('selected');
            radioEl.checked = true; // Set the radio button as checked
        }
        radioEl.addEventListener('change', () => {
            // Remove selected class from all parent labels
            radioEls.forEach(r => r.parentElement.classList.remove('selected'));
            // Add selected class to the clicked radio button's parent label
            parentLabel.classList.add('selected');
            // Store the selected value
            selectedValue = radioEl.value;
        });
    });
}


/**
 * Clears the inputs for tasks, subtasks and assigned users. It also removes the 'selected' class from priority radio buttons.
 */
function clearInputTasks() {
    let taksIds = getIds('title', 'description', 'category', 'date');
    clearInputValues(taksIds);
    const radioEls = document.querySelectorAll('.priority-radio');
    radioEls.forEach(r => r.parentElement.classList.remove('selected'));
    getId('renderedSubtasks').innerHTML = '';
    getId('userInitialContainer').innerHTML = '';
    getId('validateCategory').required = true;
    closeContainer('categoryMenu');
    cancelNewCategory();
    subtasks = [];
    assignedUsers = [];
}


/**
 * Disables the selection of a date before the current day on the HTML element with id 'date'.
 */
function compareDate() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById('date').setAttribute('min', today);
}


window.onload = async function () {
    downloadFromServer();
}


/**
 * Disables the selection of a date before the current day on the HTML element with id 'date'.
 */
function compareDate() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById('date').setAttribute('min', today);
}


/**
 * Renders a list of users to the HTML element with id 'userList'.
 * Iterates through the 'invitedUsers' array and creates an input checkbox for each user.
 */
function renderUserList() {
    const userListContainer = getId('userList');
    userListContainer.innerHTML = '';
    for (let i = 0; i < invitedUsers.length; i++) {
        const user = invitedUsers[i];
        let isChecked = '';
        if (assignedUsers !== undefined) {
            isChecked = assignedUsers.some(assignedUser => assignedUser.name === user.name) ? 'checked' : '';
        }
        userListContainer.innerHTML += `
        <div class="user-list-container">
          <div>${user.name}</div>
          <input name="assignedUsers" type="checkbox" id="checkbox-${i}" class="square-checkbox" ${isChecked} value="${user.name}" onclick="renderUserInitial(event, '${i}')"> 
        </div>
      `;
        if (isChecked) renderDetailedUsers(i);
    }
}


/**
 * Renders the detailed view of a user.
 * @param {number} index - The index of the user in the 'invitedUsers' array.
 */
function renderDetailedUsers(index) {
    let user = invitedUsers[index];
    getId('userInitialContainer').innerHTML += `<div id="userIcon-${[index]}" class="user-icon" style="background-color : ${user.color}">${user.initial}</div>`;
}


/**
 * Renders the initial of a user when their checkbox is checked and removes it when unchecked.
 * @param {Object} event - The triggering event.
 * @param {number} index - The index of the user in the 'invitedUsers' array.
 */
function renderUserInitial(event, index) {
    const user = invitedUsers[index];
    const userIndex = assignedUsers.indexOf(user);
    if (event.target.checked) {
        user.assigned = true;
        assignedUsers.push(user)
        getId('userInitialContainer').innerHTML += `<div id="userIcon-${[index]}" class="user-icon" style="background-color : ${user.color}">${user.initial}</div>`;
    }
    if (!event.target.checked) {
        assignedUsers.splice(userIndex, 1)
        getId(`userIcon-${index}`).remove();
    }
}


/**
 * Transforms the HTML element with id 'assignBtnContainer' into an window for the user invitation.
 */
function inviteUsers() {
    let inviteContainer = getId('assignBtnContainer');
    inviteContainer.classList.remove('assign-btn-container');
    inviteContainer.innerHTML = `  
    <div class="subtasks-container">
        <input class="costom-datalist" id="userSearchInput" type="text" list="usersSearch" name="userList" placeholder="Contact email" onKeyUp="showResults(this.value)">
        <div class="button-container">
            <button type="button" class="cancel-button" onclick="cancelContactInvitation()"><img
                src="/assets/img/cancelDark.png" ></button>
            <button type="button" class="add-button" onclick="newContactInvitation()"><img
                src="/assets/img/checkDark.png" ></button>
        </div>
    </div>  
    `
}


/**
 * Cancels the process of inviting a new user, reverts the HTML of 'assignBtnContainer' and renders the user list.
 */
function cancelContactInvitation() {
    let inviteContainer = getId('assignBtnContainer');
    inviteContainer.classList.add('assign-btn-container');
    inviteContainer.innerHTML = `
    <button type="button" class="assign-btn" onclick="toggleContainer('userMenu'); toggleContainer('userInitialContainer')">
        <div>Select contact to assign</div>
        <div id="imgArrow"><img src="/assets/img/open.png"></div>
    </button>
    <div class="user-menu" id="userMenu">
        <div class="user-list" id="userList"></div>
        <button id="inviteUserBtn" type="button" class="invite-user-btn"
        onclick="inviteUsers()">Invite new contact<img src="/assets/img/contactsBlack.png">
        </button>   
    </div>
    `
    renderUserList();
}


/**
 * Adds a new invitation based on the value inputted in 'userSearchInput' and cancels the invitation form after successful invitation.
 */
function newContactInvitation() {
    let newInvitation;
    userName = getId('userSearchInput').value;
    newInvitation = users.filter(function (user) {
        if (user.name.match(userName)) return user;
    })
    invitedUsers.push(newInvitation[0]);
    saveToBackend('invitedUsers', invitedUsers)
    cancelContactInvitation();
}


/**
 * Matches the input string with user names or emails and returns a list of matching users.
 * @param {string} input - The input string to match against user names and emails.
 * @returns {Array} An array of user objects whose names or emails match the input string.
 */
function autocompleteMatch(input) {
    if (input == '') return [];
    let reg = new RegExp(input);
    return users.filter(function (user) {
        if (user.name.match(reg) || user.email.match(reg)) return user;
    });
}

/**
 * Renders a dropdown list of user names and emails that match the input string in 'userSearchInput'.
 * @param {string} val - The input string to match against user names and emails.
 */
function showResults(val) {
    const res = getId("userSearchInput");
    res.innerHTML = '';
    let list = '';
    const usersList = autocompleteMatch(val);
    for (let i = 0; i < usersList.length; i++) {
        list += `<option value="${usersList[i].name}">${usersList[i].name} (${usersList[i].email})</option>`;
    }
    res.innerHTML = `<datalist class="custom-datalist" id="usersSearch" name="userList">${list}</datalist>`;
}


/**
 * Transforms the HTML element with id 'subtasks' into a subtask input form where new subtasks could be added to the task.
 */
function renderSubtasks() {
    let subtask = getId('subtasks')
    subtask.classList.remove('assign-btn-container')
    subtask.innerHTML = `
    <div class="subtasks-container">
    <input minlength="3" id="subtaskInput" placeholder="Add new subtask">
    <div class="button-container">
    <button type="button" class="cancel-button" onclick ="cancelSubtask()"><img
    src="/assets/img/cancelDark.png"></button>
    <button type="button" class="add-button" onclick="newSubtask()"><img
    src="/assets/img/checkDark.png"></button>
    </div>
    </div>
    `
}


/**
 * Cancels the process of adding a new subtask, reverts the HTML of 'subtasks'.
 */
function cancelSubtask() {
    let subtask = getId('subtasks');
    subtask.classList.add('assign-btn-container')
    subtask.innerHTML = `
    <button onclick="renderSubtasks()" type="button" class="assign-btn"  type="text">
    <div id="subtaskMenu">Add new subtask</div><img  class="add-subtask" src="/assets/img/addIcon.png">
    </button>  
    `
}


/**
 * Adds a new subtask based on the value inputted in 'subtaskInput' and updates the list of subtasks.
 */
function newSubtask() {
    let subtaskInput = getId('subtaskInput').value;
    let renderedSubtasks = getId('renderedSubtasks');
    subtasks.push({ title: subtaskInput, checked: false });
    renderedSubtasks.innerHTML = "";
    subtasks.forEach((subtask, index) => {
        renderedSubtasks.innerHTML += `
        <div class="subtask-checkbox-container"> 
            <input class="subtask-checkbox" type="checkbox" 
                value="${index}" 
                    ${subtask.checked ? 'checked' : ''} 
                    onchange="updateSubtask(${index})">
            ${subtask.title}
        </div>            
    `;
    });
}


/**
 * Toggles the checked status of a subtask.
 * @param {number} index - The index of the subtask in the 'subtasks' array.
 */
function updateSubtask(index) {
    subtasks[index].checked = !subtasks[index].checked;
}

