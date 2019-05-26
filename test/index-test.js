describe("Household Builder", function () {
  beforeEach(function () {
    document.body.innerHTML = window.__html__['test/fixtures/index.html'];
    HHbuilder.init();
  });

  afterEach(function () {
    document.body.innerHTML = '';
  });

  describe("should modify the DOM by adding", function () {
    it("a type to the add button to prevent submission on click", function () {
      const addBtn = document.querySelectorAll('button.add')[0];
      expect(addBtn.type).toBe('button');
    });

    it("a container for validation errors", function () {
      expect(document.querySelectorAll('ul#error-ctr').length).toBe(1);
    });
  });

  describe("should validate inputs", function () {
    beforeEach(function () {
      const inputAge = document.querySelector('input[name=age]');
      inputAge.value = "''";
    })

    it("invalid age and relationship", function () {
      const addBtn = document.querySelector('button.add');
      const inputAge = document.querySelector('input[name=age]');
      const errorCtr = document.getElementById('error-ctr');

      inputAge.value = "declan";
      addBtn.click();

      expect(HHbuilder.state.errors.age).not.toBe(null);
      expect(HHbuilder.state.errors.rel).not.toBe(null);
      expect(errorCtr.childNodes.length).toEqual(2);
    });

    it("valid age and relationship", function () {
      const addBtn = document.querySelector('button.add');
      const inputAge = document.querySelector('input[name=age]');
      const selectRel = document.querySelector('select[name=rel]');
      const errorCtr = document.getElementById('error-ctr');
      const hhList = document.querySelector('ol.household');

      inputAge.value = "10";
      selectRel.value = "self";
      addBtn.click();

      expect(HHbuilder.state.errors.age).toBe('');
      expect(HHbuilder.state.errors.rel).toBe('');
      expect(errorCtr.childNodes.length).toEqual(0);
      expect(hhList.childNodes.length).toEqual(1);
      addBtn.click();
      expect(hhList.childNodes.length).toEqual(2);
    });
  });

  describe("should log JSON to a debug area on submit", function () {
    beforeEach(function () {
      const addBtn = document.querySelector('button.add');
      const inputAge = document.querySelector('input[name=age]');
      const selectRel = document.querySelector('select[name=rel]');

      inputAge.value = "10";
      selectRel.value = "self";
      addBtn.click();
    });

    it("logs JSON", function () {
      const submitBtn = document.querySelector('button[type=submit]');
      const debug = document.querySelector('pre.debug');
      submitBtn.click();
      expect(JSON.parse(debug.textContent).length).toEqual(1);
    });
  });

  describe("should allow users to delete household members", function () {
    beforeEach(function () {
      const addBtn = document.querySelector('button.add');
      const inputAge = document.querySelector('input[name=age]');
      const selectRel = document.querySelector('select[name=rel]');

      inputAge.value = "10";
      selectRel.value = "self";
      addBtn.click();
    });

    it('delete a household member', function () {
      const hhList = document.querySelector('ol.household');
      const hhMembers = hhList.childNodes;

      expect(hhMembers.length).toEqual(1);
      hhMembers[0].getElementsByTagName('button')[0].click();
      expect(hhMembers.length).toEqual(0);
    })
  })
});
