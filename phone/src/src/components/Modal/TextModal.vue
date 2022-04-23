<template>
	<transition name="modal">
		<div class="modal-mask">
			<div class="modal-container" @click.stop>
				<h2 :style="'color: #000'">{{ title }}</h2>
				<textarea
					class="modal-textarea"
					:class="{ oneline: limit <= 18 }"
					ref="textarea"
					v-model="inputText"
					:maxlength="limit"
				></textarea>
				<div class="botton-container">
					<button :style="'color: #0080f9; borderBottomLeftRadius: 25px;'" @click="cancel">
						{{ IntlString("CANCEL") }}
					</button>
					<button :style="'color: #0080f9; borderBottomRightRadius: 25px;'" @click="valide">
						{{ IntlString("OK") }}
					</button>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import store from "./../../store";
import { mapGetters } from "vuex";

export default {
	name: "TextModal",
	store: store,
	data() {
		return {
			inputText: "",
		};
	},
	props: {
		title: {
			type: String,
			default: () => "",
		},
		text: {
			type: String,
			default: () => "",
		},
		limit: {
			type: Number,
			default: 255,
		},
	},
	computed: {
		...mapGetters(["IntlString", "themeColor"]),
		color() {
			return this.themeColor || "#2A56C6";
		},
	},
	methods: {
		scrollIntoViewIfNeeded() {
			this.$nextTick(() => {
				document.querySelector(".modal-choix.select").scrollIntoViewIfNeeded();
			});
		},
		onUp() {
			this.currentSelect = this.currentSelect === 0 ? 0 : this.currentSelect - 1;
			this.scrollIntoViewIfNeeded();
		},
		onDown() {
			this.currentSelect = this.currentSelect === this.choix.length - 1 ? this.currentSelect : this.currentSelect + 1;
			this.scrollIntoViewIfNeeded();
		},
		selectItem(elem) {
			this.$emit("select", elem);
		},
		onEnter() {
			this.$emit("select", this.choix[this.currentSelect]);
		},
		cancel() {
			this.$emit("cancel");
		},
		valide() {
			this.$emit("valid", {
				text: this.inputText,
			});
		},
	},
	created() {
		this.inputText = this.text;
	},
	mounted() {
		this.$nextTick(() => {
			this.$refs.textarea.focus();
		});
	},
	beforeDestroy() {},
};
</script>

<style scoped>
* {
	font-family: "SF-Pro-Display-Regular";
}

.modal-mask {
	position: absolute;
	z-index: 99;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.3);
	display: flex;
	align-items: center;
	justify-content: center;
	transition: opacity 0.3s ease;
}

.modal-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 0;
	padding: 0;
	background-color: #fff;
	border-radius: 25px;
	transition: all 0.3s ease;
	padding-bottom: 16px;
	max-height: 100%;
	width: 80%;
	padding: 10px 0 0 0;
	font-size: 18px;
}

h2 {
	font-size: 23px;
	font-family: "SF-Pro-Display-Bold";
	text-align: center;
}

.modal-textarea {
	width: 90%;
	height: 130px;
	border: none;
	resize: none;
	margin-top: 5px;
	margin-bottom: 15px;
	border: 1px solid #d3d5d6;
	padding: 5px;
	border-radius: 5px;
	outline: none;
	font-size: 18px;
}
.modal-textarea.oneline {
	height: 38px;
}

.botton-container {
	margin-top: 10px;
	display: flex;
	width: 100%;
	justify-content: space-between;
}

.botton-container button {
	background-color: transparent;
	border: none;
	width: 50%;
	height: 55px;
	font-size: 20px;
	font-weight: 700;
	border: 1px solid #d3d5d6;

	color: #000;
	outline: none;
}
.botton-container button:hover {
	background-color: rgba(0, 0, 0, 0.1);
}
</style>
