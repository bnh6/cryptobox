// disbaling logs for cleaner stdout (is this a good thing???)
import log from "../services/LogService";
log.transports.file.level = false;
log.transports.console.level = false;