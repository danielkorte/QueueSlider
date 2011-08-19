/*
 * jQuery Queue Slider v1.0
 * http://danielkorte.com
 *
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * August 2011
 */

(function($){
  var QueueSlider = function(element, options) {
    
    var play = false,
        busy = false,
        current = 2,
        previous = 2,
        widths = new Array(),
        slider = $(element),
        queue = $('ul.queue', slider),
        numImages = $('img', queue).size(),
        viewportWidth = $(window).width(),
        settings = $.extend({}, $.fn.queueSlider.defaults, options);
    
    $(window).resize(function(){
      busy = true;
      viewportWidth = $(window).width();
      if (settings.offScreen) { computeQueueWidth(); }
      queue.css('left', -getQueuePosition());
      busy = false;
    });
    
    function requeue() {
      $('li', queue).each(function(key, value) {
        $(this).attr('class', 'slide-'+(key+1));
      });
    }
    
    function updateCurrent(dir) {
      current += dir;
      if ( current < 1 ) {
        current = numImages;
      } else if ( current > numImages ) { 
        current = 1;
      }
    }
    
    function getQueuePosition() {
      var i = 0, index = current-1,
          queuePosition = (viewportWidth - widths[index]) / -2;
      
      for (i = 0; i < index; i++) { queuePosition += widths[i]; }
      
      return queuePosition;
    }
    
    function computeQueueWidth() {
      var queueWidth = 0;
      
      // Get the image widths and set the queue width to their combined value.
      $('li', queue).each(function(key, value) {
        if (settings.offScreen) {
          var slide = $(this),
              width = slide.width(),
              margins = viewportWidth - width;
          
          queueWidth += widths[key] = width + (margins > 0 ? margins : 0);
          slide.css('width', widths[key]+'px');
        } else {
          queueWidth += widths[key] = $(this).width();
        }
      });
      
      queue.css('width', queueWidth);
    }
    
    function slide() {
      var animationSettings = {
        duration: settings.transitionSpeed,
        queue: false
      };
      
      // Emulate an infinte loop:
      // Bring the first image to the end.
      if ( current === numImages ) {
        var firstImage = $('li.slide-1', queue);
        
        widths.push(widths.shift());
        queue.css('left', queue.position().left + firstImage.width()).append(firstImage);
        requeue();
        current--; previous--;
      }
      // Bring the last image to the beginning.
      else if ( current === 1 ) {
        var lastImage = $('li:last-child', queue);
        
        widths.unshift(widths.pop());
        queue.css('left', queue.position().left + -lastImage.width()).prepend(lastImage);
        requeue();
        current = 2; previous = 3;
      }
      
      // Fade in the current and out the previous images.
      if (settings.fade !== -1) {
        $('li.slide-'+current, queue).animate({ opacity: 1 }, animationSettings );
        $('li.slide-'+previous, queue).animate({ opacity: settings.fade }, animationSettings );
      }
      
      // Animate the queue.
      animationSettings.complete = function() { busy = false; };
      queue.animate({ left: -getQueuePosition() }, animationSettings );
      
      previous = current;
    }
    
    //
    // Setup the QueueSlider!
    //
    if (numImages > 2) {
      
      // Move the last slide to the beginning of the queue so there is an image on both sides of the current image.
      computeQueueWidth();
      widths.unshift(widths.pop());
      queue.css('left', -getQueuePosition()).prepend( $('li:last-child', queue) );
      requeue();
      
      // Fade out the images we aren't viewing.
      if (settings.fade !== -1) { $('li', queue).not('.slide-2').css('opacity', settings.fade); }
      
      // Include the buttons if enabled and assign a click event to them.
      if (settings.buttons) {
        slider.append('<button class="previous" rel="-1">' + settings.previous + '</button><button class="next" rel="1">' + settings.next + '</button>');
        $('button', slider).click(function() {
          if ( !busy ) {
            busy = true;
            updateCurrent(parseInt( $(this).attr('rel') ));
            clearInterval(play);
            slide();
          }
          return false;
        });
      }
      
      // Start the slideshow if it is enabled.
      if (settings.speed !== 0) {
        play = setInterval(function() {
          if ( !busy ) {
            busy = true;
            updateCurrent(settings.direction);
            slide();
          }
        }, settings.speed);
      }
    }
    else {
      // There isn't enough images for the QueueSlider!
      // Let's disable the required CSS and show all one or two images ;)
      slider.removeClass('queueslider');
    }
  };
  
  $.fn.queueSlider = function(options) {
    return this.each(function(key, value) {
      var element = $(this);
      // Return early if this element already has a plugin instance.
      if (element.data('queueslider')) { return element.data('queueslider'); }
      // Pass options to plugin constructor.
      var queueslider = new QueueSlider(this, options);
      // Store plugin object in this element's data.
      element.data('queueslider', queueslider);
    });
  };
  
  $.fn.queueSlider.defaults = {
    fade: 0.3,              // Opacity of images not being viewed, use -1 to disable
    transitionSpeed: 700,   // in milliseconds, speed for fade and slide motion
    speed: 7000,            // in milliseconds, use 0 to disable slideshow
    direction: 1,           // 1 for images to slide to the left, -1 to silde to the right during slideshow
    offScreen: false,       // Set to true for a Hulu.com-like slider
    buttons: true,          // Display Previous/Next buttons
    previous: 'Previous',   // Previous button text
    next: 'Next'            // Next button text
  };
  
})(jQuery);
