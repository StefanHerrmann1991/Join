let boards = [
    { boardTitle: 'To do', boardId: 'board-0', boardName: 'todoBoard' },
    { boardTitle: 'In progress', boardId: 'board-1', boardName: 'progressBoard' },
    { boardTitle: 'Awaiting Feedback', boardId: 'board-2', boardName: 'awaitingFeedbackBoard' },
    { boardTitle: 'Done', boardId: 'board-3', boardName: 'doneBoard' }
]

let detailsAreOpen = false;

async function initBoards() {
    includeHTML();
    await initAddTasks();
    await initBackend();
    await renderBoards(tasks);
   
}





function addTaskAtBoard(boardId) {

}

function renderNewBoardBtn() {
    let subtask = getId('addBoard')
    subtask.classList.remove('assign-btn-container')
    subtask.innerHTML = `
        <div class="subtasks-container">
            <input id="newBoardInput" placeholder="Add new Board">
            <div class="button-container">
                <button type="button" class="cancel-button" onclick="cancelBoardCreation()"><img
                        src="/assets/img/cancelDark.png"></button>
                <button type="button" class="add-button" onclick="addNewBoard()"><img src="/assets/img/checkDark.png"></button>
            </div>
        </div>
    `
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
    if (getId('todoBoard')) renderBoards(tasks)
}


async function initAddTasks() {
    setURL('https://stefan-herrmann.developerakademie.net/smallest_backend_ever');
    await downloadFromServer();
    tasks = JSON.parse(backend.getItem('tasks')) || [];
}

/**
 * This Function used  for rendering the boards with filters
 */
function renderBoards(array) {
    let boardsContent = getId('boards');
    boardsContent.innerHTML = '';
    for (let i = 0; i < boards.length; i++) {
        boardId = boards[i]['boardId'];
        boardTitle = boards[i]['boardTitle'];
        boardName = boards[i]['boardName'];
        boardsContent.innerHTML += `
        <div class="board">
        <div class="board-header">
        <h2>${boardTitle}</h2>
        <button><img src="/assets/img/plusButton.png"</button> 
        </div>
        <div id="${boardId}" class="board-task-container" ondrop="moveTo('${boardId}')" ondragover="allowDrop(event)"></div>
        </div>
           `
        renderEachBoard(boardTitle, boardId, array);
    }
}

function addNewBoard() {
    let board = processBoardInputs();
    boards.push(board);
    saveBoards();
    renderBoards(tasks);
}

function processBoardInputs() {
    let boardInput = getId('newBoardInput').value
    let boardTitle = boardInput.toUpperCase();
    /* `${boardName}Board`;  boardInput.split(" ").join("")*/
    let boardId = 'board-' + boards.length
    let board = {
        'boardTitle': boardTitle,
        'boardId': lowerFirstLetter(boardId),
    };
    return board;
}

function clearInputsBoard() {
    clearInputValues();
}

/**
 * 
 * @param {*} boardTaskArray 
 * @param {*} boardId 
 * @param {*} array 
 */
function renderEachBoard(boardTaskArray, boardId, array) {
    boardTaskArray = array.filter(t => t['board'] == `${boardId}`);
    getId(`${boardId}`).innerHTML = '';
    for (let i = 0; i < boardTaskArray.length; i++) {
        const element = boardTaskArray[i];
        const taskIndex = array.indexOf(element);
        getId(`${boardId}`).innerHTML += boardTaskHTML(element, taskIndex);
    }
}

async function saveBoards() { //check async: no diff
    if (event) event.preventDefault();
    let boardsAsText = JSON.stringify(boards);
    await backend.setItem('boards', boardsAsText);
}

/**
 *  This function loads and converts boards from text-format to a JSON-array. 
 *  The preventDefault() function is necessary to prevent the page from reloading when adding a new board.
 */
async function loadBoards() {
    if (event) event.preventDefault();
    let boardsAsText = await backend.getItem('boards');
    if (boardsAsText) boards = JSON.parse(boardsAsText);
}

/**
 * This function saves the current id of the dragged task 
 */
function startDragging(id) { // i only for testing purposes
    currentDraggedElement = id;
}

/**
 * This function makes the div container droppable
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * This function gives the task the new category. The category depends on the dropped board 
 */
function moveTo(board) {
    tasks[currentDraggedElement]['board'] = board;
    saveTasks();
    renderBoards(tasks)
}

/**
 * This function Moves a given task to the passed target-board
 * @param {integer} i - tasks index
 * @param {string} targetBoard - name of board
 */
