/*
Copyright 2024 Dexrn ZacAttack

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const msgbox: HTMLElement = document.querySelector('#msgbox')!;
const msgTitle: HTMLElement = document.querySelector('#msgTitle')!;
const msgContent: HTMLElement = document.querySelector('#msgContent')!;
const msgOK: HTMLElement = document.querySelector('#msgOK')!;
const msgCancel: HTMLElement = document.querySelector('#msgCancel')!;

let msgboxExists = false;
let msgboxShown = false;

/**
 * Updates a messagebox
 */
export function updateMSGBox(title: string, message: string, buttons: Array<string> = []): void {

    if (buttons === undefined) {
        buttons = [];
    }

    msgTitle.innerText = title;
    msgContent.innerText = message;

    msgOK.style.display = 'none';
    msgCancel.style.display = 'none';

    if (buttons.includes("msgCancel")) {
        msgCancel.style.display = 'block';
    }
    if (buttons.includes("msgOK")) {
        msgOK.style.display = 'block';
    }

    if (!msgboxShown) {
        showMSGBox();
    }
}

/** Creates a messagebox */
export function createMSGBox(title: string, message: string, buttons: Array<string> = []): void {
    if (buttons === undefined) {
        buttons = [];
    }

    if (msgboxExists) {
        updateMSGBox(title, message, buttons);
    }


    var msgbox = document.createElement('div');
    msgbox.id = 'msgbox';
    msgbox.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    msgbox.style.boxShadow = '0 0 10px 5px rgba(0, 0, 0, 0.5)';
    msgbox.style.position = 'absolute';
    msgbox.style.display = 'flex';

    var msgboxContainer = document.createElement('div');
    msgboxContainer.id = 'msgboxContainer';
    msgboxContainer.style.display = 'block';
    msgboxContainer.style.position = 'absolute';
    msgboxContainer.style.width = '100%';
    msgboxContainer.style.height = '100%';
    msgboxContainer.style.zIndex = '10';
    msgboxContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

    var msgCancel = document.createElement('button');
    msgCancel.id = 'msgCancel';
    msgCancel.style.display = 'none';

    var msgOK = document.createElement('button');
    msgOK.id = 'msgOK';
    msgOK.style.display = 'none';

    var msgTitle = document.createElement('h1');
    msgTitle.id = 'msgTitle';
    msgTitle.innerText = title;

    var msgContent = document.createElement('p');
    msgContent.id = 'msgContent';
    msgContent.innerText = message;

    // Appending elements
    document.body.appendChild(msgboxContainer);
    msgboxContainer.appendChild(msgbox);
    msgboxContainer.appendChild(msgCancel);
    msgboxContainer.appendChild(msgOK);
    msgboxContainer.appendChild(msgTitle);
    msgboxContainer.appendChild(msgContent);

    if (buttons.includes("msgCancel")) {
        msgCancel.style.display = 'block';
    }
    if (buttons.includes("msgOK")) {
        msgOK.style.display = 'block';
    }

    msgboxExists = true;
    msgboxShown = true;
}

/** Creates the messagebox if it doesn't exist, updates it if it does. */
export function useMSGBox(title: string, message: string, buttons: Array<string> = []): void {
    if (!msgboxExists) {
        createMSGBox(title, message, buttons);
        return;
    }

    if (!msgboxShown) {
        return;
    }

    updateMSGBox(title, message, buttons = []);
}

export function hideMSGBox(): void { 
    msgbox.style.display = 'none';
    msgboxShown = false;
}

export function showMSGBox(): void { 
    msgbox.style.display = 'none';
    msgboxShown = true;
}
