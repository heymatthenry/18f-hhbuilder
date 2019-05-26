/* use strict */
var HHbuilder = {
  // Initialize state
  state: {
    household: [],
    errors: {},
  },

  /**
  * Not really a "constructor" as such–
  * just specifying methods that should be run on initialzation
  */
  init: function () {
    this.attachEvents();
    this.initializeDom();
    this.populateHousehold();
  },

  /**
  * Create necessary DOM elements/attributes to support showing validation
  * errors and prevent form from submitting on clicking "add" button
  */
  initializeDom: function () {

    // NOTE to code reviewer: I'm assuming IE9+ by using getElementsByClassName
    var builder = document.getElementsByClassName('builder')[0];

    // prevent attribute-less button from triggering submit
    var addBtn = builder.getElementsByClassName('add')[0];
    addBtn.setAttribute('type', 'button');

    // Add container for error flash
    var ol = builder.getElementsByTagName('ol')[0];
    var errCtr = document.createElement('ul');
    errCtr.id = 'error-ctr';
    errCtr.setAttribute('role', 'alert');
    errCtr.setAttribute('aria-atomic', 'true');
    builder.insertBefore(errCtr, ol);
  },

  /**
   * Register event handlers for "add" button and form submission
   */
  attachEvents: function () {
    var btnAdd = document.getElementsByClassName('add')[0];
    btnAdd.addEventListener('click', this.handleAdd)

    var form = document.forms[0];
    form.addEventListener('submit', this.handleSubmit);
  },

  /**
   * Utitlity function to capitalize a string
   * @param {string} str 
   */
  capitalize: function (str) {
    return str[0].toUpperCase() + str.slice(1, str.length)
  },

  /**
   * Ensure age is greater than 0 
   * @param {number} age 
   */
  validateAge: function (age) {
    var isValid = age > 0;
    var ageField = document.forms[0].elements.age;
    ageField.style = isValid ? "" : "border: 1px dashed red";
    this.state.errors.age = isValid ? "" : "Age must be a number greater than zero."
    return isValid;
  },

  /**
   * Ensure relationship is one of those specified in the select list
   * @param {string} rel 
   */
  validateRelationship: function (rel) {
    var relationships = ["self", "spouse", "child", "parent", "grandparent", "other"];
    var isValid = relationships.indexOf(rel) >= 0;
    var relField = document.forms[0].elements.rel;
    relField.style = isValid ? "" : "border: 1px dashed red";
    this.state.errors.rel = isValid ? "" : "Please select your relationship to the household member from the list";
    return isValid;
  },

  /**
   * Handle form submission 
   * @param {event} e 
   */
  handleSubmit: function (e) {
    e.preventDefault();
    var debug = document.querySelector('pre.debug');
    var hhJson = JSON.stringify(HHbuilder.state.household);
    debug.innerText = hhJson;
    localStorage.setItem('household', hhJson);
  },

  /**
   * Handle click of the "add" button. Invokes form validation; manages display of validation errors.
   */
  handleAdd: function () {
    var form = document.forms[0];
    var age = +form.elements.age.value;
    var rel = form.elements.rel.value;

    var isValidAge = HHbuilder.validateAge(age);
    var isValidRel = HHbuilder.validateRelationship(rel);

    var errCtr = document.getElementById('error-ctr');
    errCtr.innerHTML = '';

    if (isValidAge && isValidRel) {
      HHbuilder.addHHMember({
        hhid: Math.floor(Math.random() * 1000000),
        age: age,
        rel: HHbuilder.capitalize(rel),
        smoker: form.elements.smoker.checked ? "Yes" : "No",
      })
    } else {
      Object.keys(HHbuilder.state.errors).map(function (i) {
        var err = HHbuilder.state.errors[i];
        if (err !== '') {
          var li = document.createElement('li');
          li.style = 'color: red';
          li.innerText = HHbuilder.state.errors[i];
          errCtr.appendChild(li);
        }
      })
    }
  },

  /**
   * Adds household member to DOM and to state.
   * @param {object} hhObj 
   */
  addHHMember: function (hhObj) {
    var ol = document.getElementsByClassName('household')[0];

    var li = document.createElement('li');
    li.setAttribute("data-hhid", hhObj.hhid);
    li.innerText = hhObj.age + ' ' + hhObj.rel + ' ' + hhObj.smoker;

    var btnRemove = document.createElement('button');
    btnRemove.setAttribute('type', 'button');
    btnRemove.innerText = 'Remove';
    btnRemove.addEventListener('click', function () { HHbuilder.removeHHMember(hhObj.hhid) });

    li.appendChild(btnRemove);
    ol.appendChild(li);
    this.state.household.push(hhObj);
  },

  /**
   * Remove specified household member from DOM and from state
   * @param {number} id 
   */
  removeHHMember: function (id) {
    var li = document.querySelector("li[data-hhid='" + id + "']");
    li.parentNode.removeChild(li)
    this.state.household.map(function (mem, i) {
      if ((mem.hhid) === id) {
        HHbuilder.state.household.splice(i, 1);
      }
    })
  },

  /**
   * Read from localStorage and populate household and debug area
   */
  populateHousehold: function () {
    var debug = document.querySelector('pre.debug');

    try {
      var hhString = localStorage.getItem("household");
      debug.innerText = hhString;
      var hhList = JSON.parse(hhString)
      if (hhList.length > 0) {
        hhList.map(function (hhObj) {
          HHbuilder.addHHMember(hhObj);
        })
      }
    } catch (e) {
      debug.innerText = "";
    }
  }

};

// Check whether we're running in the test env (i.e. an iframe)
if (window.self == window.top) {
  HHbuilder.init();
}
