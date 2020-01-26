const Employee = require("./employee");
const fs = require("fs");

class Engineer extends Employee {

  constructor(name, id, email, github) {
    super(name, id, email);
    this.github = github;
    this.title = "Engineer";
  }

  getGithub() {
    return this.github;
  }

  //read template html file, search and replace tokens with data
  async getHTML() {
    return new Promise( (resolve, reject) => {
      fs.readFile("./templates/engineer.html", "utf8", (err, data) => {
        if (err) {
          return reject(err);
        }
        let result = data.replace(/%name%/g, this.name);
        result = result.replace(/%id%/g, this.id);
        result = result.replace(/%email%/g, this.email);
        result = result.replace(/%github%/g, this.github);
        resolve(result);
      });
    });
  }
}

module.exports = Engineer;