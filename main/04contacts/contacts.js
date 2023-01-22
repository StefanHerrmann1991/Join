
let content = document.getElementById('content');
let contacts = [];


class Contact {
  constructor(name) {
    this.name = name;
  }
}

class ContactBook {
  constructor() {
    this.contacts = [];
    console.log(this.contacts);
  }

  addContact(name) {
    this.contacts.push(new Contact(name));
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
contactBook.addContact("Stefan Herrmann");


// Sort the contacts by name
contactBook.sortContacts();


function openContactDialog() {
  document.getElementById('addContactDialog').classList.remove('d-none');
}


function closeContactDialog() {
  document.getElementById('addContactDialog').classList.add('d-none');
  }

function renderAddContact() {
  content.innerHTML = `
  <div>  
  <div>
  <img src="assets/img/navbar/logo.png"
  
  
  </div>
  </div>
  `;

}