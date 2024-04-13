
/**
 * @param {Uint8Array} data - The compressed data
 * @returns {Uint8Array} - The decompressed data
 */
/*
 * This is Zugebot (jerrinth3glitch)'s code ported to JS (mostly complete but not working!!!)
 * https://github.com/zugebot/LegacyEditor
 */
// Big thanks to Offroaders for helping out with this, would've been barely possible without them!
function vitaRLEDecode(data) {
    const compressedLength = data.byteLength;
    const result = [];
    let readOffset = 0;
    let writeOffset = 0;
  
    while (readOffset < compressedLength){
      const suspectedTag = data[readOffset];
      readOffset++;
  
      if (suspectedTag !== 0){
        result[writeOffset] = suspectedTag;
        writeOffset++;
      } else {
        const length = data[readOffset];
        readOffset++;
        for (let i = 0; i < length; i++){
          result.push(0);
          writeOffset++;
        }
      }
    }
  
    return new Uint8Array(result);
  }

  
export { vitaRLEDecode };