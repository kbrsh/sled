const styleElement = document.createElement("style");
styleElement.appendChild(document.createTextNode(".sled-editor {white-space: pre-wrap;}"));
document.head.appendChild(styleElement);

const createVNode = (tag, content, index, parent, children) => {
  if(content === undefined) {
    return {
      type: tag,
      index: index,
      parent: parent,
      children: children,
      node: null
    }
  } else {
    return {
      type: tag,
      index: index,
      parent: parent,
      content: content,
      children: children,
      node: null
    }
  }
}

const createEmptyVNode = (index, parent) => {
  const p = createVNode("p", undefined, index, parent, []);
  const br = createVNode("br", undefined, 0, p, []);
  p.children = [br];
  return p;
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
  }

  vnode.node = node;
  node.__SLED__VNODE__ = vnode;

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
  this.data = {
    type: "ROOT",
    index: null,
    parent: null,
    children: [],
    node: null
  };

  const p = createEmptyVNode(0, this.data);
  this.data.children = [p];


  // Initial Node
  this.el.appendChild(createNode(p));

  // Set Content Editable
  this.el.setAttribute("contenteditable", "true");

  // Set Class
  this.el.setAttribute("class", "sled-editor");

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

  if(anchorOffset > focusOffset) {
    const anchorTemp = anchorOffset;
    anchorOffset = focusOffset;
    focusOffset = anchorTemp;
  }

  const parentAnchorNode = anchorNode.parentNode;
  const parentFocusNode = focusNode.parentNode;

  if(e.keyCode === 13) {
    // Enter
    if(anchorNode === focusNode) {
      // Selection is within the same node
      if(selection.isCollapsed === true) {
        // Selection is collapsed
        const vnode = anchorNode.__SLED__VNODE__;
        const parentVNode = vnode.parent;
        const grandVNode = parentVNode.parent;
        const grandChildren = grandVNode.children;

        const parent = anchorNode.parentNode;
        const grandParent = parent.parentNode;

        if(parent.nextSibling === null) {
          // Append to end of list
          const newVNode = createEmptyVNode(grandChildren.length, grandVNode);
          grandChildren.push(newVNode);
          parent.parentNode.appendChild(createNode(newVNode));
        }
      }
    }
  } else {
    let key = e.key;

    if(anchorNode === focusNode) {
      // Selection is within the same node
      if(anchorNode.nodeName === "BR") {
        // Add text to empty node
        const parentVNode = parentAnchorNode.__SLED__VNODE__;
        const newVNode = createVNode("#text", key, 0, parentVNode, []);
        parentVNode.children[0] = newVNode;

        const firstChild = createNode(newVNode);
        parentAnchorNode.removeChild(anchorNode);
        parentAnchorNode.appendChild(firstChild);

        moveCursorEnd(firstChild, selection);
      } else {
        // Add text to text node
        const vnode = anchorNode.__SLED__VNODE__;
        const content = vnode.content;
        const newText = content.substring(0, anchorOffset) + key + content.substring(focusOffset);

        vnode.content = newText;
        anchorNode.textContent = newText;

        moveCursor(anchorNode, anchorOffset + 1, selection);
      }
    }
  }
}

Sled.prototype.editAction = function(e) {

}

Sled.version = "__VERSION__";
