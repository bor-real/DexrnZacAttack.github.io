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

export let curTab: 1 | 2;
let height: number;

export function setCurTab(newValueOrSetter: typeof curTab | ((previous: typeof curTab) => typeof curTab)): typeof curTab {
    if (typeof newValueOrSetter === "number"){
        curTab = newValueOrSetter;
        return newValueOrSetter;
    }
    const previous = curTab;
    return newValueOrSetter(previous);
}

// Currently, this is used globally within event handlers inlined in `index.html`
globalThis.changeMainCard = changeMainCard;

type ChangeMainCard = typeof changeMainCard;

declare global {
    var changeMainCard: ChangeMainCard;
}

export function changeMainCard(whatToChangeTo: "Discord" | "About"): void {

switch (whatToChangeTo) {
    case "Discord":
        curTab = 1;
        if (document.getElementById('dcbutton').className !== 'tabbuttonclicked') {
        console.log("Discord");
        document.getElementById('dcbutton').className = 'tabbuttonclicked';
        document.getElementById('abbutton').className = 'tabbutton';
        document.getElementById('mainCard').style.display = 'block';
        document.getElementById('activityCard').style.display = 'block';
        document.getElementById('aboutCard').style.display = 'block';
        document.getElementById('linksCard').style.display = 'block';
        document.getElementById('stuffTab').style.display = 'none';
        }
        break;
    case "About":
        curTab = 2;
        if (document.getElementById('abbutton').className !== 'tabbuttonclicked') {
            height = document.getElementById('mainCard').offsetHeight + 12;
            height += document.getElementById('activityCard').offsetHeight + 12;
            height += document.getElementById('aboutCard').offsetHeight + 5;
            height += document.getElementById('linksCard').offsetHeight;
            document.getElementById('stuffTab').style.height = height + 'px';
            console.log("About");
            document.getElementById('abbutton').className = 'tabbuttonclicked';
            document.getElementById('dcbutton').className = 'tabbutton';
            document.getElementById('mainCard').style.display = 'none';
            document.getElementById('activityCard').style.display = 'none';
            document.getElementById('aboutCard').style.display = 'none';
            document.getElementById('linksCard').style.display = 'none';
            document.getElementById('stuffTab').style.display = 'block';

            }
            break;
    default:
        break;
}}