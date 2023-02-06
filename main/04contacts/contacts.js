
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

class Initials {
  constructor(firstNameInitial, contact) {
    this.contact = contact;
    this.firstNameInitial = firstNameInitial;
    this.contactGroup = {
      'initial': firstNameInitial,
      'contact': contact
    };
  }
}

class ContactBook {
  contacts;
  initialList;

  constructor() {
    this.contacts = [];
    this.initialList = [];
  }

  addContact(name, email, phone) {
    let [firstNameInitial, initials] = this.getInitials(name);
    if (!this.initialList.includes(firstNameInitial)) this.initialList.push(firstNameInitial);
    let contact = new Contact(name, email, phone, initials);
    let initial = new Initials(firstNameInitial, contact);
    this.contacts.push(initial);

    console.log(this);
  }

  getInitials(name) {
    const nameArray = name.split(' ');
    const firstNameInitial = nameArray.shift().substring(0, 1);
    let lastNameInitial = "";
    if (nameArray.length > 0) lastNameInitial = nameArray.pop().substring(0, 1);
    const initials = firstNameInitial + lastNameInitial;
    return [firstNameInitial, initials]
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
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  contactBook.addContact(name, email, phone);
  contactBook.sortContacts();
  console.log(contactBook);
  closeContactDialog();
  renderContacts();
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