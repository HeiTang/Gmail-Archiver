<div align="center">
	<h1>Gmail Archiver</h1>
	<p>
		Gmail Archiver is a specialized Google Apps Script tool for exporting Gmail emails and attachments while organizing them into a clear folder structure. It supports converting email content into PDF, saving raw emails (EML), and handling attachments and inline images.
	</p>
	<em>“Your data, your rules. Gmail, the way it’s meant to be.”</em>
</div>

## Features

- **📄 Export Emails to PDF**  

	Automatically converts Gmail emails into PDF files, including inline images (CID images).  

- **📨 Save Raw Emails**  

	Supports saving emails in `.eml` format for use in other email clients.  

- **📎 Process Attachments**  

	Automatically extracts and saves email attachments, including images, documents, etc.  

- **🗂️ Folder Structure**  

	Organizes exported data based on Gmail labels with a clear hierarchy:

	```
	Exported Emails
	    ├── YOUR_LABEL
		│   ├── YYYY-MM-DD_Subject.pdf
		│   ├── Original Emails
		│   │   ├── YYYY-MM-DD_Subject.eml
		│   └── Attachments
		│       ├── YYYY-MM-DD_Subject_Filename.png
		│       └── YYYY-MM-DD_Subject_Document.pdf
	```

- **🪄 Support CID Images**  

	Automatically embeds CID-referenced images into the exported content.  

## Requirements
1. A Google account.

2. Basic knowledge of running terminal commands.

3. Node.js and npm installed on your system.

## User Guide

1. Clone the repository:
	```bash
	git clone https://github.com/HeiTang/Gmail-Archiver.git
	cd Gmail-Archiver
	```

2. Install the dependencies:
	```bash
	npm install
	```

3. Deploy the application:
	```bash
	npm run deploy
	```

4. Open the application:
	```bash
	npm run open
	```

5. Modify the `labelName` and `parentFolderName` variables in the `main.ts` file:
	```json
	const labelName = 'YOUR_LABEL';
	const parentFolderName = 'Exported Emails';
	```


