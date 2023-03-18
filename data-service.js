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

module.exports.addStudent = async function (studentData) {
  let student, error;
  studentData.isInternationalStudent = studentData.isInternationalStudent ? true : false;

  for (const property in studentData) {
    studentData[property] = studentData[property] === "" ? null : studentData[property];
  }

  try {
    student = await Student.create(studentData);
  } catch (e) {
    error = e;
  }

  return new Promise((resolve, reject) => {
    if (!error) return resolve(student);
    else {
      return reject("unable to create student");
    }
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
    if (!error) return resolve(students);
    else return reject("no results returned");
  });
};

module.exports.getStudentById = async function (id) {
  let students, error;
  try {
    students = await Student.findAll({
      studentId: id,
    });
  } catch (e) {
    error = e;
  }

  return new Promise((resolve, reject) => {
    if (!error) return resolve(students);
    else return reject("no results returned");
  });
};

module.exports.updateStudent = async function (studentData) {
  let error, student;
  studentData.isInternationalStudent = studentData.isInternationalStudent ? true : false;

  for (const property in studentData) {
    studentData[property] = studentData[property] === "" ? null : studentData[property];
  }

  try {
    student = await Student.update(studentData);
  } catch (e) {
    error = e;
  }

  return new Promise((resolve, reject) => {
    if (!error) return resolve(student);
    else return reject("unable to update student");
  });
};

module.exports.getStudentsByStatus = async function (status) {
  let students, error;
  try {
    students = await Student.findAll({
      where: {
        status: status,
      },
    });
  } catch (e) {
    error = e;
  }

  return new Promise((resolve, reject) => {
    if (!error) return resolve(students);
    else return reject("no results returned");
  });
};

module.exports.getStudentsByProgramCode = async function (program) {
  let students, error;
  try {
    students = await Student.findAll({
      program: program,
    });
  } catch (e) {
    error = e;
  }

  return new Promise((resolve, reject) => {
    if (!error) return resolve(students);
    else return reject("no results returned");
  });
};

module.exports.getStudentsByExpectedCredential = async function (credential) {
  let students, error;
  try {
    students = await Student.findAll({
      expectedCredentials: credential,
    });
  } catch (e) {
    error = e;
  }

  return new Promise((resolve, reject) => {
    if (!error) return resolve(students);
    else return reject("no results returned");
  });
};

module.exports.getInternationalStudents = function () {
  return new Promise((resolve, reject) => {
    reject();
  });
};

module.exports.getPrograms = async function () {
  let programs, error;
  try {
    programs = await Program.findAll();
  } catch (e) {
    error = e;
  }

  return new Promise((resolve, reject) => {
    if (!error) return resolve(programs);
    else return reject("no results returned");
  });
};

module.exports.addImage = async function (imageData) {
  let image, error;

  try {
    image = await Image.create(imageData);
  } catch (e) {
    error = e;
  }

  return new Promise((resolve, reject) => {
    if (!error) return resolve(image);
    else {
      return reject("unable to create image");
    }
  });
};

module.exports.getImages = async function () {
  let images, error;

  try {
    images = await Image.findAll();
  } catch (e) {
    error = e;
  }

  return new Promise((resolve, reject) => {
    if (!error) return resolve(images);
    else return reject("no results returned");
  });
};

module.exports.addProgram = async (programData) => {
  let programs, error;
  for (property in programData) {
    programData[property] = programData[property] !== "" ? programData[property] : null;
  }

  try {
    programs = await Program.create(programData);
  } catch (e) {
    error = e;
  }

  return new Promise((resolve, reject) => {
    if (!error) resolve(programs);
    else reject("unable to create program");
  });
};

module.exports.updateProgram = async (programData) => {
  let program, error;

  for (property in programData) {
    programData[property] = programData[property] !== "" ? programData[property] : null;
  }

  try {
    program = await Program.update(programData);
  } catch (e) {
    error = e;
  }

  return new Promise((resolve, reject) => {
    if (!error) resolve(program);
    else reject("unable to update program");
  });
};

module.exports.getProgramByCode = async (pcode) => {
  let program, error;

  try {
    program = await Program.findAll({
      programCode: pcode,
    });
  } catch (e) {
    error = e;
  }

  return new Promise((resolve, reject) => {
    if (!error) resolve(program);
    else reject("no results returned");
  });
};

module.exports.deleteProgramByCode = async (pcode) => {
  let error;

  try {
    await Program.destroy({
      where: {
        programCode: pcode,
      },
    });
  } catch (e) {
    e = error;
  }

  return new Promise((resolve, reject) => {
    if (!error) resolve("destroyed");
    else reject("was rejected");
  });
};
