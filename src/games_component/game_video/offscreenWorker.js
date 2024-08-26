let offCanvas;
let ctx;

onmessage = function(event) {

    switch (event.data.cmd) {        
        case "init":
            offCanvas =  event.data.canvas;
            ctx = offCanvas.getContext('2d');
            break;
        case "process":
            const imageBitmap = event.data.imageBitmap;
            const width = event.data.width;
            const height = event.data.height;
            ctx.clearRect(0, 0, offCanvas.width, offCanvas.height);
            //ctx.drawImage(imageBitmap, 0, 0, offCanvas.width, offCanvas.height);

            ctx.drawImage(imageBitmap, 0, 0, offCanvas.width, offCanvas.height);
            break;


        default:
            break;
    }
};