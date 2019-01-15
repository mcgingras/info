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

// submit data takes the highlighted text and sends it to the db.
// TODO: add tags and stuff like that to payload.
function submitData(data){
  console.log("submitting data");
  chrome.runtime.sendMessage({
      type: "addData",
      data: data
    }, (response) => {
      console.log(response);
  });
  removePopup();
  return true;
}


function removePopup(){
  var node = document.getElementsByClassName('popup')[0];
  node.remove();
  console.log("removing");
  isOpen = false;
}

function createDiv(mx,my,string){
  var popup = document.createElement("DIV");
  var popup__text = document.createElement("DIV");
  var popup__actionbar = document.createElement("DIV");
  var popup__textarea = document.createElement("DIV");
  var textarea = document.createElement("TEXTAREA");
  var button = document.createElement("BUTTON");
  var textnode = document.createTextNode(string);

  button.className += "1 popup--safe";
  button.innerHTML = "Submit"
  button.onclick = () => {submitData(string)};

  body.appendChild(popup);
  popup.appendChild(popup__textarea);
  popup__textarea.appendChild(textarea);
  popup.appendChild(popup__text);
  popup.appendChild(popup__actionbar);
  popup__text.appendChild(textnode);
  popup__actionbar.appendChild(button);

  popup.classList.add("popup");
  popup__textarea.classList.add("popup--edit")
  popup__actionbar.classList.add("popup--actionbar");
  popup__actionbar.classList.add("popup--safe");
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
  var string = result.toString();

  my = String(my) + "px";
  mx = String(mx) + "px";


  if(string != "") {
    createDiv(mx,my,string);
    isOpen = true;
  }

});
