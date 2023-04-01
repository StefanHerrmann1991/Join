let urgencies = ['High', 'Medium', 'Low'];
let categories = [{
    'topic': 'Sales',
    'color': 'FC71FF',
    'index': '0'
}, {
    'topic': 'Backoffice',
    'color': '#1FD7C1',
    'index': '1'
}];
let users
let subtasks = [];
let invitedUsers = [];
let assignedUsers = [];
let colorPicker = ['#8AA4FF', '#FF0000', '#2AD300', '#FF8A00', '#E200BE', '#0038FF']
let chosenColor;


async function initTasks() {
    await includeHTML();
    await initBackend();
    await initAddTasks();
    await renderUserList();
    await renderCategories();
    compareDate();
}



/** addToTaskJS 
 * This function is meant to enable the add of tasks to a json array.
 * It also generates a certain ID for new tasks and sends them to the backlog board.
 */
function addToTasks() {
    const task = processTaskInputs();
    task.id = tasks.length + 1; // set id when creating the task
    task.board = 'board-0'; // default-board on task creation
    tasks.push(task);
    saveTasks();
}


function validateData(id, array) {
    let validateId = getId(id);
    if (array.length === 0) validateId.setAttribute('required', '');
    else validateId.removeAttribute('required');
}



/**
 * This function gets input values and returns them as task objects.
 * @returns {Object} - task object
 */
function processTaskInputs(board) {
    if (board == undefined) { board = 'board-0' }
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

function getUrgency() {
    let urgency;
    let urgencyButtons = document.querySelectorAll('#urgency button');
    urgencyButtons.forEach(button => {
        if (button.classList.contains('selected')) {
            urgency = button.getAttribute('data-value');
        }
    });
    return urgency;
}

/**
 * This function renders a notification after successfully submitting a new task
 */
function taskSubmitSuccessful() {
    let taskSuccess = getId('taskSubmitSuccessful');
    let taskName = processTaskInputs();
    taskSuccess.innerHTML = `The Task '${taskName['title']}' was successfully submitted to the <a href="02backlog.html" class="backlog-link"> Backlog</a>`;
    show('taskSubmitSuccessful')
    //window.setTimeout(hide('taskSubmitSuccessful'), 5000);
    window.setTimeout(function () {
        hide('taskSubmitSuccessful')
    }, 2000);
}

/**
 * Empties the input fields in the task forms*/
function clearInputs() {
    clearInputValues(title, date, category, urgency, description);
}

function newCategory() {
    let newCategory = getId('categoryContainer')
    newCategory.classList.remove('assign-btn-container');
    newCategory.innerHTML = `
    <div class="subtasks-container">
        <div class="category-input-color">           
                <input id="categoryInput" type="text" placeholder="New category name"
                onkeyup="this.style.width = ((this.value.length + 1) * 12) + (this.value.length == 0 ? 268 : 0) + 'px';">
                <div class="chosen-color" id="chosenColor"></div>
        </div>
        <div class="button-container">
            <button type="button" class="cancel-button" onclick="cancelNewCategory()"><img
                    src="/assets/img/cancelDark.png"></button>
            <button type="button" class="add-button" onclick="addCategory()"><img
                    src="/assets/img/checkDark.png"></button>
        </div>                
    </div>
    <div id="colorPicker" class="color-picker"></div>       
    `
    renderColorPicker();
}


function cancelNewCategory() {
    let newCategory = getId('categoryContainer')
    newCategory.classList.add('assign-btn-container');
    newCategory.innerHTML = `
    <button type="button" class="assign-btn" onclick="openContainer('categoryMenu')">
    <div class="chosen-category-container" id="categorySelect">Select task category</div>
    <div id="imgArrow"><img src="/assets/img/open.png"></div>
    </button>
        <div class="user-menu" id="categoryMenu">
            <button id="newCategoryBtn" type="button" class="new-category-btn"
            onclick="newCategory()">New category</button>
            <div class="category-list" id="categoryList"></div>
        </div>            
 `
    renderCategories();
}

function renderColorPicker() {
    let pickColor = getId('colorPicker');
    for (let i = 0; i < colorPicker.length; i++) {
        const color = colorPicker[i];
        pickColor.innerHTML += `<button type="button" onclick="chooseCategoryColor(${i})" class="category-color" style="background-color: ${color}"></button>`
    }
}

function chooseCategoryColor(index) {
    let colorId = getId('chosenColor')
    chosenColor = colorPicker[index]
    colorId.innerHTML = `<div style="background-color: ${chosenColor}" class="category-color"></div>`
}

function addCategory() {
    let topic = getId('categoryInput').value
    let color = chosenColor
    if (chosenColor == undefined) color = '#E200BE'
    let newCategory = {
        'topic': topic,
        'color': color,
        'index': categories.length
    }
    categories.push(newCategory)
    cancelNewCategory();
}

function renderCategories() {
    let categoryOption = getId('categoryList')
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        categoryOption.innerHTML += `
        <button type="button" onclick="saveNewCategory(${i})" class="each-category-container">
        <div class="category" id="category-${i}">${category.topic}</div>
        <div class="category-color" style="background-color: ${category.color}"></div>
        </button>
        `
    }
}

