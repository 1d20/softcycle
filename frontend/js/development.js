(function(window) {
    var wrapper;
    var appender;
    var code;
    var arr =[];
    var codeToWrite = [];
    var filePath = "static/frontend/js/vendors.js";

    function init() {
        $.get(filePath, function(data) {
        	code = data;
            console.log(data);
            arr = code.split('\n');
	        wrapper = $('#game');
	        $('#game').append('<pre id="precode"></pre>')
	        appender = $('#precode');
	        codeToWrite = angular.copy(arr);

	        $(document).on('keypress', keyListener);
        });
        
    }

    function keyListener(e) {
        write();
        $('html, body').animate({ scrollTop: appender.height() }, 50); 
    }


    function write() {
        var word = '<br>' + codeToWrite.shift();
        appender.append(word);
        //console.log(wrapper, word);
    }

    function destroy() {
        $(document).off(keyListener);
    }

    window['GameStage6'] = {
        init: init,
        destroy: destroy,
        game: {
            result: 0,
            finished: false
        }
    };
})(window);