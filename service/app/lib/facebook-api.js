const { FB } = require("fb");
const _ = require("lodash");
const axios = require("axios").default;
const transform = require("./transform-data");
const config = require("../config");

const requestAxios = axios.create({
	baseURL: "https://graph.facebook.com"
});

const handleResponse = {
	success: data => {
		return { status: true, data };
	},
	failed: error => {
		return { status: false, error };
	}
};

const request = (...args) => {
	return new Promise((resolve, reject) => {
		function callback(response) {
			if (!response || response.error) {
				reject(response.error || new Error("unknown error"));
			} else {
				resolve(response);
			}
		}

		args.push(callback);
		FB.api.call(this, ...args);
	});
};

const getTokenLongLive = async access_token => {
	const appId = config.auth.facebook.clientID;
	const appSecret = config.auth.facebook.clientSecret;
	let result = null;
	let url = `/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&grant_type=fb_exchange_token&fb_exchange_token=${access_token}`;

	try {
		const response = await requestAxios.get(url);
		result = response.data;
	} catch (err) {
		const { error } = err.response.data;
		const { code, message } = error;
		if (code == 190) {
			result = { code, message };
		} else {
			result = err;
		}
		return handleResponse.failed(error);
	}

	return handleResponse.success(result);
};

const getListPage = async (user_id, access_token) => {
	const limit = 100;
	const fields = "id,name,access_token";
	let res = null;
	let pages = [];

	try {
		res = await request(`/${user_id}/accounts`, "GET", {
			limit,
			fields,
			access_token
		});
	} catch (error) {
		return handleResponse.failed(error);
	}

	pages = transform.fb.pages(res.data);
	return handleResponse.success(pages);
};

const getSomeMessages = async (conversation_id, access_token, limit) => {
	const fields =
		"message,from,created_time,sticker,tags,attachments{image_data,mime_type,name,id,file_url}";
	let res = null;
	let messages = [];

	try {
		res = await request(`${conversation_id}/messages`, "GET", {
			access_token,
			limit,
			fields
		});
	} catch (error) {
		return handleResponse.failed(error);
	}

	let items = res.data && res.data.length ? res.data : [];
	if (items.length) {
		messages = transform.fb.messages(items, access_token);
	}

	return handleResponse.success(messages);
};

const getAllMessages = async (conversation_id, access_token) => {
	const limit = 100;
	const fields =
		"message,from,created_time,sticker,tags,attachments{image_data,mime_type,name,id,file_url}";
	let res = {};
	let items = [];
	let messages = [];

	do {
		try {
			res = await request(`${conversation_id}/messages`, "GET", {
				access_token,
				limit,
				fields,
				after: res.paging ? res.paging.cursors.after : undefined
			});
		} catch (error) {
			return handleResponse.failed(error);
		}

		if (res.data && res.data.length) {
			items.push(...res.data);
		} else {
			break;
		}
	} while (res.paging.next);

	messages = transform.fb.messages(items, access_token);
	return handleResponse.success(messages);
};

const getListConversation = async (page_id, access_token) => {
	const limit = 100;
	const fields = "senders, snippet,link, message_count, unread_count ";
	let res = {};
	let items = [];
	let conversations = [];

	do {
		try {
			res = await request(`${page_id}/conversations`, "GET", {
				access_token,
				limit,
				fields,
				after: res.paging ? res.paging.cursors.after : undefined
			});
		} catch (error) {
			return handleResponse.failed(error);
		}

		if (res.data && res.data.length) {
			items.push(...res.data);
		} else {
			break;
		}
	} while (res.paging.next);

	conversations = transform.fb.conversations(items, access_token);
	return handleResponse.success(conversations);
};

const getListLivestream = async (page_id, access_token) => {
	const limit = 100;
	const fields = `id, title, description, status, live_views, from, comments.limit(${limit}){id},reactions.limit(${limit}){id},creation_time,stream_url,embed_html`;
	let res = {};
	let items = [];
	let listLivestream = [];

	do {
		try {
			res = await request(`${page_id}/live_videos`, "GET", {
				access_token,
				limit: 100,
				fields,
				after: res.paging ? res.paging.cursors.after : undefined
			});
		} catch (error) {
			return handleResponse.failed(error);
		}

		if (res.data && res.data.length) {
			items.push(...res.data);
		} else {
			break;
		}
	} while (res.paging.next);

	listLivestream = transform.fb.listLivestream(items, access_token);
	return handleResponse.success(listLivestream);
};

