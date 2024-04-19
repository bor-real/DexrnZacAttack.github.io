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

// Dexrn -----
// It is currently 10/20/2023 4:25 AM (PST) at the time of writing this.
// Saw that vlOd made a header parser in C# and decided to make one in JS so that people who don't run Windows can run this straight in their browser.
// This script is JANK.

const unknownversions = [
    'IM', 'QC', 'QW', 'IF', 'IT', 'PF', 'AU', 'NQ'
];
const magictypes = [
    'QM', 'QG', 'IM', 'QC', 'QW', 'IF', 'IT', 'PF', 'AU', 'NQ', 'SP'
];

(document.getElementById('fileInput')! as HTMLInputElement).addEventListener('change', onfileselected);

function onfileselected(this: HTMLInputElement) {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const data = new Uint8Array((event.target.result as ArrayBuffer));
            readfile(data); 
        };
        reader.readAsArrayBuffer(file);
    }
}
document.addEventListener("dragover", (e) => {
    e.preventDefault();
});

document.addEventListener("drop", (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const data = new Uint8Array((event.target.result as ArrayBuffer));
            readfile(data);
            const fileInput = document.getElementById('fileInput');
            fileInput.dispatchEvent(new Event('change'));
        };
        reader.readAsArrayBuffer(file);
    }
});

// Dexrn: TODO: make this work.
// function createtable(data) {
//     const container1 = document.getElementById('header');
//     container1.innerHTML = '';
//     const container = document.createElement('div');
//     container.style.display = 'flex';
//     const rawdatatable = document.createElement('table');
//     rawdatatable.style.borderCollapse = 'collapse';
//     rawdatatable.style.width = '50%'; 


//     for (let rowindex = 0; rowindex < 2; rowindex++) {
//         const rawdatarow = document.createElement('tr');
//         for (let i = 0; i < 16; i++) {
//             const rawdataindex = rowindex * 16 + i;
//             const rawdatacell = document.createElement('td');
//             const value = rawdataindex < 32 ? data[rawdataindex] : null;
//             rawdatacell.textContent = value !== null ? value.toString(16).padStart(2, '0') : '';
//             rawdatacell.style.border = '1px solid #FFF';
//             rawdatacell.style.width = '30px';
//             rawdatacell.style.padding = '5px';
//             rawdatarow.appendChild(rawdatacell);
//         }
//         rawdatatable.appendChild(rawdatarow);
//     }


//     const texttable = document.createElement('table');
//     texttable.style.borderCollapse = 'collapse';
//     texttable.style.width = '50%'; 
    

//     for (let rowindex = 0; rowindex < 2; rowindex++) {
//         const textrow = document.createElement('tr');
//         for (let i = 0; i < 16; i++) {
//             const rawdataindex = rowindex * 16 + i;
//             const textcell = document.createElement('td');
//             const value = rawdataindex < 32 ? data[rawdataindex] : null;
//             textcell.textContent = value !== null ? String.fromCharCode(value) : '';
//             textcell.style.border = '1px solid #FFF';
//             textcell.style.width = '30px'; 
//             textcell.style.padding = '5px';
//             textrow.appendChild(textcell);
//         }
//         texttable.appendChild(textrow);
//     }
    

//     container.appendChild(rawdatatable);
//     container.appendChild(texttable);
//     container1.appendChild(container);
// }

