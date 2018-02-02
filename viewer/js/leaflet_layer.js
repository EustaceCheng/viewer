(function($) {
    $.fn.work = function() {         
        var _this = this;
        for(var i = 0; i<_this.length;i++){
            main(i);       
        }     
        function main(i){
            var frameElement = $(_this[i]);
            var url = frameElement.attr('data-url');
            frameElement.attr('id','main'+i);
            frameElement.removeAttr('src');
            var iframe = $('<iframe src="http://demo.dev.annotation.taieol.tw/leaflet_work4.html?manifest='+url+'" frameborder="0" width="100%" height="100%"></iframe>');
            var div = $('<div id ="mapid'+i+'" class="mapid"></div>');           
            $($('#main' + i)[0].parentElement).append(iframe);
            $('#main' + i).remove();           
        }
    }
})(jQuery);