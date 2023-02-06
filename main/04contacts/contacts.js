
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
  constructor(firstNameInitial, contactGroup) {
    this[firstNameInitial] = contactGroup;
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

    let contact = new Contact(name, email, phone, initials);

    let initialsObject = this.contacts.find(i => i.hasOwnProperty(firstNameInitial));
    if (initialsObject) {
      initialsObject[firstNameInitial].push(contact);
    } else {
      this.initialList.push(firstNameInitial);
      this.contacts.push(new Initials(firstNameInitial, [contact]));
    }
    this.sortContacts();

    console.log(contactBook);
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
      let initialA = Object.keys(a)[0];
      let initialB = Object.keys(b)[0];
      if (initialA < initialB) return -1;
      if (initialA > initialB) return 1;
      return 0;
    });

    this.contacts.forEach(initials => {
      for (const initial in initials) {
        initials[initial].sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
      }
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
  for (let i = 0; i < contactBook.contacts.length; i++) {
    letter = contactBook.initialList[i];
    contactBookId.innerHTML = `
      <h2>${letter}<h2>
    `;

  }


}