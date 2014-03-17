var PIGMAZE = {
    Game: function() {
        var _this = this;
        var maze, canvasRenderer, webGLRenderer, finishCell,
                isGameOver = false, gameStarted = false,
                randomSoundsInterval,
                timeStarted, timerInterval, $timer;

        this.pigObject;
        this.pigObjectScale = 200;

        var sounds = {
            random: [
                new Audio('assets/sounds/pig_1.mp3'),
                new Audio('assets/sounds/pig_2.mp3'),
                new Audio('assets/sounds/pig_3.mp3')
            ],
            finish: new Audio('assets/sounds/pig_long.mp3')
        }

        this.start = function() {
            maze = new MAZE.Maze();
            maze.generate();

            // Get random finish cell on N wall
            finishCell = maze.getCell(_.random(0, 10), 0);
            //finishCell = maze.getCell(5, 9);

            finishCell.isFinish = true;

            console.log('FINISH', finishCell.x, finishCell.y);

            canvasRenderer = new MAZE.Renderer.Canvas({
                container: '#maze-map-container'
            });

            maze.render(canvasRenderer);
            webGLRenderer = new MAZE.Renderer.WebGL({
                container: '#maze-container',
                onCellChange: function(cell) {
                    if (cell == null)
                        return;

                    if (cell.x != canvasRenderer.currentCellX || cell.y != canvasRenderer.currentCellY)
                    {
                        canvasRenderer.currentCellX = cell.x;
                        canvasRenderer.currentCellY = cell.y;

                        console.log(cell.x, cell.y);
                        console.log('CELL', cell.pos);

                        canvasRenderer.c2d.clearRect(0, 0, canvasRenderer.canvas.width(), canvasRenderer.canvas.height());
                        canvasRenderer.render();
                    }

                    _this.onCellChange(cell);
                },
                onFreeze: function(frozen) {
                    if (!gameStarted) {
                        gameStarted = true;
                        _this.gameStart();
                    }

                    $('#maze-map-container-wrapper').toggle(frozen);

                    canvasRenderer.c2d.clearRect(0, 0, canvasRenderer.canvas.width(), canvasRenderer.canvas.height());
                    canvasRenderer.render();
                }
            });
            maze.render(webGLRenderer);

            // Load pig model
            var loader = new THREE.OBJMTLLoader();
            loader.load('assets/models/pig/pig.obj', 'assets/models/pig/pig.mtl', function(pigObject) {

                pigObject.position.x = finishCell.pos.x - webGLRenderer.options.cellHeight / 2;
                pigObject.position.y = 0;
                pigObject.position.z = finishCell.pos.z + webGLRenderer.options.cellWidth / 2;
//                pigObject.position.x = webGLRenderer.camera.position.x;
//                pigObject.position.y = 0;
//                pigObject.position.z = webGLRenderer.camera.position.z;
                pigObject.rotation.y = -Math.PI / 2;
                var s = _this.pigObjectScale;
                pigObject.scale.set(s, s, s);
                webGLRenderer.scene.add(pigObject);
                _this.pigObject = pigObject;

            });

            // Random pig sounds every 15 seconds
            randomSoundsInterval = setInterval(function() {
                var sound = _.sample(sounds.random);
                sound.play();
            }, 15000)
        }

        this.onCellChange = function(cell) {
            if (cell == finishCell)
            {
                _this.gameOver();
            }
        }

        this.gameOver = function() {
            if (isGameOver)
                return;

            isGameOver = true;

            for (var i in sounds.random)
            {
                clearInterval(randomSoundsInterval);
                sounds.random[i].pause();
            }

            sounds.finish.play();

            var rotationStep = 0.2;
            var rotatePigInterval = setInterval(function() {
                _this.pigObject.rotation.y += rotationStep;
                rotationStep += 0.01
            }, 10);

            var shrinkPigInterval = setInterval(function() {
                if (_this.pigObjectScale == 0)
                {
                    clearInterval(shrinkPigInterval);
                    clearInterval(rotatePigInterval);
                }

                _this.pigObject.scale.set(_this.pigObjectScale, _this.pigObjectScale, _this.pigObjectScale);
                _this.pigObjectScale--;
            }, 200);

            clearInterval(timerInterval);
            _this.flashText('Hooray! You found the pig!');
            console.log('Game Over!');
        }

        this.gameStart = function() {
            $('.pigmaze-hint').hide();
            _this.flashText('Find the pig!');
            _this.startTimer();
        }

        this.setGodMode = function(enableGodmode)
        {
            webGLRenderer.setGodmode(enableGodmode);
        }

        this.flashText = function(text) {
            $('<p id="flash-text">' + text + '</p>')
                    .appendTo(document.body)
                    .delay(3000)
                    .fadeOut(1000, function() {
                        $(this).remove();
                    });
        }

        var timeEnd = Date.now();
            
        this.getTimeElapsed = function() {
            var timeDiff = timeEnd - timeStarted;
            var timeDiff = timeDiff / 1000;
            var seconds = Math.round(timeDiff % 60);
            timeDiff = Math.floor(timeDiff / 60);
            var minutes = Math.round(timeDiff % 60);
            return minutes + ':' + ("00" + seconds).slice(-2);
        };

        this.startTimer = function() {
            timeStarted = Date.now();
            $timer = $('<p id="pigmaze-timer">0:00</p>');
            $timer.appendTo(document.body);
            timerInterval = setInterval(function() {
                timeEnd = Date.now();
                $timer.text(_this.getTimeElapsed());
            }, 1000)
        }
    }
}