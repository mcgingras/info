// polyfill

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}


var string = "";
var body = document.getElementsByTagName("BODY")[0];
var isOpen = false;

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


chrome.runtime.onMessage.addListener((msg, sender, response) => {
  switch (msg.type) {
    case 'requestData':
      console.log("Request Initiated");
      const comment = document.getElementById('comment').value;
      if (comment == null){
        comment = ""
      }
      if(string != ""){
        response({highlight: string, comment: comment || "" });
        removePopup();
      }
      break;
    default:
      response('unknown request');
      break;
  }
});



function removePopup(){
  var node = document.getElementsByClassName('popup')[0];
  node.remove();
  console.log("removing");
  isOpen = false;
}

function createDiv(mx,my,string){
  var popup = document.createElement("DIV");
  var popup__text = document.createElement("DIV");
  var popup__textarea = document.createElement("DIV");
  var textarea = document.createElement("TEXTAREA");
  textarea.id = "comment";
  var label = document.createElement("LABEL");
  var textnode = document.createTextNode(string);
  label.innerHTML = "NEW HIGHLIGHT";

  body.appendChild(popup);
  popup.appendChild(popup__textarea);
  popup__textarea.appendChild(label);
  popup__textarea.appendChild(textarea);
  popup.appendChild(popup__text);
  popup__text.appendChild(textnode);

  popup.classList.add("popup");
  popup__textarea.classList.add("popup--edit")
  textarea.classList.add("textarea");
  textarea.classList.add("popup--safe");
  popup__text.classList.add("popup--text");
  popup__text.classList.add("popup--safe");
  label.classList.add('popup--label');

  popup.style.left = mx;
  popup.style.top = my;
}


// This is to help differentiate between a click and a drag.
// I found that often times I was double clicking on something to copy it,
// but that didnt mean I was trying to activate the highlight to save.
// So there is a need to differ between a click and a drag for mouseup.
var flag = 0;
var x1;
var y1;
var x2;
var y2;
var minDelta = 10;
window.addEventListener("mousedown", function(e){
    x1 = e.clientX;
    y1 = e.clienyY;
    flag = 0;
}, false);

window.addEventListener("mousemove", function(e){
    x2 = e.clientX;
    y2 = e.clientY;
    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);

    // only want to consider it a drag as long as we
    // register a drag of reasonable length
    if (dx > minDelta || dy > minDelta){
      flag = 1;
    }

}, false);


window.addEventListener('mouseup', function (e) {

  if(e.target.classList[1] == "popup--safe" ||
     e.target.nodeName == "INPUT" ||
     e.target.nodeName == "SELECT" ||
     e.target.nodeName == "TEXTAREA"
   ){
    return;
  }

  if(isOpen){
    removePopup();
  }

  if(flag === 0){
    return;
  }

  var mx = e.pageX;
  var my = e.pageY;

  var result = getSelectedText();
  string = result.toString();

  my = String(my) + "px";
  mx = String(mx) + "px";


  if(string != "") {
    createDiv(mx,my,string);
    isOpen = true;
  }

});