const getLivestreamDetails = async (livestream_id, access_token) => {
	const limit = 100;
	const fields = `id,title,status,description,embed_html,comments.limit(${limit}){id,message,from,created_time},reactions.limit(${limit}){id,name,type},creation_time,live_views`;
	let res = null;
	let livestream = null;

	try {
		res = await request(`${livestream_id}`, "GET", {
			access_token,
			fields
		});
	} catch (error) {
		return handleResponse.failed(error);
	}

	livestream = transform.fb.livestream(res, access_token);
	return handleResponse.success(livestream);
};

const getSomeCommentsLivestream = async (
	livestream_id,
	access_token,
	limit
) => {
	const fields = `id,message,from`;
	const url = `${livestream_id}/comments?limit=${limit}&order=reverse_chronological`;
	let res = null;
	let comments = [];

	try {
		res = await request(url, "GET", {
			access_token,
			fields
		});
	} catch (error) {
		return handleResponse.failed(error);
	}

	comments = transform.fb.comments(res.data, access_token);
	return handleResponse.success(comments);
};

const getPostsPublish = async (page_id, access_token) => {
	const limit = 100;
	const fields = `id,message,created_time,comments.limit(${limit}){id},reactions.limit(${limit}){id},full_picture,story,permalink_url,shares,attachments{media,type,subattachments}`;
	let res = {};
	let items = [];
	let posts = [];
	let isPublished = true;

	do {
		try {
			res = await request(`${page_id}/published_posts`, "GET", {
				access_token,
				limit,
				fields,
				after: res.paging ? res.paging.cursors.after : undefined
			});
		} catch (error) {
			return handleResponse.failed(error);
		}

		if (res.data && res.data.length) {
			items.push(...res.data);
		} else {
			break;
		}
	} while (res.paging.next);

	posts = transform.fb.posts(items, access_token, isPublished);
	return handleResponse.success(posts);
};

const getPostsScheduled = async (page_id, access_token) => {
	const limit = 100;
	const fields = `id,message,created_time,comments.limit(${limit}){id},reactions.limit(${limit}){id},full_picture,story,permalink_url,shares`;
	let res = {};
	let items = [];
	let posts = [];
	let isPublished = false;

	do {
		try {
			res = await request(`${page_id}/scheduled_posts`, "GET", {
				access_token,
				limit,
				fields,
				after: res.paging ? res.paging.cursors.after : undefined
			});
		} catch (error) {
			return handleResponse.failed(error);
		}

		if (res.data && res.data.length) {
			items.push(...res.data);
		} else {
			break;
		}
	} while (res.paging.next);

	posts = transform.fb.posts(items, access_token, isPublished);
	return handleResponse.success(posts);
};

const getPostDetails = async (page_post_id, access_token) => {
	const limit = 100;
	const fields = `id,message,comments.limit(${limit}){id,message,attachment,from,created_time},reactions.limit(${limit}){id,name,type},full_picture,created_time,permalink_url,shares`;
	let res = null;
	let post = null;

	try {
		res = await request(`${page_post_id}`, "GET", {
			access_token,
			fields
		});
	} catch (error) {
		return handleResponse.failed(error);
	}

	post = transform.fb.post(res, access_token);
	return handleResponse.success(post);
};

const publishPost = async params => {
	const { pagePostId, accessToken } = params;
	const url = `/${pagePostId}?is_published=true&access_token=${accessToken}`;
	let res = null;
	let post = null;

	try {
		res = await requestAxios.post(url);
	} catch (error) {
		return handleResponse.failed(error);
	}

	post = res.data;
	return handleResponse.success(post);
};

const getAllCommentInPostById = async (page_post_id, access_token) => {
	const fields = `comments{id}`;
	let res = null;
	let comments = [];

	try {
		res = await request(`${page_post_id}`, "GET", {
			access_token,
			fields
		});
	} catch (error) {
		return handleResponse.failed(error);
	}

	comments = res.comments.data || [];
	return handleResponse.success(comments);
};

const replyAllComment = async params => {
	const { pagePostId, accessToken, message } = params;
	let comments = [];

	try {
		const result = await getAllCommentInPostById(pagePostId, accessToken);
		if (result.status) {
			comments = result.data;
		}
	} catch (error) {
		return handleResponse.failed(error);
	}

	if (comments.length) {
		console.log(123);

		comments = await Promise.all(
			comments.map(async comment => {
				let temp = await request(`${comment.id}/comments`, "POST", {
					message,
					access_token: accessToken
				});
				console.log(
					"🚀 ~ file: facebook-api.js ~ line 343 ~ temp",
					temp
				);

				return temp;
			})
		);
	}

	return handleResponse.success(comments);
};

