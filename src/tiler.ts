import sharp from "sharp";

export default async function tile(path: string, image: string, options: sharp.TileOptions) {
  return sharp([path, image].join("/"))
    .png()
    .tile(options)
    .toFile(`${path}/tiles`)
    .then(info => info)
    .catch(error => console.log(error));
}
