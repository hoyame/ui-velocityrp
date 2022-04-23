<template>
	<div class="phone_app">
		<InfoBare dark="f" />

		<div class="content">
			<p class="title">Banque</p>

			<img
				class="card"
				src="https://cdn.discordapp.com/attachments/595001385716678847/833433740301959198/mini-hero-apple-pay-cash-card-2x.png"
			/>

			<p class="moneyTitle">Solde : ${{ bankAmontFormat }}</p>

			<CustomInput type="text" style="font-size: 16px" class="inputtt" v-autofocus ref="form0" v-model="id" placeholder="IBAN" />
			<CustomInput
				style="font-size: 16px"
				class="inputtt"
				oninput="this.value = this.value.replace(/[^0-9.]/g, ''); this.value = this.value.replace(/(\..*)\./g, '$1');"
				ref="form1"
				v-model="paratutar"
				placeholder="$"
			/>
			<br /><br />
			<button ref="form2" id="gonder" @click.stop="paragonder" class="buton">{{ IntlString("APP_BANK_BUTTON_TRANSFER") }}</button>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import InfoBare from "../InfoBare";
import CustomInput from "../CustomInput";
export default {
	components: {
		InfoBare,
		CustomInput,
	},
	data() {
		return {
			id: "",
			paratutar: "",
			currentSelect: 0,
		};
	},
	methods: {
		...mapActions(["sendpara"]),
		scrollIntoViewIfNeeded: function () {
			this.$nextTick(() => {
				document.querySelector("focus").scrollIntoViewIfNeeded();
			});
		},
		onBackspace() {
			this.$router.go(-1);
		},
		iptal() {
			this.$router.go(-1);
		},
		paragonder() {
			const paratutar = this.paratutar.trim();
			if (paratutar === "") return;
			this.paratutar = "";
			this.sendpara({
				id: this.id,
				amount: paratutar,
			});
		},
		onUp: function () {
			if (this.currentSelect - 1 >= 0) {
				this.currentSelect = this.currentSelect - 1;
			}
			this.$refs["form" + this.currentSelect].focus();
			console.log(this.currentSelect);
		},
		onDown() {
			if (this.currentSelect + 1 <= 3) {
				this.currentSelect = this.currentSelect + 1;
			}
			this.$refs["form" + this.currentSelect].focus();
			console.log(this.currentSelect);
		},
		onEnter() {
			if (this.ignoreControls === true) return;
			if (this.currentSelect === 2) {
				this.paragonder();
			} else if (this.currentSelect === 0) {
				this.$phoneAPI.getReponseText().then(data => {
					// convert data.text explicitly to a string so if a number is
					// passed it we can handle that
					this.id = `${data.text}`.trim();
				});
			} else if (this.currentSelect === 1) {
				this.$phoneAPI.getReponseText().then(data => {
					this.paratutar = `${data.text}`.trim();
				});
			} else if (this.currentSelect === 3) {
				this.iptal();
			}
		},
	},
	computed: {
		...mapGetters(["bankAmont", "IntlString", "useMouse"]),
		bankAmontFormat() {
			return Intl.NumberFormat().format(this.bankAmont);
		},
	},
	created() {
		this.display = this.$route.params.display;
		if (!this.useMouse) {
			this.$bus.$on("keyUpArrowDown", this.onDown);
			this.$bus.$on("keyUpArrowUp", this.onUp);
			this.$bus.$on("keyUpEnter", this.onEnter);
		}
		this.$bus.$on("keyUpBackspace", this.onBackspace);
	},
	beforeDestroy() {
		this.$bus.$off("keyUpArrowDown", this.onDown);
		this.$bus.$off("keyUpArrowUp", this.onUp);
		this.$bus.$off("keyUpEnter", this.onEnter);
		this.$bus.$off("keyUpBackspace", this.onBackspace);
	},
};
</script>

<style scoped>
.phone_app {
	background-color: #f3f2f8;
}

.logo_maze {
	width: 100%;
	height: auto;
	flex-shrink: 0;

	width: 113%;
	margin-left: -18px;
	margin-top: -12em;
}

.content {
	padding: 10px 35px;
}

.num-tarj {
	margin-top: 1em;
	display: flex;
	justify-content: center;
	font-weight: bold;
}

.moneyTitle {
	font-weight: 600;
	color: #000;
	font-size: 20px;
}

.title {
	height: 34px;
	line-height: 34px;
	font-size: 38px;
	font-weight: 900;
	font-family: "SF-Pro-Display-Bold";
}

.card {
	height: 231px;
	width: 365px;
	border-radius: 15px;
}

.info-card {
	display: grid;
}

.card-ti {
	color: #fff;
	font-family: "SF-Pro-Display-Semibold";
	margin: 0;
}

.card-visa {
	float: right;

	height: 30px;
}

.card-nb {
	color: #fff;
	font-family: "SF-Pro-Display-Semibold";
	font-size: 18px;
	margin: 0;
}

.card-exp {
	color: #fff;
	font-family: "SF-Pro-Display-Semibold";
	font-size: 18px;
	margin: 0;
}

.elements {
	display: flex;
	position: relative;
	width: 100%;
	flex-direction: column;
	height: 100%;
	justify-content: center;
}

.inputtt {
	height: 50px;
	width: 100%;
	border: none;
	resize: none;
	margin-bottom: 20px;
	border: 1px solid #e4e4e4;
	padding: 5px;
	padding-left: 10px;
	border-radius: 15px;
	outline: none;
	font-size: 18px;
	font-family: "SF-Pro-Display-Regular";
}

.buton {
	height: 55px;
	width: 100%;
	border: 1px solid #fff;
	background: #fff;
	margin-bottom: 20px;
	font-size: 20px;
	border-radius: 15px;
	font-family: "SF-Pro-Display-Bold";
	transition-duration: 250ms;
}

.buton:hover {
	background-color: rgba(0, 0, 0, 0.01);
	cursor: pointer;
}
</style>
