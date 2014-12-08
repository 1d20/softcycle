(function(window) {
    var game;
    var $scope;
    var finishGame;
    var submit;

    var correct = [
        'Title of Investment',
        'Originator',
        'Date',
        'Mission \ Goals',
        'Benefits',
        'Warranted Investment',
        'Funding'
    ];

    var wrong = [
        'Terms of Use',
        'Staff',
        'Time limits',
        'Privacy policy',
        'Programming languages'
    ];

    function init(scope, finish) {
        $scope = scope;
        finishGame = finish;

        game = $('#game');
        submit = $('<button id="submit" class="btn btn-success">Submit</button>');

        var all = correct.concat(wrong);

        all.shuffle();

        console.log(all);

        var html = '<form id="form">';

        for (var i = all.length - 1; i >= 0; i--) {
            html +=
                '<div class="checkbox">' +
                '   <label>' +
                '      <input type="checkbox" name="check[]" value="' + all[i] + '"> ' + all[i] + '</input>' +
                '   </label>' +
                '</div>';
        };

        html += '</form>';

        game.append(html);
        game.append(submit);

        submit.on('click', function(e) {
            e.preventDefault();
            checkResults();
        });
    };

    function checkResults() {
        var values = $('#form').serializeArray();

        var score = 0;

        for (var i = 0; i < values.length; i++) {
            if (correct.in_array(values[i].value)) {
                score++;
            } else {
                if (score > 0) {
                    score--;
                };
            }
        };

        window['GameStage1'].game.score = score;
        window['GameStage1'].game.finished = true;

        $scope.$digest();
        finishGame();
        destroy();
    };

    function destroy() {
        if (game) {
            game.empty();
        };
    };

    window['GameStage1'] = {
        init: init,
        destroy: destroy,
        game: {
            score: 0,
            finished: false
        }
        rules: 'Check out points that match most to the Concept Proposal'
    }
})(window);