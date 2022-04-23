<template>
	<div class="phone_title_content" :style="dark ? dark : style" :class="{ hasInfoBare: showInfoBare }">
		<InfoBare Dark="#" v-if="showInfoBare" />

		<div class="cont">
			<p @click.stop="back" class="te1">Retour</p>
			<p class="te2">{{ title }}</p>
			<p @click.stop="rightEnable && rightClick()" :class="rightEnable ? 'te3 enable' : 'te3'">{{ right }}</p>
		</div>
	</div>
</template>
<script>
import { mapGetters } from "vuex";
import InfoBare from "./InfoBare";

export default {
	components: {
		InfoBare,
	},

	computed: {
		...mapGetters(["themeColor"]),
		style() {
			return {
				backgroundColor: "#FFF",
				color: "#000",
			};
		},
	},
	methods: {
		back() {
			this.$emit("back");
		},
		rightClick() {
			this.$emit("rightClick");
		},
	},
	props: {
		title: {
			type: String,
			required: true,
		},
		right: {
			type: String,
			required: false,
		},
		rightEnable: {
			type: Boolean,
			default: true,
		},
		showInfoBare: {
			type: Boolean,
			default: true,
		},
		backgroundColor: {
			type: String,
		},
		dark: {
			type: String,
		},
	},
};
</script>
<style lang="scss" scoped>
.title {
	text-align: center;
}

p {
	margin: 0;
}

.cont {
	display: flex;
	align-items: center;
	padding: 0 30px;
	height: 55px;
	font-family: "SF-Pro-Text-Regular";
	font-weight: 600;
	font-size: 18px;
	border-bottom: 0.5px solid #dddddd;
}

.te1 {
	flex: 1;
	color: #327bf6;

	&:hover {
		cursor: pointer;
	}
}

.te2 {
	flex: 1;
	text-align: center;
}

.te3 {
	flex: 1;
	text-align: right;
	color: #e4e4e4;

	&:hover {
		cursor: pointer;
	}

	&.enable {
		color: #327bf6;
	}
}
</style>
