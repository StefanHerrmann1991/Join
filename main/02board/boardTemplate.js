/**
 * This function returns an HTML string for editing tasks.
 */
function editTaskHTML(task, index) {
    let subtask = task.subtasks.length === 0 ? 'd-none' : '';
    return `
    <div class="edit-task-dialog center" id="editTaskContainer">
        <div class="edit-task-container">
            <div class="task-details">
                <div class="task-head">
                    <div class="category-icon" style="background-color: ${task.category.color}">${task.category.topic}</div>
                    <button onclick="closeTaskDialog()" class="mobile back-arrow"><img
                            src="../../assets/img/backArrowBlack.png" </button>
                </div>
                <button class="close-upper-right" onclick="closeTaskDialog()"><img
                        src="../../assets/img/cancel.png"></button>
                <h1>${task.title}</h1>
                <div class="long-text">${task.description}</div>
                <div class="details-container">
                    <h2>Due date: </h2>
                    <div>${task.date}</div>
                </div>
                <div class="details-container">
                    <h2>Priority: </h2>
                    <div class="${task.urgency} details-priority-btn ">${task.urgency}<img
                            class="filtered-img-${task.urgency}"
                            src="../../assets/img/prio${capitalizeFirst(task.urgency)}.png"></div>
                </div>
                <div class="${subtask}">
                    <h2>Subtasks: </h2>
                    <div class="subtasks-in-details" id="subtask-${index}">
                    </div>
                </div>
                <div class="assigned-to-container">
                    <h2>Assigned to:</h2>
                    <div class="details-assigned-users">${renderAssignedUsers(task.assignedTo)}</div>
                </div>
                <div class="change-tasks">
                    <button class="delete-task-btn" onclick="openDeleteDialog(${index})"><img
                            src="../../assets/img/deleteDark.png"></button>
                    <button class="edit-task-btn" onclick="renderEditTask(${index})"><img
                            src="../../assets/img/editBtnWhite.png"></button>
                </div>
            </div>
        </div>
    </div>
    `}


function editTaskDialogHTML(index, task) {
    return `
    <div class="edit-task-dialog center">
        <div class="edit-task-container">
            <button class="close-upper-right desktop" onclick="closeTaskDialog()"><img
                    src="../../assets/img/cancel.png"></button>
            <form class="edit-task-form" onsubmit="changeTask(${index}, '${task.board}')">
                <div class="edit-task-field">   
                        <div class="mgn-b">            
                        <div class="title-button">                        
                            <h3>Title</h3>
                            <button class="close-upper-right mobile" onclick="closeTaskDialog()"><img
                                    src="../../assets/img/cancel.png"></button>
                        </div>
                        <input required class="title" id="title" value="${task.title}" placeholder="Enter a title"
                            oninput="loadTasks()">
                        </div>                        
                        <div class="mgn-b">
                            <h3>Description</h3>
                            <textarea resize="none" required id="description"
                                placeholder="Enter a description">${task.description}</textarea>
                            <h3>Due date</h3>
                            <input value="${task.date}" required id="date" class="date" type="date" name="setTodaysDate">
                        </div>
                        <div class="mgn-b">
                            <h3>Prio</h3>
                            <div id="urgency" class="priority-btns">
                                <label for="urgent" class="urgent priority-btn">
                                    <input type="radio" id="urgent" name="priority" value="urgent" class="priority-radio"
                                        required>
                                    Urgent<img src="../../assets/img/prioUrgent.png">
                                </label>
                                <label for="medium" class="medium priority-btn">
                                    <input type="radio" id="medium" name="priority" value="medium" class="priority-radio">
                                    Medium<img class="medium-prio" src="../../assets/img/prioMedium.png">
                                </label>
                                <label for="low" class="low priority-btn">
                                    <input type="radio" id="low" name="priority" value="low" class="priority-radio">
                                    Low<img src="../../assets/img/prioLow.png">
                                </label>
                            </div>
                        </div>
                        <div class="mgn-b">
                            <h3>Assigned to</h3>
                            <div class="assign-btn-container" id="assignBtnContainer">
                                <button type="button" class="assign-btn"
                                    onclick="toggleContainer('detailsUserMenu'); toggleContainer('userInitialContainer')">
                                    <div>Select contact to assign</div>
                                    <div id="imgArrow"><img src="../../assets/img/open.png"></div>
                                </button>
                                <div class="user-menu d-none" id="detailsUserMenu">
                                    <div class="user-list" id="userList"></div>
                                    <button id="inviteUserBtn" type="button" class="invite-user-btn"
                                        onclick="inviteUsers()">Invite
                                        new contact<img src="../../assets/img/contactsBlack.png">
                                    </button>
                                </div>
                                </div>
                                <div class="user-assignment-container">
                                <div id="userInitialContainer" class="user-initial-container"></div>
                                </div>
                            <input class="d-none" id="category" value="${task.category.index}">
                        </div>                    
                        <button class="accept-edited-task-btn">Ok<img src="../../assets/img/check.png"></button>
                    </div>
            </form>
        </div>
    </div>
    `
}



