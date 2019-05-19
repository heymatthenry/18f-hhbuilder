/* use strict */
const formLib = {
  // Initialize state
  household: [],

  init: function () {
    this.attachEvents();
    this.initializeDom();
  },

  initializeDom: function () {
    const addBtn = document.getElementsByClassName('add')[0];
    addBtn.setAttribute('type', 'button'); // prevent attribute-less button from triggering submit
  },

  capitalize: function (str) {
    return str[0].toUpperCase() + str.slice(1, str.length)
  },

  validateAge: function (age) {
    return age > 0;
  },

  validateRelationship: function (rel) {
    const relationships = ["self", "spouse", "child", "parent", "grandparent", "other"];
    return relationships.includes(rel);
  },

  attachEvents: function () {
    const btnAdd = document.getElementsByClassName('add')[0];
    btnAdd.addEventListener('click', this.handleAdd)
    const form = document.forms[0];

    form.addEventListener('submit', this.handleSubmit);
  },

  handleSubmit: function (e) {
    e.preventDefault();
    const debug = document.querySelector('pre.debug');
    debug.innerText = JSON.stringify(formLib.household);
  },

  handleAdd: function () {
    const form = document.forms[0];
    const age = +form.elements.age.value;
    const rel = form.elements.rel.value;

    const isValidAge = formLib.validateAge(age);
    const isValidRel = formLib.validateRelationship(rel);

    if (isValidAge && isValidRel) {
      formLib.addHHMember({
        hhid: Math.floor(Math.random() * 1000000),
        age: age,
        rel: formLib.capitalize(rel),
        smoker: form.elements.smoker.checked ? "Yes" : "No",
      })
    }
  },

  createHHTable: function () {
    const tbl = document.createElement('table');
    const tr = document.createElement('tr');
    ["Age", "Size", "Smoker?", "Remove Household Member"].map((txt) => {
      const th = document.createElement('th');
      th.innerText = txt;
      tr.appendChild(th);
    });
    tbl.appendChild(tr);
    document.body.appendChild(tbl).id = 'hh-members';
  },

  addHHMember: function (hhObj) {
    let tbl = document.getElementById('hh-members');

    if (!tbl) {
      this.createHHTable();
      tbl = document.getElementById('hh-members');
    }

    const tr = document.createElement('tr');
    tr.setAttribute("data-hhid", hhObj.hhid);

    ["age", "rel", "smoker"].map((prop) => {
      const td = document.createElement('td');
      td.innerText = hhObj[prop];
      tr.appendChild(td);
    })

    const btnRemove = document.createElement('button');
    btnRemove.setAttribute('type', 'button');
    btnRemove.innerText = 'Remove';
    btnRemove.addEventListener('click', function () { formLib.removeHHMember(hhObj.hhid) });

    tr.appendChild(btnRemove);
    tbl.appendChild(tr);
    this.household.push(hhObj);
  },

  removeHHMember(id) {
    const tr = document.querySelector("tr[data-hhid='" + id + "']");
    tr.parentNode.removeChild(tr)
    this.household.map((mem, i) => {
      if ((mem.hhid) === id) {
        formLib.household.splice(i, 1);
      }
    })
  }
};

formLib.init();
