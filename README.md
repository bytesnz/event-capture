event-capture
=========================
Web app for capturing events from interaction-based surveys.

Currently listens to the following events:
- click
- mousedown
- mousemove
- mouseup
- mouseover
- mousein
- mouseout
- mousecancel
- mouseleave
- pointerdown
- pointermove
- pointerup
- pointerover
- pointerin
- pointerout
- pointercancel
- pointerleave
- touchstart
- touchmove
- touchend
- touchcancel
- keydown
- keypress
- keypress
- keyup

Currently records the following information from the events:
- altKey
- ctrlKey
- metaKey
- shiftKey
- clientX
- clientY
- layerX
- layerY
- x
- y
- movementX
- movementY
- button
- buttons
- eventPhase
- originalTarget
- relatedTarget
- target

For all Touch objects within events, it records the following properties:
- clientX
- clientY
- pageX
- pageY
- radiusX
- radiusY
- rotationAngle
- force

