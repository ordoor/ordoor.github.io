function randomgen(first, max, repetitions) {
  let minimum;
  let maximum;
  if (max) {
    minimum = first;
    maximum = max;
  } else if (first) {
    minimum = 1;
    maximum = first;
  }
  if (repetitions) {
    spread = Array(maximum + 1).fill(0)
    outputN = []
    for (let i = 0; i < repetitions; i++) {
      n = Math.floor(Math.random() * (maximum - minimum + 1) + minimum)
      output.push(n)
      spread[n]++
    }
    sorted = output.sort((a, b) => a - b);
    return {
      spread,
      sorted,
      output,
    }
  } else {
    return Math.floor(Math.random() * maximum + minimum)
  }
}
function $(querySelector, parent = document) {
  if (typeof querySelector == "function") {
    document.addEventListener("load", querySelector)
  }
  else return parent.querySelector(querySelector)
}
function $$(querySelectorAll, parent = document) {
  return parent.querySelectorAll(querySelectorAll)
}
Element.prototype.ancestor = function(numbUp) {
  ele = this
  for (let i = 0; i < numbUp; i++) {
    ele = ele.parentNode
  }
  return ele
}
function ElementAncestor(ele, numbUp) {
  for (let i = 0; i < numbUp; i++) {
    ele = ele.parentNode
  }
  return ele
}
var spanColorPresetPreset = '#uss\n\ns(c:red;tt:N;) a /s\\n\ns(c:green;) b /s\\n\ns(tt:N;c:blue;) c /s\\n\ns(tt:N;) d /s\\n'
var oldLocation = document.location.href
var RemoveLeaderboardOnLinkClickInterval;
let HasRemoveLeaderboardOnActivated = false
let usernameSearchTerms = [
  { Name: "ordoor", Class: "ordoor", BonusBadge: "Admin" },
  { Name: "ordooralso", Class: "ordoor", BonusBadge: "Admin" },/*
  { Name: "temmies", Class: "GenericImportant" },
  { Name: "technoblade", Class: "technoblade" },
  { Name: "philza", Class: "GenericImportant" },
  { Name: "tommyinnit", Class: "GenericImportant" },
  { Name: "wilbursoot", Class: "GenericImportant" },
  { Name: "tubbo", Class: "GenericImportant" },
  { Name: "tubbolive", Class: "GenericImportant" },
  { Name: "ranboolive", Class: "GenericImportant" },
  { Name: "aimsey", Class: "GenericImportant" },
  { Name: "smajor", Class: "GenericImportant" },
  { Name: "jackmanifoldtv", Class: "GenericImportant" },
  { Name: "nihachu", Class: "GenericImportant" },
  { Name: "quackity", Class: "GenericImportant" },
  { Name: "badboyhalo", Class: "GenericImportant" },
  { Name: "skeppy", Class: "GenericImportant" },
  { Name: "cuptoast", Class: "GenericImportant" },
  { Name: "jschlatt", Class: "GenericImportant" },
  { Name: "austinshow", Class: "GenericImportant" },
  { Name: "disguisedtoast", Class: "GenericImportant" },
  { Name: "ironmouse", Class: "GenericImportant" },
  { Name: "btdisab", Class: "GenericImportant" },*/
]
let extOptionsHTMLpre = `
  <div>
    <div class="presetShortcuts">
      <button id="applyDefaultPreset" title="Insert Stream Chat as Input">Def</button>
      <button id="applySpanPreset" title="Insert <span> as Input">()</button>
      <button id="applyNoCapPreset" title="Disable All Caps">a</button>
      <button id="applySpanColorPreset" title="Insert <span> w/ color"><span style="color: red;">(</span><span style="color: blue;">)</span></button>
      <button id="applyUnorderedListPreset" title="Inserts an Unordered list as your input">&#183;</button>
      <button id="applyTablePreset" title="Inserts a table">#</button>
    </div>
    <textarea rows="6" cols="100" name="text" placeholder="Replace Stream Chat w/ text entered" id="replaceStreamChat" value="default" class="input" autocorrect="off" style="overflow-wrap: normal;"></textarea>
    <input type="range" name="headingSize" id="headSize" value="5" min="5" max="50" />
    <span class="text">Current size: <span id="currentHeaderSize"></span>rem</span>
    <button id="apply" class="apply">
      <div class="applyContent">Apply</div>
    </button>
    <button id="toggleLeaderboard" title="Toggle Leaderboard">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M572.1 82.38C569.5 71.59 559.8 64 548.7 64h-100.8c.2422-12.45 .1078-23.7-.1559-33.02C447.3 13.63 433.2 0 415.8 0H160.2C142.8 0 128.7 13.63 128.2 30.98C127.1 40.3 127.8 51.55 128.1 64H27.26C16.16 64 6.537 71.59 3.912 82.38C3.1 85.78-15.71 167.2 37.07 245.9c37.44 55.82 100.6 95.03 187.5 117.4c18.7 4.805 31.41 22.06 31.41 41.37C256 428.5 236.5 448 212.6 448H208c-26.51 0-47.99 21.49-47.99 48c0 8.836 7.163 16 15.1 16h223.1c8.836 0 15.1-7.164 15.1-16c0-26.51-21.48-48-47.99-48h-4.644c-23.86 0-43.36-19.5-43.36-43.35c0-19.31 12.71-36.57 31.41-41.37c86.96-22.34 150.1-61.55 187.5-117.4C591.7 167.2 572.9 85.78 572.1 82.38zM77.41 219.8C49.47 178.6 47.01 135.7 48.38 112h80.39c5.359 59.62 20.35 131.1 57.67 189.1C137.4 281.6 100.9 254.4 77.41 219.8zM498.6 219.8c-23.44 34.6-59.94 61.75-109 81.22C426.9 243.1 441.9 171.6 447.2 112h80.39C528.1 135.7 526.5 178.7 498.6 219.8z" /></svg>
    </button>
    <button id="skip15p">
      <img src="https://i.imgur.com/uWlBgQ3.png" id="skip15" width="15" height="15"/>
    </button>
  </div>`
