Components.utils.import("resource://gre/modules/Services.jsm");

var TaskEvent = {
    timer: null,
    interval: 0,
    lastMessage: "",
    from: null,
    lastTo: new Date(),
    forceNewEventNextTime: false,
    Setup: function(interval) {
        this.interval = interval;
        this.__stopTimer();
        this.__setupTimer();
    },
    Trigger: function () {
        var params = { inn: { message: TaskEvent.lastMessage }, out: null };
        window.openDialog("chrome://taskme/content/eventdialog.xul", "takmeEventDialog",
                          "chrome, dialog, modal, alwaysRaised=yes, resizable=yes", params).focus();

        if (params.out) {
            // OK clicked
            if (params.out.message) {
                var to = new Date();
                if ((TaskEvent.lastMessage == params.out.message) && 
                    (TaskEvent.forceNewEventNextTime == false)) {
                    Calendar.ExtendEvent(TaskEvent.from, to);
                } else {
                    TaskEvent.from = new Date(TaskEvent.lastTo.getTime() + 60 * 1000);
                    Calendar.AddEvent(params.out.message, TaskEvent.from, to);

                    TaskEvent.forceNewEventNextTime = false;
                }
                TaskEvent.__setEndDate(to);
            }
            TaskEvent.lastMessage = params.out.message;
        }   // else Cancel clicked

        TaskEvent.__setupTimer();
    },
    Clean: function() {
        this.__cleanAndExtendTo(new Date());
    },
    ForceNewEventNextTime: function() {
        this.forceNewEventNextTime = true;
    },
    StartNewEventAfterWake: function (end_date) {
        this.__cleanAndExtendTo(end_date);
        this.ForceNewEventNextTime();
        this.__setupTimer();
    },
    __cleanAndExtendTo: function (date_to) {
        this.__stopTimer();

        // Extend last event to current time.
        if (this.lastMessage) {
            Calendar.SetSilentMode(true);
            Calendar.ExtendEvent(TaskEvent.from, date_to);
            Calendar.SetSilentMode(false);
        }

        this.__setEndDate(new Date());
    },
    __setEndDate: function(end_date) {
        this.lastTo = end_date;
    },
    __setupTimer: function () {
        if (this.interval > 0) {
            this.timer = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
            this.timer.initWithCallback(this.Trigger, this.interval * 1000, this.timer.TYPE_ONE_SHOT);
            //this.timer.initWithCallback(this.Trigger, this.interval * 100, this.timer.TYPE_ONE_SHOT);
        } else {
            this.timer = null;
        }
    },
    __stopTimer: function () {
        if (this.timer) {
            this.timer.cancel();
            this.timer = null;
        }
    }
}