/**
 * @param {string} type tagName — The name of an element.
 * @param {ObjectConstructor} options object of values
 * @returns {HTMLElement}
 */
function createElement(type, options = {}) {
    const element = document.createElement(type)
    Object.entries(options).forEach(([key, value]) => {
        if (key.match(/class\d*/)) {
            element.classList.add(value)
            return
        }

        if (key === "dataset") {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue
            })
            return
        }

        if (key === "text") {
            element.textContent = value
            return
        }

        element.setAttribute(key, value)
    })
    return element
}
/**
 * 
 * @param {TimerHandler} f 
 * @param {number | undefined} t  
 * @param {any[]} arg
 * @returns {number}
 */
function clearingSetInterval(f, t, ...arg) {
    var self =
        setInterval(
            function () {
                f(self, ...arg);
            },
            t
        )
    return self
}
/**
 * @param {HTMLElement} elmnt Element you want to drag.
 */
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
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
/**
 * 
 * @param {keyof DocumentEventMap} type 
 * @param {string} selector 
 * @param {Function} callback 
 * @param {boolean | AddEventListenerOptions} [options] 
 * @param {*} parent 
 */
function addGlobalEventListener(
    type,
    selector,
    callback,
    options,
    parent = document
) {
    parent.addEventListener(
        type,
        e => {
            if (e.target.matches(selector)) callback(e)
        },
        options
    )
}
/**
 * 
 * @param {HTMLElement} mediaElem 
 * @param {number} multiplier 
 * @returns {Object}
 */
function amplifyMedia(mediaElem, multiplier) {
    var context = new (window.AudioContext || window.webkitAudioContext),
        result = {
            context: context,
            source: context.createMediaElementSource(mediaElem),
            gain: context.createGain(),
            media: mediaElem,
            amplify: function (multiplier) {
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
function $(querySelector, parent = document) {
    if (typeof querySelector == "function") {
        document.addEventListener("load", querySelector)
    }
    else return parent.querySelector(querySelector)
}
/**
 * 
 * @param {keyof HTMLElementTagNameMap} querySelectorAll 
 * @param {*} parent 
 * @returns {NodeListOf<HTMLElementTagNameMap[keyof HTMLElementTagNameMap]>}
 */
function $$(querySelectorAll, parent = document) {
    return parent.querySelectorAll(querySelectorAll)
}
/**
 * Adds time to a date. Modelled after MySQL DATE_ADD function.
 * Example: dateAdd(new Date(), 'minute', 30)  //returns 30 minutes from now.
 * https://stackoverflow.com/a/1214753/18511
 * 
 * @param {Date} date  Date to start with
 * @param {'year' | 'quarter' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'} interval  One of: year, quarter, month, week, day, hour, minute, second
 * @param {number} units  Number of units of the given interval to add.
 */
function dateAdd(date, interval, units) {
    if (!(date instanceof Date))
        return undefined;
    var ret = new Date(date); //don't change original date
    var checkRollover = function () { if (ret.getDate() != date.getDate()) ret.setDate(0); };
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
// Import the necessary library (CryptoJS)
// Make sure you have CryptoJS installed (e.g., using npm install crypto-js)
import CryptoJS from 'crypto-js';

// Encryption function
function encryptAES(text, key) {
  const encrypted = CryptoJS.AES.encrypt(text, key).toString();
  return encrypted;
}

// Decryption function
function decryptAES(encryptedText, key) {
  const decrypted = CryptoJS.AES.decrypt(encryptedText, key).toString(CryptoJS.enc.Utf8);
  return decrypted;
}
export { createElement, clearingSetInterval, dragElement, addGlobalEventListener, amplifyMedia, $, $$, dateAdd, encryptAES, decryptAES }