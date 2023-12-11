let newCategoryOpen = false;
let newSubtaskOpen = false;

/**
 * Initialization of tasks including HTML inclusion, backend initialization, 
 * user list rendering, task loading, categories loading and rendering.
 * Also sets up the priority event listener and compares date.
 */
async function initTasks() {
    await includeHTML();
    await initContactList();

    /*     tasks = await loadFromBackend('tasks', tasks);
        categories = await loadFromBackend('categories', categories); */
    /*  invitedUsers = await loadFromBackend('invitedUsers', invitedUsers);  */
    await renderUserList();
    await renderUserList2();
    await renderCategories();
    startPriorityEventListener();
    compareDate();
    highlightChosenMenu()
}


/**
 * Adds a new task to the tasks array. It processes the task inputs, 
 * assigns an id, saves the tasks and gives user a feedback on successful submission.
 * @param {string} board - The id of the board to which the task will be added.
 */
function addToTasks(board) {
    event.preventDefault();
    const task = processTaskInputs(board);
    task.id = tasks.length + 1; // set id when creating the task
    tasks.push(task);
    saveToBackend('tasks', tasks)
    openContainer('successfulSubmit');
    checkCurrentTitle();
}


function checkCurrentTitle() {
    if (document.getElementsByTagName('h1')[0].textContent !== 'Board') {
        setTimeout(function () {
            window.location.href = '../../main/02board/board.html';
        }, 1400);
    }
    else {
        renderBoards(tasks);
        closeContainer('addTasksPopup');
        clearInputTasks();
    }
    setTimeout(function () {
        closeContainer('successfulSubmit');
    }, 1500);
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
    if (array.length === 0 || validateId == undefined) validateId.setAttribute('required', '');
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
    else board = chosenBoard;
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
    newCategoryOpen = true
    let newCategory = getId('categoryContainer');
    newCategory.classList.remove('assign-btn-container');
    newCategory.innerHTML = categoryHTML();
    renderColorPicker();
}


/**
 * Cancels the category creation process and reverts the layout changes made in newCategory function. 
 * Then it re-renders the categories.
 */
function cancelNewCategory() {
    newCategoryOpen = false;
    let newCategory = getId('categoryContainer')
    newCategory.classList.add('assign-btn-container');
    newCategory.innerHTML = newCategoryHTML();
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
    if (topic.length > 2) {
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
    else closeContainerInTime(2000, 'popupMessageCategory');
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
        categoryOption.innerHTML += categoryOptionsHTML(category, i);
    };
};


/**
 * Saves a category from the categories list by its index. It then validates the category and closes the category menu.
 * @param {number} index - The index of the category in the 'categories' array.
 */
