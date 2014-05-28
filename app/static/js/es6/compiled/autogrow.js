(function() {
  'use strict';
  init();
  function init() {
    $('#autogrow').click(autoGrow);
    slider();
  }
  var isOn = false;
  var timer;
  function autoGrow() {
    isOn = !isOn;
    $('#autogrow').parent().toggleClass('on');
    if (isOn) {
      start();
    } else {
      clearInterval(timer);
    }
  }
  function start() {
    clearInterval(timer);
    timer = setInterval(growing, 1000);
  }
  function growing() {
    $('.alive:not(.beanstalk, .chopped)').parent().map((function(index, t) {
      return $(t).attr('data-id');
    })).each((function(item, value) {
      var userId = $('#user').attr('data-id');
      var tree = $((".tree[data-id=" + value + "]"));
      var limit = parseFloat($('#value').text());
      ajax(("/trees/" + value + "/grow"), 'put', null, (function(response) {
        tree.replaceWith(response);
        var height = parseFloat($(response).children('.height').text());
        if (height >= limit) {
          ajax(("/trees/" + value + "/chop"), 'put', {userId: userId}, (function(r) {
            tree.replaceWith(r.html);
            $('#wood').text(("Wood: " + r.user.wood.toFixed(2)));
          }), 'json');
        }
        if ($(response).hasClass('beanstalk')) {
          audioBeanStalk.play();
        }
        if ($(response).hasClass('dead')) {
          audioDead.play();
        }
      }));
    }));
  }
  function slider() {
    $('#slider').noUiSlider({
      start: 4,
      range: {
        'min': 4,
        'max': 9999
      },
      serialization: {
        lower: [$.Link({
          target: $('#value'),
          method: 'text'
        })],
        format: {
          decimals: 0,
          postfix: ' ft'
        }
      }
    });
  }
})();

//# sourceMappingURL=autogrow.map