function moveToBoard(i, targetBoard) {
    tasks[i]['board'] = targetBoard;
    saveTasks();
    renderBoards(tasks);
}

function boardTaskHTML(element, i) {
    let doneSubtask = element.subtasks.filter(function (subtask) { return subtask.checked }).length;
    let subtaskProgressBarClass = element.subtasks.length === 0 ? 'd-none' : '';
    return /*html*/ `
      <div draggable="true" ondragstart="startDragging(${i})" id="task-${i}" class="task" onclick="renderDetailedTask(${i})">
          <div class="task-container">
              <div class="category-icon" style="background-color: ${element.category.color}">${element.category.topic}</div>
              <h2 class="task-headline"><b>${capitalizeFirst(element['title'])}</b></h2>
              <div class="description">${element.description}</div>
              <div id="subtaskProgressBar" class="subtask-progress ${subtaskProgressBarClass}">
                  <progress value="${doneSubtask}" max="${element.subtasks.length}"></progress>
                  <div>${doneSubtask}/${element.subtasks.length}</div>
              </div>
              <div class="user-urgency">
                  <div class="assigned-users">
                      ${renderAssignedUsers(element.assignedTo)}
                  </div>
                  <img class="urgency" src="/assets/img/prio${capitalizeFirst(element.urgency)}.png">
              </div>
          </div>
      </div>
    `;
}

/**
 * Renders several user icons for all passed users in an array
 * @param {string[]} usersArr - array with usernames
 * @returns {(string | string)} - user-icon  HTML code for all passed users | replacement image
 */
function renderAssignedUsers(usersArr) {

    let iconsHTML = '';
    if (usersArr && usersArr.length > 0) {
        for (let index = 0; index < usersArr.length; index++) {
            const user = usersArr[index];
            if (index == 2 && !detailsAreOpen) {
                iconsHTML += `<span class="user-icon" alt="user icon" style="background-color: #2A3647">${usersArr.length - 2}+</span>`
                break;
            }
            iconsHTML += `<span id="userIcon-${index}" class="user-icon" alt="user icon" style="background-color: ${user.color}">${user.initial}</span>`;
        }
        return iconsHTML;
    }
}

function renderMobile() {
    return ` 
    <div>
        <div class="move-to">
            <img onclick="showMoveButtons(${i})" class="move-to-btn" alt="">
            <div id="moveButtonBox${i}" class="move-button-box d-none">
                <div><button onclick="moveToBoard(${i},'todo')" class="move-button">Todo</button></div>
                <div><button onclick="moveToBoard(${i},'inProgress')" class="move-button">In Progress</button></div>
                <div><button onclick="moveToBoard(${i},'testing')" class="move-button">Testing</button></div>
                <div><button onclick="moveToBoard(${i},'done')" class="move-button">Done</button></div>
            </div>
        </div>
        <div class="task-links">
            <img class="delete-task" src="/assets/img/deleteWhite.png" onclick="deleteTask(tasks, ${i})" alt="delete icon">
            <img class="edit-task" onclick="renderEditForm(${i})" alt="edit icon">
        </div>
    </div>
    `
}

function editFormHTML(i) {
    return /*html*/ `
 `
}

/**
 * Saves tasks in the backend in form of an JSON string */
async function saveTasks() { //check async: no diff
    if (event) event.preventDefault();
    let tasksAsText = JSON.stringify(tasks);
    await backend.setItem('tasks', tasksAsText);
}

//Todo render tasks here which are in the search field

/**
 * Updates an element with given index i in the given array
 * @param {Array} dataArray
 * @param {integer} i - array index
 */
async function saveEditedTask(dataArray, i) { // check: async no diff
    let task = await processTaskInputs();
    task.board = dataArray[i].board; // keep the right board
    dataArray[i] = task;
    saveTasks();
    hide('overlay');
    // check if sent from boards page or backlog page and render content
    renderBoards()
}

function openTask(index) {
    tasks[index]
    renderEditTask();
}

function renderDetailedTask(index) {
    let task = tasks[index]
    let editTask = getId('editTaskDialog')
    openContainer('editTaskDialog')
    editTask.innerHTML = `
        <div class="edit-task-dialog center" id="editTaskContainer">
            <div class="edit-task-container">
                <div class="task-details">
                    <div class="category-icon" style="background-color: ${task.category.color}">${task.category.topic}</div>
                    <button class="close-upper-right" onclick="closeContainer('editTaskDialog')"><img
                            src="/assets/img/cancel.png"></button>
                    <h2>${task.title}</h2>
                    <div>${task.description}</div>
                    <div class="row">
                        <h2>Due date: </h2>
                        <div>${task.date}</div>
                    </div>
                    <div class="details-priority row">
                        <h2>Priority: </h2>
                        <div class="${task.urgency} details-priority-btn ">${task.urgency}</div>
                    </div>
                    <div>
                        <h2>Assigned to:</h2>
                        <div class="details-assigned-users">${renderAssignedUsers(task.assignedTo)}</div>
                    </div>
                    <button class="edit-task-btn" onclick="renderEditTask(${index})"><img src="/assets/img/editBtnWhite.png"></button>
                </div>
                
            </div>
        </div>
`
}