function saveNewCategory(index) {
    let chosenCategoryOption = getId('categorySelect');
    let category = categories[index]
    chosenCategoryOption.innerHTML = ` 
    <button id="category" class="category" value="${category.index}">${category.topic}</button>
    <div class="category-color" style="background-color: ${category.color}"></div>   
      `
      console.log(category)
    validateData('validateCategory', category) 
    closeContainer('categoryMenu');
}

document?.addEventListener('DOMContentLoaded', () => {
    let selectedValue = null;
    const buttonEls = document.querySelectorAll('.priority-btn');
    console.log(buttonEls)
    buttonEls.forEach(buttonEl => {
        buttonEl.addEventListener('click', () => {
            // Remove selected class from all buttons
            buttonEls.forEach(b => b.classList.remove('selected'));
            // Add selected class to the clicked button
            buttonEl.classList.add('selected');
            // Store the selected value
            selectedValue = buttonEl.getAttribute('data-value');
        });
    });
});


/**
 * Deletes an element from an array, updates the data on the server,  and renders boards.
 * @param {dataArray} @type {Array}
 * @param {i} @type {Number}
 */
function deleteTask(dataArray, i) {
    dataArray.splice(i, 1);
    renderBoards()
    saveTasks();
}

/**
 * Renders the edit form in an overlay modal field
 * @param {integer} i - index of an element of the tasks array
 */
function renderEditForm(i) {
    let overlay = getId('overlay');
    show('overlay');
    overlay.innerHTML = editFormHTML(i);
}

/**
 * Updates an element with given index i in the given array
 * @param {Array} dataArray
 * @param {integer} i - array index
 */
async function saveEdit(dataArray, i) { // check: async no diff
    let task = await processTaskInputs();
    task.board = dataArray[i].board; // keep the right board
    dataArray[i] = task;
    saveTasks();
    hide('overlay');
    // check if sent from boards page or backlog page and render content
    if (getId('todoBoard')) renderBoards()
    else renderLogs();
}

/** The function disables selection of a date before the current day */
function compareDate() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById('date').setAttribute('min', today);
}


/**
 * Renders HTML option fields from the users array into addToTask.html form select-field
 */
function renderForm() {
    let userSelect = getId('assignUser');
    userSelect.innerHTML = '';
    userSelect.innerHTML = renderUserOptionFields();
}


/* Backend Folder */
window.onload = async function () {
    downloadFromServer();
}


/**
 * Saves tasks in the backend in form of an JSON string */
