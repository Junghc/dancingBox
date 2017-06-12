var time = 0;
var k=1;
var gamestart = 0;
var bgm;
var fall=1;
var move;
var wintime = 0;
var clickstart = 0;
var gameisgg = 0;
var isend=0;
function init(){
	bgm = document.getElementById("bgm");
	bgm.play();
	var engine = initEngine();
	var scene = createScene(engine);
	
	var camera = createCamera(scene);
	//camera.attachControl(engine.getRenderingCanvas());
	
	scene.activeCamera = camera;
	//create mainobj
	
	var Me = new BABYLON.Mesh.CreateBox('box',0.8,scene);
	Me.position = new BABYLON.Vector3(0,0.5,1);
	
	var materialMe = new BABYLON.StandardMaterial("textureMe", scene);
	materialMe.diffuseTexture = new BABYLON.Texture("pic/crate.png", scene);
	Me.material = materialMe;
	
	
	//change direction
	var direction=0;
	window.addEventListener("keydown", function (evt) {
		// Press spacebar to change direction
		if (evt.keyCode === 13 &&gamestart ==0 && clickstart==1 ){
			timer();
			musicstart();
			clearInterval(move);
			gamestart = 1;
			direction = DirectionClock(direction);
			move = setInterval(function(){ Move(Me,scene,direction) }, 30);
		}
		
	});
	window.addEventListener("keydown", function (evt) {
		// Press spacebar to change direction
		if (evt.keyCode === 32 && gamestart == 1 && time<301) { 
			clearInterval(move);

		
			
			
			direction = DirectionClock(direction);
			move = setInterval(function(){ Move(Me,scene,direction) }, 30);
			
		}
	});
	
	
	
	engine.runRenderLoop(function () {
            scene.render();
    });
}

function initEngine() {
    // Get the canvas element from index.html
    var canvas = document.getElementById("renderCanvas");
    // Initialize the BABYLON 3D engine
    var engine = new BABYLON.Engine(canvas, true);

    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
        engine.resize();
    });

    return engine;
}

function createScene(engine){
	var scene = new BABYLON.Scene(engine);
	var light1 =  new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(-8, -5, 2), scene);

	createMap(scene);
	createSkyBox(scene);
	return scene;
}

function musicstart(){
	bgm = document.getElementById("music");
	bgm.play();
}


function createCamera(scene){
	var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", -1.4, 0.8, 20, new BABYLON.Vector3(0,0,0), scene);
	return camera;
}

function createSkyBox(scene){
	var skybox = BABYLON.Mesh.CreateBox("skyBox", 2000.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
	
	return scene;
}

function Move(Me,scene,direction){
	check(Me,time);
	if(time>300&&gameisgg ==0)
		win(Me,scene);
	if(direction == 1){
			Me.position.z+=0.3
			scene.activeCamera.target.z+=0.3;
			return scene;}
	if(direction == 2){
			var now = Me.position;
			now.x-=0.3;
			scene.activeCamera.target.x-=0.3;
			return scene;}
	if(direction == 5){
			Me.position.z+=0.3
			scene.activeCamera.target.z+=0.3;
			scene.activeCamera.target.y+=0.1;
			return scene;}
}

function DirectionClock(direction){
	if(direction==2)
		direction=1;
	else
		direction++;
	
	return direction;
}

function timer(){
	setInterval(function(){ clock() },100);
}

function clock(){
	time++;
}

function gg(Me){
	gameisgg = 1;
	if (fall==1){
	fallsound=document.getElementById("fall");
	fallsound.play();
	fall=0;}
	setInterval(function(){ drop(Me) }, 30);
}

function drop(Me){
	Me.position.y-=0.05;
	if(Me.position.y<-10&&isend==0){
		isend=1;
		end();}
}

function end(){
	clearInterval(move);
	bgm.pause();
	bgm = document.getElementById("gg");
	bgm.play();
	$(".endPage").css("display", "block");
}

function restart(){
	location.reload();
}

function win(Me,scene){
	if(time>320){
		
	bgm.pause();
	bgm = document.getElementById("win");
	bgm.play();}
	if(Me.position.z<166.5){
		clearInterval(move);
		move = setInterval(function(){ Move(Me,scene,5) }, 30);}
	else{
		clearInterval(move);
		winfunc(scene);}
}

function winfunc(scene){
	setInterval(function(){ wintimec() }, 1000);
	var floor = BABYLON.MeshBuilder.CreateBox('box', flo, scene);
	floor.position = new BABYLON.Vector3(-147,-0.25,166.5);
	var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene, );
	particleSystem.particleTexture = new BABYLON.Texture("pic/flare.png", scene);
	particleSystem.emitter = floor;
	var materialPath = new BABYLON.StandardMaterial("texture1", scene);
	materialPath.diffuseTexture = new BABYLON.Texture("textures/grass.jpg", scene);
	floor.material = materialPath;
	particleSystem.minEmitBox = new BABYLON.Vector3(-5, 0, -5); // Starting all from
    particleSystem.maxEmitBox = new BABYLON.Vector3(5, 0, 5); // To...
	particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
	particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
	particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
	particleSystem.minSize = 0.1;
	particleSystem.maxSize = 0.5;
	particleSystem.minLifeTime = 0.3;
	particleSystem.maxLifeTime = 1.5;
	particleSystem.emitRate = 1000;
	particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
	particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
	particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);
	particleSystem.start();
}
function starts(){
	$(".startPage").css("display", "none");
	clickstart=1;
	bgm.pause();
}
function wintimec(){
	wintime++;
	if(wintime==4){
		$(".winPage").css("display", "block");
	}
}

function helpon(){
	$(".startPage").css("display", "none");
	$(".helpPage").css("display", "block");
}

function helpoff(){
	$(".startPage").css("display", "block");
	$(".helpPage").css("display", "none");
}