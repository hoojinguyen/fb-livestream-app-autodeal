// require("dotenv").config();
const { FB } = require("fb");
const _ = require("lodash");
const axios = require("axios").default;

// const config = require("../config");

// FB.setAccessToken(config.auth.facebook.accessToken);

const requestAxios = axios.create({
	baseURL: "https://graph.facebook.com"
});

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

const getDefaultAvatar = (user_id, access_token) => {
	return `//graph.facebook.com/${user_id}/picture?access_token=${access_token}`;
};

const getAvatar = async (user_id, access_token) => {
	const defaultAvatar = `//graph.facebook.com/${user_id}/picture?access_token=${access_token}`;
	try {
		const res = await request(`${user_id}`, "GET", { access_token });
		return res.profile_pic || defaultAvatar;
	} catch (error) {
		// console.log("error: ", error);
		return defaultAvatar;
	}
};

const getAvatarUnique = async (sender, lookup, access_token) => {
	return new Promise((resolve, reject) => {
		const callback = res => {
			if (!res || res.error) {
				reject(res.error || new Error("unknown error"));
			} else {
				resolve(res);
			}
		};

		let temp = null;
		if (lookup[sender.id]) {
			temp = lookup[sender.id];
		} else {
			temp = getAvatar(sender.id, access_token);
			lookup[sender.id] = temp;
		}
		callback({ avatar: temp, lookup });
	});
};

const getPagesByFacebookUserId = async (user_id, access_token) => {
	const limit = 100;
	const fields = "id,name,access_token";
	const res = await request(`/${user_id}/accounts`, "GET", {
		limit,
		fields,
		access_token
	});

	return res.data.map(el => ({
		id: el.id,
		name: el.name,
		accessToken: el.access_token
	}));
};

const getMessagesByConversationId = async (conversation_id, access_token) => {
	const limit = 100;
	const fields =
		"message,from,created_time,sticker,tags,attachments{image_data,mime_type,name,id,file_url}";
	let res = {};
	let items = [];

	do {
		res = await request(`${conversation_id}/messages`, "GET", {
			access_token,
			limit,
			fields,
			after: res.paging ? res.paging.cursors.after : undefined
		});
		if (res.data && res.data.length) {
			items.push(...res.data);
		} else {
			break;
		}
	} while (res.paging.next);

	// Check Duplicate Avatar , only call api avatar of sender and receiver, and save lookup
	let lookup = {};
	const messages = await Promise.all(
		items.map(async item => {
			let result = await getAvatarUnique(item.from, lookup, access_token);
			lookup = result.lookup;

			let attachments = item.attachments ? item.attachments.data : [];
			if (attachments.length) {
				attachments = attachments.map(el => {
					return {
						id: el.id,
						name: el.name,
						type: el.mime_type,
						image: el.image_data ? el.image_data.url : null,
						file: el.file_url ? el.file_url : null
					};
				});
			}

			return {
				id: item.id,
				attachments,
				message: item.message,
				createdAt: item.created_time,
				accessToken: access_token,
				tags: item.tags ? item.tags.data : [],
				sticker: item.sticker ? item.sticker : null,
				sender: { ...item.from, avatar: await result.avatar }
			};
		})
	);

	return _.reverse(messages);
};

const getConversationsByPageId = async (page_id, access_token) => {
	const limit = 100;
	const fields = "senders, snippet,link, message_count, unread_count ";
	let res = {};
	let items = [];

	do {
		res = await request(`${page_id}/conversations`, "GET", {
			access_token,
			limit,
			fields,
			after: res.paging ? res.paging.cursors.after : undefined
		});
		if (res.data && res.data.length) {
			items.push(...res.data);
		} else {
			break;
		}
	} while (res.paging.next);

	const conversations = Promise.all(
		items.map(async item => {
			let sender = item.senders.data[0];
			sender = {
				...sender,
				avatar: await getAvatar(sender.id, access_token)
			};
			return {
				id: item.id,
				sender,
				message: item.snippet,
				link: item.link,
				messageCount: item.message_count,
				unreadCount: item.unread_count,
				accessToken: access_token
			};
		})
	);

	return conversations;
};

const getLiveStreamsByPageId = async (page_id, access_token) => {
	const limit = 100;
	const fields = `id, title, description, status, live_views, from, comments.limit(${limit}){id},reactions.limit(${limit}){id},creation_time,stream_url,embed_html`;
	let res = {};
	let items = [];

	// Get All Data with paging
	do {
		res = await request(`${page_id}/live_videos`, "GET", {
			access_token,
			limit,
			fields,
			after: res.paging ? res.paging.cursors.after : undefined
		});

		if (res.data && res.data.length) {
			items.push(...res.data);
		} else {
			break;
		}
	} while (res.paging.next);

	// Format Data
	return items.map(item => {
		return {
			id: item.id,
			title: item.title ? item.title : "",
			description: item.description ? item.description : "",
			status: item.status,
			from: item.from,
			totalComment: item.comments ? item.comments.data.length : 0,
			totalReaction: item.reactions ? item.reactions.data.length : 0,
			liveViewer: item.live_views,
			streamUrl: item.stream_url,
			videoEmbed: item.embed_html,
			createdAt: item.creation_time,
			accessToken: access_token
		};
	});
};

