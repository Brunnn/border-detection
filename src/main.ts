import fs from "fs";
import { getPixels, savePixels } from "ndarray-pixels";
import { matrixToList, ndarrayToMatrix } from "./Utils/NdArrayConverter";


type ImageTypes = "image/png" | "image/jpeg" | "image/gif";
var imagesPaths: { path: string; type: ImageTypes; name: string }[] = [
  {
    type: "image/jpeg",
    path: "./images/input.jpg",
    name: "input.jpg",
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
    matrix.rotate90degrees();
    matrix.rotate90degrees();
    
 
    

    //Conversões para ndarray
    var ndarray = matrixToList(matrix);


    //Salva os pixels alterados para um formato descrito
    const saved = await savePixels(ndarray, imagePath.type);

    fs.writeFileSync("./images/rotations_mirrors/"+ "rotated180_" + imagePath.name, saved);

  }
})();
