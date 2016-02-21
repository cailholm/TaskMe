About extension:
===============

This extension adds sampled task monitoring feature to your calendar. 

It is Your activity logger.

It periodically displays window with textbox where You can put your description of currently performed tasks.
Task Me extension will create event with your description in chosen calendar.

By default activity logger is deactivated. To activate it, configure it first in extension's settings.

First sentence will be treated as event's title. Submitting a description without a change 
will extend the event in Your calendar instead of creating new event.

Building extension
==================

Automatically (Windows only):

  Open solution in Visual Studio 2015 and build the project.
  TaskMe.xpi will be located in TaskMe\bin directory. 
  A copy of the extension will be also placed in TaskMe\bin\Taskme\extensions so you may use TaskMe\bin\Taskme for testing (create new profile in Thunderbird and point to this location).
  
Manually:

  Create TaskMe.xpi file from Taskme\src directory. You may find the instructions here:
  https://developer.mozilla.org/en-US/Add-ons/Thunderbird/Building_a_Thunderbird_extension_8:_packaging

Change log:
==========

 v1.0
    Initial version. Features:
	* asking about user's activity periodically
	* configuring the extension with:
	    - period interval
		- calendar where events are inserted