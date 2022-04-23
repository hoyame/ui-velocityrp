<template>
	<div class="phone_app">
		<PhoneTitle :title="contact.display" @back="forceCancel" />
		<div class="phone_content content inputText">
			<div class="inputs">
				<div class="input-c" data-type="text" data-model="display" data-maxlength="64">
					<CustomInput placeholder="Nom" type="text" v-model="contact.display" maxlength="64" v-autofocus class="inputText" />
				</div>

				<div class="input-c" data-type="text" data-model="number" data-maxlength="10">
					<CustomInput placeholder="Numero" type="text" v-model="contact.number" maxlength="10" class="inputText" />
				</div>
			</div>

			<div style="margin-top: 50px" class="group" data-type="button" data-action="cancel" @click.stop="forceCancel">
				<input type="button" class="btn" :value="IntlString('APP_CONTACT_CANCEL')" @click.stop="forceCancel" />
			</div>
			<div class="group" data-type="button" data-action="save" @click.stop="save">
				<input type="button" class="btn" :value="IntlString('APP_CONTACT_SAVE')" @click.stop="save" />
			</div>
			<div style="margin-top: 50px" class="group" data-type="button" data-action="deleteC" @click.stop="deleteC">
				<input type="button" class="btn" :value="IntlString('APP_CONTACT_DELETE')" @click.stop="deleteC" style="color: #e74c3c" />
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import PhoneTitle from "./../PhoneTitle";
import CustomInput from "./../CustomInput";
import Modal from "@/components/Modal/index.js";

