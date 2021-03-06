/* global ajax */
/* jshint unused: false */

(function () {
  'use strict';

  init();

  function init() {
    $('#autoroot').click(autoRoot);
  }

  var isOn = false;
  var timer;

  function autoRoot(e) {
    e.stopPropagation();
    isOn = !isOn;
    $('#autoroot').parent().toggleClass('on');

    if(isOn){
      start();
    }else{
      clearInterval(timer);
    }
  }

  function start() {
    clearInterval(timer);
    timer = setInterval(rooting, 1000);
  }

  function rooting() {
    var dead = $('.dead, .chopped');

    if (dead.length > 0) {
      dead.map((i, t)=>$(t).parent().attr('data-id')).each((i, treeId)=>{
        var tree = $(`.tree[data-id=${treeId}]`);
        ajax(`/trees/${treeId}/remove`, 'delete', null, t=>{
          tree.remove();
        });
      });
    }
  }

})();