/**
 * This function returns an HTML string for a task.
 * 
 * @param {Object} element - The task to be rendered.
 * @param {Number} i - The index of the task in the tasks array.
 * @return {String} - An HTML string for the task.
 */
function boardTaskHTML(element, i) {
    let doneSubtask = element.subtasks.filter(function (subtask) { return subtask.checked }).length;
    let subtaskProgressBarClass = element.subtasks.length === 0 ? 'd-none' : '';
    let firstWord = element.description.split(' ')[0];
    let trimmedFirstWord = firstWord.length > 10 ? firstWord.substring(0, 10) + "..." : firstWord;
    let description = element.description.length > 10 ? `${trimmedFirstWord}...` : element.description;
    return `
      <div draggable="true" ondragstart="startDragging(${i})" id="task-${i}" class="task" onclick="renderDetailedTask(${i})">
          <div class="task-container">
              <div class="category-icon" style="background-color: ${element.category.color}">${element.category.topic}</div>
              <h2 class="task-headline"><b>${capitalizeFirst(element['title'])}</b></h2>
              <div class="description">${description}</div>
              <div id="subtaskProgressBar" class="subtask-progress ${subtaskProgressBarClass}">
                  <progress value="${doneSubtask}" max="${element.subtasks.length}"></progress>
                  <div>${doneSubtask}/${element.subtasks.length}</div>
              </div>
              <div class="user-urgency">
                  <div class="assigned-users">
                      ${renderAssignedUsers(element.assignedTo)}
                  </div>
                  <img class="urgency" src="../../assets/img/prio${capitalizeFirst(element.urgency)}.png">
              </div>
          </div>
          
          <div class="move-to mobile-flex" onclick="event.stopPropagation(); toggleContainer('boardBtns-${i}')">
              <img  class="chevron" src="../../assets/img/chevron.png">
              <div id="boardBtns-${i}" class="move-btn-box d-none">
                  <div><button onclick="event.stopPropagation(); moveToBoard(${i},'board-0')" class="move-button">Todo</button></div>
                  <div><button onclick="event.stopPropagation(); moveToBoard(${i},'board-1')" class="move-button">In Progress</button></div>
                  <div><button onclick="event.stopPropagation(); moveToBoard(${i},'board-2')" class="move-button">Awaiting Feedback</button></div>
                  <div><button onclick="event.stopPropagation(); moveToBoard(${i},'board-3')" class="move-button">Done</button></div>
              </div>                
      </div>
      </div>
    `;
}

function subtaskHTML() {
    `
        <div class="subtasks-container">
            <input id="newBoardInput" placeholder="Add new Board">
            <div class="button-container">
                <button type="button" class="cancel-button" onclick="cancelBoardCreation()"><img
                        src="../../assets/img/cancelDark.png"></button>
                <button type="button" class="add-button" onclick="addNewBoard()"><img src="../../assets/img/checkDark.png"></button>
            </div>
        </div>
    `
}


function boardsContentHTML(board) {
    return `
    <div class="board">
        <div class="board-header">
            <h2>${board.boardTitle}</h2>
            <button class="add-task-board-btn" value="${board.boardId}" onclick="openContainer('addTasksPopup'); setBoard(this.value)">
                <img src="../../assets/img/plusButton.png"
            </button>
        </div>
        <div class="board-task">
        <div id="${board.boardId}" class="board-task-container" ondrop="moveTo('${board.boardId}')"
            ondragover="allowDrop(event)"></div>
        </div>
    </div>
    `
}
