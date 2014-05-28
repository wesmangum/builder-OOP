/* global ajax */
/* jshint unused: false */

(function () {
  'use strict';

  init();

  function init() {
    $('#autoseed').click(autoSeed);
  }

  var isOn = false;
  var timer;

  function autoSeed(e) {
    e.stopPropagation();
    isOn = !isOn;
    $('#autoseed').parent().toggleClass('on');

    if(isOn){
      start();
    }else{
      clearInterval(timer);
    }
  }

  function start() {
    clearInterval(timer);
    timer = setInterval(seeding, 1000);
  }

  function seeding() {
    var userId = $('#user').attr('data-id');
    var limit = $('.tree .alive:not(.chopped)').length;

    if(limit <= 50){
      ajax('/trees/plant', 'post', {userId: userId}, response=>{
        $('#forest').append(response);
      });
    }
  }

})();
