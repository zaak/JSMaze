MAZE.Renderer.Canvas = function(options) {
    this.canvas = undefined;
    this.c2d = undefined;

    this.canvasWidth = undefined;
    this.canvasHeight = undefined;

    this.options = {
        cellWidth: 10,
        cellHeight: 10,
    }
    
    this.currentCellX;
    this.currentCellY;

    $.extend(this.options, options);

    if (!options.container) {
        throw "Canvas Renderer 'container' option is not specipied!";
    }

    this.renderCell = function(cell) {
        var cw = this.options.cellWidth;
        var ch = this.options.cellHeight;

        if (cell.walls.N)
        {
            this.c2d.beginPath();
            this.c2d.moveTo(cell.x * cw, cell.y * ch + 0.5);
            this.c2d.lineTo(cell.x * cw + cw, cell.y * ch + 0.5);
            this.c2d.stroke();
        }

        if (cell.walls.E)
        {
            this.c2d.beginPath();
            this.c2d.moveTo(cell.x * cw + cw - 0.5, cell.y * ch);
            this.c2d.lineTo(cell.x * cw + cw - 0.5, cell.y * ch + ch);
            this.c2d.stroke();
        }

        if (cell.walls.S)
        {
            this.c2d.beginPath();
            this.c2d.moveTo(cell.x * cw, cell.y * ch + ch - 0.5);
            this.c2d.lineTo(cell.x * cw + cw, cell.y * ch + ch - 0.5);
            this.c2d.stroke();
        }

        if (cell.walls.W)
        {
            this.c2d.beginPath();
            this.c2d.moveTo(cell.x * cw + 0.5, cell.y * ch);
            this.c2d.lineTo(cell.x * cw + 0.5, cell.y * ch + ch);
            this.c2d.stroke();
        }

//        if (!cell.isMaze)
//        {
//            this.c2d.fillRect(cell.x * cw, cell.y * ch, cw, ch);
//        }

        if(this.currentCellX === cell.x && this.currentCellY === cell.y) {
            this.c2d.save();
            this.c2d.fillStyle = "#f00";
            this.c2d.fillRect(cell.x * cw + 2, cell.y * ch + 2 , cw - 4, ch - 4);
            this.c2d.restore();
        }
    }
}

MAZE.Renderer.Canvas.prototype = new MAZE.Renderer.Abstract();

MAZE.Renderer.Canvas.prototype.init = function(maze) {
    MAZE.Renderer.Abstract.prototype.init.call(this, maze);
    
    this.canvasWidth = this.maze.getWidth() * this.options.cellWidth;
    this.canvasHeight = this.maze.getHeight() * this.options.cellHeight;

    this.canvas = $('<canvas />')
                    .attr('width', this.canvasWidth)
                    .attr('height', this.canvasHeight)
                    .css('border', '1px solid')
                    .appendTo($(this.options.container));
            
    this.c2d = this.canvas[0].getContext('2d');
}
