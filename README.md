About extension:
===============

Activity logger (sampled task monitoring) which uses calendar to store user's activities.

It periodically displays window with textbox where user can put description of currently performed tasks.
TaskMe extension will create event with the description in chosen calendar.

Activity logger is deactivated by default after installation. To activate it, configure it first in extension's settings.

First sentence of the description will be treated as event's title. Submitting a description without a change 
will extend the event in the calendar instead of creating new one.

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
	* asking about user's activity periodically,
	* configuring the extension with:
	    - period interval,
		- calendar where events are inserted.