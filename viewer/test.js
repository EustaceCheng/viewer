(function($) {
    $.fn.work = function() {
        var _this = this;
        var colorArray = ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'orange', 'purple', 'red', 'silver', 'teal', 'white', 'yellow','black'];
        var manifest = {};
        var href = window.location.href;
        var manifestarr = URLToArray(href);
		var defaulturl = $('.iiif-viewer').attr('data-url');
        var url = (manifestarr['manifest']==undefined)?defaulturl:manifestarr['manifest'];
		
        _this.attr('id','main');
        var elem = '#main';        
        var map;        
        var viewer_offset;
        var data = GetJSON(url);
        manifest.element = elem; 
        manifest.canvasArray = []; 
        manifest.index = 4; 
        manifest.currenCanvas; 
        manifest.leaflet; 
        manifest.canvasArray = data.sequences[0].canvases;            
        var div = $('<div id ="mapid" class="mapid"></div>');
        $(elem).append(div);
        manifest.currenCanvas = manifest.canvasArray[manifest.index-1];
        manifest.leaflet = leafletMap(manifest.currenCanvas);
        manifest.currenRotation = 0;
        var drawnItems;
        var zoomtemp;
        var annoArray;
        /*create leaflet map*/
        function leafletMap(canvas,rotation=0) {
            viewer_offset = $(_this).offset();
            var winSize = {y:$('#mapid')[0].clientHeight,x:$('#mapid')[0].clientWidth};
            let url = canvas.images[0].resource.service['@id'] + '/info.json';
            var data = GetJSON(url);      
            var canvasSize ={height:canvas.height,width:canvas.width};
            annoArray = [];
            for (zoomtemp = 0; zoomtemp < 18; zoomtemp++) {
                if (Math.max(canvas.height, canvas.width) < 256 * Math.pow(2, zoomtemp)) {
                    break;
                }
            }
            var w_t = (rotation == 0 || rotation == 180)?Math.max(winSize.x, winSize.y) :Math.min(winSize.x, winSize.y) ;
            var zoomhome;
            for (zoomhome = 0; zoomhome < 18; zoomhome+=0.001) {
                if (w_t < 256 * Math.pow(2, zoomhome)) {
                    break;
                }
            }
            zoomhome = Math.floor(zoomhome*1000)/1000+0.2;
            map = L.map('mapid', {
                crs: L.CRS.Simple,
                center: [0, 0],               
                zoom: 18,
                attributionControl:false, //if false, leaflet logo cancel
                zoomControl: false,
                zoomSnap:0.001// if 0.001, img fit side
            });          
            
            backgroundLabel();
            clickEventLabel();
            L.tileLayer.iiif(url,{                
                setFullZoom:false,
                setMaxBounds:true,
                rotation:rotation
            }).addTo(map);
            
            
            var zoomHome = L.Control.zoomHome({homeCoordinates:L.latLng([0,0]),homeZoom:zoomhome});
                zoomHome.addTo(map);
            drawnItems = L.featureGroup().addTo(map);
           
            if(canvas.otherContent !== undefined){
                var otherContent_url = canvas.otherContent[0]['@id'];
                if ((otherContent_url != 'undefined')&&(otherContent_url != "") ){
                    var annotationlist = GetJSON(otherContent_url);                
                    annotation(annotationlist.resources,rotation,canvasSize);
                    
                }   
            }
            
            /*為annotation添增mousemove事件*/
            map.on('mousemove', function(event) {
                
                $('.annoClickOuter').hide();
                $('#clickEventLabel').hide();
                var latLng = event.latlng;
                //console.log(latLng);
                var point = map.latLngToContainerPoint(latLng);
                var str = '';
                var anno_latLng_array_IDs = [];
                annoMousemove(latLng, str, anno_latLng_array_IDs);      
                annoShowByArea(annoArray);            
                backgroundLabelSwitch(anno_latLng_array_IDs.length);
                bgLabelPosition(point);
            });
            map.on('click',function(event){
                var latLng = event.latlng;
                var anno_latLng_array_IDs = [];
                annoMousemove(latLng, '', anno_latLng_array_IDs,'click'); 
            });
            return map;
        }
        /*annotation*/
        function annotation(resources,rotation,canvasSize) {
            $.each(resources, function(i, value) {
                var layer, shape;
                shape = 'rectangle';
                var b = /xywh=(.*)/.exec(value.on)[1].split(',');
                var point = strToPoint(b,rotation,canvasSize);
                var latLng = L.latLngBounds(point.min, point.max);
                layer = L.rectangle(latLng);
                drawnItems.addLayer(layer);  
                var chars = formateStr(value.resource.chars);
                var titleChars = titlize(chars);
                var metadata = value.metadata;
                var area = ( point.max.lat * point.max.lat - point.min.lat * point.min.lat ) * ( point.max.lng * point.max.lng - point.min.lng * point.min.lng )
                var annoData = {
                    'bounds': layer.getBounds(),
                    'point': point,
                    'metadata': value.metadata,
                    'chars': chars,
                    'leaflet_id': layer._leaflet_id,
                    'preMouseStatus': '',
                    'i': i,                        
                    'color': colorArray[i * 3 % 241],
                    'area':area,
                    'target':''
                };                
                var htmlTag = '<div id="anno' + i + '" class="tipbox"><a class="tip" style="background-color:' + colorArray[i * 3 % 241] + ';"></a><a class="tipTitle">' + titleChars + '</a></div>';
                var annolabel = $(htmlTag);
                var htmlDescribing = '<div id="contentDescribing' + i + '" class="tabcontent">' + chars + '</div>';
                var htmlMetadata = '<div id="contentMetadata' + i + '" class="tabcontent">' + metadata + '</div>';
                var annoDetail = $('<div id="annoDetail' + i + '" class="annoDetail">' +
                    '<div class="tab">' +
                    '<button class="tablinks" id="describing' + i + '" >describing</button>' +
                    '<button class="tablinks" id="metadata' + i + '">metadata</button>' +
                    '</div>' + htmlDescribing + htmlMetadata + '</div>');
                 $('#backgroundLabel').append(annolabel);               
                var annoClickStr = '<div id="annoClick'+i+'" class="annoClickOuter"><div class="blankLine"></div>'+
                '<div class="annoClickInnerUp" style="background-color:' + colorArray[i * 3 % 241] + ';"></div>'+
                                        '<div class="annoClickInnerDown">'+
                                        '<div>'+chars+'</div>'+
                                        '<div class="annoClickMetadata">'+value.metadata[0].value+'</div>'+
                                        '<div class="annoClickMetadata">'+value.metadata[1].value[1]['@value']+'</div>'+
                                        '</div>'+
                                     '</div>';
                var clickEventPane = $(annoClickStr);                   
                $('#clickEventLabel').append(clickEventPane);                    
                $('#anno' + i).click(function() {annoLableClick(annoArray[i]);});
                annoArray.push(annoData);                
            });
        }
       
         /*str to latLng point*/
        function strToPoint(b,rotation,canvasSize) {
            var minPoint = L.point(b[0], b[1]);
            var maxPoint = L.point(parseInt(b[0]) + parseInt(b[2]), parseInt(b[1]) + parseInt(b[3]));            
            if(rotation==180){
                var x = minPoint.x, y = minPoint.y;
                minPoint.x = canvasSize.width - maxPoint.x ;
                minPoint.y = canvasSize.height - maxPoint.y ;
                maxPoint.x = canvasSize.width - x;
                maxPoint.y = canvasSize.height - y;
            }else if(rotation==90){
                var x = minPoint.x, y = minPoint.y;
                minPoint.x = canvasSize.height - maxPoint.y ;
                minPoint.y = maxPoint.x ;
                maxPoint.x = canvasSize.height - y;
                maxPoint.y = x;
            }else if(rotation==270){
                var x = minPoint.x, y = minPoint.y;
                minPoint.x = maxPoint.y ;
                minPoint.y = canvasSize.width - maxPoint.x ;
                maxPoint.x = y;
                maxPoint.y = canvasSize.width - x;
            }            
            var min = map.unproject(minPoint, zoomtemp);
            var max = map.unproject(maxPoint, zoomtemp);            
            var point = {'min': min,'max': max};
            return point;
        }
       
        /*RegEx url to array*/
        function URLToArray(url) {
            var request = {};
            var pairs = url.substring(url.indexOf('?') + 1).split('&');
            for (var i = 0; i < pairs.length; i++) {
                if(!pairs[i])
                    continue;
                var pair = pairs[i].split('=');
                request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
             }
             return request; 
        }
        
        /*get json by url*/
        function GetJSON(url) {
            var data;
            $.ajax({
                url: url,
                method: "GET",
                async: false,
                dataType: "JSON",
                success: function(response) {
                    data = response;
                },
                error: function(xhr, status, error) {
                   
					var str = window.location.href;
					var res = str.substring(0,str.indexOf('?'))
					window.location.href = res;
                }
            });
            return data;
        }
        function enterorleave(latLng,i){
            
            if(manifest.currenRotation==0||manifest.currenRotation==180){
                return (latLng.lat < annoArray[i].point.min.lat) && (latLng.lat > annoArray[i].point.max.lat) 
                && (latLng.lng > annoArray[i].point.min.lng) && (latLng.lng < annoArray[i].point.max.lng);
            }else if(manifest.currenRotation==90){
                return (latLng.lat > annoArray[i].point.min.lat) && (latLng.lat < annoArray[i].point.max.lat) 
                && (latLng.lng > annoArray[i].point.min.lng) && (latLng.lng < annoArray[i].point.max.lng);
            }else if(manifest.currenRotation==270){
                return (latLng.lat < annoArray[i].point.min.lat) && (latLng.lat > annoArray[i].point.max.lat) 
                && (latLng.lng < annoArray[i].point.min.lng) && (latLng.lng > annoArray[i].point.max.lng);
            }
            
            
            
            
        }
        /*check mouse on annotation*/
        function annoMousemove(latLng, str, anno_latLng_array_IDs,clicked) {
            for (var i = 0; i < annoArray.length; i++) {
                if (enterorleave(latLng,i)) {
                    if (annoArray[i].preMouseStatus != 'mouseenter') {
                       annoArray[i].preMouseStatus = 'mouseenter';
                       // console.log(i);
                    }
                    if(clicked == 'click' && annoArray[i].target == 'target'){
                        mouseclick(annoArray[i])
                    }
                    anno_latLng_array_IDs.push(i);
                    
                } else {
                    if (annoArray[i].preMouseStatus != 'mouseleave') {
                        annoArray[i].preMouseStatus = 'mouseleave';
                    }
                }
            }
        }
         /*mouseclick*/
        function mouseclick(arr){
            $('#backgroundLabel').hide();
            $('#clickEventLabel').show();
            $('#annoClick'+arr.i).show();
            annoAreaClick();
        }
        function annoAreaClick(i, metadata) {
            return;
            $('.tabcontent').css('height', '');
            $('.annoDetail').hide();
            $('#annoDetail' + i).show();
            document.getElementById('contentMetadata' + i).style.display = "none";
            document.getElementById('contentDescribing' + i).style.display = "block";
            document.getElementById('describing' + i).className += " active";
            document.getElementById('metadata' + i).className = document.getElementById('metadata' + i).className.replace(" active", "");
            if (metadata == 'no metadata') {
                $('#metadata' + i).textContent = 'X';
            }
        }
        /**backgroundLabel*/
        function backgroundLabel(){
            $('#backgroundLabel').remove();
            var backgroundLabel = $('<div id = "backgroundLabel" ></div>');
            $('body').append(backgroundLabel);
            $('#backgroundLabel').hide();
            
        }
        function clickEventLabel(){
            $('#clickEventLabel').remove();
            var clickEventLabel = $('<div id = "clickEventLabel" ></div>');
            $('body').append(clickEventLabel);
            $('#clickEventLabel').hide();
        }
        function annoShowByArea(arr){
            var array = [];
            var prems = '';
            for( var i = 0 ; i < arr.length ; i++){
                prems = arr[i].preMouseStatus;
                if(prems == 'mouseenter'){
                    array.push(arr[i]);
                }
            }
            var elem = (manifest.currenRotation==90||manifest.currenRotation==270)?Math.max.apply(Math,array.map(function(o){return o.area;})): Math.min.apply(Math,array.map(function(o){return o.area;}));
         
             
            var minelem;
            array.forEach(function(e) {
              if(e.area == elem){
                  minelem = e ;
              }
            });
            for( var i = 0 ; i < arr.length ; i++){
                $('#anno'+i).hide();
                annoArray[i].target = '';
                d3.select($('path')[i])
                .transition()
                .duration(350)
                .attr({
                    stroke: '#3388ff'
                })
            }
            for( var i = 0 ; i < arr.length ; i++){
                if ( typeof minelem != 'undefined'){
                    if( minelem.area == arr[i].area ){
                        $('#anno'+i).show();
                        d3.select($('path')[i])
                        .transition()
                        .duration(100)
                        .attr({
                        stroke: minelem.color
                        })
                        annoArray[i].target = 'target';
                    }
                }
            }
        }
        function backgroundLabelSwitch(l){
            if (l != 0) {
                $('#labelClose').click(function() {
                    $('#backgroundLabel').hide();
                });
                $('#backgroundLabel').show();
            } else {
                $('#backgroundLabel').hide();
            }
        }
        /*Label position*/
        function bgLabelPosition(point) {
            x = point.x + viewer_offset.left;
            y = point.y + viewer_offset.top;
            $('#backgroundLabel').css({'left': x,'top': y});
            $('#clickEventLabel').css({'left': x,'top': y});
        }
        /*formate string to html innerHTML*/
        function formateStr(str) {
            var div = document.createElement("div");
            if (str != null) {
                div.innerHTML = str;
            }
            if(div.innerText == '')
                return '無描述';
            return div.innerText;
        }
          /*titlize chars*/
        function titlize(str) {
            if(str == '')
                return '無描述';
           
            return str;//str.substring(0, 9) + '...';
        }
          function annoLableClick(arr) {
            $('#backgroundLabel').hide();
            $('#clickEventLabel').show();
            $('#annoClick'+arr.i).show();
        }
        
        $('.reset').click(function(){
          manifest.leaflet.remove();
          manifest.currenRotation = 0;
          manifest.leaflet = leafletMap(manifest.currenCanvas,manifest.currenRotation);
        });
        $('.rotation').click(function(){
            var _this = this;
            
            manifest.leaflet.remove();
            manifest.currenRotation+=parseInt(_this.value);
            manifest.currenRotation=(manifest.currenRotation>=360)?manifest.currenRotation-360:manifest.currenRotation;
            console.log(manifest.currenRotation);
            
            manifest.leaflet = leafletMap(manifest.currenCanvas,manifest.currenRotation);
        });
        
    }
})(jQuery);