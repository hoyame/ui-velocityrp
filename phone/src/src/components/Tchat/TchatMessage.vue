<template>
	<div class="phone_app">
		<InfoBare />

		<div class="phone_content">
			<div class="elements" ref="elementsDiv">
				<div id="sms_list" style="height: 95%">
					<div
						class="sms"
						v-bind:class="{ select: key === selectMessage }"
						v-for="(mess, key) in tchatMessages"
						v-bind:key="mess.id"
					>
						<span><timeago class="sms_time" :since="mess.time" :auto-update="20"></timeago></span>

						<span class="sms_message sms_me">
							<span>{{ mess.message }}</span>
						</span>
					</div>
				</div>

				<div id="sms_write">
					<CustomInput type="text" placeholder="Message" v-model="message" @keyup.enter.prevent="sendMessage" />
					<div @click="sendMessage" class="button-send">
						<svg
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
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import PhoneTitle from "./../PhoneTitle";
import CustomInput from "./../CustomInput";
import InfoBare from "./../InfoBare";

export default {
	components: { PhoneTitle, InfoBare, CustomInput },
	data() {
		return {
			message: "",
			channel: "",
			chann: [
				{
					id: "dtyv",
					time: "2004",
					message: "1f6z5g416z",
				},
			],
			currentSelect: 0,
		};
	},
	computed: {
		...mapGetters(["tchatMessages", "tchatCurrentChannel", "useMouse"]),
		channelName() {
			return "# " + this.channel;
		},
	},
	watch: {
		tchatMessages() {
			const c = this.$refs.elementsDiv;
			c.scrollTop = c.scrollHeight;
		},
	},
	methods: {
		setChannel(channel) {
			this.channel = channel;
			this.tchatSetChannel({ channel });
		},
		...mapActions(["tchatSetChannel", "tchatSendMessage"]),
		scrollIntoViewIfNeeded() {
			this.$nextTick(() => {
				const $select = this.$el.querySelector(".select");
				if ($select !== null) {
					$select.scrollIntoViewIfNeeded();
				}
			});
		},
		onUp() {
			const c = this.$refs.elementsDiv;
			c.scrollTop = c.scrollTop - 120;
		},
		onDown() {
			const c = this.$refs.elementsDiv;
			c.scrollTop = c.scrollTop + 120;
		},
		async onEnter() {
			const rep = await this.$phoneAPI.getReponseText();
			if (rep !== undefined && rep.text !== undefined) {
				const message = rep.text.trim();
				if (message.length !== 0) {
					this.tchatSendMessage({
						channel: this.channel,
						message,
					});
				}
			}
		},
		sendMessage() {
			const message = this.message.trim();
			if (message.length !== 0) {
				this.tchatSendMessage({
					channel: this.channel,
					message,
				});
				this.message = "";
			}
		},
		onBack() {
			if (this.useMouse === true && document.activeElement.tagName !== "BODY") return;
			this.onQuit();
		},
		onQuit() {
			this.$router.push({ name: "tchat.channel" });
		},
		formatTime(time) {
			const d = new Date(time);
			return d.toLocaleTimeString();
		},
	},
	created() {
		if (!this.useMouse) {
			this.$bus.$on("keyUpArrowDown", this.onDown);
			this.$bus.$on("keyUpArrowUp", this.onUp);
			this.$bus.$on("keyUpEnter", this.onEnter);
		} else {
			this.currentSelect = -1;
		}
		this.$bus.$on("keyUpBackspace", this.onBack);
		this.setChannel(this.$route.params.channel);
	},
	mounted() {
		window.c = this.$refs.elementsDiv;
		const c = this.$refs.elementsDiv;
		c.scrollTop = c.scrollHeight;
	},
	beforeDestroy() {
		this.$bus.$off("keyUpArrowDown", this.onDown);
		this.$bus.$off("keyUpArrowUp", this.onUp);
		this.$bus.$off("keyUpEnter", this.onEnter);
		this.$bus.$off("keyUpBackspace", this.onBack);
	},
};
</script>

<style lang="scss" scoped>
.phone_app {
	background-color: #313131; /** Homepage Background */
}

.elements {
	height: calc(100% - 110px);

	color: black; /** Unknown Black */
	display: flex;
	flex-direction: column;
	padding-bottom: 12px;
	overflow-y: auto;
}

.element {
	color: #5ecc8d; /** Time Color */
	flex: 0 0 auto;
	width: 100%;
	display: flex;
	/* margin: 9px 12px;
  line-height: 18px;
  font-size: 18px;
  padding-bottom: 6px;
  
  flex-direction: row;
  height: 60px; */
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
	height: 33px;
	width: 33px;
	border-radius: 25px;
	margin-right: 3px;
	background-color: #5b6fc7;

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
	background-color: #5b6fc7;
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
	word-wrap: break-word;
	max-width: 80%;
	font-size: 18px;
	border-radius: 15px;
	margin-bottom: 5px;
	padding: 10px;
}

#sms_write {
	position: absolute;
	left: 30px;
	bottom: 50px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	height: 45px;
	width: 380px;
	margin: 0 auto;
	border: 1px solid rgb(94, 94, 94);
	border-radius: 56px;
}
#sms_write input {
	height: 40px;
	border: none;
	outline: none;
	font-size: 18px;
	margin-left: 14px;
	padding: 12px 5px;
	color: #fff;
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
</style>
