const createVNode = (tag, content, children) => {
  if(content === undefined) {
    return {
      type: tag,
      children: children,
      node: null
    }
  } else {
    return {
      type: tag,
      content: content,
      children: children,
      node: null
    }
  }
}

const createNode = (vnode) => {
  const type = vnode.type;
  const children = vnode.children;

  let node = null;

  if(type === "#text") {
    const content = vnode.content;
    node = document.createTextNode(content);
  } else {
    node = document.createElement(vnode.type);

    if(children.length !== 0) {
      for(var i = 0; i < children.length; i++) {
        node.appendChild(createNode(children[i]));
      }
    }

    vnode.node = node;
    node.__SLED__VNODE__ = vnode;
  }

  return node;
}

const moveCursor = (el, offset, selection) => {
  const range = document.createRange();
  range.setStart(el, offset);
  range.setEnd(el, offset);
  selection.removeAllRanges();
  selection.addRange(range);
}

const moveCursorEnd = (el, selection) => {
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function Sled(el) {
  // Get Element
  this.el = document.querySelector(el);

  // Initial Data
  this.data = createVNode("p", undefined, [createVNode("br", undefined, [])]);

  // Initial Node
  this.el.appendChild(createNode(this.data));

  // Set Content Editable
  this.el.setAttribute("contenteditable", "true");

  // Attach Listeners
  var self = this;

  this.el.addEventListener("keypress", function(e) {
    e.preventDefault();
    self.editText(e);
  });

  this.el.addEventListener("keydown", function(e) {
    self.editAction(e);
  });
}

Sled.prototype.editText = function(e) {
  const selection = document.getSelection();

  let anchorNode = selection.anchorNode;
  let anchorOffset = selection.anchorOffset;

  let focusNode = selection.focusNode;
  let focusOffset = selection.focusOffset;

  if(anchorNode.nodeType === 1) {
    anchorNode = anchorNode.firstChild;
  }

  if(focusNode.nodeType === 1) {
    focusNode = focusNode.firstChild;
  }

  const parentAnchorNode = anchorNode.parentNode;
  const parentFocusNode = focusNode.parentNode;

  if(e.keyCode === 13) {
    // Enter
  } else {
    const key = e.key;

    if(anchorNode === focusNode) {
      // Selection is within the same node
      if(selection.isCollapsed === true) {
        // Selection is collapsed
        if(anchorNode.nodeName === "BR") {
          // Add text to empty node
          const newVNode = createVNode("#text", key, []);
          parentAnchorNode.__SLED__VNODE__.children[0] = newVNode;

          const firstChild = createNode(newVNode);
          parentAnchorNode.removeChild(anchorNode);
          parentAnchorNode.appendChild(firstChild);

          moveCursorEnd(firstChild, selection);
        }
      }
    }
  }
}

Sled.prototype.editAction = function(e) {

}

Sled.version = "__VERSION__";
