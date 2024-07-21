
const openModalButtons = document.querySelectorAll('[data-modal-open]')
const closeModalButtons = document.querySelectorAll('[data-modal-close]')
const output = document.querySelector('.output')
const keys = document.querySelector('.number-grid')

keys.addEventListener('click', e => {
    if (e.target.matches('button')) {
        const key = e.target
        const action = key.dataset.action
        const keyContent = key.textContent
        const displayedNum = output.textContent
        if (!action) {
            if (displayedNum === '0') {
                output.textContent = keyContent
            }
            else {
                output.textContent = displayedNum + keyContent
            }
        }
        else if (action === 'Del'){
            if(output.textContent.length>1){
                output.textContent = output.textContent.substring(0, output.textContent.length - 1);
            }
            else{
                output.textContent ='0'
            }
        }
        else if (action === 'Ent'){
            output.textContent = '0'
        }
    }
  })

openModalButtons.forEach(button =>{
    button.addEventListener('click',()=>{
        const modal = document.querySelector(button.dataset.modalOpen)
        openModel(modal)
    })
})
closeModalButtons.forEach(button =>{
    button.addEventListener('click',()=>{
        const modal = button.closest('.modal')
        closeModel(modal)
    })
})
function openModel(modal){
    if(modal==null) return
    modal.classList.add('active')
}
function closeModel(modal){
    if(modal==null) return
    modal.classList.remove('active')
}
var runSelected = false;

function setRun(){
    runSelected = true;
}


