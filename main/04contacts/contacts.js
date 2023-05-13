/**
 * ID of the current contact book.
 * @type {string}
 */
let contactBookId;

/**
 * Collection of contacts.
 * @type {Array}
 */
let contacts

/**
 * Representation of the contact book in a textual format.
 * @type {Array}
 */
let ContactBookAsText = [];

/**
 * Instance of the ContactBook class.
 * @type {ContactBook}
 */
let contactBook;

/**
 * Flag to check if a contact is currently open.
 * @type {boolean}
 */
let contactIsOpen = false;

/**
 * Reference to the 'Add Contact' button on the DOM.
 * @type {HTMLElement}
 */
let addContactBtn = getId('addContactBtn');


/**
 * Creates a new contact object.
 *
 * @param {string} name - The full name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} initial - The initials of the contact.
 * @param {string} color - The color associated with the contact (based on initials).
 * @param {string} firstNameInitial - The initial of the contact's first name.
 * @param {number} id - The ID of the contact.
 * @returns {Object} The newly created contact object.
 */
function newContact(name, email, phone, initial, color, firstNameInitial, id) {
  let contact = {
    'name': name,
    'email': email,
    'phone': phone,
    'initial': initial,
    'color': color,
    'firstNameInitial': firstNameInitial,
    'assigned': false,
    'id': id
  }
  return contact;
}



class ContactBook {
  contacts;
  initialList;

  /**
   * Creates a new contact book.
   *
   * @param {Array} contacts - An array of contacts.
   * @param {Array} initialList - A list of distinct first name initials.
   */

  constructor(contacts, initialList) {
    if (contacts) this.contacts = contacts
    else this.contacts = [];
    if (initialList) this.initialList = initialList
    else this.initialList = [];
  }


  /**
   * Adds a new contact to the contact book.
   *
   * @param {string} name - The full name of the contact.
   * @param {string} email - The email address of the contact.
   * @param {string} phone - The phone number of the contact.
   */

  addContact(name, email, phone) {
    let [firstNameInitial, initials] = this.getInitials(name);
    let color = getRandomColor(firstNameInitial);
    let id = this.contacts.length
    let contact = newContact(name, email, phone, initials, color, firstNameInitial, id);
    if (!this.initialList.includes(firstNameInitial)) this.initialList.push(firstNameInitial);
    this.contacts.push(contact);
  }


  /**
  * Deletes a contact from the contact book by index.
  *
  * @param {number} index - The index of the contact to delete.
  */
  deleteContact(index) {
    const contactToDelete = this.contacts[index];
    const firstNameInitial = contactToDelete.firstNameInitial;
    this.contacts.splice(index, 1);
    const count = this.countOccurrence(this.contacts.map(contact => contact.firstNameInitial), firstNameInitial);
    if (count === 0) {
      const indexToDelete = this.initialList.indexOf(firstNameInitial);
      if (indexToDelete > -1) {
        this.initialList.splice(indexToDelete, 1);
      }
    }
  }


  /**
    * Edits a contact in the contact book.
    *
    * @param {number} index - The index of the contact to edit.
    * @param {string} name - The new full name of the contact.
    * @param {string} email - The new email address of the contact.
    * @param {string} phone - The new phone number of the contact.
  */
  editContact(index, name, email, phone) {
    let actualContact = this.contacts[index]
    let oldInitial = this.contacts[index].firstNameInitial
    let [newInitial, initials] = this.getInitials(name);
    if (oldInitial !== newInitial) this.checkInitials(oldInitial)
    actualContact.name = name;
    actualContact.email = email;
    actualContact.phone = phone;
    actualContact.firstNameInitial = newInitial;
    actualContact.initial = initials;
    if (!this.initialList.includes(newInitial)) this.initialList.push(newInitial);
  }

  checkInitials(firstNameInitial) {
    const firstNameInitials = this.contacts.map(contact => contact.firstNameInitial);
    const count = this.countOccurrence(firstNameInitials, firstNameInitial);
    if (count == 1) {
      const index = this.initialList.indexOf(firstNameInitial);
      if (index > -1) this.initialList.splice(index, 1);
    }
  }

  countOccurrence(arr, element) {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr.indexOf(element, i) !== -1) count++;
    }
    return count;
  }

  getInitials(name) {
    const nameArray = name.split(' ');
    const firstNameInitial = nameArray.shift().substring(0, 1).toUpperCase();
    let lastNameInitial = "";
    if (nameArray.length > 0) lastNameInitial = nameArray.pop().substring(0, 1);
    const initials = firstNameInitial + lastNameInitial;
    return [firstNameInitial, initials]
  }

  sortContacts() {
    this.contacts.sort((a, b) => a.name.localeCompare(b.name));
  }

  sortInitials() {
    this.initialList.sort();
  }
}

contactBook = new ContactBook();


/**
 * Generates an unique RGB color code based on the first character of a name.
 *
 * @param {string} name - The name to generate the color from.
 * @returns {string} The generated RGB color code.
 */
