
let contactBookId;
let sortByLastName = false;
let contacts
let ContactBookAsText = []
let contactBook
let isMobileDevice = false;

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

  constructor(contacts, initialList) {
    if (contacts) this.contacts = contacts
    else this.contacts = [];
    if (initialList) this.initialList = initialList
    else this.initialList = [];
  }

  addContact(name, email, phone) {
    let [firstNameInitial, initials] = this.getInitials(name);
    let color = getRandomColor(firstNameInitial);
    let id = this.contacts.length
    let contact = newContact(name, email, phone, initials, color, firstNameInitial, id);
    if (!this.initialList.includes(firstNameInitial)) this.initialList.push(firstNameInitial);
    this.contacts.push(contact);
  }

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
    console.log(count)
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

function getRandomColor(name) {
  // get first alphabet in upper case
  const firstAlphabet = name.charAt(0).toLowerCase();
  // get the ASCII code of the character
  const asciiCode = firstAlphabet.charCodeAt(0);
  // number that contains 3 times ASCII value of character -- unique for every alphabet
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

function showContact(index) {
  let actualContact = contactBook.contacts[index];
  selectUser(index);
  openContainer('editContact');
  getId('editContact').classList.remove('desktop');
  document.getElementById('editContact').innerHTML = `
  <div class="edit-contact-menu">
  <div class="edit-contact-headline">
      <h1>Contacts</h1>
      <div class="border-big desktop"></div>
      <div class="title-additive desktop">Better with a Team</div>
      <button class="mobile" onclick="closeContactMobile()">
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
          <div>
              <div class="edit-name">${actualContact.name}</div>
              <button class="add-task-btn" onclick="openContainer('addTaksPopup'); initTasks()"><img
                      src="/assets/img/addTaskBlue.png">Add Tasks</button>
          </div>
      </div>
      <div class="edit-information">
          <div class="contact-name">Contact Information</div>
          <button onclick="editContact(${index})"><img src="/assets/img/edit.png">Edit Contact</button>
          <button class="delete-btn" onclick="deleteContact(${index})"><img
                  src="/assets/img/deleteDark.png">Delete</button>
      </div>
      <div class="contact-information">
          <h4>Email</h4>
          <div>${actualContact.email}</div>
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
  document.getElementById('editName').value = actualContact.name;
  document.getElementById('editEmail').value = actualContact.email;
  document.getElementById('editPhone').value = actualContact.phone;
}


function saveEditedContact(event, index) {
  event.preventDefault();
  contactName = document.getElementById('editName').value;
  contactEmail = document.getElementById('editEmail').value;
  contactPhone = document.getElementById('editPhone').value;
  contactBook.editContact(index, contactName, contactEmail, contactPhone);
  renderContacts();
  closeContainer('editContactDialog');
}


function renderEditContact(actualContact) {
  document.getElementById('editContactDialog').innerHTML =
    `  
    <div class="add-contact" >
        <div class="add-contact-menu">
            <div class="add-contact-description">
                <img src="/assets/img/logo.png">
                <h2>Edit contact</h2>
                <p>Tasks are better with a team!</p>
            </div>
            <div class="add-contact-submenu">
                <button class="close-upper-right" onclick="closeContainer('editContactDialog')">
                    <img src="/assets/img/cancel.png">                   
                </button>
                <img src="/assets/img/addContactBig.png">
                <form onsubmit="saveEditedContact(event, ${actualContact});  saveBackendDataOf(contactBook)"
                    id="editContactFormfield">
                    <input type="text" id="editName" name="editName" required placeholder="${actualContact.name}">
                    <input type="email" id="editEmail" name="editEmail" required placeholder="${actualContact.email}">
                    <input type="tel" id="editPhone" name="editPhone" required placeholder="${actualContact.phone}">
                    <div class="menu-btn">
                        <button type="button" onclick="closeContainer('editContactDialog')">Cancel
                            <img src="/assets/img/cancel.png">
                        </button>
                        <button type=submit>Edit contact
                            <img src="/assets/img/check.png">
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
`
}


