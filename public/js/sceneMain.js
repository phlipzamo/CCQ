
const openModalButtons = document.querySelectorAll('[data-modal-open]')
const closeModalButtons = document.querySelectorAll('[data-modal-close]')
const closeModalIFButtons = document.querySelectorAll('[data-modalIF-close]')
const output = document.querySelector('.output')
const keys = document.querySelector('.number-grid')
const auth = firebase.auth();
const db = firebase.firestore();
let childAccountsCollection = db.collection('child_accounts');
let adultAccountsCollection = db.collection('adult_accounts');

function getCookie(name) {
    const cookieDecoded = decodeURIComponent(document.cookie);
    const cookieArray = cookieDecoded.split("; ");
    let result = null;

    cookieArray.forEach(element => {
        if (element.indexOf(name) == 0) {
            result = element.substring(name.length + 1);
        }
    })

    return result;
}

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
        if(output.textContent === '0'){return;}
        const modal = button.closest('.modal')
        closeModel(modal)
        printNextTo(output.textContent);
    })
})

closeModalIFButtons.forEach(button =>{
    button.addEventListener('click',()=>{
        const modal = button.closest('.modal')
        closeModel(modal)
    })
})
function openModel(modal){
    if(modal==null) return
    modal.classList.add('active')
    disableBtns();
}
function disableBtns(){
    this.disableBtn("run");
    this.disableBtn("delete");
    this.disableBtn("clear");
    this.disableBtn("forward");
    this.disableBtn("right");
    this.disableBtn("left");
    this.disableBtn("shoot");
    this.disableBtn("times");
    this.disableBtn("if");
}
function disableBtn(name){
    var button = document.getElementById(name);
    button.disabled= true;
}
function enableBtns(){
    this.enableBtn("run");
    this.enableBtn("delete");
    this.enableBtn("clear");
    this.enableBtn("forward");
    this.enableBtn("right");
    this.enableBtn("left");
    this.enableBtn("shoot");
    this.enableBtn("times");
    this.enableBtn("if");
}
function enableBtn(name){
    var button = document.getElementById(name);
    button.disabled= false;
}

function closeModel(modal){
    if(modal==null) return
    modal.classList.remove('active')
    enableBtns();
}
var runSelected = false;

function setRun(){
    runSelected = true;
}
var resetSelected = false;

function setReset(){
    resetSelected = true;
}
var isMute = true
var firstTimeSelected = true;
function toggleMute(){
    isMute = !isMute
}
function change (iconID){
    if(document.getElementById(iconID).className=="fa-solid fa-volume-xmark fa-xl"){

        isMute= false;
      document.getElementById(iconID).className = "fa-solid fa-volume-high fa-xl";
    }else{
        isMute =true;
      document.getElementById(iconID).className = "fa-solid fa-volume-xmark fa-xl";
    }
  }

const TOKEN = Object.freeze({
    WS: "WS", 
    COMMENT: "COMMENT", 
    NEWLINE:"NEWLINE",
    NUMBER:"NUMBER",
    STRING:"STRING",
    TIMES: "TIMES",
    END: "END",
    IF: "IF",
    KEYWORD:"KEYWORD",
    PAR: "PAR",
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
    FORWARD: "forward", 
    BACKWARD: "backward", 
    ROTATE_RIGHT:"rotate_right",
    ROTATE_LEFT:"rotate_left",
    SHOOT:"shoot",
    ASTROID:"AstroidInFront",
    EMPTY:"EmptyInFront",
    TARGET:"TargetInFront",
    OUTOFBOUNDS:"OutOfBoundsInFront",
});
const ufoMovesArr= ['forward','rotate_right','rotate_left','backward','shoot','AstroidInFront','EmptyInFront', 'TargetInFront', 'OutOfBoundsInFront'] 
class Laser extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y)
    {
        super(scene, -40, -40, 'laser');
        
    }

    fire (x, y, playerAngle)
    {
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);

        if(playerAngle == 0){
            this.angle = 0;
            this.setVelocityY(-300);
        }
        else if(playerAngle == 90){
            this.angle = 90;
            this.setVelocityX(300);
        }
        else if(playerAngle == -180 || playerAngle == 180){
            this.angle = 180;
            this.setVelocityY(300);
        }
        else if(playerAngle == -90){
            this.angle = -90;
            this.setVelocityX(-300);
        }
        
    }


    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        if(this.angle == 0){
            if (this.y <= 30) {
                this.setActive(false);
                this.setVisible(false);
            }
        }
        else if(this.angle == 90){
            if (this.x >= 500) {
                this.setActive(false);
                this.setVisible(false);
            }
        }
        else if(this.angle== -180 || this.angle == 180){
            if (this.y >= 600) {
                this.setActive(false);
                this.setVisible(false);
            }
        }
        else if(this.angle == -90){
            if (this.x <= 0) {
                this.setActive(false);
                this.setVisible(false);
            }
        }
    }
}

