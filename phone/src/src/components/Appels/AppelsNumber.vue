<template>
	<div class="phone_app">
		<div id="keypad-page">
			<div>
				<div class="keypad-header">
					<h2 class="keypad-number">{{ numeroFormat }}</h2>
				</div>
				<div>
					<div class="keypad-row">
						<div @click.stop="onPressKey(1)" class="keypad-btn">1</div>
						<div @click.stop="onPressKey(2)" class="keypad-btn">
							2
							<div class="keypad-letters">A B C</div>
						</div>
						<div @click.stop="onPressKey(3)" class="keypad-btn">
							3
							<div class="keypad-letters">D E F</div>
						</div>
					</div>

					<div class="keypad-row">
						<div @click.stop="onPressKey(4)" class="keypad-btn">
							4
							<div class="keypad-letters">G H I</div>
						</div>
						<div @click.stop="onPressKey(5)" class="keypad-btn">
							5
							<div class="keypad-letters">J K L</div>
						</div>
						<div @click.stop="onPressKey(6)" class="keypad-btn">
							6
							<div class="keypad-letters">M N O</div>
						</div>
					</div>

					<div class="keypad-row">
						<div @click.stop="onPressKey(7)" class="keypad-btn">
							7
							<div class="keypad-letters">P Q R S</div>
						</div>
						<div @click.stop="onPressKey(8)" class="keypad-btn">
							8
							<div class="keypad-letters">T U V</div>
						</div>
						<div @click.stop="onPressKey(9)" class="keypad-btn">
							9
							<div class="keypad-letters">W X Y Z</div>
						</div>
					</div>

					<div class="keypad-row">
						<div id="asterisk" class="keypad-btn">*</div>
						<div class="keypad-btn" @click.stop="onPressKey(0)">
							0
							<div id="plus">+</div>
						</div>
						<div class="keypad-btn">
							<div id="sharp-icon">
								<div>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 76.816 74.616"
										class="injected-svg"
										data-src="/c4b60a2a53838a537e0a3f0a504cc548.svg"
										xmlns:xlink="http://www.w3.org/1999/xlink"
									>
										<path
											id="Tracé_66-3"
											data-name="Tracé 66"
											d="M13.916-16.943H29.248v14.8A3.859,3.859,0,0,0,30.317.824,3.859,3.859,0,0,0,33.248,2,3.859,3.859,0,0,0,36.179.824a3.859,3.859,0,0,0,1.069-2.972v-14.8h21.68v14.8A3.859,3.859,0,0,0,60,.824,3.859,3.859,0,0,0,62.928,2,3.859,3.859,0,0,0,65.859.824a3.859,3.859,0,0,0,1.069-2.972v-14.8H82.422a3.885,3.885,0,0,0,2.963-1.079,3.885,3.885,0,0,0,1.187-2.921,3.871,3.871,0,0,0-1.16-2.964A3.871,3.871,0,0,0,82.422-25H66.943V-45.361H82.422a3.859,3.859,0,0,0,2.972-1.069,3.859,3.859,0,0,0,1.178-2.931A3.834,3.834,0,0,0,85.4-52.3a3.834,3.834,0,0,0-2.981-1.06H66.943v-15.1a3.834,3.834,0,0,0-1.06-2.981,3.834,3.834,0,0,0-2.94-1.169A3.834,3.834,0,0,0,60-71.438a3.834,3.834,0,0,0-1.06,2.981v15.088H37.256V-68.457a3.834,3.834,0,0,0-1.06-2.981,3.834,3.834,0,0,0-2.94-1.169,3.834,3.834,0,0,0-2.94,1.169,3.834,3.834,0,0,0-1.06,2.981v15.088H13.916a3.834,3.834,0,0,0-2.981,1.06,3.834,3.834,0,0,0-1.169,2.94,3.859,3.859,0,0,0,1.178,2.931,3.859,3.859,0,0,0,2.972,1.069H29.248V-25H13.916a3.871,3.871,0,0,0-2.988,1.091,3.871,3.871,0,0,0-1.162,2.962,3.885,3.885,0,0,0,1.185,2.924,3.885,3.885,0,0,0,2.965,1.08ZM37.256-25V-45.361h21.68V-25Z"
											transform="translate(-9.761 72.611)"
										></path>
									</svg>
								</div>
							</div>
						</div>
					</div>

					<div class="keypad-row">
						<div @click.stop="onPressCall" id="call-btn" class="keypad-btn">
							<div id="call-icon">
								<div>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 92.382 92.48"
										class="injected-svg"
										data-src="/56b6b7a7ca3bbe3cd1566370c4f593f3.svg"
										xmlns:xlink="http://www.w3.org/1999/xlink"
									>
										<path
											d="M36.621-12.842c14.4,14.453,31.934,25.586,46.24,25.586a21.312,21.312,0,0,0,16.5-7.227c2.637-2.93,4.248-6.3,4.248-9.668a8.152,8.152,0,0,0-3.515-6.885L85.107-21.68c-2.393-1.66-4.346-2.441-6.1-2.441-2.295,0-4.346,1.269-6.592,3.516L68.9-17.09a2.828,2.828,0,0,1-1.9.781,4.04,4.04,0,0,1-2-.586c-3.076-1.66-8.35-6.152-13.232-11.035S42.334-38.037,40.723-41.162a4.187,4.187,0,0,1-.537-2,2.735,2.735,0,0,1,.732-1.855l3.516-3.564c2.2-2.295,3.516-4.3,3.516-6.592,0-1.807-.781-3.76-2.441-6.1l-10.6-14.844a8.37,8.37,0,0,0-7.129-3.613,13.794,13.794,0,0,0-9.521,4.248,21.952,21.952,0,0,0-7.031,16.6C11.231-44.58,22.217-27.246,36.621-12.842Z"
											transform="translate(-11.231 79.736)"
										></path>
									</svg>
								</div>
							</div>
						</div>

						<div id="keypad-delete" @click="deleteNumber">
							<div id="delete-icon">
								<div>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 81.982 69.824"
										class="injected-svg"
										data-src="/da31ed4172007170bce4080c775eab08.svg"
										xmlns:xlink="http://www.w3.org/1999/xlink"
									>
										<g transform="translate(-7.813 70.117)">
											<circle cx="55" cy="-38" r="25" fill="black"></circle>
											<path
												id="delete-fill-svg-4"
												data-name="Tracé 34"
												d="M78.125-.293c7.715,0,11.67-3.857,11.67-11.475V-58.594c0-7.666-3.955-11.523-11.67-11.523H45.166c-4.395,0-8.057,1.074-11.133,4.3L11.279-42.334c-2.393,2.49-3.467,4.688-3.467,7.08,0,2.344,1.025,4.59,3.467,7.031l22.8,23.291A14.647,14.647,0,0,0,45.166-.293ZM69.238-18.6a2.84,2.84,0,0,1-2.1-.879L55.713-30.908,44.287-19.482a2.949,2.949,0,0,1-2.148.879,3.063,3.063,0,0,1-3.076-3.076,2.965,2.965,0,0,1,.928-2.148L51.367-35.205,39.99-46.631a2.888,2.888,0,0,1-.928-2.148A3.105,3.105,0,0,1,42.139-51.9a3,3,0,0,1,2.148.928L55.713-39.6,67.09-50.977a3.172,3.172,0,0,1,2.148-.928,3.115,3.115,0,0,1,3.125,3.125,3.081,3.081,0,0,1-.928,2.148L60.059-35.205,71.436-23.828a3.172,3.172,0,0,1,.928,2.148A3.105,3.105,0,0,1,69.238-18.6Z"
											></path>
										</g>
									</svg>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
