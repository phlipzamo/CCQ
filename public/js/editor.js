
let codeEditor = ace.edit("editorCode",{
    highlightActiveLine: true,
    showPrintMargin: false,
    theme: 'ace/theme/gob',
    mode: 'ace/mode/python'
});
document.getElementById('editorCode').style.fontSize='20px';
codeEditor.setOptions({
    enableBasicAutocompletion: [{
      getCompletions: (editor, session, pos, prefix, callback) => {
        // note, won't fire if caret is at a word that does not have these letters
        callback(null, [
          {value: 'forward()', score: 1, meta: 'Moves UFO Forward'},
          {value: 'backward()', score: 2, meta: 'Moves UFO Forward'},
          {value: 'rotate_right()', score: 2, meta: 'Rotate UFO Right'},
          {value: 'rotate_left()', score: 2, meta: 'Rotate UFO Left'},
          {value: 'if ', score: 1, meta: 'if statement'},
          {value: 'for 1 to 5:', score: 2, meta: 'For 10 times'},
        ]);
      },
    }],
    // to make popup appear automatically, without explicit _ctrl+space_
    enableLiveAutocompletion: true,
  });
codeEditor.setValue("");
codeEditor.session.setUseWrapMode(true);
var lineSelected = 1;
function print(text){
    var session = codeEditor.session;
    var line = session.getLine(session.getLength()-1);
    if (line ===""){
        session.insert({
            row: session.getLength(),
            column: 0
         }, text);
    }
    else{
        session.insert({
            row: session.getLength(),
            column: 0
         }, "\n" + text);
    }
}
function getScript(){
    var myCode = codeEditor.getSession().getValue();
    return myCode;
}
function resetSelection(){
    lineSelected = -1;
}
function nextSelection(){
    lineSelected++;
    codeEditor.selection.moveCursorToPosition({row: lineSelected, column: 0});
    codeEditor.selection.selectLine();
}
function errorLine(linenumber){
  var Range = ace.require("ace/range").Range
  codeEditor.session.addMarker(new Range(linenumber-1, 0, linenumber-1,1), "myMarker", "fullLine");
}
function removeMarkers(){
  const prevMarkers = codeEditor.session.getMarkers();
  if (prevMarkers) {
    const prevMarkersArr = Object.keys(prevMarkers);
    for (let item of prevMarkersArr) {
      codeEditor.session.removeMarker(prevMarkers[item].id);
    }
  }
}
