<template>
  <div class="chatbot-container">
    <div class="chatbot" v-if="isOpenCreate">
      <div class="chatbot__header">
        <Button
          icon="pi pi-arrow-left"
          class="p-button-text p-button-lg"
          @click="closeCreate()"
        />
        <span class="title">TẠO CHATBOT</span>
      </div>
      <div class="chatbot__step">
        <div class="step-item">
          <div class="step-item__header">
            <span class="number">01</span>
            <span class="title">Tên Chatbot</span>
          </div>
          <div class="step-item__body">
            <div class="item-row">
              <span class="p-float-label">
                <InputText
                  id="nameChatbot"
                  type="text"
                  class="p-inputtext-lg"
                  v-model="chatbot.name"
                  placeholder="Nhập tên chatbot"
                />
                <small
                  class="p-invalid p-ml-2"
                  v-if="submitted && !chatbot.name"
                  >Tên chatbot không hợp lệ.</small
                >
              </span>
            </div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-item__header">
            <span class="number">02</span>
            <span class="title">Lời chào</span>
          </div>
          <div class="step-item__body">
            <div class="item-row">
              <span class="description"
                >Lời chào là đoạn nội dung ngắn mà khách hàng sẽ thấy khi lần
                đầu tiên truy cập tới Messenger trên Fanpage của bạn:
              </span>
            </div>
            <div class="item-row">
              <Textarea
                v-model="chatbot.responeGreeting.text"
                rows="5"
                cols="100"
              />
              <div class="field-info">
                <span class="field-info__title">Trường thông tin: </span>
                <span class="field-info__item" @click="addGreeting('customer')"
                  >Tên khách
                </span>
                |
                <span class="field-info__item" @click="addGreeting('page')"
                  >Tên fanpage
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-item__header">
            <span class="number">03</span>
            <span class="title">Tin nhắn chào mừng</span>
          </div>
          <div class="step-item__body">
            <div class="item-row">
              <span class="description"
                >Tin nhắn chào mừng được sử dụng để trả lời khách hàng lần đầu
                tiên nhắn tin đến Fanpage.
              </span>
            </div>
            <div class="item-row">
              <Textarea
                v-model="chatbot.responeWelcome.text"
                rows="5"
                cols="100"
              />
              <div class="field-info">
                <span class="field-info__title">Trường thông tin: </span>
                <span
                  class="field-info__item"
                  @click="addResponeWelcome('customer')"
                  >Tên khách
                </span>
                |
                <span
                  class="field-info__item"
                  @click="addResponeWelcome('page')"
                  >Tên fanpage
                </span>
              </div>
              <FormAttachChatBot @add="addBtnResponeWelcome" />
            </div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-item__header">
            <span class="number">04</span>
            <span class="title">Câu trả lời mặc định</span>
          </div>
          <div class="step-item__body">
            <div class="item-row">
              <span class="description"
                >Câu trả lời mặc định được sử dụng để trả lời tin nhắn, bình
                luận của khách hàng không chứa từ khóa đã thiết lập.
              </span>
            </div>
            <div class="item-row">
              <Textarea
                v-model="chatbot.responeDefault.text"
                rows="5"
                cols="100"
              />
              <div class="field-info">
                <span class="field-info__title">Trường thông tin: </span>
                <span
                  class="field-info__item"
                  @click="addResponeDefault('customer')"
                  >Tên khách
                </span>
                |
                <span
                  class="field-info__item"
                  @click="addResponeDefault('page')"
                  >Tên fanpage
                </span>
              </div>
              <FormAttachChatBot @add="addBtnResponeDefault" />
            </div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-item__header">
            <span class="number">05</span>
            <span class="title">Tự động trả lời theo từ khoá</span>
          </div>
          <div class="step-item__body">
            <div class="item-row">
              <span class="description"
                >Hệ thống tự động trả lời dựa vào từ khóa trong nội dung tin
                nhắn, bình luận của khách hàng.
              </span>
            </div>
            <div class="item-row">
              <div class="field-key">
                <div class="field-key__left">
                  <InputText
                    type="text"
                    class="key-item"
                    v-model="keyDefault.key"
                    placeholder="Nhập từ khoá"
                  />
                  <Textarea
                    v-model="keyDefault.value"
                    rows="3"
                    cols="50"
                    placeholder="Câu trả lời"
                    class="key-item"
                  />
                  <Button
                    label="Thêm"
                    class="key-button"
                    @click="addResponeKey()"
                  />
                </div>
                <div class="field-key__left">
                  <template
                    v-if="
                      chatbot.responseAuto && chatbot.responseAuto.keys.length
                    "
                  >
                    <DataTable
                      :value="chatbot.responseAuto.keys"
                      :scrollable="true"
                      scrollHeight="150px"
                      class="p-datatable-striped p-datatable-gridlines"
                    >
                      <Column field="key" header="Từ khoá"></Column>
                      <Column field="value" header="Câu trả lời"></Column>
                    </DataTable>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-item__header">
            <span class="number">06</span>
            <span class="title">Hoàn thành</span>
          </div>
          <div class="step-item__body">
            <div class="item-row">
              <Button
                label="Kích hoạt chatbot"
                icon="pi pi-android"
                iconPos="right"
                class="p-button-lg"
                @click="finishChatbot()"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="list-chatbot-container" v-else>
      <div class="list-chatbot">
        <div class="list-chatbot__header">
          <div class="list-chatbot__header__left">
            <span>Quản lý chatbot</span>
          </div>
          <div class="list-chatbot__header__right">
            <Button
              label="Tạo chatbot"
              icon="pi pi-plus"
              @click="openCreate()"
            />
          </div>
        </div>
        <div class="list-chatbot__body vld-parent" ref="tableLog">
          <div class="bot-item" v-for="bot in chatbots" :key="bot.id">
            <span class="name">{{ bot.name }}</span>
            <div class="button">
              <div class="button__select">
                <InputSwitch
                  @change="updateActiveBot(bot)"
                  :value="bot.isActive"
                />
              </div>
              <div class="button__delete">
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger p-button-outlined p-mr-2"
                  v-tooltip.top="'Xoá'"
                  @click="deleteChatbot(bot)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import FormAttachChatBot from "@/components/FormAttachChatBot";

