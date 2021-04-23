const axios = require("axios").default;
const { protectedRoute, responses } = require("../context");

const VERIFY_TOKEN = "hkteam";
const PAGE_ACCESS_TOKEN =
	"EAAFQOZBcefD4BACy7A5I8fZAZC2ecgfnq0dJgbqnFgFhLal26UXecV2fZATy4aoHvmxIAYec5kWrsaEvKSTJK7daiZCL9a7QQ3WyAgU7M2g5EkziL4hJkdUt07VfgFtqXBOfJ7LK32qRJvCHUEqODrYazKAIZBXVFh1Ub4XmOMTAWF2ljsAv8neT4FTPVXDW8ZD";

// Handles messages events
const handleMessage = (sender_psid, received_message) => {
	let response;

	// Check if the message contains text
	if (received_message.text) {
		// Create the payload for a basic text message
		response = {
			text: `You sent the message: "${received_message.text}". Now send me an image!`
		};
	} else if (received_message.attachments) {
		// Gets the URL of the message attachment
		let attachment_url = received_message.attachments[0].payload.url;
		response = {
			attachment: {
				type: "template",
				payload: {
					template_type: "generic",
					elements: [
						{
							title: "Is this the right picture?",
							subtitle: "Tap a button to answer.",
							image_url: attachment_url,
							buttons: [
								{
									type: "postback",
									title: "Yes!",
									payload: "yes"
								},
								{
									type: "postback",
									title: "No!",
									payload: "no"
								}
							]
						}
					]
				}
			}
		};
	}

	// Sends the response message
	callSendAPI(sender_psid, response);
};

// Handles messaging_postbacks events
const handlePostback = (sender_psid, received_postback) => {
	let response;

	// Get the payload for the postback
	let payload = received_postback.payload;

	// Set the response based on the postback payload
	if (payload === "yes") {
		response = { text: "Thanks!" };
	} else if (payload === "no") {
		response = { text: "Oops, try sending another image." };
	}
	// Send the message to acknowledge the postback
	callSendAPI(sender_psid, response);
};

// Sends response messages via the Send API
const callSendAPI = async (sender_psid, response) => {
	let request_body = JSON.stringify({
		recipient: {
			id: sender_psid
		},
		message: response
	});
	let url = `https://graph.facebook.com/v2.6/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

	const res = await axios.post(url, request_body, {
		headers: {
			"Content-Type": "application/json"
		}
	});

	console.log("🚀 ~ callSendAPI ~ res", res);
};

const receiveWebhook = async ctx => {
	let body = ctx.request.body;

	if (body.object === "page") {
		body.entry.forEach(function(entry) {
			let webhook_event = entry.messaging[0];
			console.log(webhook_event);

			// Get the sender PSID
			let sender_psid = webhook_event.sender.id;
			console.log("Sender PSID: " + sender_psid);

			// Check if the event is a message or postback and
			// pass the event to the appropriate handler function
			if (webhook_event.message) {
				handleMessage(sender_psid, webhook_event.message);
			} else if (webhook_event.postback) {
				handlePostback(sender_psid, webhook_event.postback);
			}
		});

		ctx.status = 200;
		ctx.body = "EVENT_RECEIVED";
	} else {
		ctx.status = 404;
	}
};

const verification = async ctx => {
	let mode = ctx.query["hub.mode"];
	let token = ctx.query["hub.verify_token"];
	let challenge = ctx.query["hub.challenge"];

	if (mode && token) {
		if (mode === "subscribe" && token === VERIFY_TOKEN) {
			console.log("WEBHOOK_VERIFIED");
			ctx.status = 200;
			ctx.body = challenge;
		} else {
			ctx.status = 403;
		}
	}
};

module.exports = {
	attach(router) {
		router.get("/facebook/webhook", ctx =>
			protectedRoute("user", verification, ctx)
		);
		router.post("/facebook/webhook", ctx =>
			protectedRoute("user", receiveWebhook, ctx)
		);
	}
};

// Install ngrok
// Nhap lenh: ngrok http 1234
// Copy url https: ${URL}/facebook/webhook
// Copy link tren dien vao webhook tren fb: https://developers.facebook.com/apps/369693187537982/webhooks/?business_id=251414779696904
// https://rharshad.com/building-publishing-facebook-messenger-bot/