function renderEditTask(index) {

    let editTask = getId('editTaskDialog');
    let task = tasks[index];
    assignedUsers = task.assignedTo;
    editTask.innerHTML = `
    <div class="edit-task-dialog center" id="edit-task-container">
        <div class="edit-task-container">
        <button class="close-upper-right" onclick="closeContainer('editTaskDialog')"><img
        src="/assets/img/cancel.png"></button>
            <form class="edit-task-form" onsubmit="changeTask(${index}, '${task.board}')">
                <h3>Title</h3>
                <input required class="title" id="title" value="${task.title}" placeholder="Enter a title" oninput="loadTasks()">
                <h3>Description</h3>
                <textarea resize="none" required id="description" placeholder="Enter a description">${task.description}</textarea>
                <h3>Due date</h3>
                <input value="${task.date}" required id="date" class="date" type="date" name="setTodaysDate">
                <h3>Prio</h3>
                <div required id="urgency" class="priority-btns">
                    <button class="urgent priority-btn" data-value="urgent" type="button">Urgent<img
                            src="../../assets/img/prioUrgent.png"></button>
                    <button class="medium priority-btn" data-value="medium" type="button">Medium<img class="medium-prio"
                            src="../../assets/img/prioMedium.png"></button>
                    <button class="low priority-btn" data-value="low" type="button">Low<img
                            src="../../assets/img/prioLow.png"></button>
                </div>
                <h3>Assigned to</h3>
                <div class="assign-btn-container" id="assignBtnContainer">
                <button type="button" class="assign-btn" onclick="toggleContainer('detailsUserMenu')">
                    <div>Select contact to assign</div>
                    <div id="imgArrow"><img src="/assets/img/open.png"></div>
                </button>
                <div class="user-menu d-none" id="detailsUserMenu">
                    <div class="user-list" id="userList"></div>
                    <button id="inviteUserBtn" type="button" class="invite-user-btn"
                        onclick="inviteUsers()">Invite
                        new contact<img src="/assets/img/contactsBlack.png">
                    </button>
                </div>
                <input class="d-none" id="category" value="${task.category.index}">
                </div>
                <div id="userInitialContainer" class="user-initial-container"></div>
                
            <button class="accept-edited-task-btn">Ok<img src="/assets/img/check.png"></button>
            </form>
        </div>
    </div>
    `
    startPriorityEventListener(task.urgency);   
    renderUserList();
    /* getUsersList(); */
    compareDate();
}


async function changeTask(index, board) {
    event.preventDefault();
    let task = processTaskInputs(board);
    tasks[index] = task;
    saveTasks();
    renderBoards();
}

function startPriorityEventListener(selectedValue) {
    const buttonEls = document.querySelectorAll('.priority-btn');
    buttonEls.forEach(buttonEl => {
        const buttonValue = buttonEl.getAttribute('data-value');
        if (buttonValue === selectedValue) {
            // If the button value matches the selectedValue, add the 'selected' class
            buttonEl.classList.add('selected');
        }
        buttonEl.addEventListener('click', () => {
            // Remove selected class from all buttons
            buttonEls.forEach(b => b.classList.remove('selected'));
            // Add selected class to the clicked button
            buttonEl.classList.add('selected');
            // Store the selected value
            selectedValue = buttonEl.getAttribute('data-value');
        });
    });
}






/**
 * Displays a list of users with names or emails that match the input string.
 * @param {string} val The input string to match against.
 */
function showResultsTasks(val) {
    const tasksList = autocompleteMatchTask(val);
    if (tasksList.length !== 0) renderBoards(tasksList);
    else renderBoards(tasks)
}

/**
 * The function matches the input in the search input field with the names and emails of the users array.
 * @param {string} input A string containing a name or email.
 * @returns An array of users with names or emails that match the input string.
 */
function autocompleteMatchTask(input) {
    if (input == '') return [];
    let reg = new RegExp(input);
    return tasks.filter(function (task) {
        if (task.title.match(reg) || task.description.match(reg) || task.category.topic.match(reg)) return task;
    });
}