//document.querySelector("head").innerHTML += '<script type="module" src="https://drive.google.com/uc?export=view&id=1VgM4oAnhmd7f-onpDJyYKRaqV9gSsyW_&confirm=t"></script>'
//adds external css file

let extExternalCSS = document.createElement("link")
extExternalCSS.rel = "stylesheet"
extExternalCSS.href = localStorage.getItem('ext-ul') == 'default' || !localStorage.getItem('ext-ul') ? "https://https://ordoor.github.io/ttvextension/defaultUsernames.css" : localStorage.getItem('ext-ul')
$("head").appendChild(extExternalCSS)
let extExternalCSSusernameSearchTerms = document.createElement("p")
extExternalCSSusernameSearchTerms.id = "extExternalCSSusernameSearchTerms"
$('body').appendChild(extExternalCSSusernameSearchTerms)


let addAdditionalNamesI = setInterval(addAdditionalNames, 3000)

function addAdditionalNames() {
  if (getComputedStyle(extExternalCSSusernameSearchTerms, "::before").content) {
    //adds content to usernameSearchTerms
    let extExternalCSSusernameSearchTermsA = [];
    let extExternalCSSusernameSearchTermsSplt = getComputedStyle(extExternalCSSusernameSearchTerms, "::before").content.replaceAll('"', '').split("|")

    for (let i = 0; i < extExternalCSSusernameSearchTermsSplt.length; i++) {
      let extExternalCSSusernameSearchTermsSplt2 = extExternalCSSusernameSearchTermsSplt[i].split("/")
      extExternalCSSusernameSearchTermsA.push({ Name: extExternalCSSusernameSearchTermsSplt2[0], Class: extExternalCSSusernameSearchTermsSplt2[1] })
      console.log(extExternalCSSusernameSearchTermsSplt2)
    }
    for (let i = 0; i < extExternalCSSusernameSearchTermsA.length; i++) { usernameSearchTerms.push(extExternalCSSusernameSearchTermsA[i]) }
    console.log(usernameSearchTerms)

    //checks if your username is not part of the list and assigns you the GenericSelf class
    let UsernameIsPartOfList = false
    let hasDisplayNameExistsInterval = setInterval(GenericSelfDisplayName, 1000)
    function GenericSelfDisplayName() {
      if ($('.name-display__name')) {
        for (let i = 0; i < usernameSearchTerms.length; i++) {
          if (usernameSearchTerms[i].Name == $('.name-display__name').innerText.toLowerCase()) {
            UsernameIsPartOfList = true
          }
          console.log(UsernameIsPartOfList, $('.name-display__name').innerText.toLowerCase())
        }
        if (!UsernameIsPartOfList) {
          usernameSearchTerms.push({ Name: $('.name-display__name').innerText.toLowerCase(), Class: "GenericSelf" })
        }
        $("[data-test-selector=chat-settings-close-button-selector]").click()
        clearInterval(hasDisplayNameExistsInterval)
      }
      if ($("[aria-label= ChatBadgeCarousel]")) {
        $("[aria-label= ChatBadgeCarousel]").click()
        $("[data-test-selector=chat-settings-close-button-selector]").click()
      }
    }
    clearInterval(addAdditionalNamesI)
  }
}
//adds usernames from external script
/*
const script = document.createElement('script');
script.setAttribute("type", "module");
script.setAttribute("src", "https://drive.google.com/uc?export=view&id=1VgM4oAnhmd7f-onpDJyYKRaqV9gSsyW_");
const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
head.insertBefore(script, head.lastChild);*/

