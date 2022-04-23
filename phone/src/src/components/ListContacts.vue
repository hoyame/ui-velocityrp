<template>
	<div class="phone_app">
		<PhoneTitle
			:title="title"
			:showInfoBare="showInfoBare"
			v-if="showHeader"
			@back="back"
			:right="isGroupSelection ? 'Valider' : ''"
			:rightEnable="isGroupSelection && selectedItems.length > 1 && selectedItems.length < 15"
			@rightClick="createGroup"
		/>
		<div class="phone_content elements">
			<div
				v-bind:class="{ element: elem.id != -1, separator: elem.id == -1 && elem.display.length == 1 && elem.display !== '+' }"
				v-for="elem in list"
				v-bind:key="elem[keyDispay]"
				@click.stop="selectItem(elem)"
				@contextmenu.prevent="optionItem(elem)"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 78.857 78.809"
					class="circle-checkbox"
					v-if="isGroupSelection && elem.id > -1 && !selectedItems.includes(elem.number)"
				>
					<path
						d="M46.24,4.15a39.744,39.744,0,0,0,39.453-39.4c0-21.533-17.969-39.4-39.5-39.4a39.691,39.691,0,0,0-39.355,39.4A39.734,39.734,0,0,0,46.24,4.15Zm0-7.422A31.791,31.791,0,0,1,14.356-35.254,31.749,31.749,0,0,1,46.191-67.236,31.915,31.915,0,0,1,78.223-35.254,31.812,31.812,0,0,1,46.24-3.271Z"
						transform="translate(-6.836 74.658)"
					/>
				</svg>
				<svg
					v-if="isGroupSelection && elem.id > -1 && selectedItems.includes(elem.number)"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 78.857 78.809"
					class="circle-checkbox selected"
				>
					<g transform="translate(-6.836 74.658)">
						<rect x="20" y="-60" width="52" height="55" style="fill: rgb(255, 255, 255)" />
						<path
							d="M46.24,4.15a39.744,39.744,0,0,0,39.453-39.4c0-21.533-17.969-39.4-39.5-39.4a39.691,39.691,0,0,0-39.355,39.4A39.734,39.734,0,0,0,46.24,4.15ZM40.527-15.43a4.894,4.894,0,0,1-3.906-2.148L25.977-30.957a4.657,4.657,0,0,1-1.025-2.783,3.524,3.524,0,0,1,3.516-3.613,4.028,4.028,0,0,1,3.369,1.807l8.5,11.377,17.09-27.686a3.722,3.722,0,0,1,3.125-2,3.522,3.522,0,0,1,3.76,3.32,6.413,6.413,0,0,1-1.123,2.93L44.189-17.578A4.358,4.358,0,0,1,40.527-15.43Z"
						/>
					</g>
				</svg>
				<div v-if="elem.display.length > 1" class="icon" v-bind:style="stylePuce(elem)" @click.stop="selectItem(elem)">
					{{ elem.letter || elem[keyDispay][0] }}
				</div>
				<div @click.stop="selectItem(elem)" v-if="elem.keyDesc === undefined || elem.keyDesc === ''" class="elem-title">
					{{ elem.display.length > 1 ? elem.display : elem.display[0] }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import PhoneTitle from "./PhoneTitle";
import InfoBare from "./InfoBare";
import { mapGetters } from "vuex";

export default {
	name: "hello",
	components: {
		PhoneTitle,
		InfoBare,
	},
	data: function () {
		return {
			currentSelect: 0,
			selectedItems: [],
		};
	},
	props: {
		title: {
			type: String,
			default: "Title",
		},
		showHeader: {
			type: Boolean,
			default: true,
		},
		showInfoBare: {
			type: Boolean,
			default: true,
		},
		list: {
			type: Array,
			required: true,
		},
		color: {
			type: String,
			default: "#FFFFFF",
		},
		backgroundColor: {
			type: String,
			default: "#4CAF50",
		},
		keyDispay: {
			type: String,
			default: "display",
		},
		disable: {
			type: Boolean,
			default: false,
		},
		titleBackgroundColor: {
			type: String,
			default: "#FFFFFF",
		},
		isGroupSelection: {
			type: Boolean,
			default: false,
		},
	},
	watch: {
		list: function () {
			this.currentSelect = 0;
		},
	},
	computed: {
		...mapGetters(["useMouse"]),
	},
	methods: {
		styleTitle: function () {
			return {
				color: this.color,
				backgroundColor: this.backgroundColor,
			};
		},
		stylePuce(data) {
			data = data || {};
			if (data.icon !== undefined) {
				return {
					backgroundImage: `url(${data.icon})`,
					backgroundSize: "cover",
					color: "rgba(0,0,0,0)",
				};
			}
			return {
				color: data.color || this.color,
				backgroundColor: data.backgroundColor || this.backgroundColor,
				borderRadius: "50%",
			};
		},
		scrollIntoViewIfNeeded: function () {
			this.$nextTick(() => {
				document.querySelector(".select").scrollIntoViewIfNeeded();
			});
		},
		onUp: function () {
			if (this.disable === true) return;
			this.currentSelect = this.currentSelect === 0 ? this.list.length - 1 : this.currentSelect - 1;
			this.scrollIntoViewIfNeeded();
		},
		onDown: function () {
			if (this.disable === true) return;
			this.currentSelect = this.currentSelect === this.list.length - 1 ? 0 : this.currentSelect + 1;
			this.scrollIntoViewIfNeeded();
		},
		selectItem(item) {
			if (item.id < 0) return;
			if (this.isGroupSelection) {
				if (this.selectedItems.includes(item.number)) {
					this.selectedItems = this.selectedItems.filter(elem => elem !== item.number);
				} else {
					this.selectedItems.push(item.number);
				}
			} else {
				this.$emit("select", item);
			}
		},
		createGroup() {
			this.$emit("createGroup", this.selectedItems);
		},
		optionItem(item) {
			this.$emit("option", item);
		},
		back() {
			this.$emit("back");
		},
		onRight: function () {
			if (this.disable === true) return;
			this.$emit("option", this.list[this.currentSelect]);
		},
		onEnter: function () {
			if (this.disable === true) return;
			this.$emit("select", this.list[this.currentSelect]);
		},
	},
	created: function () {
		this.currentSelect = -1;
		this.selectedItems = [];
	},
};
</script>

<style scoped>
.list {
	height: 100%;
}

.elements {
	overflow-y: auto;
}

.element {
	width: 100%;
	margin: 0 auto;
	height: 50px;
	line-height: 45px;
	background-color: #fff;
	border-bottom: 0.5px solid #dddddd;
	padding-left: 15px;
	display: flex;
	align-items: center;
	position: relative;
	font-family: "SF-Pro-Text-Semibold";
	font-size: 18px;
	font-weight: 400;
}

.separator {
	width: 100%;
	height: 30px;
	line-height: 45px;
	background-color: #fff;
	background: #e4e4e4;
	border-bottom: 0.5px solid #fff;
	padding-left: 25px;
	display: flex;
	align-items: center;
	position: relative;
	font-family: "SF-Pro-Text-Semibold";
	font-size: 18px;
	font-weight: 400;
}

.element.select,
.element:hover {
	cursor: pointer;
	background-color: #f1f1f1;
}

.elem-pic {
	margin-left: 12px;
	height: 48px;
	width: 48px;
	text-align: center;
	line-height: 48px;
	font-weight: 700;
}
.elem-puce {
	background-color: red;
	color: white;
	height: 18px;
	width: 18px;
	line-height: 18px;
	border-radius: 50%;
	text-align: center;
	font-size: 14px;
	margin: 0px;
	padding: 0px;
	position: absolute;
	left: 42px;
	top: 36px;
	z-index: 6;
}
.elem-title {
	margin-left: 5px;
}
.elem-title-has-desc {
	margin-top: -15px;
	margin-left: 12px;
}
.elem-description {
	text-align: left;
	color: grey;
	position: absolute;
	display: block;
	width: 75%;
	left: 73px;
	top: 12px;
	font-size: 13.5px;
	font-style: italic;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.icon {
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	justify-content: center;
	height: 35px;
	width: 35px;
	border-radius: 50%;
	margin-left: 12px;
	color: #fff;
	font-family: "SF-Pro-Text-Regular";
	margin-right: 10px;
	background: -webkit-gradient(linear, left top, left bottom, from(#a6abb7), to(#858992));
	background: linear-gradient(#a6abb7, #858992);
}

.circle-checkbox {
	width: 16px;
	fill: #b2b2b2;
}

.circle-checkbox.selected {
	fill: #327bf6;
}
</style>
