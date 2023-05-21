'use strict';
import { $, $$, dateAdd } from "./core";

const MAX_DATE_NUMBER = 8_640_000_000_000_000;
const MAX_CALUCLATEABLE_DATE = new Date(Date.now() + 2_678_400_000 - 1);
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function GetNextDayLocal(dayOfWeek: string, hours = 8, minutes = 30, seconds = 0, milliseconds = 0): Date {
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
                return GetNextDayLocal(longDayOfWeek, +calhrs, +minute, seconds?.replace(':', '') ? +seconds.replace(':', '') : 0);
            default:
                throw new Error('Invalid day of week');
        }
    } else {
        throw new Error(`Invalid string format: "${string}"`);
    }
}
interface Box extends HTMLDivElement {
    fakeTitleValue?: string | null
    specialElements: {
        title: HTMLInputElement | null | undefined | HTMLElement,
        timerHrMin: HTMLSpanElement | null | undefined | HTMLElement,
        timerSec: HTMLSpanElement | null | undefined | HTMLElement,
        nextUp: HTMLInputElement | null | undefined | HTMLElement,
        data: HTMLTextAreaElement | null | undefined | HTMLElement,
        prefix: HTMLInputElement | null | undefined | HTMLElement,
        localTickTime: HTMLInputElement | null | undefined | HTMLElement,
    }
    allData: {
        title: string,
        data: string,
        prefix: string,
        tickTime: string,
    }
    settings?: {
        dayOfWeek: string | null,
        date: string| null,
    }
    values:DataValueLine[]
    highlightMatches?: RegExpMatchArray | null
    tickTime?: string | number
    lastCheckTime?: number
    currentTick?: number
    upcomingDate?: { millisecondsUntil: number | undefined, text: string, alarm: boolean } | null
    boxIndex: number
}
type DataValueLine = {
    millisecondsUntil: number | undefined;
    text: string;
    alarm: boolean;
    date?: Date
  } | null;  
