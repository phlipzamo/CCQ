
var runSelected = false;
function setRun(){
    runSelected = true;
}

class SceneMain extends Phaser.Scene {
    
    constructor() {
        super('SceneMain');
    }
    preload()
    {
    	this.load.atlas("astroid", "assets/astroid.png", "assets/astroid.json");
        this.load.image("wormhole", "assets/Wormhole.png");
        this.load.atlas("ufo", "assets/ufo.png", "assets/ufo.json");
        this.load.image("earth", "assets/earth.png");
        this.load.json('level', 'assets/Levels/levels.json');
        this.load.audio("background", "assets/space.ogg")
    }
    create() {
        this.stackOfActions=[]
        this.isMovingRight = false;
        this.isMovingLeft = false;
        this.isMovingBack = false;
        this.isMovingForward = false;
        this.running = false;
        this.complete = true;
        this.createLevel();
        this.animationCreate();
    
        this.physics.add.overlap(this.ufo, this.astroidGroup, (ufo, astroidGroup) =>
        {
            this.setPlayer(this.level.ufo);
        });
        this.physics.world.on('worldbounds', (body, up, down, left, right) =>
            {
                this.setPlayer(this.level.ufo);
            });
    }
    update() {
        this.earth.rotation += 0.005;
        /*this.astroidGroup.getChildren().forEach(function(item, index){
            item.rotation+=.015;
        })*/
    
        if(this.running){
            //if complete get next action
            if(this.complete){
                if(this.stackOfActions.length >0){
                    var action = this.stackOfActions.shift();
                    nextSelection();
                    if(action == "F"){
                        this.requestPlayerMoveForward();
                    }
                    else if (action == "B"){
                       this.requestPlayerMoveBack();
                    }
                    else if (action == "R"){
                       this.requestPlayerMoveRight()
                    }
                    else if (action == "L"){
                        this.requestPlayerMoveLeft();
                    }
                    else{
                        console.log("INVALID ACTION")
                    }
                } 
                else{
                    this.running = false;
                    this.stopMusic();
                }
            }

            if (this.isMovingRight )
            {
                this.rotateRight();
            }
            else if (this.isMovingLeft)
            {
                this.rotateLeft();
            }
            else if (this.isMovingBack)
            {
                this.moveBackward();
            }
            else if (this.isMovingForward)
            {
                this.moveForward();
            }
        }
        
        if (this.goalIndex == this.playerIndex)
        {
            Align.sizeReduce(this.ufo);
            if(this.ufo.displayWidth <10){
                this.setPlayer(this.level.ufo);
            }
        }
        if(runSelected){
            if(this.stackOfActions.length===0){
                this.playMusic()
                resetSelection();
                this.scriptData=getScript();
                this.parseData();
                runSelected = false;
            }
            else{
                //TODO Handle run selected while running
            }
        }

    }
    parseData(){
        const stringArray =  this.scriptData.split(/\r?\n/);
        stringArray.forEach(element => {
            if(element == "FORWARD"){
                this.stackOfActions.push("F");
            }
            else if(element == "ROTATE_RIGHT"){
                this.stackOfActions.push("R");
            }
            else if(element == "ROTATE_LEFT"){
                this.stackOfActions.push("L");
            }
            else if(element == "BACKWARD"){
                this.stackOfActions.push("B")
            }
        });
        this.running = true;
        this.complete = true;
        this.scriptData = ""
    }
    
