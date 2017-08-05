/**
 * Sled v0.0.0
 * Copyright 2017 Kabir Shah
 * Released under the MIT License
 * https://github.com/KingPixil/sled
 */

(function(root, factory) {
  /* ======= Global Sled ======= */
  (typeof module === "object" && module.exports) ? module.exports = factory() : root.Sled = factory();
}(this, function() {
    var styleElement = document.createElement("style");
    styleElement.appendChild(document.createTextNode(".sled-editor {white-space: pre-wrap;}"));
    document.head.appendChild(styleElement);
    
    var createVNode = function (tag, content, index, parent, children) {
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
    
    var createEmptyVNode = function (index, parent) {
      var p = createVNode("p", undefined, index, parent, []);
      var br = createVNode("br", undefined, 0, p, []);
      p.children = [br];
      return p;
    }
    
    var createNode = function (vnode) {
      var type = vnode.type;
      var children = vnode.children;
    
      var node = null;
    
      if(type === "#text") {
        var content = vnode.content;
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
    
    var moveCursor = function (el, offset, selection) {
      var range = document.createRange();
      range.setStart(el, offset);
      range.setEnd(el, offset);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    var moveCursorEnd = function (el, selection) {
      var range = document.createRange();
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
    
      var p = createEmptyVNode(0, this.data);
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
      var selection = document.getSelection();
    
      var anchorNode = selection.anchorNode;
      var anchorOffset = selection.anchorOffset;
    
      var focusNode = selection.focusNode;
      var focusOffset = selection.focusOffset;
    
      if(anchorNode.nodeType === 1) {
        anchorNode = anchorNode.firstChild;
      }
    
      if(focusNode.nodeType === 1) {
        focusNode = focusNode.firstChild;
      }
    
      if(anchorOffset > focusOffset) {
        var anchorTemp = anchorOffset;
        anchorOffset = focusOffset;
        focusOffset = anchorTemp;
      }
    
      var parentAnchorNode = anchorNode.parentNode;
      var parentFocusNode = focusNode.parentNode;
    
      if(e.keyCode === 13) {
        // Enter
        if(anchorNode === focusNode) {
          // Selection is within the same node
          if(selection.isCollapsed === true) {
            // Selection is collapsed
            var vnode = anchorNode.__SLED__VNODE__;
            var parentVNode = vnode.parent;
            var grandVNode = parentVNode.parent;
            var grandChildren = grandVNode.children;
    
            var parent = anchorNode.parentNode;
            var grandParent = parent.parentNode;
    
            if(parent.nextSibling === null) {
              // Append to end of list
              var newVNode = createEmptyVNode(grandChildren.length, grandVNode);
              grandChildren.push(newVNode);
              parent.parentNode.appendChild(createNode(newVNode));
            }
          }
        }
      } else {
        var key = e.key;
    
        if(anchorNode === focusNode) {
          // Selection is within the same node
          if(anchorNode.nodeName === "BR") {
            // Add text to empty node
            var parentVNode$1 = parentAnchorNode.__SLED__VNODE__;
            var newVNode$1 = createVNode("#text", key, 0, parentVNode$1, []);
            parentVNode$1.children[0] = newVNode$1;
    
            var firstChild = createNode(newVNode$1);
            parentAnchorNode.removeChild(anchorNode);
            parentAnchorNode.appendChild(firstChild);
    
            moveCursorEnd(firstChild, selection);
          } else {
            // Add text to text node
            var vnode$1 = anchorNode.__SLED__VNODE__;
            var content = vnode$1.content;
            var newText = content.substring(0, anchorOffset) + key + content.substring(focusOffset);
    
            vnode$1.content = newText;
            anchorNode.textContent = newText;
    
            moveCursor(anchorNode, anchorOffset + 1, selection);
          }
        }
      }
    }
    
    Sled.prototype.editAction = function(e) {
    
    }
    
    Sled.version = "0.0.0";
    
    return Sled;
}));
