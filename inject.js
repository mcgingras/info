var body = document.getElementsByTagName("BODY")[0];
console.log(body);

var getSelectedText = function () {
  var selectedText = '';

  if (window.getSelection()) {
    selectedText = window.getSelection();
  } else if (document.getSelection()) {
    selectedText = document.getSelection();
  } else if (document.selection) {
    selectedText = document.selection.createRange().text;
  }

  return selectedText;
};

window.addEventListener('mouseup', function (e) {
  var result = getSelectedText();
  var string = result.toString();
  var mx = event.clientX;
  var my = event.clientY;

  my = String(my) + "px";
  mx = String(mx) + "px"; 

  console.log(string);

  if(string != ""){ // we only want to save strings of text -- not empty. (pics tho?)
    console.log(mx, my);
    var node = document.createElement("DIV");
    var textnode = document.createTextNode("Save");
    node.appendChild(textnode);
    body.appendChild(node);

    node.classList.add("popup");

    node.style.left = mx;
    node.style.top = my;
    node.style.border = "2px solid black";
    node.style.position = "absolute";

    console.log(node);
  }

});
