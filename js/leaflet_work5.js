(function($) {
    $.fn.work = function() {
        var winsLang = window.navigator.language;
        var colorArray = ['#696969', '#808080', '#A9A9A9', '#C0C0C0', '#D3D3D3', '#DCDCDC', '#F5F5F5', '#FFFFFF', '#FFFAFA', '#625B57', '#E6C3C3', '#BC8F8F', '#F08080', '#CD5C5C', '#A52A2A', '#B22222', '#800000', '#8B0000', '#E60000', '#FF0000', '#FF4D40', '#FFE4E1', '#FA8072', '#FF2400', '#FF6347', '#E9967A', '#FF7F50', '#FF4500', '#FFA07A', '#FF4D00', '#A0522D', '#FF8033', '#A16B47', '#E69966', '#4D1F00', '#FFF5EE', '#8B4513', '#D2691E', '#CC5500', '#FF7300', '#FFDAB9', '#F4A460', '#B87333', '#FAF0E6', '#FFB366', '#CD853F', '#704214', '#CC7722', '#FFE4C4', '#F28500', '#FF8C00', '#FAEBD7', '#D2B48C', '#DEB887', '#FFEBCD', '#FFDEAD', '#FF9900', '#FFEFD5', '#CCB38C', '#996B1F', '#FFE4B5', '#FDF5E6', '#F5DEB3', '#FFE5B4', '#FFA500', '#FFFAF0', '#DAA520', '#B8860B', '#4D3900', '#E6C35C', '#FFBF00', '#FFF8DC', '#E6B800', '#FFD700', '#FFFACD', '#F0E68C', '#EEE8AA', '#BDB76B', '#E6D933', '#FFFDD0', '#FFFFF0', '#F5F5DC', '#FFFFE0', '#FAFAD2', '#FFFF99', '#CCCC4D', '#FFFF4D', '#808000', '#FFFF00', '#FFFF00', '#697723', '#CCFF00', '#6B8E23', '#9ACD32', '#556B2F', '#8CE600', '#ADFF2F', '#99E64D', '#7CFC00', '#7FFF00', '#73B839', '#99FF4D', '#66FF00', '#66FF59', '#F0FFF0', '#8FBC8F', '#90EE90', '#98FB98', '#36BF36', '#228B22', '#32CD32', '#006400', '#008000', '#00FF00', '#22C32E', '#16982B', '#73E68C', '#50C878', '#4DE680', '#127436', '#A6FFCC', '#2E8B57', '#3CB371', '#F5FFFA', '#00FF80', '#00A15C', '#00FA9A', '#66CDAA', '#7FFFD4', '#0DBF8C', '#66FFE6', '#33E6CC', '#30D5C8', '#20B2AA', '#48D1CC', '#E0FFFF', '#89CFF0', '#AFEEEE', '#2F4F4F', '#008080', '#008B8B', '#00FFFF', '#AFDFE4', '#00CED1', '#5F9EA0', '#00808C', '#B0E0E6', '#006374', '#ADD8E6', '#7AB8CC', '#4798B3', '#00BFFF', '#87CEEB', '#87CEFA', '#00477D', '#003153', '#4682B4', '#F0F8FF', '#708090', '#778899', '#1E90FF', '#004D99', '#007FFF', '#5686BF', '#B0C4DE', '#0047AB', '#5E86C1', '#6495ED', '#4D80E6', '#003399', '#082567', '#002FA7', '#2A52BE', '#4169E1', '#24367D', '#0033FF', '#0D33FF', '#F8F8FF', '#E6E6FA', '#CCCCFF', '#191970', '#000080', '#00008B', '#0000CD', '#0000FF', '#5C50E6', '#483D8B', '#6A5ACD', '#7B68EE', '#6640FF', '#B399FF', '#9370DB', '#6633CC', '#8674A1', '#5000B8', '#B8A1CF', '#8A2BE2', '#8B00FF', '#4B0080', '#9932CC', '#9400D3', '#7400A1', '#D94DFF', '#E680FF', '#BA55D3', '#E6CFE6', '#D8BFD8', '#CCA3CC', '#DDA0DD', '#EE82EE', '#800080', '#8B008B', '#FF00FF', '#F400A1', '#DA70D6', '#FFB3E6', '#B85798', '#FF66CC', '#C71585', '#FF0DA6', '#FF007F', '#CC0080', '#E63995', '#FF1493', '#E68AB8', '#FF80BF', '#FF69B4', '#470024', '#FF73B3', '#E6005C', '#FFD9E6', '#990036', '#FFF0F5', '#DB7093', '#DE3163', '#FF8099', '#DC143C', '#FFC0CB', '#FFB6C1', '#FFB3BF', '#E32636'];
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
                zoom: 18,                
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
                    var metadata = metadataTag(value.metadata, i);
                    var annoData = {
                        'bounds': layer.getBounds(),
                        'point': point,
                        'metadata': value.metadata,
                        'chars': chars,
                        'leaflet_id': layer._leaflet_id,
                        'preMouseStatus': '',
                        'i': i,                        
                        'color': colorArray[i * 5 % 241]
                    };
                    
                    var htmlTag = '<div id="anno' + i + '" class="tipbox"><a class="tip" style="background-color:' + colorArray[i * 5 % 241] + ';"></a><a class="tipTitle">' + titleChars + '</a></div>';
                    var annolabel = $(htmlTag);
                    var htmlDescribing = '<div id="contentDescribing' + i + '" class="tabcontent">' + chars + '</div>';
                    var htmlMetadata = '<div id="contentMetadata' + i + '" class="tabcontent">' + metadata + '</div>';
                    var annoDetail = $('<div id="annoDetail' + i + '" class="annoDetail">' +
                        '<div class="tab">' +
                        '<button class="tablinks" id="describing' + i + '" >describing</button>' +
                        '<button class="tablinks" id="metadata' + i + '">metadata</button>' +
                        '</div>' + htmlDescribing + htmlMetadata + '</div>');
                     $('#backgroundLabel').append(annolabel);
                    //console.log(annoData);
                   
                   
                    var annoClickStr = '<div id="annoClick'+i+'" class="annoClickOuter"><div class="blankLine"></div>'+
                    '<div class="annoClickInnerUp" style="background-color:' + colorArray[i * 5 % 241] + ';"></div>'+
                                            '<div class="annoClickInnerDown">'+
                                            '<div>'+chars+'</div>'+
                                            '<div class="annoClickMetadata">'+value.metadata[0].value+'</div>'+
                                            '<div class="annoClickMetadata">'+value.metadata[1].value[1]['@value']+'</div>'+
                                            '</div>'+
                                         '</div>';
                    var clickEventPane = $(annoClickStr);                   
                    $('#clickEventLabel').append(clickEventPane);
                    
                    
                    
                     $('#anno' + i).click(function() {
                        $('#backgroundLabel').hide();
                        $('#clickEventLabel').show();
                        $('#annoClick'+i).show();
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
        /*metadataTag*/
        function metadataTag(obj, i) {
            var str = '';
            var j = 0;
            if (typeof obj == 'undefined') {
                return 'no metadata';
            }
            obj.forEach((val) => {
                if (typeof val.value == 'object') {
                    var p;
                    val.value.forEach((lan) => {
                        if (lan['@language'] == winsLang) {
                            p = lan['@value'];
                        }
                    })
                    str += '<div id="metadata' + i + 'label' + j + '" class="metadataLabel">' + val.label + '</div>' +
                        '<div id="metadata' + i + 'value' + j + '" class="metadataValue">' + p + '</div><br>';
                } else if (typeof val.value == 'string') {
                    str += '<div id="metadata' + i + 'label' + j + '" class="metadataLabel" >' + val.label + '</div>' +
                        '<div id="metadata' + i + 'value' + j + '" class="metadataValue" >' + val.value + '</div><br>';
                }
                j++;
            })
            return str;
        }
        /*anno click*/
        function annoLableClick(i, metadata) {
            
            
            
            
            
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
                   
                    mouseenter(arr);
                }
                if(str == 'click'){
                    mouseclick(arr)
                }
                anno_latLng_array_IDs.push(i);
                return true;
            } else {
                if (arr.preMouseStatus != 'mouseleave') {
                    mouseleave(arr);
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
                return '無註記';
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