export default {
  components: { FormAttachChatBot },
  data() {
    return {
      submitted: false,
      loader: false,
      loading: false,
      isOpenCreate: false,
      chatbot: {
        name: "",
        responeGreeting: {
          text: "",
          infoAttach: [],
        },
        responeWelcome: {
          text: "",
          infoAttach: [],
          btnAttach: [],
        },
        responeDefault: {
          text: "",
          infoAttach: [],
          btnAttach: [],
        },
        responseAuto: {
          keys: [],
        },
      },
      keyDefault: {
        // title: "",
        key: "",
        value: "",
      },
    };
  },

  async mounted() {
    await this.setLoading(true);
    await this.getListChatbot();
    await this.setLoading(false);
  },

  watch: {
    loading(value) {
      if (value) {
        this.loader = this.$loading.show({
          width: 54,
          height: 54,
          opacity: 1,
          loader: "spinner",
          color: "#56A3ED",
          container: this.$refs.tableLog,
        });
      } else {
        this.loader.hide();
      }
    },
  },

  computed: {
    ...mapState({
      chatbots: (state) => state.chatbot.chatbots,
    }),
  },

  methods: {
    ...mapActions({
      getListChatbot: "chatbot/fetchAll",
      createChatbot: "chatbot/create",
      updateChatbot: "chatbot/update",
      deleteChatbot: "chatbot/delete",
    }),

    setLoading(value) {
      this.loading = value;
    },

    addGreeting(data) {
      if (data == "customer") data = "Tên khách";
      if (data == "page") data = "Tên fanpage";

      this.chatbot.responeGreeting.text += ` ${data}`;
      this.chatbot.responeGreeting.infoAttach.push(data);
    },

    addResponeWelcome(data) {
      if (data == "customer") data = "Tên khách";
      if (data == "page") data = "Tên fanpage";

      this.chatbot.responeWelcome.text += ` ${data}`;
      this.chatbot.responeWelcome.infoAttach.push(data);
    },

    addBtnResponeWelcome(data) {
      this.chatbot.responeWelcome.btnAttach.push(data);
    },

    addResponeDefault(data) {
      if (data == "customer") data = "Tên khách";
      if (data == "page") data = "Tên fanpage";

      this.chatbot.responeDefault.text += ` ${data}`;
      this.chatbot.responeDefault.infoAttach.push(data);
    },

    addBtnResponeDefault(data) {
      this.chatbot.responeDefault.btnAttach.push(data);
    },

    addResponeKey() {
      this.chatbot.responseAuto.keys.push(this.keyDefault);
      this.keyDefault = { key: "", value: "" };
    },

    openCreate() {
      this.isOpenCreate = true;
    },

    closeCreate() {
      this.isOpenCreate = false;
    },

    async deleteChatbot(bot) {
      await this.setLoading(true);
      await this.deleteChatbot(bot);
      await this.setLoading(false);
    },

    async updateActiveBot(bot) {
      // await this.setLoading(true);
      await this.updateChatbot(bot);
      // await this.setLoading(false);
    },

    async finishChatbot() {
      await this.setLoading(true);
      await this.createChatbot(this.chatbot);
      await this.setLoading(false);
    },
  },
};
</script>

<style scoped lang="scss">
@import "./public/assets/sass/custom/pages/chatbot";
</style>
