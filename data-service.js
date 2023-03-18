const Sequlize = require("sequelize");

const sequelize = new Sequlize("badholmr", "badholmr", "KYGR3A_lTQDYduAk0Y6OyrelQlQjBURm", {
  host: "john.db.elephantsql.com",
  dialect: "postgres",
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
  query: { row: true },
});

const Student = sequelize.define("Student", {
  studentId: {
    type: Sequlize.STRING,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: Sequlize.STRING,
  lastName: Sequlize.STRING,
  email: Sequlize.STRING,
  phone: Sequlize.STRING,
  addressStreet: Sequlize.STRING,
  addressCity: Sequlize.STRING,
  addressState: Sequlize.STRING,
  adressPostal: Sequlize.STRING,
  isInternationalStudent: Sequlize.BOOLEAN,
  expectedCredentials: Sequlize.STRING,
  status: Sequlize.STRING,
  registrationDate: Sequlize.STRING,
});

const Image = sequelize.define("Image", {
  imageId: {
    type: Sequlize.STRING,
    primaryKey: true,
  },
  imageUrl: Sequlize.STRING,
  version: Sequlize.INTEGER,
  width: Sequlize.INTEGER,
  height: Sequlize.INTEGER,
  format: Sequlize.STRING,
  resourceType: Sequlize.STRING,
  updatedAt: Sequlize.DATE,
  originalFileName: Sequlize.STRING,
  mimeType: Sequlize.STRING,
});

const Program = sequelize.define("Program", {
  programCode: {
    type: Sequlize.STRING,
    primaryKey: true,
  },
  programName: Sequlize.STRING,
});

Program.hasMany(Student, { foreignKey: "program" }); //ensures that the Student got a foreign key called program that deals with Program table

module.exports.initialize = function () {
  let error, sync;
  try {
    sync = sequelize.sync();
  } catch (e) {
    error = e;
  }

  return new Promise((resolve, reject) => {
    if (!error) resolve(sync);
    else reject("Unable to sync the database");
  });
};

module.exports.addStudent = function (studentData) {
  return new Promise((resolve, reject) => {
    reject();
  });
};

module.exports.getAllStudents = async function () {
  let students, error;
  try {
    students = await Student.findAll();
  } catch (e) {
    error = e;
  }
  return new Promise((resolve, reject) => {
    if (!error) resolve(students);
    else reject("no results returned");
  });
};

module.exports.getStudentById = function (id) {
  return new Promise((resolve, reject) => {
    reject();
  });
};

module.exports.updateStudent = function (studentData) {
  return new Promise((resolve, reject) => {
    reject();
  });
};

module.exports.getStudentsByStatus = function (status) {
  return new Promise((resolve, reject) => {
    reject();
  });
};

module.exports.getStudentsByProgramCode = function (program) {
  return new Promise((resolve, reject) => {
    reject();
  });
};

module.exports.getStudentsByExpectedCredential = function (credential) {
  return new Promise((resolve, reject) => {
    reject();
  });
};

module.exports.getInternationalStudents = function () {
  return new Promise((resolve, reject) => {
    reject();
  });
};

module.exports.getPrograms = function () {
  return new Promise((resolve, reject) => {
    reject();
  });
};

module.exports.addImage = function (imageUrl) {
  return new Promise((resolve, reject) => {
    reject();
  });
};

module.exports.getImages = function () {
  return new Promise((resolve, reject) => {
    reject();
  });
};
