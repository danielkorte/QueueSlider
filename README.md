# QueueSlider v1.2.5

**QueueSlider** is another jQuery slider plugin for variable width images.

## Download

Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/danielkorte/QueueSlider/master/jquery.queueslider.min.js
[max]: https://raw.github.com/danielkorte/QueueSlider/master/jquery.queueslider.js

## Default Settings Object

```javascript
{
  mode: 'horizontal',     // Use horizontal or fade
  alignMode: 'center',    // Use center, left, or right to align the slider
  delay: 0,               // Delay the start of slider
  fade: 0.3,              // Opacity of images not being viewed, use -1 to disable
  transitionSpeed: 700,   // fade and slide transition speed in milliseconds
  speed: 7000,            // auto-play speed in milliseconds, use 0 to disable
  direction: 1,           // 1 for auto-play forward, -1 for auto-play in reverse
  offScreen: false,       // Set to true for a full screen slider
  autoHeight: false,      // Adjust slider height for each slide
  touchEnabled: true,     // Allow touch interaction with the slider
  swipeThreshold: 50,     // Amount of pixels a touch swipe needs to exceed in order to slide
  buttons: true,          // Enable Previous/Next buttons
  keyboardButtons: true,  // Enable keyboard right/left buttons to advance slides
  previous: 'Previous',   // Previous button text
  next: 'Next'            // Next button text
}
```

## Public Functions

First, initialize and save the QueueSlider to a variable.
```javascript
var $slider = $('.queueslider').queueSlider({
  speed: 2000,
  buttons: false
});
```

#### getState(property)

Get the state of the QueueSlider. Available options are:
* initialized (boolean)
* playing (boolean)
* busy (boolean)
* count (number)
* index (object)
* index.active (number)
* index.previous (number)
* viewport (object)
* viewport.width (number)

```javascript
$slider.data('queueslider').getState('index.active');
```

#### pause()

Pause the slider.

```javascript
$slider.data('queueslider').pause();
```

#### nextSlide()

Go to the next slide.

```javascript
$slider.data('queueslider').nextSlide();
```

#### previousSlide()

Go to the previous slide.

```javascript
$slider.data('queueslider').previousSlide();
```

#### goToSlide(index)

Go to a specific slide index (zero-based).

```javascript
$slider.data('queueslider').goToSlide(3);
```

#### destroy()

Destroy the slider.

```javascript
$slider.data('queueslider').destroy();
```

#### rebuild(options)

Rebuild the slider. Optionally, pass in a new settings object.

```javascript
$slider.data('queueslider').rebuild({direction: -1});
```

## Events

#### slideStart

Triggered before the slider starts the transition to the new slide.

```javascript
$slider.bind('slideStart', function(e, index) {
  console.log(e); // The event object.
  console.log(index); // The index of the new slide.
});
```

#### slideEnd

Triggered after the slider transitions to the new slide.

```javascript
$slider.bind('slideEnd', function(e, index) {
  console.log(e); // The event object.
  console.log(index); // The index of the new slide.
});
```

## Supported Browsers

* Chrome (latest version)
* Internet Explorer (6+)
* Firefox (latest version)
* Safari (latest version)

## Changelog

* _11.28.14 - v1.2.5 - 6.526kb_
  * Add pause() public function.
* _11.15.14 - v1.2.4 - 6.484kb_
  * Fix busy state and slide position reset
* _10.12.14 - v1.2.3 - 6.435kb_
  * Fix scope issues
* _10.12.14 - v1.2.2 - 6.408kb_
  * Add left/right arrow keyboard support
* _05.09.14 - v1.2.1 - 6.226kb_
  * Use Semantic Versioning and submit to jQuery Plugin Registry
* _02.26.14 - v1.2.0 - 5.377kb_
  * Public functions, events, and cleaned up code
* _01.29.14 - v1.1.0 - 3.371kb_
  * Added touch support
* _08.19.11 - v1.0.0 - 2.183kb_
  * Initial release

## License

Free to use and abuse under the MIT license. [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)

## Author

Daniel Korte  
Web Developer  

[toky.com](https://toky.com/)  
[danielkorte.com](https://www.danielkorte.com/)
