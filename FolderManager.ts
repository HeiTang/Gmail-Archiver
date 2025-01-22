class FolderManager {
    private parentFolder: GoogleAppsScript.Drive.Folder;

    /**
     * Build constructor, receive the parent folder name, and get or create the parent folder.
     * @param parentFolderName The name of the parent folder.
     */
    constructor(parentFolderName: string) {
        this.parentFolder = this.getOrCreateFolder(parentFolderName);
    }

    /**
     * Get the parent folder.
     * @returns Google Drive folder object
     */
    public getParentFolder(): GoogleAppsScript.Drive.Folder {
        return this.parentFolder;
    }

    /**
     * Get or create a folder in the Google Drive root folder.
     * @param folderName The name of the folder.
     * @returns Google Drive folder object
     */
    public getOrCreateFolder(folderName: string): GoogleAppsScript.Drive.Folder {
        const folders = DriveApp.getFoldersByName(folderName);
        if (folders.hasNext()) {
            console.log(`The folder "${folderName}" already exists.`);
            return folders.next();
        } else {
            const newFolder = DriveApp.createFolder(folderName);
            console.log(`The folder "${folderName}" has been created.`);
            return newFolder;
        }
    }

    /**
     * Get or create a subfolder in the parent folder.
     * @param folderName The name of the subfolder.
     * @returns Google Drive subfolder object
     */
    public getOrCreateSubFolder(
        parentFolder: GoogleAppsScript.Drive.Folder,
        folderName: string
    ): GoogleAppsScript.Drive.Folder {
        const folders = parentFolder.getFoldersByName(folderName);
        if (folders.hasNext()) {
            console.log(
                `The subfolder "${folderName}" already exists in "${parentFolder.getName()}".`
            );
            return folders.next();
        } else {
            const newFolder = parentFolder.createFolder(folderName);
            console.log(
                `The subfolder "${folderName}" has been created in "${parentFolder.getName()}".`
            );
            return newFolder;
        }
    }
}
