import nodeLogger from "node-color-log";
nodeLogger.setDate(() => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
    return formattedDate;
});
const logger = nodeLogger;
export default logger;
