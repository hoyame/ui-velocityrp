<template>
	<div class="phone_app">
		<InfoBare />

		<div class="head">
			<p class="title">Dark Chat</p>

			<svg @click="addChannelOption" class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 63.818 64.99">
				<path
					d="M41.7-2.734a3.876,3.876,0,0,0,3.906-3.857V-31.25H69.678a3.993,3.993,0,0,0,3.906-3.955,3.993,3.993,0,0,0-3.906-3.955H45.605V-63.867A3.876,3.876,0,0,0,41.7-67.725a3.918,3.918,0,0,0-3.955,3.857V-39.16H13.721a4,4,0,0,0-3.955,3.955,4,4,0,0,0,3.955,3.955H37.744V-6.592A3.918,3.918,0,0,0,41.7-2.734Z"
					transform="translate(-9.766 67.725)"
				/>
			</svg>
		</div>

		<div class="elements">
			<div
				class="element"
				v-for="(elem, key) in tchatChannels"
				v-bind:key="elem.channel"
				v-bind:class="{ select: key === currentSelect }"
				@click.stop="showChannel(elem.channel)"
			>
				<div class="elem-title" @click.stop="showChannel(elem.channel)"><span class="diese">#</span> {{ elem.channel }}</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Modal from "@/components/Modal/index.js";
import InfoBare from "./../InfoBare";

export default {
	components: { InfoBare },
	data: function () {
		return {
			currentSelect: 0,
			chann: [
				{
					channel: "dtyv",
				},
			],
			ignoreControls: false,
		};
	},
	watch: {
		list: function () {
			this.currentSelect = 0;
		},
	},
	computed: {
		...mapGetters(["IntlString", "useMouse", "tchatChannels", "Apps"]),
	},
	methods: {
		...mapActions(["tchatAddChannel", "tchatRemoveChannel"]),
		scrollIntoViewIfNeeded() {
			this.$nextTick(() => {
				const $select = this.$el.querySelector(".select");
				if ($select !== null) {
					$select.scrollIntoViewIfNeeded();
				}
			});
		},
		onUp() {
			if (this.ignoreControls === true) return;
			this.currentSelect = this.currentSelect === 0 ? 0 : this.currentSelect - 1;
			this.scrollIntoViewIfNeeded();
		},
		onDown() {
			if (this.ignoreControls === true) return;
			this.currentSelect = this.currentSelect === this.tchatChannels.length - 1 ? this.currentSelect : this.currentSelect + 1;
			this.scrollIntoViewIfNeeded();
		},
		async onRight() {
			if (this.ignoreControls === true) return;
			this.ignoreControls = true;
			let choix = [
				{
					id: 1,
					title: this.IntlString("APP_DARKTCHAT_NEW_CHANNEL"),
					icons: "fa-plus",
					color: "green",
				} /** New Channel Option Color */,
				{
					id: 2,
					title: this.IntlString("APP_DARKTCHAT_DELETE_CHANNEL"),
					icons: "fa-minus",
					color: "red",
				} /** DeleteChannel Option Color */,
				{ id: 3, title: this.IntlString("APP_DARKTCHAT_CANCEL"), icons: "fa-undo" },
			];
			if (this.tchatChannels.length === 0) {
				choix.splice(1, 1);
			}
			const rep = await Modal.CreateModal({ choix });
			this.ignoreControls = false;
			switch (rep.id) {
				case 1:
					this.addChannelOption();
					break;
				case 2:
					this.removeChannelOption();
					break;
				case 3:
			}
		},
		async onEnter() {
			if (this.ignoreControls === true) return;
			if (this.tchatChannels.length === 0) {
				this.ignoreControls = true;
				let choix = [
					{
						id: 1,
						title: this.IntlString("APP_DARKTCHAT_NEW_CHANNEL"),
						icons: "fa-plus",
						color: "green",
					} /** New Channel Option Color */,
					{ id: 3, title: this.IntlString("APP_DARKTCHAT_CANCEL"), icons: "fa-undo" },
				];
				const rep = await Modal.CreateModal({ choix });
				this.ignoreControls = false;
				if (rep.id === 1) {
					this.addChannelOption();
				}
			} else {
				const channel = this.tchatChannels[this.currentSelect].channel;
				this.showChannel(channel);
			}
		},
		showChannel(channel) {
			this.$router.push({ name: "tchat.channel.show", params: { channel } });
		},
		onBack() {
			if (this.ignoreControls === true) return;
			this.$router.push({ name: "home" });
		},
		async addChannelOption() {
			try {
				const rep = await Modal.CreateTextModal({ limit: 20, title: this.IntlString("APP_DARKTCHAT_NEW_CHANNEL") });
				let channel = (rep || {}).text || "";
				channel = channel.toLowerCase().replace(/[^a-z]/g, "");
				if (channel.length > 0) {
					this.currentSelect = 0;
					this.tchatAddChannel({ channel });
				}
			} catch (e) {}
		},
		async removeChannelOption() {
			const channel = this.tchatChannels[this.currentSelect].channel;
			this.currentSelect = 0;
			this.tchatRemoveChannel({ channel });
		},
	},
	created() {
		if (!this.useMouse) {
			this.$bus.$on("keyUpArrowDown", this.onDown);
			this.$bus.$on("keyUpArrowUp", this.onUp);
			this.$bus.$on("keyUpArrowRight", this.onRight);
			this.$bus.$on("keyUpEnter", this.onEnter);
			this.$bus.$on("keyUpBackspace", this.onBack);
		} else {
			this.currentSelect = -1;
		}
	},
	beforeDestroy() {
		this.$bus.$off("keyUpArrowDown", this.onDown);
		this.$bus.$off("keyUpArrowUp", this.onUp);
		this.$bus.$off("keyUpArrowRight", this.onRight);
		this.$bus.$off("keyUpEnter", this.onEnter);
		this.$bus.$off("keyUpBackspace", this.onBack);
	},
};
</script>

