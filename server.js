const express = require("express");
const path = require("path");
const data = require("./data-service.js");
// const bodyParser = require('body-parser');
const fs = require("fs");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

cloudinary.config({
  cloud_name: "Cloud Name",
  api_key: "API Key",
  api_secret: "API Secret",
  secure: true,
});

app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: {
      navLink: function (url, options) {
        return "<li" + (url == app.locals.activeRoute ? ' class="active" ' : "") + '><a href="' + url + '">' + options.fn(this) + "</a></li>";
      },
      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3) throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      },
    },
  })
);

app.set("view engine", ".hbs");

// Don't setup or pass "{ storage: storage }" to multer() - causing starting error for the app deployed on Cyclic
const upload = multer();

app.use(express.static("public"));

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = route == "/" ? "/" : route.replace(/\/$/, "");
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/images/add", (req, res) => {
  res.render("addImage");
});

app.get("/students/add", (req, res) => {
  res.render("addStudent");
});

app.get("/programs/add", (req, res) => {
  res.render("addProgram");
});

app.get("/images", (req, res) => {
  data
    .getImages()
    .then((data) => {
      data.length > 0 ? res.render("images", { images: data }) : res.render("images", { message: "no results" });
    })
    .catch((err) => {
      res.render("images", { message: "no results" });
    });
});

app.get("/students", (req, res) => {
  if (req.query.status) {
    data
      .getStudentsByStatus(req.query.status)
      .then((data) => {
        data.length > 0 ? res.render("students", { students: data }) : res.render("students", { message: "no results" });
      })
      .catch((err) => {
        res.render("students", { message: "no results" });
      });
  } else if (req.query.program) {
    data
      .getStudentsByProgramCode(req.query.program)
      .then((data) => {
        data.length > 0 ? res.render("students", { students: data }) : res.render("students", { message: "no results" });
      })
      .catch((err) => {
        res.render("students", { message: "no results" });
      });
  } else if (req.query.credential) {
    data
      .getStudentsByExpectedCredential(req.query.credential)
      .then((data) => {
        data.length > 0 ? res.render("students", { students: data }) : res.render("students", { message: "no results" });
      })
      .catch((err) => {
        res.render("students", { message: "no results" });
      });
  } else {
    data
      .getAllStudents()
      .then((data) => {
        data.length > 0 ? res.render("students", { students: data }) : res.render("students", { message: "no results" });
      })
      .catch((err) => {
        res.render("students", { message: "no results" });
      });
  }
});

app.get("/student/:studentId", (req, res) => {
  data
    .getStudentById(req.params.studentId)
    .then((data) => {
      data.length > 0 ? res.render("students", { students: data }) : res.render("students", { message: "no results" });
    })
    .catch((err) => {
      res.render("student", { message: "no results" });
    });
});

app.get("/intlstudents", (req, res) => {
  data.getInternationalStudents().then((data) => {
    res.json(data);
  });
});

app.get("/programs", (req, res) => {
  data
    .getPrograms()
    .then((data) => {
      data.length > 0 ? res.render("programs", { programs: data }) : res.render("programs", { message: "no results" });
    })
    .catch((err) => {
      res.render("programs", { message: "no results" });
    });
});

app.post("/programs/add", (req, res) => {
  data
    .addProgram(req.body)
    .then(() => {
      res.redirect("/programs");
    })
    .catch((err) => {
      res.status(500).send("Error when adding");
    });
});

app.post("/programs/update", (req, res) => {
  data
    .updateProgram(req.body)
    .then(() => {
      res.redirect("/programs");
    })
    .catch((err) => {
      res.status(500).send("Unable to update");
    });
});

app.get("/program/:programCode", (req, res) => {
  data
    .getProgramByCode(req.params.programCode)
    .then((data) => {
      console.log(data[0].dataValues);
      data.length > 0 ? res.render("program", { program: data[0].dataValues }) : res.status(404).send("Program Not Found");
    })
    .catch((err) => {
      res.status(404).send("Program Not Found");
    });
});

app.get("/program/delete/:programCode", (req, res) => {
  data
    .deleteProgramByCode(req.params.programCode)
    .then(() => {
      res.redirect("/programs");
    })
    .catch((err) => {
      res.status(500).send("Unable to remove Program/Program Not Found");
    });
});

app.post("/students/add", (req, res) => {
  data.addStudent(req.body).then(() => {
    res.redirect("/students");
  });
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
  function processForm(imageUrl) {
    console.log(imageUrl);
    // TODO: Process the image url on Cloudinary before redirecting to /images
    data
      .addImage(imageUrl)
      .then((img) => {
        res.redirect("/images");
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }

  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      try {
        let result = await streamUpload(req);
        return result;
      } catch (error) {
        console.log(error);
      }
    }

    upload(req).then((uploaded) => {
      //   console.log(uploaded);
      processForm(uploaded.url);
    });
  } else {
    processForm("");
  }
});

app.post("/student/update", (req, res) => {
  data.updateStudent(req.body).then(() => {
    res.redirect("/students");
  });
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

data
  .initialize()
  .then(function () {
    app.listen(HTTP_PORT, function () {
      console.log("app listening on: " + HTTP_PORT);
    });
  })
  .catch(function (err) {
    console.log("unable to start server: " + err);
  });
