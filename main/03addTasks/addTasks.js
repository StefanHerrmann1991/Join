let urgencies = ['High', 'Medium', 'Low'];
let categories = ['Management', 'Software Developement', 'UX/UI Design', 'Human Resources'];
let users

async function initTasks() {
    await includeHTML();
    await initBackend();
    await initAddTasks();
    await renderForm();
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
 * Renders HTML option fields from the users array into addToTask.html form select-field
 */
function renderForm() {
    let userSelect = getId('assignUser');
    userSelect.innerHTML = '';
    userSelect.innerHTML = renderUserOptionFields();
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

/**
 * This function gets input values and returns them as task objects.
 * @returns {Object} - task object
 */
function processTaskInputs() {
    let [title, description, category, urgency, date] = getIds('title', 'description', 'category', 'urgency', 'date');
    let assignedUsers = getAssignedUsers();
    let task = {
        //'id' : id,
        'title': title.value,
        'description': description.value,
        'category': category.value,
        'urgency': urgency.value,
        'date': date.value,
        'board': '',
        'assignedTo': assignedUsers,
    };
    return task;
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

function showAssignBox() {
    toggle('assignmentBox');
    renderUsers();
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

/* ****** render add-to-task form fields ****** */

/**
 * Renders HTML option fields from the users array into addToTask.html form select-field
 */
function renderForm() {
    let userSelect = getId('assignUser');
    userSelect.innerHTML = '';
    userSelect.innerHTML = renderUserOptionFields();
}

/* ****** render HTML option select fields ****** */

/**
 * This function renders all options from a given array of values in an html select field
 * @param {string} selected - the pre-selected element/option
 * @param {string[]} dataArray - array with string values of all options
 * @returns {string} - html that creates option fields
 */
function renderOptionFields(selected, dataArray) {
    str = '';
    for (let i = 0; i < dataArray.length; i++) {
        let el = dataArray[i]; // if dataArray == 'users' el = dataArray[i].name
        str += /*html*/ `<option value="${el}" ${renderSelected(selected, el)}>${el}</option>`;
    }
    return str;
}

function renderUserOptionFields(selectedUsers = undefined) {
    let str = "";
    for (let i = 0; i < users.length; i++) {
      let el = users[i].name;
      const isChecked = selectedUsers && selectedUsers.includes(el);
      str += /*html*/ `
        <option>
          <input type="checkbox" id="${el}" name="${el}" value="${el}" ${isChecked ? "checked" : ""} onclick="showSelectedUserIcon()">
          <label for="${el}">${el}</label>
        </option>
      `;
    }
    return str;
  }

/**assignUser
 * This function gets all selected users from a select field and shows their user icons
 */
function showSelectedUserIcon() { // ...iconS !
    let selectedUsersArr = getAssignedUsers();
    //if(selectedUsersArr){
    getId('iconsContainer').innerHTML = renderAssignedUsers(selectedUsersArr);
    //}
}

/**
 * Renders HTML option fields from the users array into addToTask.html form select-field
 */
function renderForm() {
    let userSelect = getId('assignUser');
    userSelect.innerHTML = '';
    userSelect.innerHTML = renderUserOptionFields();
}

/**
 * This function compares the value of a given element against the current value of a select field and returns the attribut 'selected' if they match (comparison is case-insensitive)
 * @param {string} option 
 * @param {string} value 
 * @returns {(string | undefined)} - returns 'selected' if true
 */
function renderSelected(option, value) {
    if (option != undefined) {
        if (option.toLowerCase() == value.toLowerCase()) return 'selected';
    }
}
// TODO: maybe include in function above (one fkt?)
/**
 * This functions compares an array of passed options from a multiple select field with a given value and returns 'selected' if one of them matches the given value
 * @param {string[]} optionsArr 
 * @param {string} value 
 * @returns {(string | undefined )} - returns 'selected' if true
 */
function renderMultipleSelected(optionsArr, value) {
    if (optionsArr != undefined) {
        for (let i = 0; i < optionsArr.length; i++) {
            let el = optionsArr[i];
            if (el.toLowerCase() == value.toLowerCase()) return 'selected';
        }
    }
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

/**
 *  The function is used to show the description of the clicked task
 */
function showDescription(i) {
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
