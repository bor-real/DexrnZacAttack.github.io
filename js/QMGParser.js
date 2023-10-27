// Dexrn -----
// It is currently 10/20/2023 4:25 AM (PST) at the time of writing this.
// Saw that vlOd made a header parser in C# and decided to make one in JS so that people who don't run Windows can run this straight in their browser.
// This script is JANK.



document.getElementById('fileInput').addEventListener('change', onfileselected);

function onfileselected(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const data = new Uint8Array(event.target.result);
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
        const data = new Uint8Array(event.target.result);
        readfile(data);
        const fileInput = document.getElementById('fileInput');
        fileInput.dispatchEvent(new Event('change'));
        };
        reader.readAsArrayBuffer(file);
    }
});

function readfile(data) {
    // if the file doesn't have at least 12 bytes, it can't even fit the header lmao
    if (data.length < 12) {
        document.getElementById('output').textContent = 'Invalid file: File is too small, Must be atleast 12 bytes in length.';
        return;
    }

    // Check if the first 2 bytes are QM or QG or one of the unknown ones
    const magic = String.fromCharCode(data[0], data[1]);
    const magicraw = data[0].toString(16).padStart(2, '0') + ' ' + data[1].toString(16).padStart(2, '0');
    if (magic !== 'QM' && magic !== 'QG' && magic !== 'IM' && magic !== 'QC' && magicraw !== '14 00') {
        document.getElementById('output').textContent = 'Invalid file: Invalid magic.';
        return;
    }


    // THE JANKNESS STARTS HERE!
    // parse
    let majorversion, minorversion, revision;
    let offset = 0;
    let zlibstreamcount = 0;

    for (let i = 0; i < data.length - 1; i++) {
        if (data[i] === 0x78 && data[i + 1] === 0xDA) {
            zlibstreamcount++;
        }
    }

    if (magic === 'QG' || magic === 'IM' || magic === 'QC' || magicraw === '14 00') {
        flags = data[5];
        qual = data[6];
    } else if (magic === 'QM') {
        // this is jank
        offset = -1; // Offset to skip the flags
    }

    // define shit
    majorversion = data[2];
    minorversion = data[3];
    revision = data[4];
    const format = magic;
    const width = (data[7 + offset] | (data[8 + offset] << 8));
    const height = (data[9 + offset] | (data[10 + offset] << 8));
    const framecount = (data[16] | (data[17]));
    const padding = (data[10]);
    const animation = (data[4]);
    const encmode = (data[5]);
    const alphapos = (data[12] | (data[13] << 8));

    // show data, if it is QG, do not show frame count cuz it ain't animation
    const version = `${majorversion}.${minorversion}.${revision}`;
    if (magic === 'QG') {
        document.getElementById('output').textContent =
            `Format: ${format}\n` +
            `Version: ${version}\n` +
            `Flags: ${flags}\n` +
            `Quality: ${qual}\n` +
            `Width: ${width}\n` +
            `Height: ${height}\n` +
            `ZLib stream count: ${zlibstreamcount}`
    } else if (magic === 'QM') {
        document.getElementById('output').textContent =
            `Format: ${format} (appears to be an animation)\n` +
            `Version: ${version} (Not sure if QM uses version or not, so may mean nothing or is something else entirely)\n` +
            `Width: ${width}\n` +
            `Height: ${height}\n` +
            `Padding: ${padding}\n` +
            `Alpha Position(?): ${alphapos}\n` +
            `Animation(?): ${animation}\n` +
            `Encoder Mode(?): ${encmode}\n` +
            // apparently there are animated AND static version of QM... ugh.
            // Hopefully we can take the easy way out since it seems the ones that are static always have a framecount of 5.
            `Frame Count: ${framecount}`;
    } else if (magic === 'QM' && animation != 128) {
        document.getElementById('output').textContent =
            `Format: ${format} (appears to be a static image)\n` +
            `Version: ${version} (Not sure if QM uses version or not, so may mean nothing or is something else entirely)\n` +
            `Width: ${width}\n` +
            `Height: ${height}\n` +
            `Padding: ${padding}\n` +
            `Alpha Position(?): ${alphapos}\n` +
            `Animation(?): ${animation}\n` +
            `Encoder Mode(?): ${encmode}\n` +
            `ZLib stream count: ${zlibstreamcount}`;
    } else if (magic === 'IM' || magic === 'QC') {
        document.getElementById('output').textContent =
            `You have an unknown version of the QMG format, please contact dexrn on Discord, as we currently don't have this version yet.\n` +
            `This also means we know nothing about it, so we are going to show all information.\n` +
            `Format: ${format} (Unknown)\n` +
            `Version: ${version}\n` +
            `Flags: ${flags}\n` +
            `Quality: ${qual}\n` +
            `Width: ${width}\n` +
            `Height: ${height}\n` +
            `Alpha Position(?): ${alphapos}\n` +
            `Animation(?): ${animation}\n` +
            `Encoder Mode(?): ${encmode}\n` +
            `Frame Count: ${framecount}`;
    } else if (magicraw === '14 00') {
    document.getElementById('output').textContent =
        `This is an SPI file, Not too much is known about this format.\n` +
        `Most information shown WILL be inaccurate.\n` +
        `Format: SPI\n` +
        `Version: ${version}\n` +
        `Flags: ${flags}\n` +
        `Quality: ${qual}\n` +
        `Width: ${width}\n` +
        `Height: ${height}\n` +
        `Alpha Position(?): ${alphapos}\n` +
        `Animation(?): ${animation}\n` +
        `Encoder Mode(?): ${encmode}\n` +
        `Frame Count: ${framecount}`;
}


}
