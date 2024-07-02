
let codeEditor = ace.edit("editorCode",{
    highlightActiveLine: true,
    showPrintMargin: false,
    theme: 'ace/theme/gob',
    mode: 'ace/mode/javascript'
});
document.getElementById('editorCode').style.fontSize='40px';
codeEditor.setOptions({
    enableBasicAutocompletion: [{
      getCompletions: (editor, session, pos, prefix, callback) => {
        // note, won't fire if caret is at a word that does not have these letters
        callback(null, [
          {value: 'FORWARD', score: 1, meta: 'Moves UFO Forward'},
          {value: 'BACKWARD', score: 2, meta: 'Moves UFO Forward'},
          {value: 'ROTATE_RIGHT', score: 2, meta: 'Rotate UFO Right'},
          {value: 'ROTATE_LEFT', score: 2, meta: 'Rotate UFO Left'},
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

