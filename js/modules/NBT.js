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

import { read, NBTData } from "https://cdn.jsdelivr.net/npm/nbtify@1.90.1/dist/index.min.js";


/**
 * @param {File[]} fileArray
 * @param {string} fName
 * @param {import("nbtify").Endian} endianness
 * @returns {Promise<NBTData>}
*/
export async function readNBTfromFile(fileArray, fName, endianness) {
    try {
    console.log(await read(await fileArray.find(file => file.name === fName).arrayBuffer(), { rootName: true, endian: endianness, bedrockLevel: false, strict: false }));
    return await read(await fileArray.find(file => file.name === fName).arrayBuffer(),  { rootName: true, endian: endianness, bedrockLevel: false, strict: false });
    } catch {
        console.log('Couldn\'t open this file!')
    }
}

/**
 * @param {File[]} fileArray
 * @param {string} fName
 * @param {import("nbtify").Endian} endianness
 * @returns {Promise<boolean>}
*/
export async function isReadable(fileArray, fName, endianness) {
    try {
        if (await read(await fileArray.find(file => file.name === fName).arrayBuffer(), { rootName: true, endian: endianness, bedrockLevel: false, strict: false })) {
            return true;
        } else {
            return false;
        }
        } catch {
            return false;
    }
}