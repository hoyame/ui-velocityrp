<template>
	<div class="app-container-dark">
		<InfoBare />

		<div id="keypad-page">
			<h1 class="calculator-result" style="font-size: 85px">{{ input }}</h1>

			<div class="btn-container">
				<div @click="remove()" class="btn-circle btn-light">AC</div>
				<div class="btn-circle btn-light">+/-</div>
				<div @click="calc('%')" class="btn-circle btn-light">%</div>
				<div @click="calc('÷')" class="btn-circle btn-orange">÷</div>
				<div @click="write(7)" class="btn-circle btn-dark">7</div>
				<div @click="write(8)" class="btn-circle btn-dark">8</div>
				<div @click="write(9)" class="btn-circle btn-dark">9</div>
				<div @click="calc('x')" class="btn-circle btn-orange">×</div>
				<div @click="write(4)" class="btn-circle btn-dark">4</div>
				<div @click="write(5)" class="btn-circle btn-dark">5</div>
				<div @click="write(6)" class="btn-circle btn-dark">6</div>
				<div @click="calc('-')" class="btn-circle btn-orange">-</div>
				<div @click="write(1)" class="btn-circle btn-dark">1</div>
				<div @click="write(2)" class="btn-circle btn-dark">2</div>
				<div @click="write(3)" class="btn-circle btn-dark">3</div>
				<div @click="calc('+')" class="btn-circle btn-orange">+</div>
				<div @click="write(0)" class="btn-circle btn-lg">0</div>
				<div class="btn-circle btn-dark">,</div>
				<div @click="result()" class="btn-circle btn-orange">=</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import PhoneTitle from "./../PhoneTitle";
import InfoBare from "./../InfoBare";

export default {
	name: "Calculator",

	computed: {
		...mapGetters(["IntlString"]),
	},

	components: {
		PhoneTitle,
		InfoBare,
	},

	methods: {
		write(number) {
			this.input = this.input + String(number);
		},

		calc(s) {
			console.log(s);
			this.firstInput = this.input;
			this.input = "";
			this.operator = s;
		},

		result() {
			switch (this.operator) {
				case "+":
					this.resulti = parseInt(this.firstInput) + parseInt(this.input);
					this.input = this.resulti;
					break;
				case "-":
					this.resulti = this.firstInput - this.input;
					this.input = this.resulti;
					break;
				case "x":
					this.resulti = parseInt(this.firstInput) * parseInt(this.input);
					this.input = this.resulti;
					break;
				case "÷":
					this.resulti = parseInt(this.firstInput) / parseInt(this.input);
					this.input = this.resulti;
					break;
				case "%":
					this.resulti = parseInt(this.firstInput) % parseInt(this.input);
					this.input = this.resulti;
					break;
				default:
					break;
			}
		},

		remove() {
			this.input = "";
		},
	},

	data() {
		return {
			firstInput: "",
			lastInput: "",
			input: "",
			operator: "",
			resulti: "",
		};
	},
};
</script>

<style scoped>
.app-container-dark {
	height: 100%;
	width: 100%;
	background-color: #111111;
	border-radius: 30px;
	overflow: hidden;
	user-select: none;
}
#keypad-page {
	margin-top: 20px;
	height: 82%;
	width: 90%;
	margin-left: 28px;
	font-family: "SF-Pro-Text-Regular";
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
}
.calculator-result {
	margin: 0 20px 30px 0;
	text-align: end;
	font-size: 50px;
	color: white;
	font-weight: normal;
}

.btn-circle {
	height: 85px;
	width: 85px;
	border-radius: 55px;
	line-height: 85px;
	text-align: center;
	margin: 5px;
	font-size: 40px;
	color: white;
}
.btn-circle:hover {
	background-color: rgba(0, 0, 0, 0.5);
	cursor: pointer;
}
.btn-container {
	display: flex;
	flex-wrap: wrap;
	width: 100%;
}
.btn-light {
	background-color: #a5a5a5;
	color: black;
}
.btn-orange {
	background-color: #f2a23c;
}
.btn-white {
	background-color: white;
	color: #f2a23c;
}
.btn-dark {
	background-color: #333333;
}
.btn-lg {
	width: 180px;
	text-align: start;
	padding-left: 18px;
	background-color: #333333;
}
</style>
