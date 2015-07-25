/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function(launchData) {
  chrome.app.window.create(
    'index.html',
    {
      //frame : "none",
      //state : "fullscreen" //bei Fullscreen esc für Ende Pointerlock nicht möglich
      frame : "none",
      state : "maximized"
    });
});
