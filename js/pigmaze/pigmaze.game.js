var PIGMAZE = {
    Game: function() {
        var maze, canvasRenderer, webGLRenderer;



        this.start = function() {
            maze = new MAZE.Maze();
            maze.generate();

            canvasRenderer = new MAZE.Renderer.Canvas({
                container: '#maze-map-container'
            });

            maze.render(canvasRenderer);
            webGLRenderer = new MAZE.Renderer.WebGL({
                container: '#maze-container',
                onCellChange: function(cell) {
                    if (cell.x != canvasRenderer.currentCellX || cell.y != canvasRenderer.currentCellY)
                    {
                        canvasRenderer.currentCellX = cell.x;
                        canvasRenderer.currentCellY = cell.y;

                        console.log(cell.x, cell.y);
                        console.log('CELL', cell.pos);

                        canvasRenderer.c2d.clearRect(0, 0, canvasRenderer.canvas.width(), canvasRenderer.canvas.height());
                        canvasRenderer.render();
                    }
                }
            });
            maze.render(webGLRenderer);

            // Load pig model

            var loader = new THREE.OBJMTLLoader();
            loader.load('assets/models/pig/pig.obj', 'assets/models/pig/pig.mtl', function(object) {

                object.position.x = webGLRenderer.camera.position.x;
                object.position.y = webGLRenderer.camera.position.y;
                object.position.z = webGLRenderer.camera.position.z;
                object.scale.set(200, 200, 200)
                webGLRenderer.scene.add(object);

            });
        }
    }
}