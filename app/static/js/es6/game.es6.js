/* jshint unused:false */

var audioChop, audioBeanStalk, audioDead;

function ajax(url, type, data={}, success=r=>console.log(r), dataType='html') {
  'use strict';
  $.ajax({
    url: url,
    type: type,
    dataType: dataType,
    data: data,
    success: success
  });
}

(function () {
  'use strict';

  $(document).ready(init);

  function init() {
    $('#login').click(login);
    $('#dashboard').on('click', '#plant', plant);
    $('#dashboard').on('click', '#sell', sell);
    $('#dashboard').on('click', '#auto-grow', PurchaseAutoGrow);
    $('#dashboard').on('click', '#auto-seed', PurchaseAutoSeed);
    $('#dashboard').on('click', '#auto-root', PurchaseAutoRoot);
    $('#dashboard').on('click', '#buy-house', PurchaseHouse);
    $('#forest').on('click', '.grow', grow);
    $('#forest').on('click', '.chop', chop);
    preloadAssets();
  }

  function preloadAssets() {
    audioChop = $('<audio>')[0];
    audioChop.src = '/audios/chop.wav';
    audioBeanStalk = $('<audio>')[0];
    audioBeanStalk.src = '/audios/beanstalk.wav';
    audioDead = $('<audio>')[0];
    audioDead.src = '/audios/dead.wav';
  }

  function login() {
    var username = $('#username').val();
    ajax('/login', 'post', {username: username}, response=>{
      $('#overivew').empty();
      $('#overview').append(response.overview);
      $('#inventory').empty();
      $('#inventory').append(response.inventory);
      $('#house').empty();
      $('#house').append(response.house);
      forest();
    }, 'json');
  }

  function plant() {
    var userId = $('#user').attr('data-id');
    ajax('/trees/plant', 'post', {userId: userId}, response=>{
      $('#forest').append(response);
    });
  }

  function forest() {
    var userId = $('#user').attr('data-id');
    ajax(`/trees?userId=${userId}`, 'get', {}, response=>{
      $('#forest').empty();
      $('#forest').append(response);
    });
  }

  function grow() {
    var tree = $(this).closest('.tree');
    var treeId = tree.attr('data-id');
    ajax(`/trees/${treeId}/grow`, 'put', null, response=>{
      tree.replaceWith(response);
      if($(response).hasClass('beanstalk')){
        audioBeanStalk.play();
      }
      if($(response).hasClass('dead')){
        audioDead.play();
      }
    });
  }

  function chop() {
    audioChop.play();
    var tree = $(this).closest('.tree');
    var treeId = tree.attr('data-id');
    var userId = $('#user').attr('data-id');

    ajax(`/trees/${treeId}/chop`, 'put', {userId: userId}, response=>{
      tree.replaceWith(response.html);
      $('#wood').text(`Wood: ${response.user.wood.toFixed(2)}`);
    }, 'json');
  }

  function sell(e) {
    e.preventDefault();
    var userId = $('#user').attr('data-id');
    var amount = $('#wood-amount').val();

    ajax(`users/${userId}/sell`, 'put', {amount: amount}, response=>{
      $('#overview').empty();
      $('#overview').append(response);
    }, 'html');
  }

  function PurchaseAutoGrow() {
    var userId = $('#user').attr('data-id');

    ajax(`users/${userId}/purchase/autogrow`, 'put', null, response=>{
      console.log(response);
      $('#overivew').empty();
      $('#overview').append(response.overview);
      $('#inventory').empty();
      $('#inventory').append(response.inventory);
    }, 'json');
  }

  function PurchaseAutoSeed() {
    var userId = $('#user').attr('data-id');

    ajax(`users/${userId}/purchase/autoseed`, 'put', null, response=>{
      console.log(response);
      $('#overivew').empty();
      $('#overview').append(response.overview);
      $('#inventory').empty();
      $('#inventory').append(response.inventory);
    }, 'json');
  }

  function PurchaseAutoRoot() {
    var userId = $('#user').attr('data-id');

    ajax(`users/${userId}/purchase/autoroot`, 'put', null, response=>{
      $('#overivew').empty();
      $('#overview').append(response.overview);
      $('#inventory').empty();
      $('#inventory').append(response.inventory);
    }, 'json');
  }

  function PurchaseHouse() {
    var userId = $('#user').attr('data-id');

    ajax(`users/${userId}/move/house`, 'put', null, response=>{
      console.log(response);

      // $('#overivew').empty();
      // $('#overview').append(response.overview);
      // $('#house').empty();
      // $('#house').append(response.house);
    }, 'json');
  }
})();
