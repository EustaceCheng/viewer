var colorArray = ['#696969', '#808080', '#A9A9A9', '#C0C0C0', '#D3D3D3', '#DCDCDC', '#F5F5F5', '#FFFFFF', '#FFFAFA', '#625B57', '#E6C3C3', '#BC8F8F', '#F08080', '#CD5C5C', '#A52A2A', '#B22222', '#800000', '#8B0000', '#E60000', '#FF0000', '#FF4D40', '#FFE4E1', '#FA8072', '#FF2400', '#FF6347', '#E9967A', '#FF7F50', '#FF4500', '#FFA07A', '#FF4D00', '#A0522D', '#FF8033', '#A16B47', '#E69966', '#4D1F00', '#FFF5EE', '#8B4513', '#D2691E', '#CC5500', '#FF7300', '#FFDAB9', '#F4A460', '#B87333', '#FAF0E6', '#FFB366', '#CD853F', '#704214', '#CC7722', '#FFE4C4', '#F28500', '#FF8C00', '#FAEBD7', '#D2B48C', '#DEB887', '#FFEBCD', '#FFDEAD', '#FF9900', '#FFEFD5', '#CCB38C', '#996B1F', '#FFE4B5', '#FDF5E6', '#F5DEB3', '#FFE5B4', '#FFA500', '#FFFAF0', '#DAA520', '#B8860B', '#4D3900', '#E6C35C', '#FFBF00', '#FFF8DC', '#E6B800', '#FFD700', '#FFFACD', '#F0E68C', '#EEE8AA', '#BDB76B', '#E6D933', '#FFFDD0', '#FFFFF0', '#F5F5DC', '#FFFFE0', '#FAFAD2', '#FFFF99', '#CCCC4D', '#FFFF4D', '#808000', '#FFFF00', '#FFFF00', '#697723', '#CCFF00', '#6B8E23', '#9ACD32', '#556B2F', '#8CE600', '#ADFF2F', '#99E64D', '#7CFC00', '#7FFF00', '#73B839', '#99FF4D', '#66FF00', '#66FF59', '#F0FFF0', '#8FBC8F', '#90EE90', '#98FB98', '#36BF36', '#228B22', '#32CD32', '#006400', '#008000', '#00FF00', '#22C32E', '#16982B', '#73E68C', '#50C878', '#4DE680', '#127436', '#A6FFCC', '#2E8B57', '#3CB371', '#F5FFFA', '#00FF80', '#00A15C', '#00FA9A', '#66CDAA', '#7FFFD4', '#0DBF8C', '#66FFE6', '#33E6CC', '#30D5C8', '#20B2AA', '#48D1CC', '#E0FFFF', '#89CFF0', '#AFEEEE', '#2F4F4F', '#008080', '#008B8B', '#00FFFF', '#AFDFE4', '#00CED1', '#5F9EA0', '#00808C', '#B0E0E6', '#006374', '#ADD8E6', '#7AB8CC', '#4798B3', '#00BFFF', '#87CEEB', '#87CEFA', '#00477D', '#003153', '#4682B4', '#F0F8FF', '#708090', '#778899', '#1E90FF', '#004D99', '#007FFF', '#5686BF', '#B0C4DE', '#0047AB', '#5E86C1', '#6495ED', '#4D80E6', '#003399', '#082567', '#002FA7', '#2A52BE', '#4169E1', '#24367D', '#0033FF', '#0D33FF', '#F8F8FF', '#E6E6FA', '#CCCCFF', '#191970', '#000080', '#00008B', '#0000CD', '#0000FF', '#5C50E6', '#483D8B', '#6A5ACD', '#7B68EE', '#6640FF', '#B399FF', '#9370DB', '#6633CC', '#8674A1', '#5000B8', '#B8A1CF', '#8A2BE2', '#8B00FF', '#4B0080', '#9932CC', '#9400D3', '#7400A1', '#D94DFF', '#E680FF', '#BA55D3', '#E6CFE6', '#D8BFD8', '#CCA3CC', '#DDA0DD', '#EE82EE', '#800080', '#8B008B', '#FF00FF', '#F400A1', '#DA70D6', '#FFB3E6', '#B85798', '#FF66CC', '#C71585', '#FF0DA6', '#FF007F', '#CC0080', '#E63995', '#FF1493', '#E68AB8', '#FF80BF', '#FF69B4', '#470024', '#FF73B3', '#E6005C', '#FFD9E6', '#990036', '#FFF0F5', '#DB7093', '#DE3163', '#FF8099', '#DC143C', '#FFC0CB', '#FFB6C1', '#FFB3BF', '#E32636'];
var winsLang = window.navigator.language;
var manifest = function(manifestUrl,element){
	var manifest = {};	
	manifest.element = element; //作用在哪個div
	manifest.canvasArray = []; //canvas array
	manifest.index = 1; //目前在哪個canvas的index
	manifest.currenCanvas ; //目前的canvas canvasArray[index] 
	manifest.leaflet; // leaflet 物件	
	manifest.id = manifestUrl;
	manifest.init = function(){
        var data1;
        data1 = GetJSON(manifest.id);
        manifest.canvasArray = data1.sequences[0].canvases;
        var div = $('<div id ="mapid"></div>');
        $(element).append(div);
        manifest.currenCanvas = manifest.canvasArray[0];
        manifest.leaflet = leafletMap(manifest.currenCanvas);
        manifest.add_chose_button(); 
		
	}	
	
	manifest.change = function(){
			manifest.leaflet.remove();
		    manifest.currenCanvas = manifest.canvasArray[manifest.index-1];
            manifest.leaflet = leafletMap(manifest.currenCanvas);
            manifest.add_chose_button(); 
	}	
  
	manifest.add_chose_button = function(){
		var div = $('<div class= "leaflet-control-layers leaflet-control" style="padding-top: 5px;"></div>');
		var left = $('<div class="leaflet-control-layers-base canvasBtn" ><span class="fa fa-chevron-left fa-2x" aria-hidden="true"> </span></div>');
		var input =  $('<div class="leaflet-control-layers-base canvasPage"><span></span></div>');
		var right = $('<div class="leaflet-control-layers-base canvasBtn" ><span class="fa fa-chevron-right fa-2x" aria-hidden="true"> </span></div>');
		var separatorL = $('<div class="vertical_separator" ></div>');
		var separatorR = $('<div class="vertical_separator"></div>');
		div.append(left,separatorL,input,separatorR,right);
		$($('.leaflet-bottom.leaflet-right')[0]).prepend(div);
		$($(input)[0]).html(manifest.index + '/'+ manifest.canvasArray.length );
		right.click(function(){
            console.log('right click');
			if( manifest.index +1 <= manifest.canvasArray.length){
				manifest.index = manifest.index+1 ;
				manifest.change();
			}else{alert('Out of Range');}
		});
		left.click(function(){
            console.log('left click');
			if(manifest.index-1 >= 1){
                
				manifest.index = manifest.index-1; 
				manifest.change();
			}else{alert('Out of Range');}
		});
	};
	return manifest;
}