export default {
	components: {
		PhoneTitle,
		CustomInput,
	},
	data() {
		return {
			id: -1,
			currentSelect: 0,
			ignoreControls: false,
			contact: {
				display: "",
				number: "",
				id: -1,
			},
		};
	},
	computed: {
		...mapGetters(["IntlString", "contacts", "useMouse"]),
	},
	methods: {
		...mapActions(["updateContact", "addContact"]),
		onUp() {
			if (this.ignoreControls === true) return;
			let select = document.querySelector(".group.select");
			if (select.previousElementSibling !== null) {
				document.querySelectorAll(".group").forEach(elem => {
					elem.classList.remove("select");
				});
				select.previousElementSibling.classList.add("select");
				let i = select.previousElementSibling.querySelector("input");
				if (i !== null) {
					i.focus();
				}
			}
		},
		onDown() {
			if (this.ignoreControls === true) return;
			let select = document.querySelector(".group.select");
			if (select.nextElementSibling !== null) {
				document.querySelectorAll(".group").forEach(elem => {
					elem.classList.remove("select");
				});
				select.nextElementSibling.classList.add("select");
				let i = select.nextElementSibling.querySelector("input");
				if (i !== null) {
					i.focus();
				}
			}
		},
		onEnter() {
			if (this.ignoreControls === true) return;
			let select = document.querySelector(".group.select");
			if (select.dataset.type === "text") {
				let options = {
					limit: parseInt(select.dataset.maxlength) || 64,
					text: this.contact[select.dataset.model] || "",
				};
				this.$phoneAPI.getReponseText(options).then(data => {
					this.contact[select.dataset.model] = data.text;
				});
			}
			if (select.dataset.action && this[select.dataset.action]) {
				this[select.dataset.action]();
			}
		},
		save() {
			if (!this.id || this.id === -1 || this.id === 0) {
				// Returns if number/display is undefined or blank
				if (
					!this.contact.number ||
					this.contact.number.trim() === "" ||
					!this.contact.display ||
					this.contact.display.trim() === ""
				)
					return;
				// Checks existing contacts for number
				for (const curContact of this.contacts) {
					if (curContact.number === this.contact.number) {
						return this.$phoneAPI.sendGenericError(`Cannot add contact. This number is already added as ${curContact.display}`);
					}
				}
				// Saves new contact
				this.addContact({
					display: this.contact.display,
					number: this.contact.number,
				});
				history.back();
			} else {
				if (
					!this.contact.number ||
					this.contact.number.trim() === "" ||
					!this.contact.display ||
					this.contact.display.trim() === ""
				)
					return;
				this.updateContact({
					id: this.id,
					display: this.contact.display,
					number: this.contact.number,
				});
				history.back();
			}
		},
		cancel() {
			if (this.ignoreControls === true) return;
			if (this.useMouse === true && document.activeElement.tagName !== "BODY") return;
			history.back();
		},
		forceCancel() {
			history.back();
		},
		deleteC() {
			if (this.id !== -1) {
				this.ignoreControls = true;
				Modal.CreateModal({
					choix: [
						{
							action: "cancel",
							title: this.IntlString("CANCEL"),
							icons: "fa-undo",
						},
						{
							action: "delete",
							title: this.IntlString("APP_PHONE_DELETE"),
							icons: "fa-trash",
							color: "red",
						},
					],
				}).then(el => {
					this.ignoreControls = false;
					if (el.action === "delete") {
						this.$phoneAPI.deleteContact(this.id);
						history.back();
					}
				});
			} else {
				history.back();
			}
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
		this.id = parseInt(this.$route.params.id);
		this.contact.display = this.IntlString("APP_CONTACT_NEW");
		this.contact.number = this.$route.params.number;
		if (this.id !== -1) {
			const c = this.contacts.find(e => e.id === this.id);
			if (c !== undefined) {
				this.contact = {
					id: c.id,
					display: c.display,
					number: c.number,
				};
			}
		}
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
.contact {
	position: relative;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
}
.title {
	padding-left: 16px;
	height: 34px;
	line-height: 34px;
	font-weight: 700;
	background-color: #5264ae;
	color: white;
}
.content {
	margin-top: 0px;
	padding-top: 45px;
}
.group {
	position: relative;
	margin-top: 15px;
}

.phone_content {
	background-color: rgb(243, 243, 243);
}
input {
	font-size: 20px;
	display: block;
	height: 52.5px;
	width: 100%;
	border: none;
	padding: 10px;
	padding-left: 25px;
	border-top: 1px solid #dddddd;
}

input:focus {
	outline: none;
}

.inputs {
	border-bottom: 1px solid #dddddd;
}

.input-c {
	width: 100%;
}

/* LABEL ======================================= */
label {
	color: #999;
	font-size: 18px;
	font-weight: normal;
	position: absolute;
	pointer-events: none;
	left: 5px;
	top: 10px;
	transition: 0.2s ease all;
	-moz-transition: 0.2s ease all;
	-webkit-transition: 0.2s ease all;
}

/* active state */
input:focus ~ label,
input:valid ~ label {
	top: -24px;
	font-size: 18px;
	color: gray;
}

/* BOTTOM BARS ================================= */
.bar {
	position: relative;
	display: block;
	width: 100%;
}
.bar:before,
.bar:after {
	content: "";
	height: 3px;
	width: 0;
	bottom: 1px;
	position: absolute;
	transition: 0.2s ease all;
	-moz-transition: 0.2s ease all;
	-webkit-transition: 0.2s ease all;
}
.bar:before {
	left: 50%;
}
.bar:after {
	right: 50%;
}

/* active state */
input:focus ~ .bar:before,
input:focus ~ .bar:after,
.group.select input ~ .bar:before,
.group.select input ~ .bar:after {
	width: 50%;
}

/* HIGHLIGHTER ================================== */
.highlight {
	position: absolute;
	height: 60%;
	width: 100px;
	top: 25%;
	left: 0;
	pointer-events: none;
	opacity: 0.5;
}

/* active state */
input:focus ~ .highlight {
	-webkit-animation: inputHighlighter 0.3s ease;
	-moz-animation: inputHighlighter 0.3s ease;
	animation: inputHighlighter 0.3s ease;
}

.group .btn {
	width: 100%;
	padding: 0px 0px;
	height: 50px;
	color: #fff;
	border: 0 none;
	font-size: 22px;
	font-weight: 300;
	line-height: 34px;
	color: #202129;
	font-family: "SF-Pro-Text-Regular";
	font-size: 20px;
	padding-left: 25px;
	text-align: start;
	background-color: #edeeee;
}

.btn:hover {
	opacity: 0.5;
	cursor: pointer;
}

.group.select .btn {
	/* border: 6px solid #C0C0C0; */
	line-height: 18px;
}

.group .btn.btn-green {
	border: 1px solid #dddddd;
	color: #2ecc70;
	background-color: white;
	font-weight: 500;
	border-radius: 10px;
}
.group.select .btn.btn-green,
.group:hover .btn.btn-green {
	background-image: linear-gradient(to right, #62a3ff, #4994ff, #0b81ff);
	color: white;
	border: none;
}
.group .btn.btn-orange {
	border: 1px solid #b6b6b6;
	color: black;
	background-color: white;
	font-weight: 500;
	border-radius: 10px;
}
.group.select .btn.btn-orange,
.group:hover .btn.btn-orange {
	background-color: #e67e22;
	color: white;
	border: #b6b6b6;
}

.group .btn {
	border: 1px solid #dddddd;
	color: #000;
	background-color: white;
	font-weight: 500;
	border-radius: 10px;
}
.group.select .btn.btn-red,
.group:hover .btn.btn-red {
	background-image: linear-gradient(to right, #ff5b5b, #ff4b4b, #fe3c3c);
	color: white;
	border: none;
}

/* ANIMATIONS ================ */
@-webkit-keyframes inputHighlighter {
	from {
		background: #5264ae;
	}
	to {
		width: 0;
		background: transparent;
	}
}
@-moz-keyframes inputHighlighter {
	from {
		background: #5264ae;
	}
	to {
		width: 0;
		background: transparent;
	}
}
@keyframes inputHighlighter {
	from {
		background: #5264ae;
	}
	to {
		width: 0;
		background: transparent;
	}
}
</style>