function readfile(data: Uint8Array) {

    // Dexrn: if the file doesn't have at least 12 bytes, it can't even fit the header lmao
    if (data.length < 12) {
        document.getElementById('output').textContent = `Invalid file: File is too small, Must be atleast 12 bytes in length.\n` +
        `File size was ${data.length}`;
        throw new Error("Invalid file: File is too small")
    }

    // Dexrn: Check if the first 2 bytes are QM or QG or one of the unknown ones
    const magic = String.fromCharCode(data[0], data[1]);
    const magicraw = data[0].toString(16).padStart(2, '0') + ' ' + data[1].toString(16).padStart(2, '0');

    if (!magictypes.includes(magic) && magicraw !== '14 00') {
        document.getElementById('output').textContent = `Invalid file: Invalid magic.\n` +
            `Expected one of: QM, QG, IM, QC, QW, '14 00', got "${magic}" (${magicraw}) instead.`;
        throw new Error("Invalid file: Invalid magic");
    }
    

    // Dexrn: THE JANKNESS STARTS HERE!
    // Dexrn: parse
    let majorversion, minorversion, revision;
    let offset = 0;
    let zlibstreamcount = 0;
    let zliboffset = 0; 
    const type = data[3];
    const format = magic;
    const framecount = (data[16] | (data[17] << 8));
    const currentFramecount = (data[18] | (data[19] << 8));
    const delayTime = (data[20] | (data[21] << 8));
    const noRepeat = data[22];
    const padding = (data[10]);
    const encmode = data[5].toString(16).padStart(2, '0');
    // let sprfiletype;
    if (magic != "QM") {
        for (let i = 0; i < data.length - 1; i++) {
            if (data[i] === 0x78 && data[i + 1] === 0xDA) {
                zlibstreamcount++;
            }
            zliboffset++;
        }
    }
    

    let flags;
    let flag1;
    let flag2;
    let qual;
    let flag1noraw;
    if (magic === 'QG' || magic === 'IM' || magic === 'QC' || magicraw === '14 00' || magic === 'QW' || magic === 'SP') {
        flags = data[5].toString(16).padStart(2, '0');
        qual = data[6];
        majorversion = data[2];
        minorversion = data[3];
        revision = data[4];
    } else if (magic === 'QM') {
        // Dexrn: this is jank
        flag1 = data[4].toString(16).padStart(2, '0');
        flag1noraw = data[4];
        flag2 = data[5].toString(16).padStart(2, '0');
        majorversion = data[2];
        offset = -1; // Dexrn: Offset because I originally had this and don't want to redo this yet.
    }   

    const width = (data[7 + offset] | (data[8 + offset] << 8));
    const height = (data[9 + offset] | (data[10 + offset] << 8));

    let animated: 0 | 1;
    if (magic == "QM") {
        if ((flag1noraw >> 7) !== 0)
            animated = 1;
        else
            animated = 0;
    } else {
        animated = 0;  
    }

    // DexrnsFunnyLogger((flag1noraw >> 7));
    // DexrnsFunnyLogger((flag1noraw & 128) != 0);
    // DexrnsFunnyLogger((flag1noraw >> 7) != 0);
    // DexrnsFunnyLogger(`animated == ${animated}`);
    // DexrnsFunnyLogger(`currentFramecount == ${currentFramecount}`);
    // DexrnsFunnyLogger(`majorversion == ${majorversion}`);
    // DexrnsFunnyLogger(`flag1noraw == ${flag1noraw}`);
    // DexrnsFunnyLogger(`flag1test == ${flag1test}`);
    // DexrnsFunnyLogger(`flag1 == ${flag1}`);


    let alphapos: number;
    if (majorversion > 11 && animated != 0 && currentFramecount <= 2) {
        alphapos = (data[12] | (data[13] << 8)) << 2;
    } else {
        alphapos = (data[12] | (data[13] << 8));
    }

    // Dexrn: pixel format detection
    let pixelformat: string;
    let transparency: string;
    let bpp: string;
    let raw_type: string;
    switch (type) {
        case 0:
            pixelformat = "RGB565";
            transparency = "false";
            bpp = "0x10";
            raw_type = "QM_RAW_RGB565";
            break;
        case 1:
            pixelformat = "RGB888";
            transparency = "false";
            bpp = "0x18";
            raw_type = "QM_RAW_RGB888";
            break;
        case 2:
            pixelformat = "BGR888";
            transparency = "false";
            bpp = "0x18";
            raw_type = "QM_RAW_BGR888";
            break;
        case 3:
            pixelformat = "RGBA5658";
            transparency = "true";
            bpp = "0x18";
            raw_type = "QM_RAW_RGBA5658";
            break;
        case 4:
            pixelformat = "ARGB8565";
            transparency = "true";
            bpp = "0x18";
            raw_type = "QM_RAW_ARGB8565";
            break;
        case 5:
            pixelformat = "ARGB8888";
            transparency = "true";
            bpp = "0x20";
            raw_type = "QM_RAW_ARGB8888";
            break;
        case 6:
            pixelformat = "RGBA8888";
            transparency = "true";
            bpp = "0x20";
            raw_type = "QM_RAW_RGBA8888";
            break;
        case 7:
            pixelformat = "BGRA8888";
            transparency = "true";
            bpp = "0x20";
            raw_type = "QM_RAW_BGRA8888";
            break;
        default:
            pixelformat = "Unknown";
            transparency = "Unknown";
            bpp = "Unknown";
            raw_type = "Unknown";
    }
    
        // Dexrn: this creates a table showing the header.
        // createtable(data);
    

    // Dexrn: show data, if it is QG, do not show frame count cuz it ain't animation
    const version = `${majorversion}.${minorversion}.${revision}`;
    if (magic === 'QG') {
        document.getElementById('output').textContent =
            `Format: ${format}\n` +
            `Version: ${version}\n` +
            `Flags (raw): ${flags}\n` +
            `Quality: ${qual}\n` +
            `Width: ${width}\n` +
            `Height: ${height}\n` +
            `ZLib stream count: ${zlibstreamcount}`
    } else if (magic === 'QM') {
        document.getElementById('output').textContent =
            `Format: ${format} (appears to be an animation)\n` +
            `Version: ${majorversion}\n` +
            `Pixel Format: ${pixelformat}\n` +
            `Transparent: ${transparency}\n` +
            `Bits Per Pixel (BPP): ${bpp}\n` +
            `Raw Type: ${raw_type}\n` +
            `Flag 1 (raw): ${flag1}\n` +
            `Flag 2 (raw): ${flag2}\n` +
            `Width: ${width}\n` +
            `Height: ${height}\n` +
            `Padding: ${padding}\n` +
            `Alpha Position(?): ${alphapos}\n` +
            `Encoder Mode (raw): ${encmode}\n` +
            `Frame Count: ${framecount}\n` +
            `Current Frame Count: ${currentFramecount}\n` +
            `Delay Time: ${delayTime}\n` +
            `noRepeat: ${noRepeat}\n`;
    } else if (magic === 'QM' && animated != 1) {
        document.getElementById('output').textContent =
            `Format: ${format} (appears to be a static image)\n` +
            `Version: ${majorversion}\n` +
            `Pixel Format: ${pixelformat}\n` +
            `Transparent: ${transparency}\n` +
            `Bits Per Pixel (BPP): ${bpp}\n` +
            `Raw Type: ${raw_type}\n` +
            `Flag 1 (raw): ${flag1}\n` +
            `Flag 2 (raw): ${flag2}\n` +
            `Width: ${width}\n` +
            `Height: ${height}\n` +
            `Padding: ${padding}\n` +
            `Alpha Position(?): ${alphapos}\n` +
            `Encoder Mode (raw): ${encmode}\n` +
            `ZLib stream count: ${zlibstreamcount}`;
    } else if (unknownversions.includes(magic)) {
        document.getElementById('output').textContent =
            `You have an unknown version of the QMG format, please contact dexrn on Discord, as we currently don't have this version yet.\n` +
            `This also means we know nothing about it, Since this file will be treated as a QMG, most if not all information shown WILL be inaccurate.\n` +
            `Format: ${format} (Unknown)\n` +
            `Version: ${version}\n` +
            `Type: ${type}\n` +
            `Pixel Format: ${pixelformat}\n` +
            `Transparent: ${transparency}\n` +
            `Bits Per Pixel (BPP): ${bpp}\n` +
            `Raw Type: ${raw_type}\n` +
            `Flags (raw): ${flags}\n` +
            `Quality: ${qual}\n` +
            `Width: ${width}\n` +
            `Height: ${height}\n` +
            `Alpha Position(?): ${alphapos}\n` +
            `Encoder Mode (raw): ${encmode}\n` +
            `Frame Count: ${framecount}\n` +
            `Current Frame Count: ${currentFramecount}\n` +
            `Delay Time: ${delayTime}\n` +
            `noRepeat: ${noRepeat}\n`;
    } else if (magicraw === '14 00') {
    document.getElementById('output').textContent =
        `This is an SPI file, Not too much is known about this format.\n` +
        `Since this file will be treated as a QMG, most if not all information shown WILL be inaccurate.\n` +
        `Format: SPI\n` +
        `Version: ${version}\n` +
        `Type: ${type}\n` +
        `Pixel Format: ${pixelformat}\n` +
        `Transparent: ${transparency}\n` +
        `Bits Per Pixel (BPP): ${bpp}\n` +
        `Raw Type: ${raw_type}\n` +
        `Flags (raw): ${flags}\n` +
        `Quality: ${qual}\n` +
        `Width: ${width}\n` +
        `Height: ${height}\n` +
        `Alpha Position(?): ${alphapos}\n` +
        `Encoder Mode (raw): ${encmode}\n` +
        `Frame Count: ${framecount}\n`;
        `Current Frame Count: ${currentFramecount}\n` +
        `Delay Time: ${delayTime}\n` +
        `noRepeat: ${noRepeat}\n`;
    } else if (magic === 'SP') {
        document.getElementById('output').textContent =
        `This is an SPR-type file, Not too much is known about this format.\n` +
        `Since this file will be treated as a QMG, most if not all information shown WILL be inaccurate.\n` +
        `Format: ${magic}\n` +
        `Version: ${version}\n` +
        `Type: ${type}\n` +
        `Pixel Format: ${pixelformat}\n` +
        `Transparent: ${transparency}\n` +
        `Bits Per Pixel (BPP): ${bpp}\n` +
        `Raw Type: ${raw_type}\n` +
        `Flags (raw): ${flags}\n` +
        `Quality: ${qual}\n` +
        `Width: ${width}\n` +
        `Height: ${height}\n` +
        `Alpha Position(?): ${alphapos}\n` +
        `Encoder Mode (raw): ${encmode}\n` +
        `Frame Count: ${framecount}\n`;
        `Current Frame Count: ${currentFramecount}\n` +
        `Delay Time: ${delayTime}\n` +
        `noRepeat: ${noRepeat}\n`;
    }


}
