import sharp from "sharp";

export default async function tile(image: string, options: sharp.TileOptions) {
  return sharp(image)
    .png()
    .tile(options)
    .toFile("uploads/image-out.zip")
    .then(info => info)
    .catch(error => console.log(error));
}
