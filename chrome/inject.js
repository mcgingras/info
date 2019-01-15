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
      if(string != ""){
        response(string);
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

  popup.style.left = mx;
  popup.style.top = my;
}

window.addEventListener('mouseup', function (e) {

  console.log(e);
  if(e.target.classList[1] == "popup--safe"){
    return;
  }

  var mx = e.pageX;
  var my = e.pageY;

  if(isOpen){
    removePopup();
  }
  var result = getSelectedText();
  string = result.toString();

  my = String(my) + "px";
  mx = String(mx) + "px";


  if(string != "") {
    createDiv(mx,my,string);
    isOpen = true;
  }

});
