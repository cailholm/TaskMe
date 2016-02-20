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

	    var dateFromStr = this.__dateToStr(from);
	    var id = this.eventIdPrefix + dateFromStr;

	    var tempEvent = this.__retrieveItem(id, calendar);
	    if (tempEvent != null) {
            // Event exists. Extend it instead of adding.
	        this.__modifyEvent(calendar, tempEvent, id, to);
	    } else {
	        var dateToStr = this.__dateToStr(to);

	        // Create iCalString and then an event from that string
	        var iCalString = "BEGIN:VCALENDAR\n" +
	                         "BEGIN:VEVENT\n" +
	                         "SUMMARY:Test2345\n" +
	                         "DTSTART;VALUE=DATE:" + dateFromStr + "\n" +
	                         "DTEND;VALUE=DATE:" + dateToStr + "\n" +
                             "END:VEVENT\n" +
	                         "END:VCALENDAR\n";

	        // create event Object out of iCalString
	        var event = Components.classes["@mozilla.org/calendar/event;1"].createInstance(Components.interfaces.calIEvent);
	        event.icalString = iCalString;
	        event.title = this.__extractTitle(msg);
	        event.id = id;
	        event.setProperty('description', msg);
	        calendar.addItem(event, null);
	    }
	},
	ExtendEvent: function (from, duration) {
	    var calendar = this.GetCurrentCalendar();
	    if (calendar === null) {
	        this.__alert('alertNoCalendar');
	        return;
	    }

	    var dateFromStr = this.__dateToStr(from);
	    var id = this.eventIdPrefix + dateFromStr;

	    var tempEvent = this.__retrieveItem(id, calendar);
	    if (tempEvent == null) {
	        this.__alert('alertNoEvent');
	        return;
	    }

	    this.__modifyEvent(calendar, tempEvent, id, duration);
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
	__retrieveItem: function (id, calendar) {
	    var listener = new CalendarOpListener();
	    calendar.getItem(id, listener);
	    return listener.getItem();
	},
	__modifyEvent: function (calendar, tempEvent, id, to) {
	    var newEvent = Components.classes["@mozilla.org/calendar/event;1"].createInstance(Components.interfaces.calIEvent);

	    newEvent.icalString = tempEvent.icalString;
	    newEvent.calendar = calendar;

	    var dtend = newEvent.getProperty('dtend');
	    var localToUnixTimestamp = Math.floor(to.getTime() / 1000) - to.getTimezoneOffset()*60;
	    var localEventUnixTimestamp = Math.floor(dtend.nativeTime / 1000000);
	    var diffSeconds = localToUnixTimestamp - localEventUnixTimestamp;
	    dtend.second += diffSeconds;
	    newEvent.setProperty('dtend', dtend);

	    calendar.modifyItem(newEvent, tempEvent, null);
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