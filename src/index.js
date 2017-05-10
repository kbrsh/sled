var createVNode = function(tag, content) {
  return {
    type: tag,
    content: content
  }
}

var createNode = function(vnode, index) {
  var node = document.createElement(vnode.type);
  node.textContent = vnode.content;
  node.__sledIndex__ = index;

  if(vnode.content.length === 0) {
    node.appendChild(document.createElement("br"));
  }

  return node;
}

function Sled(el) {
  // Get Element
  this.el = document.querySelector(el);

  // Setup Data
  this.data = [createVNode("p", "")];

  // Selected Node Positions
  this.nodeStart = 0;
  this.nodeEnd = 0;

  // Cursor Positions
  this.cursorStart = 0;
  this.cursorEnd = 0;

  // Set Content Editable
  this.el.setAttribute("contenteditable", "true");

  // Setup Sledit ID
  this.el.setAttribute("data-sled", "");

  // Attach Listeners
  var self = this;

  this.el.addEventListener("keypress", function(e) {
    self.editText(e);
  });

  this.el.addEventListener("keydown", function(e) {
    // self.editAction(e);
  });

  document.addEventListener("selectionchange", function(e) {
    self.handleCursor(e);
  });

  // Setup Initial Text
  this.build();
}

Sled.prototype.editText = function(e) {
  var cursorStart = this.cursorStart;
  var cursorEnd = this.cursorEnd;
  var nodeStart = this.nodeStart;
  var nodeEnd = this.nodeEnd;

  var data = this.data;

  var node = null;
  var content = null;

  var key = e.key;

  if(cursorStart === cursorEnd) {
    node = data[nodeStart];
    content = node.content;

    node.content = content.slice(0, cursorStart) + key + content.slice(cursorStart);
  }
}

Sled.prototype.handleCursor = function(e) {
  var selection = document.getSelection();

  var startNode = selection.focusNode.parentNode;
  var endNode = selection.anchorNode.parentNode;

  if(startNode.__sledIndex__ !== undefined) {
    var start = selection.focusOffset;
    var end = selection.anchorOffset;
    if(end < start) {
      var tmp = start;
      start = end;
      end = tmp;
    }

    var startNodeIndex = startNode.__sledIndex__;
    var endNodeIndex = endNode.__sledIndex__;
    if(endNodeIndex < startNodeIndex) {
      var tmp = startNodeIndex;
      startNodeIndex = endNodeIndex;
      endNodeIndex = tmp;
    }

    this.cursorStart = start;
    this.cursorEnd = end;

    this.nodeStart = startNodeIndex;
    this.nodeEnd = endNodeIndex;
  }
}

Sled.prototype.load = function(data) {
  this.data = data;
  this.build();
}

Sled.prototype.build = function() {
  var el = this.el;
  var data = this.data;
  var node = el.firstChild;

  for(var i = 0; i < data.length; i++) {
    var vnode = data[i];

    if(node === null) {
      node = createNode(vnode, i);
      el.appendChild(node);
    } else if(i !== node.__sledIndex__) {
      node.__sledIndex__ = i;
      if(vnode.content !== node.textContent) {
        node.textContent = vnode.content;
      }
    }

    node = node.nextSibling;
  }
}

Sled.version = "__VERSION__";
