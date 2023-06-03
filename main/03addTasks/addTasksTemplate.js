function contactInvitationHTML() {
    return`
    <button type="button" class="assign-btn" onclick="toggleContainer('userMenu'); toggleContainer('userInitialContainer')">
        <div>Select contact to assign</div>
        <div id="imgArrow"><img src="../../assets/img/open.png"></div>
    </button>
    <div class="user-menu" id="userMenu">
        <div class="user-list" id="userList"></div>
        <button id="inviteUserBtn" type="button" class="invite-user-btn"
        onclick="inviteUsers()">Invite new contact<img src="../../assets/img/contactsBlack.png">
        </button>   
    </div>
    `
}


function invivteUsersHTML() {
    return `  
    <div class="subtasks-container">
        <input class="costom-datalist" id="userSearchInput" type="text" list="usersSearch" name="userList" placeholder="Contact email" onKeyUp="showResults(this.value)">
        <div class="button-container">
            <button type="button" class="cancel-button" onclick="cancelContactInvitation()">
                <img src="../../assets/img/cancelDark.png" >
            </button>
            <button type="button" class="add-button" onclick="newContactInvitation()">
                <img src="../../assets/img/checkDark.png">
            </button>
        </div>
    </div>  
    `
}


function categoryHTML() {
    return `
    <div class="subtasks-container">
        <div class="category-input-color">
            <input minlength="3" id="categoryInput" type="text" placeholder="New category name">     
            <div class="chosen-color" id="chosenColor"></div>       
        </div>
        <div class="button-container">
            <button type="button" class="cancel-button" onclick="cancelNewCategory()"><img
                    src="../../assets/img/cancelDark.png"></button>
            <button type="button" class="add-button" onclick="addCategory()"><img src="../../assets/img/checkDark.png"></button>
        </div>
    </div>
    <div id="colorPicker" class="color-picker"></div>       
    `
}


function newCategoryHTML() {
    return `
    <button type="button" class="assign-btn" onclick="toggleContainer('categoryMenu');">
        <div class="chosen-category-container" id="categorySelect">Select task category</div>
        <div id="imgArrow"><img src="../../assets/img/open.png"></div>
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
                <img src="../../assets/img/cancelDark.png"> 
            </button>
            <button type="button" class="add-button" onclick="newSubtask()">
                <img src="../../assets/img/checkDark.png">
            </button>
        </div>
    </div>
    `
}


function newSubtaskHTML(subtask, index) {
    return `
    <div class="subtask-checkbox-container"> 
        <input class="subtask-checkbox" type="checkbox" 
            value="${index}" 
                ${subtask.checked ? 'checked' : ''} 
                onchange="updateSubtask(${index})">
        ${subtask.title}
    </div>            
`;
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
    <button type="button" id="category" class="category" value="${category.index}">
        <span>${category.topic}</span>
    <div class="category-color" style="background-color: ${category.color}"></div></button>  
    `
}


function categoryOptionsHTML(category, index) {
    return `
    <button type="button" onclick="saveCategory(${index})" class="each-category-container">
    <div class="category" id="category-${index}">${category.topic}</div>
    <div class="category-color" style="background-color: ${category.color}"></div>
    </button>
    `
}