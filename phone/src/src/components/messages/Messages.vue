<template>
	<div class="phone_app messages">
		<PhoneTitle :title="title" @back="quit" />
		<div class="img-fullscreen" v-if="imgZoom !== undefined" @click.stop="imgZoom = undefined">
			<img :src="imgZoom" />
		</div>

		<textarea ref="copyTextarea" class="copyTextarea" />

		<div id="sms_list">
			<div class="sms" v-for="(mess, index) in currentConversation.messages" v-bind:key="mess.id" @click.stop="onActionMessage(mess)">
				<span v-if="index == 0 || mess.time - currentConversation.messages[index - 1].time > 60"
					><timeago class="sms_time" :since="mess.time * 1000" :auto-update="20"></timeago
				></span>
				<div class="sender" v-if="currentConversation.members.length > 2 && mess.sender != myPhoneNumber">
					{{ contactsNameByPhone[mess.sender] || mess.sender }}
				</div>
				<span
					class="sms_message sms_me"
					@click.stop="onActionMessage(mess)"
					v-bind:class="{ sms_other: mess.sender != myPhoneNumber }"
				>
					<img v-if="isSMSImage(mess)" @click.stop="onActionMessage(mess)" class="sms-img" :src="mess.message" />
					<span v-else @click.stop="onActionMessage(mess)">{{ mess.message }}</span>
				</span>
			</div>
		</div>
		<div id="sms_write">
			<div @click.stop="showOptions()" class="button-sends">
				<svg class="button-send-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 63.818 64.99">
					<path
						d="M41.7-2.734a3.876,3.876,0,0,0,3.906-3.857V-31.25H69.678a3.993,3.993,0,0,0,3.906-3.955,3.993,3.993,0,0,0-3.906-3.955H45.605V-63.867A3.876,3.876,0,0,0,41.7-67.725a3.918,3.918,0,0,0-3.955,3.857V-39.16H13.721a4,4,0,0,0-3.955,3.955,4,4,0,0,0,3.955,3.955H37.744V-6.592A3.918,3.918,0,0,0,41.7-2.734Z"
						transform="translate(-9.766 67.725)"
					/>
				</svg>
			</div>
			<CustomInput
				type="text"
				v-model="message"
				:placeholder="IntlString('APP_MESSAGE_PLACEHOLDER_ENTER_MESSAGE')"
				v-autofocus
				@keyup.enter.prevent="send"
			></CustomInput>
			<div @click.stop="send" class="button-send">
				<svg
					data-v-7af770c4=""
					aria-hidden="true"
					data-prefix="fas"
					data-icon="arrow-up"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 448 512"
					class="svg-inline--fa fa-arrow-up fa-w-14 button-send-icon"
				>
					<path
						data-v-7af770c4=""
						fill="currentColor"
						d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"
					></path>
				</svg>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import PhoneTitle from "./../PhoneTitle";
import CustomInput from "./../CustomInput";
import Modal from "@/components/Modal/index.js";

