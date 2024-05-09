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

/**
 * Retrieves version info for the specified file.
 * @param type The file to return info for.
 * @returns A JSON string containing the version and date information.
 */
function getVer(type: string): string {
    switch (type) {
        case "le":
            // LCE Savegame Extractor
            return JSON.stringify({ "version": "1.1.33", "date": "04/17/2024"});
        case "qd":
            // QMG Header Parser
            return JSON.stringify({ "version": "1.2.10", "date": "12/21/2023"});
        case "default":
        default:
            return JSON.stringify({ "version": "1.3.00", "date": "04/17/2024"});
    }
}

/**
 * Sets the version information in the current HTML.
 * @param type The file to use the information from when setting the info.
 */
export function setVer(type: string): void {
    let json = JSON.parse(getVer(type));
    document.getElementById('lastUpdated')!.innerText = `v${json["version"]} (${json["date"]})`;
}

