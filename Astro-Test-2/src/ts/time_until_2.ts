'use strict';
import { $, $$, dateAdd, decryptAES } from "./core.ts";

try {
    interface DataValueLine {
        millisecondsUntil?: number;
        text: string;
        alarm: boolean;
        date?: Date;
    }

    /**
     * A Box element.
     */
    interface Box extends HTMLDivElement {
        fakeTitleValue?: string;
        specialElements: {
            title: HTMLInputElement | null | undefined | HTMLElement;
            timerHrMin: HTMLSpanElement | null | undefined | HTMLElement;
            timerSec: HTMLSpanElement | null | undefined | HTMLElement;
            nextUp: HTMLInputElement | null | undefined | HTMLElement;
            data: HTMLTextAreaElement | null | undefined | HTMLElement;
            prefix: HTMLInputElement | null | undefined | HTMLElement;
            localTickTime: HTMLInputElement | null | undefined | HTMLElement;
        };
        allData: {
            title: string;
            data: string;
            prefix: string;
            tickTime: string;
        };
        settings?: {
            dayOfWeek: string | null;
            date: string | null;
        };
        values: DataValueLine[];
        highlightMatches?: RegExpMatchArray | null;
        tickTime?: string | number;
        lastCheckTime?: number;
        currentTick?: number;
        upcomingDate?: DataValueLine;
        boxIndex: number;
        UpdateBox: Function;
    }
    const MAX_DATE_NUMBER = 8_640_000_000_000_000;
    const MAX_CALUCLATEABLE_DATE = new Date(Date.now() + 2_678_400_000 - 1);
    const days: Array<'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'> = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];
    /**
     * @type {Box[]}
     */
    const boxes: Box[] = [...$$('.box')] as Box[];
    const greaterBox = $('.greater-box') as HTMLDivElement;
    const alarmSound = new Audio("https://duckduckgo.com/share/goodie/timer/2001/alarm.mp3");
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
     * @param {Date} date 
     * @returns {number}
     */
    function GetNextDayLocal(dayOfWeek: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday', hours = 8, minutes = 30, seconds = 0, milliseconds = 0): Date {
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
    function StringToDate(string: string): Date {
        if (!string) {
            return new Date();
        }
        const stingContainsInf = string.match(/\*(-)?Infinity\*/);
        if (stingContainsInf) {
            if (stingContainsInf[1]) {
                return new Date(-MAX_DATE_NUMBER);
            } else {
                return MAX_CALUCLATEABLE_DATE;
            }
        } else if (string.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{1,2}):(\d{2})(:\d{2})?([APap][mM])?/)) {
            const match = string.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{1,2}):(\d{2})(:\d{2})?([APap][mM])?/);
            if (match === null) {
                throw new Error('Invalid date string');
            }
            const [_, year, month, day, hour, minute, seconds, period] = match;
            const calhrs = period === undefined ? hour : (hour === '12' ? period.toLowerCase() === 'pm' ? '12' : '0' : period.toLowerCase() === 'pm' ? +hour + 12 : hour);
            return new Date(+year, +month - 1, +day, +calhrs, +minute, seconds?.replace(':', '') ? +seconds.replace(':', '') : 0);
        } else if (string.match(/^([A-Z][a-z]*) (\d{1,2}):(\d{2})(:\d{2})?([APap][mM])?/)) {
            const match = string.match(/^(\w+) (\d{1,2}):(\d{2})(:\d{2})?([APap][mM])?/);
            if (match === null) {
                throw new Error('Invalid date string');
            }
            const [_, dayOfWeek, hour, minute, seconds, period] = match
            const calhrs = period === undefined ? hour : (hour === '12' ? period.toLowerCase() === 'pm' ? '12' : '0' : period.toLowerCase() === 'pm' ? +hour + 12 : hour);
            let longDayOfWeek: string;
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
                    return GetNextDayLocal(longDayOfWeek, +calhrs, +minute, +(seconds?.replace(':', '') ?? 0));
                default:
                    throw new Error('Invalid day of week');
            }
        } else {
            throw new Error(`Invalid string format: "${string}"`);
        }
    }
    function LastCheckTimeUpdater(box: Box) {
        const output = Date.now() - (box?.lastCheckTime ?? 0);
        box.lastCheckTime = Date.now()
        return output;
    }
    // Import data from a JSON string and update the settings and boxes
    function importData(data: string) {
        const { settings, boxData: impBoxData } = JSON.parse(data);
        const management_key = localStorage.getItem("management_key")
        localStorage.clear();
        management_key ? localStorage.setItem("management_key", management_key) : void (0)
        for (let i = 0; i < boxes.length; i++) {
            const element = boxes[i];
            const title = $<HTMLInputElement>('.title', element)
            title ? title.value = "CLEAR" : 0
            element.UpdateBox()
        }
        localStorage.setItem('settings', JSON.stringify(settings));

        Object.entries(settings).forEach(([key, value]) => {
            settings[key] = value;
        });

        Object.entries(impBoxData).forEach(([key, value]: [string, any]) => {
            const boxContainer = $('#box-container')
            const box: Box | undefined = boxContainer?.children[+(key.match(/\d+/) ?? 0)]?.matches('.box') ? $('#box-container')?.children[+(key.match(/\d+/) ?? 0)] as Box : undefined
            // const box = $(`[data-box="${key}"]`, document.body);

            if (key.startsWith("box-")) {
                localStorage.setItem(key, JSON.stringify(value));
            }

            if (box) {
                const { title = "", data = "", prefix = "", tickTime = "" } = value;
                ($('.title', box) as HTMLInputElement).value = title;
                ($('textarea', box) as HTMLTextAreaElement).value = data;
                ($('.prefix', box) as HTMLInputElement).value = prefix;
                ($('.local-tick-time', box) as HTMLInputElement).value = tickTime;
                box.UpdateBox();
            }
        });
    }

    // Export data as a JSON string, including settings and box data
    function exportData() {
        const boxData: any = {};

        for (let i = 0; i < boxes.length; i++) {
            const key = `box-${i + 1}`;
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

    const clickSound = new Audio(settings.customClickSound || 'https://cdn.videvo.net/videvo_files/audio/premium/audio0051/watermarked/ButtonSolidCompute%20SE040304_preview.mp3')
    $('button#ie-export')?.addEventListener('click', _ => {
        console.log(exportData())
        try {
            navigator.clipboard.writeText(exportData())
        } catch (error) {
            const ieData = $<HTMLTextAreaElement>('.import-export-box > .ie-data')
            ieData ? ieData.value = exportData() : void (0)
        }
    })
    $('button#ie-import')?.addEventListener('click', _ => {
        importData($<HTMLTextAreaElement>('.import-export-box > .ie-data')?.value as string)
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
        const boxIndex = Array.from(box.parentNode?.children as HTMLCollection).indexOf(box)
        const boxStorage = JSON.parse(localStorage.getItem(`box-${boxIndex}`) as string)
        $('button', box)?.addEventListener('click', _ => {
            if ($<HTMLInputElement>('.title', box)?.value == "REMOVE") { box.remove(); return }
            UpdateBox()
            TimerUpdater(true)
            clickSound.play()
        })
        if (boxStorage) {
            ($('.title', box) as HTMLInputElement).value = boxStorage.title;
            ($('textarea', box) as HTMLTextAreaElement).value = boxStorage.data;
            ($('input.prefix', box) as HTMLInputElement).value = boxStorage.prefix;
            ($('.local-tick-time', box) as HTMLInputElement).value = boxStorage.tickTime ?? 0;
        }


        function UpdateBox() {
            const [title, textarea, prefixInput, tickTimeInput, quickOptionsValue = "none"] = [$('.title', box) as HTMLInputElement, $('textarea', box) as HTMLTextAreaElement, $('input.prefix', box) as HTMLInputElement, $('.local-tick-time', box) as HTMLInputElement, ($('#quick-options-select') as HTMLSelectElement)?.value]
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
            const replaceText = (match: any, p1: any, p2: string, p3: string | number, p4: any) => {
                let output: Date | undefined = new Date();
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
                return `${output?.getFullYear().toString().padStart(2, '0')}-${((output?.getMonth() ?? 0) + 1).toString().padStart(2, '0')}-${output?.getDate().toString().padStart(2, '0')} ${output?.getHours()}:${output?.getMinutes().toString().padStart(2, '0')}:${output?.getSeconds().toString().padStart(2, '0')}.${output?.getMilliseconds().toString().padStart(4, '0')}`;
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
            function pasteData(pastedData: string) {
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
                ieData && pasteData(($('.ie-data') as HTMLTextAreaElement)?.value)
            }
            //if (titleValue.match(/\*(h-dow|sh-dow|sh3-dow|h-date|sh-date|h-d|sh-d)\*/i)) {
            console.log(/\*(h-date|h-d)\*/.test(titleValue) ? "hide" : /\*(sh-date|sh-d)\*/.test(titleValue) ? "shorten" : null, titleValue)
            box.settings = {
                dayOfWeek: /\*(h-dow|h-d)\*/.test(titleValue) ? "hide" : /\*(sh3-dow)\*/.test(titleValue) ? "shorten3" : /\*(sh-dow|sh-d)\*/.test(titleValue) ? "shorten" : null,
                date: /\*(h-date|h-d)\*/.test(titleValue) ? "hide" : /\*(sh-date|sh-d)\*/.test(titleValue) ? "shorten" : null,
            }
            //}
            let values: DataValueLine[] = []
            textarea.value.replace(removeCommentsPattern, "").split("\n").forEach((item: string, index: number) => {
                let itemText = $<HTMLInputElement>('.prefix', box)?.value + item
                let itemDate = StringToDate(itemText)
                values[index] = { text: itemText, date: itemDate, alarm: false }
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
            box.fakeTitleValue = box.getAttribute('fake-title-value') ?? undefined
            box.tickTime = tickTimeInput.value === "" ? 0 : tickTimeInput.value
            box.lastCheckTime = Date.now()
        }
        UpdateBox()
        box.UpdateBox = UpdateBox
    })
    if (location.pathname === "/mtu") {
        if (!localStorage.getItem("management_key")) localStorage.setItem("management_key", prompt("Insert your key") ?? "")
        try {
            const importedData = decryptAES(String.raw`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`, `${localStorage.getItem("management_key")}+uoHNBzi2MdUF9Nq3CpAvUpW6qMi2ZAm5OvmWJGXGlHnk9TNHsaDILbLibfR9ZU24vbEFvx43aQ8p8DL9JPHmrhaQza5ixsI5wk8yChCyhnfz0BfCpO3cRicvuFUS8bIJ`)
            const parsedImportedData = JSON.parse(importedData)
            if (parsedImportedData.settings && parsedImportedData.boxData) {
                importData(importedData)
            } else {
                throw new Error('Invalid key');
            }
        } catch (error) {
            localStorage.setItem("management_key", prompt("Invalid key: Insert the correct key") ?? "")
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
            const localTickTime = +(box.tickTime ?? 0);
            if (!(localTickTime === 0 || isNaN(localTickTime))) {
                if (isNaN(box.currentTick ?? NaN)) { box.currentTick = 0; }
                (box.currentTick as number) += LastCheckTimeUpdater(box);
                if (bypassTickTest || box.currentTick == null || box.currentTick >= localTickTime) {
                    box.currentTick = (box.currentTick as number) % localTickTime;
                } else { continue boxUpdater; }
            }
            box.values?.forEach((item) => {
                item.millisecondsUntil = (item.date?.getTime() ?? 0) - Date.now();
            })
            let upcomingDate = null;
            for (let i2 = 0; i2 < box.values.length; i2++) {
                const value = box.values[i2];
                if ((value.millisecondsUntil as number) >= 0) {
                    if (upcomingDate == null || (value.millisecondsUntil as number) < (value.millisecondsUntil as number)) {
                        upcomingDate = value;
                    }
                } else if ((titleValue.match(/\*ALARM\*/i) || value.text.match(/\*ALARM\*/i)) && value.alarm === false && bypassTickTest === false) {
                    alarmSound.play().catch(err => { console.error(err) })
                    value.alarm = true
                    console.log(value.alarm)
                }
            }
            box.upcomingDate = upcomingDate ?? undefined;
            if (box.upcomingDate) {
                const timeKeeper = new Date(box.upcomingDate.millisecondsUntil ?? 0)
                const timeKeeperString = timeKeeper.toISOString()
                const hours = (((+timeKeeperString.slice(8, 10) - 1) * 24) + timeKeeper.getUTCHours()).toString().padStart(2, '0');
                if (box.highlightMatches) {
                    const [hMatches, hDays = 0, hHours = 0, hMinutes = 0, hSeconds = 0, hMilliseconds = 0] = box.highlightMatches
                    if (((+hDays * 86400000) + (+hHours * 3600000) + (+hMinutes * 60000) + (+hSeconds * 1000) + +hMilliseconds) >= (box.upcomingDate.millisecondsUntil ?? Infinity)) {
                        box.classList.add('box-highlight');
                    } else {
                        box.classList.remove('box-highlight');
                    }
                } else { box.classList.remove('box-highlight'); }
                (box.specialElements.timerHrMin ?? { innerText: "" }).innerText = hours + ':' + timeKeeper.getUTCMinutes().toString().padStart(2, '0');
                (box.specialElements.timerSec ?? { innerText: "" }).innerText = timeKeeperString.slice(17, settings.secondsSize);
                const nextUpText = box.upcomingDate.text.match(/\*dis(?:play)? ?\((.*?)\)\*/);
                let nextUpText2 = nextUpText ? nextUpText[1] : box.upcomingDate.text
                switch (true) {
                    case box.settings?.dayOfWeek === 'hide': case !!nextUpText2.match(/\*(h-dow|h-d)\*/): nextUpText2 = nextUpText2.replace(/^([A-Z][a-z]* )/, "").replace(/\*(h-dow|h-d)\*/, "");
                    case box.settings?.dayOfWeek === 'shorten3': case !!nextUpText2.match(/\*(sh3-dow)\*/): nextUpText2 = nextUpText2.replace(/^([A-Z][a-z]*)/, x => x.substring(0, 3)).replace(/\*(sh3-dow)\*/, "");
                    case box.settings?.date === 'hide': case !!nextUpText2.match(/\*(h-date|h-d)\*/): nextUpText2 = nextUpText2.replace(/^(\d{4})-(\d{2})-(\d{2}) /, "").replace(/\*(h-date|h-d)\*/, "");
                }
                
                box.specialElements.nextUp ? box.specialElements.nextUp.innerHTML = nextUpText2 : void (0);
            } else {
                box.specialElements.timerHrMin ? box.specialElements.timerHrMin.innerText = "00:00" : void (0);
                box.specialElements.timerSec ? box.specialElements.timerSec.innerText = "00.000" : void (0);
                box.specialElements.nextUp ? box.specialElements.nextUp.innerHTML = '<span onmousedown="alert(`All upcoming dates have elapsed`)" ontouchstart>undefined</span>' : void (0);
                box.classList.remove('box-highlight');
            }
        }
        const defaultBox = $('.box[fake-title-value="Default"]');
        const highlightedBox = $('.box-highlight');
        const selectedBox: Box = (highlightedBox ?? defaultBox) as Box;
        if (selectedBox) {
            greaterBox.style.display = 'block';
            (greaterBoxElements.title as HTMLElement).innerText = selectedBox.fakeTitleValue || "";
            // greaterBoxElements.title.innerText = selectedBox.specialElements.title?.value;
            (greaterBoxElements.timerHrMin as HTMLElement).innerText = selectedBox.specialElements.timerHrMin?.innerText || "00:00";
            (greaterBoxElements.timerSec as HTMLElement).innerText = selectedBox.specialElements.timerSec?.innerText || "00.000";
            (greaterBoxElements.nextUp as HTMLElement).innerText = selectedBox.specialElements.nextUp?.innerText || "";
            (greaterBoxElements.data as HTMLElement).innerText = selectedBox?.allData?.data;
            (greaterBoxElements.prefix as HTMLElement).innerText = selectedBox?.allData?.prefix || 'No Prefix';
        } else {
            greaterBox.style.display = 'none';
        }
    }
    const timerUpdaterId = setInterval(TimerUpdater, settings.cooldown)
    TimerUpdater(true)
    document.addEventListener('click', e => {
        if ((e.target as HTMLElement)?.matches('#deactivate')) {
            clickSound.play()
            if (confirm("WARNING: This will make this page unavailable until this site is reload. Confirm?")) {
                clearInterval(timerUpdaterId)
                document.body.remove()
                document.head.remove()
            }
        }
        if ((e.target as HTMLElement)?.matches('.settings-box-update')) {
            localStorage.setItem('settings', JSON.stringify({
                cooldown: $<HTMLInputElement>('.settings-box .cooldown')?.value || '10',
                secondsSize: +($<HTMLInputElement>('.settings-box .seconds-size')?.value ?? 0) + 19 || 23,
                highlightColor: $<HTMLInputElement>('.settings-box .highlight-color')?.value || 'yellow',
                customClickSound: $<HTMLInputElement>('.settings-box .custom-click-sound')?.value || '',
            }))
            clickSound.play()
            location.reload()
        }
    })
    const cooldown = $<HTMLInputElement>('.settings-box .cooldown')
    const secondsSize = $<HTMLInputElement>('.settings-box .seconds-size')
    const highlightColor = $<HTMLInputElement>('.settings-box .highlight-color')
    const customClickSound = $<HTMLInputElement>('.settings-box .custom-click-sound')
    cooldown ? cooldown.value = (settings.cooldown).toString() : void (0)
    secondsSize ? secondsSize.value = (settings.secondsSize - 19).toString() : void (0)
    highlightColor ? highlightColor.value = settings.highlightColor : void (0)
    customClickSound ? customClickSound.value = settings.customClickSound : void (0)
    document.documentElement.style.setProperty("--highlight-color", settings.highlightColor)
} catch (err) { (window as any).err = err; alert(err); console.error(err) }