const getLiveStreamDetailById = async (livestream_id, access_token) => {
	const limit = 100;
	const fields = `id,title,status,description,embed_html,comments.limit(${limit}){id,message,from,created_time},reactions.limit(${limit}){id,name,type},creation_time,live_views`;

	let res = await request(`${livestream_id}`, "GET", {
		access_token,
		fields
	});

	// Check Duplicate Avatar , only call api avatar of sender and receiver, and save lookup
	let lookup = {};
	let comments = res.comments ? res.comments.data : [];
	if (comments.length) {
		comments = await Promise.all(
			comments.map(async el => {
				const result = await getAvatarUnique(
					el.from,
					lookup,
					access_token
				);
				lookup = result.lookup;

				return {
					id: el.id,
					message: el.message,
					createdAt: el.created_time,
					sender: {
						...el.from,
						avatar: await result.avatar
					}
				};
			})
		);
	}

	return {
		id: res.id,
		title: res.title,
		status: res.status,
		description: res.description,
		videoEmbed: res.embed_html,
		liveViewer: res.live_views,
		createdAt: res.creation_time,
		accessToken: access_token,
		comments: comments,
		reactions: res.reactions ? res.reactions.data : []
	};
};

const getCommentLivestreamById = async (livestream_id, access_token, limit) => {
	try {
		const fields = `id,message,from`;
		const url = `${livestream_id}/comments?limit=${limit}&order=reverse_chronological`;
		let res = await request(url, "GET", {
			access_token,
			fields
		});

		const comments = res.data.map(el => {
			const sender = el.from;
			return {
				id: el.id,
				message: el.message,
				sender: {
					...sender,
					avatar: getDefaultAvatar(sender.id, access_token)
				}
			};
		});
		// return _.keyBy(comments, "id");
		return comments;
	} catch (error) {
		console.log("🚀  ~ error", error);
		return [];
	}
};

const getPostsPublishByPageId = async (page_id, access_token) => {
	const limit = 100;
	const fields = `id,message,created_time,comments.limit(${limit}){id},reactions.limit(${limit}){id},full_picture,story,permalink_url,shares,attachments{media,type,subattachments}`;
	let res = {};
	let items = [];

	do {
		res = await request(`${page_id}/published_posts`, "GET", {
			access_token,
			limit,
			fields,
			after: res.paging ? res.paging.cursors.after : undefined
		});

		if (res.data && res.data.length) {
			items.push(...res.data);
		} else {
			break;
		}
	} while (res.paging.next);

	return items
		.map(item => {
			let images = [];
			if (item.attachments && item.attachments.data.length) {
				item.attachments.data.map(att => {
					if (att.subattachments && att.subattachments.data.length) {
						return att.subattachments.data.map(sub => {
							return images.push({ src: sub.media.image.src });
						});
					}
					return images.push({ src: att.media.image.src });
				});
			}
			return {
				id: item.id,
				message: item.message ? item.message : "",
				totalComment: item.comments ? item.comments.data.length : 0,
				totalReaction: item.reactions ? item.reactions.data.length : 0,
				totalShare: item.shares ? item.shares.count : 0,
				permalinkUrl: item.permalink_url,
				createdAt: item.created_time,
				accessToken: access_token,
				fullPicture: item.full_picture ? item.full_picture : null,
				isVideo: item.story ? true : false,
				isPublic: true,
				images
			};
		})
		.filter(el => !el.isVideo);
};

