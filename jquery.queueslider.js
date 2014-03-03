/*
 * jQuery Queue Slider v1.2
 * http://danielkorte.com
 *
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

(function($){
  var QueueSlider = function(element, options) {

    var plugin = this,
        $slider = $(element),
        $queue = $('.queue', $slider),
        $slides = $('.queue > li'),
        sizes = [],
        touch = {},
        css = {},
        state = {
          initialized: false,
          playing: false,
          busy: false,
          count: 0,
          index: {
            active: 1,
            previous: 1
          },
          viewport: {
            width: $(window).width(),
          }
        },
        settings = $.extend({}, $.fn.queueSlider.defaults, options);

    //
    // Private Functions
    //

    var init = function() {
      if (state.initialized) {
        return;
      }

      // Initialize our common jQuery variables and the slide count.
      $queue = $('.queue', $slider);
      $slides = $('.queue > li');
      state.count = $slides.length;

      if (state.count > 1) {
        // Test to see if CSS transforms are available.
        css.available = (function() {
          var div = document.createElement('div'),
              props = ['WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];

          // Test for each property.
          for (var i in props) {
            if (div.style[props[i]] !== undefined) {
              css.vendor_prefix = '-' + props[i].replace('Perspective', '').toLowerCase();
              css.transform = css.vendor_prefix + '-transform';
              css.transform_duration = css.vendor_prefix + '-transition-duration';
              return true;
            }
          }
          return false;
        }());

        if (settings.touchEnabled) {
          initTouch();
        }

        // Clone the first and last slides.
        $queue.prepend($slides.last().clone().addClass('qs-clone'));
        $queue.append($slides.first().clone().removeClass('active').addClass('qs-clone'));

        // Re-queue the slides.
        $slides = $('.queue > li');
        state.count = $slides.length;

        // Save the original style data.
        $queue.data('origStyle', $queue.attr('style'));
        $slides.each(function() {
          $(this).data('origStyle', $(this).attr('style'));
        });

        // Position and calculate the slider and slides.
        computeQueueSizes();
        setPosition(-getQueuePosition(), 'reset', 0);
        if (settings.autoHeight) {
          $queue.css('overflow', 'hidden');
          setQueueHeight();
        }

        // Fade out the images we aren't viewing.
        if (settings.fade !== -1) {
          $slides.not(':eq(1)').children('img').fadeTo(0, settings.fade);
        }

        // Include the buttons if enabled and assign a click event to them.
        if (settings.buttons) {
          $slider
            .append('<button class="qs-previous" rel="-1">' + settings.previous + '</button>' +
                    '<button class="qs-next" rel="1">' + settings.next + '</button>');
          $('button', $slider).bind('click.queueSlider', function(e) {
            if (!state.busy) {
              state.busy = true;
              clearInterval(state.play);
              slide(parseInt($(this).attr('rel'), 10));
            }
            return false;
          });
        }

        // Auto-play the slider if it is enabled.
        if (settings.speed !== 0) {
          state.play = setInterval(function() {
            if (!state.busy) {
              state.busy = true;
              slide(settings.direction);
            }
          }, settings.speed);
        }

        $(window).bind('resize.queueSlider', resizeQueueSlider);
      }

      state.initialized = true;
    };

    var resizeQueueSlider = function(e) {
      state.busy = true;
      state.viewport.width = $(window).width();
      computeQueueSizes();
      setQueueHeight();
      setPosition(-getQueuePosition(), 'reset', 0);
      state.busy = false;
    };

    var getQueuePosition = function() {
      var i = 0,
          position = 0;

      switch (settings.alignMode) {
        case 'center':
          position = (state.viewport.width - sizes[state.index.active].w) / -2;
          break;
        case 'right':
          position = state.viewport.width - sizes[state.index.active].w;
          break;
      }

      for (i = 0; i < state.index.active; i++) {
        position += sizes[i].w;
      }

      return position;
    };

    var computeQueueSizes = function() {
      var queue_width = 0,
          $previous_slide;

      // Get the image sizes and set the queue width to their combined value.
      $slides.each(function(key, value) {
        var $slide = $(this);
        if (settings.offScreen) {
          if ($(this).data('origStyle') === undefined) {
            $slide.removeAttr('style');
          } else {
            $slide.attr('style', $(this).data('origStyle'));
          }

          var width = $slide.outerWidth(true),
              margins = state.viewport.width - width;

          sizes[key] = {
            w: width + (margins > 0 ? margins : 0)
          };

          queue_width += sizes[key].w;
          $slide.css('width', sizes[key].w +'px');
        } else {
          sizes[key] = {
            w: $slide.outerWidth(true)
          };

          queue_width += sizes[key].w;
        }

        if ($previous_slide) {
          sizes[key - 1].h = $previous_slide.outerHeight(true);
        }
        $previous_slide = $slide;
      });

      if ($previous_slide) {
        sizes[state.count - 1].h = $previous_slide.outerHeight(true);
      }

      $queue.css('width', queue_width);
    };

    var setQueueHeight = function() {
      if (settings.autoHeight) {
        $slider.css('height', sizes[state.index.active].h);
        $queue.stop().animate({height: sizes[state.index.active].h}, Math.floor(settings.transitionSpeed / 3));
      }
    };

    var slide = function(dir) {
      state.index.active += dir;
      if (state.index.active < 0) {
        state.index.active = state.count - 1;
      } else if (state.index.active >= state.count) {
        state.index.active = 0;
      }

      beginSlide();
    };

    var slideTo = function(index) {
      if (index >= state.count || index < 0) {
        return;
      }

      state.index.active = index;

      beginSlide();
    };

    var beginSlide = function() {
      $slider.trigger('slideStart', state.index.active);

      setQueueHeight();

      // Fade in the active slide and fade out the previous slide.
      fadeSlides(state.index.active, state.index.previous);

      // Animate the queue.
      setPosition(-getQueuePosition(), 'slide');
    };

    var fadeSlides = function(new_index, old_index, speed) {
      if (settings.fade !== -1) {
        speed = speed === undefined ? settings.transitionSpeed : speed;
        $slides.eq(new_index)
          .addClass('active')
          .children('img')
          .fadeTo(speed, 1);
        $slides.eq(old_index)
          .removeClass('active')
          .children('img')
          .fadeTo(speed, settings.fade);
      }
    };

    var setPosition = function(value, type, speed) {
      if (css.available) {
        speed = speed !== undefined ? speed : (settings.transitionSpeed / 1000);
        var style = {};
        style[css.transform_duration] = speed + 's';
        style[css.transform] = 'translate3d(' + value + 'px, 0, 0)';
        $queue.css(style);
        if (type === 'slide') {
          setTimeout(function() {
            if (state.busy) {
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
    };

    var slideComplete = function() {
      // Emulate an infinite loop:
      // Bring the first image to the end.
      if (state.index.active === (state.count - 1)) {
        state.index.active = 1;
        fadeSlides(1, state.count - 1, 0);
        setPosition(-getQueuePosition(), 'reset', 0);
      }
      // Bring the last image to the beginning.
      else if (state.index.active === 0) {
        state.index.active = state.count - 2;
        fadeSlides(state.count - 2, 0, 0);
        setPosition(-getQueuePosition(), 'reset', 0);
      }

      state.index.previous = state.index.active;
      state.busy = false;
      $slider.trigger('slideEnd', state.index.active);
    };

    var initTouch = function() {
      // Initialize object to contain all touch values.
      touch = {
        start: {x: 0, y: 0},
        end: {x: 0, y: 0}
      };
      $slider.bind('touchstart.queueSlider', onTouchStart);
    };

    var onTouchStart = function(e) {
      if (state.busy) {
        e.preventDefault();
      } else {
        // Record the original position when the touch starts.
        touch.original_position = $queue.position();
        // Record the starting touch x, y coordinates.
        touch.start.x = e.originalEvent.changedTouches[0].pageX;
        touch.start.y = e.originalEvent.changedTouches[0].pageY;
        // Bind a "touchmove" event to the slider.
        $slider.bind('touchmove.queueSlider', onTouchMove);
        // Bind a "touchend" event to the slider.
        $slider.bind('touchend.queueSlider', onTouchEnd);
      }
    };

    var onTouchMove = function(e) {
      var x_movement = Math.abs(e.originalEvent.changedTouches[0].pageX - touch.start.x),
          y_movement = Math.abs(e.originalEvent.changedTouches[0].pageY - touch.start.y),
          change = e.originalEvent.changedTouches[0].pageX - touch.start.x;

      if ((x_movement * 3) > y_movement) {
        e.preventDefault();
      }

      setPosition(touch.original_position.left + change, 'reset', 0);
    };

    var onTouchEnd = function(e) {
      $slider.unbind('touchmove.queueSlider');

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
        setPosition(touch.original_position.left, 'reset', 0);
      }

      $slider.unbind('touchend.queueSlider');
    };

    //
    // Public Functions
    //

    plugin.getState = function(property) {
      var i,
          copy = state,
          properties = property.split('.');

      for (i = 0; i < properties.length; i++) {
        // Drill down the state object until the property is found or simply
        // return 'undefined' since the property in question does not exist.
        if (copy.hasOwnProperty(properties[i])) {
          copy = copy[properties[i]];
        } else {
          return undefined;
        }
      }

      return copy;
    };

    plugin.nextSlide = function() {
      if (!state.busy) {
        state.busy = true;
        clearInterval(state.play);
        slide(1);
      }
    };

    plugin.previousSlide = function() {
      if (!state.busy) {
        state.busy = true;
        clearInterval(state.play);
        slide(-1);
      }
    };

    plugin.goToSlide = function(index) {
      if (!state.busy) {
        state.busy = true;
        clearInterval(state.play);
        slideTo(index);
      }
    };

    plugin.destroy = function() {
      if (!state.initialized) {
        return;
      }
      state.initialized = false;

      state.busy = true;
      state.index.active = state.index.previous = 1;
      clearInterval(state.play);
      $slider.unbind('.queueSlider');

      // Restore original styles to element.
      if ($queue.data('origStyle') !== undefined) {
        $queue.attr('style', $queue.data('origStyle'));
      } else {
        $queue.removeAttr('style');
      }

      // Remove the clones.
      $slides.filter('.qs-clone').remove();

      // Restore original styles to children.
      $slides.each(function() {
        if ($(this).data('origStyle') !== undefined) {
          $(this).attr('style', $(this).data('origStyle'));
        } else {
          $(this).removeAttr('style');
        }
      });

      $slides.children('img').fadeTo(0, 1);

      // Remove the appended buttons.
      if (settings.buttons) {
        $('.qs-previous, .qs-next').remove();
      }

      $(window).unbind('.queueSlider');
      state.busy = false;
    };

    plugin.rebuild = function(new_options) {
      if (new_options !== undefined) {
        settings = $.extend({}, $.fn.queueSlider.defaults, new_options);
      }
      plugin.destroy();
      init();
    };

    init();

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
    alignMode: 'center',    // Use center, left, or right to align the slider
    fade: 0.3,              // Opacity of images not being viewed, use -1 to disable
    transitionSpeed: 700,   // fade and slide transition speed in milliseconds
    speed: 7000,            // auto-play speed in milliseconds, use 0 to disable
    direction: 1,           // 1 for auto-play forward, -1 for auto-play in reverse
    offScreen: false,       // Set to true for a full screen slider
    autoHeight: false,      // Adjust slider height for each slide
    touchEnabled: true,     // Allow touch interaction with the slider
    swipeThreshold: 50,     // Amount of pixels a touch swipe needs to exceed in order to slide
    buttons: true,          // Enable Previous/Next buttons
    previous: 'Previous',   // Previous button text
    next: 'Next'            // Next button text
  };

}(jQuery));
