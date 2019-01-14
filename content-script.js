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

  console.log(string);

  if(string != ""){ // we only want to save strings of text -- not empty. (pics tho?)
    var popup = document.createElement("DIV");
    var popup__text = document.createElement("DIV");
    var popup__actionbar = document.createElement("DIV");
    var button = document.createElement("BUTTON");
    var textnode = document.createTextNode("Save");

    popup.appendChild(textnode);
    body.appendChild(node);
    popup.appendChild(popup__text);
    popup.appendChild(popup__actionbar);

    popup.classList.add("popup");
    popup__actionbar.classList.add("popup--actionbar");
    popup__text.classList.add("popup--text");

    node.style.left = mx + 10;
    node.style.top = my + 10;
  }

});
