(function(window) {

    var $scope;
    var finishGame;

    var time;

    const PUZZLEDIFFICULTY = 4;
    const PUZZLEHOVERTINT = '#009900';

    var stage;
    var canvas;

    var img;
    var pieces;
    var puzzleWidth;
    var puzzleHeight;
    var pieceWidth;
    var pieceHeight;
    var currentPiece;
    var currentDropPiece;

    var mouse;

    function init(scope, finish) {
        console.log('init called');
        $scope = scope;
        finishGame = finish;
        img = new Image();
        img.addEventListener('load', onImage, false);
        img.src = '/static/frontend/images/games/design/site1.png';
    }

    function destroy() {

    }

    /*function getOffsetSum(elem) {
        var top = 0,
            left = 0
        while (elem) {
            top = top + parseFloat(elem.offsetTop)
            left = left + parseFloat(elem.offsetLeft)
            elem = elem.offsetParent
        }

        return {
            top: Math.round(top),
            left: Math.round(left)
        }
    }*/


    function onImage(e) {
        //console.log('on Image called');
        pieceWidth = Math.floor(img.width / PUZZLEDIFFICULTY)
        pieceHeight = Math.floor(img.height / PUZZLEDIFFICULTY)
        puzzleWidth = pieceWidth * PUZZLEDIFFICULTY;
        puzzleHeight = pieceHeight * PUZZLEDIFFICULTY;
        setCanvas();
        initPuzzle();
    }

    function setCanvas() {
        game = document.getElementById('game');
        canvas = document.createElement('canvas');
        game.appendChild(canvas);
        stage = canvas.getContext('2d');
        canvas.width = puzzleWidth;
        canvas.height = puzzleHeight;
        canvas.style.border = "1px solid black";
    }

    function initPuzzle() {
        //console.log('initPuzzle called');
        pieces = [];
        mouse = {
            x: 0,
            y: 0
        };
        currentPiece = null;
        currentDropPiece = null;
        stage.drawImage(img, 0, 0, puzzleWidth, puzzleHeight, 0, 0, puzzleWidth, puzzleHeight);
        createTitle("Click to Start Puzzle");
        buildPieces();
    }

    function createTitle(msg) {
        stage.fillStyle = "#000000";
        stage.globalAlpha = .4;
        stage.fillRect(100, puzzleHeight - 40, puzzleWidth - 200, 40);
        stage.fillStyle = "#FFFFFF";
        stage.globalAlpha = 1;
        stage.textAlign = "center";
        stage.textBaseline = "middle";
        stage.font = "20px Arial";
        stage.fillText(msg, puzzleWidth / 2, puzzleHeight - 20);
    }

    function buildPieces() {
        var i;
        var piece;
        var xPos = 0;
        var yPos = 0;
        for (i = 0; i < PUZZLEDIFFICULTY * PUZZLEDIFFICULTY; i++) {
            piece = {};
            piece.sx = xPos;
            piece.sy = yPos;
            pieces.push(piece);
            xPos += pieceWidth;
            if (xPos >= puzzleWidth) {
                xPos = 0;
                yPos += pieceHeight;
            }
        }
        canvas.onmousedown = shufflePuzzle;
    }

    function shufflePuzzle(e) {
        e.preventDefault();

        var isClickOverCanvas = $('#game').find(e.target);

        if (!isClickOverCanvas.length) {
            return false;
        };

        pieces = shuffleArray(pieces);
        stage.clearRect(0, 0, puzzleWidth, puzzleHeight);
        var i;
        var piece;
        var xPos = 0;
        var yPos = 0;
        for (i = 0; i < pieces.length; i++) {
            piece = pieces[i];
            piece.xPos = xPos;
            piece.yPos = yPos;
            stage.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, xPos, yPos, pieceWidth, pieceHeight);
            stage.strokeRect(xPos, yPos, pieceWidth, pieceHeight);
            xPos += pieceWidth;
            if (xPos >= puzzleWidth) {
                xPos = 0;
                yPos += pieceHeight;
            }
        }
        canvas.onmousedown = onPuzzleClick;
        time = new Date();
    }

    function onPuzzleClick(e) {

        console.log(e.layerX, e.layerY);
        if (e.layerX || e.layerX == 0) {
            mouse.x = e.layerX - canvas.offsetLeft;
            mouse.y = e.layerY - canvas.offsetTop;
        } else if (e.offsetX || e.offsetX == 0) {
            mouse.x = e.offsetX - canvas.offsetLeft;
            mouse.y = e.offsetY - canvas.offsetTop;
        }
        //console.log(getOffsetSum(canvas));
        currentPiece = checkPieceClicked();
        console.log(currentPiece);
        if (currentPiece != null) {
            stage.clearRect(currentPiece.xPos, currentPiece.yPos, pieceWidth, pieceHeight);
            stage.save();
            stage.globalAlpha = .9;
            stage.drawImage(img, currentPiece.sx, currentPiece.sy, pieceWidth, pieceHeight, mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
            stage.restore();
            canvas.onmousemove = updatePuzzle;
            canvas.onmouseup = pieceDropped;
        }
    }

    function checkPieceClicked() {
        var i;
        var piece;
        //console.log(pieces);
        for (i = 0; i < pieces.length; i++) {
            piece = pieces[i];
            if (mouse.x < piece.xPos || mouse.x > (piece.xPos + pieceWidth) ||
                mouse.y < piece.yPos || mouse.y > (piece.yPos + pieceHeight)) {
                //PIECE NOT HIT
            } else {
                return piece;
            }
        }
        return null;
    }

    function updatePuzzle(e) {
        //console.log(e);
        currentDropPiece = null;
        if (e.layerX || e.layerX == 0) {
            mouse.x = e.layerX - canvas.offsetLeft ;
            mouse.y = e.layerY - canvas.offsetTop ;
        } else if (e.offsetX || e.offsetX == 0) {
            mouse.x = e.offsetX - canvas.offsetLeft ;
            mouse.y = e.offsetY - canvas.offsetTop ;
        }
        stage.clearRect(0, 0, puzzleWidth, puzzleHeight);
        var i;
        var piece;
        for (i = 0; i < pieces.length; i++) {
            piece = pieces[i];
            if (piece == currentPiece) {
                continue;
            }
            stage.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, piece.xPos, piece.yPos, pieceWidth, pieceHeight);
            stage.strokeRect(piece.xPos, piece.yPos, pieceWidth, pieceHeight);
            if (currentDropPiece == null) {
                if (mouse.x < piece.xPos || mouse.x > (piece.xPos + pieceWidth) || mouse.y < piece.yPos || mouse.y > (piece.yPos + pieceHeight)) {
                    //NOT OVER
                } else {
                    currentDropPiece = piece;
                    stage.save();
                    stage.globalAlpha = .4;
                    stage.fillStyle = PUZZLEHOVERTINT;
                    stage.fillRect(currentDropPiece.xPos, currentDropPiece.yPos, pieceWidth, pieceHeight);
                    stage.restore();
                }
            }
        }
        stage.save();
        stage.globalAlpha = .6;
        stage.drawImage(img, currentPiece.sx, currentPiece.sy, pieceWidth, pieceHeight, mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
        stage.restore();
        stage.strokeRect(mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
    }

    function pieceDropped(e) {
        canvas.onmousemove = null;
        canvas.onmouseup = null;
        if (currentDropPiece != null) {
            var tmp = {
                xPos: currentPiece.xPos,
                yPos: currentPiece.yPos
            };
            currentPiece.xPos = currentDropPiece.xPos;
            currentPiece.yPos = currentDropPiece.yPos;
            currentDropPiece.xPos = tmp.xPos;
            currentDropPiece.yPos = tmp.yPos;
        }
        resetPuzzleAndCheckWin();
    }

    function resetPuzzleAndCheckWin() {
        stage.clearRect(0, 0, puzzleWidth, puzzleHeight);
        var gameWin = true;
        var i;
        var piece;
        for (i = 0; i < pieces.length; i++) {
            piece = pieces[i];
            stage.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, piece.xPos, piece.yPos, pieceWidth, pieceHeight);
            stage.strokeRect(piece.xPos, piece.yPos, pieceWidth, pieceHeight);
            if (piece.xPos != piece.sx || piece.yPos != piece.sy) {
                gameWin = false;
            }
        }
        if (gameWin) {
            setTimeout(gameOver, 500);
        }
    }

    function gameOver() {
        canvas.onmousedown = null;
        canvas.onmousemove = null;
        canvas.onmouseup = null;
        // initPuzzle();

        var timeSpend = new Date();
        var score = 1200 - ~~((timeSpend - time) / 100);
        window['GameStage5'].game.score = score;
        window['GameStage5'].game.finished = true;
        $scope.$digest();
        finishGame();
    }

    function shuffleArray(o) {
        for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }

    window['GameStage5'] = {
        init: init,
        destroy: destroy,
        game: {
            result: 0,
            finished: false
        },
        rules: "Be creative and design your project!"
    };

})(window);