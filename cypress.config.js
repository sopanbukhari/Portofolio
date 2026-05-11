const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "login.cy.js",
    supportFile: false,
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
  },
});