var leafletMap = function(canvas){
    var viewer_offset = $('#main').offset();
    var annoArray = [];    
	for(var zoomtemp = 0 ;zoomtemp<18; zoomtemp++){
		if( Math.max(canvas.width,canvas.height) < 256*Math.pow(2,zoomtemp) ){break;}
	}
  
	var map = L.map('mapid',{        
        crs: L.CRS.Simple,
        center: [0, 0],
        zoom: 18
    });	
    $('#backgroundLabel').remove();
    var backgroundLabel = $('<div id = "backgroundLabel" class="scrollbar style-1"><span id="labelClose"> X </span></div>');
    $('body').append(backgroundLabel);
    $('#backgroundLabel').hide();
    
    
    var img_service_url = canvas.images[0].resource.service['@id'] + '/info.json';
	var iiif_layer = L.tileLayer.iiif(img_service_url).addTo(map);
    var drawnItems = L.featureGroup().addTo(map);
    var otherContent_url = canvas.otherContent[0]['@id'];
    if(otherContent_url != 'undefined'){
        var annotationlist = GetJSON(otherContent_url);
        annotation(annotationlist.resources);
    }
    
   
  
	
	var button_edit = $('<div class ="leaflet-button-pane" style="z-Index:6;left: 0;top: 0;position: relative;"></div>');
	var leaflet_objects = $('.leaflet-objects-pane');
	if(leaflet_objects.find('.leaflet-button-pane').length === 0){
		leaflet_objects.append(button_edit);		
		var editDiv = $('<div class= "leaflet-control-layers leaflet-control edit_button_group" style="padding-top: 5px;"></div>');				
		var separatorL = $('<div class="vertical_separator" ></div>');
		var separatorR = $('<div class="vertical_separator"></div>');
		editDiv.append(separatorL,separatorR);	
	}
    
    /*annotation*/
    function annotation(resources){
        $.each(resources, function(i, value) {
        var layer, shape;
        if (typeof value.on === 'object') {} else {
            //矩形
            shape = 'rectangle';
            var b = /xywh=(.*)/.exec(value.on)[1].split(',');
            var point = strToPoint(b);
            var latLng = L.latLngBounds(point.min, point.max);
            layer = L.rectangle(latLng);
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
                'htmlTag': '<div id="anno' + i + '" class="tipbox"><a class="tip" style="background-color:' + colorArray[i * 5 % 241] + ';"></a><a class="tipTitle">' + titleChars + '</a></div>',
                'color': colorArray[i * 5 % 241],
                'htmlDescribing': '<div id="contentDescribing' + i + '" class="tabcontent">' + chars + '</div>',
                'htmlMetadata': '<div id="contentMetadata' + i + '" class="tabcontent">' + metadata + '</div>'
            };
            var annolabel = $(annoData.htmlTag);
            $('#backgroundLabel').append(annolabel);
            var annoDetail = $('<div id="annoDetail' + i + '" class="annoDetail">' +
                '<div class="tab">' +
                '<button class="tablinks" id="describing' + i + '" >describing</button>' +
                '<button class="tablinks" id="metadata' + i + '">metadata</button>' +
                '</div>' +
                annoData.htmlDescribing + annoData.htmlMetadata +
                '</div>');
            $('#backgroundLabel').append(annoDetail);
            $('#annoDetail' + i).hide();
            $('#anno' + i).click(function() {
                annoClick(i, metadata);
            });
            $('#describing' + i).click(function() {
                openTab('contentDescribing' + i, 'describing' + i, 'contentMetadata' + i, 'metadata' + i, i, 0);
            });
            $('#metadata' + i).click(function() {
                openTab('contentMetadata' + i, 'metadata' + i, 'contentDescribing' + i, 'describing' + i, i, value.metadata.length);
            });
            annoArray.push(annoData);

        }

    });
    }
    
    
   
    /*openTab*/
    function openTab(on1, on2, off1, off2, i, num) {
        document.getElementById(on1).style.display = "block";
        document.getElementById(on2).className += " active";
        document.getElementById(off1).style.display = "none";
        document.getElementById(off2).className = document.getElementById(off2).className.replace(" active", "");
        if (num != 0) {
            var h = 20 + num * 40;
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
                val.value.forEach((lan)=>{
                    if(lan['@language'] == winsLang){
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
    function annoClick(i, metadata) {
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
        return str.substring(0, 6) + '...';
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
    /*mousemove on map var*/
    var preMouseStatus = '';
    /*為annotation添增mousemove事件*/
    map.on('mousemove', function(event) {
        var lat = event.latlng.lat;
        var lng = event.latlng.lng;
        var latLng = event.latlng;
        var point = map.latLngToContainerPoint(latLng);
        var str = '';
        var anno_latLng_array_IDs = [];
        annoMousemove(latLng, str, anno_latLng_array_IDs);
        if (anno_latLng_array_IDs.length != 0) {
            $('#labelClose').click(function() {
                $('#backgroundLabel').hide();
            });
            //關閉label
            $('#backgroundLabel').show();
        } else {
            $('#backgroundLabel').hide();
        }
        bgLabelPosition(point);
    });
    
    
    
    
    /*check mouse on annotation*/
    function annoMousemove(latLng, str, anno_latLng_array_IDs) {
        for (var i = 0; i < annoArray.length; i++) {
            hasAnno(latLng, annoArray[i], anno_latLng_array_IDs, i);
        }
    }
    /*Label position*/
    function bgLabelPosition(point) {
        var midy = ($('#backgroundLabel').height()) / 2;
        $('#backgroundLabel').css({
            'left': point.x + viewer_offset.left,
            'top': point.y - midy + viewer_offset.top
        });
    }
    /* is mousemove on annotation */
    function hasAnno(latLng, arr, anno_latLng_array_IDs, i) {
        if ((latLng.lat < arr.point.min.lat) && (latLng.lat > arr.point.max.lat) && (latLng.lng > arr.point.min.lng) && (latLng.lng < arr.point.max.lng)) {
            if (arr.preMouseStatus != 'mouseenter') {
                mouseenter(arr);
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
        //console.log('anno'+arr.i+' mouseleave');
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
        return div.innerText;
    }
    
	return map;
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
