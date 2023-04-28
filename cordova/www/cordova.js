function onDeviceReady() {
    navigator.splashscreen.show();
    setTimeout(function() {
        navigator.splashscreen.hide();
    }, 10000);
}