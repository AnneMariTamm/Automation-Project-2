describe("Issue details editing", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Should update type, status, assignees, reporter, priority successfully", () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click("bottomRight");
      cy.get('[data-testid="select-option:Story"]')
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="select:type"]').should("contain", "Story");

      cy.get('[data-testid="select:status"]').click("bottomRight");
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should("have.text", "Done");

      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should("contain", "Baby Yoda");
      cy.get('[data-testid="select:assignees"]').should(
        "contain",
        "Lord Gaben"
      );

      cy.get('[data-testid="select:reporter"]').click("bottomRight");
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should(
        "have.text",
        "Pickle Rick"
      );

      cy.get('[data-testid="select:priority"]').click("bottomRight");
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should("have.text", "Medium");
    });
  });

  it("Should update title, description successfully", () => {
    const title = "TEST_TITLE";
    const description = "TEST_DESCRIPTION";

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get(".ql-snow").click().should("not.exist");

      cy.get(".ql-editor").clear().type(description);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('textarea[placeholder="Short summary"]').should(
        "have.text",
        title
      );
      cy.get(".ql-snow").should("have.text", description);
    });
  });

  it("Should validate values in Priority dropdown", () => {
    // PUUDU!!!!!!! Assert that the array created has the same length as your predefined number if everything is done correctly.
    //Expected result: You have a test that validates values in issue priorities. The finished array must have five elements: [“Lowest“, “Low“, “Medium”, “High“, “Highest”]
    priorityArray.push(defaultPriorityValue);
    cy.log('Added value: "High", Array length: "1"');
    openPriorityDropdown();
    cy.contains(priorities.at(0)).click();
    priorityArray.push(priorities.at(0));
    cy.log('Added value: "Lowest", Array length: "2"');
    openPriorityDropdown();
    cy.contains(priorities.at(1)).click();
    priorityArray.push(priorities.at(1));
    cy.log('Added value: "Low", Array length: "3"');
    openPriorityDropdown();
    cy.contains(priorities.at(2)).click();
    priorityArray.push(priorities.at(2));
    cy.log('Added value: "Medium", Array length: "4"');
    openPriorityDropdown();
    cy.contains(priorities.at(4)).click();
    priorityArray.push(priorities.at(4));
    cy.log('Added value: "Highest", Array length: "5"');
  });

  it.only("Reporters name should only have characters", () => {
    //Access the reporter name (find the proper selector) and invoke its text value.
 
    //Assert that it has only characters in it (no numbers, no special characters, etc.). Regex to be used: /^[A-Za-z\s]$/

    //Expected result: You will have a test that validates reporter matching defined regular expression
  });
  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
  const expectedLength = "5";
  let priorityArray = [];
  const priorities = ["Lowest", "Low", "Medium", "High", "Highest"];
  const defaultPriorityValue = "High";
  function openPriorityDropdown() {
    cy.get('[data-testid="select:priority"]').click();
  }
  const getReportersName = () => cy.get('[data-testid="select:reporter"]');
  const regex = /^[A-Za-z\s]$/;
});
