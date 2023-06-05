function editContactHTML(actualContact) {
    return `  
    <div class="add-contact" >
        <div class="add-contact-menu">
            <div class="add-contact-description">
                <img class="desktop" src="../../assets/img/logo.png">
                <h2>Edit contact</h2>                
                <div class="lower-border"></div>
                <button class="close-upper-right mobile" onclick="closeContainer('editContactDialog')">
                    <img src="../../assets/img/cancelWhite.png">                   
                </button>
            </div>
            <div class="add-contact-submenu">
                <button class="close-upper-right desktop" onclick="closeContainer('editContactDialog')">
                    <img src="../../assets/img/cancel.png">                   
                </button>
                <div id="editInitial"></div>
                <form onsubmit="saveEditedContact(event, ${actualContact});  saveBackendDataOf(contactBook)"
                    id="editContactFormfield">
                    <input minlength="3" type="text" id="editName" name="editName" required>
                    <input minlength="3" type="email" id="editEmail" name="editEmail" required>
                    <input minlength="3" type="tel" id="editPhone" name="editPhone" required>
                <div class="edit-contact-btns">
                    <button type="button" onclick="deleteContact(${actualContact})">
                        Delete
                    </button>
                    <button class="save-btn" type=submit>Save</button>                            
                </div>
                </form>
            </div>
        </div>
    </div>
`
}

function showContactHTML(index, actualContact) {
    return `
    <div class="edit-contact-menu">
        <div class="edit-contact-headline">
            <h1>Contacts</h1>
            <div class="border-big"></div>
            <div class="title-additive">Better with a Team</div>
            <div class="lower-border"></div>
            <button class="mobile back-btn" onclick="closeContactMobile()">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M3.828 6.99968H15C15.5523 6.99968 16 7.44739 16 7.99968C16 8.55196 15.5523 8.99968 15 8.99968H3.828L8.485 13.6567C8.87547 14.0471 8.87547 14.6802 8.485 15.0707C8.09453 15.4611 7.46147 15.4611 7.071 15.0707L0.707106 8.70679C0.316582 8.31626 0.316582 7.6831 0.707107 7.29257L7.071 0.92868C7.46147 0.538214 8.09453 0.538214 8.485 0.92868C8.87547 1.31914 8.87547 1.95221 8.485 2.34268L3.828 6.99968Z"
                        fill="black" />
                </svg>
            </button>
        </div>
        <div class="edit-contact-popup" id="contactPopup">
            <div class="edit-name-initial-con">
                <div class="edit-initial" style="background-color:${actualContact.color}">${actualContact.initial}</div>
                <div class="contact-task-container">
                    <div class="edit-name">${actualContact.name}</div>
                    <button class="add-task-btn" onclick="initTasks(); openContainer('addTasksPopup')"><img
                            src="../../assets/img/addTaskBlue.png">Add Tasks</button>
                </div>
            </div>
            <div class="edit-information">
                <div class="contact-name">Contact Information</div>
                <button onclick="editContact(${index})"><img src="../../assets/img/edit.png">Edit Contact</button>
            </div>
            <div class="contact-information">
                <h4>Email</h4>
                <div class="contact-email">${actualContact.email}</div>
                <h4>Phone</h4>
                <div>${actualContact.phone}</div>
            </div>
        </div>
  </div>
    `
}
