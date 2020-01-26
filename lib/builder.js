const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const Manager = require("./manager");
const Engineer = require("./engineer");
const Intern = require("./intern");

class Builder {

  constructor() {
    this.employees = [];
  }

  //Show menu on app launch
  launch() {
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

  //regular menu shown between actions
  showMenu() {
    inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What next?",
        choices: [
          "Add an Engineer",
          "Add an Intern",
          "Show Current Employee List",
          "Finish and Generate HTML",
          "Quit"
        ]
      }
    ])
    .then( ({ choice }) => {
      switch(choice) {
        case "Add an Engineer":
          this.inputEmployee("engineer");
          break;

        case "Add an Intern":
          this.inputEmployee("intern");
          break;

        case "Show Current Employee List":
          this.displayList();
          break;

        case "Finish and Generate HTML":
          this.buildHTML();
          break;

        case "Quit":
          this.quit();
          break;
      }
    });
  }

  //handles input, validation, and saving of employees
  inputEmployee(type) {
    inquirer
    .prompt([
      {
        name: "name",
        message: `(${type}) Name: `,
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
        message: `(${type}) Id: `,
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
        message: `(${type}) Email: `,
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
      switch(type) {
        case "manager":
          inquirer
          .prompt([
            {
              name: "office",
              message: `(${type}) Office Number: `,
              validate: function(input) {
                return true;
              }
            }
          ])
          .then( res => {
            const manager = new Manager(result.name, result.id, result.email, res.office);
            this.employees.push(manager);
            this.showMenu();
          });
          break;

        case "engineer":
          inquirer
          .prompt([
            {
              name: "github",
              message: `(${type}) GitHub: `,
              validate: function(input) {
                return true;
              }
            }
          ])
          .then( res => {
            const engineer = new Engineer(result.name, result.id, result.email, res.github);
            this.employees.push(engineer);
            this.showMenu();
          });
          break;

        case "intern":
          inquirer
          .prompt([
            {
              name: "school",
              message: `(${type}) School: `,
              validate: function(input) {
                return true;
              }
            }
          ])
          .then( res => {
            const intern = new Intern(result.name, result.id, result.email, res.school);
            this.employees.push(intern);
            this.showMenu();
          });
          break;
      }
    });
  }

  //writes list of employees entered so far to the console
  displayList() {

    let emps = "";
    this.employees.forEach(emp => emps += emp.name + "\n");

    inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: emps,
        choices: [
          "Continue"
        ]
      }
    ])
    .then( () => {
      this.showMenu();
    });
  }

  //builds and writes the final HTML file
  async buildHTML() {
    const readFileAsync = util.promisify(fs.readFile);
    const writeFileAsync = util.promisify(fs.writeFile);
    try{
      let mainHTML = await readFileAsync("./templates/main.html", "utf8");
      const managerHTML = await this.employees[0].getHTML();
      const engineerHTMLarr = [];
      const internHTMLarr = [];
      for(const employee of this.employees) {
        let role = employee.getRole();
        let html = "";
        if(role === "Engineer") {
          html = await employee.getHTML();
          engineerHTMLarr.push(html);
        }
        else if(role === "Intern") {
          html = await employee.getHTML();
          internHTMLarr.push(html);
        }
      }  
   
      const engineerHTML = engineerHTMLarr.join("\n");
      const internHTML = internHTMLarr.join("\n");
      mainHTML = mainHTML.replace(/%manager%/, managerHTML);
      mainHTML = mainHTML.replace(/%engineers%/, engineerHTML);
      mainHTML = mainHTML.replace(/%interns%/, internHTML);
  
      await writeFileAsync("./output/team.html", mainHTML);
    }
    catch(err) {
      console.log(err);
    }
    console.log("File written! Goodbye!");
    process.exit(0);
  }

  //exit the app
  quit() {
    console.log("Goodbye");
    process.exit(0);
  }

}

module.exports = Builder;

//utility function used in input validation
function isLetter(char) {
  return char.toLowerCase() != char.toUpperCase();
}