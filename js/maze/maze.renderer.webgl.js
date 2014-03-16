MAZE.Renderer.WebGL = function(options) {

    this.scene = new THREE.Scene();
    this.groundMaterial = undefined;
    this.finishGroundMaterial = undefined;
    this.groundGeometry = undefined;
    this.wallMaterial = undefined;
    this.crateWallMaterial = undefined;
    this.wallGeometry = undefined;
    this.wall = undefined;
    this.godmode = false;

    this.options = {
        cellWidth: 1000,
        cellHeight: 1000,
        onCellChange: null,
        onFreeze: null
    };

    $.extend(this.options, options);

    if (!options.container) {
        throw "WebGL Renderer 'container' option is not specipied!";
    }
    
    this.setGodmode = function(enableGodmode)
    {
        this.godmode = enableGodmode;
    }

    this.renderCell = function(cell) {
        var cw = this.options.cellWidth;
        var ch = this.options.cellHeight;
        var gw = this.maze.options.width * cw;
        
        var cellGround = new THREE.Mesh(this.groundGeometry, cell.isFinish ? this.finishGroundMaterial : this.groundMaterial);
        cellGround.position.x = -cell.y * cw - (cw / 2) - 25;
        cellGround.position.z = cell.x * ch;
        cellGround.rotation.x = - Math.PI / 2;
        this.scene.add(cellGround);
        
        cell.pos = {
            x: -cell.y * cw,
            z: cell.x * ch - (ch / 2)
        }

        var wallMaterial = cell.isFinish ? this.crateWallMaterial : this.wallMaterial;
        if (cell.walls.N)
        {
            var wallN = new THREE.Mesh(this.wallGeometry, wallMaterial);
            
            wallN.position.x = -cell.y * cw - 50;
            wallN.position.y = (ch / 2);
            wallN.position.z = cell.x * ch;
            
            wallN.rotation.y = - Math.PI / 2;
            this.scene.add(wallN);
        }
        
        if (cell.walls.E)
        {
            var wallE = new THREE.Mesh(this.wallGeometry, wallMaterial);
            
            wallE.position.x = -cell.y * cw - (cw / 2) - 25;
            wallE.position.y = (ch / 2);
            wallE.position.z = cell.x * ch + (ch / 2) - 25;
            
            this.scene.add(wallE);
        }
        
        if (cell.walls.S)
        {
            var wallS = new THREE.Mesh(this.wallGeometry, wallMaterial);
            
            wallS.position.x = -cell.y * cw - ch;
            wallS.position.y = (ch / 2);
            wallS.position.z = cell.x * ch;
            
            wallS.rotation.y = - Math.PI / 2;
            this.scene.add(wallS);
        }
        
        if (cell.walls.W)
        {
            var wallW = new THREE.Mesh(this.wallGeometry, wallMaterial);
            
            wallW.position.x = -cell.y * cw - (cw / 2) - 25;
            wallW.position.y = (ch / 2);
            wallW.position.z = cell.x * ch - (ch / 2) + 25;
            
            this.scene.add(wallW);
        }
        
    }
}

MAZE.Renderer.WebGL.prototype = new MAZE.Renderer.Abstract();

MAZE.Renderer.WebGL.prototype.init = function(maze) {
    MAZE.Renderer.Abstract.prototype.init.call(this, maze);

    var scene = this.scene;
    scene.fog = new THREE.Fog( 0xcce0ff, 500, 100000 );
    
    // ambient lighting
    var ambientLight = new THREE.AmbientLight(0x666666);
    scene.add(ambientLight);
    
    // directional lighting
    var directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set( 50, 200, 100 ).normalize();
    directionalLight.position.multiplyScalar( 1.3 );

    scene.add(directionalLight);
    
    // Floor
    this.groundGeometry = new THREE.PlaneGeometry(this.options.cellWidth, this.options.cellHeight);
    
    var initColor = new THREE.Color( 0x497f13 );
    var initTexture = THREE.ImageUtils.generateDataTexture( 1, 1, initColor );

    this.groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: initTexture } );

    var _this = this;
    var groundTexture = THREE.ImageUtils.loadTexture( "assets/textures/grasslight-big.jpg", undefined, function() { _this.groundMaterial.map = groundTexture; } );
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(1, 1);
    groundTexture.anisotropy = 16;
    
    // Hay texture
    this.finishGroundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: initTexture } );
    var finishGroundTexture = THREE.ImageUtils.loadTexture( "assets/textures/hay.jpg", undefined, function() { _this.finishGroundMaterial.map = finishGroundTexture; } );
    finishGroundTexture.wrapS = finishGroundTexture.wrapT = THREE.RepeatWrapping;
    finishGroundTexture.repeat.set(4, 4);
    finishGroundTexture.anisotropy = 16;
    
    // Maze cell wall
    this.wallGeometry = new THREE.CubeGeometry(this.options.cellWidth, this.options.cellHeight, 50);
    var wallInitColor = new THREE.Color(0x880000);
    var wallInitTexture = THREE.ImageUtils.generateDataTexture( 1, 1, wallInitColor );
    
    this.wallMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: wallInitTexture } );
    var wallTexture = THREE.ImageUtils.loadTexture( "assets/textures/bricks.jpg", undefined, function() { _this.wallMaterial.map = wallTexture; } );
    wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(10, 10);
    wallTexture.anisotropy = 4;
    
    // Maze cell wall
    this.crateWallGeometry = new THREE.CubeGeometry(this.options.cellWidth, this.options.cellHeight, 50);
    var crateWallInitColor = new THREE.Color(0x880000);
    var crateWallInitTexture= THREE.ImageUtils.generateDataTexture( 1, 1, crateWallInitColor );
    
    this.crateWallMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: crateWallInitTexture} );
    var crateWallTexture = THREE.ImageUtils.loadTexture( "assets/textures/crate.gif", undefined, function() { _this.crateWallMaterial.map = crateWallTexture; } );
    crateWallTexture.wrapS = crateWallTexture.wrapT = THREE.RepeatWrapping;
    crateWallTexture.repeat.set(1, 1);
    crateWallTexture.anisotropy = 4;
    

}

