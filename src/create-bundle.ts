import { Request, Response } from "express";

interface BundleData {
  mapUuid: string;
  csvUuid?: string;
  places: Record<string, string | number>[];
}

const createBundle = (request: Request, response: Response) => {
  console.log(`Got response: ${response.statusCode}`);
  try {
    console.log(request.body);
    const { mapUuid, csvUuid, places } = request.body as BundleData;

    const message = {
      m: mapUuid,
      c: csvUuid,
      p: places,
    };

    response.send(message);
  } catch (error) {
    response.status(500).send(error);
  }
};

export default createBundle;