async function saveTasks() { //check async: no diff
    if (event) event.preventDefault();
    let tasksAsText = JSON.stringify(tasks);
    await backend.setItem('tasks', tasksAsText);
}

/**
 *  This function loads and converts the tasks from text-format to a JSON-array. 
 *  The preventDefault() function is necessary to prevent the page from reloading when adding a new task.
 */
function loadTasks() {
    if (event) event.preventDefault();
    let tasksAsText = backend.getItem('tasks');
    if (tasksAsText) tasks = JSON.parse(tasksAsText);
}

/** The function disables selection of a date before the current day */
function compareDate() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById('date').setAttribute('min', today);
}

function renderUserList() {
    const userListContainer = getId('userList');
    userListContainer.innerHTML = '';
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
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

function renderDetailedUsers(index) {
    let user = users[index];
    getId('userInitialContainer').innerHTML += `<div id="userIcon-${[index]}" class="user-icon" style="background-color : ${user.color}">${user.initial}</div>`;
}

function renderUserInitial(event, index) {
    const user = users[index];
    const userIndex = assignedUsers.indexOf(user);
    if (event.target.checked) {
        user.assigned = true;
        assignedUsers.push(user)
        validateData('validateAssignment', assignedUsers);
        getId('userInitialContainer').innerHTML += `<div id="userIcon-${[index]}" class="user-icon" style="background-color : ${user.color}">${user.initial}</div>`;
    }
    if (!event.target.checked) {
        assignedUsers.splice(userIndex, 1)
        getId(`userIcon-${index}`).remove();
        validateData('validateAssignment', assignedUsers);
    }
}

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

function cancelContactInvitation(array) {
    let inviteContainer = getId('assignBtnContainer');
    inviteContainer.classList.add('assign-btn-container');
    inviteContainer.innerHTML = `
    <button type="button" class="assign-btn" onclick="toggleContainer('userMenu')">
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
    renderUserList(array);
}

function newContactInvitation() {
    let newInvitation;
    userName = getId('userSearchInput').value;
    newInvitation = users.filter(function (user) {
        if (user.name.match(userName)) return user;
    })
    invitedUsers.push(newInvitation);
    cancelContactInvitation();
}

/**
 * The function matches the input in the search input field with the names and emails of the users array.
 * @param {string} input A string containing a name or email.
 * @returns An array of users with names or emails that match the input string.
 */
function autocompleteMatch(input) {
    if (input == '') return [];
    let reg = new RegExp(input);
    return users.filter(function (user) {
        if (user.name.match(reg) || user.email.match(reg)) return user;
    });
}

/**
 * Displays a list of users with names or emails that match the input string.
 * @param {string} val The input string to match against.
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

function renderSubtasks() {
    let subtask = getId('subtasks')
    subtask.classList.remove('assign-btn-container')
    subtask.innerHTML = `
    <div class="subtasks-container">
    <input id="subtaskInput" placeholder="Add new subtask">
    <div class="button-container">
    <button type="button" class="cancel-button" onclick ="cancelSubtask()"><img
    src="/assets/img/cancelDark.png"></button>
    <button type="button" class="add-button" onclick="newSubtask()"><img
    src="/assets/img/checkDark.png"></button>
    </div>
    </div>
    `
}

function addInputValue(id, html) {
    let openableInput = getId(id)
    openableInput.innerHTML = `${html}`
}

function cancelInputValue(id) {
    let openableInput = getId(id)
    openableInput.innerHTML = `${html}`
}

function cancelSubtask() {
    let subtask = getId('subtasks');
    subtask.classList.add('assign-btn-container')
    subtask.innerHTML = `
    <button onclick="renderSubtasks()" type="button" class="assign-btn"  type="text">
    <div id="subtaskMenu">Add new subtask</div><img  class="add-subtask" src="/assets/img/addIcon.png">
    </button>  
    `
}

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

function updateSubtask(index) {
    subtasks[index].checked = !subtasks[index].checked;
}

