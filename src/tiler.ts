import sharp from "sharp";

export default async function tile(path: string, image: string, options: sharp.TileOptions) {
  console.log(`Path is ${path}`);
  return sharp([path, image].join("/"))
    .png()
    .tile(options)
    .toFile(`${path}/image-out`)
    .then(info => info)
    .catch(error => console.log(error));
}
