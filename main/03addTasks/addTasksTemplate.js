function subtaskHTML() {
    return `
    <div class="subtasks-container">
        <input minlength="3" id="subtaskInput" placeholder="Add new subtask">
        <div class="button-container">
            <button type="button" class="cancel-button" onclick ="cancelSubtask()">
                <img class="small-btn" src="../../assets/img/cancelDark.png"> 
            </button>
            <button type="button" class="add-button" onclick="newSubtask()">
                <img class="small-btn" src="../../assets/img/checkDark.png">
            </button>
        </div>
    </div>
    `
}


function cancelSubtaskHTML() {
    return `
    <button onclick="changeSubtaskInput()" type="button" class="assign-btn " type="text">
        <div id="subtaskMenu">Add new subtask</div>
        <img class="add-subtask small-btn" src="../../assets/img/addIcon.png">
    </button>
    `
}


function chosenCategoryHTML(category) {
    return ` 
    <button type="button"  onclick="toggleCategoryInput()" id="category" class="toggle-user-input user-menu" value="${category.index}">
        <div class="color-topic">
            <div class="category-color" style="background-color: ${category.color}"></div>
            <span>${category.topic}</span>
        </div>        
        <img class="category-input small-btn" src=" ../../assets/img/open.png">
        <img class="category-input small-btn d-none"
            src="../../assets/img/openUp.png">
    </button>  
    `
}


function categoryOptionsHTML(category, index) {
    return `
    <button type="button" onclick="saveCategory(${index})" class="each-category-container">
        <div class="category-color" style="background-color: ${category.color}"></div>
        <div class="category" id="category-${index}">${category.topic}</div>
    </button>
     `
}


function newSubtaskHTML(subtask, index) {
    return `
    <div class="subtask-checkbox-container"> 
        <li class="each-subtask" id="eachSubtask-${index}" onmouseenter="showEditSubtask(${index})" onmouseleave="hideEditSubtask(${index})">
            <button class="subtask" type="button" onclick="openSubtask(${index})" >
                <div class="bullet"></div>
                <div>${subtask.title}</div>                
            </button>
            <div class="subtask-edit-btns relative d-none" id="subtaskEdit-${index}">           
                <button class="delete-btn" type="button" onclick="openEditSubtask(${index})"><img  class="small-btn" src="../../assets/img/editSmall.png"></button>
                <button class="add-button" type="button" onclick="deleteSubtask(${index})"><img  class="small-btn" src="../../assets/img/deleteDark.png"></button>  
            </div>  
        </div>
        </div>
        <div class="edit-subtask-con d-none" id="subtaskEditMenu-${index}">
            <input id="subtaskEditInput-${index}" class="subtask-edit-input" value="${subtask.title}">
            <div class="subtask-edit-btns">
                <button class="delete-btn " type="button" onclick="deleteSubtask(${index})"><img  class="small-btn" src="../../assets/img/deleteDark.png"></button>
                <button class="add-button " type="button" onclick="editSubtask(${index})"><img  class="small-btn" src="../../assets/img/checkGreen.png"</button>    
            </div>
        </div>
    </div>            
`;
}



