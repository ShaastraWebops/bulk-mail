var SibApiV3Sdk = require("sib-api-v3-sdk");
var MAIL_LIST2 = require("./mail-list");
var EmailValidator = require("email-validator");
var dotenv = require("dotenv");
dotenv.config();

SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
  process.env.API_KEY;

const fromMail = ""; // From email
const fromName = ""; // From Name
const subject = ""; // Mail Subject

const htmlContent = ``;

let MAILS = MAIL_LIST2.split(",");
// MAILS = MAILS.slice(0, 1000);

let MAILS = []; // Add the test mail here and comment line 15

MAILS = MAILS.filter((_mail) => EmailValidator.validate(_mail) === true);
let INVALID_EMAILS = MAILS.filter(
  (_mail) => EmailValidator.validate(_mail) === false
);
console.log(MAILS);

let i = 0;
const sendBulkMail = async () => {
  while (i <= MAILS.length) {
    let MAILSTEMPLIST = MAILS.slice(i, i + 80);
    let emails = [];
    for (const email of MAILSTEMPLIST) {
      emails.push({ email: email });
    }
    console.log(emails);
    new SibApiV3Sdk.TransactionalEmailsApi()
      .sendTransacEmail({
        sender: { email: fromMail, name: fromName },
        subject: subject,
        htmlContent: htmlContent,
        to: [
          {
            email: "webops@shaastra.org",
          },
        ],
        bcc: emails,
        // attachment: [
        //   {
        //     url: "",   // Upload the file to S3 (Public Access) and put the link
        //     name: "",  // File name with extension
        //   },
        // ],
      })
      .then(
        function (data) {
          console.log(data);
        },
        function (error) {
          console.error(i + error);
        }
      );
    i = i + 80;
    await sleep(2000);
  }
};

async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

console.log(INVALID_EMAILS);
sendBulkMail();
