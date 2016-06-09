var WakeNotifier = {
    observer: null,
    timer: null,
    lastDate: new Date(),

    start: function (observer) {
        this.observer = observer;

        this._setupObserverService();
        this._setupTimer();
    },

    stop: function () {
        this._stopTimer();
        this._removeFromObserverService();
    },

    observe: function (subject, topic, data) {
        if (topic == "wake_notification") {
            if (WakeNotifier.observer) {
                WakeNotifier.observer.onWake(WakeNotifier.lastDate);
            }

            WakeNotifier.stop();
            WakeNotifier.start(WakeNotifier.observer);
        }
    },

    _setupObserverService: function () {
        var observerSvc = Components.classes["@mozilla.org/observer-service;1"]
                          .getService(Components.interfaces.nsIObserverService);
        observerSvc.addObserver(this, "wake_notification", false);
    },

    _setupTimer: function () {
        this.timer = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
        var delay = 300000;         // 5 minutes
        this.timer.initWithCallback(this._onTimerCallback, delay, this.timer.TYPE_REPEATING_PRECISE);
    },

    _onTimerCallback: function () {
        WakeNotifier.lastDate = new Date();
    },

    _removeFromObserverService: function() {
        var observerSvc = Components.classes["@mozilla.org/observer-service;1"]
                      .getService(Components.interfaces.nsIObserverService);
        observerSvc.removeObserver(this, "wake_notification");
    },

    _stopTimer: function() {
        this.timer.cancel();
        this.timer = null;
    }
}