(function(root, factory) {
  /* ======= Global Sled ======= */
  (typeof module === "object" && module.exports) ? module.exports = factory() : root.Sled = factory();
}(this, function() {
    //=require ./index.js
    return Sled;
}));
