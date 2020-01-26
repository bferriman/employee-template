const Employee = require("./employee");
const fs = require("fs");

class Manager extends Employee {

  constructor(name, id, email, officeNumber) {
    super(name, id, email);
    this.officeNumber = officeNumber;
    this.title = "Manager";
  }

  getOfficeNumber() {
    return this.officeNumber;
  }

  //read template html file, search and replace tokens with data
  async getHTML() {
    return new Promise( (resolve, reject) => {
      fs.readFile("./templates/manager.html", "utf8", (err, data) => {
        if (err) {
          return reject(err);
        }
        let result = data.replace(/%name%/g, this.name);
        result = result.replace(/%id%/g, this.id);
        result = result.replace(/%email%/g, this.email);
        result = result.replace(/%office%/g, this.officeNumber);
        resolve(result);
      });
    });
  }
}

module.exports = Manager;