class Box extends HTMLDivElement {
    constructor(element: HTMLDivElement) {
        super();
        Object.assign(this, element);
        this.specialElements = {
            title: $('.title', element) as HTMLInputElement,
            timerHrMin: $('span.timer-hr-min', element) as HTMLSpanElement,
            timerSec: $('span.timer-sec', element) as HTMLSpanElement,
            nextUp: $('.next-up', element) as HTMLInputElement,
            data: $('textarea', element) as HTMLTextAreaElement,
            prefix: $('.prefix', element) as HTMLInputElement,
            localTickTime: $('.local-tick-time', element) as HTMLInputElement,
        }
        this.boxIndex = this.parentNode !== null ? Array.from(this.parentNode.children).indexOf(this) : -1;
    }
    get box() {
        return this
    }
    UpdateBox() {
        const [title, textarea, prefixInput, tickTimeInput, quickOptionsValue = "none"] = [$('.title', this) as HTMLInputElement, $('textarea', this) as HTMLTextAreaElement, $('input.prefix', this) as HTMLInputElement, $('.local-tick-time', this) as HTMLInputElement, ($('#quick-options-select') as HTMLSelectElement)?.value]
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
        const replaceText = (_: string, p1: string, p2: string, p3: string, p4: string) => {
            let output = new Date();
            if (p1) {
                switch (p4) {
                    case "s":
                        output = dateAdd(output, "second", p2 === "-" ? -+p3 : +p3) ?? new Date(0);
                        break;
                    case "m":
                        output = dateAdd(output, "minute", p2 === "-" ? -+p3 : +p3) ?? new Date(0);
                        break;
                    case "h":
                        output = dateAdd(output, "hour", p2 === "-" ? -+p3 : +p3) ?? new Date(0);
                        break;
                    case "d":
                        output = dateAdd(output, "day", p2 === "-" ? -+p3 : +p3) ?? new Date(0);
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
        this.allData = JSON.parse(allData)
        localStorage.setItem(`box-${this.boxIndex}`, allData)
        function pasteData(this: any, pastedData: string) {
            let parsedPastedData = JSON.parse(pastedData)
            localStorage.setItem(`box-${this.boxIndex}`, pastedData)
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
        this.settings = {
            dayOfWeek: /\*(h-dow|h-d)\*/.test(titleValue) ? "hide" : /\*(sh3-dow)\*/.test(titleValue) ? "shorten3" : /\*(sh-dow|sh-d)\*/.test(titleValue) ? "shorten" : null,
            date: /\*(h-date|h-d)\*/.test(titleValue) ? "hide" : /\*(sh-date|sh-d)\*/.test(titleValue) ? "shorten" : null,
        }
        //}
        let values: DataValueLine[] = [];
        textarea.value.replace(removeCommentsPattern, "").split("\n").forEach((item, index) => {
            let itemText = ($('.prefix', this) as HTMLInputElement)?.value + item
            let itemDate = StringToDate(itemText)
            values[index] = { text: itemText, date: itemDate, alarm: false, millisecondsUntil: undefined }
        })
        // console.log(values)
        this.values = values
        const highlightMatches = titleValue.match(/\*(?:(\d+)d)?(\d+)?:(\d+)?(?::(\d+))?(?:\.(\d+))?\*/)
        if (highlightMatches && highlightMatches[0] != ":") {
            this.highlightMatches = highlightMatches
        } else {
            this.highlightMatches = null
        }
        this.setAttribute('titleValue', titleValue)
        this.setAttribute('fake-title-value', titleValue.replace(/\*.*?\*/g, ""))
        this.fakeTitleValue = this.getAttribute('fake-title-value')
        this.tickTime = tickTimeInput.value === "" ? 0 : tickTimeInput.value
        this.lastCheckTime = Date.now()
    }
}
const boxes = [...$$('.box')].map(x=>new Box(x as HTMLDivElement));
const greaterBox = $('.greater-box') as HTMLDivElement;
const alarmSound = new Audio("https://duckduckgo.com/share/goodie/timer/2001/alarm.mp3");
// const alarmSound = new Audio("https://cdn.videvo.net/videvo_files/audio/premium/audio0042/watermarked/BellSmall%20PS03_04_2_preview.mp3") 

const greaterBoxElements = {
    title: $('.greater-title', greaterBox) as HTMLSpanElement,
    timerHrMin: $('span.timer-hr-min', greaterBox) as HTMLDivElement,
    timerSec: $('span.timer-sec', greaterBox) as HTMLDivElement,
    nextUp: $('.next-up', greaterBox) as HTMLDivElement,
    data: $('.greater-data', greaterBox) as HTMLDivElement,
    prefix: $('.greater-prefix', greaterBox) as HTMLDivElement,
};

const settings = {
    cooldown: +(JSON.parse(localStorage.getItem('settings') ?? '{"cooldown":10}').cooldown ?? '10'),
    highlightColor: (JSON.parse(localStorage.getItem('settings') ?? '{"highlightColor":"yellow"}').highlightColor ?? 'yellow'),
    customClickSound: (JSON.parse(localStorage.getItem('settings') ?? '{"customClickSound":""}').customClickSound ?? ''),
    secondsSize: +(JSON.parse(localStorage.getItem('settings') ?? '{"secondsSize":23}').secondsSize ?? 23),
};

const removeCommentsPattern = /\/\/.*|\/\*[^]*?\*\//g;

try {
    function LastCheckTimeUpdater(box: Box) {
        const output = Date.now() - (box.lastCheckTime ?? 0);
        box.lastCheckTime = Date.now()
        return output;
    }
    // Import data from a JSON string and update the settings and boxes
    function importData(data: string) {
        const { settings, boxData: impBoxData } = JSON.parse(data);
        console.log(settings, impBoxData);

        localStorage.clear();
        for (let i = 0; i < boxes.length; i++) {
            const element = boxes[i];
            ($('.title', element as HTMLDivElement) as HTMLInputElement).value = "CLEAR";
            element.UpdateBox();
        }
        localStorage.setItem('settings', JSON.stringify(settings));

        Object.entries(settings).forEach(([key, value]) => {
            settings[key] = value;
        });

        Object.entries(impBoxData).forEach(([key, value]) => {
            const matchResult = key.match(/\d+/);
            const digits = matchResult ? +matchResult[0] : NaN;
            const box:Box|undefined = document.body.children[digits]?.matches('.box') ? document.body.children[digits] as Box : undefined;

            if (key.startsWith("box-")) {
                localStorage.setItem(key, JSON.stringify(value));
            }

            if (box !== undefined) {
                const { title = "", data = "", prefix = "", tickTime = "" } = value as { title: string, data: string, prefix: string, tickTime: string };
                ($('.title', box as HTMLDivElement) as HTMLInputElement).value = title;
                ($('textarea', box as HTMLDivElement) as HTMLTextAreaElement).value = data;
                ($('.prefix', box as HTMLDivElement) as HTMLInputElement).value = prefix;
                ($('.local-tick-time', box as HTMLDivElement) as HTMLInputElement).value = tickTime;
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
    $<HTMLButtonElement>('button#ie-export')?.addEventListener('click', _ => {
        console.log(exportData())
        try {
            navigator.clipboard.writeText(exportData())
        } catch (error) {
            ($('.import-export-box > .ie-data') as HTMLTextAreaElement).value = exportData()
        }
    })
    $<HTMLButtonElement>('button#ie-import')?.addEventListener('click', _ => {
        importData(($('.import-export-box > .ie-data') as HTMLTextAreaElement).value)
    })
    for (let i = 0; i < boxes.length; i++) {
        const box = boxes[i];
        const boxElements = {
            title: $('.title', box) as HTMLElement,
            timerHrMin: $('span.timer-hr-min', box) as HTMLElement,
            timerSec: $('span.timer-sec', box) as HTMLElement,
            nextUp: $('.next-up', box) as HTMLElement,
            data: $('textarea', box) as HTMLElement,
            prefix: $('.prefix', box) as HTMLElement,
            localTickTime: $('.local-tick-time', box) as HTMLElement,
        }
        box.specialElements = boxElements
    }
    boxes.forEach(box => {
        const parentNode = box.parentNode;
        const boxIndex = parentNode !== null ? Array.from(parentNode.children).indexOf(box) : -1;
        const boxStorage = JSON.parse(localStorage.getItem(`box-${boxIndex}`) ?? "")
        $<HTMLButtonElement>('button', box)?.addEventListener('click', _ => {
            if (($('.title', box) as HTMLInputElement)?.value == "REMOVE") { box.remove(); return }
            box.UpdateBox()
            TimerUpdater(true)
            clickSound.play()
        })
        if (boxStorage) {
            ($('.title', box) as HTMLInputElement).value = boxStorage.title
                ($('textarea', box) as HTMLTextAreaElement).value = boxStorage.data
                    ($('input.prefix', box) as HTMLInputElement).value = boxStorage.prefix
                        ($('.local-tick-time', box) as HTMLInputElement).value = boxStorage.tickTime ?? 0
        }
        box.UpdateBox()
    })
    if (location.pathname === "/mtu/") importData(String.raw`{"settings":{"cooldown":10,"highlightColor":"yellow","customClickSound":"","secondsSize":23},"boxData":{"box-1":{"title":"Default","data":"Monday 8:30AM 1\nMonday 9:26AM /1\nMonday 9:34AM 2\nMonday 10:30AM /2\nMonday 10:38AM 3\nMonday 11:34AM /3\nMonday 11:42AM 4\nMonday 12:42PM /4 | Lunch\nMonday 1:22PM /L\nMonday 1:30PM 5\nMonday 2:26PM /5\nMonday 2:34PM 6\nMonday 3:30PM /6\nTuesday 8:30AM 1\nTuesday 9:26AM /1\nTuesday 9:34AM 2\nTuesday 10:30AM /2\nTuesday 10:38AM 3\nTuesday 11:34AM /3\nTuesday 11:42AM 4\nTuesday 12:42PM /4 | Lunch\nTuesday 1:22PM /L\nTuesday 1:30PM 5\nTuesday 2:26PM /5\nTuesday 2:34PM 6\nTuesday 3:30PM /6\nWednesday 9:30AM 1\nWednesday 10:08AM /1\nWednesday 10:16AM 2\nWednesday 10:54AM /2\nWednesday 11:02AM 3\nWednesday 11:40AM /3\nWednesday 11:48AM HR\nWednesday 12:32PM /HR\nWednesday 12:40PM 4\nWednesday 1:18PM /4 | Lunch\nWednesday 1:58PM /L\nWednesday 2:06PM 5\nWednesday 2:44PM /5\nWednesday 2:52PM 6\nWednesday 3:30PM /6\nThursday 8:30AM 1\nThursday 9:26AM /1\nThursday 9:34AM 2\nThursday 10:30AM /2\nThursday 10:38AM 3\nThursday 11:34AM /3\nThursday 11:42AM 4\nThursday 12:42PM /4 | Lunch\nThursday 1:22PM /L\nThursday 1:30PM 5\nThursday 2:26PM /5\nThursday 2:34PM 6\nThursday 3:30PM /6\nFriday 8:30AM 1\nFriday 9:26AM /1\nFriday 9:34AM 2\nFriday 10:30AM /2\nFriday 10:38AM 3\nFriday 11:34AM /3\nFriday 11:42AM 4\nFriday 12:42PM /4 | Lunch\nFriday 1:22PM /L\nFriday 1:30PM 5\nFriday 2:26PM /5\nFriday 2:34PM 6\nFriday 3:30PM /6","prefix":"","tickTime":"0"}}}`)
    function TimerUpdater(bypassTickTest = false) {
        boxUpdater: for (let i = 0; i < boxes.length; i++) {
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
                item ? item.millisecondsUntil = item?.date?.getTime() ?? Infinity - Date.now() : null;
            })
            let upcomingDate: DataValueLine = null;
            for (let i2 = 0; i2 < box.values.length; i2++) {
                const value: DataValueLine = box.values[i2];
                if (value?.millisecondsUntil == null || value.millisecondsUntil >= 0) {
                    if (upcomingDate == null || (value?.millisecondsUntil ?? -Infinity) < (upcomingDate.millisecondsUntil ?? -Infinity)) {
                        upcomingDate = value;
                    }
                } else if ((titleValue.match(/\*ALARM\*/i) || value.text.match(/\*ALARM\*/i)) && value.alarm === false && bypassTickTest === false) {
                    alarmSound.play().catch(err => { console.error(err) })
                    value.alarm = true
                    console.log(value.alarm)
                }
            }
            box.upcomingDate = upcomingDate;
            if (box.upcomingDate) {
                const timeKeeper = new Date(box.upcomingDate.millisecondsUntil ?? 0)
                const timeKeeperString = timeKeeper.toISOString()
                const hours = (((+timeKeeperString.slice(8, 10) - 1) * 24) + timeKeeper.getUTCHours()).toString().padStart(2, '0');
                if (box.highlightMatches) {
                    const [hMatches, hDays = 0, hHours = 0, hMinutes = 0, hSeconds = 0, hMilliseconds = 0] = box.highlightMatches
                    if (((+hDays * 86400000) + (+hHours * 3600000) + (+hMinutes * 60000) + (+hSeconds * 1000) + +hMilliseconds) >= (box.upcomingDate.millisecondsUntil ?? 0)) {
                        box.classList.add('box-highlight');
                    } else {
                        box.classList.remove('box-highlight');
                    }
                } else { box.classList.remove('box-highlight'); }
                box.specialElements.timerHrMin ? box.specialElements.timerHrMin.innerText = hours + ':' + timeKeeper.getUTCMinutes().toString().padStart(2, '0') : null;
                box.specialElements.timerSec ?box.specialElements.timerSec.innerText = timeKeeperString.slice(17, settings.secondsSize) : null;
                const nextUpText = box.upcomingDate.text.match(/\*dis(?:play)? ?\((.*?)\)\*/);
                let nextUpText2 = nextUpText ? nextUpText[1] : box.upcomingDate.text
                if (/^([A-Z][a-z]*) (\d{1,2}):(\d{2})(:\d{2})?([APap][mM])?/.test(nextUpText2)) {
                    switch (true) {
                        case box.settings?.dayOfWeek === 'hide': case !!nextUpText2.match(/\*(h-dow|h-d)\*/): nextUpText2 = nextUpText2.replace(/^([A-Z][a-z]* )/, "").replace(/\*(h-dow|h-d)\*/, ""); break;
                        case box.settings?.dayOfWeek === 'shorten3': case !!nextUpText2.match(/\*(sh3-dow)\*/): nextUpText2 = nextUpText2.replace(/^([A-Z][a-z]*)/, x => x.substring(0, 3)).replace(/\*(sh3-dow)\*/, ""); break;
                        case box.settings?.date === 'hide': case !!nextUpText2.match(/\*(h-date|h-d)\*/): nextUpText2 = nextUpText2.replace(/^(\d{4})-(\d{2})-(\d{2}) /, "").replace(/\*(h-date|h-d)\*/, ""); break;
                    }
                }
                box.specialElements.nextUp ? box.specialElements.nextUp.innerHTML = nextUpText2 : null;
            } else {
                box.specialElements.timerHrMin ? box.specialElements.timerHrMin.innerText = "00:00" : null;
                box.specialElements.timerSec ? box.specialElements.timerSec.innerText = "00.000" : null;
                box.specialElements.nextUp ? box.specialElements.nextUp.innerHTML = '<span onmousedown="alert(`All upcoming dates have elapsed`)" ontouchstart>undefined</span>' : null;
                box.classList.remove('box-highlight');
            }
        }
        const defaultBox = $('.box[fake-title-value="Default"]');
        const highlightedBox = $('.box-highlight');
        const selectedBox = highlightedBox as Box ?? defaultBox as Box;
        if (selectedBox) {
            greaterBox.style.display = 'block';
            greaterBoxElements.title.innerText = selectedBox.fakeTitleValue ?? "";
            // greaterBoxElements.title.innerText = selectedBox.specialElements.title?.value;
            greaterBoxElements.timerHrMin.innerText = selectedBox.specialElements.timerHrMin?.innerText?? "";
            greaterBoxElements.timerSec.innerText = selectedBox.specialElements.timerSec?.innerText?? "";
            greaterBoxElements.nextUp.innerText = selectedBox.specialElements.nextUp?.innerText?? "";
            greaterBoxElements.data.innerText = selectedBox?.allData?.data;
            greaterBoxElements.prefix.innerText = selectedBox?.allData?.prefix || 'No Prefix';
        } else {
            greaterBox.style.display = 'none';
        }
    }
    const timerUpdaterId = setInterval(TimerUpdater, settings.cooldown)
    TimerUpdater(true)
    document.addEventListener('click', e => {
        if ((e.target as Element)?.matches('#deactivate')) {
            clickSound.play()
            if (confirm("WARNING: This will make this page unavailable until this site is reload. Confirm?")) {
                clearInterval(timerUpdaterId)
                document.body.remove()
                document.head.remove()
            }
        }
        if ((e.target as Element)?.matches('.settings-box-update')) {
            localStorage.setItem('settings', JSON.stringify({
                cooldown: ($('.settings-box .cooldown') as HTMLInputElement).value || '10',
                secondsSize: +($('.settings-box .seconds-size') as HTMLInputElement).value + 19 || 23,
                highlightColor: ($('.settings-box .highlight-color') as HTMLInputElement).value || 'yellow',
                customClickSound: ($('.settings-box .custom-click-sound') as HTMLInputElement).value || '',
            }))
            clickSound.play()
            location.reload()
        }
    });
    ($('.settings-box .cooldown') as HTMLInputElement).value = settings.cooldown.toString();
    ($('.settings-box .seconds-size') as HTMLInputElement).value = (settings.secondsSize - 19).toString();
    ($('.settings-box .highlight-color') as HTMLInputElement).value = settings.highlightColor
    ($('.settings-box .custom-click-sound') as HTMLInputElement).value = settings.customClickSound
    document.documentElement.style.setProperty("--highlight-color", settings.highlightColor)
} catch (err) { (window as any)['err'] = err; alert(err); console.error(err) }
