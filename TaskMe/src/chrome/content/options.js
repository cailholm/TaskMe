function FillListWithCalendarNames(list) {
    var calendars = Calendar.GetCalendarNames();
    for (var i = 0; i < calendars.length; ++i) {
        list.appendItem(calendars[i], calendars[i], '');
    }
}

function SelectChosenCalendar(list) {
    var selectedItem = TaskMePreferences.GetCalendarName();
    var itemsCount = list.itemCount;
    for (var i = 0; i < itemsCount; ++i) {
        var item = list.getItemAtIndex(i);
        if (item.value == selectedItem) {
            list.selectedIndex = i;
            break;
        }
    }
}

function ReadCalendars() {
    var list = document.getElementById('calendarslist');
    
    FillListWithCalendarNames(list);
    SelectChosenCalendar(list);
}

//function onPrefsAccepted() {
    //var selectedCalendar = document.getElementById('calendarslist').selectedItem;
    //TaskMePreferences.SetCalendarName(selectedCalendar.value);

    //alert(document.getElementById('eventinterval'));
    //alert(document.getElementById('eventinterval').selectedItem);
    //var selectedInterval = document.getElementById('eventinterval').selectedItem;
    //TaskMePreferences.SetEventInterval(selectedInterval.value);
//}

window.addEventListener("load", function (e) {
    ReadCalendars();
}, false);