function renderAddTask() {
    return `
    <div class="add-task-popup-dialog">
    <div class="task-main">
    <div class="popup-message d-none">
    </div>
        <button class="close-upper-right" onclick="closeAddTaskPopup()">
            <img src="../../assets/img/cancel.png">
        </button>
        <div class="title-form">
            <h2 class="task-title">Add Task</h2>
            <form class="add-task-formfield" onsubmit="addToTasks(${chosenBoard});">
                <div class="task-fields">
                    <div class="add-task-left">
                        <h3>Title</h3>
                        <input minlength="3" required class="title" id="title" placeholder="Enter a title">
                        <h3>Description</h3>
                        <textarea minlength="3" resize="none" required id="description"
                            placeholder="Enter a description"></textarea>
                        <h3>Assigned to</h3>
                        <div id="usersBackground">
                            <div name="usersSelect" id="usersSelect" class="users-select">
                                <div id="userAssignBtn" class="absolute">
                                    <button class="toggle-user-input user-menu" onclick="toggleUsersInput()">
                                        <div>Assign contacts</div>
                                        <img class="small-btn" src="../../assets/img/open.png">
                                    </button>

                                </div>
                                <div id="userSearchInputCon" class="absolute d-none">
                                    <div class="input-userlist-box">
                                        <div class="toggle-user-input user-menu">
                                            <input id="userSearchInput" class="user-search-input"
                                                placeholder="Search for collegues"
                                                oninput="filterUsers(this.value)">
                                            <button class="assign-user-btn" onclick="toggleUsersInput()"><img
                                                    class="small-btn" src="../../assets/img/openUp.png"></button>
                                        </div>
                                        <div id="allUsersList" class="all-users-list"></div>
                                    </div>
                                </div>
                            </div>
                            <div id="userInitialContainer" class="user-initial-container"></div>
                        </div>
                    </div>
                    <div class="border"></div>
                    <div class="add-task-right">
                        <div class="form-and-btn">
                            <h3>Due date</h3>
                            <input required id="date" class="date" type="date" name="setTodaysDate">
                            <h3>Prio</h3>
                            <div id="urgency" class="priority-btns">
                                <label for="urgent" class="urgent priority-btn">
                                    <input type="radio" id="urgent" name="priority" value="urgent"
                                        class="priority-radio" required>
                                    Urgent<img src="../../assets/img/prioUrgent.png">
                                </label>
                                <label for="medium" class="medium priority-btn">
                                    <input type="radio" id="medium" name="priority" value="medium"
                                        class="priority-radio">
                                    Medium<img class="medium-prio" src="../../assets/img/prioMedium.png">
                                </label>

                                <label for="low" class="low priority-btn">
                                    <input type="radio" id="low" name="priority" value="low" class="priority-radio">
                                    Low<img src="../../assets/img/prioLow.png">
                                </label>
                            </div>
                            <h3>Subtasks</h3>
                            <div class="assign-btn-container" id="subtasks">
                                <button onclick="changeSubtaskInput()" type="button" class="assign-btn "
                                    type="text">
                                    <div id="subtaskMenu">Add new subtask</div>
                                    <img class="add-subtask small-btn" src="../../assets/img/addIcon.png">
                                </button>
                            </div>
                            <div id="renderedSubtasks"></div>
                        </div>
                        <h3> Category</h3>
                        <div id="categoryBackground">
                            <div class="select-category">
                                <div class="absolute">
                                    <div id="openCategoryBtn">
                                        <button class="toggle-user-input user-menu" onclick="toggleCategoryInput()">
                                            <div>Select task category</div>
                                            <input id="validateCategory" required class="hidden-input">
                                            <img class="category-input small-btn" src=" ../../assets/img/open.png">
                                            <img class="category-input small-btn d-none"
                                                src="../../assets/img/openUp.png">
                                        </button>
                                    </div>
                                    <div id="categoriesContainer" class="all-categories-list d-none">
                                    <div class="box-shadow">
                                        <div id="categoryList" class="category-list"></div>
                                        <button id="newCategoryBtn" type="button" class="new-category-btn"
                                            onclick="openNewCategory()">New
                                            category</button>                                      
                                        <div id="newCategoryContainer" class="d-none new-category-menu">
                                            <div class=" subtasks-container">
                                                <div class="category-input-color">
                                                    <div id="chosenColor"></div>
                                                    <input minlength="3" id="categoryInput" type="text"
                                                        placeholder="New category name">
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
                                            <div id="colorPicker" class="color-picker"></div>
                                        </div>
                                        </div>
                                        </div>
                                </div>
                            </div>
                        </div>
                        <div class="btn-container">
                            <button class="clear-btn" type="reset" class="clear-btn" onclick="clearInputTasks()">
                                Clear<img src="../../assets/img/cancel.png"></button>
                            <button class="create-task-btn" type="submit" class="assign-btn">
                                <span>Create Task</span><img src="../../assets/img/check.png"></button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
`
}