    createLevel(){
        
        this.level = this.cache.json.get('level').level1;
        console.log(this.level);
        this.cols= this.level.col;
        this.rows=this.level.row;
        this.aGrid= new AlignGrid({scene: this, cols: this.cols, rows: this.rows});
        this.aGrid.showNumbers();
        this.earth=this.add.image(10,10,"wormhole");
        this.goalIndex = this.level.earth;
        this.aGrid.placeAndScaleAtIndex(this.goalIndex, this.earth);
        this.ufo = this.physics.add.sprite(10,10,"ufo").setCollideWorldBounds(true, 1, 1, true);
        this.ufo.body.onWorldBounds = true;
        this.playerIndex = this.level.ufo;
        this.aGrid.placeAndScaleAtIndex(this.playerIndex, this.ufo);
        this.playerAngle = 0;
        
       /* this.astroidGroup = this.physics.add.group();
        console.log(this.level);
        for(var i =0; i<this.level.astroids.length; i++){
            var astroid=this.add.image(10,10,"asteroid");
            this.astroidGroup.add(astroid);
            this.aGrid.placeAndScaleAtIndex(this.level.astroids[i].place, astroid);
        }*/
        this.astroid=this.physics.add.sprite(10,10,"astroid");
            
        this.aGrid.placeAndScaleAtIndex(1, this.astroid);
    }
    setPlayer(gridPosistion){
        this.isMovingRight = false;
        this.isMovingLeft = false;
        this.isMovingBack = false;
        this.isMovingForward = false;
        this.ufo.body.reset(0,0);
        this.playerIndex = gridPosistion;
        this.playerAngle = 0;
        this.aGrid.placeAndScaleAtIndex(this.playerIndex, this.ufo);
        this.ufo.angle = this.playerAngle;
        this.ufo.play("idle");
    }
    
    
    animationCreate(){
        this.anims.create({
            key: 'Forward',
            frames: this.anims.generateFrameNames('ufo', {start: 0, end: 5, zeroPad: 1, prefix: 'ufoF', suffix: '.png'}),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'Backward',
            frames: this.anims.generateFrameNames('ufo', {start: 0, end: 6, zeroPad: 1, prefix: 'ufoB', suffix: '.png'}),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'Left',
            frames: this.anims.generateFrameNames('ufo', {start: 0, end: 6, zeroPad: 1, prefix: 'ufoR', suffix: '.png'}),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'Right',
            frames: this.anims.generateFrameNames('ufo', {start: 0, end: 6, zeroPad: 1, prefix: 'ufoL', suffix: '.png'}),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames('ufo', {start: 0, end: 0, zeroPad: 1, prefix: 'ufoL', suffix: '.png'}),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'stop',
            frames: this.anims.generateFrameNames('astroid', {start: 1, end: 1, zeroPad: 1, prefix: 'A', suffix: '.png'}),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'Explode',
            frames: this.anims.generateFrameNames('astroid', {start: 1, end: 13, zeroPad: 1, prefix: 'A', suffix: '.png'}),
            frameRate: 8,
            repeat: 0
        });
    }
    
