export const sourcesMessage = [
  {
    label: "Tất cả hội thoại",
    icon: "pi pi-fw pi-inbox",
    isActive: true,
    action: "all",
  },
  {
    label: "Tin nhắn",
    icon: "pi pi-fw pi-comment",
    isActive: false,
    action: "inbox",
  },
  {
    label: "Bình luận",
    icon: "pi pi-fw pi-comments",
    isActive: false,
    action: "comment",
  },
  {
    label: "Hộp thoại từ chatbot",
    icon: "pi pi-fw pi-android",
    isActive: false,
    action: "chatbot",
  },
  {
    label: "Hộp thoại từ livestream",
    icon: "pi pi-fw pi-video",
    isActive: false,
    action: "livestream",
  },
];

export const filtersMessage = [
  {
    label: "Chưa trả lời",
    icon: "pi pi-fw pi-comment",
    action: "notReply",
    isActive: false,
  },
  {
    label: "Chưa đọc",
    icon: "pi pi-fw pi-eye",
    action: "notRead",
    isActive: false,
  },
];

export default { sourcesMessage, filtersMessage };
