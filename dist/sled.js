/**
 * Sled v0.0.0
 * Copyright 2017 Kabir Shah
 * Released under the MIT License
 */

(function(root, factory) {
  /* ======= Global Sled ======= */
  (typeof module === "object" && module.exports) ? module.exports = factory() : root.Sled = factory();
}(this, function() {
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
    
      // Setup Initial Text
      this.build();
    }
    
    Sled.prototype.editText = function(text) {
    
    }
    
    Sled.prototype.editAction = function(e) {
    
    }
    
    Sled.prototype.load = function(data) {
      this.data = data;
      this.build();
    }
    
    Sled.prototype.build = function() {
    
    }
    
    Sled.version = "0.0.0";
    
    return Sled;
}));
