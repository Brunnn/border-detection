import ndarray, { NdArray } from 'ndarray'


type maskSize = "3x3" | "5x5" | "7x7";
type channelType = "red" | "green" | "blue" | "alpha";
type direction = "horizontal" | "vertical";
export class NdArrayMatrix{
    channels: number = 0;
    data: Array<Array<Array<number>>> = [];
    height: number = 0;
    width: number = 0;

    clone(): NdArrayMatrix {
        
        var obj2 = JSON.parse(JSON.stringify(this));
        var obj = new NdArrayMatrix();
        obj.channels = obj2.channels;
        obj.data = obj2.data;
        obj.height = obj2.height;
        obj.width = obj2.width;


        return obj;
    }

    getMask(mask: maskSize, x: number, y: number): Array<Array<Array<number>>> {
        var maskedResult: Array<Array<Array<number>>>  = [];
        var maskSize = mask == "3x3" ? 3 : mask == "5x5" ? 5 : 7;

        var i:number;
        var j:number;
        for (i  = x; i < x + maskSize; i++) {
            var row: Array<Array<number>> = [];
            for (j = y; j < y + maskSize; j++) {
                row.push(this.data[i][j]);
            }
            maskedResult.push(row);
        }

        return maskedResult;
    }

    private getMedian(mask: Array<Array<Array<number>>>, channels: channelType ): number {
        var values: Array<number> = [];
        var i:number;
        var j:number;


        for (i = 0; i < mask.length; i++) {
            for (j = 0; j < mask[i].length; j++) {
                values.push(mask[i][j][channels == "red" ? 0 : channels == "green" ? 1 : channels == "blue" ? 2 : 3]);
            }
        }
        values.sort();
        if (values.length % 2 == 0) {
            return (values[values.length / 2] + values[values.length / 2 - 1]) / 2;
        }
        else {
            return values[Math.floor(values.length / 2)];
        }


    }
    applyMedianTransformation(mask: maskSize, direction: direction, channel: channelType | "all"): void {
        var maxCol: number = this.height - (mask == "3x3" ? 3 : mask == "5x5" ? 5 : 7);
        var maxRow: number = this.width - (mask == "3x3" ? 3 : mask == "5x5" ? 5 : 7);
        
        var i:number;
        var j:number;
        
        //Apply the median transformation passing through the whole line and then going down one line
        if (direction == "horizontal") {
            for (i = 0; i < maxRow; i++) {
                for (j = 0; j < maxCol; j++) {
                    var maskResult = this.getMask(mask, i, j);
                    var middleX: number, middleY: number;
                    middleX = mask == "3x3" ? i + 1 : mask == "5x5" ? i + 2 : i + 3;
                    middleY = mask == "3x3" ? j + 1 : mask == "5x5" ? j + 2 : j + 3;
                    var median: number = 0;
                    if (channel != "all") {
                        median = this.getMedian(maskResult, channel);
                        this.data[middleX][middleY][channel == "red" ? 0 : channel == "green" ? 1 : channel == "blue" ? 2 : 3] = median;
                    }
                    else{
                        for (var k = 0; k < this.channels; k++) {
                            median = this.getMedian(maskResult, k == 0 ? "red" : k == 1 ? "green" : k == 2 ? "blue" : "alpha");
                            this.data[middleX][middleY][k] = median;
                        }
                    }
                }
            }
        } 
        //Apply the median transformation passing through the whole column and then going to the right one column
        else {
            for (i = 0; i < maxCol; i++) {
                for (j = 0; j < maxRow; j++) {
                    
                    var maskResult = this.getMask(mask, j, i);
                    var middleX: number, middleY: number;
                    middleX = mask == "3x3" ? j + 1 : mask == "5x5" ? j + 2 : j + 3;
                    middleY = mask == "3x3" ? i + 1 : mask == "5x5" ? i + 2 : i + 3;
                    var median: number = 0;
                    if (channel != "all") {
                        median = this.getMedian(maskResult, channel);
                        this.data[middleX][middleY][channel == "red" ? 0 : channel == "green" ? 1 : channel == "blue" ? 2 : 3] = median;
                    }
                    else{
                        for (var k = 0; k < this.channels; k++) {
                       
                                median = this.getMedian(maskResult, k == 0 ? "red" : k == 1 ? "green" : k == 2 ? "blue" : "alpha");
                                this.data[middleX][middleY][k] = median;
                          
                        }
                    }
                }
            }

        }


    }
}


export function ndarrayToMatrix(list: NdArray): NdArrayMatrix {
    var matrix: NdArrayMatrix = new NdArrayMatrix();
    matrix.channels = list.shape[2];
    matrix.height = list.shape[1];
    matrix.width = list.shape[0];
 
    
    for (var i = 0; i < list.shape[0]; i++) {
        //Push the row
        matrix.data.push([]);

        //Iterate through the columns of the i row
        for (var j = 0; j < list.shape[1]; j++) {
            //Push the column
            matrix.data[i].push([]);

            //Iterate through the channels of the i,j pixel
            for (var k = 0; k < list.shape[2]; k++) {
                //Push the channel
                matrix.data[i][j].push(list.get(i, j, k));
            }
        }
    }
    return matrix;
}


export function matrixToList(matrix: NdArrayMatrix): NdArray {

    //transform matrix data to Uint8Array
    var data = new Uint8Array(matrix.width * matrix.height * matrix.channels);
    var index = 0;
    for (var i = 0; i < matrix.width; i++) {
        for (var j = 0; j < matrix.height; j++) {
            for (var k = 0; k < matrix.channels; k++) {
                data[index] = matrix.data[i][j][k];
                index++;
            }
        }
    }

    //create ndarray
    var list = ndarray(data, [matrix.width, matrix.height, matrix.channels]);
    return list;
}



