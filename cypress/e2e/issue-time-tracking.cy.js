describe("issue time tracking", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.url()
        .should("eq", `${Cypress.env("baseUrl")}project/board`)
        .then((url) => {
          cy.visit(url + "/board");
        });
    });
    it("Should add, update and remove estimation to an issue where no time is added ", () => {
      //Open issue
      cy.contains(existingIssueTitle).click();
      getissueDetailsModal().should("be.visible");
      //***Check that time tracker has no spent time added and (“No Time Logged” label is visible)
      //cy.contains("No time logged").should("be.visible");
      //ADD ESTIMATION
      // Add value 10 to “Original estimate (hours)” field
      cy.get('input[placeholder="Number"]')
        .click()
        .clear()
        .type(addEstimationValue);
      cy.contains("Original Estimate (hours)").click();
      //Close issue detail page
      cy.get('[data-testid="icon:close"]').first().trigger("click");
      //Reopen the same issue to check that original estimation is saved
      cy.contains(existingIssueTitle).click();
      cy.contains("10h estimated").should("be.visible");
  
      //UPDATE ESTIMATION
      //Update estimation value to 20
      cy.get('input[placeholder="Number"]')
        .click()
        .clear()
        .type(updateEstimationValue);
      cy.contains("Original Estimate (hours)").click();
  
      //Close issue detail page
      cy.get('[data-testid="icon:close"]').first().trigger("click");
      //Reopen the same issue to check that original estimation is saved
      cy.contains(existingIssueTitle).click();
      cy.contains("20h estimated").should("be.visible");
      //REMOVE ESTIMATION
      //Removes value from the field “Original estimate (hours)”
      cy.get('input[placeholder="Number"]').click().clear();
      cy.contains("Original Estimate (hours)").click();
      //Close issue detail page
      cy.get('[data-testid="icon:close"]').first().trigger("click");
      //Reopen the same issue to check that time tracker does not have estimation
      cy.contains(existingIssueTitle).click();
      //cy.contains("20h estimated").should("not.exsist");
    });
    it("..", () => {
      //createNewIssue();
      //    cy.get('[data-testid="board-list:backlog"]')
      //    .should("contain", issueTitle)
      //  .click();
      //  //cy.contains(issueTitle).click();
      //getissueDetailsModal().should("be.visible");
    });
  
    const getissueDetailsModal = () =>
      cy.get('[data-testid="modal:issue-details"]');
    const existingIssueTitle = "This is an issue of type: Task.";
    const issueTitle = "time tracking title";
    const issueDescription = "time tracking description";
    function createNewIssue() {
      cy.get('[data-testid="icon:plus"]').click();
      cy.get('[data-testid="modal:issue-create"]').within(() => {
        cy.get('[data-testid="select:type"]').click();
        cy.get('[data-testid="icon:task"]').trigger("click");
        cy.get(".ql-editor").click().type(issueDescription);
        cy.get('[name="title"]').click().type(issueTitle);
        cy.get('[data-testid="select:userIds"]').click();
        cy.get('[data-testid="select-option:Baby Yoda"]').trigger("click");
        cy.get('[data-testid="select:priority"]').click();
        cy.get('[data-testid="select-option:Low"]').trigger("click");
        cy.get('button[type="submit"]').click();
      });
      cy.get('[data-testid="modal:issue-create"]').should("not.exist");
      cy.contains("Issue has been successfully created.").should("be.visible");
      cy.reload();
      cy.contains("Issue has been successfully created.").should("not.exist");
    }
    const addEstimationValue = "10";
    const updateEstimationValue = "20";
  });