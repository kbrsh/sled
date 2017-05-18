var createVNode = function(tag, content, children) {
  return {
    type: tag,
    content: content,
    children: children
  }
}

var createNode = function(vnode, index) {
  var node = document.createElement(vnode.type);
  node.textContent = vnode.content;

  if(vnode.content.length === 0) {
    node.appendChild(document.createElement("br"));
  }

  return node;
}

var appendChildren = function(node, children) {
  for(var i = 0; i < children.length; i++) {
    var child = children[i];
    var childNode = createNode(child);
    node.appendChild(childNode);
    if(child.children.length !== 0) {
      appendChildren(childNode, child.children);
    }
  }
}

var removeChildren = function(node) {
  var child = null;
  while((child = node.firstChild) !== null) {
    node.removeChild(child);
  }
}

function Sled(el) {
  // Get Element
  this.el = document.querySelector(el);

  // Setup Initial Node
  this.el.appendChild(createNode(createVNode("p", "")));

  // Set Content Editable
  this.el.setAttribute("contenteditable", "true");

  // Setup Sledit ID
  this.el.setAttribute("data-sled", "");

  // Attach Listeners
  var self = this;

  this.el.addEventListener("keypress", function(e) {
    self.editText(String.fromCharCode(e.keyCode));
  });

  this.el.addEventListener("paste", function(e) {
    self.editText(e.clipboardData.getData('Text'));
  });

  this.el.addEventListener("keydown", function(e) {
    self.editAction(e);
  });
}

Sled.prototype.editText = function(text) {

}

Sled.prototype.editAction = function(e) {

}

Sled.prototype.load = function(data) {
  removeChildren(this.el);
  appendChildren(this.el, data);
}

Sled.prototype.data = function() {

}

Sled.version = "__VERSION__";
