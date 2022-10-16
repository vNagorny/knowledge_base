/* Function 1: creates a Menu when the script loads */

function onOpen() {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  // Adds a menu item with a single drop-down 'Email report'
  activeSpreadsheet.addMenu(
      "Email this report", [{
        name: "Email report", functionName: "emailAsPDF"
      }]);
}

/* Function 2: sends Spreadsheet in an email as a PDF */

// reworked from ctrlq.org/code/19869-email-google-spreadsheets-pdf //

function emailAsPDF() {

  // Send the PDF of the spreadsheet to this email address
  var email = "volodymyr.n@getsauce.com,daily-report-aaaadzlsj7ffmd7h5a2xybmgna@say2eatrd.slack.com, liran@getsauce.com,oran@getsauce.com";
// bi_testing-aaaahgahq5vig2jbap6zes34dq@say2eatrd.slack.com
// daily-report-aaaadzlsj7ffmd7h5a2xybmgna@say2eatrd.slack.com
  // Gets the URL of the currently active spreadsheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var url = ss.getUrl();
  url = url.replace(/edit$/,'');

  // Subject of email message
  // The date time string can be formatted using Utilities.formatDate method
  // see examples at https://developers.google.com/apps-script/reference/utilities/utilities#formatdatedate-timezone-format
  // and http://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html
  var subject = "Daily KPI Report - " + Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd");

  // Body of email message
  var body = "\n\n The report has been updated \n \n Link is here https://docs.google.com/spreadsheets/d/12FlorgV7cTDBBP1JHBPR5w8EdZhUEWTDYWvNnlGO3qc/edit#gid=1976493263";
  var htmlBody = HtmlService.createTemplateFromFile('html_b');  
  var email_html = htmlBody.evaluate().getContent();

  /* Specify PDF export parameters
  // Taken from: code.google.com/p/google-apps-script-issues/issues/detail?id=3579
    exportFormat = pdf / csv / xls / xlsx
    gridlines = true / false
    printtitle = true (1) / false (0)
    size = A4 / letter /legal
    fzr (repeat frozen rows) = true / false
    portrait = true (1) / false (0)
    fitw (fit to page width) = true (1) / false (0)
    add gid if to export a particular sheet - 0, 1, 2,..
  */

  var url_ext = 'export?exportFormat=pdf' // export as pdf
                + '&format=pdf'           // export as pdf
                + '&size=letter'              // paper size
                + '&portrait=true'        // page orientation
                + '&fitw=true'            // fits width; false for actual size
                + '&sheetnames=false'     // hide optional headers and footers
                + '&printtitle=false'     // hide optional headers and footers
                + '&pagenumbers=false'    // hide page numbers
                + '&gridlines=false'      // hide gridlines
                + '&fzr=false'            // do not repeat row headers
                + '&gid=1976493263';               // the sheet's Id

  var token = ScriptApp.getOAuthToken();

  // Convert worksheet to PDF
  var response = UrlFetchApp.fetch(url + url_ext)

  //convert the response to a blob
  report_name = "Daily KPI Report - " + Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd") + ".pdf"
  file = response.getBlob().setName(report_name);

  // Send the email with the PDF attachment. Google sets limits on the number of emails you can send: https://docs.google.com/macros/dashboard
  if (MailApp.getRemainingDailyQuota() > 0)
     MailApp.sendEmail({
       to: email,
       subject: subject,
       htmlBody: email_html,
      attachments:[file]});

}
