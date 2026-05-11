describe('SauceDemo E2E Login Test', () => {
  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/')
  })

  it('should login successfully with standard_user', () => {
    cy.get('[data-test="username"]').type('standard_user')
    cy.get('[data-test="password"]').type('secret_sauce')
    cy.get('[data-test="login-button"]').click()

    // Verifikasi sukses login
    cy.url().should('include', '/inventory.html')
    cy.get('.title').should('have.text', 'Products')
  })

  it('should show error for locked_out_user', () => {
    cy.get('[data-test="username"]').type('locked_out_user')
    cy.get('[data-test="password"]').type('secret_sauce')
    cy.get('[data-test="login-button"]').click()

    cy.get('[data-test="error"]').should('be.visible').and('contain', 'Sorry, this user has been locked out.')
  })
})