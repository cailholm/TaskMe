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
        if (this.timer) window.clearTimeout(this.timer);
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
                TaskEvent.lastTo = to;
            }
            TaskEvent.lastMessage = params.out.message;
        }   // else Cancel clicked

        TaskEvent.__setupTimer();
    },
    Clean: function() {
        if (this.timer) window.clearTimeout(this.timer);

        // Extend last event to current time.
        if (this.lastMessage) {
            Calendar.SetSilentMode(true);
            Calendar.ExtendEvent(TaskEvent.from, new Date());
        }
    },
    ForceNewEventNextTime: function() {
        this.forceNewEventNextTime = true;
    },
    __setupTimer: function () {
        if (this.interval > 0) {
            this.timer = window.setTimeout(this.Trigger, this.interval * 1000);
            //this.timer = window.setTimeout(this.Trigger, this.interval * 10);
        } else {
            this.timer = null;
        }
    }
}