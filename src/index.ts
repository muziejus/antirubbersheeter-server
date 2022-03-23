import dotenv from "dotenv";
import fs from "fs";
import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import tile from "./tiler";
import parseCsv from "./csv";
import { randomUUID } from "crypto";

const app = express();

dotenv.config();

const port = process.env.PORT;

app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024 * 1024, // 10MB max file(s) size
    },
    safeFileNames: true,
    preserveExtension: true,
  })
);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static("public"));

app.post("/upload", async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      let tileInfo, dataInfo, maxZoom;
      const uuid = randomUUID();
      let map = req.files.map;
      let csv = req.files.csv;
      const path = `public/uploads/${uuid}`;

      if (map) {
        await map.mv([path, map.name].join("/"));
        tileInfo = await tile(path, map.name, {
          background: "hsla(0, 100%, 50%, 0)",
          container: "fs",
          layout: "google",
        });
        const levels = fs.readdirSync(`${path}/tiles/`).length - 1;
        maxZoom = levels;
      }

      if (csv) {
        await csv.mv([path, "data.csv"].join("/"));
        dataInfo = parseCsv(path);
      }

      if (!csv && !map) {
        console.log(req.files);
        console.log(req.body);
      }

      const message = {
        status: true,
        message: "File is uploaded",
        data: {
          uuid,
          path,
          map: {
            name: map?.name,
            mimetype: map?.mimetype,
            size: map?.size,
            maxZoom,
          },
          csv: {
            name: csv ? "data.csv" : "",
            mimetype: csv?.mimetype,
            size: csv?.size,
          },
          tileInfo,
          dataInfo,
        },
      };

      // console.log(message);
      res.send(message);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}.`);
});
