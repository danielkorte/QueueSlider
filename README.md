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
#### getState()

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

#### destroy()

Destroy the slider.

```javascript
$slide.data('queueslider').destroy();
```

#### rebuild()

Rebuild the slider. Optionally, pass in a new settings object.

```javascript
$slide.data('queueslider').rebuild({direction: -1});
```

## Supported Browsers

* Chrome
* Internet Explorer (6+)
* Firefox
* Safari

## Changelog
* _02.26.14 - v1.2 - 5.032kb_
  * Public functions and cleaned up code
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