/*
     <div class="number">
        {{ numeroFormat }}
        <span class="deleteNumber" @click.stop="deleteNumber"></span>
      </div>

  <div
    class="key"
    v-for="(key, i) of keyInfo" :key="key.primary"
    :class="{'key-select': i === keySelect, 'keySpe': key.isNotNumber === true}"
    @click.stop="onPressKey(key)"
  >
    <span @click.stop="onPressKey(key)" class="key-primary">{{key.primary}}</span>
    <span @click.stop="onPressKey(key)" class="key-secondary">{{key.secondary}}</span>
  </div>

  <div class="call">
        <div class="call-btn" :class="{'active': keySelect === 12}"
          @click.stop="onPressCall">
        <svg viewBox="0 0 24 24" @click.stop="onPressCall">
          <g transform="rotate(0, 12, 12)">
          <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
            </g>
        </svg>
        </div>
      </div>
*/

import { mapActions, mapGetters } from "vuex";
import PhoneTitle from "./../PhoneTitle";
export default {
	components: {
		PhoneTitle,
	},
	data() {
		return {
			numero: "",
			keyInfo: [
				{ primary: "1", secondary: "" },
				{ primary: "2", secondary: "abc" },
				{ primary: "3", secondary: "def" },
				{ primary: "4", secondary: "ghi" },
				{ primary: "5", secondary: "jkl" },
				{ primary: "6", secondary: "mmo" },
				{ primary: "7", secondary: "pqrs" },
				{ primary: "8", secondary: "tuv" },
				{ primary: "9", secondary: "wxyz" },
				{ primary: "-", secondary: "", isNotNumber: true },
				{ primary: "0", secondary: "+" },
				{ primary: "#", secondary: "", isNotNumber: true },
			],
			keySelect: 0,
		};
	},
	methods: {
		...mapActions(["startCall"]),
		onLeft() {
			this.keySelect = Math.max(this.keySelect - 1, 0);
		},
		onRight() {
			this.keySelect = Math.min(this.keySelect + 1, 11);
		},
		onDown() {
			this.keySelect = Math.min(this.keySelect + 3, 12);
		},
		onUp() {
			if (this.keySelect > 2) {
				if (this.keySelect === 12) {
					this.keySelect = 10;
				} else {
					this.keySelect = this.keySelect - 3;
				}
			}
		},
		onEnter() {
			if (this.keySelect === 12) {
				if (this.numero.length > 0) {
					this.startCall({ numero: this.numeroFormat });
				}
			} else {
				this.numero += this.keyInfo[this.keySelect].primary;
			}
		},
		onBackspace: function () {
			if (this.ignoreControls === true) return;
			if (this.numero.length !== 0) {
				this.numero = this.numero.slice(0, -1);
			} else {
				history.back();
			}
		},
		deleteNumber() {
			if (this.numero.length !== 0) {
				this.numero = this.numero.slice(0, -1);
			}
		},
		onPressKey(num) {
			// If number is too long, don't allow more.
			if (this.numero.length >= 9) return;
			this.numero = this.numero + num;
		},
		onPressCall() {
			this.startCall({ numero: this.numeroFormat });
		},
		quit() {
			history.back();
		},
	},

	computed: {
		...mapGetters(["IntlString", "useMouse", "useFormatNumberFrance"]),
		numeroFormat() {
			if (this.useFormatNumberFrance === true) {
				return this.numero;
			}
			const l = this.numero.startsWith("#") ? 4 : 3;
			if (this.numero.length > l) {
				return this.numero.slice(0, l) + "-" + this.numero.slice(l);
			} else {
				return this.numero;
			}
		},
	},

	created() {
		if (!this.useMouse) {
			this.$bus.$on("keyUpBackspace", this.onBackspace);
			this.$bus.$on("keyUpArrowLeft", this.onLeft);
			this.$bus.$on("keyUpArrowRight", this.onRight);
			this.$bus.$on("keyUpArrowDown", this.onDown);
			this.$bus.$on("keyUpArrowUp", this.onUp);
			this.$bus.$on("keyUpEnter", this.onEnter);
		} else {
			this.keySelect = -1;
		}
	},
	beforeDestroy() {
		this.$bus.$off("keyUpBackspace", this.onBackspace);
		this.$bus.$off("keyUpArrowLeft", this.onLeft);
		this.$bus.$off("keyUpArrowRight", this.onRight);
		this.$bus.$off("keyUpArrowDown", this.onDown);
		this.$bus.$off("keyUpArrowUp", this.onUp);
		this.$bus.$off("keyUpEnter", this.onEnter);
	},
};
</script>

