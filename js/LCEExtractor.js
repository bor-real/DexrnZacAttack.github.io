import { inflate, vitaRLEDecode } from "./modules/compression.js";
import { readNBTfromFile, isReadable } from "./modules/NBT.js";

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

/** @type {"big" | "little"} */
let endianness;
/** @type {boolean} */
let littleEndian;
/** @type {boolean} */
let doNotSaveDOM = false;

/** @type {boolean} */
let vita = false;

/** @type {HTMLInputElement} */ (
  document.getElementById("fileInput")
).addEventListener("change", onFileSelected);

/**
 * @this {HTMLInputElement}
 * @param {Event} event
 * @returns {void}
 */
function onFileSelected(event) {
  const file = /** @type {typeof this} */ (event.target).files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const data = new Uint8Array(
        /** @type {ArrayBuffer} */ (event.target.result)
      );
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
      const data = new Uint8Array(
        /** @type {ArrayBuffer} */ (event.target.result)
      );
      readFile(data);
    };
    reader.readAsArrayBuffer(file);
  }
});

let compressionMode = "none";

/**
 * @param {0 | 1 | 2} mode
 * @returns {void}
 */
export function switchCompressionMode(mode) {
  switch (mode) {
    case 0:
      document.getElementById("CompModeBtn").innerText =
        "Save type: Wii U, PS3, Decompressed Xbox 360";
      endianness = "big";
      vita = false;
      break;
    case 1:
      document.getElementById("CompModeBtn").innerText =
        "Save type: Switch, PS4";
      endianness = "little";
      vita = false;
      break;
    case 2:
      document.getElementById("CompModeBtn").innerText = "Save type: Vita";
      endianness = "little";
      vita = true;
      break;
  }
}

/**
 * @param {Uint8Array} data
 * @returns {void}
 */
function readFile(data) {
  try {
    /** @type {File[]} */
    let files = [];
    document.getElementById("output").textContent = "";
    document.getElementById("files").innerHTML = "";
    document.getElementById("files").style.display = "none";
    let decompressedData = null;

    if (!endianness) endianness = "big";

    if (endianness == "little") {
      littleEndian = true;
    } else {
      littleEndian = false;
    }

    if (endianness == "big") {
      if (
        new TextDecoder().decode(data).substring(0, 3).replace(/\x00/g, "") ==
        "CON"
      ) {
        console.log("This is an Xbox 360 package!!!");
      }
    }
    let offsetToRead;
    if (data) {
      if (vita !== true) {
        try {
          let dataToDecompress = data.slice(8);
          if (endianness == "little") {
            decompressedData = inflate(dataToDecompress, {
              endian: "little",
            });
          } else {
            decompressedData = inflate(dataToDecompress, {
              endian: "big",
            });
          }

          if (decompressedData) data = decompressedData;
          console.log("This is ZLib/Deflate compressed.");
        } catch {
          console.log("This is not ZLib compressed.");
        }
      } else {
        /** @type {Uint8Array} */
        data = vitaRLEDecode(data.slice(8));
      }
    } else {
      console.error("No data received...");
    }

    let offset, count;
    if (endianness === "little") {
      offset = (data[3] << 24) | (data[2] << 16) | (data[1] << 8) | data[0];
      count = (data[7] << 24) | (data[6] << 16) | (data[5] << 8) | data[4];
    } else {
      offset = (data[0] << 24) | (data[1] << 16) | (data[2] << 8) | data[3];
      count = (data[4] << 24) | (data[5] << 16) | (data[6] << 8) | data[7];
    }

    console.log(count);
    if (count > 100 && doNotSaveDOM !== true) {
      alert(
        'It looks like you may have had the wrong save type set. Wanna try anyway? Set "doNotSaveDOM" to true and resubmit.'
      );
      return;
    }
    var lceRoot = document.createElement("div");
    lceRoot.id = "lceRoot";
    document.getElementById("files").appendChild(lceRoot);
    for (var i = 0; i < count; i++) {
      while (offset + 144 <= data.byteLength) {
        const bytes = data.slice(offset, offset + 144);
        offset += 144;

        const line = new TextDecoder().decode(bytes);
        /** @type {string} */
        var fileNameFromSaveGame = line.substring(0, 80).replace(/\x00/g, "");
        if (fileNameFromSaveGame === "")
          fileNameFromSaveGame = "Corrupted or unreadable";
        const filelength = new DataView(bytes.buffer, 128, 4).getInt32(
          0,
          littleEndian
        );
        const fileoffset = new DataView(bytes.buffer, 132, 4).getInt32(
          0,
          littleEndian
        );
        files.push(
          new File(
            [data.slice(fileoffset, fileoffset + filelength)],
            fileNameFromSaveGame
          )
        );
      }
    }
    render(files);
  } catch (e) {
    document.getElementById("output").textContent = `${e}`;
    console.error(e);
  }
}

/**
 * @param {File[]} files
 */
async function render(files) {
  for (const file of files) {
    const blobUrl = URL.createObjectURL(file);
    var LCEFileContainer = document.createElement('div');
    var LCEFile = document.createElement("a");
    LCEFile.className = "LCEFile";
    LCEFile.href = blobUrl;
    LCEFile.download = file.name;
    if (file.name.includes("/")) {
      // split the name between folder and filename
      let lceFileFolder = file.name.split("/");
      // create an element with filename (notice the 1)
      LCEFile.innerText = lceFileFolder[1];
      // create a div to hold the files in their respective folders
      var lceFolder = document.createElement("div");
      // create a header with the foldername (newName[0])
      var folderName = document.createElement("h3");
      folderName.innerText = lceFileFolder[0];
      folderName.className = "LCEFolderName";
      if (!document.getElementById("LCEFolder_" + lceFileFolder[0])) {
        // add the folderName to the lceFolder if it doesn't already exist(god this is so weird)
        lceFolder.appendChild(folderName);
        lceFolder.className = "LCEFolder";
        lceFolder.id = "LCEFolder_" + lceFileFolder[0];
        var lineBreak1 = document.createElement("br");
        document.getElementById("files").appendChild(lineBreak1);
      }

      // add the folder into the upper files div
      document.getElementById("files").appendChild(lceFolder);
      if (!document.getElementById("LCEFolder_" + lceFileFolder[0])) {
        LCEFileContainer.appendChild(LCEFile);
        lceFolder.appendChild(LCEFileContainer);
      } else {
      LCEFileContainer.appendChild(LCEFile);
        document.getElementById("LCEFolder_" + lceFileFolder[0]).appendChild(LCEFileContainer);
      }
      // line break because yes
      if (!document.getElementById("LCEFolder_" + lceFileFolder[0])) {
        var lineBreak = document.createElement("br");
        document.getElementById("lceFolder").appendChild(lineBreak);
      } else {
        var lineBreak = document.createElement("br");
        document.getElementById("LCEFolder_" + lceFileFolder[0]).appendChild(lineBreak);
      }

    } else {
      LCEFile.innerText = file.name;
      LCEFileContainer.appendChild(LCEFile);
      document.getElementById("lceRoot").appendChild(LCEFileContainer);
      var lineBreak = document.createElement("br");
      document.getElementById("lceRoot").appendChild(lineBreak);
    }
    if (await isReadable(files, file.name) == true) {
      var viewNBTButton = document.createElement("button");
      viewNBTButton.onclick = async () => { await readNBTfromFile(files, file.name); };
      viewNBTButton.innerText = "View NBT";
      LCEFileContainer.appendChild(viewNBTButton);
    }
    document.getElementById("files").style.display = "block";
  }
}
