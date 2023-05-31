'use strict';
import { $, $$, dateAdd, decryptAES } from "./core.js";
try {
    /**
     * @typedef {{ millisecondsUntil?: number; text: string; alarm: boolean; date?: Date; notification: boolean } | null} DataValueLine
     */
    /**
      * A Box
      * @typedef {HTMLDivElement} Box
      * @property {string | null} [fakeTitleValue]
      * @property {{ title: HTMLInputElement | null | undefined | HTMLElement, timerHrMin: HTMLSpanElement | null | undefined | HTMLElement, timerSec: HTMLSpanElement | null | undefined | HTMLElement, nextUp: HTMLInputElement | null | undefined | HTMLElement, data: HTMLTextAreaElement | null | undefined | HTMLElement, prefix: HTMLInputElement | null | undefined | HTMLElement, localTickTime: HTMLInputElement | null | undefined | HTMLElement, }} specialElements
      * @property {{ title: string, data: string, prefix: string, tickTime: string, }} allData - The year
      * @property {{ dayOfWeek: string | null, date: string | null, }} [settings]
      * @property {DataValueLine[]} values
      * @property {RegExpMatchArray | null} [highlightMatches]
      * @property {string | number} [tickTime]
      * @property {number} [lastCheckTime]
      * @property {number} [currentTick]
      * @property {DataValueLine} [upcomingDate]
      * @property {number} boxIndex
      */
    const MAX_DATE_NUMBER = 8_640_000_000_000_000
    //const MAX_CALUCLATEABLE_DATE = new Date(Date.now() + 2_678_400_000 - 1);
    const MAX_CALUCLATEABLE_DATE = new Date(MAX_DATE_NUMBER - 1);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    /**
     * @type {Box[]}
     */
    const boxes = [...$$('.box')]
    const greaterBox = $('.greater-box')
    const alarmSound = new Audio("https://duckduckgo.com/share/goodie/timer/2001/alarm.mp3")
    // const alarmSound = new Audio("https://cdn.videvo.net/videvo_files/audio/premium/audio0042/watermarked/BellSmall%20PS03_04_2_preview.mp3") 
    const greaterBoxElements = {
        title: $('.greater-title', greaterBox),
        timerHrMin: $('span.timer-hr-min', greaterBox),
        timerSec: $('span.timer-sec', greaterBox),
        nextUp: $('.next-up', greaterBox),
        data: $('.greater-data', greaterBox),
        prefix: $('.greater-prefix', greaterBox),
    };
    const settings = {
        cooldown: +(JSON.parse(localStorage.getItem('settings') ?? '{"cooldown":10}').cooldown ?? '10'),
        highlightColor: (JSON.parse(localStorage.getItem('settings') ?? '{"highlightColor":"yellow"}').highlightColor ?? 'yellow'),
        customClickSound: (JSON.parse(localStorage.getItem('settings') ?? '{"customClickSound":""}').customClickSound ?? ''),
        secondsSize: +(JSON.parse(localStorage.getItem('settings') ?? '{"secondsSize":23}').secondsSize ?? 23)
    };
    const removeCommentsPattern = /\/\/.*|\/\*[^]*?\*\//g;
    /**
     * 
     * @param {'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'} dayOfWeek 
     * @param {number} hours 
     * @param {number} minutes 
     * @param {number} seconds 
     * @param {number} milliseconds 
     * @returns {Date}
     */
    function GetNextDayLocal(dayOfWeek, hours = 8, minutes = 30, seconds = 0, milliseconds = 0) {
        const dayIndex = days?.indexOf(dayOfWeek);
        if (dayIndex === -1) {
            throw new Error('Invalid day of week');
        }
        const d = new Date();
        d.setDate(d.getDate() + (7 + dayIndex - d.getDay()) % 7);
        d.setHours(hours);
        d.setMinutes(minutes);
        d.setSeconds(seconds);
        d.setMilliseconds(milliseconds);
        return d;
    }
    /**
     * 
     * @param {string} string 
     * @returns {Date}
     */
    function StringToDate(string) {
        if (!string) { return new Date() }
        const stingContainsInf = string.match(/\*(-)?Infinity\*/)
        if (stingContainsInf) {
            if (stingContainsInf[1]) {
                return new Date(-MAX_DATE_NUMBER);
            } else {
                return MAX_CALUCLATEABLE_DATE;
            }
        } else if (string.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{1,2}):(\d{2})(:\d{2})?([APap][mM])?/)) {
            const [_, year, month, day, hour, minute, seconds, period] = string.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{1,2}):(\d{2})(:\d{2})?([APap][mM])?/);
            const calhrs = period === undefined ? hour : (hour === '12' ? period.toLowerCase() === 'pm' ? '12' : '0' : period.toLowerCase() === 'pm' ? +hour + 12 : hour);
            return new Date(year, month - 1, day, calhrs, minute, seconds?.replace(':', '') ?? 0);
        } else if (string.match(/^([A-Z][a-z]*) (\d{1,2}):(\d{2})(:\d{2})?([APap][mM])?/)) {
            const [_, dayOfWeek, hour, minute, seconds, period] = string.match(/^(\w+) (\d{1,2}):(\d{2})(:\d{2})?([APap][mM])?/);
            const calhrs = period === undefined ? hour : (hour === '12' ? period.toLowerCase() === 'pm' ? '12' : '0' : period.toLowerCase() === 'pm' ? +hour + 12 : hour);
            let longDayOfWeek;
            switch (dayOfWeek) {
                case 'Su': case 'Sun': longDayOfWeek = 'Sunday'; break;
                case 'M': case 'Mon': longDayOfWeek = 'Monday'; break;
                case 'Tu': case 'Tue': longDayOfWeek = 'Tuesday'; break;
                case 'W': case 'Wed': longDayOfWeek = 'Wednesday'; break;
                case 'Th': case 'Thu': longDayOfWeek = 'Thursday'; break;
                case 'F': case 'Fri': longDayOfWeek = 'Friday'; break;
                case 'Sa': case 'Sat': longDayOfWeek = 'Saturday'; break;
                default: longDayOfWeek = dayOfWeek;
            }
            switch (longDayOfWeek) {
                case 'Sunday':
                case 'Monday':
                case 'Tuesday':
                case 'Wednesday':
                case 'Thursday':
                case 'Friday':
                case 'Saturday':
                    return GetNextDayLocal(longDayOfWeek, calhrs, minute, seconds?.replace(':', '') ?? 0);
                default:
                    throw new Error('Invalid day of week');
            }
        } else {
            throw new Error(`Invalid string format: "${string}"`);
        }
    }
    function LastCheckTimeUpdater(box) {
        const output = Date.now() - box.lastCheckTime;
        box.lastCheckTime = Date.now()
        return output;
    }
    // Import data from a JSON string and update the settings and boxes
    function importData(data) {
        const { settings, boxData: impBoxData } = JSON.parse(data);
        const management_key = localStorage.getItem("management_key")
        localStorage.clear();
        management_key ? localStorage.setItem("management_key", management_key) : void (0)
        for (let i = 0; i < boxes.length; i++) {
            const element = boxes[i];
            $('.title', element).value = "CLEAR"
            element.UpdateBox()
        }
        localStorage.setItem('settings', JSON.stringify(settings));

        Object.entries(settings).forEach(([key, value]) => {
            settings[key] = value;
        });

        Object.entries(impBoxData).forEach(([key, value]) => {
            const box = $('#box-container').children[+key.match(/\d+/)].matches('.box') ? $('#box-container').children[+key.match(/\d+/)] : undefined
            // const box = $(`[data-box="${key}"]`, document.body);

            if (key.startsWith("box-")) {
                localStorage.setItem(key, JSON.stringify(value));
            }

            if (box) {
                const { title = "", data = "", prefix = "", tickTime = "" } = value;
                $('.title', box).value = title;
                $('textarea', box).value = data;
                $('.prefix', box).value = prefix;
                $('.local-tick-time', box).value = tickTime;
                box.UpdateBox();
            }
        });
    }

    // Export data as a JSON string, including settings and box data
    function exportData() {
        const boxData = {};

        for (let i = 0; i < boxes.length; i++) {
            const key = `box-${i}`;
            const item = localStorage.getItem(key);

            if (item !== null) {
                const parsedValue = JSON.parse(item);

                if (parsedValue.title !== "") {
                    boxData[key] = parsedValue;
                }
            }
        }

        return JSON.stringify({
            settings,
            boxData
        });
    }
    /**
     * @author https://developer.mozilla.org/en-US/docs/Web/API/notification
     * @param {string} notificationText
     * @param {{type: "click" | "close" | "error" | "show", listener: ((this: Notification, ev: Event) => any)}[]} addEvents
     */
    function notifyMe(notificationText, addEvents) {
        /** @param {Notification} notification */
        function addEventListeners(notification) {
            if (!addEvents.length) return;
            for (let i = 0; i < addEvents.length; i++) {
                const eventListener = addEvents[i];
                notification.addEventListener(eventListener.type, eventListener.listener)
            }
        }
        if (!("Notification" in window)) {
            // Check if the browser supports notifications
            alert("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
            // Check whether notification permissions have already been granted;
            // if so, create a notification
            const notification = new Notification(notificationText);
            addEventListeners(notification)
        } else if (Notification.permission !== "denied") {
            // We need to ask the user for permission
            Notification.requestPermission().then((permission) => {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    const notification = new Notification(notificationText);
                    addEventListeners(notification)
                }
            });
        }
    }
    const notificationTextRegEx = /\*not(?:ification)? ?\((.*?)\)\*/
    const regNotification = /\*(NOTIFY|NOTIFICATION)\*/i
    const regNotificationOnClick = /\*notC(?:lick)? ?\((.*?)\)\*/
    const regNotificationOpen = /\*notO(?:pen)? ?\((.*?)\)\*/
    /**
     * 
     * @param {string} oldNextUpText 
     * @param {boolean} isNotification
     * @param {{dayOfWeek: string | null, date: string | null,}} boxSettings
     */
    function nextUpConverter(oldNextUpText = "", boxSettings = {dayOfWeek: null, date: null}, isNotification = false) {
        const nextUpText = oldNextUpText.match(/\*dis(?:play)? ?\((.*?)\)\*/);
        let nextUpText2 = nextUpText ? nextUpText[1] : oldNextUpText
        if (!nextUpText && (/^([A-Z][a-z]*) (\d{1,2}):(\d{2})(:\d{2})?([APap][mM])?/.test(nextUpText2) || /^(\d{4})-(\d{2})-(\d{2}) (\d{1,2}):(\d{2})(:\d{2})?([APap][mM])?/.test(nextUpText2))) {
            switch (true) {
                case boxSettings.dayOfWeek === 'hide': case !!nextUpText2.match(/\*(h-dow|h-d)\*/): nextUpText2 = nextUpText2.replace(/^([A-Z][a-z]* )/, "").replace(/\*(h-dow|h-d)\*/, "");
                case boxSettings.dayOfWeek === 'shorten3': case !!nextUpText2.match(/\*(sh3-dow)\*/): nextUpText2 = nextUpText2.replace(/^([A-Z][a-z]*)/, x => x.substring(0, 3)).replace(/\*(sh3-dow)\*/, "");
                case boxSettings.date === 'hide': case !!nextUpText2.match(/\*(h-date|h-d)\*/): nextUpText2 = nextUpText2.replace(/^(\d{4})-(\d{2})-(\d{2}) /, "").replace(/\*(h-date|h-d)\*/, "");
            }
        }
        nextUpText2 = nextUpText2.replace(notificationTextRegEx, '').replace(regNotification, '').replace(regNotificationOnClick, '').replace(regNotificationOpen, '')
        if(isNotification) {
            const notificationText = oldNextUpText.match(notificationTextRegEx)
            nextUpText2 = notificationText ? notificationText[1] : nextUpText2;
        }
        return nextUpText2
    }
    function isJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    const clickSound = new Audio(settings.customClickSound || 'https://cdn.videvo.net/videvo_files/audio/premium/audio0051/watermarked/ButtonSolidCompute%20SE040304_preview.mp3')
    $('button#ie-export').addEventListener('click', _ => {
        console.log(exportData())
        try {
            navigator.clipboard.writeText(exportData())
        } catch (error) {
            $('.import-export-box > .ie-data').value = exportData()
        }
    })
    $('button#ie-import').addEventListener('click', _ => {
        importData($('.import-export-box > .ie-data').value)
    })
    for (let i = 0; i < boxes.length; i++) {
        const box = boxes[i];
        const boxElements = {
            title: $('.title', box),
            timerHrMin: $('span.timer-hr-min', box),
            timerSec: $('span.timer-sec', box),
            nextUp: $('.next-up', box),
            data: $('textarea', box),
            prefix: $('.prefix', box),
            localTickTime: $('.local-tick-time', box),
        }
        box.specialElements = boxElements
    }
    boxes.forEach(/**@param {Box} box */box => {
        const boxIndex = Array.from(box.parentNode.children).indexOf(box)
        const boxStorage = JSON.parse(localStorage.getItem(`box-${boxIndex}`))
        $('button', box).addEventListener('click', _ => {
            if ($('.title', box).value == "REMOVE") { box.remove(); return }
            UpdateBox()
            TimerUpdater(true)
            clickSound.play()
        })
        if (boxStorage) {
            $('.title', box).value = boxStorage.title
            $('textarea', box).value = boxStorage.data
            $('input.prefix', box).value = boxStorage.prefix
            $('.local-tick-time', box).value = boxStorage.tickTime ?? 0
        }


        function UpdateBox() {
            const [title, textarea, prefixInput, tickTimeInput, quickOptionsValue = "none"] = [$('.title', box), $('textarea', box), $('input.prefix', box), $('.local-tick-time', box), $('#quick-options-select')?.value]
            let titleValue = quickOptionsValue === "removeTitle" ? "*NIL*" : quickOptionsValue === "clear" ? "*CLEAR*" : title.value
            console.log(quickOptionsValue, titleValue)
            if (!titleValue && quickOptionsValue === "none") { return }
            switch (titleValue) {
                case "NIL":
                case "*NIL*":
                case "NULL":
                case "*NULL*":
                    [titleValue, title.value] = ["", ""];
                    break;
                case "CLEAR":
                case "*CLEAR*":
                case "RESET":
                case "*RESET*":
                    [titleValue, title.value, textarea.value, prefixInput.value, tickTimeInput.value] = ["", "", "", "", ""]
                    break;
                default:
                    break;
            }
            const replaceText = (match, p1, p2, p3, p4) => {
                let output = new Date();
                if (p1) {
                    switch (p4) {
                        case "s":
                            output = dateAdd(output, "second", p2 === "-" ? -+p3 : +p3);
                            break;
                        case "m":
                            output = dateAdd(output, "minute", p2 === "-" ? -+p3 : +p3);
                            break;
                        case "h":
                            output = dateAdd(output, "hour", p2 === "-" ? -+p3 : +p3);
                            break;
                        case "d":
                            output = dateAdd(output, "day", p2 === "-" ? -+p3 : +p3);
                            break;
                        default:
                            break;
                    }
                }
                return `${output.getFullYear().toString().padStart(2, '0')}-${(output.getMonth() + 1).toString().padStart(2, '0')}-${output.getDate().toString().padStart(2, '0')} ${output.getHours()}:${output.getMinutes().toString().padStart(2, '0')}:${output.getSeconds().toString().padStart(2, '0')}.${output.getMilliseconds().toString().padStart(4, '0')}`;
            };

            textarea.value = textarea.value.replace(/\*now(([+-])(\d+)([smhd]))?\*/g, replaceText);
            const allData = JSON.stringify({
                title: titleValue.replace(/\*COPY\*/, ""),
                data: textarea.value,
                prefix: prefixInput.value,
                tickTime: tickTimeInput.value,
            })
            box.allData = JSON.parse(allData)
            localStorage.setItem(`box-${boxIndex}`, allData)
            function pasteData(pastedData) {
                let parsedPastedData = JSON.parse(pastedData)
                localStorage.setItem(`box-${boxIndex}`, pastedData)
                title.value = parsedPastedData.title
                textarea.value = parsedPastedData.data
                prefixInput.value = parsedPastedData.prefix
                tickTimeInput.value = parsedPastedData.tickTime
                titleValue = parsedPastedData.title
            }
            if (titleValue.match(/\*COPY\*/i) || quickOptionsValue === "copy") {
                try {
                    if (navigator.clipboard /* && globalThis.test != true */) {
                        navigator.clipboard.writeText(allData)
                    } else {
                        textarea.value = allData
                        title.value = '*PASTE*'
                    }
                } catch (error) {
                    console.log(error)
                    textarea.value = allData
                    alert(error)
                }

            } else if (titleValue.match(/\*PASTE\*/i) || titleValue === '.p' || quickOptionsValue === "paste") {
                try {
                    pasteData(textarea.value)
                } catch (error) {
                    console.log(error)
                    alert(`Invalid Paste: ${error}`)
                }
            } else if (quickOptionsValue === "pasteFromImportBox") {
                const ieData = $('.ie-data')
                ieData && pasteData($('.ie-data').value)
            }
            //if (titleValue.match(/\*(h-dow|sh-dow|sh3-dow|h-date|sh-date|h-d|sh-d)\*/i)) {
            box.settings = {
                dayOfWeek: /\*(h-dow|h-d)\*/.test(titleValue) ? "hide" : /\*(sh3-dow)\*/.test(titleValue) ? "shorten3" : /\*(sh-dow|sh-d)\*/.test(titleValue) ? "shorten" : null,
                date: /\*(h-date|h-d)\*/.test(titleValue) ? "hide" : /\*(sh-date|sh-d)\*/.test(titleValue) ? "shorten" : null,
            }
            //}
            let values = []
            textarea.value.replace(removeCommentsPattern, "").split("\n").forEach((item, index) => {
                let itemText = $('.prefix', box).value + item
                let itemDate = StringToDate(itemText)
                values[index] = { text: itemText, date: itemDate, alarm: false, notification: false }
            })
            // console.log(values)
            box.values = values
            const highlightMatches = titleValue.match(/\*(?:(\d+)d)?(\d+)?:(\d+)?(?::(\d+))?(?:\.(\d+))?\*/)
            if (highlightMatches && highlightMatches[0] != ":") {
                box.highlightMatches = highlightMatches
            } else {
                box.highlightMatches = undefined
            }
            box.setAttribute('titleValue', titleValue)
            box.setAttribute('fake-title-value', titleValue.replace(/\*.*?\*/g, ""))
            box.fakeTitleValue = box.getAttribute('fake-title-value')
            box.tickTime = tickTimeInput.value === "" ? 0 : tickTimeInput.value
            box.lastCheckTime = Date.now()
        }
        UpdateBox()
        box.UpdateBox = UpdateBox
    })
    if (location.pathname === "/mtu" || location.pathname === "/mtu/") {
        if (!localStorage.getItem("management_key")) localStorage.setItem("management_key", prompt("Insert your key"))
        try {
            const importedData = decryptAES(String.raw`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`, `${localStorage.getItem("management_key")}+uoHNBzi2MdUF9Nq3CpAvUpW6qMi2ZAm5OvmWJGXGlHnk9TNHsaDILbLibfR9ZU24vbEFvx43aQ8p8DL9JPHmrhaQza5ixsI5wk8yChCyhnfz0BfCpO3cRicvuFUS8bIJ`)
            const parsedImportedData = JSON.parse(importedData)
            if (parsedImportedData.settings && parsedImportedData.boxData) {
                importData(importedData)
            } else {
                throw new Error('Invalid key');
            }
        } catch (error) {
            localStorage.setItem("management_key", prompt("Invalid key: Insert the correct key"))
            location.reload()
        }
    }
    function TimerUpdater(bypassTickTest = false) {
        boxUpdater: for (let i = 0; i < boxes.length; i++) {
            /**
             * @const {Box}
             */
            const box = boxes[i];
            const titleValue = box.getAttribute('titleValue')
            if (!titleValue || titleValue.match(/\*PAUSE\*/i)) { continue boxUpdater; }
            const localTickTime = +box.tickTime;
            if (!(localTickTime === 0 || isNaN(localTickTime))) {
                if (isNaN(box.currentTick)) { box.currentTick = 0; }
                box.currentTick += LastCheckTimeUpdater(box);
                if (bypassTickTest || box.currentTick == null || box.currentTick >= localTickTime) {
                    box.currentTick = box.currentTick % localTickTime;
                } else { continue boxUpdater; }
            }
            box.values?.forEach((item) => {
                item.millisecondsUntil = item.date.getTime() - Date.now();
            })
            let upcomingDate = null;
            for (let i2 = 0; i2 < box.values.length; i2++) {
                const value = box.values[i2];
                if (value.millisecondsUntil >= 0) {
                    if (upcomingDate == null || value.millisecondsUntil < upcomingDate.millisecondsUntil) {
                        upcomingDate = value;
                    }
                } else {
                    const regAlarm = /\*ALARM\*/i;
                    if(bypassTickTest === true){
                        value.alarm = true;
                        value.notification = true;
                    }
                    if ((titleValue.match(regAlarm) || value.text.match(regAlarm)) && value.alarm === false && bypassTickTest === false) {
                        alarmSound.play().catch(err => { console.error(err) })
                        value.alarm = true
                        console.log(value.alarm)
                    }
                    if ((titleValue.match(regNotification) || value.text.match(regNotification) || value.text.match(notificationTextRegEx)) && value.notification === false && bypassTickTest === false) {
                        const valueNotificationOnClickProto = (value.text.match(regNotificationOnClick) ?? ['',''])[1].replace(/\\([^])/, '$1') || `window.open('${(value.text.match(regNotificationOpen) ?? ['', ''])[1].replace('\\/', '/')}', '_blank')`;
                        console.log(valueNotificationOnClickProto)
                        const valueNotificationOnClick = valueNotificationOnClickProto == null ? '' : valueNotificationOnClickProto
                        notifyMe(nextUpConverter(value.text, undefined, true), [{type: "click", listener: Function('ev', valueNotificationOnClick)}])
                        value.notification = true
                        console.log(value.notification, value.text)
                    }
                }

            }
            box.upcomingDate = upcomingDate;
            if (box.upcomingDate) {
                if (box.upcomingDate.date?.getTime() === MAX_CALUCLATEABLE_DATE.getTime()) {
                    box.specialElements.timerHrMin.innerText = "Infinity";
                    box.specialElements.timerSec.innerText = "Infinity";
                } else {
                    const timeKeeper = new Date(box.upcomingDate.millisecondsUntil)
                    const timeKeeperString = timeKeeper.toISOString()
                    const hours = (((+timeKeeperString.slice(8, 10) - 1) * 24) + timeKeeper.getUTCHours()).toString().padStart(2, '0');
                    if (box.highlightMatches) {
                        const [hMatches, hDays = 0, hHours = 0, hMinutes = 0, hSeconds = 0, hMilliseconds = 0] = box.highlightMatches
                        if (((+hDays * 86400000) + (+hHours * 3600000) + (+hMinutes * 60000) + (+hSeconds * 1000) + +hMilliseconds) >= box.upcomingDate.millisecondsUntil) {
                            box.classList.add('box-highlight');
                        } else {
                            box.classList.remove('box-highlight');
                        }
                    } else { box.classList.remove('box-highlight'); }
                    box.specialElements.timerHrMin.innerText = hours + ':' + timeKeeper.getUTCMinutes().toString().padStart(2, '0');
                    box.specialElements.timerSec.innerText = timeKeeperString.slice(17, settings.secondsSize);
                }
                box.specialElements.nextUp.innerHTML = nextUpConverter(box.upcomingDate.text, box.settings);
            } else {
                box.specialElements.timerHrMin.innerText = "00:00";
                box.specialElements.timerSec.innerText = "00.000";
                box.specialElements.nextUp.innerHTML = '<span onmousedown="alert(`All upcoming dates have elapsed`)" ontouchstart>undefined</span>';
                box.classList.remove('box-highlight');
            }
        }
        const defaultBox = $('.box[fake-title-value="Default"]');
        const highlightedBox = $('.box-highlight');
        const selectedBox = highlightedBox ?? defaultBox;
        if (selectedBox) {
            greaterBox.style.display = 'block';
            greaterBoxElements.title.innerText = selectedBox.fakeTitleValue;
            // greaterBoxElements.title.innerText = selectedBox.specialElements.title?.value;
            greaterBoxElements.timerHrMin.innerText = selectedBox.specialElements.timerHrMin?.innerText;
            greaterBoxElements.timerSec.innerText = selectedBox.specialElements.timerSec?.innerText;
            greaterBoxElements.nextUp.innerText = selectedBox.specialElements.nextUp?.innerText;
            greaterBoxElements.data.innerText = selectedBox?.allData?.data;
            greaterBoxElements.prefix.innerText = selectedBox?.allData?.prefix || 'No Prefix';
        } else {
            greaterBox.style.display = 'none';
        }
    }
    const timerUpdaterId = setInterval(TimerUpdater, settings.cooldown)
    TimerUpdater(true)
    document.addEventListener('click', e => {
        if (e.target.matches('#deactivate')) {
            clickSound.play()
            if (confirm("WARNING: This will make this page unavailable until this site is reload. Confirm?")) {
                clearInterval(timerUpdaterId)
                document.body.remove()
                document.head.remove()
            }
        }
        if (e.target.matches('.settings-box-update')) {
            localStorage.setItem('settings', JSON.stringify({
                cooldown: $('.settings-box .cooldown').value || '10',
                secondsSize: +$('.settings-box .seconds-size').value + 19 || 23,
                highlightColor: $('.settings-box .highlight-color').value || 'yellow',
                customClickSound: $('.settings-box .custom-click-sound').value || '',
            }))
            clickSound.play()
            location.reload()
        }
    })
    $('.settings-box .cooldown').value = settings.cooldown
    $('.settings-box .seconds-size').value = settings.secondsSize - 19
    $('.settings-box .highlight-color').value = settings.highlightColor
    $('.settings-box .custom-click-sound').value = settings.customClickSound
    document.documentElement.style.setProperty("--highlight-color", settings.highlightColor)
} catch (err) { window.err = err; alert(err); console.error(err) }