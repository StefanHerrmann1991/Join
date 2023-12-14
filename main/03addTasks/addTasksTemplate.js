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
    <button type="button" id="category" class="toggle-user-input user-menu" value="${category.index}">
        <div class="color-topic">
            <div class="category-color" style="background-color: ${category.color}"></div>
            <span>${category.topic}</span>
        </div>        
        <img onclick="toggleCategoryInput()" class="category-input small-btn" src=" ../../assets/img/open.png">
        <img onclick="toggleCategoryInput()" class="category-input small-btn d-none"
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
