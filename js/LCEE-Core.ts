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

import { render } from "./LCEE-GUI.js";
import { readSave, decompressVitaRLE } from "liblce";

import type JSZip from "jszip";
import type { Endian } from "nbtify";

const compModeBtn: HTMLButtonElement = document.querySelector("#CompModeBtn")!;

let endianness: Endian;
let littleEndian: boolean;
let doNotSaveDOM: boolean = false;
let savegameName: string;

let vita: boolean = false;

export function switchCompressionMode(mode: number): void {
  switch (mode) {
    case 0:
      compModeBtn.innerText =
        "Save type: Wii U, PS3, Decompressed Xbox 360";
      endianness = "big";
      vita = false;
      break;
    case 1:
      compModeBtn.innerText =
        "Save type: Switch, PS4";
      endianness = "little";
      vita = false;
      break;
    case 2:
      compModeBtn.innerText = "Save type: Vita";
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

export async function readFile(data: File, sgName: string): Promise<void> {
  savegameName = sgName;
  try {
    const fileArray = new Uint8Array(await data.arrayBuffer());
    let saveFiles = {};
    if (!endianness) endianness = "big";

    if (endianness == "little") {
      littleEndian = true;
    } else {
      littleEndian = false;
    }

    if (endianness == "big") {
      if (
        new TextDecoder().decode(fileArray).substring(0, 3).replace(/\x00/g, "") ==
        "CON"
      ) {
        console.log("This is an Xbox 360 package!!!");
      }
    }
    if (data) {
      if (vita !== true) {
        saveFiles = await readSave(data, littleEndian);
      } else {
        saveFiles = await readSave(new File([new Blob([decompressVitaRLE(fileArray.slice(8))])], data.name), littleEndian);
      }
    } else {
      console.error("No data received...");
    }

    await render(saveFiles);
  } catch (e) {
    console.error(e);
  }
}

