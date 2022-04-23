<template>
	<div class="screen">
		<div class="phone_app">
			<PhoneTitle @back="back" :showInfoBare="true" :title="IntlString('APP_MESSAGE_TITLE')" />
			<div class="phone_content elements">
				<div class="element" @click.stop="onNewMessage">
					<div class="icon-container">
						<div class="icon">+</div>
					</div>
					<div class="content">
						<div class="elem-title">{{ IntlString("APP_MESSAGE_NEW_MESSAGE") }}</div>
					</div>
				</div>
				<div class="element" @click.stop="onNewGroup">
					<div class="icon-container">
						<div class="icon icon-small">+</div>
						<div class="icon icon-small">+</div>
					</div>
					<div class="content">
						<div class="elem-title">{{ IntlString("APP_MESSAGE_NEW_GROUP") }}</div>
					</div>
				</div>

				<div
					class="element"
					v-for="conv in conversationsData"
					v-bind:key="conv.id"
					@click.stop="onConversationClick(conv)"
					@contextmenu.prevent="onOption(conv)"
				>
					<div class="not-read" v-if="conv.notRead"></div>
					<div class="icon-container">
						<div v-bind:class="{ 'icon-small': conv.names.length > 1 }" class="icon">{{ conv.names[0].substr(0, 1) }}</div>
						<div v-if="conv.names.length > 1" v-bind:class="{ 'icon-small': conv.names.length > 1 }" class="icon">
							{{ conv.names[1].substr(0, 1) }}
						</div>
					</div>
					<div class="content">
						<div class="elem-title">{{ conv.names.join(", ") }}</div>
						<div class="elem-description">
							{{
								(!!conv.lastMessage &&
									(conv.lastMessage.message.startsWith("http") ? "Image" : conv.lastMessage.message)) ||
								""
							}}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import PhoneTitle from "@/components/PhoneTitle";
import Modal from "@/components/Modal/index.js";

export default {
	components: {
		PhoneTitle,
	},
	data() {
		return {
			disableList: false,
		};
	},
	methods: {
		...mapActions(["deleteConversation", "deleteAllMessages", "startCall"]),
		styleTitle: function () {
			return {
				color: this.color,
				backgroundColor: this.backgroundColor,
			};
		},
		scrollIntoViewIfNeeded: function () {
			this.$nextTick(() => {
				document.querySelector(".select").scrollIntoViewIfNeeded();
			});
		},
		onNewGroup: function () {
			this.$router.push({ name: "messages.selectcontactGroup" });
		},
		onNewMessage: function () {
			this.$router.push({ name: "messages.selectcontact" });
		},
		onConversationClick: function (conv) {
			this.$router.push({ name: "messages.view", params: { id: conv.id } });
		},
		onOption: function (conv) {
			this.disableList = true;
			const otherMember = conv.members.find(m => m.number != this.myPhoneNumber);

			const choices = [];
			if (conv.members.length <= 2) {
				choices.push({ id: 4, title: this.IntlString("APP_PHONE_CALL"), icons: "fa-phone" });
				choices.push({ id: 5, title: this.IntlString("APP_PHONE_CALL_ANONYMOUS"), icons: "fa-mask" });
			}
			choices.push({ id: 6, title: this.IntlString("APP_MESSAGE_NEW_MESSAGE"), icons: "fa-sms" });
			choices.push({ id: 1, title: this.IntlString("APP_MESSAGE_ERASE_CONVERSATION"), icons: "fa-trash", color: "orange" });
			choices.push({ id: 2, title: this.IntlString("APP_MESSAGE_ERASE_ALL_CONVERSATIONS"), icons: "fa-trash", color: "red" });
			if (conv.members.length <= 2 && !this.contacts.find(c => c.number == otherMember)) {
				choices.push({ id: 7, title: this.IntlString("APP_MESSAGE_SAVE_CONTACT"), icons: "fa-save" });
			}
			choices.push({ id: 3, title: this.IntlString("CANCEL"), icons: "fa-undo" });

			Modal.CreateModal({
				choix: choices,
			}).then(rep => {
				if (rep.id === 1) {
					this.deleteConversation({ id: conv.id });
				} else if (rep.id === 2) {
					this.deleteAllMessages();
				} else if (rep.id === 4) {
					this.startCall({ numero: otherMember });
				} else if (rep.id === 5) {
					this.startCall({ numero: "#" + otherMember });
				} else if (rep.id === 6) {
					this.onConversationClick(conv);
				} else if (rep.id === 7) {
					this.$router.push({ name: "contacts.view", params: { id: 0, number: otherMember } });
				}
				this.disableList = false;
			});
		},
		back: function () {
			if (this.disableList === true) return;
			this.$router.push({ name: "home" });
		},
	},
	computed: {
		...mapGetters(["IntlString", "myPhoneNumber", "conversations", "contactsNameByPhone", "contacts"]),
		conversationsData: function () {
			return this.conversations
				.filter(c => c.messages.length > 0)
				.map(c => ({
					...c,
					lastMessage: c.messages.length > 0 && c.messages[c.messages.length - 1],
					names: c.members.filter(n => n != this.myPhoneNumber).map(n => this.contactsNameByPhone[n] || n),
					notRead: !!c.messages.find(m => m.isRead != 1),
				}))
				.sort((a, b) => ((b.lastMessage && b.lastMessage.time) || 0) - (a.lastMessage && a.lastMessage.time) || 0);
		},
	},
};
</script>

<style scoped>
.screen {
	position: relative;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
}

.list {
	height: 100%;
}

.icon-container {
	height: 48px;
	min-width: 48px;
	margin: auto 14px auto 18px;
	flex: 0 0 30px;
	position: relative;
}

.icon {
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	color: #fff;
	font-family: "SF-Pro-Text-Regular";
	background: linear-gradient(#a6abb7, #858992);
	font-size: 24px;
	width: 48px;
	height: 48px;
}

.icon.icon-small {
	position: absolute;
	width: 34px;
	height: 34px;
	font-size: 18px;
}

.icon + .icon {
	right: 0;
	bottom: 0;
}

.elements {
	overflow-y: auto;
}

.element {
	width: 100%;
	max-width: 100%;
	overflow: hidden;
	margin: 0px auto;
	height: 75px;
	background-color: #fff;
	display: flex;
	align-items: center;
	position: relative;
	background-color: #fff;
	padding-left: 10px;
	border-bottom: 0.5px solid #dddddd;
	transition-duration: 250ms;
}

.element:hover {
	cursor: pointer;
	background-color: #f1f1f1;
}

.not-read {
	background-color: #327bf6;
	color: white;
	height: 10px;
	width: 10px;
	border-radius: 50%;
	position: absolute;
	left: 10px;
	top: 32.5px;
	z-index: 6;
}

.content {
	display: flex;
	overflow: hidden;
	flex: 1;
	flex-direction: column;
	justify-content: center;
}

.elem-title {
	font-family: "SF-Pro-Text-Semibold";
	font-size: 18px;
	margin: 0;
	height: 22px;
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	display: -webkit-box;
	word-break: break-all;
}

.elem-description {
	margin: 0;
	font-family: "SF-Pro-Text-Regular";
	font-size: 14px;
	color: rgba(146, 146, 146, 0.836);
}
</style>
