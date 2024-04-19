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

import { inflate, vitaRLEDecode } from "./modules/compression.js";
import { render } from "./LCEE-GUI.js";

import type JSZip from "jszip";
import type { Endian } from "nbtify";

let endianness: Endian;
let littleEndian: boolean;
let doNotSaveDOM: boolean = false;
let savegameName: string;

let vita: boolean = false;

let compressionMode = "none";

export function switchCompressionMode(mode: 0 | 1 | 2): void {
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

export async function downloadZip(zip: JSZip): Promise<void> {
  try {
    const file: Blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = `${savegameName}.zip`;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error(error);
  }
}

export function readFile(data: Uint8Array, sgName: string): void {
  savegameName = sgName;
  try {
    let files: File[] = [];
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
          decompressedData = inflate(dataToDecompress);

          if (decompressedData) data = decompressedData;
          console.log("This is ZLib/Deflate compressed.");
        } catch {
          console.log("This is not ZLib compressed.");
        }
      } else {
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
        var fileNameFromSaveGame: string = line.substring(0, 80).replace(/\x00/g, "");
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

