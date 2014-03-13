MAZE.Renderer.WebGL = function(options) {
    
    this.options = { }

    $.extend(this.options, options);

    if (!options.container) {
        throw "WebGL Renderer 'container' option is not specipied!";
    }

    this.renderCell = function(cell) {

    }
}

MAZE.Renderer.WebGL.prototype = MAZE.AbastractRenderer;

MAZE.Renderer.WebGL.prototype.init = function(maze) {
    MAZE.Renderer.Abstract.prototype.init.call(this, maze);
}
