let boards = [
    {boardTitle: 'To do', boardId: 'board-0', boardName: 'todoBoard'}
]


async function initBoards() {
    includeHTML();
    await initAddTasks();
    await renderBoards();
}

function addTaskAnywhere() {}

function renderNewBoardBtn() {
    let subtask = getId('addBoard')
    subtask.classList.remove('assign-btn-container')
    subtask.innerHTML = `
    <div class="subtasks-container">
    <input id="newBoardInput" placeholder="Add new Board">
    <div class="button-container">
    <button type="button" class="cancel-button" onclick ="cancelBoardCreation()"><img
    src="/assets/img/cancelDark.png"></button>
    <button type="button" class="add-button" onclick="addNewBoard()"><img
    src="/assets/img/checkDark.png"></button>
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
    if (getId('todoBoard')) renderBoards()   
}


 async function initAddTasks() {
    setURL('https://stefan-herrmann.developerakademie.net/smallest_backend_ever');
    await downloadFromServer();
    tasks = JSON.parse(backend.getItem('tasks')) || [];
    console.log(tasks);
}


/**
 * This Function used  for rendering the boards with filters
 */
function renderBoards() {  
 let boardsContent = getId('boards');
     boardsContent.innerHTML = '';
    for (let i = 0; i < boards.length; i++) {
        boardId = boards[i]['boardId'];
        boardTitle = boards[i]['boardTitle'];
        boardName = boards[i]['boardName'];
        boardsContent.innerHTML += `
        <div>
        <h2>${boardTitle}</h2>
        <div class="scroll-bar">
            <div id="${boardId}" class="board-task-container" ondrop="moveTo('${boardId}')" ondragover="allowDrop(event)"></div>
        </div>
        </div>
           `  
        renderEachBoard(boardTitle, boardId);   
    } 
}
/* Was fehlt input mit Knopf, ordentlicher json, style für das zeug. */
/* boardId = todo boardName = todoBoard */

function addNewBoard() {
    let board = processBoardInputs();
    boards.push(board);
    saveBoards();
    renderBoards();
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

/** renderEachBoard
 * This Function shows/refreshes all boards filtered with categorys and also allow drag and drop 
 */

function renderEachBoard(boardTaskArray, boardId) {
    boardTaskArray = tasks.filter(t => t['board'] == `${boardId}`);
    getId(`${boardId}`).innerHTML = '';
    for (let i = 0; i < boardTaskArray.length; i++) {
        const element = boardTaskArray[i];
        const taskIndex = tasks.indexOf(element);
        getId(`${boardId}`).innerHTML += boardTaskHTML(element, taskIndex);
    }
}


async function saveBoards() { //check async: no diff
    if (event) {
        event.preventDefault();
    }
    let boardsAsText = JSON.stringify(boards);
    await backend.setItem('boards', boardsAsText);
}

/**
 *  This function loads and converts boards from text-format to a JSON-array. 
 *  The preventDefault() function is necessary to prevent the page from reloading when adding a new board.
 */
async function loadBoards() {
    if (event) {
        event.preventDefault();
    }
    let boardsAsText = await backend.getItem('boards');
    if (boardsAsText) {
        boards = JSON.parse(boardsAsText);
    }
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
    renderBoards()
}
/**
 * This function shows move buttons on responsive view when arrow image is clicked 
 */
function showMoveButtons(i) {
    let moveButtonBox = document.getElementById('moveButtonBox' + i)

    if (moveButtonBox.classList.contains('d-none')) {
        moveButtonBox.classList.remove('d-none')
        moveButtonBox.classList.add('move-button-box-transition-in')
    } else {
        moveButtonBox.classList.add('d-none')
    }
}

/**
 * This function Moves a given task to the passed target-board
 * @param {integer} i - tasks index
 * @param {string} targetBoard - name of board
 */
function moveToBoard(i, targetBoard) {
    console.log(targetBoard);
    tasks[i]['board'] = targetBoard;
    saveTasks();
    renderBoards();
}


/**
 * Renders several user icons for all passed users in an array
 * @param {string[]} usersArr - array with usernames
 * @returns {(string | string)} - user-icon  HTML code for all passed users | replacement image
 */
function renderAssignedUsers(usersArr) {
    debugger
    let iconsHTML = '';

    if (usersArr && usersArr.length > 0) {
        for (let i = 0; i < usersArr.length; i++) {
            let user = usersArr[i];
            console.log(user)
            iconsHTML += `<span id="icon-${user.name}" class="user-icon" alt="user icon" style="background-color: ${user.color}">${user.initial}</span>`;
        }
    } else {
        iconsHTML = '<img src="img/icon-plus.png" alt="" class="icon-replacement">';
    }
    return iconsHTML;
}

function boardTaskHTML(element, i) {
    return /*html*/ `
        <div  draggable="true" ondragstart="startDragging(${i})" id="task${i}" class="scroll-bar-small background-urgency-${(element['urgency']).toLowerCase()} task">
            <h4 class="task-headline-text">${capitalizeFirst(element['title'])}</h4>
            <span class="light-text">
                Priority: <b>${element['urgency']}</b><br>
                Category: <b>${element['category']['topic']}</b><br>
                Due date: <span>${element['date']}</span>
            </span>
            <!-- TODO show description on click -->
            <div>
                <span onclick="showDescription(${i})" class="show-more"><b id="clickMe${i}">Click to show description</b></span>
                <p class="task-description-text d-none" id="showDescription${i}">${capitalizeFirst(element['description'])}</p>
            </div>
            <div class="members">
                ${renderAssignedUsers(element.assignedTo)}
            </div>
            <div class="move-to">
                <img onclick="showMoveButtons(${i})" class="move-to-btn" src="img/arrow-204-48.png" alt="">
                <div id="moveButtonBox${i}" class="move-button-box d-none">
                    <div><button onclick="moveToBoard(${i},'todo')" class="move-button">Todo</button></div>
                    <div><button onclick="moveToBoard(${i},'inProgress')" class="move-button">In Progress</button></div>
                    <div><button onclick="moveToBoard(${i},'testing')" class="move-button">Testing</button></div>
                    <div><button onclick="moveToBoard(${i},'done')" class="move-button">Done</button></div>
                </div>
            </div>
            <div class="task-links">
                <img class="delete-task" src="img/delete-24.png" 
                onclick="deleteTask(tasks, ${i})" alt="delete icon">
                <img class="edit-task" src="img/edit-24.png" onclick="renderEditForm(${i})" alt="edit icon">
            </div>
        </div>
    `;
}


function editFormHTML(i) {
    return /*html*/ `
        <div class="task-input container" onclick="event.stopPropagation()">
            <h2 class="edit-task-headline">UPDATE TASK</h2>
            <form class="form-field edit-form" onsubmit="saveEdit(tasks, ${i})">
                <div class="form-section">
                    <!-- <div id="assignmentBox" class="assignment-box d-none"></div> -->
                    <h2>TITLE</h2>
                    <input required id="title" placeholder="Enter a title" value="${tasks[i].title}">
                    <h2>CATEGORY</h2>
                    <select id="category" placeholder="Management">
                        ${renderOptionFields(tasks[i].category, categories)}
                    </select>
                    <h2>DESCRIPTION</h2>
                    <textarea required id="description">${tasks[i].description}</textarea>
                </div>
                <div class="form-section">
                    <h2>DUE DATE</h2>
                    <input id="date" type="date" value="${tasks[i].date}" onclick="compareDate()">
                    <h2>URCENCY</h2>
                    <select id="urgency">
                        ${renderOptionFields(tasks[i].urgency, urgencies)}
                    </select>
                    <h2>ASSIGN TO</h2>
                    <select multiple id="assignUser" class="">
                        ${renderUserOptionFields(tasks[i].assignedTo)}
                    </select>
                    <div class="assignment-container">
                        <div id="iconsContainer" class="assignment-button-container">
                            ${renderAssignedUsers(tasks[i].assignedTo)}                           
                        </div>
                    </div>
                    <div class="btn-box">
                        <button class="cancel-button" onclick="hide('overlay')" type="reset">
                            CANCEL
                        </button>
                        <button class="assign-button" type="submit">
                            UPDATE TASK
                        </button>
                    </div>
            </div>
        </form>
    </div>
    `;
}