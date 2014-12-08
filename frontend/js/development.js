(function(window) {
    var conf;
    var Time = 10000; //10sec
    var wrapper;
    var appender;
    var code;
    var state;
    var arr =[];
    var codeToWrite = [];
    var filePath = "static/frontend/js/vendors.js";
    var elapsed = 0;
    var interval;
    var finishGame;
    function init(scope, finish) {
        $scope = scope;
        finishGame = finish;
        conf = window['GameStage6'].game;
        console.log(game,conf);
        $.get(filePath, function(data) {
        	code = data;
            //console.log(data);
            arr = code.split('\n');
	        wrapper = $('#game');
            $('#game').append('<div id="state">Score: ' + conf.score +'</div>');
            state = $('#state');
	        $('#game').append('<pre id="precode"></pre>')
	        appender = $('#precode');
	        codeToWrite = angular.copy(arr);

	        $(document).bind( "keypress", keyListener );
            setTimeout(endFunc, Time);
            interval = setInterval(function(){
                var timeel = Time/1000 - elapsed;
                state.text('Score: ' + conf.score+ ' Time elapsed: ' + timeel);
                console.log(++elapsed);
            },1000);
        });
        
    }

    function destroy() {
        $(document).unbind( "keypress", keyListener );
    }

    function endFunc(){
        console.log('stopped');
        destroy();
        conf.finished = true;
        $('html, body').finish();
        $('html, body').animate({ scrollTop: 0 }, 1000);
        state.text('Congrats! Your Score: ' + conf.score);
        clearInterval(interval);
        finishGame();
    }

    function keyListener(e) {
        write();
        $('html, body').animate({ scrollTop: appender.height() }, 50); 
    }


    function write() {
        
        conf.score++;
        var word = '<br>' + codeToWrite.shift();
        appender.append(word);
        //console.log(wrapper, word);
    }


    window['GameStage6'] = {
        init: init,
        destroy: destroy,
        game: {
            score: 0,
            finished: false
        },
        rules: "Write the code! Faster! FASTERRR!!"
    };
})(window);