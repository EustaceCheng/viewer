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
            var iframeSrc = 'http://demo.dev.annotation.taieol.tw/leaflet_work5.html?manifest='+url;
            var iframe = $('<iframe  class="iframe" src="'+iframeSrc+'" frameborder="0" width="100%" height="100%" scrolling="no"></iframe>');
            console.log(iframeSrc);
            var div = $('<div id ="mapid'+i+'" class="mapid"></div>');           
            $($('#main' + i)[0].parentElement).append(iframe);
            $('#main' + i).remove();           
            $('.carousel-control-prev').remove();
            $('.carousel-control-next').remove();
        }
    }
})(jQuery);