class Lasers extends Phaser.Physics.Arcade.Group
{
    constructor (scene)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 30,
            key: 'laser',
            active: false,
            visible: false,
            classType: Laser
        });
    }

    fireLaser (x, y, playerAngle)
    {
        const laser = this.getFirstDead(false);

        if (laser)
        {
            laser.fire(x, y, playerAngle);
        }
    }
    isActive(){
        var iAmActive = false
        this.getChildren().forEach(function(laser) {
            if(laser.active){
                iAmActive=true;
            }
        }, this);
        return iAmActive;
    }
}
class SceneMain extends Phaser.Scene {
    
    constructor() {
        super('SceneMain');
    }
    preload()
    {
    	this.load.atlas("astroid", "assets/astroid.png", "assets/astroid.json");
        this.load.atlas("scan", "assets/scan.png", "assets/scan.json");
        this.load.image("wormhole", "assets/Wormhole.png");

        this.load.atlas("portal", "assets/portal.png","assets/portal.json");
       
        this.load.atlas("ufo", "assets/cowufo.png", "assets/cowufo.json");
        this.load.image("earth", "assets/Globe.png");
        this.load.json('level', 'assets/Levels/levels.json');
        this.load.audio("background", "assets/space.ogg");
        this.load.audio("wormhole","assets/Wormhole.wav");
        this.load.audio("rocketSounds","assets/rocketsound.mp3");
        this.load.audio("scanSounds","assets/scanSound.mp3");
        this.load.audio("laserSound","assets/Laser.wav");
        this.load.audio("crashSound","assets/crashSound.mp3");
        this.load.audio("astroidExplodeSound","assets/asteroidhit.mp3");
        this.load.image("laser", "assets/Laser.png");
        this.load.html("mute", "assets/mute.html");
        this.load.html("home", "assets/home.html");
        this.load.html("levelSelect", "assets/levelSelect.html");
        this.load.html("info", "assets/info.html");
        this.load.atlas("target", "assets/target.png", "assets/target.json");
    }
    create() {
        this.mute = this.add.dom(0,0).createFromCache("mute");
        this.home = this.add.dom(0,0).createFromCache("home");
        this.levelSelect = this.add.dom(0,0).createFromCache("levelSelect");
        this.info = this.add.dom(0,0).createFromCache("info");
        
        this.audio = this.sound.add("background");
        this.backgroundMusicPlaying =false;
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
        this.audio.pause();

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
        this.wormholeAudio.pause();
        
        this.astroidExplodeSound = this.sound.add("astroidExplodeSound");
      
        this.crashSound = this.sound.add("crashSound");
    
        this.laserSound = this.sound.add("laserSound");
        
        this.scanSounds = this.sound.add("scanSounds");
        
        this.rocketSounds = this.sound.add("rocketSounds");
        

        this.stackOfActions=[]
        this.isMovingRight = false;
        this.isMovingLeft = false;
        this.isMovingBack = false;
        this.isMovingForward = false;
        this.isShooting= false;
        this.HitAstroid=false;
        this.running = false;
        this.complete = true;
        this.playingMusic= false;
        this.endstate = false;
        this.firstTime = true;
        this.isIF = false;
        
        this.createLevel();
        this.animationCreate();
        this.lasers = new Lasers(this);
        
        if(this.level.wormholes){
            if(this.level.wormholes.startColor ==="red"){
                this.wormholeStart.play("red");
            }
            else if(this.level.wormholes.startColor ==="green") {
                this.wormholeStart.play("green");
            }
            if(this.level.wormholes.endColor ==="red"){
                this.wormholeEnd.play("red");
                this.target.play("RedTarget")
            }
            else if(this.level.wormholes.endColor ==="red"){
                this.wormholeEnd.play("green");
                this.target.play("GreenTarget")
            }
            this.aGrid.placeAndScaleAtIndex(this.level.wormholes.start, this.wormholeStart,.8);
            this.aGrid.placeAndScaleAtIndex(this.level.wormholes.end, this.wormholeEnd,.8);
            this.aGrid.placeAndScaleAtIndex(this.level.wormholes.target, this.target,.8);
        }

        this.physics.add.overlap(this.ufo, this.astroidGroup, (ufo, astroid) =>
        {   
            if(this.endstate){return}
            if(this.firstTime){
                this.crashSound.play({
                    volume:1,
                    rate: 1,
                    detune:0,
                    seek: 0,
                    loop: false,
                    delay: 0
                });
                this.astroidExplodeSound.play({
                    volume:1,
                    rate: 1,
                    detune:0,
                    seek: 0,
                    loop: false,
                    delay: 0
                });
                astroid.play("Explode");
                this.firstTime = false;
                this.stopPlayer();
                //this.setPlayer(this.level.ufo);
                //this.audio.stop(); 
                this.uiFailedGroup.setVisible(true);
                disableBtns();
            }
            astroid.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function () {
                if(!this.firstTime){
                    this.hideAstroid(astroid);
                }
                this.firstTime = true;
            }, this);
            
        });
        this.scan.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY+"ScanOn", function () {
            if(!this.complete){
                this.scan.play("ScanOff")
                this.complete = true;
            }
        }, this);
        this.physics.add.overlap(this.lasers, this.astroidGroup, (laser, astroid) =>
        {
            this.astroidExplodeSound.play({
                volume:1,
                rate: 1,
                detune:0,
                seek: 0,
                loop: false,
                delay: 0
            });
            astroid.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function () {
                if(this.complete === true){return;}
                this.hideAstroid(astroid);
                //astroid.destroy();
                this.complete = true;
                this.HitAstroid=false;
                this.firstTime = true;
                //this.lasers = new Lasers(this);
            }, this);
            astroid.play("Explode");
            
            this.HitAstroid=true;
            if(this.firstTime){
                laser.destroy();
                this.firstTime = false;
            }
        }
        );
        
        if(this.target){
            this.physics.add.overlap(this.target, this.lasers, (target,laser) =>
                {
                    this.laserDistance = (laser.x-target.x)+ (laser.y-target.y)
                    if(Math.abs(this.laserDistance)<=5){
                        if(this.target.anims.getName()==="RedTarget"){
                            this.target.play("GreenTarget");
                            this.wormholeStart.play("red");
                        }
                        else{
                            this.target.play("RedTarget");
                            this.wormholeStart.play("green");
                        }
                        laser.destroy();
                    
                    }
                }
            );
        }
        this.ufo.on(Phaser.Animations.Events.ANIMATION_START, function () {
            if(this.ufo.anims.currentAnim.key != "idle"){
                this.rocketSounds.play({
                    volume:.5,
                    rate: 1,
                    detune:0,
                    seek: 0,
                    loop: false,
                    delay: 0
                });

            }
            else{
                this.rocketSounds.stop();
            }
        }, this);
        this.scan.on(Phaser.Animations.Events.ANIMATION_START, function () {
            if(this.scan.anims.currentAnim.key != "ScanOff"){
                this.scanSounds.play({
                    volume:4,
                    rate: 1,
                    detune:0,
                    seek: 0,
                    loop: false,
                    delay: 0
                });
            }
            else{
                this.scanSounds.stop();
            }
        }, this);
        this.physics.world.on('worldbounds', (body, up, down, left, right) =>
        {
            this.crashSound.play({
                volume:1,
                rate: 1,
                detune:0,
                seek: 0,
                loop: false,
                delay: 0
            });

            this.stopPlayer()
            //this.setPlayer(this.level.ufo);
            this.audio.stop();
            this.uiFailedGroup.setVisible(true);
            disableBtns();
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
            TIMES: 'times',
            PER: '.',
            IF: "if",
            END: 'end',
            KEYWORD: ['for', 'to'],
            PAR: ["(",")"],
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
        if(this.playerAngle == 0){
            this.scan.angle = this.playerAngle;
            this.scan.x = this.ufo.x;
            this.scan.y = this.ufo.y -this.scanOffset;
        }
        else if(this.playerAngle == 90){
            this.scan.angle = this.playerAngle;
            this.scan.x = this.ufo.x+this.scanOffset;
            this.scan.y = this.ufo.y;
        }
        else if(this.playerAngle == -180 || this.playerAngle == 180){
            this.scan.angle = this.playerAngle;
            this.scan.x = this.ufo.x;
            this.scan.y = this.ufo.y +this.scanOffset;
        }
        else if(this.playerAngle == -90){
            this.scan.angle = this.playerAngle;
            this.scan.x = this.ufo.x-this.scanOffset;
            this.scan.y = this.ufo.y;
        }
        this.earth.rotation += 0.025;
        this.astroidGroup.getChildren().forEach(function(item, index){
            item.rotation+=.005;
        })
       if(this.wormholeStart){
            this.wormholeStart.rotation+=.050;
        
            this.wormholeEnd.rotation+=.050;
            if(this.level.wormholes.start === this.playerIndex)
                {   
                    if(this.wormholeStart.anims.getName()=== this.wormholeEnd.anims.getName()){
                        this.playWormholeMusic();
                        this.playingMusic = true;
                        this.stopPlayer();
                        this.aGrid.placeAndScaleAtIndex(this.level.wormholes.end,this.ufo,.9);
                        this.playerIndex = this.level.wormholes.end
                        this.complete =true;
                        this.running =true;
                    } 
                    else{
                        this.stackOfActions.length = 0;
                    }
                }
       }

        if(this.running){
            //if complete get next action
            if(this.complete){
                if(this.stackOfActions.length >0){
                    var action = this.stackOfActions.shift();
                    setSelection(action.line);
                    if(!action.boolIf){
                        this.isIF = false;
                    }
                    if(this.isIF === action.boolIf){
                        if(action.action == "F"){
                            this.requestPlayerMoveForward();
                        }
                        else if (action.action == "B"){
                            this.requestPlayerMoveBack();
                        }
                        else if (action.action == "R"){
                           this.requestPlayerMoveRight()
                        }
                        else if (action.action == "L"){
                            this.requestPlayerMoveLeft();
                        }
                        else if (action.action == "S"){
                            this.requestPlayerShoot();
                        }
                        else if (action.action == "E"){
                            //this.isIF = false;
                            if(this.checkInFront()===action.action){
                                this.isIF = true;
                            }
                        }
                        else if (action.action == "A"){
                            if(this.checkInFront()===action.action){
                                this.isIF = true;
                            }
                        }
                        else if (action.action == "T"){
                            if(this.checkInFront()===action.action){
                                this.isIF = true;
                            }
                        }
                        else if (action.action == "OB"){
                            if(this.checkInFront()===action.action){
                                this.isIF = true;
                            }
                        }
                        else{
                            console.log("not real action")
                        }
                    }
                } 
                else{
                    this.running = false;
                    //this.stopMusic();
                    if (this.goalIndex != this.playerIndex)
                    {
                        this.stopPlayer()
                        //this.setPlayer(this.level.ufo);
                        //this.audio.stop(); 
                        this.uiFailedGroup.setVisible(true);
                        disableBtns();
                    }

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
            else if(this.isShooting){
                if(!this.lasers.isActive()){
                    if(!this.HitAstroid){
                        this.complete = true;
                    }   
                }
            }
        }
        
        if (this.goalIndex == this.playerIndex)
        {   
            this.playWormholeMusic();
            this.playingMusic = true;
            Align.moveTowardsCenter(this.earth);
            Align.moveTowardsCenter(this.ufo);
            Align.sizeIncrease(this.earth);
            this.stopPlayer();
            this.endstate = true;
            if(Align.isCenter(this.earth)){
                this.goalIndex = -1;
                this.uiSuccessGroup.setVisible(true); 
                disableBtns();
                if (getCookie("isChildAccount") == "true") {
                    var usernameQuery = getCookie('username');
                    var levelCookie = "level".concat(getCookie('level'));
                    childAccountsCollection.doc(`${usernameQuery}`).set({
                        [levelCookie]: true
                    }, { merge: true });
                } else if (getCookie("isChildAccount") == "false") {
                    auth.onAuthStateChanged((user) => {
                        if (user) {
                            var userUID = auth.currentUser.uid;
                            var levelCookie = "level".concat(getCookie('level'));
                            adultAccountsCollection.doc(`${userUID}`).set({
                                [levelCookie]: true
                            }, { merge: true });
                        }
                    });
                } else {
                    console.log("Error. User should have isChildAccount cookie with value of true or false, but does not.");
                }
            }
            
        }
       
        
        
        
        if(this.endstate){
            this.ufo.rotation += 0.025;
        }
        
        if(runSelected){
            this.stackOfActions.length=0;
            disableBtns()
    
            resetSelection();
            this.scriptData=getScript();
            this.lexer.reset( this.scriptData);
            
            this.parseData();
            runSelected = false;
            
        }

        if (resetSelected)
        {   
            this.stopMusic();
            this.setPlayer(this.level.ufo);
        }

        if(!isMute){
           
            this.playMusic();
            this.backgroundMusicPlaying = true
        }
        else{
            this.audio.pause();
            this.backgroundMusicPlaying =false;
        }
       
        this.game.sound.mute = isMute;
    }
    parseData(){
        this.indent = 0;
        if( !this.syntaxCheck()){
            return;
        }
        this.tokens = this.tokens.filter(function(token) {
            return token.type !== TOKEN.WS ; 
            });
        this.tokens = this.tokens.filter(function(token) {
            return token.type !== TOKEN.NEWLINE ; 
            });
        this.tokens = this.tokens.filter(function(token) {
            return token.type !== TOKEN.PAR ; 
            });
        var i =0;
        while (this.tokens[i]){
            i = this.checkToken(i);
            i++;
        } 
        this.running = true;
        this.complete = true;
        this.scriptData = ""
    }
    checkToken(i){
        if(!this.tokens[i]){
            return i;
        }
        if(this.tokens[i].type == TOKEN.FUNCTION){
            if(this.tokens[i].value == ufoMoves.FORWARD ){
                i++;
                this.pushNumberOfActions(i, "F")
            }
            else if(this.tokens[i].value == ufoMoves.ROTATE_RIGHT){
                i++;
                this.pushNumberOfActions(i, "R")
            }
            else if(this.tokens[i].value == ufoMoves.ROTATE_LEFT){
                i++;
                this.pushNumberOfActions(i, "L")
            }
            else if(this.tokens[i].value == ufoMoves.BACKWARD){
                i++;
                this.pushNumberOfActions(i, "B")
            }
            else if(this.tokens[i].value == ufoMoves.SHOOT){
                i++;
                this.pushNumberOfActions(i, "S")
            }
            i++;
        }
        else if(this.tokens[i].type == TOKEN.NUMBER){
            var iterations = parseInt(this.tokens[i].value)
            i++;
            i++;
            i++;
            i = this.checkIndent(i)
            i = this.getTimeLoopMoves(i, iterations)
            return i;
                
        }
        else if(this.tokens[i].type == TOKEN.IF){
            i++;
            if(this.tokens[i].value == ufoMoves.ASTROID ){
                this.pushIF(i, "A")
            }
            else if(this.tokens[i].value == ufoMoves.EMPTY){
                this.pushIF(i, "E")
            }
            else if(this.tokens[i].value == ufoMoves.TARGET){
                this.pushIF(i, "T")
            }
            else if(this.tokens[i].value == ufoMoves.OUTOFBOUNDS){
                this.pushIF(i, "OB")
            }

            i++;
            i = this.checkIndent(i);
            i = this.getIfMoves(i);
            return i;
        }
        
        i = this.checkIndent(i);
        return i;
    }
    checkIndent(i){
        if(!this.tokens[i]){
            return i;
        }

        if(this.tokens[i].type == TOKEN.INDENT1)
        {
            this.indent =1;
        }
        else if(this.tokens[i].type == TOKEN.INDENT2)
        {
            this.indent =2;
        }
        else if(this.tokens[i].type == TOKEN.INDENT3)
        {
            this.indent =3;
        }
        else if(this.tokens[i].type == TOKEN.INDENT4)
        {
            this.indent =4;
        }
        else if(this.tokens[i].type == TOKEN.INDENT5)
        {
            this.indent =5;
        }
        else if(this.tokens[i].type == TOKEN.INDENT6)
        {
            this.indent =6;
        }
        else {
            this.indent =0;
            return --i;
        }
        return i;
    }
    getTimeLoopMoves(i, iterations){
        var startIndex = i;
        var startIndent= this.indent
        for (var j = 0; j<iterations;j++){
            i= startIndex;
            while (startIndent<=this.indent){
                
                i = this.checkToken(i)
                i++;
            }
            
            this.indent = startIndent
        }
        return i;
    }
    getIfMoves(i){
        var startIndent= this.indent
        while (startIndent<=this.indent){
            this.isIF = true;
            i = this.checkToken(i)
            i++;
        }
        this.isIF = false;
        this.indent = startIndent
        return i;
    }
    pushNumberOfActions(i, action){
        if(this.tokens[i].type == TOKEN.NUMBER){
            for(var j = 0; j<this.tokens[i].value; j++){
                this.stackOfActions.push({action:action,line: this.tokens[i].line, boolIf: this.isIF});
            }
        }
    }
    pushIF(i, action){
        this.stackOfActions.push({action:action,line: this.tokens[i].line, boolIf: this.isIF});
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
       
        if(this.level.wormholes){
            this.wormholeStart = this.physics.add.sprite(10,10,"portal");
            this.wormholeEnd = this.physics.add.sprite(10,10,"portal");
            this.target = this.physics.add.sprite(10,10,"target");
        }
        this.goalIndex = this.level.earth;
        this.astroidGroup = this.physics.add.group();


        this.aGrid= new AlignGrid({scene: this, cols: this.cols, rows: this.rows});
        this.createInteractableAssets();

        if(selectedLevel===10){
            this.earth=this.add.image(10,10,"earth");}
        else{
            this.earth=this.add.image(10,10,"wormhole");}
        
        this.earth.setDepth=0;
        this.scan = this.physics.add.sprite(10,10,"scan");
        this.ufo = this.physics.add.sprite(10,10,"ufo").setCollideWorldBounds(true, 1, 1, true);
        this.ufo.body.onWorldBounds = true;
        this.ufo.setDepth=1;
        this.playerIndex = this.level.ufo;
        this.playerAngle = 0;

        this.aGrid.show("0x05ed04");
        this.aGrid.placeAndScaleAtIndex(this.goalIndex, this.earth,.8);
        this.aGrid.placeAndScaleAtIndex(this.playerIndex, this.ufo,.9);
        this.aGrid.placeAndScaleAtIndex(this.playerIndex,this.scan,.9);
        this.scan.x = this.ufo.x;
        this.scanOffset = this.ufo.displayHeight*13/16;
        this.scan.y = this.ufo.y - this.scanOffset;

        this.createPauseScreen();
        this.createSuccessScreen();
        var leveltext = "Level "+localStorage.getItem('level');
        var txt_Level =this.add.text(0,0, leveltext ,{fontSize: 25, color:"#FFFFFF", stroke: "#05ed04", strokeThickness: 3 });
        this.overlayGrid= new AlignGrid({scene: this, cols: 4, rows: 18});
        this.iconBarGrid= new AlignGrid({scene: this, cols: 13, rows: 18});
        this.laserBarGrid= new AlignGrid({scene: this, cols: 13, rows: 27});
        this.overlayGrid.placeTextAtIndex(3, txt_Level);
        this.iconBarGrid.placeAtIndex(0,this.home);
        this.iconBarGrid.placeAtIndex(1,this.levelSelect)
        this.iconBarGrid.placeAtIndex(2, this.mute);
        this.iconBarGrid.placeAtIndex(3, this.info);
        var text_Laser =this.add.text(0,0, "Lasers" ,{fontSize: 20, color:"#FFFFFF", stroke: "#05ed04", strokeThickness: 3 });
        this.laserBarGrid.placeAtIndex(25*13, text_Laser);
        
        this.laserUIGroup = this.add.group();

        this.laserEmpty = this.add.graphics();
        this.laserEmpty.lineStyle(3,0xFF0000);
        this.laserEmpty.moveTo(0,0);
        this.laserEmpty.lineTo(40,15);
        this.laserEmpty.strokePath();
        this.laserEmpty.moveTo(40,0);
        this.laserEmpty.lineTo(0,15);
        this.laserEmpty.strokePath();
        this.laserEmpty.x = text_Laser.x + 80
        this.laserEmpty.y = text_Laser.y+5
        this.laserAmount=0
        if(this.level.lasers !=0){
            this.laserEmpty.setVisible(false);
            var laserBar
            laserBar = this.add.graphics();
            laserBar.fillStyle(0x32f4f9, 1.0);
            laserBar.fillRect(0, 0, 10, 15);
            laserBar.x = text_Laser.x + 80
            laserBar.y = text_Laser.y+5
            this.laserUIGroup.add(laserBar);
            this.laserAmount++;
            var nextLaserBar
            for(var i = 1; i<this.level.lasers; i++){
                nextLaserBar = this.add.graphics();
                nextLaserBar.fillStyle(0x32f4f9, 1.0);
                nextLaserBar.fillRect(0, 0, 10, 15);
                nextLaserBar.x = laserBar.x + 12
                nextLaserBar.y = laserBar.y
                this.laserUIGroup.add(nextLaserBar);
                laserBar = nextLaserBar;
                this.laserAmount++;
            }
        }
    }
    setWormHole(){
        if(this.level.wormholes.startColor ==="red"){
            this.wormholeStart.play("red");
        }
        else{
            this.wormholeStart.play("green");
        }
        if(this.level.wormholes.endColor ==="red"){
            this.wormholeEnd.play("red");
            this.target.play("RedTarget")
        }
        else{
            this.wormholeEnd.play("green");
            this.target.play("GreenTarget")
        }
    }
    createInteractableAssets(){
        for(var i =0; i<this.level.astroids.length; i++){
            var astroid=this.physics.add.sprite(10,10,"astroid");
            astroid.setDepth(0);
            this.astroidGroup.add(astroid);
            this.aGrid.placeAndScaleAtIndex(this.level.astroids[i].place, astroid,.8);
        }
        
       
    }
    hideAstroid(astroid){
        astroid.setVisible(false);
        astroid.body.reset(500,-64);
    }
    unhideAllAstroid(){
        for(var i =0; i<this.level.astroids.length; i++){
            this.aGrid.placeAndScaleAtIndex(this.level.astroids[i].place, this.astroidGroup.getChildren()[i],.8);
            this.astroidGroup.getChildren()[i].setVisible(true);
        }
    }
    unHideLaserUI(){
        var isEmpty = true;
        this.laserUIGroup.getChildren().forEach(function(laserUI){
            laserUI.setVisible(true);
            isEmpty = false;
        })
        this.laserAmount = this.laserUIGroup.getChildren().length;
        if(!isEmpty){
            this.laserEmpty.setVisible(false);
        }
    }
    createPauseScreen(){
        this.uiFailedGroup = this.add.group();
        var veil = this.add.graphics({x:0,y:0});
        veil.fillStyle('0x000000', 0.3);
        veil.fillRect(0,0, 500,600);
        veil.setDepth = 30;
        var txt_failed =this.add.text(0,0, "M I S S I O N   F A I L E D",{fontFamily: "Arial Black", fontSize: 30, color:"#FFFFFF", stroke: "#FF0000", strokeThickness: 6 });
        this.uiGrid= new AlignGrid({scene: this, cols: 3, rows: 3});
        this.uiGrid.placeTextAtIndex(1, txt_failed);
        txt_failed.setDepth = 30;
        var resetButton =this.add.text(0,0, "Reset?",{fontSize: 40, color:"#FFFFFF", stroke: "#FF0000", strokeThickness: 4 })
        .setInteractive()
        .on('pointerdown', () => {this.setPlayer(this.level.ufo);
            //this.astroidGroup.clear(true, true);
            this.unhideAllAstroid();
            this.unHideLaserUI();
            if(this.wormholeStart){
                this.setWormHole();
            }
        })
        .on('pointerover', () => this.enterButtonHoverState(resetButton, "#FF0000") )
        .on('pointerout', () => this.enterButtonRestState(resetButton,"#FF0000") );
        this.uiGrid.placeTextAtIndex(4, resetButton);
        resetButton.setDepth = 30;
        this.uiFailedGroup = this.add.group();
        this.uiFailedGroup.add(veil);
        this.uiFailedGroup.add(txt_failed);
        this.uiFailedGroup.add(resetButton);
        this.uiFailedGroup.setVisible(false); 
        
    }
    createSuccessScreen(){
        this.uiSuccessGroup = this.add.group();
        var veil = this.add.graphics({x:0,y:0});
        veil.fillStyle('0x000000', 0.3);
        veil.fillRect(0,0, 500,600);
        veil.setDepth = 30;
        var txt_Sucess =this.add.text(0,0, "M I S S I O N   S U C C E S S",{fontFamily: "Arial Black", fontSize: 30, color:"#FFFFFF", stroke: "#05ed04", strokeThickness: 8 });
        this.uiGrid.placeTextAtIndex(1, txt_Sucess);
        txt_Sucess.setDepth = 30;
        var nextLevelButton =this.add.text(0,0, "Next Level?",{fontSize: 40, color:"#FFFFFF", stroke: "#05ed04", strokeThickness: 4 })
        .setInteractive()
        .on('pointerdown', () => {var selectedLevel = Number(localStorage.getItem('level'));
            selectedLevel = selectedLevel+1;
            if(selectedLevel ==11){
                location.href='difficulty.html';
                return;
            }
            localStorage.setItem('level',selectedLevel.toString());
            document.cookie = `level=${selectedLevel}`;
            location.href='game.html';})
        .on('pointerover', () => this.enterButtonHoverState(nextLevelButton,"#05ed04") )
        .on('pointerout', () => this.enterButtonRestState(nextLevelButton,"#05ed04") );
        this.uiGrid.placeTextAtIndex(4, nextLevelButton);
        nextLevelButton.setDepth = 30;
        this.uiSuccessGroup = this.add.group();
        this.uiSuccessGroup.add(veil);
        this.uiSuccessGroup.add(txt_Sucess);
        this.uiSuccessGroup.add(nextLevelButton);
        this.uiSuccessGroup.setVisible(false);
    }
   
    enterButtonHoverState(btn, color) {
        btn.setStroke(color,10);
    }

    enterButtonRestState(btn,color) {
        btn.setStroke(color,4);
    }
    setPlayer(gridPosistion){
        this.isMovingRight = false;
        this.isMovingLeft = false;
        this.isMovingBack = false;
        this.isMovingForward = false;
        this.isShooting= false;
        this.HitAstroid=false;
        this.isIF = false;
        this.playerIndex = gridPosistion;
        this.playerAngle = 0;
        this.aGrid.placeAndScaleAtIndex(this.playerIndex, this.ufo,.9);
        
		//this.ufo.body.reset(this.ufo.x,this.ufo.y);
        this.ufo.angle = this.playerAngle;
        this.ufo.play("idle");
        this.astroidGroup.getChildren().forEach(function(astroid){
            astroid.play("stop");
        },this);
        this.uiFailedGroup.setVisible(false);
        enableBtns();
    }

    stopPlayer(){
        this.isMovingRight = false;
        this.isMovingLeft = false;
        this.isMovingBack = false;
        this.isMovingForward = false;
        this.isShooting = false;
        this.HitAstroid =false;
        this.running = false;
        this.complete = true;
        this.playingMusic= false;
        this.isIF = false;
        this.ufo.play("idle");
        //var pos =this.aGrid.indexPosition(this.playerIndex)
        this.ufo.setVelocityX(0);
        this.ufo.setVelocityY(0);

        this.ufo.setAngularVelocity(0);
        //this.ufo.body.reset();
        //this.aGrid.placeAndScaleAtIndex(this.playerIndex, this.ufo,.9)
        
    }
    
    
    animationCreate(){
        this.anims.create({
            key: 'Forward',
            frames: this.anims.generateFrameNames('ufo', {start: 0, end:7, zeroPad: 1, prefix: 'Forward', suffix: '.png'}),
            frameRate: 8,
            repeat: 0
        });
        
        this.anims.create({
            key: 'Left',
            frames: this.anims.generateFrameNames('ufo', {start: 1, end: 8, zeroPad: 1, prefix: 'Left', suffix: '.png'}),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'Right',
            frames: this.anims.generateFrameNames('ufo', {start: 1, end: 8, zeroPad: 1, prefix: 'Right', suffix: '.png'}),
            frameRate: 8,
            repeat: 0
        });
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames('ufo', {start: 0, end: 0, zeroPad: 1, prefix: 'Forward', suffix: '.png'}),
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
        this.anims.create({
            key: 'ScanOn',
            frames: this.anims.generateFrameNames('scan', {start: 0, end:16, zeroPad: 1, prefix: 'Scan', suffix: '.png'}),
            frameRate: 20,
            repeat: 0
        });
        this.anims.create({
            key: 'ScanOff',
            frames: this.anims.generateFrameNames('scan', {start: 0, end:0, zeroPad: 1, prefix: 'Scan', suffix: '.png'}),
            frameRate: 20,
            repeat: 0
        });
        this.anims.create({
            key: 'GreenTarget',
            frames: this.anims.generateFrameNames('target', {start: 1, end:5, zeroPad: 1, prefix: 'Green', suffix: '.png'}),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'RedTarget',
            frames: this.anims.generateFrameNames('target', {start: 1, end:5, zeroPad: 1, prefix: 'Red', suffix: '.png'}),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'green',
            frames: this.anims.generateFrameNames('portal', {start: 1, end:1, zeroPad: 1, prefix: 'GreenWormhole', suffix: '.png'}),
            frameRate: 1,
            repeat: 0
        });
        this.anims.create({
            key: 'red',
            frames: this.anims.generateFrameNames('portal', {start: 1, end:1, zeroPad: 1, prefix: 'RedWormhole', suffix: '.png'}),
            frameRate: 1,
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
    requestPlayerShoot(){
        if(this.laserAmount!=0){
            this.isShooting= true;
            this.complete = false;
            this.laserUIGroup.getChildren()[--this.laserAmount].setVisible(false);
            this.lasers.fireLaser(this.ufo.x, this.ufo.y, this.playerAngle);
            this.laserSound.play({
                volume:1,
                rate: 1,
                detune:0,
                seek: 0,
                loop: false,
                delay: 0
            });
            if(this.laserAmount===0){
                this.laserEmpty.setVisible(true);
            }
        } 
    }
    requestPlayerMoveBack(){
        this.isMovingBack= true;
        this.complete = false;
        this.startX = this.ufo.x
        this.startY = this.ufo.y
        this.ufo.play("Backward");
    }
    playMusic(){
        if(!this.backgroundMusicPlaying){
            this.audio.resume();
        }
       
    }
    playWormholeMusic(){
        this.wormholeAudio.resume();

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
            this.aGrid.placeAndScaleAtIndex(this.playerIndex, this.ufo, .9);
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
            this.aGrid.placeAndScaleAtIndex(this.playerIndex, this.ufo, .9);
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
            this.aGrid.placeAndScaleAtIndex(this.playerIndex, this.ufo, .9);
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
            this.aGrid.placeAndScaleAtIndex(this.playerIndex, this.ufo, .9);
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
    checkInFront(){
        this.scan.play("ScanOn");
        this.complete = false;
        var myIndex = -1;
        if(this.playerAngle == 0){
            myIndex = this.getIndexUp(this.playerIndex);
        }
        else if(this.playerAngle == 90){
            myIndex = this.getIndexRight(this.playerIndex)
        }
        else if(this.playerAngle == -180 || this.playerAngle == 180){
            myIndex = this.getIndexDown(this.playerIndex)
        }
        else if(this.playerAngle == -90){
            myIndex = this.getIndexLeft(this.playerIndex)
        }
        
        if(myIndex != -1){
            return this.getObjectAt(myIndex);
        }
        return "OB";
        
    }
    getIndexUp(index){
        if(index<this.cols){
            return -1
        }
        return index-this.cols
    }
    getIndexDown(index){
        var boxes = this.cols*this.rows;
        if(index >= boxes-this.cols){
            return -1
        }
        return index+this.cols
    }
    getIndexRight(index){
        if((index+1)%this.cols===0 && index!=0){
            return -1
        }
        return index+1
    }
    getIndexLeft(index)
    {
        if(index%this.cols===0 && index!=0){
            return -1
        }
        return index-1
    }
    getObjectAt(index){
        var myObj = "E"
        this.astroidGroup.getChildren().forEach(function(astroid){
            if(this.aGrid.isAtIndex(index, astroid)){
                myObj = "A"
            }
        },this);
        if(this.target){
            if(this.aGrid.isAtIndex(index, this.target)){
                myObj = "T"
            }
        }
        return myObj
    }
}