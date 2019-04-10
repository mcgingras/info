// polyfill for removing elements from the screen
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

var DELIMITERS = {
    start: '~|:;',
    end: ';:|~'
};

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

class Highlight{
  constructor(){
    this.selection = null;
    this.string = "";
    this.comment = "";
  }

  getSelection(){
    if (window.getSelection()) {
      this.selection = window.getSelection();
    } else if (document.getSelection()) {
      this.selection = document.getSelection();
    } else if (document.selection) {
      this.selection = document.selection.createRange().text;
    }
    this.string = this.selection.toString();
  }

  createHighlight(){
    /*
    STEPS
    1. From selection, find the anchor or focus, whichever is first.
    2. Use this node to find all other nodes, iterating through them all until string is matched.
       For each node, wrap the ends in special characters.
    3. Replace special characters with Span tags that have a yellow highlight.
    4. Delete Selection
     */

    // var highlight = document.createElement('span');
    // highlight.setAttribute('style', 'background-color: yellow');
    //
    // var t = document.createTextNode(string);
    // highlight.appendChild(t);
    // var split = this.selection.anchorOffset > this.selection.focusOffset
    // ? this.selection.anchorNode.splitText(this.selection.anchorOffset)
    // : this.selection.focusNode.splitText(this.selection.focusOffset);

    var string = this.selection.toString();
    var container = this.selection.getRangeAt(0).commonAncestorContainer;
    this.doHighlight(string,this.selection,container);
    // this.selection.deleteFromDocument();
    // this.selection.anchorNode.parentElement.insertBefore(highlight,split);
  }

  doHighlight(string, selectionElement, containerElement){

    var charsHighlighted = 0;
    const anchor = selectionElement.anchorNode;
    const anchorOffset = selectionElement.anchorOffset;
    const focus = selectionElement.focusNode;
    const focusOffset = selectionElement.focusOffset;

    var newText = "";

    // only want to iterate on text nodes
    if (containerElement.nodeType === Node.TEXT_NODE){
      var nodeValueLength = containerElement.nodeValue.length;
      for (var i = 0; i < nodeValueLength; i++) {
        if (i === anchorOffset){
          newText += DELIMITERS.start;
        }
        if (charsHighlighted === string.length) {
            newText += DELIMITERS.end;
            newText += containerElement.nodeValue.substr(i);
            break;
        }
        newText += containerElement.nodeValue[i];

        if(i > anchorOffset){
          charsHighlighted++;
        }
      }
    }

    containerElement.nodeValue = newText;

    const startRe = new RegExp(escapeRegex(DELIMITERS.start), "g");
    const endRe = new RegExp(escapeRegex(DELIMITERS.end), "g");

    containerElement.parentElement.innerHTML = containerElement.parentElement.innerHTML.replace(startRe, "<span style='background-color: yellow'>").replace(endRe, "</span>");
  }



  // createPopup renders a popup to the screen. Since I could not figure out
  // how to create an extension in react, I am doing this the old fashion way.
  // It is almost hilarious how medieval this looks.
  createPopup(mx,my){
    var popup = document.createElement("DIV");
    var popup__text = document.createElement("DIV");
    var popup__textarea = document.createElement("DIV");
    var textarea = document.createElement("TEXTAREA");
    textarea.id = "comment";
    var label = document.createElement("LABEL");
    var textnode = document.createTextNode(this.string);
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

}


// Global Variables
var string = "";
var body = document.getElementsByTagName("BODY")[0];
var isOpen = false;
var isTextbox = false;
var flag = 0;
var x1;
var y1;
var x2;
var y2;
var minDelta = 10;



chrome.runtime.onMessage.addListener((msg, sender, response) => {
  switch (msg.type) {
    case 'requestData':
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


// Removes the popup from the screen so we do not have more than one popup
// rendered at a time. This is why react and state would be ideal right now.
function removePopup(){
  var node = document.getElementsByClassName('popup')[0];
  node.remove();
  isOpen = false;
}




// This is to help differentiate between a click and a drag.
// I found that often times I was double clicking on something to copy it,
// but that didnt mean I was trying to activate the highlight to save.
// So there is a need to differ between a click and a drag for mouseup.

window.addEventListener("mousedown", function(e){
    x1 = e.clientX;
    y1 = e.clienyY;
    flag = 0;
    isTextbox = false;

    if(e.target.classList[1] == "popup--safe" ||
       e.target.nodeName == "INPUT" ||
       e.target.nodeName == "SELECT" ||
       e.target.nodeName == "TEXTAREA"
     ){
       isTextbox = true;
     }
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



// the "MAIN" function.
// triggers everything else.
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

  if(flag === 0 || isTextbox){
    return;
  }

  var my = String(e.pageY) + "px";
  var mx = String(e.pageX) + "px";

  // this needs a lot of work, but at least its sort of there.
  // 1. if you highlight backwards it gets deleted
  // 2. if you highlight multiple paragraphs, or the same, it deletes
  // 3. deleting is not persistent
  const h = new Highlight();
  h.getSelection();
  h.createHighlight();

  if(h.string != "") {
    h.createPopup(mx,my);
    isOpen = true;
  }

});
