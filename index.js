/* use strict */
const formLib = {
  // Initialize state
  household: [],
  errors: {},

  init: function () {
    this.attachEvents();
    this.initializeDom();
  },

  initializeDom: function () {
    const builder = document.getElementsByClassName('builder')[0];

    // prevent attribute-less button from triggering submit
    const addBtn = builder.getElementsByClassName('add')[0];
    addBtn.setAttribute('type', 'button');

    // Add container for error flash
    const ol = builder.getElementsByTagName('ol')[0];
    const errCtr = document.createElement('ul');
    errCtr.id = 'error-ctr';
    errCtr.setAttribute('role', 'alert');
    errCtr.setAttribute('aria-atomic', 'true');
    builder.insertBefore(errCtr, ol);
  },

  attachEvents: function () {
    const btnAdd = document.getElementsByClassName('add')[0];
    btnAdd.addEventListener('click', this.handleAdd)

    const form = document.forms[0];
    form.addEventListener('submit', this.handleSubmit);
  },

  capitalize: function (str) {
    return str[0].toUpperCase() + str.slice(1, str.length)
  },

  validateAge: function (age) {
    const isValid = age > 0;
    const ageField = document.forms[0].elements.age;
    ageField.style = isValid ? "" : "border: 1px dashed red";
    this.errors.age = isValid ? "" : "Age must be a number greater than zero."
    return isValid;
  },

  validateRelationship: function (rel) {
    const relationships = ["self", "spouse", "child", "parent", "grandparent", "other"];
    const isValid = relationships.includes(rel);
    const relField = document.forms[0].elements.rel;
    relField.style = isValid ? "" : "border: 1px dashed red";
    this.errors.rel = isValid ? "" : "Please select your relationship to the household member from the list";
    return isValid;
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

    const errCtr = document.getElementById('error-ctr');
    errCtr.innerHTML = '';

    if (isValidAge && isValidRel) {
      formLib.addHHMember({
        hhid: Math.floor(Math.random() * 1000000),
        age: age,
        rel: formLib.capitalize(rel),
        smoker: form.elements.smoker.checked ? "Yes" : "No",
      })
    } else {
      Object.keys(formLib.errors).map((i) => {
        const err = formLib.errors[i];
        if (err !== '') {
          const li = document.createElement('li');
          li.style = 'color: red';
          li.innerText = formLib.errors[i];
          errCtr.appendChild(li);
        }
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
    let ol = document.getElementsByClassName('household')[0];

    const li = document.createElement('li');
    li.setAttribute("data-hhid", hhObj.hhid);
    li.innerText = hhObj.age + ' ' + hhObj.rel + ' ' + hhObj.smoker;

    const btnRemove = document.createElement('button');
    btnRemove.setAttribute('type', 'button');
    btnRemove.innerText = 'Remove';
    btnRemove.addEventListener('click', function () { formLib.removeHHMember(hhObj.hhid) });

    li.appendChild(btnRemove);
    ol.appendChild(li);
    this.household.push(hhObj);
  },

  removeHHMember(id) {
    const li = document.querySelector("li[data-hhid='" + id + "']");
    li.parentNode.removeChild(li)
    this.household.map((mem, i) => {
      if ((mem.hhid) === id) {
        formLib.household.splice(i, 1);
      }
    })
  }
};

formLib.init();
