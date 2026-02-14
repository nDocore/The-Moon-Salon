const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();

// Access environment variables securely
// Trigger using: firebase functions:config:set line.access_token="YOUR_TOKEN" line.user_id="YOUR_USER_ID"
// In older Firebase Functions, use functions.config().line.access_token
// In Node 10+ / modern environments with .env support, process.env can be used if configured.
// We will use functions.config() as it's the standard for Firebase CLI configuration.

const getLineConfig = () => {
    // Try to get from functions config first (standard for Firebase)
    const config = functions.config().line;
    return {
        accessToken: config ? config.access_token : process.env.LINE_CHANNEL_ACCESS_TOKEN,
        userId: config ? config.user_id : process.env.LINE_USER_ID
    };
};

exports.sendOrderNotification = functions.database.ref("/moon/bookings/{bookingId}")
    .onCreate(async (snapshot, context) => {
        const booking = snapshot.val();
        const bookingId = context.params.bookingId;

        console.log(`New booking created: ${bookingId}`);

        const { accessToken, userId } = getLineConfig();

        if (!accessToken) {
            console.error("Missing LINE_CHANNEL_ACCESS_TOKEN (line.access_token). Notification skipped.");
            return null;
        }

        if (!userId) {
            console.error("Missing LINE_USER_ID (line.user_id). Notification skipped.");
            return null;
        }

        // Format message
        // 📦 New Order Received
        // 👤 Customer: {customerName}
        // 📞 Phone: {phone}
        // 🛒 Items: {items}
        // 🕒 Date: {orderDate}

        const messageText = `📦 New Order Received

👤 Customer: ${booking.name || "N/A"}
📞 Phone: ${booking.phone || "N/A"}
🛒 Service: ${booking.serviceName || "N/A"}
🕒 Date: ${booking.date || "N/A"} ${booking.time || ""}`;

        const message = {
            to: userId,
            messages: [{
                type: "text",
                text: messageText
            }]
        };

        try {
            const response = await axios.post("https://api.line.me/v2/bot/message/push", message, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            console.log("LINE notification sent successfully:", response.data);
            return response.data;

        } catch (error) {
            console.error("Error sending LINE notification:", error.response ? error.response.data : error.message);
            return null; // Don't break the flow, just log the error
        }
    });