export default {
	data() {
		return {
			ignoreControls: false,
			imgZoom: undefined,
			message: "",
		};
	},
	components: {
		PhoneTitle,
		CustomInput,
	},
	methods: {
		...mapActions(["setMessageRead", "deleteMessage", "startCall", "tempConvCreated"]),
		resetScroll() {
			this.$nextTick(() => {
				let elem = document.querySelector("#sms_list");
				elem.scrollTop = elem.scrollHeight;
			});
		},
		quit() {
			this.$router.go(-1);
		},
		send() {
			const message = this.message.trim();
			if (message === "") return;
			this.message = "";
			this.sendMessage(message);
		},
		sendMessage(message) {
			if (this.currentConversation.id < 0) {
				this.$phoneAPI.createConversation(this.currentConversation.members, message).then(id => {
					this.tempConvCreated({ tempId: this.currentConversation.id, id });
					this.$router.replace({ name: "messages.view", params: { id } });
				});
			} else {
				this.$phoneAPI.sendMessage(this.currentConversation.id, message);
			}
		},
		isSMSImage(mess) {
			return /^https?:\/\/.*\.(png|jpg|jpeg|gif)/.test(mess.message);
		},
		async onActionMessage(message) {
			try {
				// let message = this.messagesList[this.selectMessage]
				let isGPS = /(-?\d+(\.\d+)?), (-?\d+(\.\d+)?)/.test(message.message);
				let hasNumber = /#([0-9]+)/.test(message.message);
				let isSMSImage = this.isSMSImage(message);
				let choix = [
					{
						id: "delete",
						title: this.IntlString("APP_MESSAGE_DELETE"),
						icons: "fa-trash",
					},
					{
						id: -1,
						title: this.IntlString("CANCEL"),
						icons: "fa-undo",
					},
				];
				if (isGPS === true) {
					choix = [
						{
							id: "gps",
							title: this.IntlString("APP_MESSAGE_SET_GPS"),
							icons: "fa-location-arrow",
						},
						...choix,
					];
				}
				if (hasNumber === true) {
					const num = message.message.match(/#([0-9-]*)/)[1];
					choix = [
						{
							id: "num",
							title: `${this.IntlString("APP_MESSAGE_MESS_NUMBER")} ${num}`,
							number: num,
							icons: "fa-phone",
						},
						...choix,
					];
				}
				if (isSMSImage === true) {
					choix = [
						{
							id: "zoom",
							title: this.IntlString("APP_MESSAGE_ZOOM_IMG"),
							icons: "fa-search",
						},
						...choix,
					];
				}
				this.ignoreControls = true;
				const data = await Modal.CreateModal({ choix });
				if (data.id === "delete") {
					this.deleteMessage({ id: message.id, conversationId: this.currentConversation.id });
				} else if (data.id === "gps") {
					let val = message.message.match(/(-?\d+(\.\d+)?), (-?\d+(\.\d+)?)/);
					this.$phoneAPI.setGPS(val[1], val[3]);
				} else if (data.id === "num") {
					this.$nextTick(() => {
						this.onSelectPhoneNumber(data.number);
					});
				} else if (data.id === "zoom") {
					this.imgZoom = message.message;
				}
			} catch (e) {
			} finally {
				this.ignoreControls = false;
			}
		},
		async onSelectPhoneNumber(number) {
			try {
				this.ignoreControls = true;
				let choix = [
					{
						id: "sms",
						title: this.IntlString("APP_MESSAGE_MESS_SMS"),
						icons: "fa-comment",
					},
					{
						id: "call",
						title: this.IntlString("APP_MESSAGE_MESS_CALL"),
						icons: "fa-phone",
					},
				];
				// if (this.useMouse === true) {
				choix.push({
					id: "copy",
					title: this.IntlString("APP_MESSAGE_MESS_COPY"),
					icons: "fa-copy",
				});
				// }
				choix.push({
					id: -1,
					title: this.IntlString("CANCEL"),
					icons: "fa-undo",
				});
				const data = await Modal.CreateModal({ choix });
				if (data.id === "sms") {
					this.phoneNumber = number;
				} else if (data.id === "call") {
					this.startCall({ numero: number });
				} else if (data.id === "copy") {
					try {
						const $copyTextarea = this.$refs.copyTextarea;
						$copyTextarea.value = number;
						$copyTextarea.style.height = "20px";
						$copyTextarea.focus();
						$copyTextarea.select();
						await document.execCommand("copy");
						$copyTextarea.style.height = "0";
					} catch (error) {}
				}
			} catch (e) {
			} finally {
				this.ignoreControls = false;
			}
		},
		onBackspace() {
			if (this.imgZoom !== undefined) this.imgZoom = undefined;
		},
		async showOptions() {
			try {
				this.ignoreControls = true;
				let choix = [{ id: 1, title: this.IntlString("APP_MESSAGE_SEND_GPS"), icons: "fa-location-arrow" }];
				// choix.push({
				// 	id: 3,
				// 	title: this.IntlString("APP_MESSAGE_SEND_GPS_REALTIME"),
				// 	icons: "fa-map-marked-alt",
				// });
				if (this.enableTakePhoto) {
					choix.push({ id: 2, title: this.IntlString("APP_MESSAGE_SEND_PHOTO"), icons: "fa-picture-o" });
				}
				choix.push({ id: -1, title: this.IntlString("CANCEL"), icons: "fa-undo" });
				const data = await Modal.CreateModal({ choix });
				if (data.id === 1) {
					this.sendMessage("%pos%");
				}
				if (data.id === 2) {
					const { url } = await this.$phoneAPI.takePhoto();
					if (!!url) {
						this.sendMessage(url);
					}
				}
				if (data.id === 3) {
					/**
            Real-time GPS time selection
          */
					const gpsTimeResponse = await Modal.CreateModal({
						choix: [
							{
								// ~1 minute
								id: 1000 * 60,
								title: this.IntlString("APP_MESSAGE_SEND_GPS_REALTIME_TIME_1"),
							},
							{
								// ~5 minutes
								id: 1000 * 60 * 5,
								title: this.IntlString("APP_MESSAGE_SEND_GPS_REALTIME_TIME_2"),
							},
							{
								// ~10 minutes
								id: 1000 * 60 * 10,
								title: this.IntlString("APP_MESSAGE_SEND_GPS_REALTIME_TIME_3"),
							},
						],
					});
					if (gpsTimeResponse.id > 0) {
						// this.sendMessage({
						// 	phoneNumber: this.phoneNumber,
						// 	message: "%posrealtime%",
						// 	gpsData: {
						// 		time: gpsTimeResponse.id || 10000,
						// 	},
						// });
					}
				}
				this.ignoreControls = false;
			} catch (eeeUrr) {
				console.log(eeeUrr);
			} finally {
				this.ignoreControls = false;
			}
		},
	},
	computed: {
		...mapGetters(["IntlString", "conversations", "contacts", "enableTakePhoto", "myPhoneNumber", "contactsNameByPhone"]),
		isGroup() {
			return this.$route.name.endsWith("Group");
		},
		currentConversation() {
			return this.conversations.find(c => c.id == this.$route.params.id);
		},
		messagesCount() {
			return this.currentConversation.messages.length;
		},
		title() {
			if (this.currentConversation.members.length > 2) {
				return "Groupe";
			}
			const otherPhone = this.currentConversation.members.find(m => m != this.myPhoneNumber);
			return this.contactsNameByPhone[otherPhone] || otherPhone;
		},
	},
	watch: {
		messagesCount() {
			this.setMessageRead(this.currentConversation.id);
			this.resetScroll();
		},
	},
	created() {
		this.$bus.$on("keyUpBackspace", this.onBackspace);
		this.setMessageRead(this.currentConversation.id);
		this.resetScroll();
	},
	beforeDestroy() {
		this.$bus.$off("keyUpBackspace", this.onBackspace);
	},
};
</script>

<style lang="scss" scoped>
* {
	font-family: "SF-Pro-Text-Light";
}

.button-send {
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	justify-content: center;
	height: 32px;
	width: 32px;
	border-radius: 25px;
	margin-right: 3px;
	background-color: #3bc861;

	&:hover {
		background-color: rgba(0, 0, 0, 0.5);
		cursor: pointer;
	}
}

.button-sends {
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	justify-content: center;
	height: 32px;
	width: 32px;
	border-radius: 25px;
	margin-left: 3px;
	background-color: #afafaf;

	&:hover {
		background-color: rgba(0, 0, 0, 0.5);
		cursor: pointer;
	}
}

.button-send-icon {
	height: 20px;
	width: 20px;
	color: #fff;
}

.messages {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: calc(100% - 20px);
	background-color: #eee;
}
#sms_contact {
	background-color: #4caf50;
	color: white;
	height: 34px;
	line-height: 34px;
	padding-left: 5px;
}
#sms_list {
	height: calc(100% - 34px - 26px);
	overflow-y: auto;
	padding-bottom: 8px;
}