const createFeedPost = async params => {
	const { pageId, accessToken, message, scheduledPublishTime } = params;
	let url = `/${pageId}/feed?message=${message}&access_token=${accessToken}`;

	let res = null;
	let post = null;

	if (scheduledPublishTime) {
		url = `${url}&published=false&scheduled_publish_time=${scheduledPublishTime}`;
	}

	try {
		res = await requestAxios.post(url);
	} catch (error) {
		console.log("Error", error);
		return handleResponse.failed(error);
	}

	post = res.data;
	return handleResponse.success(post);
};

const createPhotoPost = async params => {
	const {
		pageId,
		accessToken,
		message,
		images,
		scheduledPublishTime
	} = params;
	let photoIds = [];
	let preUrlPhoto = "";
	let preUrlFeed = "";
	let photos = null;
	let res = null;

	if (!images.length)
		return handleResponse.failed({ message: "Images is empty", code: 400 });

	if (images.length > 1) {
		// Post Photo with multiple image
		preUrlPhoto = `/${pageId}/photos?access_token=${accessToken}&published=false`;

		// Get Photo ids
		photoIds = await Promise.all(
			images.map(async link => {
				const { data } = await requestAxios.post(
					`${preUrlPhoto}&url=${link}`
				);
				return { media_fbid: data.id };
			})
		);

		// Create Post Feed with attached media
		preUrlFeed = `/${pageId}/feed?message=${message}&access_token=${accessToken}`;
		if (scheduledPublishTime) {
			preUrlFeed = `${preUrlFeed}&published=false&scheduled_publish_time=${scheduledPublishTime}`;
		}

		try {
			res = await requestAxios.post(preUrlFeed, {
				attached_media: photoIds
			});
		} catch (error) {
			return handleResponse.failed(error);
		}

		photos = res.data;
	} else {
		// Post only photo on Post
		preUrlPhoto = `/${pageId}/photos?url=${images[0]}&caption=${message}&access_token=${accessToken}`;
		if (scheduledPublishTime) {
			preUrlPhoto = `${preUrlPhoto}&published=false&scheduled_publish_time=${scheduledPublishTime}`;
		}

		try {
			res = await requestAxios.post(preUrlPhoto);
		} catch (error) {
			return handleResponse.failed(error);
		}

		photos = res.data;
	}

	return handleResponse.success(photos);
};

const updatePost = async params => {
	const { accessToken, pagePostId, message } = params;
	const url = `/${pagePostId}?message=${message}&access_token=${accessToken}`;
	let res = null;
	let post = null;

	try {
		res = await requestAxios.post(url);
	} catch (error) {
		return handleResponse.failed(error);
	}

	post = res.data;
	return handleResponse.success(post);
};

const deletePost = async params => {
	const { accessToken, pagePostId } = params;
	const url = `/${pagePostId}?access_token=${accessToken}`;
	let res = null;
	let post = null;
	try {
		res = await requestAxios.delete(url);
	} catch (error) {
		return handleResponse.failed(error);
	}

	post = res.data;
	return handleResponse.success(post);
};

const sendMessage = async params => {
	const { messagingType, recipientId, message, accessToken } = params;
	const messaging_type = messagingType ? messagingType : "RESPONSE";
	const id = recipientId;
	const image = message.image ? message.image : "";
	const text = message.text ? message.text : "";

	const url = `/v9.0/me/messages?access_token=${accessToken}`;
	let payload = { messaging_type, recipient: { id } };
	let messages = [];
	let errors = [];
	let res = null;

	if (text) {
		try {
			payload.message = { text };
			res = await requestAxios.post(url, payload);
			if (res.data) messages.push(res.data);
		} catch (error) {
			errors.push(error);
		}
	}

	if (image) {
		payload.message = {
			attachment: {
				type: "image",
				payload: { url: image, is_reusable: true }
			}
		};

		try {
			res = await requestAxios.post(url, payload);
			if (res.data) messages.push(res.data);
		} catch (error) {
			errors.push(error);
		}
	}

	if (errors.length) return handleResponse.failed(errors);

	return handleResponse.success(messages);
};

const getProfile = async (user_id, access_token) => {
	const fields = "birthday,email,name,picture,id";
	let res = null;
	let profile = {};

	try {
		res = await request("/me", "GET", { fields, access_token });
	} catch (error) {
		return handleResponse.failed(error);
	}

	profile = transform.fb.profile(res);
	return handleResponse.success(profile);
};

module.exports = {
	getTokenLongLive,
	getProfile,
	getPostsPublish,
	getPostsScheduled,
	getPostDetails,
	getListLivestream,
	getSomeCommentsLivestream,
	getLivestreamDetails,
	getListConversation,
	getListPage,
	getAllMessages,
	getSomeMessages,
	createFeedPost,
	createPhotoPost,
	replyAllComment,
	publishPost,
	updatePost,
	deletePost,
	sendMessage
};
