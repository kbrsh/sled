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
    var space = " ";
    var escapedSpace = "&nbsp;";
    
    var styleElement = document.createElement("style");
    styleElement.appendChild(document.createTextNode(".sled-editor {white-space: pre-wrap;}"));
    document.head.appendChild(styleElement);
    
    var createVNode = function (tag, content, children) {
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
      this.data = createVNode("p", undefined, [createVNode("br", undefined, [])]);
    
      // Initial Node
      this.el.appendChild(createNode(this.data));
    
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
    
      var parentAnchorNode = anchorNode.parentNode;
      var parentFocusNode = focusNode.parentNode;
    
      if(e.keyCode === 13) {
        // Enter
      } else {
        var key = e.key;
    
        if(anchorNode === focusNode) {
          // Selection is within the same node
          if(selection.isCollapsed === true) {
            // Selection is collapsed
            if(anchorNode.nodeName === "BR") {
              // Add text to empty node
              var newVNode = createVNode("#text", key, []);
              parentAnchorNode.__SLED__VNODE__.children[0] = newVNode;
    
              var firstChild = createNode(newVNode);
              parentAnchorNode.removeChild(anchorNode);
              parentAnchorNode.appendChild(firstChild);
    
              moveCursorEnd(firstChild, selection);
            } else {
              // Add text to text node
              var vnode = anchorNode.__SLED__VNODE__;
              var content = vnode.content;
              var newText = content.substring(0, anchorOffset) + key + content.substring(anchorOffset);
    
              vnode.content = newText;
              anchorNode.textContent = newText;
    
              moveCursor(anchorNode, anchorOffset + 1, selection);
            }
          }
        }
      }
    }
    
    Sled.prototype.editAction = function(e) {
    
    }
    
    Sled.version = "0.0.0";
    
    return Sled;
}));
