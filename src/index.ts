import dotenv from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";

const app = express();

dotenv.config();

const port = process.env.PORT;

app.use(fileUpload({
  createParentPath: true,
  limits: {
    fileSize: 10 * 1024 * 1024 * 1024 // 10MB max file(s) size
  },
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get("/", (_, res) => {
  res.send("Hello world!");
});

app.post("/upload-map", async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      res.send({
        status: false,
        message: "No file uploaded"
      });
    } else {
      let map = req.files.map;
      map.mv('./uploads' + map.name);

      res.send({
        status: true,
        message: 'File is uploaded',
        data: {
          name: map.name,
          mimtype: map.mimetype,
          size: map.size,
        }
      })
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// app.post("/", (_, res) => {
//   // Do Sharp stuff.
//   res.download();
// });

app.listen(port, () => {
  console.log(`App is listening on port ${port}.`);
});
