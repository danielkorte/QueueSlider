/*
 * jQuery Queue Slider v1.1
 * http://danielkorte.com
 *
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

(function($){
  var QueueSlider = function(element, options) {

    var plugin = this,
        play = false,
        busy = false,
        current_index = 1,
        previous_index = 1,
        widths = [],
        touch,
        usingCSS,
        cssPrefix,
        animProp,
        durationProp,
        $slider = $(element),
        $queue = $('ul.queue', $slider),
        $slides = $('li', $queue),
        numSlides = $slides.length,
        viewportWidth = $(window).width(),
        settings = $.extend({}, $.fn.queueSlider.defaults, options),
        resize_queueslider = function() {
          busy = true;
          viewportWidth = $(window).width();
          computeQueueWidth();
          setPosition(-getQueuePosition(), 'reset', 0);
          busy = false;
        };

    function getQueuePosition() {
      var i = 0,
          queuePosition;

      switch (settings.alignMode) {
        case 'center':
          queuePosition = (viewportWidth - widths[current_index]) / -2;
          break;
        case 'left':
          queuePosition = 0;
          break;
        case 'right':
          queuePosition = viewportWidth - widths[current_index];
          break;
      }

      for (i = 0; i < current_index; i++) { queuePosition += widths[i]; }

      return queuePosition;
    }

    function computeQueueWidth() {
      var queueWidth = 0;

      // Get the image widths and set the queue width to their combined value.
      $slides.each(function(key, value) {
        if (settings.offScreen) {
          var slide = $(this),
              width = slide.outerWidth(true),
              margins = viewportWidth - width;

          queueWidth += widths[key] = width + (margins > 0 ? margins : 0);
          slide.css('width', widths[key]+'px');
        } else {
          queueWidth += widths[key] = $(this).outerWidth(true);
        }
      });

      $queue.css('width', queueWidth);
    }

    function slide(dir) {
      current_index += dir;
      if (current_index < 0) {
        current_index = numSlides;
      } else if (current_index > numSlides) {
        current_index = 0;
      }

      // Fade in the current slide and out the previous slide.
      fadeSlides(current_index, previous_index);

      // Animate the queue.
      setPosition(-getQueuePosition(), 'slide');
    }

    function fadeSlides(inSlide, outSlide, speed) {
      if (settings.fade !== -1) {
        speed = speed === undefined ? settings.transitionSpeed : speed;
        $slides.eq(inSlide)
          .addClass('current')
          .children('img')
          .fadeTo(speed, 1);
        $slides.eq(outSlide)
          .removeClass('current')
          .children('img')
          .fadeTo(speed, settings.fade);
      }
    }

    function setPosition(value, type, speed) {
      if (usingCSS) {
        speed = speed !== undefined ? speed : (settings.transitionSpeed / 1000);
        var css = {};
        css[durationProp] = speed + 's';
        css[animProp] = 'translate3d(' + value + 'px, 0, 0)';
        $queue.css(css);
        if (type === 'slide') {
          setTimeout(function() {
            if (busy) {
              slideComplete();
            }
          }, (speed * 1000) + 1);
        }
      } else {
        if (type === 'slide') {
          $queue.animate({left: value}, {
            duration: settings.transitionSpeed,
            complete: slideComplete
          });
        } else {
          $queue.css('left', value);
        }
      }
    }

    var slideComplete = function() {
      // Emulate an infinite loop:
      // Bring the first image to the end.
      if (current_index === (numSlides - 1)) {
        current_index = 1;
        fadeSlides(1, numSlides - 1, 0);
        setPosition(-getQueuePosition(), 'reset', 0);
      }
      // Bring the last image to the beginning.
      else if (current_index === 0) {
        current_index = numSlides - 2;
        fadeSlides(numSlides - 2, 0, 0);
        setPosition(-getQueuePosition(), 'reset', 0);
      }

      previous_index = current_index;
      busy = false;
    };

    function initTouch() {
      // Initialize object to contain all touch values.
      touch = {
        start: {x: 0, y: 0},
        end: {x: 0, y: 0}
      };
      $slider.bind('touchstart', onTouchStart);
    }

    var onTouchStart = function(e) {
      if (busy) {
        e.preventDefault();
      } else {
        // Record the original position when the touch starts.
        touch.originalPos = $queue.position();
        // Record the starting touch x, y coordinates.
        touch.start.x = e.originalEvent.changedTouches[0].pageX;
        touch.start.y = e.originalEvent.changedTouches[0].pageY;
        // Bind a "touchmove" event to the slider.
        $slider.bind('touchmove', onTouchMove);
        // Bind a "touchend" event to the slider.
        $slider.bind('touchend', onTouchEnd);
      }
    };

    var onTouchMove = function(e) {
      var xMovement = Math.abs(e.originalEvent.changedTouches[0].pageX - touch.start.x),
          yMovement = Math.abs(e.originalEvent.changedTouches[0].pageY - touch.start.y),
          change = e.originalEvent.changedTouches[0].pageX - touch.start.x;

      if ((xMovement * 3) > yMovement) {
        e.preventDefault();
      }

      setPosition(touch.originalPos.left + change, 'reset', 0);
    };

    var onTouchEnd = function(e) {
      $slider.unbind('touchmove', onTouchMove);

      // Record end x, y positions.
      touch.end.x = e.originalEvent.changedTouches[0].pageX;
      touch.end.y = e.originalEvent.changedTouches[0].pageY;

      // Calculate distance and el's animate property.
      var distance = touch.end.x - touch.start.x;

      if (Math.abs(distance) >= settings.swipeThreshold) {
        if (distance < 0) {
          plugin.nextSlide();
        } else {
          plugin.previousSlide();
        }
      } else {
        setPosition(touch.originalPos.left, 'reset', 0);
      }

      $slider.unbind('touchend', onTouchEnd);
    };

    plugin.nextSlide = function() {
      if (!busy) {
        busy = true;
        clearInterval(play);
        slide(1);
      }
    };

    plugin.previousSlide = function() {
      if (!busy) {
        busy = true;
        clearInterval(play);
        slide(-1);
      }
    };

    plugin.getCurrent = function() {
      return current_index;
    };

    //
    // Setup the QueueSlider!
    //
    if (numSlides > 1) {
      usingCSS = (function() {
        var div = document.createElement('div');
        // CSS transition properties
        var props = ['WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
        // Test for each property.
        for (var i in props) {
          if (div.style[props[i]] !== undefined) {
            cssPrefix = props[i].replace('Perspective', '').toLowerCase();
            animProp = '-' + cssPrefix + '-transform';
            durationProp = '-' + cssPrefix + '-transition-duration';
            return true;
          }
        }
        return false;
      }());

      if (settings.touchEnabled) {
        initTouch();
      }

      // Clone the first and last slides.
      $queue.prepend($slides.eq(numSlides - 1).clone());
      $queue.append($slides.eq(0).clone().removeClass('current'));
      $slides = $('li', $queue);
      numSlides++;
      numSlides++;

      computeQueueWidth();
      setPosition(-getQueuePosition(), 'reset', 0);

      // Fade out the images we aren't viewing.
      if (settings.fade !== -1) {
        $slides.not(':eq(1)').children('img').fadeTo(0, settings.fade);
      }

      // Include the buttons if enabled and assign a click event to them.
      if (settings.buttons) {
        $slider.append('<button class="previous" rel="-1">' + settings.previous + '</button><button class="next" rel="1">' + settings.next + '</button>');
        $('button', $slider).click(function() {
          if (!busy) {
            busy = true;
            clearInterval(play);
            slide(parseInt($(this).attr('rel'), 10));
          }
          return false;
        });
      }

      // Start the slideshow if it is enabled.
      if (settings.speed !== 0) {
        play = setInterval(function() {
          if (!busy) {
            busy = true;
            slide(settings.direction);
          }
        }, settings.speed);
      }

      $(window).bind('resize', resize_queueslider);
    }

    return plugin;
  };

  $.fn.queueSlider = function(options) {
    return this.each(function(key, value) {
      var $element = $(this);
      // Return early if this element already has a plugin instance.
      if ($element.data('queueslider')) { return $element.data('queueslider'); }
      // Pass options to plugin constructor.
      var queueslider = new QueueSlider(this, options);
      // Store plugin object in this element's data.
      $element.data('queueslider', queueslider);
    });
  };

  $.fn.queueSlider.defaults = {
    alignMode: 'center',    // Use center, left, or right to align the slideshow
    fade: 0.3,              // Opacity of images not being viewed, use -1 to disable
    transitionSpeed: 700,   // in milliseconds, speed for fade and slide motion
    speed: 7000,            // in milliseconds, use 0 to disable slideshow
    direction: 1,           // 1 for images to slide to the left, -1 to silde to the right during slideshow
    offScreen: false,       // Set to true for a Hulu.com-like slider
    touchEnabled: true,     // Allow touch interaction with the slideshow
    swipeThreshold: 50,     // Amount of pixels a touch swipe needs to exceed in order to slide
    buttons: true,          // Display Previous/Next buttons
    previous: 'Previous',   // Previous button text
    next: 'Next'            // Next button text
  };

}(jQuery));