<style scoped>
.phone_app {
	background-color: #313131; /** Homepage Background */
}
.list {
	height: 100%;
}
.title {
	height: 34px;
	line-height: 34px;
	font-size: 38px;
	font-weight: 900;
	width: 200px;
	color: #fff;
	font-family: "SF-Pro-Display-Bold";
}

.moneyTitle {
	font-weight: 600;
	color: #000;
	font-size: 20px;
}

.elements {
	padding: 35px 30px;
	height: calc(100%);
	overflow-y: auto;
	color: #ffffff; /** Chat Text Color HomePage */
}
.element {
	height: 42px;
	line-height: 42px;
	display: flex;
	align-items: center;
	position: relative;
	border-radius: 10px;
}

.elem-title {
	margin-left: 6px;
	font-size: 20px;
	text-transform: capitalize;
	transition: 0.15s;
	color: #dbdbdb; /** Hashtag Color */
	font-family: "SF-Pro-Display-Bold";
}
.elem-title .diese {
	color: #3db671; /** Hashtag Color */
	font-size: 22px;
	font-weight: 700;
	margin-right: 6px;
	line-height: 40px;
}

.icon {
	height: 30px;
	margin-right: 30px;
	fill: #fff;
	transition-duration: 150ms;
}

.icon:hover {
	fill: #a7a7a7;
	cursor: pointer;
}

.element:hover {
	background-color: #414141; /** Hover Box Color */
	color: #474747; /** Hover Text Color */
	cursor: pointer;
}

.element.select .elem-title,
.element:hover .elem-title {
	margin-left: 12px;
}
.element.select .elem-title .diese,
.element:hover .elem-title .diese {
	color: #5ecc8d; /** Hashtag Hover Color */
}
.elements::-webkit-scrollbar-track {
	box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	background-color: #356e4d; /** Scrollbar Edge */
}
.elements::-webkit-scrollbar {
	width: 3px;
	background-color: transparent;
}
.elements::-webkit-scrollbar-thumb {
	background-color: #5ecc8d; /** Scrollbar Thumb */
}

.head {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	height: 75px;
	margin-top: 30px;
	margin-bottom: 0;
	margin-left: 35px;
}
</style>
