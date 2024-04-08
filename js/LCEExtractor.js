// Dexrn: THIS IS CURSED AND IN PROGRESS ITS 2 AM AAAAAAAAAAAAAAA

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

const endianness = "big";
let littleEndian;
if (endianness == "little") {
    littleEndian = true;
}

document.getElementById("fileInput").addEventListener("change", onFileSelected);

function onFileSelected(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const data = new Uint8Array(event.target.result);
            readFile(data);
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
            const data = new Uint8Array(event.target.result);
            readFile(data);
        };
        reader.readAsArrayBuffer(file);
    }
});

let fuck = 0;
let compressionMode = "none";

function switchCompressionMode(mode) {
    
    switch (mode) {
        case 0:
            document.getElementById('CompModeBtn').innerText = "Compression Mode: None";
            compressionMode = "none";
            break;
        case 1:
            document.getElementById('CompModeBtn').innerText = "Compression Mode: ZLib";
            compressionMode = "ZLib"
            break;
    }
}

function readFile(data) {
    if (compressionMode == "ZLib") {
        data = data.slice(8);
        data = pako.inflate(data);
    }

    // there is no error handling LMAO
    let offset = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | data[3];
    let count = (data[4] << 24) | (data[5] << 16) | (data[6] << 8) | data[7];

    while (offset + 144 <= data.byteLength) {
        const bytes = data.slice(offset, offset + 144);
        offset += 144;

        const line = new TextDecoder().decode(bytes);
        const fileNameFromSaveGame = line.substring(0, 80).replace(/\x00/g, "");
        const filelength = new DataView(bytes.buffer, 128, 4).getInt32(0, littleEndian);
        const fileoffset = new DataView(bytes.buffer, 132, 4).getInt32(0, littleEndian);

        const sgBlob = new Blob(new Array(data.slice(fileoffset, fileoffset + filelength)));
        const blobUrl = URL.createObjectURL(sgBlob);
        var Element = document.createElement("a");
        Element.href = blobUrl;
        Element.download = fileNameFromSaveGame;
        if (fileNameFromSaveGame.includes("/")) {
            let newName = fileNameFromSaveGame.split("/");
            console.log(newName);
            Element.innerText = newName[1];
            var Element3 = document.createElement("div");
            document.getElementById('files').appendChild(Element3);
            Element3.appendChild(Element);
            var Element2 = document.createElement("br");
            document.getElementById('files').appendChild(Element2);
        } else {
            Element.innerText = fileNameFromSaveGame;
            document.getElementById('files').appendChild(Element);
            var Element2 = document.createElement("br");
            document.getElementById('files').appendChild(Element2);
        }
    }

    document.getElementById("output").textContent =
        `offset: ${offset}\n` + `count: ${count}\n`;
}
