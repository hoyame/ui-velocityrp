<template>
	<div class="phone_app">
		<PhoneTitle :title="IntlString('APP_CONFIG_TITLE')" @back="onBackspace" />
		<div class="phone_content elements">
			<font-awesome-icon icon="user-secret" />
			<div
				class="element"
				v-for="(elem, key) in paramList"
				v-bind:class="{ select: key === currentSelect }"
				v-bind:key="key"
				@click.stop="onPressItem(key)"
			>
				<div class="fa-cont" :style="elem.color">
					<font-awesome-icon class="icon" :icon="elem.icons" />
				</div>
				<div class="element-content" @click.stop="onPressItem(key)">
					<span class="element-title" @click.stop="onPressItem(key)">{{ elem.title }}</span>
					<span v-if="elem.value" class="element-value" @click.stop="onPressItem(key)">{{ elem.value }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import PhoneTitle from "./../PhoneTitle";
import Modal from "@/components/Modal/index.js";

export default {
	components: {
		PhoneTitle,
	},
	data() {
		return {
			ignoreControls: false,
			currentSelect: 0,
		};
	},
	computed: {
		...mapGetters([
			"IntlString",
			"useMouse",
			"myPhoneNumber",
			"backgroundLabel",
			"coqueLabel",
			"sonidoLabel",
			"zoom",
			"config",
			"volume",
			"availableLanguages",
		]),
		paramList() {
			const cancelStr = this.IntlString("CANCEL");
			const confirmResetStr = this.IntlString("APP_CONFIG_RESET_CONFIRM");
			const cancelOption = {};
			const confirmReset = {};
			cancelOption[cancelStr] = "cancel";
			confirmReset[confirmResetStr] = "accept";
			return [
				{
					icons: "phone-alt",
					color: "background: rgb(215, 0, 21);",
					title: this.IntlString("APP_CONFIG_MY_MUNBER"),
					value: this.myPhoneNumber,
				},
				{
					icons: "bell",
					color: "background: rgb(87, 86, 206);",
					title: this.IntlString("APP_CONFIG_SOUND"),
					value: this.sonidoLabel,
					onValid: "onChangeSonido",
					values: this.config.sonido,
				},
				{
					icons: "search",
					color: "background: rgb(101, 196, 102);",
					title: this.IntlString("APP_CONFIG_ZOOM"),
					value: this.zoom,
					onValid: "setZoom",
					onLeft: this.ajustZoom(-1),
					onRight: this.ajustZoom(1),
					values: {
						"125 %": "125%",
						"100 %": "100%",
						"80 %": "80%",
						"60 %": "60%",
						"40 %": "40%",
						"20 %": "20%",
					},
				},
				{
					icons: "volume-up",
					color: "background: rgb(112, 215, 255);",
					title: this.IntlString("APP_CONFIG_VOLUME"),
					value: this.valumeDisplay,
					onValid: "setPhoneVolume",
					onLeft: this.ajustVolume(-0.01),
					onRight: this.ajustVolume(0.01),
					values: {
						"100 %": 1,
						"80 %": 0.8,
						"60 %": 0.6,
						"40 %": 0.4,
						"20 %": 0.2,
						"0 %": 0,
					},
				},
				{
					icons: "language",
					color: "background: rgb(215, 0, 21);",
					title: this.IntlString("APP_CONFIG_LANGUAGE"),
					onValid: "onChangeLanguages",
					values: {
						...this.availableLanguages,
						...cancelOption,
					},
				},
			];
		},
		valumeDisplay() {
			return `${Math.floor(this.volume * 100)} %`;
		},
	},
	methods: {
		...mapActions([
			"getIntlString",
			"setZoon",
			"setBackground",
			"setCoque",
			"setSonido",
			"setVolume",
			"setLanguage",
			"setMouseSupport",
		]),
		scrollIntoViewIfNeeded: function () {
			this.$nextTick(() => {
				document.querySelector(".select").scrollIntoViewIfNeeded();
			});
		},
		onBackspace() {
			if (this.ignoreControls === true) return;
			this.$router.push({ name: "home" });
		},
		onUp: function () {
			if (this.ignoreControls === true) return;
			this.currentSelect = this.currentSelect === 0 ? 0 : this.currentSelect - 1;
			this.scrollIntoViewIfNeeded();
		},
		onDown: function () {
			if (this.ignoreControls === true) return;
			this.currentSelect = this.currentSelect === this.paramList.length - 1 ? this.currentSelect : this.currentSelect + 1;
			this.scrollIntoViewIfNeeded();
		},
		onRight() {
			if (this.ignoreControls === true) return;
			let param = this.paramList[this.currentSelect];
			if (param.onRight !== undefined) {
				param.onRight(param);
			}
		},
		onLeft() {
			if (this.ignoreControls === true) return;
			let param = this.paramList[this.currentSelect];
			if (param.onLeft !== undefined) {
				param.onLeft(param);
			}
		},
		actionItem(param) {
			if (param.values !== undefined) {
				this.ignoreControls = true;
				let choix = Object.keys(param.values).map(key => {
					return { title: key, value: param.values[key], picto: param.values[key] };
				});
				Modal.CreateModal({ choix }).then(reponse => {
					this.ignoreControls = false;
					if (reponse.title === "cancel") return;
					this[param.onValid](param, reponse);
				});
			}
		},
		onPressItem(index) {
			this.actionItem(this.paramList[index]);
		},
		onEnter() {
			if (this.ignoreControls === true) return;
			this.actionItem(this.paramList[this.currentSelect]);
		},
		async onChangeBackground(param, data) {
			let val = data.value;
			if (val === "URL") {
				this.ignoreControls = true;
				Modal.CreateTextModal({
					text: "https://i.imgur.com/",
				})
					.then(valueText => {
						if (
							valueText.text !== "" &&
							valueText.text !== undefined &&
							valueText.text !== null &&
							valueText.text !== "https://i.imgur.com/"
						) {
							this.setBackground({
								label: "Custom",
								value: valueText.text,
							});
						}
					})
					.finally(() => {
						this.ignoreControls = false;
					});
			} else {
				this.setBackground({
					label: data.title,
					value: data.value,
				});
			}
		},
		onChangeCoque: function (param, data) {
			this.setCoque({
				label: data.title,
				value: data.value,
			});
		},

		onChangeSonido: function (param, data) {
			this.setSonido({
				label: data.title,
				value: data.value,
			});
		},

		setZoom: function (param, data) {
			this.setZoon(data.value);
		},
		ajustZoom(inc) {
			return () => {
				const percent = Math.max(10, (parseInt(this.zoom) || 100) + inc);
				this.setZoon(`${percent}%`);
			};
		},
		setPhoneVolume(param, data) {
			this.setVolume(data.value);
		},
		ajustVolume(inc) {
			return () => {
				const newVolume = Math.max(0, Math.min(1, parseFloat(this.volume) + inc));
				this.setVolume(newVolume);
			};
		},
		onChangeLanguages(param, data) {
			if (data.value !== "cancel") {
				this.setLanguage(data.value);
			}
		},
		onChangeMouseSupport(param, data) {
			if (data.value !== "cancel") {
				this.setMouseSupport(data.value);
				this.onBackspace();
			}
		},
		resetPhone: function (param, data) {
			if (data.value !== "cancel") {
				this.ignoreControls = true;
				const cancelStr = this.IntlString("CANCEL");
				const confirmResetStr = this.IntlString("APP_CONFIG_RESET_CONFIRM");
				let choix = [{ title: cancelStr }, { title: confirmResetStr, color: "red", reset: true }];
				Modal.CreateModal({ choix }).then(reponse => {
					this.ignoreControls = false;
					if (reponse.reset === true) {
						this.$phoneAPI.deleteALL();
					}
				});
			}
		},
	},

	created() {
		if (!this.useMouse) {
			this.$bus.$on("keyUpArrowRight", this.onRight);
			this.$bus.$on("keyUpArrowLeft", this.onLeft);
			this.$bus.$on("keyUpArrowDown", this.onDown);
			this.$bus.$on("keyUpArrowUp", this.onUp);
			this.$bus.$on("keyUpEnter", this.onEnter);
		} else {
			this.currentSelect = -1;
		}
		this.$bus.$on("keyUpBackspace", this.onBackspace);
	},
	beforeDestroy() {
		this.$bus.$off("keyUpArrowRight", this.onRight);
		this.$bus.$off("keyUpArrowLeft", this.onLeft);
		this.$bus.$off("keyUpArrowDown", this.onDown);
		this.$bus.$off("keyUpArrowUp", this.onUp);
		this.$bus.$off("keyUpEnter", this.onEnter);
		this.$bus.$off("keyUpBackspace", this.onBackspace);
	},
};
</script>

<style scoped>
.element {
	display: flex;
	flex-direction: row;
	height: 51px;
	line-height: 65px;
	display: flex;
	align-items: center;
	position: relative;
	align-items: center;
	border-bottom: 0.5px solid #dddddd;
	font-family: "SF-Pro-Text-Regular";
}

.icon {
	height: 17.5px;
	width: 17.5px;
}

.fa-cont {
	display: flex;
	height: 35px;
	width: 35px;
	margin-left: 30px;
	border-radius: 7.5px;
	margin-right: 10px;
	align-items: center;
	justify-content: center;
	color: #fff;
}

.element .fa {
	color: #485460;
	font-size: 20px;
	height: 20px;
	width: 50px;
	text-align: center;
}
.element-content {
	margin-left: 6px;
	width: 73%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
.element-title {
	height: 22px;
	line-height: 22px;
	font-size: 20px;
}
.element-value {
	line-height: 25px;
	height: 22px;
	font-size: 16px;
	color: #808080;
}
.element.select,
.element:hover {
	background-color: #ddd;
	cursor: pointer;
}
</style>
