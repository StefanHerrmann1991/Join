
let contactBookId;
let sortByLastName = false;


class Contact {
  constructor(name, email, phone, initials) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.initials = initials;
  }
}

class ContactBook {
  contacts;
  initialList;


  constructor() {
    this.contacts = [];
    this.initialList = [];
  }

  addContact(name, email, phone, initials) {
    this.contacts.push(new Contact(name, email, phone, initials));

  }
  sortContacts() {
    this.contacts.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  }
}

const contactBook = new ContactBook();


function openContactDialog() {
  document.getElementById('addContactDialog').classList.remove('d-none');
}


function closeContactDialog() {
  document.getElementById('addContactDialog').classList.add('d-none');
}


function createContact(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  [firstNameInitial, initials] = getInitials(name);
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  contactBook.addContact(name, email, phone, initials);
  contactBook.sortContacts();
  sortInitials(firstNameInitial);
  closeContactDialog();
  renderContacts();
}

function getInitials(name) {
  const nameArray = name.split(' ');
  const firstNameInitial = nameArray.shift().substring(0, 1);
  let lastNameInitial = "";
  if (nameArray.length > 0) lastNameInitial = nameArray.pop().substring(0, 1);
  const initials = firstNameInitial + lastNameInitial;
  return [firstNameInitial, initials]
}

function sortInitials(initial) {
  if (!contactBook.initialList.includes(initial)) contactBook.initialList.push(initial);
  return contactBook.initialList.sort();
}

function saveContacts() { };
function loadContacts() { };
function editContacts() { };

function initContactBook() {
  renderContacts();
}


function renderContacts() {
  contactBookId = document.getElementById('contactBookId');
  for (let i = 0; i < contactBook.initialList.length; i++) {
    letter = contactBook.initialList[i];
    contactBookId.innerHTML = `
      <h2>${letter}<h2>
    `;

  }


}