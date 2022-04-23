<template>
	<transition name="modal">
		<div class="modal-mask" @click.stop="cancel">
			<div class="modal-container">
				<div
					class="modal-choix"
					v-bind:class="{ select: index === currentSelect }"
					v-for="(val, index) in choix"
					:key="index"
					@click.stop="selectItem(val)"
				>
					{{ val.title }}
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import store from "./../../store";
import { mapGetters } from "vuex";

export default {
	name: "Modal",
	store: store,
	data() {
		return {
			currentSelect: 0,
		};
	},
	props: {
		choix: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		...mapGetters(["useMouse"]),
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
	},
	created() {
		if (!this.useMouse) {
			this.$bus.$on("keyUpArrowDown", this.onDown);
			this.$bus.$on("keyUpArrowUp", this.onUp);
			this.$bus.$on("keyUpEnter", this.onEnter);
		} else {
			this.currentSelect = -1;
		}
		this.$bus.$on("keyUpBackspace", this.cancel);
	},
	beforeDestroy() {
		this.$bus.$off("keyUpArrowDown", this.onDown);
		this.$bus.$off("keyUpArrowUp", this.onUp);
		this.$bus.$off("keyUpEnter", this.onEnter);
		this.$bus.$off("keyUpBackspace", this.cancel);
	},
};
</script>

<style scoped>
.modal-mask {
	position: absolute;
	z-index: 99;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	padding: 0 15px 20px 15px;
	background-color: rgba(0, 0, 0, 0.3);
	display: flex;
	align-items: flex-end;
	transition: opacity 0.3s ease;
}

.modal-container {
	width: 100%;
	margin: 0;
	padding: 0;
	background-color: #fff;
	border-radius: 35px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
	transition: all 0.3s ease;
	padding-bottom: 0px;
	max-height: 100%;
	overflow-y: auto;
}

.modal-title {
	text-align: center;
	height: 32px;
	line-height: 32px;
	color: #0080f9;
}
.modal-choix {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 70px;
	line-height: 65px;
	color: #0080f9;
	position: relative;
	background-color: #ffffff;
	font-weight: 400;
	font-size: 22px;
	border-bottom: 1px solid #e0e0e0;
	transition-duration: 200ms;
}
.modal-choix .fa,
.modal-choix .fas {
	font-size: 18px;
	line-height: 24px;
	margin-left: 12px;
	margin-right: 12px;
}
.modal-choix .picto {
	z-index: 500;
	position: absolute;
	width: 42px;
	background-size: 100% !important;
	background-position-y: 100%;
	height: 42px;
}
.modal-choix.select,
.modal-choix:hover {
	background-color: #eeeeee;
	cursor: pointer;
	color: #42b2dc;
}
</style>
