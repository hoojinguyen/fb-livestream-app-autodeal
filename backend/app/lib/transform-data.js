const _ = require("lodash");

const getDefaultAvatar = (userId, accessToken) => {
	return `//graph.facebook.com/${userId}/picture?access_token=${accessToken}`;
};

const fb = {
	profile: (data) => {
		return {
			id: data.id,
			name: data.name,
			birthday: data.birthday,
			email: data.email,
			avatar: data.picture.data.url,
		};
	},
	pages: (data) => {
		return data.map((item) => ({
			id: item.id,
			name: item.name,
			accessToken: item.access_token,
		}));
	},
	conversations: (data, accessToken) => {
		return data.map((item) => {
			let sender = item.senders.data[0];
			return {
				id: item.id,
				message: item.snippet,
				link: item.link,
				messageCount: item.message_count,
				unreadCount: item.unread_count,
				accessToken: accessToken,
				sender: {
					...sender,
					avatar: getDefaultAvatar(sender.id, accessToken),
				},
			};
		});
	},
	messages: (data, accessToken) => {
		return _.reverse(
			data.map((item) => {
				let attachments = item.attachments ? item.attachments.data : [];
				if (attachments.length) {
					attachments = attachments.map((el) => {
						return {
							id: el.id,
							name: el.name,
							type: el.mime_type,
							image: el.image_data ? el.image_data.url : null,
							file: el.file_url ? el.file_url : null,
						};
					});
				}
				return {
					id: item.id,
					attachments,
					message: item.message,
					createdAt: item.created_time,
					accessToken: accessToken,
					tags: item.tags ? item.tags.data : [],
					sticker: item.sticker ? item.sticker : null,
					sender: {
						...item.from,
						avatar: getDefaultAvatar(item.from.id, accessToken),
					},
				};
			})
		);
	},
	listLivestream: (data, accessToken) => {
		return data.map((item) => {
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
				accessToken: accessToken,
			};
		});
	},
	livestream: (data, accessToken) => {
		let comments = data.comments ? data.comments.data : [];
		if (comments.length) {
			comments = comments.map((el) => {
				return {
					id: el.id,
					message: el.message,
					createdAt: el.created_time,
					sender: {
						...el.from,
						avatar: getDefaultAvatar(el.from.id, accessToken),
					},
				};
			});
		}

		return {
			id: data.id,
			title: data.title,
			status: data.status,
			description: data.description,
			videoEmbed: data.embed_html,
			liveViewer: data.live_views,
			createdAt: data.creation_time,
			accessToken: accessToken,
			comments: comments,
			reactions: data.reactions ? data.reactions.data : [],
		};
	},
	comments: (data, accessToken) => {
		return data.map((el) => {
			const sender = el.from;
			return {
				id: el.id,
				message: el.message,
				sender: {
					...sender,
					avatar: getDefaultAvatar(sender.id, accessToken),
				},
			};
		});
	},
	posts: (data, accessToken, isPublished) => {
		return data
			.map((item) => {
				let images = [];
				if (item.attachments && item.attachments.data.length) {
					item.attachments.data.map((att) => {
						if (
							att.subattachments &&
							att.subattachments.data.length
						) {
							return att.subattachments.data.map((sub) => {
								return images.push({
									src: sub.media.image.src,
								});
							});
						}
						return images.push({ src: att.media.image.src });
					});
				}
				return {
					id: item.id,
					message: item.message ? item.message : "",
					totalComment: item.comments ? item.comments.data.length : 0,
					totalReaction: item.reactions
						? item.reactions.data.length
						: 0,
					totalShare: item.shares ? item.shares.count : 0,
					permalinkUrl: item.permalink_url,
					createdAt: item.created_time,
					accessToken: accessToken,
					fullPicture: item.full_picture ? item.full_picture : null,
					isVideo: item.story ? true : false,
					isPublic: isPublished,
					images,
				};
			})
			.filter((el) => !el.isVideo);
	},
	post: (data, accessToken) => {
		return {
			id: data.id,
			accessToken: accessToken,
			createdAt: data.created_time,
			message: data.message ? data.message : "",
			permalinkUrl: data.permalink_url,
			fullPicture: data.full_picture ? data.full_picture : null,
			totalShare: data.shadata ? data.shadata.count : 0,
			reactions: data.reactions ? data.reactions.data : [],
			comments: data.comments
				? data.comments.data.map((el) => {
						return {
							id: el.id,
							message: el.message ? el.message : "",
							sender: el.from,
							createdAt: el.created_time,
							attachment: el.attachment
								? {
										url: el.attachment.url,
										type: el.attachment.type,
								  }
								: null,
						};
				  })
				: [],
		};
	},
};

module.exports = { fb };
