const inquirer = require("inquirer");
const Employee = require("./employee");
const Manager = require("./manager");
const Engineer = require("./engineer");
const Intern = require("./intern");

class Builder {

  constructor() {
    this.employees = [];
  }

  showMainMenu() {
    // console.log("Welcome to Team Builder!\nFollow the prompts to build out your team and generate an HTML file.");
    inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "Welcome to Team Builder! Follow the prompts to build out your team and generate an HTML file.",
        choices: [
          "Get Started",
          "Quit"
        ]
      }
    ])
    .then( ({ choice }) => {
      if (choice === "Get Started") {
        this.inputEmployee("manager");
      } else {
        this.quit();
      }
    });
  }

  inputEmployee(type) {
    console.log("Inputting employee...");
    inquirer
    .prompt([
      {
        name: "name",
        message: "Employee name: "
      },
      {
        name: "id",
        message: "Employee id: "
      },
      {
        name: "email",
        message: "Employee email: "
      }
    ])
    .then( result => {
      console.log(result);
    });
  }

  quit() {
    console.log("Goodbye");
    process.exit(0);
  }

}

module.exports = Builder;