import fs from "fs";
import { getPixels, savePixels } from "ndarray-pixels";
import { matrixToList, ndarrayToMatrix } from "./Utils/NdArrayConverter";


type ImageTypes = "image/png" | "image/jpeg" | "image/gif";
var imagesPaths: { path: string; type: ImageTypes; name: string }[] = [
  {
    type: "image/jpeg",
    path: "./images/low.jpg",
    name: "low.jpg",
  }
];

(async () => {
  //Le arquivo da imagem
  for (let imagePath of imagesPaths) {
    var file = fs.readFileSync(imagePath.path);

    //Retorna os pixeis da imagem no formato matriz
    var pixels = await getPixels(file, imagePath.type);


    var matrix = ndarrayToMatrix(pixels);


    //Aplica o filtro
    matrix.edgeDetection(true);


    //Conversões para ndarray
    var ndarray = matrixToList(matrix);


    //Salva os pixels alterados para um formato descrito
    const saved = await savePixels(ndarray, imagePath.type);

    fs.writeFileSync("./images/edge/"+ "sobel_" + imagePath.name, saved);

  }
})();