function getRandomColor(name) {
  const firstAlphabet = name.charAt(0).toLowerCase();
  const asciiCode = firstAlphabet.charCodeAt(0);
  const colorNum = asciiCode.toString() + asciiCode.toString() + asciiCode.toString();
  var num = Math.round(0xffffff * parseInt(colorNum));
  var r = num >> 16 & 255;
  var g = num >> 8 & 255;
  var b = num & 255;
  return 'rgb(' + r + ', ' + g + ', ' + b + ', 1.0)'
}

function createContact(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  contactBook.addContact(name, email, phone);
  contactBook.sortInitials();
  contactBook.sortContacts();
  closeContainer('addContactDialog');
  renderContacts();
}

async function initContacts() {
  await initBackend();
  includeHTML();
  await renderContacts();
}

async function initBackend() {
  await setURL('https://stefan-herrmann.developerakademie.net/smallest_backend_ever');
  await downloadFromServer();
  ContactBookAsText = JSON.parse(backend.getItem('ContactBookAsText')) || [];
  contactBook = new ContactBook(ContactBookAsText.contacts, ContactBookAsText.initialList);
  contactBook.sortInitials();
  contactBook.sortContacts(); // Sort contacts after loading from server
  users = contactBook.contacts;
}



function renderContacts() {
  contactBookId = document.getElementById('contactBookId');
  contactBookId.innerHTML = '';
  for (let i = 0; i < contactBook.initialList.length; i++) {
    const initial = contactBook.initialList[i];
    contactBookId.innerHTML += `<h3 class="contact-intial">${initial}</h3><div id="${initial}"></div>`
    contactBook.contacts.forEach((element, index) => {
      if (contactBook.initialList[i] == contactBook.contacts[index].firstNameInitial) {
        document.getElementById(`${initial}`).innerHTML += `
      <button onclick="showContact(${index})" id="contact-${index}" class="contact-container">
      <div class="contact-intial"  style="background-color:${element.color}">
      <div class="icon-initial">${element.initial}</div>
      </div>
      <div class="contact-name-email">
      <div class="contact-name">${element.name}</div>
      <div class="contact-email">${element.email}</div>
      </div>
      </div>
      </button>`;
      }
    });
  }
}





window.addEventListener('resize', function () {
  // check if window is in mobile view
  if (isMobileView() && contactIsOpen) closeContainer('addContactBtn');
  else openContainer('addContactBtn');
});

function showContact(index) {
  contactIsOpen = true
  if (isMobileView()) closeContainer('addContactBtn');
  let actualContact = contactBook.contacts[index];
  selectUser(index);
  openContainer('editContact');
  getId('editContact').classList.remove('desktop');
  document.getElementById('editContact').innerHTML = `
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
  <div class="edit-contact-popup">
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


function closeContactMobile() {
  getId('editContact').classList.add('desktop');
  closeContainer('editContact');
  contactIsOpen = false
  openContainer('addContactBtn');
}

function selectUser(index) {
  document.querySelectorAll('.contact-container').forEach(contact => contact.classList.remove('selected-user'));
  getId('contact-' + index).classList.add('selected-user');
}

function deleteContact(index) {
  contactBook.deleteContact(index);
  renderContacts();
}


function editContact(index) {
  let actualContact = contactBook.contacts[index];
  renderEditContact(index);
  openContainer('editContactDialog');
  getId('editName').value = actualContact.name;
  getId('editEmail').value = actualContact.email;
  getId('editPhone').value = actualContact.phone;
  getId('editInitial').innerHTML = `<div class="edit-initial" style="background-color: ${actualContact.color}">${actualContact.initial}</div>`
}


function saveEditedContact(event, index) {
  event.preventDefault();
  contactName = getId('editName').value;
  contactEmail = getId('editEmail').value;
  contactPhone = getId('editPhone').value;
  contactBook.editContact(index, contactName, contactEmail, contactPhone);
  renderContacts();
  closeContainer('editContactDialog');
  showContact(index)
}


function renderEditContact(actualContact) {
  document.getElementById('editContactDialog').innerHTML =
    `  
    <div class="add-contact" >
        <div class="add-contact-menu">
            <div class="add-contact-description">
                <img class="desktop" src="../../assets/img/logo.png">
                <h2>Edit contact</h2>
                <p class="desktop">Tasks are better with a team!</p>
                <div class="lower-border"></div>
            </div>
            <div class="add-contact-submenu">
                <button class="close-upper-right" onclick="closeContainer('editContactDialog')">
                    <img src="../../assets/img/cancel.png">                   
                </button>
                <div id="editInitial"></div>
                <form onsubmit="saveEditedContact(event, ${actualContact});  saveBackendDataOf(contactBook)"
                    id="editContactFormfield">
                    <input type="text" id="editName" name="editName" required>
                    <input type="email" id="editEmail" name="editEmail" required>
                    <input type="tel" id="editPhone" name="editPhone" required>
                <div class="create-contact-btns">
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


