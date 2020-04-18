const zxcvbn = require("zxcvbn");
// import zxcvbn from "zxcvbn";
import { ipcRenderer } from "electron";
import { constants } from "../utils/constants";
import * as querystring from "querystring";
import { remote } from "electron";
// const path = require('path')
import log from "../utils/LogUtil";
// console.log(window.process.argv)
// let query = querystring.parse(global.location.search);
// let query = querystring.parse(global);
const query = { "?source": "" };
log.info("******************query on Global: ", global);
let source = query["?source"];
log.info(`*******************source folder ${source}`);

const passwd = document.getElementById("passwd");
const passwdLabel = document.getElementById("passwdLabel");
const passwwdForm = document.getElementById("PasswordForm");
const feedback = document.getElementById("passwdFeedback");
const save = document.getElementById("saveBtn");
const cancel = document.getElementById("cancelBtn");

// adjusting the label
passwdLabel.innerHTML = `Password for folder "${source}"`;

function closeWindow() {
  var window = remote.getCurrentWindow();
  window.close();
}

cancel.onclick = () => {
  closeWindow();
};

function submit_password_form() {
  var args = {
    password: passwd.innerText,
    source: source,
  };
  var result = ipcRenderer.send(constants.IPC_SAVE_PASSWOD, args);
  console.log("returned data", result);

  // notify("Password saved with success")
  ipcRenderer.sendSync(constants.IPC_NOTIFICATION, {
    message: "Password saved with success",
  });

  closeWindow();
  return false;
}

save.onclick = submit_password_form;
passwwdForm.onsubmit = submit_password_form;

passwd.onkeypress = () => {
  const resp = zxcvbn(passwd.innerText);
  // console.log(resp)
  // value = "\nscore = " + resp.score;
  var value = "";
  if (resp.feedback.suggestions != "")
    value += "suggestion = " + resp.feedback.suggestions + "\n\n";
  if (resp.feedback.warning != "")
    value += "feedback = " + resp.feedback.warning + "\n\n";
  value +=
    "time to crack online = " +
    resp.crack_times_display.online_no_throttling_10_per_second;
  value +=
    "\ntime to crack offline = " +
    resp.crack_times_display.offline_fast_hashing_1e10_per_second;
  feedback.innerText = value;

  let static_class = "col-md-5 ";

  resp.score;
  const badge = defineBadge(resp.score);

  feedback.className = `${static_class}${badge}`;

  console.log(feedback.innerText);
};

function defineBadge(respScore: any): string {
  const badges: any = {
    0: "badge-danger",
    1: "badge-warning",
    2: "badge-secondary",
    3: "badge-info",
    4: "badge-success",
  };
  return badges[respScore] ? badges[respScore] : "";
}

// function notify(message) {
//     const myNotification =
//         new window.Notification(constants.WINDOWS_TITLE, {
//             body: message,
//             silent: true,
//             icon: path.join(__dirname, "../../static/resources/cloud-enc.png"),

//         });

//     myNotification.onclick = () => {
//         console.log('Notification clicked')
//     }
// }
