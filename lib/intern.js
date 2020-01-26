const Employee = require("./employee");
const fs = require("fs");

class Intern extends Employee {

  constructor(name, id, email, school) {
    super(name, id, email);
    this.school = school;
    this.title = "Intern";
  }

  getSchool() {
    return this.school;
  }

  //read template html file, search and replace tokens with data
  async getHTML() {
    return new Promise( (resolve, reject) => {
      fs.readFile("./templates/intern.html", "utf8", (err, data) => {
        if (err) {
          return reject(err);
        }
        let result = data.replace(/%name%/g, this.name);
        result = result.replace(/%id%/g, this.id);
        result = result.replace(/%email%/g, this.email);
        result = result.replace(/%school%/g, this.school);
        resolve(result);
      });
    });
  }

}

module.exports = Intern;