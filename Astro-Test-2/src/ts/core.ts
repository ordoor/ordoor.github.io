function createElement<T extends HTMLElement>(type: string, options = {}): T {
    const element = document.createElement(type);
    Object.entries(options).forEach(([key, value]: [string, any]) => {
      if (key.match(/class\d*/)) {
        element.classList.add(value);
        return;
      }
  
      if (key === "dataset") {
        Object.entries(value).forEach(([dataKey, dataValue]: [string, any]) => {
          element.dataset[dataKey] = dataValue;
        });
        return;
      }
  
      if (key === "text") {
        element.textContent = value;
        return;
      }
  
      element.setAttribute(key, value);
    });
    return element as T;
  }
  
function clearingSetInterval(f: (arg0: number) => void, t: number) {
    var self =
        setInterval(
            function () {
                f(self);
            },
            t
        )
}
function dragElement(elmnt: HTMLElement) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e: MouseEvent) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e: MouseEvent) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
function addGlobalEventListener(
    type: string,
    selector: string,
    callback: (arg0: any) => void,
    options: boolean | AddEventListenerOptions,
    parent = document
) {
    parent.addEventListener(
        type,
        e => {
            if ((e.target as HTMLElement).matches(selector)) callback(e)
        },
        options
    )
}
function amplifyMedia(mediaElem: any, multiplier: number) {
    var context = new (window.AudioContext || (window as any)['webkitAudioContext']),
        result = {
            context: context,
            source: context.createMediaElementSource(mediaElem),
            gain: context.createGain(),
            media: mediaElem,
            amplify: function (multiplier: number) {
                result.gain.gain.value = multiplier;
            },
            getAmpLevel: function () {
                return result.gain.gain.value;
            }
        };
    result.source.connect(result.gain);
    result.gain.connect(context.destination);
    result.amplify(multiplier);
    return result;
}
/**
 * 
 * @param {string|Function} querySelector 
 * @param {Document|HTMLElement} parent 
 * @returns 
 */
function $<T extends HTMLElement>(querySelector: string | Function, parent: Document | HTMLElement = document): T | undefined {
    if (typeof querySelector == "function") {
      document.addEventListener("load", (querySelector as EventListener));
    } else {
      return parent.querySelector(querySelector) as T;
    }
    return undefined;
  }
  
function $$<T extends HTMLElement>(querySelectorAll: string, parent = document) : T[] {
    return Array.from(parent.querySelectorAll(querySelectorAll) ?? [])
}
/**
 * Adds time to a date. Modelled after MySQL DATE_ADD function.
 * Example: dateAdd(new Date(), 'minute', 30)  //returns 30 minutes from now.
 * https://stackoverflow.com/a/1214753/18511
 * 
 * @param date  Date to start with
 * @param interval  One of: year, quarter, month, week, day, hour, minute, second
 * @param units  Number of units of the given interval to add.
 */
function dateAdd(date: string | number | Date, interval: 'year' | 'quarter' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second', units: number) {
    if (!(date instanceof Date))
        return undefined;
    var ret: Date | undefined = new Date(date); //don't change original date
    var checkRollover = function () { if (ret?.getDate() != date.getDate()) ret?.setDate(0); };
    switch (String(interval).toLowerCase()) {
        case 'year': ret.setFullYear(ret.getFullYear() + units); checkRollover(); break;
        case 'quarter': ret.setMonth(ret.getMonth() + 3 * units); checkRollover(); break;
        case 'month': ret.setMonth(ret.getMonth() + units); checkRollover(); break;
        case 'week': ret.setDate(ret.getDate() + 7 * units); break;
        case 'day': ret.setDate(ret.getDate() + units); break;
        case 'hour': ret.setTime(ret.getTime() + units * 3600000); break;
        case 'minute': ret.setTime(ret.getTime() + units * 60000); break;
        case 'second': ret.setTime(ret.getTime() + units * 1000); break;
        default: ret = undefined; break;
    }
    return ret;
}
import CryptoJS from 'crypto-js';

// Encryption function
function encryptAES(text: string, key: string) {
  const encrypted = CryptoJS.AES.encrypt(text, key).toString();
  return encrypted;
}

// Decryption function
function decryptAES(encryptedText: string, key: string) {
  const decrypted = CryptoJS.AES.decrypt(encryptedText, key).toString(CryptoJS.enc.Utf8);
  return decrypted;
}
export {createElement, clearingSetInterval, dragElement, addGlobalEventListener, amplifyMedia, $, $$, dateAdd, encryptAES, decryptAES}