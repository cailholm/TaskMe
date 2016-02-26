var TaskMeWatcher = {
    initialize: function () {
        TaskMePreferences.GetPreferencesHandler().addObserver("", this, false);
        TaskEvent.Setup(TaskMePreferences.GetEventInterval());
        WakeNotifier.start(this);
    },

    observe: function (subject, topic, data) {
        if (topic == "nsPref:changed") {
            switch (data) {
                case "calendarname":
                    console.log('TaskMe: calendar changed');
                    TaskEvent.ForceNewEventNextTime();
                    break;
                case "eventinterval":
                    var interval = TaskMePreferences.GetEventInterval();
                    console.log('TaskMe: interval changed to ' + interval.toString() + ' seconds');
                    TaskEvent.Setup(interval);
                    break;
            }
        }
    },

    shutdown: function () {
        TaskMePreferences.GetPreferencesHandler().removeObserver("", this);
        TaskEvent.Clean();
    },

    onWake: function (when_suspended) {
        TaskEvent.StartNewEventAfterWake(when_suspended);
    }
}

window.addEventListener("load", function (e) { TaskMeWatcher.initialize(); }, false);
window.addEventListener("unload", function (e) { TaskMeWatcher.shutdown(); }, false);
