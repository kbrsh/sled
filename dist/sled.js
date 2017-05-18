/**
 * Sled v0.0.0
 * Copyright 2017 Kabir Shah
 * Released under the MIT License
 */

(function(root, factory) {
  /* ======= Global Sled ======= */
  (typeof module === "object" && module.exports) ? module.exports = factory() : root.Sled = factory();
}(this, function() {
    var createVNode = function(tag, content, children) {
      return {
        type: tag,
        content: content,
        children: children
      }
    }
    
    var createNode = function(vnode, index) {
      var type = vnode.type;
      var children = vnode.children;
    
      var node = null;
    
      if(type === "#text") {
        node = document.createTextNode("")
      } else {
        node = document.createElement(vnode.type);
        if(children.length !== 0) {
          for(var i = 0; i < children.length; i++) {
            node.appendChild(createNode(children[i]));
          }
        }
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
      this.el.appendChild(createNode(createVNode("p", "", [createVNode("br", "", [])])));
    
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
      var el = this.el;
      var keyCode = e.keyCode;
    
      if(keyCode === 13) {
        var selection = document.getSelection();
    
        var focusNode = selection.focusNode;
        var normalizedFocusNode = focusNode.nodeType === 3 ? focusNode.parentNode : focusNode;
        var focusNodeContent = focusNode.textContent;
        var focusOffset = selection.focusOffset;
        var anchorOffset = selection.anchorOffset;
    
        if(focusOffset > anchorOffset) {
          var tmp = focusOffset;
          focusOffset = anchorOffset;
          anchorOffset = tmp;
        }
    
        // Check if selection is within a single node
        if(focusNode === selection.anchorNode) {
          e.preventDefault();
    
          // Setup content for selected node, and new node
          var newContent = "";
          var newNodeContent = focusNodeContent.substring(anchorOffset, focusNodeContent.length);
    
          // If there is content in the selected node, generate the new content
          if(focusNodeContent.length !== 0) {
            newContent = focusNodeContent.substring(0, focusOffset);
          }
    
          // Update content of the selected node
          if(focusNodeContent !== newContent) {
            focusNode.textContent = newContent;
          }
    
          // Create a new node
          var newNode = document.createElement(normalizedFocusNode.nodeName.toLowerCase());
    
          // Add content for the new node
          if(newNodeContent.length === 0) {
            newNode.appendChild(document.createElement("br"));
          } else {
            newNode.textContent = newNodeContent;
          }
    
          // Insert the new node
          el.insertBefore(newNode, normalizedFocusNode.nextSibling);
        }
      }
    }
    
    Sled.prototype.load = function(data) {
      removeChildren(this.el);
      appendChildren(this.el, data);
    }
    
    Sled.prototype.data = function(el) {
      if(el === undefined) {
        el = this.el;
      }
    
      var data = [];
      var node = el.firstChild;
    
      while(node !== null) {
        var vnode = null;
    
        if(node.nodeName === "#text") {
          vnode = createVNode("#text", node.textContent, []);
        } else {
          vnode = createVNode(node.nodeName.toLowerCase(), "", this.data(node));
        }
    
        data.push(vnode);
        
        node = node.nextSibling;
      }
    
      return data;
    }
    
    Sled.version = "0.0.0";
    
    return Sled;
}));