const getPostsScheduledByPageId = async (page_id, access_token) => {
	const limit = 100;
	const fields = `id,message,created_time,comments.limit(${limit}){id},reactions.limit(${limit}){id},full_picture,story,permalink_url,shares`;
	let res = {};
	let items = [];

	do {
		res = await request(`${page_id}/scheduled_posts`, "GET", {
			access_token,
			limit,
			fields,
			after: res.paging ? res.paging.cursors.after : undefined
		});

		if (res.data && res.data.length) {
			items.push(...res.data);
		} else {
			break;
		}
	} while (res.paging.next);

	return items
		.map(item => {
			let images = [];
			if (item.attachments && item.attachments.data.length) {
				item.attachments.data.map(att => {
					if (att.subattachments && att.subattachments.data.length) {
						return att.subattachments.data.map(sub => {
							return images.push({ src: sub.media.image.src });
						});
					}
					return images.push({ src: att.media.image.src });
				});
			}
			return {
				id: item.id,
				message: item.message ? item.message : "",
				totalComment: item.comments ? item.comments.data.length : 0,
				totalReaction: item.reactions ? item.reactions.data.length : 0,
				totalShare: item.shares ? item.shares.count : 0,
				permalinkUrl: item.permalink_url,
				createdAt: item.created_time,
				accessToken: access_token,
				fullPicture: item.full_picture ? item.full_picture : null,
				isVideo: item.story ? true : false,
				isPublic: false,
				images
			};
		})
		.filter(el => !el.isVideo);
};

const getPostDetailById = async (page_post_id, access_token) => {
	const limit = 100;
	const fields = `id,message,comments.limit(${limit}){id,message,attachment,from,created_time},reactions.limit(${limit}){id,name,type},full_picture,created_time,permalink_url,shares`;

	let res = await request(`${page_post_id}`, "GET", {
		access_token,
		fields
	});

	return {
		id: res.id,
		accessToken: access_token,
		createdAt: res.created_time,
		message: res.message ? res.message : "",
		permalinkUrl: res.permalink_url,
		fullPicture: res.full_picture ? res.full_picture : null,
		totalShare: res.shares ? res.shares.count : 0,
		reactions: res.reactions ? res.reactions.data : [],
		comments: res.comments
			? res.comments.data.map(el => {
					return {
						id: el.id,
						message: el.message ? el.message : "",
						sender: el.from,
						createdAt: el.created_time,
						attachment: el.attachment
							? {
									url: el.attachment.url,
									type: el.attachment.type
							  }
							: null
					};
			  })
			: []
	};
};

const publishPostById = async params => {
	const { pagePostId, accessToken } = params;
	const url = `/${pagePostId}?is_published=true&access_token=${accessToken}`;
	const { data } = await requestAxios.post(url);
	return data;
};

const getAllCommentInPostById = async (page_post_id, access_token) => {
	const fields = `comments{id}`;
	let res = await request(`${page_post_id}`, "GET", {
		access_token,
		fields
	});
	return res.comments.data || [];
};

const replyAllCommentInPostById = async params => {
	const { pagePostId, accessToken, message } = params;
	const comments = await getAllCommentInPostById(pagePostId, accessToken);
	if (!comments.length) return [];
	return Promise.all(
		comments.map(async comment => {
			return await request(`${comment.id}/comments`, "POST", {
				message,
				access_token: accessToken
			});
		})
	);
};

const createFeedPostByPageId = async params => {
	const { pageId, accessToken, message, scheduledPublishTime } = params;

	let url = `/${pageId}/feed?message=${message}&access_token=${accessToken}`;
	if (scheduledPublishTime) {
		url = `${url}&published=false&scheduled_publish_time=${scheduledPublishTime}`;
	}

	const { data } = await requestAxios.post(url);
	return data;
};

const createPhotoPostByPageId = async params => {
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

	try {
		if (!images.length) return null;

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
			const { data } = await requestAxios.post(preUrlFeed, {
				attached_media: photoIds
			});
			return data;
		} else {
			// Post only photo on Post
			preUrlPhoto = `/${pageId}/photos?url=${images[0]}&caption=${message}&access_token=${accessToken}`;
			if (scheduledPublishTime) {
				preUrlPhoto = `${preUrlPhoto}&published=false&scheduled_publish_time=${scheduledPublishTime}`;
			}
			const { data } = await requestAxios.post(preUrlPhoto);
			return data;
		}
	} catch (error) {
		console.log("error", error);
		return error;
	}
};

const updatePostById = async params => {
	const { accessToken, pagePostId, message } = params;
	const url = `/${pagePostId}?message=${message}&access_token=${accessToken}`;
	const { data } = await requestAxios.post(url);
	return data;
};

const deletePostById = async params => {
	const { accessToken, pagePostId } = params;
	const url = `/${pagePostId}?access_token=${accessToken}`;
	const { data } = await requestAxios.delete(url);
	return data;
};

module.exports = {
	getPostsPublishByPageId,
	getPostsScheduledByPageId,
	getPostDetailById,
	getLiveStreamsByPageId,
	getCommentLivestreamById,
	getLiveStreamDetailById,
	getConversationsByPageId,
	getPagesByFacebookUserId,
	getMessagesByConversationId,
	createFeedPostByPageId,
	createPhotoPostByPageId,
	replyAllCommentInPostById,
	publishPostById,
	updatePostById,
	deletePostById
};

//https://github.com/TheSalarKhan/node-sse-server
