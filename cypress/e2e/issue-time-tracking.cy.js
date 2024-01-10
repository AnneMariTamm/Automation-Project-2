describe("issue time tracking", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains(issueTitle).click();
        getissueDetailsModal().should("be.visible");
      });
  });
  it("Should add, update and remove time estimation successfully", () => {
    addEstimation();

    ensureAddedEstimationIsSaved();

    updateEstimation();

    ensureUpdatedEstimationIsSaved();

    removeEstimation();

    ensureRemovedEstimationIsSaved();
  });
  it("Should log time and remove logged time successfully", () => {
    //Log time
    openTimeTrackingModal();

    updateTimeSpent();

    updateTimeRemaining();

    clickDoneButton();
    //Check that updated spent time and time remaining are visible in the time tracking section
    getissueDetailsModal().within(() => {
      cy.contains("div", "2h logged").should("be.visible");
      cy.contains("div", "5h remaining").should("be.visible");
      cy.contains("div", "No Time Logged").should("not.exist");
    });

    //Remove logged time
    openTimeTrackingModal();

    removeTimeSpentValue();

    removeTimeRemainingValue();

    clickDoneButton();

    //Check that original estimation is visible and no time is logged
    getissueDetailsModal().within(() => {
      cy.contains("div", "8h estimated").should("be.visible");
      cy.contains("div", "No time logged").should("be.visible");
    });
  });

  const getissueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
  const issueTitle = "This is an issue of type: Task.";
  const getPlaceholderNumber = () => cy.get('input[placeholder="Number"]');

  //Estimation functions
  const addedEstimationValue = "10";
  const addedEstimateRemaining = "10h estimated";
  const updatedEstimationValue = "20";
  const updatedEstimateRemaining = "20h estimated";
  function addEstimation() {
    getPlaceholderNumber().click().clear().type(addedEstimationValue);
    cy.contains("Original Estimate (hours)").click();
    cy.contains(addedEstimateRemaining).should("be.visible");
  }
  function ensureAddedEstimationIsSaved() {
    cy.get('[data-testid="icon:close"]').first().trigger("click");
    cy.contains(issueTitle).click();
    cy.contains(addedEstimateRemaining).should("be.visible");
  }
  function updateEstimation() {
    getPlaceholderNumber().click().clear().type(updatedEstimationValue);
    cy.contains("Original Estimate (hours)").click();
    cy.contains(updatedEstimateRemaining).should("be.visible");
  }
  function ensureUpdatedEstimationIsSaved() {
    cy.get('[data-testid="icon:close"]').first().trigger("click");
    cy.contains(issueTitle).click();
    cy.contains(updatedEstimateRemaining).should("be.visible");
  }
  function removeEstimation() {
    getPlaceholderNumber().click().clear();
    cy.contains("Original Estimate (hours)").click();
    cy.contains(updatedEstimateRemaining).should("not.exist");
  }
  function ensureRemovedEstimationIsSaved() {
    cy.get('[data-testid="icon:close"]').first().trigger("click");
    cy.contains(issueTitle).click();
    cy.contains(updatedEstimateRemaining).should("not.exist");
  }

  //Time logging functions
  const updatedTimeSpentValue = "2";
  const updatedTimeRemainingValue = "5";
  function openTimeTrackingModal() {
    cy.get('[data-testid="icon:stopwatch"]').click();
    cy.get('[data-testid="modal:tracking"]').should("be.visible");
  }
  function updateTimeSpent() {
    cy.get('[data-testid="modal:tracking"]').within(() => {
      cy.get('input[placeholder="Number"]')
        .first()
        .click()
        .clear()
        .type(updatedTimeSpentValue);
    });
  }
  function updateTimeRemaining() {
    cy.get('[data-testid="modal:tracking"]').within(() => {
      cy.get('input[placeholder="Number"]')
        .eq(1)
        .click()
        .clear()
        .type(updatedTimeRemainingValue);
    });
  }
  function removeTimeSpentValue() {
    cy.get('[data-testid="modal:tracking"]').within(() => {
      cy.get('input[placeholder="Number"]').first().click().clear();
    });
  }
  function removeTimeRemainingValue() {
    cy.get('[data-testid="modal:tracking"]').within(() => {
      cy.get('input[placeholder="Number"]').eq(1).click().clear();
    });
  }
  function clickDoneButton() {
    cy.get('[data-testid="modal:tracking"]').within(() => {
      cy.contains("Done").click();
    });
  }
});
