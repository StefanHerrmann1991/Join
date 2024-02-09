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


let chosenContact = '';

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


/**
 * This class represents a contact book for the kanban board.
 */
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
    * This method is used to add a new contact to the contact book.
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
  let actualContact = this.contacts[index];
  let oldInitial = actualContact.firstNameInitial;
  let [newInitial, initials] = this.getInitials(name);

  actualContact.name = name;
  actualContact.email = email;
  actualContact.phone = phone;
  actualContact.initial = initials;
  actualContact.firstNameInitial = newInitial;

  if (oldInitial !== newInitial) {
    this.checkInitials(oldInitial);
  }
  if (!this.initialList.includes(newInitial)) {
    this.initialList.push(newInitial);
  }
}

  /**
  * This method checks if the first name initial is still in use by other contacts.
  * @param {string} firstNameInitial - The first letter of the contact's first name.
  */
  checkInitials(firstNameInitial) {
    const count = this.countOccurrence(this.contacts.map(contact => contact.firstNameInitial), firstNameInitial);
    if (count === 0) {
      const index = this.initialList.indexOf(firstNameInitial);
      if (index > -1) {
        this.initialList.splice(index, 1);
      }
    }
  }


 /**
 * This method counts the occurrence of an element in an array.
 * @param {Array} arr - The array to be checked.
 * @param {any} element - The element whose occurrence is to be counted.
 * @returns {number} - The number of occurrences of the element.
 */
 countOccurrence(arr, element) {
  return arr.filter(el => el === element).length;
}

  /**
  * This method gets the first name initial and the first name initial + last name initial (if any) of a name.
  * @param {string} name - The full name to extract initials from.
  * @returns {Array} - An array containing the first name initial and the combined initials.
  */
  getInitials(name) {
    const nameArray = name.split(' ');
    const firstNameInitial = nameArray.shift().substring(0, 1).toUpperCase();
    let lastNameInitial = "";
    if (nameArray.length > 0) lastNameInitial = nameArray.pop().substring(0, 1);
    const initials = firstNameInitial + lastNameInitial;
    return [firstNameInitial, initials]
  }


  /**
  * This method sorts the contacts in the contact book by name in ascending order.
  */
  sortContacts() {
    this.contacts.sort((a, b) => a.name.localeCompare(b.name));
  }


  /**
   * This method sorts the initialList in ascending order.
   */
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


/**
 * Creates a contact, gets the contact from the input fields, sorts them and there initials, and renders the updated contact list.
 * @param {Event} event - The event triggering this function.
 */
function createContact(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document?.getElementById('phone').value;
  contactBook.addContact(name, email, phone);
  contactBook.sortInitials();
  contactBook.sortContacts();
  closeContainer('addContactDialog');
  renderContacts();
  }


/**
 * Initializes the contact list by setting up the backend and rendering the contacts.
 */
async function initContacts() {
  await initContactList();
  await includeHTML();
  await renderContacts();
  highlightChosenMenu();
}



/**
 * Sets up the backend, downloads data from the server, parses the contact list, and sorts contacts afterwards.
 */
async function initContactList() {
  let contactBookAsText;
  try {
    const contactBookText = await getItem('ContactBookAsText');
    contactBookAsText = JSON.parse(contactBookText);
  } catch (e) {
    // If there's an error, default to an object with an empty contacts array
    contactBookAsText = { contacts: [], initialList: [] };
  }
  contactBook = new ContactBook(contactBookAsText.contacts, contactBookAsText.initialList);
  contactBook.sortInitials();
  contactBook.sortContacts();
  users = contactBook.contacts;
}


/**
 * Renders the contacts in the contact book by iterating through the initial list and displays the contacts under there initial.
 */
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


/**
 * Handles window resize events to toggle the contact container visibility based on whether the window is in mobile view.
 */
window.addEventListener('resize', function () {
  // check if window is in mobile view
  if (isMobileView() && contactIsOpen) closeContainer('addContactBtn');
  else openContainer('addContactBtn');
});


/**
 * Displays a specific contact in a more detailed view. Closes the addContactBtn container in mobile view.
 * @param {number} index - The index of the contact to display.
 */
function showContact(index) {
  contactIsOpen = true
  if (isMobileView()) closeContainer('addContactBtn');
  let actualContact = contactBook.contacts[index];
  selectUser(index);
  openContainer('editContact');
  getId('editContact').classList.remove('desktop');
  document.getElementById('editContact').innerHTML = showContactHTML(index, actualContact);
}


/**
 * Closes the mobile contact view and reopens the addContactBtn container.
 */
function closeContactMobile() {
  getId('editContact').classList.add('desktop');
  closeContainer('editContact');
  contactIsOpen = false
  openContainer('addContactBtn');
}


/**
 * Selects a user from the contact list and visually marks it as selected.
 * @param {number} index - The index of the user to be selected.
 */
function selectUser(index) {
  document.querySelectorAll('.contact-container').forEach(contact => contact.classList.remove('selected-user'));
  getId('contact-' + index).classList.add('selected-user');
}


/**
 * Deletes a contact from the contact book at a given index and re-renders the contact list.
 * @param {number} index - The index of the contact to be deleted.
 */
async function deleteContact(index) {
  contactBook.deleteContact(index);
  await saveBackendDataOf(contactBook);
  getId('contactPopup').innerHTML = ''
  renderContacts();
  closeContainer('editContactDialog')
}


/**
 * Opens a dialog box to edit a contact's details.
 * @param {number} index - The index of the contact to be edited.
 */
function editContact(index) {
  let actualContact = contactBook.contacts[index];
  renderEditContact(index);
  openContainer('editContactDialog');
  getId('editName').value = actualContact.name;
  getId('editEmail').value = actualContact.email;
  getId('editPhone').value = actualContact.phone;
  getId('editInitial').innerHTML = `<div class="edit-initial" style="background-color: ${actualContact.color}">${actualContact.initial}</div>`
}


/**
 * Saves the changes to a contact, updates the contact book, re-renders the contact list, 
 * and closes the edit dialog box. Then, it shows the contact with the updated details.
 * @param {Event} event - The event triggering this function.
 * @param {number} index - The index of the contact to be updated.
 */
async function saveEditedContact(event, index) {
  event.preventDefault();
  contactName = getId('editName').value;
  contactEmail = getId('editEmail').value;
  contactPhone = getId('editPhone').value;
  contactBook.editContact(index, contactName, contactEmail, contactPhone);
  closeContainer('editContactDialog');
  showContact(index);
  await saveBackendDataOf(contactBook);
  renderContacts();
}


/**
 * Renders the edit dialog box with a pre-populated form for editing a contact's details.
 * @param {number} actualContact - The index of the contact to be edited.
 */
function renderEditContact(actualContact) {
  document.getElementById('editContactDialog').innerHTML = editContactHTML(actualContact);
}


