var isMobile = navigator.userAgent.indexOf("Mobile");
if (isMobile == -1) {
    isMobile = navigator.userAgent.indexOf("Tablet");
}
if ( document.URL.includes("homepage.aspx") ) {
    //Code here
}
if (document.URL.includes("game.html") ) {
    var config = {
        type: Phaser.AUTO,scale: {mode: Phaser.Scale.NONE,
            parent: 'phaser-div',
          width:500,
          height: 600
      },
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        },
        dom: {
            createContainer: true
        },
        scene: [SceneMain],
        
    };
} 
else {
    var config = {
        type: Phaser.AUTO,
        width:500,
        height: 500,
        parent: 'phaser-div',
        
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        },
        dom: {
            createContainer: true
        },
        scene: [SceneMain],
        
    };
}
var game = new Phaser.Game(config);
