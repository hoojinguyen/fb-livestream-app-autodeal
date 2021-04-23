export default {
  data() {
    return {
      isOpenMenuOption: false,
      topMenuOption: "0px",
      leftMenuOption: "0px",
      commentCurrentInMenu: null,
    };
  },
  methods: {
    openMenuOption(e, comment) {
      this.isOpenMenuOption = true;
      this.commentCurrentInMenu = comment;
      this.setMenuOption(e.y, e.x);
      e.preventDefault();
    },

    closeMenuOption() {
      if (this.isOpenMenuOption) {
        this.isOpenMenuOption = false;
        this.commentCurrentInMenu = null;
      }
    },

    setMenuOption(top, left) {
      let { offsetHeight, offsetWidth } = this.$refs.menuOption;
      let largestHeight = window.innerHeight - offsetHeight + 225;
      let largestWidth = window.innerWidth - offsetWidth + 225;

      if (top > largestHeight) top = largestHeight;
      if (left > largestWidth) left = largestWidth;

      this.topMenuOption = top + "px";
      this.leftMenuOption = left + "px";
    },

    menuCreateOrder() {
      const { commentCurrentInMenu } = this;
      this.checkRegex(commentCurrentInMenu);
      this.closeMenuOption();
    },

    menuCopyComment() {
      const { message } = this.commentCurrentInMenu;
      this.$copyText(message);
      this.closeMenuOption();
    },

    menuCopyPhone() {
      const { message } = this.commentCurrentInMenu;
      const regex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/g;
      const phone = message.match(regex);
      if (phone) {
        this.$copyText(phone[0]);
      }
      this.closeMenuOption();
    },
  },
};
