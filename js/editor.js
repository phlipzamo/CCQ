
let codeEditor = ace.edit("editorCode",{
    useWrapMode: true,
    highlightActiveLine: true,
    showPrintMargin: false,
    theme: 'ace/theme/gob',
    mode: 'ace/mode/javascript',
    initialContent: 'hi'
});
document.getElementById('editorCode').style.fontSize='40px';

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