    requestPlayerMoveForward(){
        this.isMovingForward= true;
        this.complete = false;
        this.startX = this.ufo.x
        this.startY = this.ufo.y
        this.ufo.play("Forward");
    }
    requestPlayerMoveRight(){
        this.isMovingRight= true;
        this.complete = false;
        this.ufo.play("Right");
    }
    requestPlayerMoveLeft(){
        this.isMovingLeft= true;
        this.complete = false;
        this.ufo.play("Left");
    }
    requestPlayerMoveBack(){
        this.isMovingBack= true;
        this.complete = false;
        this.startX = this.ufo.x
        this.startY = this.ufo.y
        this.ufo.play("Backward");
    }
    playMusic(){
        this.audio = this.sound.add("background");
        var musicConfig ={
            mute: false,
            volume:1,
            rate: 1,
            detune:0,
            seek: 0,
            loop: true,
            delay: 0
        }
        this.audio.play(musicConfig);
    }
    stopMusic(){
        this.audio.stop();
    }
    moveForward(){
        if(this.playerAngle == 0){
            this.isMovingForward=this.moveUp();
        }
        else if(this.playerAngle == 90){
            this.isMovingForward=this.moveRight();
        }
        else if(this.playerAngle == -180 || this.playerAngle == 180){
            this.isMovingForward=this.moveDown();
        }
        else if(this.playerAngle == -90){
            this.isMovingForward=this.moveLeft();
        }
    }
    moveBackward(){
        if(this.playerAngle == 0){
            this.isMovingBack=this.moveDown();
        }
        else if(this.playerAngle == 90){
            this.isMovingBack=this.moveLeft();
        }
        else if(this.playerAngle == -180 || this.playerAngle == 180){
            this.isMovingBack=this.moveUp();
        }
        else if(this.playerAngle == -90){
            this.isMovingBack=this.moveRight();
        }
    }
    moveRight(){
        //const [x, y] =this.aGrid.indexPosition(this.playerIndex+1);
        this.distanceMoved = Math.abs(this.startX-this.ufo.x);
        if(this.distanceMoved  >= this.aGrid.cw){
            this.ufo.setVelocityX(0);
            this.playerIndex+=1;
            this.ufo.play("idle");
            this.aGrid.placeAndScaleAtIndex(this.playerIndex, this.ufo);
            this.complete= true;
            return false;
        }
        this.ufo.setVelocityX(90);
        return true;
    }
    moveLeft(){
        //const [x, y] =this.aGrid.indexPosition(this.playerIndex-1);
        this.distanceMoved = Math.abs(this.startX-this.ufo.x);
        if(this.distanceMoved  >= this.aGrid.cw){
            this.ufo.setVelocityX(0);
            this.playerIndex-=1;
            this.ufo.play("idle");
            this.aGrid.placeAndScaleAtIndex(this.playerIndex, this.ufo);
            this.complete= true;
            return false;
        }
        this.ufo.setVelocityX(-90);
        return true;
    }
    moveUp(){
        //const [x, y] =this.aGrid.indexPosition(this.playerIndex-this.cols);
        this.distanceMoved = Math.abs(this.startY-this.ufo.y);
        if(this.distanceMoved  >= this.aGrid.ch){
            this.ufo.setVelocityY(0);
            this.playerIndex-=this.cols;
            this.ufo.play("idle");
            this.aGrid.placeAndScaleAtIndex(this.playerIndex, this.ufo);
            this.complete= true;
            return false;
        }
        this.ufo.setVelocityY(-90);
        return true;
    }
    moveDown(){
        //const [x, y] =this.aGrid.indexPosition(this.playerIndex+this.cols);
        this.distanceMoved = Math.abs(this.startY-this.ufo.y);
        if(this.distanceMoved  >= this.aGrid.ch){
            this.ufo.setVelocityY(0);
            this.playerIndex+=this.cols;
            this.ufo.play("idle");
            this.aGrid.placeAndScaleAtIndex(this.playerIndex, this.ufo);
            this.complete= true;
            return false;
        }
        this.ufo.setVelocityY(+90);
        return true;
    }
    rotateLeft(){
        if (Phaser.Math.RoundTo(Phaser.Math.Angle.ShortestBetween(this.ufo.angle,this.playerAngle))==90) {
            this.ufo.angle =Phaser.Math.RoundTo(this.ufo.angle,1);
            this.playerAngle=this.ufo.angle;
            this.ufo.setAngularVelocity(0);
            this.ufo.play("idle");
            this.isMovingLeft = false;
            this.complete= true;
        } else {
            this.ufo.setAngularVelocity(-90);
        }
    }
    rotateRight(){
        if (Phaser.Math.RoundTo(Phaser.Math.Angle.ShortestBetween(this.ufo.angle,this.playerAngle))==-90) {
            this.ufo.angle =Phaser.Math.RoundTo(this.ufo.angle,1);
            this.playerAngle=this.ufo.angle;
            this.ufo.setAngularVelocity(0);
            this.ufo.play("idle");
            this.isMovingRight = false;
            this.complete= true;
        } else {
            this.ufo.setAngularVelocity(90);
        }
    }
}