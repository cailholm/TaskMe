function onLoad() {
    document.getElementById("message").value = window.arguments[0].inn.message;

    // This is probably redundant call but openDialog(...).focus() not always worked.
    window.focus();
}

function onOK() {
    window.arguments[0].out = {
        message: document.getElementById("message").value.trim()
    };
    return true;
}