.name_other_sms_other {
	margin-bottom: -9px;
	margin-left: 42px;
	font-size: 14px;
	font-weight: 500;
	color: lightgrey;
}

.name_other_sms_me {
	display: none;
}

.name_other_sms_other.sms_me {
	display: none;
}

.sms {
	overflow: auto;
	zoom: 1;
}

.sms-img {
	width: 100%;
	padding: 10px;
	height: auto;
}
.img-fullscreen {
	position: fixed;
	z-index: 999999;
	background-color: rgba(20, 20, 20, 0.8);
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	display: flex;
	justify-content: center;
	align-items: center;
}
.img-fullscreen img {
	display: flex;
	max-width: 90vw;
	max-height: 95vh;
}

.sms_me {
	float: right;
	background-color: #3bc861;
	padding: 5px 20px;
	color: #fff;
	max-width: 90%;
	margin-right: 5%;
	margin-top: 10px;
}

.sms_other {
	background-color: #d8d8d8;
	color: #000;
	float: left;
	padding: 5px 20px;
	max-width: 90%;
	margin-left: 5%;
	margin-top: 10px;
}

.sms_time {
	display: block;
	font-size: 12px;
	text-align: center;
	margin: 5px;
}

.sms_me .sms_time {
	color: #fff;
}
.sms_other .sms_time {
	color: #000;
}

.messages {
	position: relative;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
}

.sms.select .sms_message,
.sms_message:hover {
	background-color: rgba(0, 0, 0, 0.5);
	cursor: pointer;
}

.sms_message {
	flex-grow: 0;
	flex-shrink: 1;
	flex-basis: 0;
	word-wrap: break-word;
	max-width: 80%;
	font-size: 18px;
	border-radius: 15px;
	margin-bottom: 5px;
	padding: 10px;
}

#sms_write {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	height: 45px;
	width: 380px;
	margin: 0 auto;
	margin-bottom: 50px;
	border: 1px solid #ccc;
	border-radius: 56px;
}
#sms_write input {
	height: 40px;
	width: 250px;
	border: none;
	outline: none;
	font-size: 18px;
	margin-left: 14px;
	padding: 12px 5px;
	background-color: rgba(236, 236, 241, 0);
}

.sms_send {
	float: right;
	margin-right: 10px;
}
.sms_send svg {
	margin: 10px;
	width: 36px;
	height: 36px;
	fill: #c0c0c0;
}
.copyTextarea {
	height: 0;
	border: 0;
	padding: 0;
}
.sender {
	font-size: 14px;
	margin-bottom: -8px;
	margin-left: 6%;
	text-align: left;
}
</style>
