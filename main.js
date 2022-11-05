var imageField = document.getElementById('imagefield')
var image;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
const list = document.getElementById('list');
const filters = [greyScale, addNoise, simplifyColours, inverseColour, fir, box_blur, flip];
const range = document.getElementById('range');
var intensity = 1;
var width, height;
/**
 * Handle submit events
 * @param  {Event} event The event object
 */
 function handleSubmit (event) {

    let img = new Image();
    img.onload = function() {
        canvas.width = this.width;
        canvas.height = this.height;
        width = this.width;
        height = this.height;
        imageField.src = URL.createObjectURL(event.target.files[0]);  
        filter(filters[list.value]);
    };

    imageField.src = URL.createObjectURL(event.target.files[0]);    
    img.src = URL.createObjectURL(event.target.files[0]);
}
/**
 * Alters the image
 * @param {function} transformation The function which is applied to every pixil
 */
function filter(transformation) {
    ctx.drawImage(imageField, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    intensity = parseInt(range.value);
    const newData = new Uint8ClampedArray(data.length);
    console.log(newData)
    for (let i = 0; i < data.length; i += 4) {    
        transformation(newData, data, i)
    }
    for (let i = 0; i < data.length; i+=4) {
        data[i]   = newData[i];
        data[i+1] = newData[i+1];
        data[i+2] = newData[i+2];
    }
    const newImageData = new ImageData(newData, imageData.width, imageData.height)
    console.log(newImageData, imageData.width)

    ctx.putImageData(imageData, 0, 0);
    //ctx.putImageData(newImageData, 0, 0);

    return newImageData
}


function simplifyColours(newData, data, i) {
    newData[i] = data[i]- data[i]%intensity;
    newData[i+1] = data[i+1]- data[i+1]%intensity;
    newData[i+2] = data[i+2]- data[i+2]%intensity;
}
function addNoise(newData, data, i) {
    newData[i]   =   data[i] + Math.random()*intensity - intensity/2;
    newData[i+1] = data[i+1] + Math.random()*intensity - intensity/2;
    newData[i+2] = data[i+2] + Math.random()*intensity - intensity/2;
}
function greyScale(newData, data, i) {
    average = (data[i] + data[i] + data[i+2])/3
    newData[i] = average;
    newData[i+1]=average;
    newData[i+2]=average;
}
function inverseColour(newData, data, i) {
    newData[i] = 255-data[i];
    newData[i+1] = 255-data[i+1];
    newData[i+2] = 255-data[i+2];
}
function fir(newData, data, i) {
    var w = width*2;

    let r = (data[i] + data[i+w] + data[i-w] + data[i+1] + data[i-1])/5;
    let g = (data[i+1] + data[i+w+1] + data[i-w] + data[i+2] + data[i])/5;
    let b = (data[i+2] + data[i+w+2] + data[i-w+2] + data[i+3] + data[i+1])/5;
    newData[i]=r;
    newData[i+1]=g;
    newData[i+2]=b;

}
var blur_intensity = 2;
var blur_division = (2*blur_intensity+1)**2
function box_blur(newData, data, i) {
    var w = width*4;
    let r = 0, g = 0, b = 0;
    for (let y = -blur_intensity; y <= blur_intensity; y++) {
        for (let x = -blur_intensity; x <= blur_intensity; x++) {
            r += data[i-x*4+y*w];
            g += data[i-x*4+y*w+1];
            b += data[i-x*4+y*w+2];
        }
    }
    r/=blur_division
    g/=blur_division
    b/=blur_division
    // let r = (data[i+w]+data[i-w]+data[i])/3//(data[i-4] + data[i+4] + data[i+w] + data[i-w])/4;
    // let g = (data[i+w+1]+data[i-w+1]+data[i+1])/3//(data[i-3] + data[i+5] + data[i+w+1] + data[i-w+1])/4;
    // let b = (data[i+w+2]+data[i-w+1]+data[i+2])/3//(data[i-2] + data[i+6] + data[i+w+2] + data[i-w+2])/4;

    newData[i] = r;
    newData[i+1] = g;
    newData[i+2] = b;

}
function flip(newData, data, i) {
    newData[i]   = data[data.length -i];
    newData[i+1] = data[data.length -i+1];
    newData[i+2] = data[data.length -i+2];
}
