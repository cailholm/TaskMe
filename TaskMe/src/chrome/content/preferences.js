var TaskMePreferences = {
    preference: null,
    GetPreferencesHandler: function() {
        if (this.preference == null) {
            this.preference = Components.classes["@mozilla.org/preferences-service;1"]
                    .getService(Components.interfaces.nsIPrefService)
                    .getBranch("extensions.taskme_ext.");
        }
        return this.preference;
    },
    GetCalendarName: function () {
        if (!this.GetPreferencesHandler().prefHasUserValue("calendarname")) return null;
        return this.GetPreferencesHandler().getComplexValue("calendarname",
                    Components.interfaces.nsISupportsString).data;
    },
    SetCalendarName: function(name) {
        var utfName = Components.classes["@mozilla.org/supports-string;1"]
                      .createInstance(Components.interfaces.nsISupportsString);
        utfName.data = name;

        this.GetPreferencesHandler().setComplexValue("calendarname",
             Components.interfaces.nsISupportsString, utfName);
    },
    GetEventInterval: function () {
        return this.GetPreferencesHandler().getIntPref("eventinterval");
    },
    SetEventInterval: function (interval) {
        this.GetPreferencesHandler().setIntPref("eventinterval", interval);
    }
}
