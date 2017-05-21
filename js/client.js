var imageInput = document.getElementById('file-input');
    imageInput.addEventListener('change', handleImage, false);

var canvas = document.getElementById('canvas-img');
var ctx =  canvas.getContext && canvas.getContext('2d');

var mosaic =  document.getElementById('mosaic'); 
   
 function handleImage(e){
		
		//	create FileReader
		let reader = new FileReader();
		
		// Run function on load
		reader.onload = (event) => {
            
			let img = new Image();
                img.onload = (e) => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img,0,0);

                    // process to generate the photo mosaic from loaded image
                    process();
                }
                // prevew the loaded image
                img.src = event.target.result;   
		};
        
		reader.readAsDataURL(e.target.files[0]);
	}
  
 function process() {
      
      let numX = Math.floor(canvas.width / TILE_WIDTH); // number of tiles in rows
      let numY = Math.floor(canvas.height / TILE_HEIGHT); // number of rows
          mosaic.style.width = `${numX * TILE_WIDTH}px`; // set the width of mosaic by tiles number

     for (let i = 0; i < numY; i++) {
         
         let rowColors = []; // create array of colors in row
         
              for (let j = 0; j < numX; j++) {
                     // run each taile coords 
                  let x = j * TILE_WIDTH,
                      y = i * TILE_HEIGHT;
                      
                      let imageData = ctx.getImageData(x, y, TILE_WIDTH, TILE_HEIGHT); // save taile data
                      let averageColor = getAverageColor(imageData); // get it's average color
    
                        rowColors.push(`/color/${averageColor}`); // and add to array
             
              }
              
              drawRow(rowColors); // draw row 
     }
    
}


function getcolorImage(url){
    
    return new Promise((resolve, reject) => {
        
        let img = new Image();
        
            img.onload = () => { resolve(url) }
            img.onerror = () => { reject(url) }
            img.src = url;
    })
}


function drawRow(colors){

        let colorspromises = colors.map(getcolorImage); // call getImage on each array element and return array of promises
 
    Promise.all(colorspromises).then((urls) => {
        
        for (let a = 0; a < urls.length; a++){
            
            let colorImg = document.createElement('img');
                colorImg.setAttribute('src', urls[a]);
                colorImg.width = TILE_WIDTH;
                colorImg.height = TILE_HEIGHT;
            if(a == 0) colorImg.className = "group"; //add css class to floating images in order to breck rows
            mosaic.appendChild(colorImg);
        }
        
    }).catch((urls) => {
        console.log("Error fetching some images: " + urls);
    })
}
    
       

 function getAverageColor(imageData) {

        let length = imageData.data.length,
            blockSize = 1, //  visit every pixel
            i = 0,
            rgb = {r:0, g:0, b:0},
            count = 0;

        while ((i += blockSize * 4) < length) {
            ++count;
            rgb.r += imageData.data[i];
            rgb.g += imageData.data[i+1];
            rgb.b += imageData.data[i+2];
        }

        rgb.r = Math.floor(rgb.r/count);
        rgb.g = Math.floor(rgb.g/count);
        rgb.b = Math.floor(rgb.b/count);


        return ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1); // return colors in hex

    }

   


