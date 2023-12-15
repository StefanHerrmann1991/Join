/**
 * This function returns an HTML string for editing tasks.
 */
function editTaskHTML(task, index) {

    let subtask = task.subtasks.length === 0 ? 'd-none' : '';
    return `
    <div class="edit-task-dialog center" id="editTaskContainer" onclick="closeContainerEvent(event, 'editTaskContainer')">
        <div class="single-task-container">
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
                    <div class="${task.priority} details-priority-btn ">${task.priority}<img
                            class="filtered-img-${task.priority}"
                            src="../../assets/img/prio${capitalizeFirst(task.priority)}.png"></div>
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
    editIsOpen = !editIsOpen;
    getId('addTaskRemover').innerHTML = '';
    return `
    <div class="edit-task-dialog center" id="editTaskContainer" onclick="closeContainerEvent(event, 'editTaskContainer')">
        <div class="edit-task-container">
            <button class="close-upper-right desktop" onclick="closeTaskDialog()"><img
                    src="../../assets/img/cancel.png"></button>
            <form class="edit-task-form" onsubmit="changeTask(${index}, '${task.board}')">            
            <div class="task-fields">                
                    <h3>Title</h3>
                    <input minlength="3" required class="title" id="title" placeholder="Enter a title" value="${task.title}">
                    <h3>Description</h3>
                    <textarea minlength="3" resize="none" required id="description"
                        placeholder="Enter a description" value="${task.description}"></textarea>
                    <h3>Assigned to</h3>
                    <div id="usersBackground">
                        <div name="usersSelect" id="usersSelect" class="users-select">
                            <div id="userAssignBtn" class="absolute">
                                <button class="toggle-user-input user-menu" onclick="toggleUsersInput()">
                                    <div>Select contacts to assign</div>
                                    <img class="small-btn" src="../../assets/img/open.png">
                                </button>
                            </div>
                            <div id="userSearchInputCon" class="absolute d-none">
                                <div class="input-userlist-box">
                                    <div class="toggle-user-input user-menu">
                                        <input id="userSearchInput" class="user-search-input"
                                            placeholder="Search for collegues" oninput="filterUsers(this.value)">
                                        <button class="assign-user-btn" onclick="toggleUsersInput()"><img
                                                class="small-btn" src="../../assets/img/openUp.png"></button>
                                    </div>
                                    <div id="allUsersList" class="all-users-list"></div>
                                </div>
                            </div>
                        </div>
                        <div id="userInitialContainer" class="user-initial-container">${renderAssignedUsers(task.assignedTo)}</div>                   
                </div>                
                    <div class="form-and-btn">
                        <h3>Due date</h3>
                        <input required id="date" class="date" type="date" name="setTodaysDate" value="${task.date}">
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
                        <h3>Subtasks</h3>
                        <div class="assign-btn-container" id="subtasks">
                            <button onclick="changeSubtaskInput()" type="button" class="assign-btn " type="text">
                                <div id="subtaskMenu">Add new subtask</div>
                                <img class="add-subtask small-btn" src="../../assets/img/addIcon.png">
                            </button>
                        </div>
                        <div id="renderedSubtasks">${renderTaskSubtasks(task.subtasks)}</div>
                    </div>
                    <h3> Category</h3>
                    <div id="categoryBackground">
                        <div class="select-category">
                            <div class="absolute">
                                <div id="openCategoryBtn">
                                    <button class="toggle-user-input user-menu" onclick="toggleCategoryInput()">
                                        <div>Select task category</div>
                                        <img class="category-input small-btn" src=" ../../assets/img/open.png">
                                        <img class="category-input small-btn d-none"
                                            src="../../assets/img/openUp.png">
                                    </button>
                                </div>
                                <div id="categoriesContainer" class="all-categories-list d-none">
                                    <div id="categoryList" class="category-list"></div>
                                    <button id="newCategoryBtn" type="button" class="new-category-btn"
                                        onclick="openNewCategory()">New
                                        category</button>
                                        <div id="newCategoryContainer" class="d-none new-category-menu">
                                            <div class=" subtasks-container">
                                                <div class="category-input-color">
                                                <div id="chosenColor"></div>
                                                <input minlength="3" id="categoryInput" type="text"
                                                    placeholder="New category name" required>
                                                </div>
                                                <div class="button-container">
                                                <button onclick="closeNewCategory()" type="button"
                                                    class="cancel-button"><img class="small-btn"
                                                        src="../../assets/img/cancelDark.png"></button>
                                                <button type="button" class="add-button" 
                                                    onclick="addCategory()"><img class="small-btn"
                                                        src="../../assets/img/checkDark.png"></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="colorPicker" class="color-picker"></div>
                                    </div>
                                </div>
                            </div>                 
                        </div>               
                    <button class="accept-edit-btn">Ok</button>                   
                </div>
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
                  <img class="urgency" src="../../assets/img/prio${capitalizeFirst(element.priority)}.png">
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



function boardsContentHTML(board) {
    return `
    <div class="board">
        <div class="board-header">
            <h2>${board.boardTitle}</h2>
            <button class="add-task-board-btn" value="${board.boardId}" onclick="openContainer('addTasksPopup'); setBoard(this.value)">
                <img src="../../assets/img/plusButton.png"
            </button>
        </div>
        <div id="${board.boardId}" class="board-task-container" ondrop="moveTo('${board.boardId}')"
            ondragover="allowDrop(event)"></div>
    </div>
    `
}


function editSubtaskHTML(subtask, index) {
    // Determine the checked attribute based on the subtask's state
    
    
    return `
    <div class="subtask-checkbox-container">        
        <label for="checkbox-${index}" class="subtask-label"></label>
        <li class="each-subtask" id="eachSubtask-${index}" onmouseenter="showEditSubtask(${index})" onmouseleave="hideEditSubtask(${index})">
            <button class="subtask" type="button" onclick="openSubtask(${index})" >
                <div class="bullet"></div>
                <div>${subtask.title}</div>                
            </button>
            <div class="subtask-edit-btns relative d-none" id="subtaskEdit-${index}">
                <button class="delete-btn" type="button" onclick="openEditSubtask(${index})"><img class="small-btn" src="../../assets/img/editSmall.png"></button>
                <button class="add-button" type="button" onclick="deleteSubtask(${index})"><img class="small-btn" src="../../assets/img/deleteDark.png"></button>  
            </div>
        </li>
        <div class="edit-subtask-con d-none" id="subtaskEditMenu-${index}">
            <input id="subtaskEditInput-${index}" class="subtask-edit-input" value="${subtask.title}">
            <div class="subtask-edit-btns">
                <button class="delete-btn " type="button" onclick="deleteSubtask(${index})"><img class="small-btn" src="../../assets/img/deleteDark.png"></button>
                <button class="add-button " type="button" onclick="editSubtask(${index})"><img class="small-btn" src="../../assets/img/checkGreen.png"></button>    
            </div>
        </div>
    </div>            
    `;
}