//main script
setInterval(CreateButton, 3000)
setInterval(ChatEditLast, 50, 3)
setInterval(ChatEditLast, 400, 40)
setInterval(ChatEditLast, 3000, 150)
/*setTimeout(function () {
  let observer = new MutationObserver(mutationRecords => {
    ChatEditLast(1)
  });
  // observe everything except attributes
  observer.observe(document.querySelector(".chat-scrollable-area__message-container"), {
    childList: true, // observe direct children
    subtree: true, // lower descendants too
    characterDataOldValue: true, // pass old data to callback
  });
}, 3000)*/
setInterval(CustomCommands, 500)
let RemoveLeaderboardOnPageLoad = setInterval(RemoveLeaderboardOn, 1000)
setInterval(RemoveLeaderboardOnLinkClick, 3000)
let chatButton = $("[data-a-target='chat-send-button']")
if (chatButton) {
  chatButton.addEventListener("click", async () => {
    setTimeout(ChatEdit, 400)
    setTimeout(ChatEdit, 600)
  });
}
setInterval(RefreshVideos, 5000)
setTimeout(RefreshVideos, 4000)

let cloneTimer = [];

function CreateButton() {
  if (!$('.extButton') && (document.getElementById('chat-room-header-label') || $(".video-chat__header"))) {
    if ($('.extPopup')) {
      let popup = $('.extPopup')
      popup.parentNode.removeChild(popup)
    }
    let chatRoomContent = $('.channel-root__right-column');

    var extButton = document.createElement("button");
    var extImg = document.createElement("img");
    var extpopup = document.createElement("div");
    var extCloseButton = document.createElement("button");
    var extInfoButton = document.createElement("button");
    var extCloseButtonText = document.createElement("span");
    var extOptions = document.createElement("div");
    var extOptionsHTML = extOptionsHTMLpre
    extButton.classList.add("Layout-sc-nxg1ff-0");
    extButton.classList.add("extButton")
    extCloseButton.classList.add("Layout-sc-nxg1ff-0");
    extCloseButton.classList.add("extCloseButton")
    extInfoButton.classList.add("Layout-sc-nxg1ff-0");
    extInfoButton.classList.add("extInfoButton")
    extCloseButtonText.classList.add("extCloseButtonText")
    extOptions.classList.add("extOptions")
    extpopup.classList.add("extPopup")
    extImg.src = "https://i.imgur.com/7Wd1CT1.png"
    extImg.style.padding = "5px"
    extpopup.innerHTML = 'Set Stream Chat Heading'//(Original Input Height = 97.5)
    extCloseButton.style.float = "right"
    extCloseButtonText.innerHTML = "&#x2716;"
    extInfoButton.innerHTML = '<a class="extInfoButtonText" href="https://pastebin.com/aMC52bFU" target="_blank">&#x1F6C8</a>'
    extButton.append(extImg)
    chatRoomContent.appendChild(extpopup)
    try {
      let chatTypeAgainText = $('.gwGJSM').childNodes[0];
      chatTypeAgainText?.insertAdjacentElement("afterend", extButton)
    } catch (error) { }
    extpopup.append(extCloseButton);
    extpopup.append(extInfoButton);
    extCloseButton.append(extCloseButtonText);
    extpopup.append(extOptions);
    extOptions.innerHTML = extOptionsHTML
    extButton.addEventListener("click", async () => {
      if (extpopup.style.visibility == "visible") {
        extpopup.style.height = "0px"
        extpopup.style.opacity = "0"
        setTimeout(function () {
          extpopup.style.visibility = "hidden"
        }, 200);
      } else {
        extpopup.style.visibility = "visible"
        extpopup.style.height = "320px"
        extpopup.style.opacity = "1"
        setTimeout(function () {
          $("#replaceStreamChat").focus()
        }, 200);
      }
    });
    extCloseButton.addEventListener("click", async () => {
      extpopup.style.height = "0px"
      extpopup.style.opacity = "0"
      setTimeout(function () {
        extpopup.style.visibility = "hidden"
      }, 200);
    });
    document.getElementById('headSize').onmousemove = function () {
      document.getElementById('currentHeaderSize').innerHTML = this.value;
      (document.querySelector('.stream-chat-header') ?? document.querySelector("div.Layout-sc-nxg1ff-0.giyKYb.video-chat__header")).style.height = this.value.toString() + "rem";
    }
    document.getElementById('headSize').onchange = function () {
      document.getElementById('currentHeaderSize').innerHTML = this.value;
      (document.querySelector('.stream-chat-header') ?? document.querySelector("div.Layout-sc-nxg1ff-0.giyKYb.video-chat__header")).style.height = this.value.toString() + "rem";
    }

    //from options.js
    let apply = document.getElementById("apply");
    let input = document.getElementById("replaceStreamChat");
    let applySpanPreset = document.getElementById("applySpanPreset");
    let applyUnorderedListPreset = document.getElementById("applyUnorderedListPreset");
    let applyDefaultPreset = document.getElementById("applyDefaultPreset");
    let applySpanColorPreset = document.getElementById("applySpanColorPreset");
    let applyNoCapPreset = document.getElementById("applyNoCapPreset");
    applySpanPreset.addEventListener("click", async () => {
      input.value = '<span></span>\n<span></span>\n<span></span>\n<span></span>\n<span></span>'
    });
    applyDefaultPreset.addEventListener("click", async () => {
      input.value = 'Stream Chat'
    });
    applyUnorderedListPreset.addEventListener("click", async () => {
      input.value = '<ul>\n<li></li>\n<li></li>\n<li></li>\n<li></li>\n<li></li>\n</ul>'
    });
    applySpanColorPreset.addEventListener("click", async () => {
      if (input.value != "" && input.value != "Stream Chat" && !input.value.startsWith('#uss')) {
        var lines = input.value.split(/\r\n|\n\r|\n|\r|\u007C/);
        var newInput = "#uss\n\n\n"
        for (let i = 0; i < lines.length; i++) {
          newInput += 's(c:red;tt:N;) ' + lines[i] + ' /s\\n\n'
        }
      } else {
        newInput = spanColorPresetPreset
      }

      input.value = newInput
      newInput = "#uss\n\n/n\n"
    });
    applyNoCapPreset.addEventListener("click", async () => {
      input.value = '<span style="text-transform: none;">\n' + input.value + '\n</span>'
    });
    $('#applyTablePreset').addEventListener("click", function () {
      input.value = "#uss\nt(width: 100px;)\ntr()\ntd(c:darkgreen;tt:N;) A1 /td\ntd(c:green;tt:N;) A2 /td\n/tr\ntr()\ntd(c:darkred;tt:N;) B1 /td\ntd(c:red;tt:N;) B2 /td\n/tr\ntr()\ntd(c:cyan;tt:N;) C1 /td\ntd(c:lime;tt:N;) C2 /td\n/tr\n/t"
    });
    //from popup.js
    let toggleLeaderboard = document.getElementById("toggleLeaderboard");
    apply.addEventListener("click", async () => {
      let streamChatHeading = document.getElementById("chat-room-header-label") ? document.getElementById("chat-room-header-label") : $("div.Layout-sc-nxg1ff-0.giyKYb.video-chat__header > span");
      let headerDiv = $('.stream-chat-header') ? $('.stream-chat-header') : $("div.Layout-sc-nxg1ff-0.giyKYb.video-chat__header");
      let newVersion = document.getElementById("replaceStreamChat").value;
      let headSize = document.getElementById("headSize").value;
      $$("clone", streamChatHeading).forEach(cloneele => {
        cloneele.setAttribute("destroyed", "true")
      })

      if (newVersion.startsWith("#uss")) {
        var newerVersion = newVersion.replace(/t\(([^)\n]*)\)([^]*)\/t(?![dr])/g, function (_p1, p2, p3) {
          p2 = p2.replace(/c:/g, 'color:').replace(/tt:/g, 'text-transform:').replace(/: ?n/gi, ': none')
          return `<table style="${p2}">${p3}</table>`
        }).replace(/tr\(([^)\n]*)\)((?:(?!\/tr)[^])*)\/tr/g, function (_p1, p2, p3) {
          p2 = p2.replace(/c:/g, 'color:').replace(/tt:/g, 'text-transform:').replace(/: ?n/gi, ': none')
          return `<tr style="${p2}">${p3}</tr>`
        }).replace(/td\(([^)\n]*)\)((?:(?!\/td)[^])*)\/td/g, function (_p1, p2, p3) {
          p2 = p2.replace(/c:/g, 'color:').replace(/tt:/g, 'text-transform:').replace(/: ?n/gi, ': none')
          return `<td style="${p2}">${p3}</td>`
        }).replace(/s\(([^)\n]*)\)([^/]*)\/s/g, function (_p1, p2, p3) {
          p2 = p2.replace(/c:/g, 'color:').replace(/tt:/g, 'text-transform:').replace(/: ?n/gi, ': none')
          return `<span style="${p2}">${p3}</span>`
        }).replace(/^#uss/, '').replace(/\\n/g, '<br/>').replace(/<clone e="([\s\S]*)"\/>/g, function (_p1, p2) {
          return $(p2).outerHTML
        });
        streamChatHeading.innerHTML = newerVersion
      } else if (newVersion.startsWith(">version")) {
        if (newVersion.toLowerCase().startsWith('>version = adv')) {
          localStorage.setItem('ext-version', 'advanced')
          $('#replaceStreamChat').value = `Version is now ${localStorage.getItem('ext-version')}, refresh to update`
        } else if (newVersion.toLowerCase().startsWith('>version = reg')) {
          localStorage.setItem('ext-version', 'regular')
          $('#replaceStreamChat').value = `Version is now ${localStorage.getItem('ext-version')}, refresh to update`
        } else if (newVersion.toLowerCase().startsWith('>version = custom:')) {
          localStorage.setItem('ext-version', newVersion.replace(/>version = custom:/, ''))
          $('#replaceStreamChat').value = `Version is now ${localStorage.getItem('ext-version')}, refresh to update`
        } else if (newVersion.toLowerCase().startsWith('>version current')) {
          $('#replaceStreamChat').value = `Version is now ${localStorage.getItem('ext-version')}`
        }
      } else if (newVersion.startsWith(">userlist")) {
        if(newVersion.match(/^>userlist:? ?d(efault)?$/)){
          localStorage.setItem('ext-ul', 'default')
        } else {
          localStorage.setItem('ext-ul', newVersion.replace(/^>userlist:? ?/, ""))
        }
      } else {
        streamChatHeading.innerHTML = newVersion.replace(/<clone e="([^"]*)"( repeatTime="(\d*)")?\/>/g, function (_p1, p2, p3) {
          cloneid = Math.floor(Math.random() * 1000000000000000)
          try {
            return `<clone id="clone-${cloneid}"e="${p2}"${(p3) ? p3 : ' repeatTime="1000"'} style="text-transform: none;">${$(p2).outerHTML}</clone>`
          } catch (err) {
            alert(err.message)
          }

        });
      }
      headerDiv.style.height = headSize.toString() + "rem";
      document.getElementById("currentHeaderSize").innerText = headSize.toString()
    });
    toggleLeaderboard.addEventListener("click", async () => {
      let leaderboard = $('.channel-leaderboard');
      let leaderboardInner = $('.channel-leaderboard-header-rotating');
      if (leaderboard.style.visibility == "hidden") {
        leaderboard.style.visibility = "visible"
        leaderboard.style.height = "7rem"
        leaderboardInner.style.height = "7rem"
      } else {
        leaderboard.style.visibility = "hidden"
        leaderboard.style.height = "0rem"
        leaderboardInner.style.height = "0rem"
      }
    });
    document.getElementById("currentHeaderSize").innerHTML = $('.stream-chat-header') ? $('.stream-chat-header').offsetHeight / 10 : 5;
    document.getElementById("replaceStreamChat").innerHTML = $('#chat-room-header-label') ? $('#chat-room-header-label').innerHTML : "Stream Chat"
  } else {
    false
  }
}
CreateButton()
function ChatEdit() {
  let allChatMessages = $$('.chat-author__display-name')
  let displayName = $('.name-display__name')
  for (let i = 0; i < allChatMessages.length; i++) {
    for (let i2 = 0; i2 < usernameSearchTerms.length; i2++) {
      if (allChatMessages[i].innerHTML.toLowerCase() == usernameSearchTerms[i2].Name) {
        allChatMessages[i].classList.add("UsernameIs-" + usernameSearchTerms[i2].Class)
        ElementAncestor(allChatMessages[i], 3).classList.add("chat-line__username-container-UsernameIs-" + usernameSearchTerms[i2].Class)
        ElementAncestor(allChatMessages[i], 5).classList.add("chat-line-UsernameIs-" + usernameSearchTerms[i2].Class)
        if (!ElementAncestor(allChatMessages[i], 3).childNodes[0].innerHTML.includes("Extension Admin") && usernameSearchTerms[i2].BonusBadge == "Verified") {
          ElementAncestor(allChatMessages[i], 3).childNodes[0].innerHTML += '<div class="InjectLayout-sc-588ddc-0 kUvjun" title="Extension Admin" style="width: 18px; height: 18px"><button data-a-target="chat-badge" aria-describedby="93092e97b1e5f4e17c165ee4d01ad630" control-id="ControlID-626"><img alt="Verified" aria-label="Extension Admin badge" class="chat-badge" src="https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/1" srcset="https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/1 1x, https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/2 2x, https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3 4x"></button></div>'
        }
        if (!ElementAncestor(allChatMessages[i], 3).childNodes[0].innerHTML.includes("Extension Admin") && usernameSearchTerms[i2].BonusBadge == "Admin") {
          ElementAncestor(allChatMessages[i], 3).childNodes[0].innerHTML += '<div class="InjectLayout-sc-588ddc-0 kUvjun" title="Extension Admin" style="width: 18px; height: 18px"><button data-a-target="chat-badge" aria-describedby="93092e97b1e5f4e17c165ee4d01ad630" control-id="ControlID-626"><img alt="Verified" aria-label="Extension Admin badge" class="chat-badge" src="https://i.imgur.com/RuQgbKi.png" srcset="https://i.imgur.com/RuQgbKi.png 1x, https://i.imgur.com/RuQgbKi.png 2x, https://i.imgur.com/RuQgbKi.png 4x" style="width: 18px; height: 18px"></button></div>'
        }
      }
      if (displayName) {
        if (displayName.innerHTML.toLowerCase() == usernameSearchTerms[i2].Name) {
          displayName.classList.add("UsernameIs-" + usernameSearchTerms[i2].Class)
          displayName.parentNode.classList.add("chat-line__username-container-UsernameIs-" + usernameSearchTerms[i2].Class)
          displayName.parentNode.parentNode.classList.add("chat-line-UsernameIs-" + usernameSearchTerms[i2].Class)
          if (!displayName.innerHTML.includes("Extension Admin") && usernameSearchTerms[i2].BonusBadge == "Verified") {
            displayName.innerHTML = '<div class="InjectLayout-sc-588ddc-0 kUvjun"><button data-a-target="chat-badge" aria-describedby="93092e97b1e5f4e17c165ee4d01ad630" control-id="ControlID-626"><img alt="Verified" aria-label="Extension Admin badge" class="chat-badge" src="https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/1" srcset="https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/1 1x, https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/2 2x, https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3 4x"></button></div>' + displayName.innerHTML
          }
          if (!displayName.innerHTML.includes("Extension Admin") && usernameSearchTerms[i2].BonusBadge == "Admin") {
            displayName.innerHTML = '<div class="InjectLayout-sc-588ddc-0 kUvjun" title="Extension Admin" style="width: 18px; height: 18px"><button data-a-target="chat-badge" aria-describedby="93092e97b1e5f4e17c165ee4d01ad630" control-id="ControlID-626"><img alt="Verified" aria-label="Extension Admin badge" class="chat-badge" src="https://i.imgur.com/RuQgbKi.png" srcset="https://i.imgur.com/RuQgbKi.png 1x, https://i.imgur.com/RuQgbKi.png 2x, https://i.imgur.com/RuQgbKi.png 4x" style="width: 18px; height: 18px"></button></div>' + displayName.innerHTML
          }
        }
      }
    }
  }

}
//let lastScannedMessage;
function ChatEditLast(var1) {
  let allChatMessages = $$('.chat-author__display-name')
  let displayName = $('.name-display__name')
  let i0;
  //if (!lastScannedMessage) {
  i0 = allChatMessages.length - var1;
  /*} else {
    i0 = Array.from($('ul, .chat-scrollable-area__message-container').childNodes).findIndex(function (item) {
      return item == lastScannedMessage
    })
  }*/
  for (let i = i0; i < allChatMessages.length; i++) {
    for (let i2 = 0; i2 < usernameSearchTerms.length; i2++) {
      if (allChatMessages[i]) {
        if (allChatMessages[i].innerHTML.toLowerCase() == usernameSearchTerms[i2].Name) {
          allChatMessages[i].classList.add("UsernameIs-" + usernameSearchTerms[i2].Class)
          ElementAncestor(allChatMessages[i], 3).classList.add("chat-line__username-container-UsernameIs-" + usernameSearchTerms[i2].Class)
          ElementAncestor(allChatMessages[i], 5).classList.add("chat-line-UsernameIs-" + usernameSearchTerms[i2].Class)
          if (!ElementAncestor(allChatMessages[i], 3).childNodes[0].innerHTML.includes("Extension Admin") && usernameSearchTerms[i2].BonusBadge == "Verified") {
            ElementAncestor(allChatMessages[i], 3).childNodes[0].innerHTML += '<div class="InjectLayout-sc-588ddc-0 kUvjun" title="Extension Admin" style="width: 18px; height: 18px"><button data-a-target="chat-badge" aria-describedby="93092e97b1e5f4e17c165ee4d01ad630" control-id="ControlID-626"><img alt="Verified" aria-label="Extension Admin badge" class="chat-badge" src="https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/1" srcset="https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/1 1x, https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/2 2x, https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3 4x"></button></div>'
          }
          if (!ElementAncestor(allChatMessages[i], 3).childNodes[0].innerHTML.includes("Extension Admin") && usernameSearchTerms[i2].BonusBadge == "Admin") {
            ElementAncestor(allChatMessages[i], 3).childNodes[0].innerHTML += '<div class="InjectLayout-sc-588ddc-0 kUvjun" title="Extension Admin" style="width: 18px; height: 18px"><button data-a-target="chat-badge" aria-describedby="93092e97b1e5f4e17c165ee4d01ad630" control-id="ControlID-626"><img alt="Verified" aria-label="Extension Admin badge" class="chat-badge" src="https://i.imgur.com/RuQgbKi.png" srcset="https://i.imgur.com/RuQgbKi.png 1x, https://i.imgur.com/RuQgbKi.png 2x, https://i.imgur.com/RuQgbKi.png 4x" style="width: 18px; height: 18px"></button></div>'
          }
        }
        if (displayName) {
          if (displayName.innerHTML.toLowerCase() == usernameSearchTerms[i2].Name) {
            displayName.classList.add("UsernameIs-" + usernameSearchTerms[i2].Class)
            displayName.parentNode.classList.add("chat-line__username-container-UsernameIs-" + usernameSearchTerms[i2].Class)
            displayName.parentNode.parentNode.classList.add("chat-line-UsernameIs-" + usernameSearchTerms[i2].Class)
            if (!displayName.innerHTML.includes("Extension Admin") && usernameSearchTerms[i2].BonusBadge == "Verified") {
              displayName.innerHTML = '<div class="InjectLayout-sc-588ddc-0 kUvjun"><button data-a-target="chat-badge" aria-describedby="93092e97b1e5f4e17c165ee4d01ad630" control-id="ControlID-626"><img alt="Verified" aria-label="Extension Admin badge" class="chat-badge" src="https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/1" srcset="https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/1 1x, https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/2 2x, https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3 4x"></button></div>' + displayName.innerHTML
            }
            if (!displayName.innerHTML.includes("Extension Admin") && usernameSearchTerms[i2].BonusBadge == "Admin") {
              displayName.innerHTML = '<div class="InjectLayout-sc-588ddc-0 kUvjun" title="Extension Admin" style="width: 18px; height: 18px"><button data-a-target="chat-badge" aria-describedby="93092e97b1e5f4e17c165ee4d01ad630" control-id="ControlID-626"><img alt="Verified" aria-label="Extension Admin badge" class="chat-badge" src="https://i.imgur.com/RuQgbKi.png" srcset="https://i.imgur.com/RuQgbKi.png 1x, https://i.imgur.com/RuQgbKi.png 2x, https://i.imgur.com/RuQgbKi.png 4x" style="width: 18px; height: 18px"></button></div>' + displayName.innerHTML
            }
          }
        }
      }
    }
    //lastScannedMessage = allChatMessages[allChatMessages.length - 1]
    //console.log(lastScannedMessage, Array.from($('ul, .chat-scrollable-area__message-container').childNodes).findIndex(function (item) {
    //  return item == lastScannedMessage
    //}))
  }
  /*if (document.querySelector('.name-display__name')) {
    if (!document.querySelector('.name-display__name').innerHTML.includes('<div')) {
      document.querySelector('.name-display__name').innerHTML = '<div class="InjectLayout-sc-588ddc-0 kUvjun"><button data-a-target="chat-badge" aria-describedby="93092e97b1e5f4e17c165ee4d01ad630" control-id="ControlID-626"><img alt="Verified" aria-label="Extension Admin badge" class="chat-badge" src="https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/1" srcset="https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/1 1x, https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/2 2x, https://static-cdn.jtvnw.net/badges/v1/d12a2e27-16f6-41d0-ab77-b780518f00a3/3 4x"></button></div>' + $('.name-display__name').innerHTML
    }
  }*/
  //console.log(Date.now() - timer1)
}
function CustomCommands() {
  let unrecognizedCommand = $('.hZyPWd')
  if (unrecognizedCommand?.innerHTML.toLowerCase().startsWith("unrecognized command: /dm")) {
    if (document.designMode == 'on') {
      document.designMode = 'off';
      setTimeout(function () { $('.chat-wysiwyg-input__placeholder').innerText = 'Send a message' }, 3000)
    } else {
      document.designMode = 'on';
    }
    $('[aria-label=Close]').click()
    $('.chat-wysiwyg-input__placeholder').innerText = `designMode is now ${document.designMode}`
  }
}
/*function CustomCommands2F2(event) {
  console.log(event.keyCode, event.keyCode == 13, event.CC)
  if ($('[data-test-selector=chat-input]').value == '/dm') {
    $('[data-test-selector=chat-input]').dispatchEvent(new KeyboardEvent('keyup', {
      'key': 'Enter',
      'keyCode': 13,
      'code': 'Enter',
      'which': 13,
    }));
    $('[data-a-target=chat-input]').removeEventListener("keyup", CustomCommands2F2);
    setTimeout(CustomCommands2F2, 5000,)
  }
}
let CustomCommandsV = setInterval(CustomCommands2F, 3000)
function CustomCommands2F() {
  console.log('aaa')
  if ($('[data-a-target=chat-input]')) {
    $('[data-a-target=chat-input]').addEventListener("keyup", CustomCommands2F2);
    clearInterval(CustomCommandsV)
  }
}*/
function RemoveLeaderboardOn() {
  let leaderboard = $('.channel-leaderboard');
  let leaderboardInner = $('.channel-leaderboard-header-rotating');
  if (leaderboard && HasRemoveLeaderboardOnActivated == false) {
    leaderboard.style.visibility = "hidden"
    leaderboard.style.height = "0rem"
    leaderboardInner.style.height = "0rem"
    if (RemoveLeaderboardOnPageLoad) {
      clearInterval(RemoveLeaderboardOnPageLoad);
    }
    if (RemoveLeaderboardOnLinkClickInterval) {
      clearInterval(RemoveLeaderboardOnLinkClickInterval);
    }
    HasRemoveLeaderboardOnActivated = true
  }
  setTimeout(function () {
    if (RemoveLeaderboardOnPageLoad) {
      clearInterval(RemoveLeaderboardOnPageLoad);
    }
    if (RemoveLeaderboardOnLinkClickInterval) {
      clearInterval(RemoveLeaderboardOnLinkClickInterval);
    }
    HasRemoveLeaderboardOnActivated = true
  }, 15000)
}
function RemoveLeaderboardOnLinkClick() {
  let allLinks = $$("a")
  for (let i = 0; i < allLinks.length; i++) {
    allLinks[i].addEventListener("click", function () {
      HasRemoveLeaderboardOnActivated = false
      RemoveLeaderboardOnLinkClickInterval = setInterval(RemoveLeaderboardOn, 500)
    });
  }
}
class Time {
  constructor(hours, minutes, seconds) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }
  get asSeconds() {
    return (this.hours * 3600) + (this.minutes * 60) + this.seconds
  }
  static fromString(string, splitter = ":") {
    let stringSplit = string.split(splitter).map(x => parseInt(x))
    return new this(stringSplit[0], stringSplit[1], stringSplit[2])
  }
}
let resetVid = true;
function RefreshVideos() {
  let currentTimeEle = $('[data-a-target=player-seekbar-current-time]')
  let videoDurationEle = $('[data-a-target=player-seekbar-duration]')
  if (location.href.match(/twitch.tv\/videos\//) && currentTimeEle && videoDurationEle) {
    let isLiveNow = $('div.cdkvSQ > div:nth-child(2)').innerText
    let videoDuration = videoDurationEle?.innerText
    let currentTime = currentTimeEle?.innerText
    let timeRemaining = Time.fromString(videoDuration).asSeconds - Time.fromString(currentTime).asSeconds
    if (location.href.match(/twitch.tv\/videos\//) && currentTimeEle && isLiveNow == 'streaming live now' && $('[data-a-target=tw-input]').value.toLowerCase() != '#vrfd' /*Video Refresh Function Disable*/ && (isLiveNow.match(/sec|min|hour/gi) || (videoDuration[0] >= 18 && isLiveNow.match(/sec|min|hour|yesterday|2 day/gi))) && timeRemaining < 120 && videoDurationEle.innerText != '00:00:00' && resetVid) {
      resetVid = confirm('Reset video?')
      if (resetVid) {
        location.search = '?t=' + currentTimeEle.innerText.replace(':', 'h').replace(':', 'm') + 's'
      }
    }
  }
}
//Open emotes on Double RShift typed
function RShiftEmote(e) {
  if (e.code == "ShiftRight") {
    if (document.querySelector('.bttv-LegacyButton-module__button-zNnkm')) {
      document.querySelector('.bttv-LegacyButton-module__button-zNnkm').click()
    } else {
      document.querySelector('[data-a-target=emote-picker-button]')?.click()
    }
    $("[data-a-target=chat-input]").focus()
    document.removeEventListener('keyup', RShiftEmote)
  }
}
document.addEventListener('load', document.addEventListener('keyup', function (e) {
  if (e.code == "ShiftRight") {
    document.addEventListener('keyup', RShiftEmote)
    setTimeout(function () { document.removeEventListener('keyup', RShiftEmote) }, 2500)
  }
}))
//Open Ext menu on RCtrl
function RControlM(e) {
  if (e.code == "ControlRight") {
    extpopup = $(".extPopup")
    if (extpopup.style.visibility == "visible") {
      extpopup.style.height = "0px"
      extpopup.style.opacity = "0"
      setTimeout(function () {
        extpopup.style.visibility = "hidden"
        $("[data-a-target=chat-input]").focus()
      }, 200);
    } else {
      extpopup.style.visibility = "visible"
      extpopup.style.height = "320px"
      extpopup.style.opacity = "1"
      setTimeout(function () {
        $("#replaceStreamChat").focus()
      }, 200);
      CreateButton()
    }
    document.removeEventListener('keyup', RControlM)
  }
}
document.addEventListener('load', document.addEventListener('keyup', function (e) {
  if (e.code == "ControlRight") {
    document.addEventListener('keyup', RControlM)
    setTimeout(function () { document.removeEventListener('keyup', RControlM) }, 2500)
  }
}))
//skip 15 seconds on click of skip 15
try {
  $('#skip15p').addEventListener('click', function () {
    $('video').currentTime += 15;
  })
} catch (error) {
  setTimeout(function () {
    $('#skip15p').addEventListener('click', function () {
      $('video').currentTime += 15;
    })
  }, 5000)
}

/*setInterval(Countdown, 3000)
function Countdown() {
    if (document.querySelector(".live-time").innerHTML.startsWith("0:55")) {
        alert("5 min")
    }
}*/
function clearingSetInterval(f, t) {
  var self =
    setInterval(
      function () {
        let result = f(self)
        if (result?.match ? +result?.match(/\d*/) >= 200 && +result?.match(/\d*/) < 300 : +result >= 200 && +result < 300) {
          clearInterval(self)
        };
      },
      t
    )
}
$("#apply").addEventListener("click", function () {
  $$("clone").forEach(cloneele => {
    if (!cloneele.attributes.repeating?.nodeValue) {
      clearingSetInterval(function (self) {
        try {
          if (!cloneele.attributes.destroyed) {
            try {
              cloneele.innerHTML = $(cloneele.attributes.e.nodeValue).outerHTML
            } catch (err) {
              alert(err.message)
            }
            cloneele.setAttribute("repeating", self);
          } else {
            clearInterval(self)
          }
        } catch (err) {
          clearInterval(self)
        }
      }, (cloneele.attributes.repeatTime.nodeValue) ? parseInt(cloneele.attributes.repeatTime.nodeValue) : 1000)
    }
  })
})
