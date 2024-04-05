export default function resizeImage(url: string, width: number): Promise<string> {
  return new Promise(async function (resolve, reject) {
    // We create an image to receive the Data URI
    let img = document.createElement('img');

    // When the event "onload" is triggered we can resize the image.
    img.onload = function () {
      // We create a canvas and get its context.
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');

      // We set the dimensions at the wanted size.
      canvas.width = width;
      canvas.height = (width / img.width) * img.height;

      // We resize the image with the canvas method drawImage();
      if (ctx) ctx.drawImage(img, 0, 0, width, (width / img.width) * img.height);

      let dataURI = canvas.toDataURL();

      // This is the return of the Promise
      resolve(dataURI);
    };

    // We put the Data URI in the image's src attribute
    img.src = url;
  });
}