MAZE.Renderer.WebGL.prototype.render = function() {
    MAZE.Renderer.Abstract.prototype.render.call(this);
    
    var camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 40000);
    camera.position.x = -10700;
    camera.position.y = 630;
    camera.position.z = 5000;
    
    camera.lookAt(new THREE.Vector3(-6000, 0, 5000));
        
    this.camera = camera;
    
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth-20, window.innerHeight-20);
    renderer.setClearColor(this.scene.fog.color);
				renderer.gammaInput = true;
				renderer.gammaOutput = true;
    $(this.options.container).append(renderer.domElement);
    

    
    var controls = new THREE.FirstPersonControls(camera);
    controls.movementSpeed = 1;
    controls.lookSpeed = 0.0001;
    controls.lookVertical = true;
    controls.freeze = true;
    controls.onFreeze = this.options.onFreeze;
    this.controls = controls;
    
    // stats
    var stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.left = '0px';
    $(document.body).append(stats.domElement);
    
    this.cellCollisionPadding = 100;
    
    var _this = this;
    var currentCell = null;
    
    function hasCollision() {
        
        var camX = camera.position.x;
        var camZ = camera.position.z;
        
        // Get cell x/y by camera position
        
        var cellX, cellY;
        cellY = Math.floor((camX * -1) / _this.options.cellWidth);
        cellX = Math.floor((camZ + _this.options.cellHeight / 2) / _this.options.cellHeight );
        
        if(currentCell == null || currentCell.x != cellX || currentCell.y != cellY)
        {
            currentCell = _this.maze.getCell(cellX, cellY);
            if(_this.options.onCellChange)
            {
                _this.options.onCellChange(currentCell);
            }
        }
        
        if(_this.godmode)
        {
            return false;
        }
        
        if(!currentCell)
            return true;

        if(currentCell.walls.N)
        {
            if(camX > currentCell.pos.x - _this.cellCollisionPadding)
            {
                console.log('Collison N');
                return true;
            }
        }
        
        if(currentCell.walls.E)
        {
            if(camZ > currentCell.pos.z + _this.options.cellWidth - _this.cellCollisionPadding)
            {
                console.log('Collison E');
                return true;
            }
        }
        
        if(currentCell.walls.S)
        {
            if(camX < currentCell.pos.x - _this.options.cellHeight + _this.cellCollisionPadding)
            {
                console.log('Collison S');
                return true;
            }
        }
        
        if(currentCell.walls.W)
        {
            if(camZ < currentCell.pos.z + _this.cellCollisionPadding)
            {
                console.log('Collison W');
                return true;
            }
        }
        
        return false;
    }
    
    var scene = this.scene;
    var time = Date.now();
    var lastValidPos = {};
    var render = function() {
        requestAnimationFrame(render);
        stats.update();
        if(hasCollision())
        {
            camera.position.set(lastValidPos.x, lastValidPos.y, lastValidPos.z);
        }
        else
        {
            lastValidPos.x = camera.position.x;
            lastValidPos.y = camera.position.y;
            lastValidPos.z = camera.position.z;
        }
        controls.update(Date.now() - time);
        renderer.render(scene, camera);
        time = Date.now();
    };
    
    render();
}