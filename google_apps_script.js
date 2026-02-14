// 1. Copy this code to script.google.com
// 2. Click "Deploy" > "New deployment"
// 3. Select type: "Web app"
// 4. Description: "LINE Notify"
// 5. Execute as: "Me"
// 6. Who has access: "Anyone"
// 7. Copy the "Web app URL"

// FIXED TOKEN: Added missing leading slash
const LINE_ACCESS_TOKEN = "/0yAbiN1sLUZZqMfD9pKzQtlV4jI3PToY92PFqqbrsr+rphhrO4IeAvhX0lDQ40d3I9ZzZTJo2OTc3+bduJo/mR+a+oQsi4Wi2AxUs7AC1uMQh0rEc7rEQT5ifUv7etjkUoX7g+Af8BWsiX0E9KSFQdB04t89/1O/w1cDnyilFU=";
const LINE_USER_ID = "U92d24276164f7f05e8e0bfab6cbaef05";

function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);
        console.log("Received data:", data);

        // Format Message
        const message =
            "📦 New Order Received\n\n" +
            "👤 Customer: " + (data.name || "N/A") + "\n" +
            "📞 Phone: " + (data.phone || "N/A") + "\n" +
            "🛒 Service: " + (data.service || "N/A") + "\n" +
            "🕒 Date: " + (data.date || "N/A") + " " + (data.time || "");

        const response = sendLinePush(message);
        const resText = response.getContentText();
        console.log("LINE Response:", resText);

        return ContentService.createTextOutput(JSON.stringify({ status: "success", line_response: resText }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        console.error("Error:", error.toString());
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

function sendLinePush(text) {
    const url = "https://api.line.me/v2/bot/message/push";
    const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + LINE_ACCESS_TOKEN
    };

    const payload = {
        "to": LINE_USER_ID,
        "messages": [
            {
                "type": "text",
                "text": text
            }
        ]
    };

    const options = {
        "method": "post",
        "headers": headers,
        "payload": JSON.stringify(payload),
        "muteHttpExceptions": true
    };

    return UrlFetchApp.fetch(url, options);
}
