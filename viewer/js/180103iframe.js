(function($) {
    $.fn.work = function() {
        var winsLang = window.navigator.language;
        var colorArray = ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'orange', 'purple', 'red', 'silver', 'teal', 'white', 'yellow','black'];
        var _this = this;
        var my = [];
        var data1;   
        var functionObject = {};
        var x, y;
        var manifest = {};
        var href = window.location.href;
        var manifestarr = URLToArray(href);
        var url = manifestarr['manifest'];
        _this.attr('id','main');
        var elem = '#main';        
        var map;
        var zoomtemp;
        var drawnItems;
        var annoArray;
        var viewer_offset;           
        var preMouseStatus = '';
        var elemid;
        var canvasAnnotation = [];
        main();
     
        
        /*change page function*/
        function change() {
            manifest.leaflet.remove();
            manifest.currenCanvas = manifest.canvasArray[manifest.index - 1];            
            manifest.leaflet = leafletMap(manifest.currenCanvas,'mapid');
            manifest.canvasArray = data1.sequences[0].canvases;
        }
       
        function main(){
            manifest.element = elem; 
            manifest.canvasArray = []; 
            manifest.index = 3; 
            manifest.currenCanvas; 
            manifest.leaflet; 
            manifest.id = url;
            data1 = GetJSON(manifest.id);
            iiif_layer = [];
            manifest.canvasArray = data1.sequences[0].canvases;            
            var div = $('<div id ="mapid" class="mapid"></div>');
            $(elem).append(div);
            manifest.currenCanvas = manifest.canvasArray[manifest.index];
            manifest.leaflet = leafletMap(manifest.currenCanvas);
            manifest.rightclick = true;
            manifest.leftclick = true;
            add_chose_button(elem);
            add_info_button(data1); 
            var page_click=0;
            var info_click=0;         
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
        
        /*page change right/left button*/
        function add_chose_button(elem) {            
            var left = $('<div id="'+elem+'leftArr" class="leaflet-control-layers-base canvasBtn leftArr" ><span class="fa fa-chevron-left fa-2x" aria-hidden="true"> </span></div>');           
            var right = $('<div id="'+elem+'rightArr" class="leaflet-control-layers-base canvasBtn rightArr" ><span class="fa fa-chevron-right fa-2x" aria-hidden="true"> </span></div>');
            $('#mapid').append(left,right);
            
            right.click(function(e) {
                elemid = e.target.parentElement.parentElement.id;
                if (manifest.index + 1 <= manifest.canvasArray.length) {
                    manifest.index = manifest.index + 1;
                    change();
                    if(manifest.leftclick == false){
                        manifest.leftclick = true;
                        left.show();
                    }
                } else {
                    alert('Out of Range');
                    right.hide();
                    manifest.rightclick = false;
                }
                
            });
            left.click(function(e) {
                elemid = e.target.parentElement.parentElement.id;
                if (manifest.index - 1 >= 1) {
                    manifest.index = manifest.index - 1;
                    change();
                    if(manifest.rightclick == false){
                        manifest.rightclick = true;
                        right.show();
                    }
                    
                } else {
                    alert('Out of Range');
                    left.hide();
                    manifest.leftclick = false;
                }
            });
            
        };
        
        
        
        
        /*select which page*/
        function pageSelect(elem){            
            var pageNum = manifest.canvasArray.length;
            var pageSelectStr='';
            for(var i=1 ;i<=pageNum ;i++){
                pageSelectStr += '<button id="'+elem+'PageSelect" class="index">'+i+'</button>';
            }
            var pageSelectTag = $('<p></p>'+pageSelectStr);
            $('body').append(pageSelectTag);
            $('.index').click(function(e){
                manifest.index = e.target.textContent;
                change(my);
            });
        }
        
        
        /*show manifest info button*/
        function add_info_button(data1) {
            var metadata = data1.metadata;
            var p;
            metadata.forEach((val) => {
                if (typeof val.value == 'object') {
                    val.value.forEach((lan)=>{
                        if(lan['@language'] == winsLang){
                            p = lan['@value'];
                        }
                    })                    
                } 
            })
            var info = $('<div id="info" class="list-group">' +
            '<div class="scrollbar" id="style-1"><div class="force-overflow">'+
                '<span id="infoClose" > X </span>' +
                '<dl><dt>manifest URI</dt><dd>' + manifest.id + '</dd></dl>' +
                '<dl><dt>Label</dt><dd>' + data1.label + '</dd></dl>' +
                '<dl><dt>Description</dt><dd>' + data1.description + '</dd></dl>' + '<dl><dt>Attribution</dt><dd>' + data1.attribution + '</dd></dl>' +
                '<dl><dt>License</dt><dd>' + data1.license + '</dd></dl>' +
                '<dl><dt>Logo</dt><dd>' + data1.logo['@id'] + '</dd></dl>' +
                '<dl><dt>Viewing Direction</dt><dd>' + data1.viewingDirection + '</dd></dl>' +
                '<dl><dt>Viewing Hint</dt><dd>' + data1.viewingHint + '</dd></dl>' +
                '<dl><dt>' + data1.metadata[0].label + '</dt><dd>' + data1.metadata[0].value + '</dd></dl>' +
                '<dl><dt>' + data1.metadata[1].label + '</dt><dd>' + p + '</dd></dl>' +
                '<dl><dt>' + data1.metadata[2].label + '</dt><dd>' + data1.metadata[2].value + '</dd></dl>' +
                '</div></div>'+
                '</div>');
            $('#mapid').append(info);
            $('#infoClose').click(function() {
                $('#info').hide();
                map.scrollWheelZoom.enable();
                $("#infoBtn").show();
            });
            var icon = $('<i id="infoBtn" class="fa fa-info-circle fa-3x" aria-hidden="true"></i>');
            icon.click(function() {
                $('#info').show();
                map.scrollWheelZoom.disable();
                icon.hide();
            });
            $('#mapid').append(icon);  
           
        }
        function annoShowByArea(arr){
            var array = [];
            var prems = '';
            for( var i = 0 ; i < arr.length ; i++){
                prems = arr[i].preMouseStatus;
                
                if(prems == 'mouseenter'){
                    array.push(arr[i]);
                    //console.log(i);
                }
            }
            //console.log(arr[0].preMouseStatus);
            var min =  Math.min.apply(Math,array.map(function(o){return o.area;}));
           
            var minelem;
            array.forEach(function(elem) {
              if(elem.area == min){
                  minelem = elem ;
              }
            });
            //console.log(minelem.i);
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
            
           
            //console.log(minelem.chars);
        }
        
        
        
        
        
        
        
        /*create leaflet map*/
        function leafletMap(canvas,id) {
            viewer_offset = $(_this).offset();
            annoArray = [];
            for (zoomtemp = 0; zoomtemp < 18; zoomtemp++) {
                if (Math.max(canvas.width, canvas.height) < 256 * Math.pow(2, zoomtemp)) {
                    break;
                }
            }
            var mapid ;
            if(typeof id=="undefined"){
                mapid = 'mapid';
            }else{
                mapid = id;
            }
            map = L.map(mapid, {
                crs: L.CRS.Simple,
                center: [0, 0],               
                zoom: 2,
                minZoom: 1,
                maxZoom: 3.499,
                attributionControl:false,
                zoomControl: false
            });
            
            backgroundLabel();
            clickEventLabel();
            var img_service_url = canvas.images[0].resource.service['@id'] + '/info.json';
            var iiif_layer = L.tileLayer.iiif(img_service_url).addTo(map);
            drawnItems = L.featureGroup().addTo(map);
            if(canvas.otherContent == undefined){
                
            }else{
                var otherContent_url = canvas.otherContent[0]['@id'];
                if (otherContent_url != 'undefined') {
                    var annotationlist = GetJSON(otherContent_url);                
                    annotation(annotationlist.resources);
                    
                }   
            }
            
            map.on('click',function(event){
                var latLng = event.latlng;
                var anno_latLng_array_IDs = [];
                annoMousemove(latLng, '', anno_latLng_array_IDs,'click'); 
            });
                     
            /*為annotation添增mousemove事件*/
            map.on('mousemove', function(event) {
                
                $('.annoClickOuter').hide();
                $('#clickEventLabel').hide();
                var latLng = event.latlng;
                var point = map.latLngToContainerPoint(latLng);
                var str = '';
                var anno_latLng_array_IDs = [];
                annoMousemove(latLng, str, anno_latLng_array_IDs);      
                annoShowByArea(annoArray);
                //console.log(annoArray[0].preMouseStatus);                
                backgroundLabelSwitch(anno_latLng_array_IDs.length);
                bgLabelPosition(point);
            });
            
            L.control.zoom({
                 position:'topleft'
            }).addTo(map);
            L.control.layers({},{'drawlayer': drawnItems}, {
                position: 'topleft',//'topleft', 'topright', 'bottomleft' or 'bottomright'
                collapsed: false
            }).addTo(map);
            map.addControl(new L.Control.Draw({
                edit: {
                    featureGroup: drawnItems,
                    poly: {
                        allowIntersection: false
                    }
                },
                draw: {
                    polygon: {
                        allowIntersection: false,
                        showArea: false
                    },
                    polygon: false,
                    rectangle: true,
                    polyline: false,
                    circle: false,
                    marker: false,
                    circlemarker: false
                }
            }));
            /*繪圖開始*/
            
            map.on(L.Draw.Event.DRAWSTART, function(event) {
                $(document).mousemove(function(event) {
                    
                });
                $("#annotation_cancel").unbind("click");
                $("#annotation_save").unbind("click");
            });
            /*繪畫完成，記錄形狀儲存的點與其資訊*/
            map.on(L.Draw.Event.CREATED, function(event) {
                var layer = event.layer;
                drawnItems.addLayer(layer);
                $('#confirmOverlay').show();
                $('#confirmBox')
                    .css('left', x)
                    .css('top', y);
                var points_array;
                points_array = convert_latlng_SVG(canvas, layer._latlngs[0]);
                $('#annotation_save').click(function(e) {
                    var annotationObject = {
                        'canvas_id': canvas['@id'],
                        'image': canvas['@id'],
                        'point': JSON.stringify(points_array),
                        'shape': event.layerType,
                        'lid': layer._leaflet_id,
                        'text': tinyMCE.activeEditor.getContent()
                    };
                    canvasAnnotation.push(annotationObject);
                    $('#confirmOverlay').hide();
                    layer.bindLabel(canvasAnnotation[canvasAnnotation.length - 1].text).addTo(map);
                    tinyMCE.activeEditor.setContent('');
                   
                });
                $('#annotation_cancel').click(function(e) {
                    drawnItems.removeLayer(layer);
                    tinyMCE.activeEditor.setContent('');
                    $('#confirmOverlay').hide();
                });

            });
            return map;
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
        function clickEventLabel(){
            $('#clickEventLabel').remove();
            var clickEventLabel = $('<div id = "clickEventLabel" ></div>');
            $('body').append(clickEventLabel);
            $('#clickEventLabel').hide();
        }
        /**backgroundLabel*/
        function backgroundLabel(){
            $('#backgroundLabel').remove();
            var backgroundLabel = $('<div id = "backgroundLabel" ></div>');
            $('body').append(backgroundLabel);
            $('#backgroundLabel').hide();
            
        }
        var h= $('#mapid').height();
        var w= $('#mapid').width();;
        $( window ).resize(function() {
            h = $('#mapid').height();
            w = $('#mapid').width();
        });
        /*Label position*/
        function bgLabelPosition(point) {
            x = point.x + viewer_offset.left;
            y = point.y + viewer_offset.top;
            /*label範圍座標*/
            
            $('#backgroundLabel').css({
                'left': x,
                'top': y
            });
            $('#clickEventLabel').css({
                'left': x,
                'top': y
            });
        }
       
                
        /**將經緯度轉成正常的pixel*/
        function convert_latlng_SVG(canvas, points) {
            var array = [];
            $.each(points, function(i, value) {
                var temp = map.project(value, zoomtemp);
                temp.x = temp.x * 100 / canvas.width;
                temp.y = temp.y * 100 / canvas.height;
                array.push(temp);
            });
            return array;
        }
        /*annotation*/
        function annotation(resources) {
            $.each(resources, function(i, value) {
                var layer, shape;
                shape = 'rectangle';
                    var b = /xywh=(.*)/.exec(value.on)[1].split(',');
                    var point = strToPoint(b);
                    var latLng = L.latLngBounds(point.min, point.max);
                    layer = L.rectangle(latLng);
                    layer.id = i;
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
                    
                    
                    
                     $('#anno' + i).click(function() {
                        
                        annoLableClick(annoArray[i]);
                    });
                    
                    annoArray.push(annoData);
            });
        }
        
        /*openTab*/
        function openTab(on1, on2, off1, off2, i, num) {
            document.getElementById(on1).style.display = "block";
            document.getElementById(on2).className += " active";
            document.getElementById(off1).style.display = "none";
            document.getElementById(off2).className = document.getElementById(off2).className.replace(" active", "");
            if (num != 0) {
                var h = 60 + num * 40;
                $('.tabcontent').css('height', h + 'px');
            } else {
                $('.tabcontent').css('height', '');
            }
        }       
        /*anno click*/
        function annoLableClick(arr) {
            $('#backgroundLabel').hide();
            $('#clickEventLabel').show();
            $('#annoClick'+arr.i).show();
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
        /*titlize chars*/
        function titlize(str) {
            if(str == '')
                return '無描述';
           
            return str;//str.substring(0, 9) + '...';
        }
        /*str to latLng point*/
        function strToPoint(b) {
            var minPoint = L.point(b[0], b[1]);
            var maxPoint = L.point(parseInt(b[0]) + parseInt(b[2]), parseInt(b[1]) + parseInt(b[3]));
            var min = map.unproject(minPoint, zoomtemp);
            var max = map.unproject(maxPoint, zoomtemp);
            var point = {
                'min': min,
                'max': max
            };
            return point;
        }
        /*check mouse on annotation*/
        function annoMousemove(latLng, str, anno_latLng_array_IDs,clicked) {
            for (var i = 0; i < annoArray.length; i++) {
                hasAnno(latLng, annoArray[i], anno_latLng_array_IDs, i,clicked);
            }
        }
        
        /* is mousemove on annotation */
        function hasAnno(latLng, arr, anno_latLng_array_IDs, i,str) {
            if ((latLng.lat < arr.point.min.lat) && (latLng.lat > arr.point.max.lat) && (latLng.lng > arr.point.min.lng) && (latLng.lng < arr.point.max.lng)) {
                if (arr.preMouseStatus != 'mouseenter') {
                   arr.preMouseStatus = 'mouseenter';
                    //mouseenter(arr);
                }
                if(str == 'click' && arr.target == 'target'){
                    mouseclick(arr)
                }
                anno_latLng_array_IDs.push(i);
                return true;
            } else {
                if (arr.preMouseStatus != 'mouseleave') {
                    //mouseleave(arr);
                    arr.preMouseStatus = 'mouseleave';
                }
                return false;
            }
        }
        /*mouseclick*/
        function mouseclick(arr){
            $('#backgroundLabel').hide();
            $('#clickEventLabel').show();
            $('#annoClick'+arr.i).show();
            annoAreaClick();
        }
       
        /*mouse enter annotaiton*/
        function mouseenter(arr) {
            //console.log('anno'+arr.i+' mouseenter');
            $('#anno' + arr.i).show();
            arr.preMouseStatus = 'mouseenter';
            d3.select($('path')[arr.i])
                .transition()
                .duration(100)
                .attr({
                    stroke: arr.color
                })
        }
        /*mouse leave annotaiton*/
        function mouseleave(arr) {
            $('#anno' + arr.i).hide();
            $('#annoDetail' + arr.i).hide();
            arr.preMouseStatus = 'mouseleave';
            d3.select($('path')[arr.i])
                .transition()
                .duration(350)
                .attr({
                    stroke: '#3388ff'
                })
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
                    console.log("xhr:" + xhr + '\n' + "status:" + status + '\n' + "error:" + error);
                }
            });
            return data;
        }
    }
})(jQuery);