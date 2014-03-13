var MAZE = {
    Maze: function(options) {
        this.options = {
            width: 11,
            height: 11,
            generator: MAZE.Generator.depthfirst
        }
                
        $.extend(this.options, options);
        
        this.cells = [];
        
        /**
         * Returns two dimensional array of Maze.Cell objects
         */
        this.generate = function() {
            // Fill grid with cells
            for(var x = 0; x < this.options.width; ++x)
            {
                // Nested array of cells
                var rArr = [];
                
                for(var y = 0; y < this.options.height; ++y)
                {
                    rArr[y] = new MAZE.Cell(x, y, this);
                }
                
                this.cells[x] = rArr;
            }
            
            // Generate maze
            this.options.generator.generate(this);
        }
        
        this.getCell = function(x, y) {
            if(x >= 0 && x < this.options.width && y >= 0 && y < this.options.height)
                return this.cells[x][y];
            
            return null;
        }
        
        this.getWidth = function() {
            return this.options.width;
        }
        
        this.getHeight = function() {
            return this.options.height;
        }
        
        this.removeWallBetween = function(c1, c2) {
            if(c1.x === c2.x)
            {
                var r = c1.y - c2.y;
                
                if(r == 1)
                {
                    c1.walls.N = c2.walls.S = false;
                }
                else if(r == -1)
                {
                    c1.walls.S = c2.walls.N = false;
                }
            }
            if(c1.y === c2.y)
            {
                
                var r = c1.x - c2.x;
                
                if(r == 1)
                {
                    c1.walls.W = c2.walls.E = false;
                }
                else if(r == -1)
                {
                    c1.walls.E = c2.walls.W = false;
                }
            }
        }
        
        this.render = function(renderer) {
            renderer.init(this);
            renderer.render();
        }
    },
    
    Cell: function(x, y, maze) {
        this.maze = maze;
        this.walls = {
            N: true,
            E: true,
            S: true,
            W: true
        }
        this.x = x;
        this.y = y;
        this.isMaze = false;
        
        this.getNeighbors = function()
        {
            return {
                N: maze.getCell(x, y-1),
                E: maze.getCell(x+1, y),
                S: maze.getCell(x, y+1),
                W: maze.getCell(x-1, y)                
            };
        }
    },
    
    Renderer: {
        Abstract: function() {
            this.maze = null;
        }
    },
    
    /**
     * http://en.wikipedia.org/wiki/Maze_generation_algorithm
     */
    Generator: {
        depthfirst: {
            processCell: function(cell) {
                var neighbors = cell.getNeighbors();
                cell.visited = true;
                
                var keys = _.shuffle(['N', 'E', 'S', 'W']);
                
                for(var k in keys)
                {
                    var i = keys[k];
                    if(neighbors[i] == null || neighbors[i].visited)
                        continue;
                    
                    neighbors[i].visited = true;
                    neighbors[i].isMaze = true;
                    
                    cell.maze.removeWallBetween(cell, neighbors[i]);
                    
                    this.processCell(neighbors[i]);
                }
            },            
            generate: function(maze) {
                var w = maze.options.width;
                var h = maze.options.height;
                var startingCell = maze.getCell(Math.floor(w/2), h-1);
                startingCell.isMaze = true;
                this.processCell(startingCell);
            }
        }
    }
}

MAZE.Renderer.Abstract.prototype.render = function() {
    for(var x = 0; x < this.maze.options.width; ++x)
    {
        for(var y = 0; y < this.maze.options.height; ++y)
        {
            this.renderCell(this.maze.getCell(x, y));
        }
    }
}

MAZE.Renderer.Abstract.prototype.init = function(maze) {
    this.maze = maze;
}

MAZE.AbastractRenderer = new MAZE.Renderer.Abstract();
