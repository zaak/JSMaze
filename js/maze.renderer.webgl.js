MAZE.Renderer.WebGL = function(options) {

    this.scene = new THREE.Scene();
    this.groundMaterial = undefined;
    this.groundGeometry = undefined;
    this.wallMaterial = undefined;
    this.wallGeometry = undefined;
    this.wall = undefined;

    this.options = {
        cellWidth: 1000,
        cellHeight: 1000
    };

    $.extend(this.options, options);

    if (!options.container) {
        throw "WebGL Renderer 'container' option is not specipied!";
    }

    this.renderCell = function(cell) {
        var cw = this.options.cellWidth;
        var ch = this.options.cellHeight;
        var gw = this.maze.options.width * cw;
        
        var cellGround = new THREE.Mesh(this.groundGeometry, this.groundMaterial);
        cellGround.position.x = -cell.y * cw - (cw / 2) - 25;
        cellGround.position.z = cell.x * ch;
        cellGround.rotation.x = - Math.PI / 2;
        this.scene.add(cellGround);

        if (cell.walls.N)
        {
            var wallN = new THREE.Mesh(this.wallGeometry, this.wallMaterial);
            
            wallN.position.x = -cell.y * cw - 50;
            wallN.position.y = (ch / 2);
            wallN.position.z = cell.x * ch;
            
            wallN.rotation.y = - Math.PI / 2;
            this.scene.add(wallN);
        }
        
        if (cell.walls.E)
        {
            var wallE = new THREE.Mesh(this.wallGeometry, this.wallMaterial);
            
            wallE.position.x = -cell.y * cw - (cw / 2) - 25;
            wallE.position.y = (ch / 2);
            wallE.position.z = cell.x * ch + (ch / 2) - 25;
            
            this.scene.add(wallE);
        }
        
        if (cell.walls.S)
        {
            var wallS = new THREE.Mesh(this.wallGeometry, this.wallMaterial);
            
            wallS.position.x = -cell.y * cw - ch;
            wallS.position.y = (ch / 2);
            wallS.position.z = cell.x * ch;
            
            wallS.rotation.y = - Math.PI / 2;
            this.scene.add(wallS);
        }
        
        if (cell.walls.W)
        {
            var wallW = new THREE.Mesh(this.wallGeometry, this.wallMaterial);
            
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
    //scene.fog = new THREE.Fog( 0xcce0ff, 500, 100000 );
    
    var camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 40000);
    camera.position.x = -10700;
    camera.position.y = 330;
    camera.position.z = 5000;
        
    this.camera = camera;
    
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth-20, window.innerHeight-20);
    //renderer.setClearColor( scene.fog.color );
				renderer.gammaInput = true;
				renderer.gammaOutput = true;
    $(this.options.container).append(renderer.domElement);
    

    
    var controls = new THREE.FirstPersonControls(camera);
    controls.movementSpeed = 1;
    controls.lookSpeed = 0.0001;
    controls.lookVertical = false;
    
    // add subtle blue ambient lighting
    var ambientLight = new THREE.AmbientLight(0x666666);
    scene.add(ambientLight);
    
    // directional lighting
    var directionalLight = new THREE.DirectionalLight(0xffffff, 1.7);
    directionalLight.position.set( 50, 200, 100 ).normalize();
    directionalLight.position.multiplyScalar( 1.3 );

    scene.add(directionalLight);
    
    // Floor
    this.groundGeometry = new THREE.PlaneGeometry(this.options.cellWidth, this.options.cellHeight);
    
    var initColor = new THREE.Color( 0x497f13 );
    var initTexture = THREE.ImageUtils.generateDataTexture( 1, 1, initColor );

    this.groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: initTexture } );

    var that = this;
    var groundTexture = THREE.ImageUtils.loadTexture( "assets/textures/grasslight-big.jpg", undefined, function() { that.groundMaterial.map = groundTexture; } );
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(2, 2);
    groundTexture.anisotropy = 16;

    
    // Maze cell wall
    this.wallGeometry = new THREE.CubeGeometry(this.options.cellWidth, this.options.cellHeight, 50);
    var wallInitColor = new THREE.Color(0x880000);
    var wallInitTexture = THREE.ImageUtils.generateDataTexture( 1, 1, wallInitColor );
    
    this.wallMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: wallInitTexture } );
    var wallTexture = THREE.ImageUtils.loadTexture( "assets/textures/bricks.jpg", undefined, function() { that.wallMaterial.map = wallTexture; } );
    wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(10, 10);
    wallTexture.anisotropy = 16;
    
    // stats
    var stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    $(this.options.container).append(stats.domElement);
        
    function hasCollision() {
        var camX = camera.position.x;
        var camZ = camera.position.z;
        
        
    }
    
    var time = Date.now();
    var render = function() {
        requestAnimationFrame(render);
        stats.update();
        if(hasCollision())
            return;
        controls.update(Date.now() - time);
        renderer.render(scene, camera);
        time = Date.now();
    };
    
    render();
}