<style scoped>
#keypad-page {
	margin-top: 20px;
	height: 75%;
	font-family: "SF-Pro-Text-Regular";
}

.keypad-row {
	display: flex;
	justify-content: center;
}

.keypad-header {
	height: 90px;
	margin-bottom: 30px;
}

.keypad-number {
	line-height: 120px;
	text-align: center;
	vertical-align: middle;
}

.keypad-btn {
	height: 80px;
	width: 80px;
	padding: 15px;
	margin: 10px;
	background-color: #e5e5e5;
	text-align: center;
	border-radius: 50%;
	font-size: 32px;
}

.keypad-btn:hover {
	background-color: rgba(0, 0, 0, 0.5);
	cursor: pointer;
}

#call-btn {
	background-color: #63c366;
	fill: white;
	margin-left: 60px;
}

#call-btn:hover {
	background-color: rgb(47, 170, 51);
}

#call-icon {
	width: 30px;
	margin-top: 10px;
	margin-left: 10px;
}

.keypad-letters {
	margin-top: -1px;
	font-size: 10px;
	font-weight: bold;
}

#asterisk {
	font-size: 45px;
	font-weight: 100;
	vertical-align: middle;
	line-height: 65px;
}

#plus {
	margin-top: -6px;
	font-size: 10px;
	font-weight: bolder;
}

#sharp-icon {
	width: 18px;
	height: 18px;
	margin-left: 16px;
	margin-top: 0px;
}

#delete-icon {
	fill: #e5e5e5;
	width: 40px;
	margin-top: 10px;
	height: 25px;
}

#delete-icon:hover {
	fill: #919191;

	cursor: pointer;
}

#keypad-delete {
	margin: 8px;
	padding: 15px 15px;
	width: 20px;
}
</style>
