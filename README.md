# leaflet-iiif-rotation

rotation for Leaflet-IIIF[See the demo](https://eustacecheng.github.io/leaflet/iiif-rotation/viewer/test.html)

Requires [Leaflet-IIIF.js](https://github.com/mejackreed/Leaflet-IIIF)

In leaflet-iiif.js line 57-77.
*rotation for 90、180、270 degree


    if(_this.options.rotation == 180){
        minx = _this.x - (xDiff+minx);
        miny = _this.y - (yDiff+miny);   
    }else if(_this.options.rotation == 90){
        t = minx;
        minx = miny;
        miny = t;       
        t = xDiff;
        xDiff = yDiff;
        yDiff = t;
        miny = _this.x - (yDiff+miny);
    }else if(_this.options.rotation == 270){
        t = minx;
        minx = miny;
        miny = t; 
        t = xDiff;
        xDiff = yDiff;
        yDiff = t;
        minx = _this.y - (xDiff+minx);         
    }

-中研院實習部分內容
