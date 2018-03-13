(function () {
  var uid = guid();
  var sentData = [];
  var stepEvents = [];
  var types = {};

  var steps = [
    {
      title: 'What kind of computer?',
      description: '<p>Please choose what kind of computer you are using</p>',
      noEvents: true,
      buttons: [
        {
          label: 'Computer/Laptop',
          value: 'computer'
        },
        {
          label: 'Tablet',
          value: 'tablet'
        },
        {
          label: 'Phone',
          value: 'phone'
        },
      ],
      addValueToType: true
    },
    {
      title: 'Click',
      description: '<p>With the Ctrl, Alt, Shift and Meta (Windows) key pressed down, please simply click within the blue box</p>',
      type: {
        computer: true,
        pointer: true
      }
    },
    {
      title: 'Click',
      description: '<p>Please simply click within the blue box</p>',
      type: {
        computer: false,
        pointer: true
      }
    },
    {
      title: 'Tap',
      description: '<p>Please simply tap within the blue box and then tap on next</p>',
      type: {
        touch: true
      },
      next: true
    },
    {
      title: 'Click and Drag',
      description: '<p>Again with the Ctrl, Alt, Shift and Meta keys pressed, please click and drag from one point to another point within the blue box</p>',
      type: {
        computer: true,
        pointer: true
      }
    },
    {
      title: 'Tap and Drag',
      description: '<p>Again with the Ctrl, Alt, Shift and Meta keys pressed, please tap and drag from one point to another point within the blue box</p>',
      type: {
        computer: true,
        touch: true
      }
    },
    {
      title: 'Tap and Drag',
      description: '<p>Please tap and drag from one point to another point within the blue box</p>',
      type: {
        computer: false,
        touch: true
      }
    },
    {
      title: 'Tap and Drag Out',
      description: '<p>Again with the Ctrl, Alt, Shift and Meta keys pressed, please tap and drag from one point within the blue box to somewhere outside of the box</p>',
      type: {
        computer: true,
        touch: true
      }
    },
    {
      title: 'Tap and Drag Out',
      description: '<p>Please tap and drag from one point within the blue box to somewhere outside of the box</p>',
      type: {
        computer: false,
        touch: true
      }
    },
    {
      title: 'Multitap',
      description: '<p>Please tap with two fingers within of the box</p>',
      type: {
        touch: true
      }
    },
    {
      title: 'Pinch',
      description: '<p>Please make a pinch gesture within the blue box</p>',
      type: {
        touch: true
      }
    },
    {
      title: 'Multitap and Drag',
      description: '<p>Please tap and drag with two fingers between two points within the blue box</p>',
      type: {
        touch: true
      }
    },
    {
      title: 'Multitap and Rotate',
      description: '<p>Please tap and rotate your fingers within the blue box</p>',
      type: {
        touch: true
      }
    }
  ];

  var currentStep;

  /// Properties to capture on the Event objects
  var eventProperties = [
    'altKey', 'ctrlKey', 'metaKey', 'shiftKey',
    'clientX', 'clientY', 'layerX', 'layerY', 'x', 'y', 'movementX', 'movementY',
    'button', 'buttons', 'eventPhase',
    'touches', 'targetTouches', 'changedTouches',
    'originalTarget', 'relatedTarget', 'target'
  ];

  /// Properties to capture on the Touches objects
  var touchProperties = [
    'clientX', 'clientY', 'pageX', 'pageY',
    'radiusX', 'radiusY', 'rotationAngle',
    'force'
  ];

  var button = [
    document.getElementById('button1'),
    document.getElementById('button2'),
    document.getElementById('button3')
  ];
  var text = document.getElementById('text');
  var heading = document.getElementById('heading');
  var box = document.getElementById('box');
  var data = document.getElementById('data');
  var dataPre = document.getElementById('pre');

  /**
   * Generate a unique ID so that we can corrolate all the events you send
   * together
   */
  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  /**
   * Send data back to the server
   *
   * @param data Data to send back to the server
   */
  function send(data) {
    var compiled = {
      userAgent: window.navigator.userAgent,
      uid: uid,
      data: data
    };

    var ajaxReq = new XMLHttpRequest();
    ajaxReq.onload = function success() {
      console.log('data sent', compiled);
      sentData.push(compiled);
    };

    ajaxReq.open('post', './', true);

    ajaxReq.setRequestHeader('Content-Type', 'application/json');
    ajaxReq.send(JSON.stringify(compiled));
  }

  /**
   * Attaches a event listener function to an DOM element
   *
   * @param element DOM element to attach listener to
   * @param event Event to attach listener on
   * @param handler Function to call when event happens
   */
  function addEventListener(element, event, handler) {
    if (element.addEventListener) {
      element.addEventListener(event, handler);
    } else if (element.attachEvent) {
      element.attachEvent('on' + event, handler);
    } else {
      alert('We don\'t know how to attach to events in your browser at the '
        + 'moment.\n\nWe have sent a message to get this sorted out');
      send({
        type: 'error',
        message: 'addEventListener and attachEvent don\'t exist'
      });
    }
  }

  /**
   * Moves to the next step
   */
  function next() {
    if (typeof currentStep !== 'number') {
      currentStep = 0;
    } else {
      currentStep++;
    }

    stepEventss = [];
    if (currentStep < steps.length) {
      var step = steps[currentStep];

      if (step.type) {
        typeKeys = Object.keys(step.type);

        var i;
        for (i = 0; i < typeKeys.length; i++) {
          if ((step.type[typeKeys[i]] && !types[typeKeys[i]])
              || (!step.type[typeKeys[i]] && types[typeKeys[i]])) {
            next();
            return;
          }
        }
      }

      if (step.buttons) {
        var i;
        var numButtons = Math.min(3, step.buttons.length);

        for (i = 0; i < numButtons; i++) {
          button[i].style.display = '';
          button[i].innerHTML = step.buttons[i].label;
        }

        for (i; i < 3; i++) {
          button[i].style.display = 'none';
        }
      } else {
        button[0].innerHTML = 'Show Data';
        button[0].style.display = '';
        button[1].innerHTML = 'Skip';
        button[1].style.display = '';
        button[2].innerHTML = 'Next';
        button[2].style.display = '';
      }
      heading.innerHTML = step.title;
      text.innerHTML = step.description
          + (!step.next ? '<p>Once you are done, click/tap the Next button.</p>' : '')
          + '<p>If you don\'t want to do, just click/tap the Skip button</p>';
    } else {
      button2.style.display = 'none';
      button3.style.display = 'none';
      heading.innerHTML = 'Thank you';
      text.innerHTML = '<p>All done. Thank you very much</p>';
    }
  }

  /**
   * Copy interesting event properties
   *
   * @param event Event to copy the parameters of
   *
   * @returns Object of interesting event properties
   */
  function copyEvent(event) {
    var i;
    var copied = {};
    copied.event = event.constructor && event.constructor.name;
    for (i = 0; i < eventProperties.length; i++) {
      if (event[eventProperties[i]]) {
        var propertyValue = event[eventProperties[i]]
        if (eventProperties[i].match(/target$/i)) {
          copied[eventProperties[i]] = propertyValue && propertyValue.id || propertyValue.toString();
        } else if (eventProperties[i].match(/touches$/i)) {
          var t;
          var copiedTouches = [];
          for (t = 0; t < propertyValue.length; t++) {
            var touch = propertyValue[t];
            var j;
            var copiedTouch = {};

            for (j = 0; j < touchProperties.length; j++) {
              if (touch[touchProperties[j]]) {
                copiedTouch[touchProperties[j]] = touch[touchProperties[j]];
              }
            }

            copiedTouches.push(copiedTouch);
          }
          copied[eventProperties[i]] = copiedTouches;
        } else {
          copied[eventProperties[i]] = propertyValue;
        }
      }
    }

    return copied;
  }

  /**
   * Capture the event
   *
   * @param event Event
   */
  function recordEvent(event) {
    if (!event) {
      return;
    }
    stepEvents.push(copyEvent(event));
    console.log(event);
  }

  function toggleData() {
    if (!data.style.display) {
      data.style.display = 'none';
      button[0].label = 'Show Data';
    } else {
      button[0].label = 'Hide Data';
      dataPre.innerHTML = JSON.stringify(sentData, null,  2);
      data.style.display = '';
    }
  }

  /**
   * Handles button clicks
   *
   * @param button Button that was clicked
   */
  function buttonClick(button, event) {
    if (typeof currentStep === 'undefined') {
      let value
      switch (button) {
        case 0:
          types['pointer'] = true;
          value = 'pointer';
          break;
        case 1:
          types['pointer'] = true;
          types['touch'] = true;
          value = 'pointer+touch';
          break;
        case 2:
          types['touch'] = true;
          value = 'touch';
          break;
      }
      send({
        type: 'deviceType',
        button: value,
        event: copyEvent(event)
      });
    } else {
      var step = steps[currentStep];
      if (!step.buttons && button === 0) {
        toggleData();
        return;
      }

      var stepData = {
        type: 'step',
        step: currentStep,
        stepTitle: step.title
      };

      if (step.buttons) {
        stepData.button = step.buttons[button].value
        if (step.addValueToType) {
          types[step.buttons[button].value] = true;
        }
      }

      if (!step.noEvents) {
        stepData.stepEvents = stepEvents;
      }

      send(stepData);
    }
    next();
  }


  // Set up the button events
  addEventListener(button[0], 'click', buttonClick.bind(null, 0));
  addEventListener(button[1], 'click', buttonClick.bind(null, 1));
  addEventListener(button[2], 'click', buttonClick.bind(null, 2));

  // Attach to all the events we can on the box
  var events = [
    'click',
    'mousedown', 'mousemove','mouseup', 'mouseover', 'mousein', 'mouseout', 'mousecancel', 'mouseleave',
    'pointerdown', 'pointermove','pointerup', 'pointerover', 'pointerin', 'pointerout', 'pointercancel', 'pointerleave',
    'touchstart', 'touchmove', 'touchend', 'touchcancel',
    'keydown', 'keypress', 'keypress', 'keyup'
  ];

  var i;
  for (i = 0; i < events.length; i++) {
    try {
      addEventListener(box, events[i], recordEvent);
    } catch (err) {
      send({
        type: 'error',
        message: 'Error attaching event ' + events[i] + ' to box',
        error: err
      });
    }
  }

  // Send a load
  send({
    type: 'load'
  });
})()
