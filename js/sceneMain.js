


class SceneMain extends Phaser.Scene {
    
    constructor() {
        super('SceneMain');
    }
    preload()
    {
    	this.load.image("asteroid", "assets/asteroid.png");
        this.load.atlas("ufo", "assets/ufo.png", "assets/ufo.json");
        this.load.image("earth", "assets/earth.png");
        this.load.json('level', 'assets/Levels/levels.json');

        //this.load.audio("background", "assets/space.ogg")
    }
    create() {
        //console.log(Phaser.VERSION);
        this.createLevel();
        this.animationCreate();
        this.keyBinds();
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
        this.astroidGroup.getChildren().forEach(function(item, index){
            item.rotation+=.015;
        })

        if (this.moveR )
        {
            this.rotateRight();
        }
        else if (this.moveL)
        {
            this.rotateLeft();
        }
        else if (this.moveB)
        {
            this.moveBackward();
        }
        else if (this.moveF)
        {
            this.moveForward();
        }

        if (this.goalIndex == this.playerIndex)
        {
            Align.sizeReduce(this.ufo);
            if(this.ufo.displayWidth <10){
                this.setPlayer(this.level.ufo);
            }
        }

    }
    setPlayer(gridPosistion){
        this.moveR = false;
        this.moveL = false;
        this.moveB = false;
        this.moveF = false;
        this.ufo.body.reset(0,0);
        this.playerIndex = gridPosistion;
        this.playerAngle = 0;
        this.aGrid.placeAndScaleAtIndex(this.playerIndex, this.ufo);
        this.ufo.angle = this.playerAngle;
        this.ufo.play("idle");
    }
    
    createLevel(){
        //this.audio = this.sound.add("background");
        this.level = this.cache.json.get('level').level1;
        console.log(this.level);
        this.cols= this.level.col;
        this.rows=this.level.row;
        this.aGrid= new AlignGrid({scene: this, cols: this.cols, rows: this.rows});
        this.aGrid.showNumbers();
        this.earth=this.add.image(10,10,"earth");
        this.goalIndex = this.level.earth;
        this.aGrid.placeAndScaleAtIndex(this.goalIndex, this.earth);
        this.ufo = this.physics.add.sprite(10,10,"ufo").setCollideWorldBounds(true, 1, 1, true);
        this.ufo .body.onWorldBounds = true;
        this.playerIndex = this.level.ufo;
        this.aGrid.placeAndScaleAtIndex(this.playerIndex, this.ufo);
        this.moveR = false;
        this.moveL = false;
        this.moveB = false;
        this.moveF = false;
        this.playerAngle = 0;
        
        this.astroidGroup = this.physics.add.group();
        console.log(this.level);
        for(var i =0; i<this.level.astroids.length; i++){
            var astroid=this.add.image(10,10,"asteroid");
            this.astroidGroup.add(astroid);
            this.aGrid.placeAndScaleAtIndex(this.level.astroids[i].place, astroid);
        }
       
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
    }
    keyBinds(){
        this.input.keyboard.on('keydown-A', function() { 
            this.moveL= true;
            this.ufo.play("Left");
        }, this);
        this.input.keyboard.on('keydown-D', function() { 
            this.moveR= true;
            this.ufo.play("Right");
        }, this);
        this.input.keyboard.on('keydown-W', function() { 
            this.moveF= true;
            this.startX = this.ufo.x
            this.startY = this.ufo.y
            this.ufo.play("Forward");
        }, this);
        this.input.keyboard.on('keydown-S', function() { 
            this.moveB= true;
            this.startX = this.ufo.x
            this.startY = this.ufo.y
            this.ufo.play("Backward");
        }, this);
    }
    playMusic(){
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
    moveForward(){
        if(this.playerAngle == 0){
            this.moveF=this.moveUp();
        }
        else if(this.playerAngle == 90){
            this.moveF=this.moveRight();
        }
        else if(this.playerAngle == -180 || this.playerAngle == 180){
            this.moveF=this.moveDown();
        }
        else if(this.playerAngle == -90){
            this.moveF=this.moveLeft();
        }
    }
    moveBackward(){
        if(this.playerAngle == 0){
            this.moveB=this.moveDown();
        }
        else if(this.playerAngle == 90){
            this.moveB=this.moveLeft();
        }
        else if(this.playerAngle == -180 || this.playerAngle == 180){
            this.moveB=this.moveUp();
        }
        else if(this.playerAngle == -90){
            this.moveB=this.moveRight();
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
            this.moveL = false;
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
            this.moveR = false;
        } else {
            this.ufo.setAngularVelocity(90);
        }
    }
}