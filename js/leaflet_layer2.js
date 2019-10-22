
function main(e){
    var childElement = $(e.target.children[0]);
    var url = childElement.attr('data-url');
    var gparentElement = $(e.target.parentElement.parentElement);
    gparentElement.attr('id','main');
    $(e.target.parentElement).remove();
    var iframe = $('<iframe src="http://demo.dev.annotation.taieol.tw/leaflet_work4.html?manifest='+url+'" frameborder="0" width="700px" height="700px"></iframe>');
    var div = $('<div id ="mapid" class="mapid"></div>');           
    $($('#main')[0].parentElement).append(iframe);
            
}
