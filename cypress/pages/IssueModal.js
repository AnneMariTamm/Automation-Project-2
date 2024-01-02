class IssueModal {
  constructor() {
    this.submitButton = 'button[type="submit"]';
    this.issueModal = '[data-testid="modal:issue-create"]';
    this.issueDetailModal = '[data-testid="modal:issue-details"]';
    this.title = 'input[name="title"]';
    this.issueType = '[data-testid="select:type"]';
    this.descriptionField = ".ql-editor";
    this.assignee = '[data-testid="select:userIds"]';
    this.backlogList = '[data-testid="board-list:backlog"]';
    this.issuesList = '[data-testid="list-issue"]';
    this.deleteButton = '[data-testid="icon:trash"]';
    this.deleteButtonName = "Delete issue";
    this.cancelDeletionButtonName = "Cancel";
    this.confirmationPopup = '[data-testid="modal:confirm"]';
    this.closeDetailModalButton = '[data-testid="icon:close"]';
    this.commentFieldName = "Add a comment...";
    this.commentTextArea = 'textarea[placeholder="Add a comment..."]';
    this.commentSaveButtonName = "Save";
    this.issueComments = '[data-testid="issue-comment"]';
    this.commentEditButtonName = "Edit";
    this.commentEditSaveButtonName = "Save";
    this.commentDeleteButtonName = "Delete";
    this.commentDeleteConfirmationPopup = '[data-testid="modal:confirm"]';
    this.commentDeleteConfirmationButtonName = "Delete comment";
  }

  getIssueModal() {
    return cy.get(this.issueModal);
  }

  getIssueDetailModal() {
    return cy.get(this.issueDetailModal);
  }

  selectIssueType(issueType) {
    cy.get(this.issueType).click("bottomRight");
    cy.get(`[data-testid="select-option:${issueType}"]`)
      .trigger("mouseover")
      .trigger("click");
  }

  selectAssignee(assigneeName) {
    cy.get(this.assignee).click("bottomRight");
    cy.get(`[data-testid="select-option:${assigneeName}"]`).click();
  }

  editTitle(title) {
    cy.get(this.title).debounced("type", title);
  }

  editDescription(description) {
    cy.get(this.descriptionField).type(description);
  }

  createIssue(issueDetails) {
    this.getIssueModal().within(() => {
      this.selectIssueType(issueDetails.issue);
      this.editDescription(issueDetails.description);
      this.editTitle(issueDetails.title);
      this.selectAssignee(issueDetails.assignee);
      cy.get(this.submitButton).click();
    });
  }

  ensureIssueIsCreated(expectedAmountIssues, issueDetails) {
    cy.get(this.issueModal).should("not.exist");
    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");

    cy.get(this.backlogList)
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.get(this.issuesList)
          .should("have.length", expectedAmountIssues)
          .first()
          .find("p")
          .contains(issueDetails.title);
        cy.get(`[data-testid="avatar:${issueDetails.assignee}"]`).should(
          "be.visible"
        );
      });
  }

  ensureIssueIsVisibleOnBoard(issueTitle) {
    cy.get(this.issueDetailModal).should("not.exist");
    cy.reload();
    cy.contains(issueTitle).should("be.visible");
  }

  ensureIssueIsNotVisibleOnBoard(issueTitle) {
    cy.get(this.issueDetailModal).should("not.exist");
    cy.reload();
    cy.contains(issueTitle).should("not.exist");
  }

  validateIssueVisibilityState(issueTitle, isVisible = true) {
    cy.get(this.issueDetailModal).should("not.exist");
    cy.reload();
    cy.get(this.backlogList).should("be.visible");
    if (isVisible) cy.contains(issueTitle).should("be.visible");
    if (!isVisible) cy.contains(issueTitle).should("not.exist");
  }

  clickDeleteButton() {
    cy.get(this.deleteButton).click();
    cy.get(this.confirmationPopup).should("be.visible");
  }

  confirmDeletion() {
    cy.get(this.confirmationPopup).within(() => {
      cy.contains(this.deleteButtonName).click();
    });
    cy.get(this.confirmationPopup).should("not.exist");
    cy.get(this.backlogList).should("be.visible");
  }

  cancelDeletion() {
    cy.get(this.confirmationPopup).within(() => {
      cy.contains(this.cancelDeletionButtonName).click();
    });
    cy.get(this.confirmationPopup).should("not.exist");
    cy.get(this.issueDetailModal).should("be.visible");
  }

  closeDetailModal() {
    cy.get(this.issueDetailModal)
      .get(this.closeDetailModalButton)
      .first()
      .click();
    cy.get(this.issueDetailModal).should("not.exist");
  }

  addComment(comment) {
    cy.contains(this.commentFieldName).click();
    cy.get(this.commentTextArea).type(comment);
  }
  createComment(comment) {
    cy.get(this.issueDetailModal).within(() => {
      this.addComment(comment);
      cy.contains(this.commentSaveButtonName).click();
    });
  }
  ensureCommentIsVisibleOnDetailModal(comment) {
    cy.contains(this.commentSaveButtonName).should("not.exist");
    cy.contains(this.commentFieldName).should("be.visible");
    cy.get(this.issueComments).should("contain", comment);
  }

  getIssueComments() {
    return cy.get(this.issueComments);
  }
  clickEditCommentButton(comment) {
    cy.get(this.issueDetailModal).within(() => {
      cy.get(this.issueComments)
        .first()
        .should("contain", comment)
        .contains(this.commentEditButtonName)
        .click();
    });
  }
  editComment(comment, editedComment) {
    cy.get(this.commentTextArea)
      .should("contain", comment)
      .clear()
      .type(editedComment);
    cy.contains(this.commentEditSaveButtonName).click();
  }
  ensureEditedCommentIsVisibleOnDetailModal(editedComment) {
    cy.contains(this.commentEditSaveButtonName).should("not.exist");
    cy.get(this.issueComments).should("contain", editedComment);
  }

  clickCommentDeleteButton(editedComment) {
    cy.get(this.issueDetailModal).within(() => {
      cy.get(this.issueComments)
        .first()
        .should("contain", editedComment)
        .contains(this.commentDeleteButtonName)
        .click();
    });
    cy.get(this.commentDeleteConfirmationPopup)
      .should("be.visible")
      .should("contain", "Are you sure you want to delete this comment?");
  }

  confirmCommentDeletion() {
    cy.get(this.commentDeleteConfirmationPopup).within(() => {
      cy.contains(this.commentDeleteConfirmationButtonName).click();
    });
    cy.get(this.commentDeleteConfirmationPopup).should("not.exist");
    cy.get(this.issueDetailModal).should("be.visible");
  }

  ensureCommentIsNotVisibleOnDetailModal(editedComment) {
    cy.get(this.issueDetailModal).within(() => {
      cy.contains(editedComment).should("not.exist");
    });
  }
}

export default new IssueModal();