function saveCategory(index) {
    let chosenCategoryOption = getId('categorySelect');
    let category = categories[index];
    chosenCategoryOption.innerHTML = chosenCategoryHTML(category);
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
            parentLabel.classList.add('selected');
            radioEl.checked = true;
        }
        radioEl.addEventListener('change', () => {
            radioEls.forEach(r => r.parentElement.classList.remove('selected'));
            parentLabel.classList.add('selected');
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


/**
 * Renders a list of users to the HTML element with id 'userList'.
 * Iterates through the 'invitedUsers' array and creates an input checkbox for each user.
 */
function renderUserList() {
    /* const userListContainer = getId('userList');
    userListContainer.innerHTML = '';
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        let isChecked = '';
        if (assignedUsers !== undefined) isChecked = assignedUsers.some(assignedUser => assignedUser.name === user.name) ? 'checked' : '';
        userListContainer.innerHTML += `
        <div class="user-list-container">
          <div>${user.name}</div>
          <input name="assignedUsers" type="checkbox" id="checkbox-${i}" class="square-checkbox" ${isChecked} value="${user.name}" onclick="renderUserInitial(event, '${i}')"> 
        </div>
      `;
        if (isChecked) renderDetailedUsers(i);
    } */
}





/**
 * Renders the detailed view of a user.
 * @param {number} index - The index of the user in the 'invitedUsers' array.
 */
function renderDetailedUsers(index) {
    let user = users[index];
    getId('userInitialContainer').innerHTML += `<div id="userIcon-${[index]}" class="user-icon" style="background-color : ${user.color}">${user.initial}</div>`;
}


/**
 * Renders the initial of a user when their checkbox is checked and removes it when unchecked.
 * @param {Object} event - The triggering event.
 * @param {number} index - The index of the user in the 'invitedUsers' array.
 */
function renderUserInitial(event, index) {
    const user = users[index];
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
    inviteContainer.innerHTML = invivteUsersHTML();
}


/**
 * Cancels the process of inviting a new user, reverts the HTML of 'assignBtnContainer' and renders the user list.
 */
function cancelContactInvitation() {
    let inviteContainer = getId('assignBtnContainer');
    inviteContainer.classList.add('assign-btn-container');
    inviteContainer.innerHTML = contactInvitationHTML();
    renderUserList();
}


function newContactInvitation() {
    let newInvitation;
    let userName = getId('userSearchInput').value;
    let contactExists = contactBook.contacts.some(contact =>
        contact.name === userName || contact.email === userName
    );

    if (!contactExists) {
        closeContainerInTime(2500, 'popupMessageFalseContact'); // Show error message since user doesn't exist in contactBook
        return;
    }

    if (!doubleIsThere(userName)) {
        newInvitation = users.filter(function (user) {
            return user.name.match(userName);
        });

        if (newInvitation.length > 0) {
            invitedUsers.push(newInvitation[0]);
            saveToBackend('invitedUsers', invitedUsers);
            cancelContactInvitation();
        }
    } else {
        closeContainerInTime(2500, 'popupMessageUsers'); // Show error message for double entry
    }
}


function doubleIsThere(userName) {
    return invitedUsers.some(user => user.name.match(userName));
}


/**
 * Matches the input string with user names or emails and returns a list of matching users.
 * @param {string} input - The input string to match against user names and emails.
 * @returns {Array} An array of user objects whose names or emails match the input string.
 */
function autocompleteMatch(input) {
    if (input === '') return [];
    let reg = new RegExp(input, 'i');
    return users.filter(function (user) {
        return user.name.match(reg) || user.email.match(reg);
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
    const usersList = autocompleteMatch((val.toLowerCase()));
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
    subtask.innerHTML = subtaskHTML();
}


/**
 * Cancels the process of adding a new subtask, reverts the HTML of 'subtasks'.
 */
function cancelSubtask() {
    let subtask = getId('subtasks');
    subtask.classList.add('assign-btn-container')
    subtask.innerHTML = cancelSubtaskHTML();
}


/**
 * Adds a new subtask based on the value inputted in 'subtaskInput' and updates the list of subtasks.
 */
function newSubtask() {
    let subtaskInput = getId('subtaskInput').value;
    if (subtaskInput.length > 2) {
        let renderedSubtasks = getId('renderedSubtasks');
        subtasks.push({ title: subtaskInput, checked: false });
        renderedSubtasks.innerHTML = "";
        subtasks.forEach((subtask, index) => {
            renderedSubtasks.innerHTML += newSubtaskHTML(subtask, index);
        });
    }
    else closeContainerInTime(2000, 'popupMessageSubtask');
}


/**
 * Toggles the checked status of a subtask.
 * @param {number} index - The index of the subtask in the 'subtasks' array.
 */
function updateSubtask(index) {
    subtasks[index].checked = !subtasks[index].checked;
}



function toggleInput() {
    event.preventDefault();
    getId('userAssignBtn').classList.toggle('d-none');
    getId('userSearchInputCon').classList.toggle('d-none');

}

function searchContacts() {

}


function renderUserList2(filteredUsers) {
    if (filteredUsers) usersArray = filteredUsers;
    else usersArray = users;

    const userListContainer = getId('allUsersList');
    userListContainer.innerHTML = '';
    for (let i = 0; i < usersArray.length; i++) {
        const user = usersArray[i];
        console.log(user);
        let isChecked = '';
        if (assignedUsers !== undefined) isChecked = assignedUsers.some(assignedUser => assignedUser.name === user.name) ? 'checked' : '';
        userListContainer.innerHTML += `
        <div class="user-list-container">
            <div class="initial-name">
                <div id="userIcon-${[i]}" class="user-icon" style="background-color : ${user.color}">${user.initial}</div>
                <div>${user.name}</div>
        </div>
          <input name="assignedUsers" type="checkbox" id="checkbox-${i}" class="square-checkbox" ${isChecked} value="${user.name}" onclick="renderUserInitial(event, '${i}')"> 
        </div>
      `;
        if (isChecked) renderDetailedUsers(i);
    }
}


function handleClickOutside(event) {
    let usersSelect = document.getElementById('usersSelect');

    // Check if the click is outside the usersSelect element
    if (!usersSelect.contains(event.target)) {
        toggleInput();
    }
}

document.addEventListener('click', handleClickOutside);


function filterUsers(searchTerm) {
    const filteredUsers = users.filter(user => {
        return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.includes(searchTerm);
    });
    renderUserList2(filteredUsers)
}


