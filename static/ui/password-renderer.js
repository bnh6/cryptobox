
var zxcvbn = require('zxcvbn');

const { ipcRenderer } = require("electron")
const constants = require('../../src/utils/constants');
const querystring = require('querystring');
const remote = require('electron').remote;
// const path = require('path')

// console.log(window.process.argv)
let query = querystring.parse(global.location.search);
let source = query['?source']
console.log(`source folder ${source}`)


var passwd = document.getElementById("passwd")
var passwdLabel = document.getElementById("passwdLabel")
var passwwdForm = document.getElementById("PasswordForm")
var feedback = document.getElementById("passwdFeedback")
var save = document.getElementById("saveBtn")
var cancel = document.getElementById("cancelBtn")


// adjusting the label
passwdLabel.innerHTML = 'Password for folder "' + source + '"'


function closeWindow() {
    var window = remote.getCurrentWindow();
    window.close();
}

cancel.onclick = () => {
    closeWindow();
}

function submit_password_form(){
    var args = {
        "password": passwd.value,
        "source": source,
    }
    var result = ipcRenderer.send(constants.IPC_SAVE_PASSWOD, args)
    console.log("returned data", result)

    // notify("Password saved with success") 
    ipcRenderer.sendSync(constants.IPC_NOTIFICATION, {"message": "Password saved with success"});
    
    closeWindow()
    return false
}

save.onclick = submit_password_form;
passwwdForm.onsubmit = submit_password_form;

passwd.onkeypress = () => {
    resp = zxcvbn(passwd.value)
    // console.log(resp)
    // value = "\nscore = " + resp.score;
    var value = ""
    if (resp.feedback.suggestions != "") value += "suggestion = " + resp.feedback.suggestions + '\n\n';
    if (resp.feedback.warning != "") value += "feedback = " + resp.feedback.warning + "\n\n";
    value += "time to crack online = " + resp.crack_times_display.online_no_throttling_10_per_second;
    value += "\ntime to crack offline = " + resp.crack_times_display.offline_fast_hashing_1e10_per_second;
    feedback.value = value

    let static_class = "col-md-5 "

    switch (resp.score) {
        case 0:
            feedback.className = static_class + "badge-danger";
            break;
        case 1:
            feedback.className = static_class + "badge-warning";
            break;
        case 2:
            feedback.className = static_class + "badge-secondary";
            break;
        case 3:
            feedback.className = static_class + "badge-info";
            break;
        case 4:
            feedback.className = static_class + "badge-success";
            break;
        default:
            break;
    }

    console.log(feedback.value)

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