const TOKEN = Object.freeze({
    WS: "WS", 
    COMMENT: "COMMENT", 
    NEWLINE:"NEWLINE",
    NUMBER:"NUMBER",
    STRING:"STRING",
    FOR: "FOR",
    KEYWORD:"KEYWORD",
    FUNCTION:"FUNCTION",
    ERROR:"ERROR",
    TO:"TO",
    COLON:"COLON",
    INDENT1: "INDENT1",
    INDENT2: "INDENT2",
    INDENT3: "INDENT3",
    INDENT4: "INDENT4",
    INDENT5: "INDENT5",
    INDENT6: "INDENT6",
});
const ufoMoves = Object.freeze({
    FORWARD: "forward()", 
    BACKWARD: "backward()", 
    ROTATE_RIGHT:"rotate_right()",
    ROTATE_LEFT:"rotate_left()",
    SHOOT:"shoot()",
    SCAN:"scan()",
    TRACTORBEAM:"tractorbeam()",
});
const ufoMovesArr= ['forward()','rotate_right()','rotate_left()','backward()','shoot()','scan()','tractorbeam()'] 

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
        this.load.audio("background", "assets/space.ogg");
        this.load.audio("wormhole","assets/Wormhole.wav");
    }
    create() {
        this.stackOfActions=[]
        this.isMovingRight = false;
        this.isMovingLeft = false;
        this.isMovingBack = false;
        this.isMovingForward = false;
        this.running = false;
        this.complete = true;
        this.playingMusic= false;
        this.createLevel();
        this.animationCreate();
    
        this.physics.add.overlap(this.ufo, this.astroidGroup, (ufo, astroid) =>
        {
            astroid.play("Explode");
            this.setPlayer(this.level.ufo);
            this.audio.stop(); 
        }
    );
        this.physics.world.on('worldbounds', (body, up, down, left, right) =>
        {
            this.setPlayer(this.level.ufo);
        });
        this.lexer = moo.compile({
            WS: /[ ]+/, // TODO tabs
            COMMENT: /#.*/,
            NEWLINE: { match: /\r|\r\n|\n/, lineBreaks: true },
            NUMBER: [
                /(?:0|[1-9][0-9]*)/,              // 123
            ],
            STRING: [
                {match: /"""[^]*?"""/, lineBreaks: true, value: x => x.slice(3, -3)},
                {match: /"(?:\\["\\rn]|[^"\\\n])*?"/, value: x => x.slice(1, -1)},
                {match: /'(?:\\['\\rn]|[^'\\\n])*?'/, value: x => x.slice(1, -1)},
            ],
            FUNCTION: ufoMovesArr,
            FOR: 'for',
            TO: 'to',
            KEYWORD: ['for', 'to'],
            L_PAR: "(",
            R_PAR: ")",
            COLON: ":",
            ERROR: /[A-Za-z_][A-Za-z0-9_]*/,
            INDENT1: "temp",
            INDENT2: "temp",
            INDENT3: "temp",
            INDENT4: "temp",
            INDENT5: "temp",
            INDENT6: "temp",
          })
    }
    update() {
        this.earth.rotation += 0.025;
        this.astroidGroup.getChildren().forEach(function(item, index){
            item.rotation+=.005;
        })
        
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
                        console.log("not real action")
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
            this.playWormholeMusic();
            this.playingMusic = true;
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
                this.lexer.reset( this.scriptData);
               
                this.parseData();
                runSelected = false;
            }
            else{
                //TODO Handle run selected while running
            }
        }

    }
    parseData(){
        if( this.syntaxCheck()){
            
            var i =0;
            while (this.tokens[i]){

                if(this.tokens[i].type == TOKEN.FOR){
                    var forToken =this.tokens[i];
                    try {
                        while(this.tokens[i].type != TOKEN.NUMBER){
                            i++
                        }
                    } catch (error) {
                        errorLine(forToken.line);
                        console.log("Expect a number after 'for'! EX: for 1 to 5: ");
                        return;
                    }
                    var startNumToken = this.tokens[i];
                    try {
                        while(this.tokens[i].type != TOKEN.TO){
                            i++
                        }
                    } catch (error) {
                        errorLine(startNumToken.line);
                        console.log("Expect a 'to' after 'for "+startNumToken.value +"'! EX: for 1 to 5: ");
                        return;
                    }

                    var toToken = this.tokens[i];
                    try {
                        while(this.tokens[i].type != TOKEN.NUMBER){
                            i++
                        }
                    } catch (error) {
                        errorLine(toToken.line);
                        console.log("Expect a 'Number' after 'for "+startNumToken.value +" to '! EX: for 1 to 5: ");
                        return;
                    }
                    var endNumToken = this.tokens[i];
                    try {
                        while(this.tokens[i].type != TOKEN.COLON){
                            i++
                        }
                    } catch (error) {
                        errorLine(endNumToken.line);
                        console.log("Expect a ':' after 'for "+startNumToken.value +" to "+ endNumToken.value+"'! EX: for 1 to 5: ");
                        return;
                    }
                    var colonToken = this.tokens[i];
                    i++;
                    try {
                        while(this.tokens[i].type != TOKEN.NEWLINE){
                            i++
                        }
                    } catch (error) {
                        errorLine(colonToken.line);
                        console.log("Expect newLine ");
                        return;
                    }
                    i++;
                    var forStart = i;
                    for (let j = +startNumToken.value; j <= +endNumToken.value; j++) {
                        i = forStart;
                        try {
                            while (this.tokens[i].type == TOKEN.INDENT1){
                                i++;
                                while (this.tokens[i].type != TOKEN.NEWLINE){
                                    if(this.tokens[i].type == TOKEN.FUNCTION){
                                        if(this.tokens[i].value == ufoMoves.FORWARD ){
                                            this.stackOfActions.push("F");
                                        }
                                        else if(this.tokens[i].value == ufoMoves.ROTATE_RIGHT){
                                            this.stackOfActions.push("R");
                                        }
                                        else if(this.tokens[i].value == ufoMoves.ROTATE_LEFT){
                                            this.stackOfActions.push("L");
                                        }
                                        else if(this.tokens[i].value == ufoMoves.BACKWARD){
                                            this.stackOfActions.push("B")
                                        }
                                    }
                                    i++;
                                }
                                i++;
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }
               try {
                    if(this.tokens[i].type == TOKEN.FUNCTION){
                        if(this.tokens[i].value == ufoMoves.FORWARD ){
                            this.stackOfActions.push("F");
                        }
                        else if(this.tokens[i].value == ufoMoves.ROTATE_RIGHT){
                            this.stackOfActions.push("R");
                        }
                        else if(this.tokens[i].value == ufoMoves.ROTATE_LEFT){
                            this.stackOfActions.push("L");
                        }
                        else if(this.tokens[i].value == ufoMoves.BACKWARD){
                            this.stackOfActions.push("B")
                        }
                    }
               } catch (error) {
                    console.log(error);
               }
               i++;
            } 
            this.running = true;
            this.complete = true;
            this.scriptData = ""
        }
    }
    getNextToken(){

    }
    syntaxCheck(){
        var isGood = true;
        var wsCheck = false;
        this.tokens = Array.from(this.lexer);
        for (let i =0; i<this.tokens.length; i++) {
            if(this.tokens[i].type == TOKEN.ERROR){
                errorLine(this.tokens[i].line);
                isGood = false;
            }
            if (wsCheck){
                wsCheck =false;
                if(this.tokens[i].type == TOKEN.WS){
                    if(this.tokens[i].value == "    "){
                        this.tokens[i].type= TOKEN.INDENT1;
                    }
                    else if(this.tokens[i].value == "        "){
                        this.tokens[i].type= TOKEN.INDENT2;
                    }
                    else if(this.tokens[i].value == "            "){
                        this.tokens[i].type= TOKEN.INDENT3;
                    }
                    else if(this.tokens[i].value == "                "){
                        this.tokens[i].type= TOKEN.INDENT4;
                    }
                    else if(this.tokens[i].value == "                    "){
                        this.tokens[i].type= TOKEN.INDENT5;
                    }
                    else if(this.tokens[i].value == "                        "){
                        this.tokens[i].type= TOKEN.INDENT6;
                    }
                }
            }
            if(this.tokens[i].type == TOKEN.NEWLINE){
                wsCheck = true;
            }
            
        }
        return isGood;
    }
    createLevel(){
        var selectedLevel;
        
        selectedLevel = Number(localStorage.getItem('level'));
       
        switch(selectedLevel) {
            case 1:
                this.level = this.cache.json.get('level').level1;
                break;
            case 2:
                this.level = this.cache.json.get('level').level2;
                break;
            case 3:
                this.level = this.cache.json.get('level').level3;
                break;
            case 4:
                this.level = this.cache.json.get('level').level4;
                break;
            case 5:
                this.level = this.cache.json.get('level').level5;
                break;
            case 6:
                this.level = this.cache.json.get('level').level6;
                break;
            case 7:
                this.level = this.cache.json.get('level').level7;
                break;
            case 8:
                this.level = this.cache.json.get('level').level8;
                break;
            case 9:
                this.level = this.cache.json.get('level').level9;
                break;
            case 10:
                this.level = this.cache.json.get('level').level10;
                break;
           
            default:
              this.level = this.cache.json.get('level').level1;
          }
       
        
        
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
        
        this.astroidGroup = this.physics.add.group();
        for(var i =0; i<this.level.astroids.length; i++){
            var astroid=this.physics.add.sprite(10,10,"astroid");
            this.astroidGroup.add(astroid);
            this.aGrid.placeAndScaleAtIndex(this.level.astroids[i].place, astroid);
        }
    }
    setPlayer(gridPosistion){
        this.isMovingRight = false;
        this.isMovingLeft = false;
        this.isMovingBack = false;
        this.isMovingForward = false;
        this.playerIndex = gridPosistion;
        this.playerAngle = 0;
        this.aGrid.placeAndScaleAtIndex(this.playerIndex, this.ufo);
        
		this.ufo.body.reset(this.ufo.x,this.ufo.y);
        this.ufo.angle = this.playerAngle;
        this.ufo.play("idle");
    }
    stopPlayer(){
        this.isMovingRight = false;
        this.isMovingLeft = false;
        this.isMovingBack = false;
        this.isMovingForward = false;
        this.ufo.body.reset(this.ufo.x,this.ufo.y);
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
            frameRate: 16,
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
    playWormholeMusic(){
        if(!this.playingMusic){
            this.wormholeAudio = this.sound.add("wormhole");
            var musicConfig ={
                mute: false,
                volume:1,
                rate: 1,
                detune:0,
                seek: 0,
                loop: false,
                delay: 0
            }
            this.wormholeAudio.play(musicConfig);
        }
        
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