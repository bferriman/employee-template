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
        message: "Employee name: ",
        validate: function(input) {
          if(input === "") {
            return "Employee name is a required field";
          }
          else{
            for(let i = 0; i < input.length; i++) {
              let char = input.charAt(i);
              if(!isLetter(char) && char !== " ") {
                return "Employee name may contain only letters";
              }
            }
            return true;
          }
        }
      },
      {
        name: "id",
        message: "Employee id: ",
        validate: function(input) {
          if(input === "") {
            return "Employee id is a required field";
          }
          else{
            for(let i = 0; i < input.length; i++) {
              if(isNaN(input.charAt(i))){
                return "Employee id may contain only numbers";
              }
            }
            return true;
          }
        }
      },
      {
        name: "email",
        message: "Employee email: ",
        validate: function(input) {
          const patt = /\S+@\S+\.\S+/;
          if(patt.test(input)) {
            return true;
          }
          else if (input === "") {
            return true;
          }
          else {
            return "Not a valid email address";
          }
        }
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

function isLetter(char) {
  return char.toLowerCase() != char.toUpperCase();
}