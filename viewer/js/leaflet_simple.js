(function($) {
    var index = 3; //page       
    $.fn.leaflet = function() {
        
        var manifestUrl = $('#manifest').text();        
        var manifest = GetJSON(manifestUrl); 
        var canvas = manifest.sequences[0].canvases[index];        
        var url = canvas.images[0].resource.service['@id'] + '/info.json';
        
        
        var viewer = $('<div id="viewer" class="iiif-viewer"></div>');
        $('body').append(viewer);
        var map = L.map('viewer', {crs: L.CRS.Simple,center: [0, 0],zoom: 18});


       var iiifLayer = L.tileLayer.iiif(url).addTo(map);
        
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

})(jQuery)