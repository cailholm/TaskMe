Components.utils.import("resource://calendar/modules/calUtils.jsm");

CalendarOpListener = function () {}
CalendarOpListener.prototype = {
    items: [],
    onOperationComplete: function (aCalendar, aStatus, aOperationType, aId, aDetail) {
    },
    onGetResult: function (aCalendar, aStatus, aItemType, aDetail, aCount, aItems) {
        this.items = aItems;
    },
    getItem: function () {
        if (this.items.length > 0) return this.items[0];
        return null;
    }
}

var Calendar = {
    silentMode: false,
    calendarManager: null,
    eventIdPrefix: "TaskMeEvent",
	GetCalendarNames: function () {
		var calendars = this.__getCalendars();

		var names = [];
		for (var i = 0; i < calendars.length; ++i) {
			names.push(calendars[i].name);
		}
		return names;
	},
	GetCurrentCalendar: function () {
		var calendarName = TaskMePreferences.GetCalendarName();
		if ((calendarName != null) && (calendarName != "")) {
			var calendars = this.__getCalendars();
			for (var i = 0; i < calendars.length; ++i) {
				if (calendarName == calendars[i].name) {
					return calendars[i];
				}
			}
		}
		return null;
	},
	AddEvent: function (msg, from, to) {
	    var calendar = this.GetCurrentCalendar();
	    if (calendar === null) {
	        this.__alert('alertNoCalendar');
	        return;
	    }

	    var id = this.__calculateId(from);

	    if (to < from) {
	        to = new Date(from.getTime() + 60000);
	    }

	    var tempEvent = this.__retrieveItem(id, calendar);
	    if (tempEvent != null) {
            // Event exists. Extend it instead of adding.
	        this.__modifyEvent(calendar, tempEvent, id, to);
	    } else {
	        // create event Object out of iCalString
	        var event = Components.classes["@mozilla.org/calendar/event;1"].createInstance(Components.interfaces.calIEvent);
	        event.title = this.__extractTitle(msg);
	        event.id = id;
	        event.setProperty('description', msg);
	        event.startDate = this.__date2CalDate(from);
	        event.endDate = this.__date2CalDate(to);
	        calendar.addItem(event, null);
	    }
	},
	ExtendEvent: function (from, to) {
	    var calendar = this.GetCurrentCalendar();
	    if (calendar === null) {
	        this.__alert('alertNoCalendar');
	        return;
	    }

	    var id = this.__calculateId(from);

	    var tempEvent = this.__retrieveItem(id, calendar);
	    if (tempEvent == null) {
	        this.__alert('alertNoEvent');
	        return;
	    }

	    this.__modifyEvent(calendar, tempEvent, id, to);
	},
	SetSilentMode: function (silent_mode) {
	    this.silentMode = silent_mode;
	},
	__getCManager: function () {
	    if (this.calendarManager == null) {
	        this.calendarManager = Components.classes["@mozilla.org/calendar/manager;1"].getService(Components.interfaces.calICalendarManager);
	    }
	    return this.calendarManager;
	},
	__getCalendars: function () {
	    return this.__getCManager().getCalendars({});
	},
	__intTo2digits: function (number) {
	    var numberAsStr = number.toString();
	    if (numberAsStr.length == 1) {
	        numberAsStr = "0" + numberAsStr;
	    }
	    return numberAsStr;
	},
	__dateToStr: function (date) {
	    var year = date.getFullYear().toString();
	    var month = this.__intTo2digits(date.getMonth() + 1);
	    var day = this.__intTo2digits(date.getDate());
	    var hour = this.__intTo2digits(date.getHours());
	    var minutes = this.__intTo2digits(date.getMinutes());
	    var seconds = this.__intTo2digits(date.getSeconds());

	    return (year + month + day + "T" + hour + minutes + seconds);
	},
	__calculateId: function(from) {
	    var dateFromStr = this.__dateToStr(from);
	    return this.eventIdPrefix + dateFromStr;
	},
	__retrieveItem: function (id, calendar) {
	    var listener = new CalendarOpListener();
	    calendar.getItem(id, listener);
	    return listener.getItem();
	},
	__modifyEvent: function (calendar, tempEvent, id, to) {
	    var newEvent = Components.classes["@mozilla.org/calendar/event;1"].createInstance(Components.interfaces.calIEvent);

	    newEvent.icalString = tempEvent.icalString;
	    newEvent.calendar = calendar;
	    newEvent.setProperty('dtend', this.__date2CalDate(to));

	    calendar.modifyItem(newEvent, tempEvent, null);
	},
	__date2CalDate: function(dt) {
	    var d = cal.jsDateToDateTime(dt);
	    return d.getInTimezone(calendarDefaultTimezone());
	},
	__extractTitle: function (msg) {
	    var lines = msg.split('\n');
	    if (lines.length > 0) {
	        return lines[0];
	    }
	    return msg;
	},
	__alert: function (errmsg) {
	    if (!this.silentMode) {
	        var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                            .getService(Components.interfaces.nsIPromptService);
	        prompts.alert(null,
                calGetString('messages', 'alertTitle', null, 'taskme'),
                calGetString('messages', errmsg, null, 'taskme')
            );
	    }
	}
}