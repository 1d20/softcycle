(function(window){

    function testInit () {

      var path = document.querySelector('.squiggle-animated .step-path');
        var length = path.getTotalLength();
        // Clear any previous transition
        path.style.transition = path.style.WebkitTransition =
          'none';
        // Set up the starting positions
        path.style.strokeDasharray = length + ' ' + length;
        path.style.strokeDashoffset = length;
        // Trigger a layout so styles are calculated & the browser
        // picks up the starting position before animating
        path.getBoundingClientRect();
        // Define our transition
        path.style.transition = path.style.WebkitTransition =
          'stroke-dashoffset 5s ease-in-out';
        // Go!
        path.style.strokeDashoffset = '0';

      function initAnimations() {
        $('.animated').appear(function () {
            var el = $(this);
            var animation = el.data('animation');
            var delay = el.data('delay');
            if (delay) {
                setTimeout(function () {
                    el.addClass(animation);
                    el.addClass('showing');
                    el.removeClass('hiding');
                }, delay);
            } else {
                el.addClass(animation);
                el.addClass('showing');
                el.removeClass('hiding');
            }
        }, {
            accY: -60
        });

        initAnimations();
      }
    }

    window.testInit = testInit;

})(window);