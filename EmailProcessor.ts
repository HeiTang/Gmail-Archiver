class EmailProcessor {
    private labelName: string;
    private labelFolder: GoogleAppsScript.Drive.Folder;
    private rawEmailsFolder: GoogleAppsScript.Drive.Folder;
    private attachmentsFolder: GoogleAppsScript.Drive.Folder;

    /**
     * Build constructor, receive the Gmail label name and the parent folder name, and get or create the subfolders.
     * @param labelName Gmail label name
     * @param parentFolderName Parent folder name
     */
    constructor(labelName: string, parentFolderName: string) {
        const folderManager = new FolderManager(parentFolderName);
        this.labelName = labelName;
        this.labelFolder = folderManager.getOrCreateSubFolder(
            folderManager.getParentFolder(),
            labelName
        );
        this.rawEmailsFolder = folderManager.getOrCreateSubFolder(
            this.labelFolder,
            "Original Emails"
        );
        this.attachmentsFolder = folderManager.getOrCreateSubFolder(
            this.labelFolder,
            "Attachments"
        );
    }

    /**
     * Process the emails with the specified label, exporting them to PDF, saving the raw email, and saving the attachments.
     */
    public processEmails(): void {
        const threads = GmailApp.search(`label:${this.labelName}`);
        if (threads.length === 0) {
            console.log(`No emails found with the label "${this.labelName}".`);
            return;
        }
        console.log(`Found ${threads.length} threads with the label "${this.labelName}".`);

        threads.forEach((thread, threadIndex) => {
            console.log(`Processing thread ${threadIndex + 1} / ${threads.length}`);
            const messages = thread.getMessages();
            messages.forEach((message, messageIndex) => {
                const subject = message.getSubject().replace(/[\/:*?"<>|]/g, "");
                const date = message.getDate().toISOString().split("T")[0];

                console.log(
                    `Processing message ${messageIndex + 1}, subject: "${subject}", date: ${date}`
                );
                this.exportEmailToPDF(message, subject, date);
                this.saveRawEmail(message, subject, date);
                this.saveAttachments(message, subject, date);
            });
        });
        console.log(`All emails have been processed.`);
    }

    /**
     * Output the email as a PDF file.
     * @param message Gmail message object
     * @param subject Email subject
     * @param date 
     */
    private exportEmailToPDF(
        message: GoogleAppsScript.Gmail.GmailMessage,
        subject: string,
        date: string
    ): void {
        const pdfName = `${date}_${subject}.pdf`;
        let htmlBody = message.getBody();
        const attachments = message.getAttachments();
        // htmlBody = this.embedCIDImages(htmlBody, attachments);
        htmlBody = this.embedImagesInHtml(htmlBody);
        const pdfBlob = Utilities.newBlob(htmlBody, "text/html", pdfName).getAs(
            "application/pdf"
        );
        this.labelFolder.createFile(pdfBlob);
        console.log(`Email successfully exported to PDF: "${pdfName}"`);
    }

    /**
     * Save the raw email.
     * @param message Gmail message object
     * @param subject Email subject
     * @param date Email date
     */
    private saveRawEmail(
        message: GoogleAppsScript.Gmail.GmailMessage,
        subject: string,
        date: string
    ): void {
        const emlName = `${date}_${subject}.eml`;
        const rawMessage = message.getRawContent();
        const emlBlob = Utilities.newBlob(rawMessage, "message/rfc822", emlName);
        this.rawEmailsFolder.createFile(emlBlob);
        console.log(`Raw email successfully saved: "${emlName}"`);
    }

    /**
     * Save the attachments.
     * @param message Gmail message object
     * @param subject Email subject
     * @param date Email date
     */
    private saveAttachments(
        message: GoogleAppsScript.Gmail.GmailMessage,
        subject: string,
        date: string
    ): void {
        const attachments = message.getAttachments();
        console.log(`Found ${attachments.length} attachments.`);
        attachments.forEach((attachment) => {
            const attachmentName = `${date}_${subject}_${attachment.getName()}`;
            const newAttachmentBlob = attachment.copyBlob().setName(attachmentName);
            this.attachmentsFolder.createFile(newAttachmentBlob);
            console.log(`Attachment successfully saved: "${attachmentName}"`);
        });
    }

    /**
     * Embed images in the HTML string.
     * @param html HTML content of the email
     * @returns HTML content with embedded images
     */
    private embedImagesInHtml(html: string): string {
        const imgTagRegex = /<img[^>]*src="([^"]+)"[^>]*>/g;
        let match;

        while ((match = imgTagRegex.exec(html)) !== null) {
            const imageUrl = match[1];
            try {
                const response = UrlFetchApp.fetch(imageUrl);
                const contentType = response.getHeaders()["Content-Type"];
                if (contentType.startsWith("image/")) {
                    const base64Data = Utilities.base64Encode(response.getContent());
                    const dataUrl = `data:${contentType};base64,${base64Data}`;
                    html = html.replace(imageUrl, dataUrl);
                    console.log(`Image successfully embedded: "${imageUrl}"`);
                }
            } catch (error) {
                console.log(`Error embedding image: "${imageUrl}"`);
            }
        }
        return html;
    }

    // /**
    //  * Embed CID images in the HTML content.
    //  * @param {string} html - content of the email
    //  * @param {GoogleAppsScript.Gmail.GmailAttachment[]} attachments - attachments of the email
    //  * @returns {string} - HTML content with embedded images
    //  */
    // public embedCIDImages(
    //     html: string,
    //     attachments: GoogleAppsScript.Gmail.GmailAttachment[]
    // ): string {
    //     const cidRegex = /cid:([\w@.-]+)/g; // Match the content ID in the format "cid:contentId"
    //     let match;

    //     while ((match = cidRegex.exec(html)) !== null) {
    //         const contentId = match[1];
    //         const matchingAttachment = attachments.find((attachment) => {
    //             const attachmentName = attachment.getName();
    //             return attachmentName && attachmentName.includes(contentId);
    //         });

    //         if (matchingAttachment) {
    //             const contentType = matchingAttachment.getContentType();
    //             const base64Data = Utilities.base64Encode(
    //                 matchingAttachment.getBytes()
    //             );

    //             const dataUrl = `data:${contentType};base64,${base64Data}`;
    //             html = html.replace(`cid:${contentId}`, dataUrl);
    //         }
    //     }
    //     return html;
    // }
}
