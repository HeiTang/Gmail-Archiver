/**
 * Main entry of the program, responsible for initializing and executing the processing flow.
 * @labelName The label name that will be used to identify the emails that should be processed.
 * @parentFolderName The name of the folder where the processed emails will be moved to.
 */
function main() {
    const labelName = "YOUR_LABEL";
    const parentFolderName = "Exported Emails";
    const processor = new EmailProcessor(labelName, parentFolderName);
    processor.processEmails();
}
