function logsHTML(element, i) {
    return /*html*/ `
        <div>
        <div class="log background-urgency-${(element['urgency']).toLowerCase()}"  
        style = "border-color: ${getLogBorderColor(element['assignedTo'])}" >
            <div onclick="renderEditForm(${i})>
                 <h4 class="log-name">${displayStringsArr(element['assignedTo'])}</h4>
            </div>
            <div class="">
                <h4 class="">${element['category']}</h4>
            </div>
            <div class="">
                <h5 class="">${capitalizeFirst(element['title'])}</h5>
                <p class="">${capitalizeFirst(element['description'])}</p>
        
            </div>
            <div class="backlog-buttons">
                    <img id = "backlog-${i}" onclick="renderBacklogToBoard(${i}); event.stopPropagation()" class="backlog-arrow" src="img/arrow-4-48.png">                                  
                    <img onclick="deleteBacklogTask(${i}); event.stopPropagation()" class="delete-backlog" src="img/delete-128.png">
            </div>
            <selector class="board-selector" id="boardSelector"></selector>
        </div>
        </div>`;
}

function boardTaskHTML(element, i) {
    return /*html*/ `
        <div  draggable="true" ondragstart="startDragging(${i})" id="task${i}" class="scroll-bar-small background-urgency-${(element['urgency']).toLowerCase()} task">
            <h4 class="task-headline-text">${capitalizeFirst(element['title'])}</h4>
            <span class="light-text">
                Priority: <b>${element['urgency']}</b><br>
                Category: <b>${element['category']}</b><br>
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
                        <button class="cancel-button" onclick="hide('overlay'); show('nav-bar')" type="reset">
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