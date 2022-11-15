import fs from "fs";
import ndarray, { NdArray } from "ndarray";
import { getPixels, savePixels } from "ndarray-pixels";
import { matrixToList, ndarrayToMatrix } from "./Utils/NdArrayConverter";

// const convertNumArrayToHexString = (list) => {
//   var result = [];
//   for (var i = 0; i < list.length; i++) {
//     //@ts-ignore
//     result.push(list[i].toString(16));
//   }
//   return result.join(",");
// };

type ImageTypes = "image/png" | "image/jpeg" | "image/gif";
var imagesPaths: { path: string; type: ImageTypes; name: string }[] = [
  {
    type: "image/png",
    path: "./images/aquário.png",
    name: "aquario.png",
  },
  {
    path: "./images/fotografando.jfif",
    type: "image/jpeg",
    name: "fotografando.jfif",
  },
  { path: "./images/gato.png", type: "image/png", name: "gato.png" },
  { path: "./images/image_lenagray.png", type: "image/png", name: "lena.png" },
  { path: "./images/lago.png", type: "image/png", name: "lago.png" },
  { path: "./images/litoral.png", type: "image/png", name: "litoral.png" },
  { path: "./images/low.jpg", type: "image/jpeg", name: "low.jpg" },
  { path: "./images/objetos.jfif", type: "image/jpeg", name: "objetos.jfif" },
  { path: "./images/pose.jfif", type: "image/jpeg", name: "pose.jfif" },
  { path: "./images/urso.png", type: "image/png", name: "urso.png" },
];

(async () => {
  //Le arquivo da imagem
  for (let imagePath of imagesPaths) {
    var file = fs.readFileSync(imagePath.path);

    //Retorna os pixeis da imagem no formato matriz
    var pixels = await getPixels(file, imagePath.type);
    var matrix3x3v = ndarrayToMatrix(pixels);
    var matrix3x3h = matrix3x3v.clone();
    var matrix5x5v = matrix3x3v.clone();
    var matrix5x5h = matrix3x3v.clone();
    var matrix7x7v = matrix3x3v.clone();
    var matrix7x7h = matrix3x3v.clone();

    //Aplica o filtro
    matrix3x3v.applyMedianTransformation("3x3", "vertical", "all");
    matrix3x3h.applyMedianTransformation("3x3", "horizontal", "all");
    matrix5x5v.applyMedianTransformation("5x5", "vertical", "all");
    matrix5x5h.applyMedianTransformation("5x5", "horizontal", "all");
    matrix7x7v.applyMedianTransformation("7x7", "vertical", "all");
    matrix7x7h.applyMedianTransformation("7x7", "horizontal", "all");

    //Conversões para ndarray
    var ndarray3x3v = matrixToList(matrix3x3v);
    var ndarray3x3h = matrixToList(matrix3x3h);
    var ndarray5x5v = matrixToList(matrix5x5v);
    var ndarray5x5h = matrixToList(matrix5x5h);
    var ndarray7x7v = matrixToList(matrix7x7v);
    var ndarray7x7h = matrixToList(matrix7x7h);

    //Salva os pixels alterados para um formato descrito
    const savePixels3x3v = await savePixels(ndarray3x3v, imagePath.type);
    const savePixels3x3h = await savePixels(ndarray3x3h, imagePath.type);
    const savePixels5x5v = await savePixels(ndarray5x5v, imagePath.type);
    const savePixels5x5h = await savePixels(ndarray5x5h, imagePath.type);
    const savePixels7x7v = await savePixels(ndarray7x7v, imagePath.type);
    const savePixels7x7h = await savePixels(ndarray7x7h, imagePath.type);
    fs.writeFileSync("./images/conversions/"+ "3x3v_" + imagePath.name, savePixels3x3v);
    fs.writeFileSync("./images/conversions/"+ "3x3h_"  + imagePath.name, savePixels3x3h);
    fs.writeFileSync("./images/conversions/"+ "5x5v_" + imagePath.name, savePixels5x5v);
    fs.writeFileSync("./images/conversions/"+ "5x5h_" + imagePath.name, savePixels5x5h);
    fs.writeFileSync("./images/conversions/"+ "7x7v_" + imagePath.name, savePixels7x7v);
    fs.writeFileSync("./images/conversions/"+ "7x7h_" + imagePath.name, savePixels7x7h);
  
  }
})();
