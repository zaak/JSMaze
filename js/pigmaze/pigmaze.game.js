var PIGMAZE = {
    Game: function() {
        var _this = this;
        var maze, canvasRenderer, webGLRenderer, finishCell, isGameOver = false;
        
        var sounds = {
            random: [
                new Audio('assets/sounds/pig_1.mp3'),
                new Audio('assets/sounds/pig_2.mp3'),
                new Audio('assets/sounds/pig_3.mp3')
            ],
            finish: new Audio('assets/sounds/pig_long.mp3')
        }
        
        var randomSoundsInterval;

        this.start = function() {
            maze = new MAZE.Maze();
            maze.generate();
            
            // Get random finish cell on N wall
            //finishCell = maze.getCell(_.random(0, 10), 0);
            finishCell = maze.getCell(5, 9);
            
            finishCell.isFinish = true;
            
            console.log('FINISH', finishCell.x, finishCell.y);

            canvasRenderer = new MAZE.Renderer.Canvas({
                container: '#maze-map-container'
            });

            maze.render(canvasRenderer);
            webGLRenderer = new MAZE.Renderer.WebGL({
                container: '#maze-container',
                onCellChange: function(cell) {
                    if(cell == null)
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
                pigObject.rotation.y = - Math.PI / 2;
                pigObject.scale.set(200, 200, 200)
                webGLRenderer.scene.add(pigObject);

            });
            
            // Random pig sounds every 15 seconds
            randomSoundsInterval = setInterval(function() {
                var sound = _.sample(sounds.random);
                sound.play();
            }, 15000)
        }
        
        this.onCellChange = function(cell) {
            if(cell == finishCell)
            {
                _this.gameOver();
            }
        }
        
        this.gameOver = function() {
            if(isGameOver)
                return;
            
            isGameOver = true;
            
            for(var i in sounds.random)
            {
                clearInterval(randomSoundsInterval);
                sounds.random[i].pause();
            }
            
            sounds.finish.play();
            console.log('Game Over!');
        }
        
        this.setGodMode = function(enableGodmode)
        {
            webGLRenderer.setGodmode(enableGodmode);
        }
    }
}