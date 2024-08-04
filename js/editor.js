//Initialize
let codeEditor = ace.edit("editorCode",{
    highlightActiveLine: true,
    showPrintMargin: false,
    theme: 'ace/theme/gob',
    mode: 'ace/mode/python'
});
//set FontSize
document.getElementById('editorCode').style.fontSize='20px';
//setAutoComplete
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
//initial Value
codeEditor.setValue("");
codeEditor.session.setUseWrapMode(true);
codeEditor.setReadOnly(true);
var lineSelected = 1;

// Print to text editor
function print(text){
  var session = codeEditor.session;
  var cursor = codeEditor.selection.getCursor();
  var currentLineNum = cursor.row;
  var line = codeEditor.session.getLine(currentLineNum);
  var loopIndentAmount= 0;
  var indent="    "
  var end = "end"
  //Future implentation
  //getCurrent indent
  //if times or if indent++
  
  // Current implentation
  // get how many if and times and indent that many

  for(var i = currentLineNum+1; i<codeEditor.session.getLength(); i++){
    lineContent = codeEditor.session.getLine(i);
    if(lineContent.includes("end")){
      loopIndentAmount++;
    }
  }

  for(var i=0;i<loopIndentAmount; i++){
    text = indent+text;
    end = indent+end;
  }

  if (line ===""){
      session.insert({
          row: currentLineNum,
          column: 0
        }, text);

  }
  else{
      if(cursor.column ===0 && cursor.row===0){
        session.insert({
          row: currentLineNum,
          column: 0
        },text.replace(/\s/g, "")+" \n");
        codeEditor.selection.moveToPosition({
          row: currentLineNum,
          column:  codeEditor.session.getLine(currentLineNum).length
        });
        return;
      }
      else{
        codeEditor.selection.moveToPosition({
          row: currentLineNum,
          column:  codeEditor.session.getLine(currentLineNum).length
        });
        session.insert({
          row: currentLineNum,
          column: codeEditor.session.getLine(currentLineNum).length
        }, "\n"+ text);
        currentLineNum++;
      }
  }

  if (text.includes("times") || text.includes("if")){
    session.insert({
      row: currentLineNum,
      column: codeEditor.session.getLine(currentLineNum).length
    }, "\n"+end);
    var endPosition = {
      row: currentLineNum,
      column: codeEditor.session.getLine(currentLineNum).length
    };
    
    codeEditor.selection.moveToPosition(endPosition);
  }
}

function printNextTo(text){
  var session = codeEditor.session;
  var cursor = codeEditor.selection.getCursor();
  var currentLine = cursor.row;
  var lineContent = codeEditor.session.getLine(currentLine);
  var loopIndentAmount =0
  if(lineContent.includes("times")){
    for(var i = currentLine+1; i<codeEditor.session.getLength(); i++){
      lineContent = codeEditor.session.getLine(i);
      if(lineContent.includes("end")){
        loopIndentAmount++;
      }
    }
    session.insert({
      row: currentLine,
      column: (loopIndentAmount-1) * 4 
    }, text+".");
  }else{
    session.insert({
      row: currentLine,
      column: codeEditor.session.getLine(currentLine).length
    }, text);
  }
}
function deleteLine(){
  // Get the current cursor position
  var cursor = codeEditor.selection.getCursor();
  // Get the current line number
  var currentLine = cursor.row;

  var lineContent = codeEditor.session.getLine(currentLine);

  codeEditor.session.doc.removeFullLines(currentLine, currentLine); 
  var spaces = countWhitespace(lineContent)
  var tabs=0;
  if(spaces!= 0){
    tabs = spaces/4;
  }

  if (lineContent.includes("end")){

    for(var i = currentLine-1; i>=0; i--){
      lineContent = codeEditor.session.getLine(i);
     
      if(lineContent.includes("times")||lineContent.includes("if")){
        if(tabs == countWhitespace(lineContent)/4){
          codeEditor.session.doc.removeFullLines(i, i); 
          return;
        }
       
      }
      codeEditor.session.replace(
        new ace.Range(i, 0, i, codeEditor.session.getLine(i).length),
        lineContent.substring(4)
      );
    }
  }
  else if(lineContent.includes("times")||lineContent.includes("if")){
    for(var i = currentLine; i<codeEditor.session.getLength(); i++){
      lineContent = codeEditor.session.getLine(i);
      if(lineContent.includes("end")){
        codeEditor.session.doc.removeFullLines(i, i); 
        return;
      }
    }
  }
  codeEditor.selection.moveToPosition({
    row: currentLine-1,
    column:  codeEditor.session.getLine(currentLine-1).length
  });
}
function countWhitespace(str) {
  // Initialize a counter variable
  var whitespaceCount = 0;
  // Loop through each character in the string
  for (var i = 0; i < str.length; i++) {
    // Check if the character is whitespace using the built-in isWhitespace() method (not directly supported in JavaScript)
    if (str[i].match(/\s/)) { // Regex to match whitespace characters
      whitespaceCount++;
    }
  }
  // Return the total count of whitespace characters
  return whitespaceCount;
}
function clearScript(){
  var totalLines = codeEditor.session.doc.getLength();
  codeEditor.session.doc.removeFullLines(0, totalLines); 
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
function setSelection(line){
  codeEditor.selection.moveCursorToPosition({row: line-1, column: 0});
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
