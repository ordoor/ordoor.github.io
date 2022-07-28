// ==UserScript==
// @name         TTV++
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Additional Twitch Features
// @author       ordoor
// @match        https://*.twitch.tv/*
// @exclude      https://*.twitch.tv/*?ttvpp=false
// @exclude      https://*.twitch.tv/*?*&ttvpp=false
// @exclude      https://*.twitch.tv/*?*&ttvpp=false&*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// ==/UserScript==
(function() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.defer = true;
    if(localStorage.getItem('ext-version') == 'advanced'){
        script.src = 'https://ordoor.github.io/ttvextension/Advanced.js';
    } else if(localStorage.getItem('ext-version')?.startsWith('http')){
       script.src = localStorage.getItem('ext-version');
    } else {
        script.src = 'https://drive.google.com/uc?export=view&id=1yYu85iIKUTe6SNG5XbMQnEQEBtX722An&confirm=t';
    }
    var link = document.createElement('link');
    link.rel = "stylesheet"
    link.href = "https://drive.google.com/uc?export=view&id=1-ip_6aXj7I3P56ne2nGu83YREo1y6dDL&confirm=t"
    var head = document.getElementsByTagName('head')[0];
    if (!head) return;
    head.appendChild(script);
    head.appendChild(link);
    document.addEventListener('keydown', function(e){
       if(e.code == 'F2' && e.shiftKey == true){
          confirm('Reset Extension?') && localStorage.setItem('ext-version', 'regular')
       }
    })
})();