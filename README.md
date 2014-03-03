# QueueSlider v1.2

**QueueSlider** is another jQuery slider plugin for variable width images.

## Download

Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/danielkorte/QueueSlider/master/jquery.queueslider.min.js
[max]: https://raw.github.com/danielkorte/QueueSlider/master/jquery.queueslider.js

## Default Settings Object

```javascript
{
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

* Chrome
* Internet Explorer (6+)
* Firefox
* Safari

## Changelog
* _02.26.14 - v1.2 - 5.250kb_
  * Public functions, events, and cleaned up code
* _01.29.14 - v1.1 - 3.383kb_
  * Added touch support
* _08.19.11 - v1.0 - 1.929kb_
  * Initial release

## License

Free to use and abuse under the MIT license. [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)

## Author

Daniel Korte  
Web Developer  
TOKY Branding + Design  
Saint Louis, MO

[toky.com](http://toky.com/)  
[danielkorte.com](http://danielkorte.com/)
