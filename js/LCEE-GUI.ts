import JSZip from "jszip";
import { readNBTfromFile, isReadable } from "./modules/NBT.js";
import { showNBTCard } from "../LCEE/index.js";
import { downloadZip } from "./LCEE-Core.js";
import { index } from "liblce";

const filesDiv: HTMLDivElement = document.querySelector("#files")!;
const center: HTMLDivElement = document.querySelector(".center")!;
const output: HTMLPreElement = document.querySelector("#output")!;

export async function render(files: index[]): Promise<void> {
  output.textContent = "";
  filesDiv.innerHTML = "";
  filesDiv.style.display = "none";
  const lceRoot = document.createElement("div");
  lceRoot.id = "lceRoot";
  document.getElementById("files")!.appendChild(lceRoot);
  (document.querySelector("#output") as HTMLDivElement)!.style.display = "none";
  var zip = new JSZip();
  for (const file of (await files)) {
    const blobUrl = URL.createObjectURL(file.data);
    // may or may not make some of these elements their own function
    var LCEFileContainer = document.createElement("div");
    LCEFileContainer.className = "LCEFileContainer";
    LCEFileContainer.style.display = "flex";
    LCEFileContainer.style.flexDirection = "row";
    LCEFileContainer.style.backgroundColor = "rgba(50, 50, 50, 0.5)";
    LCEFileContainer.style.marginBottom = "10px";
    var LCEFile = document.createElement("a");
    LCEFile.className = "LCEFile";
    LCEFile.href = blobUrl;
    LCEFile.download = file.name;
    // if the file has a /, it means it is in a folder.
    if (file.name.includes("/")) {
      // split the name between folder and filename
      let lceFileFolder = file.name.split("/");
      // create an element with filename (notice the 1)
      LCEFile.innerText = lceFileFolder[1] ?? "File";
      // create a div to hold the files in their respective folders
      var lceFolder = document.createElement("div");
      // create a header with the foldername (newName[0])
      var folderName = document.createElement("h3");
      folderName.innerText = lceFileFolder[0] ?? "Folder";
      folderName.className = "LCEFolderName";
      if (!document.getElementById("LCEFolder_" + lceFileFolder[0])) {
        // add the folderName to the lceFolder if it doesn't already exist(god this is so weird)
        lceFolder.appendChild(folderName);
        lceFolder.className = "LCEFolder";
        lceFolder.id = "LCEFolder_" + lceFileFolder[0];
      }

      // add the folder into the upper files div
      filesDiv.appendChild(lceFolder);
      LCEFileContainer.appendChild(LCEFile);
      if (!document.getElementById("LCEFolder_" + lceFileFolder[0])) {
        lceFolder.appendChild(LCEFileContainer);
      } else {
        document.querySelector("#LCEFolder_" + lceFileFolder[0])!.appendChild(LCEFileContainer);
      }

    } else {
      LCEFile.innerText = file.name;
      LCEFileContainer.appendChild(LCEFile);
      lceRoot.appendChild(LCEFileContainer);
    }

    console.log(await readNBTfromFile(file, file.name));
    if ((await isReadable(file, file.name)) == true) {
      var viewNBTButton = document.createElement("button");
      viewNBTButton.onclick = async () => {
        showNBTCard(await readNBTfromFile(file, file.name));
      };
      
      viewNBTButton.innerText = "View NBT";
      viewNBTButton.className = "button";
      viewNBTButton.style.padding = "unset";
      viewNBTButton.style.margin = "unset";
      viewNBTButton.style.marginLeft = "auto";
      LCEFileContainer.appendChild(viewNBTButton);
    }
    zip.file(file.name, file.data);
    filesDiv.style.display = "block";
  }

  let downloadArchiveButton: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>("#downloadArchiveButton");
  downloadArchiveButton?.remove();
  downloadArchiveButton = document.createElement("button");

  downloadArchiveButton.onclick = async () => {
    await downloadZip(zip);
  };

  downloadArchiveButton.innerText = "Download all";
  downloadArchiveButton.className = "button";
  downloadArchiveButton.id = "downloadArchiveButton";
  center.appendChild(downloadArchiveButton);
}
