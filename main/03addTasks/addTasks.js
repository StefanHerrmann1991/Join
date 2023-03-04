let urgencies = ['High', 'Medium', 'Low'];
let categories = [{
    'topic': 'Sales',
    'color': 'FC71FF'
}, {
    'topic': 'Backoffice',
    'color': '#1FD7C1'
}];
let users
let invitedUsers = [];
let assignedUsers = [];
let colorPicker = ['#8AA4FF', '#FF0000', '#2AD300', '#FF8A00', '#E200BE', '#0038FF']

async function initTasks() {
    await includeHTML();
    await initBackend();
    await initAddTasks();
    await renderUserList();
    await renderCategories();
    /*  await renderForm(); */
    compareDate();
}

async function initAddTasks() {
    setURL('https://stefan-herrmann.developerakademie.net/smallest_backend_ever');
    await downloadFromServer();
    tasks = JSON.parse(backend.getItem('tasks')) || [];
}

/** addToTaskJS 
 * This function is meant to enable the add of tasks to a json array.
 * It also generates a certain ID for new tasks and sends them to the backlog board.
 */
function addToTasks() {
    let task = processTaskInputs();
    taskSubmitSuccessful();
    tasks.push(task);
    task.id = tasks.length; // set id when creating the task
    task.board = 'backlog'; // default-board on task creation
    saveTasks();
    clearInputValues(title, date, category, urgency, description);
    clearAssignments(); // clear assigned users icons
}

/**
 * This function gets input values and returns them as task objects.
 * @returns {Object} - task object
 */
function processTaskInputs() {
    let [title, description, category, urgency, date] = getIds('title', 'description', 'category', 'urgency', 'date');
    let task = {
        //'id' : id,
        'title': title.value,
        'description': description.value,
        'category': category.value,
        'urgency': urgency.value,
        'date': date.value,
        'board': '',
        'assignedTo': assignedUsers,
        'subtasks': {}
    };
    return task;
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





/** This function gets all selected user values from an HTML multiple select field and returns the values in an array
 * @returns {string[]} - selected users
 */
function getAssignedUsers() {
    let assignedUsers = [];
    let selectOptions = getId('assignUser').options;
    for (let i = 0; i < selectOptions.length; i++) {
        if (selectOptions[i].selected) assignedUsers.push(selectOptions[i].value);
    }
    return assignedUsers;
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
        <button type="button" class="assign-btn" onclick="openCategories()">
            <div>Select task category</div>
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
    let colorId = document.getElementById('chosenColor')
    let chosenColor = colorPicker[index]
    colorId.innerHTML = `<div style="background-color: ${chosenColor}" class="category-color"></div>`
}

function openCategories() {
    toggleMenu('categoryMenu');
}

function addCategory() {
    let topic = getId('categoryInput').value
    let color = categories
}

function renderCategories() {
    let categoryOption = getId('categoryList')
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        categoryOption.innerHTML += `
        <div class="each-category-container">
        <div class="category" id="category-${i}" value="${category.topic}">${category.topic}</div>
        <div class="category-color" style="background-color: ${category.color}"></div>
        </div>
        `
    }
}

function saveNewCategory() {

}

document.addEventListener('DOMContentLoaded', () => {
    let selectedValue = null;

    const buttonEls = document.querySelectorAll('.priority-btn');

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
 * This function Clears user icons when resetting the addToTask.html form
 */
function clearAssignments() {
    getId('iconsContainer').innerHTML = renderAssignedUsers([]);
}

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
 * this function is rendering the users 
 */
function renderUsers() {
    let assignmentBox = getId('assignmentBox');
    assignmentBox.innerHTML = '';
    for (let j = 0; j < users.length; j++) {
        const showUser = users[j];
        assignmentBox.innerHTML += showUsersHTML(showUser);
    }
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

/**
 * Renders several user icons for all passed users in an array
 * @param {string[]} usersArr - array with usernames
 * @returns {(string | string)} - user-icon  HTML code for all passed users | replacement image
 */
function renderAssignedUsers(usersArr) {
    let iconsHTML = '';
    if (usersArr && usersArr.length > 0)
        for (let i = 0; i < usersArr.length; i++) {
            let user = usersArr[i];
            iconsHTML += renderUserIcon(user);
        }
    else iconsHTML = '<img src="img/icon-plus.png" alt="" class="icon-replacement">';
    return iconsHTML;
}

function renderUserIcon(userName) {
    let user = users.filter(user => user.name == userName);
    return /*html*/ `<span id="icon-${userName}" class="user-icon" alt="user icon" style="background-color: ${user[0].color}">${user[0].initial}</span>`;
}

function renderUserList() {
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        getId('userList').innerHTML += `
        <div class="user-list-container">
        <div>${user.name}</div>
        <input type="checkbox" class="square-checkbox" value="${user.name}" onclick="renderUserInitial(event, '${i}')"> 
        </div>
        `
    }
}

/**
 * Renders a user icon in the userInitialContainer based on whether a checkbox is checked or unchecked.
 *
 * @param {Event} event - The event object that triggered the function call.
 * @param {number} i - The index of the user in the users array.
 * 
 */

function renderUserInitial(event, i) {
    const user = users[i];
    const userIndex = assignedUsers.indexOf(user);

    if (event.target.checked) {
        getId('userInitialContainer').innerHTML += `
        <div id="userIcon-${[i]}" class="user-icon" style="background-color : ${user.color}">${user.initial}</div>`;
        if (userIndex === -1) assignedUsers.push(user);
    } else {
        if (userIndex !== -1) assignedUsers.splice(userIndex, 1);
        getId(`userIcon-${[i]}`).remove();
    }
}


function toggleMenu(id) {
    getId(id).classList.toggle('d-none');
}

function openAssignableContacts() {
    toggleMenu('userMenu');
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

function cancelContactInvitation() {
    let inviteContainer = getId('assignBtnContainer');
    inviteContainer.classList.add('assign-btn-container');
    inviteContainer.innerHTML = `
    <button type="button" class="assign-btn" onclick="openAssignableContacts()">
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

function newContactInvitation() {
    let newInvitation;
    newInvitation = getId('userSearchInput').value;
    invitedUsers.push(newInvitation);
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


function newSubtask() {
    getId('subtaskInput').value
}

function cancelSubtask() {

}