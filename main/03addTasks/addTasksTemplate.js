function contactInvitationHTML() {
    return `
    <button type="button" class="assign-btn" onclick="toggleContainer('userMenu'); toggleContainer('userInitialContainer')">
        <div>Select contact to assign</div>
        <div id="imgArrow"><img src="../../assets/img/openUp.png"></div>
    </button>
    <div class="user-menu" id="userMenu">
        <div class="user-list" id="userList"></div>
        <button id="inviteUserBtn" type="button" class="invite-user-btn"
        onclick="inviteUsers()">Invite new contact<img src="../../assets/img/contactsBlack.png">
        </button>   
    </div>
    `
}


function newCategoryHTML() {
    return `
    <button type="button" class="assign-btn" onclick="toggleContainer('categoryMenu');">
        <input id="validateCategory" required class="hidden-input">
    </button>
    <div class="user-menu d-none" id="categoryMenu">
        <button id="newCategoryBtn" type="button" class="new-category-btn" onclick="newCategory()">New category</button>
        <div class="category-list" id="categoryList"></div>
    </div>          
 `
}


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
    <button onclick="renderSubtasks()" type="button" class="assign-btn"  type="text">
        <div id="subtaskMenu">Add new subtask</div>
        <img  class="add-subtask" src="../../assets/img/addIcon.png">
    </button>  
    `
}


function chosenCategoryHTML(category) {
    return ` 
    <button type="button" id="category" class="toggle-user-input user-menu" value="${category.index}">
        <div class="color-topic">
            <div class="category-color" style="background-color: ${category.color}"></div>
            <span>${category.topic}</span>
        </div>
        <img src="../../assets/img/openUp.png" onclick="toggleCategoryInput()">
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