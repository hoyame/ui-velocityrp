<template>
	<div class="contact">
		<list
			:list="lcontacts"
			:disable="disableList"
			:title="IntlString('APP_CONTACT_TITLE')"
			@back="back"
			@select="onSelect"
			@option="onOption"
		></list>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import List from "./../ListContacts.vue";
import Modal from "@/components/Modal/index.js";

export default {
	components: {
		List,
	},
	data() {
		return {
			disableList: false,
		};
	},
	computed: {
		...mapGetters(["IntlString", "contacts", "useMouse"]),
		lcontacts() {
			const cont = this.contacts;
			let letters = [
				{ id: -1, display: "A" },
				{ id: -1, display: "B" },
				{ id: -1, display: "C" },
				{ id: -1, display: "D" },
				{ id: -1, display: "E" },
				{ id: -1, display: "F" },
				{ id: -1, display: "G" },
				{ id: -1, display: "H" },
				{ id: -1, display: "I" },
				{ id: -1, display: "J" },
				{ id: -1, display: "K" },
				{ id: -1, display: "L" },
				{ id: -1, display: "M" },
				{ id: -1, display: "N" },
				{ id: -1, display: "P" },
				{ id: -1, display: "Q" },
				{ id: -1, display: "R" },
				{ id: -1, display: "S" },
				{ id: -1, display: "T" },
				{ id: -1, display: "U" },
				{ id: -1, display: "V" },
				{ id: -1, display: "W" },
				{ id: -1, display: "X" },
				{ id: -1, display: "Y" },
				{ id: -1, display: "Z" },
			];
			const array3 = cont.concat(
				letters.filter(l => this.contacts.find(c => c.display.length > 0 && c.display.toUpperCase().substr(0, 1) === l.display))
			);
			let addContact = { display: this.IntlString("APP_CONTACT_NEW"), letter: "+", num: -1 };

			return [
				addContact,
				...array3.sort(this.tri).map(e => {
					return e;
				}),
			];
		},
	},
	methods: {
		...mapActions(["startCall"]),

		tri(a, b) {
			if (a.display < b.display) return -1;
			else if (a.display === b.display) return 0;
			else return 1;
		},
		onSelect(contact) {
			if (contact.num === -1 && !contact.id) {
				this.$router.push({ name: "contacts.view", params: { id: contact.id } });
			} else if (contact.id !== -1) {
				this.disableList = true;
				const numero = contact.number;
				Modal.CreateModal({
					choix: [
						{ id: 0, title: this.IntlString("APP_PHONE_CALL"), icons: "fa-phone" },
						{ id: 1, title: this.IntlString("APP_MESSAGE_PLACEHOLDER_ENTER_MESSAGE"), icons: "fa-phone" },
						{ id: 2, title: this.IntlString("APP_CONTACT_EDIT"), icons: "fa-edit", color: "orange" },
						{ id: 3, title: this.IntlString("CANCEL"), icons: "fa-undo" },
					],
				}).then(rep => {
					switch (rep.id) {
						case 0:
							this.startCall({ numero: contact.number });
							break;
						case 1:
							this.$router.push({ name: "messages.view", params: { number: contact.number, display: contact.display } });
							break;
						case 2:
							this.$router.push({ path: "contact/" + contact.id });
							break;
						case 4:
							this.save(numero);
					}
					this.disableList = false;
				});
			}
		},
		back() {
			if (this.disableList === true) return;
			this.$router.push({ name: "home" });
		},
	},
	created() {
		if (!this.useMouse) {
			this.$bus.$on("keyUpBackspace", this.back);
		}
	},

	beforeDestroy() {
		this.$bus.$off("keyUpBackspace", this.back);
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
</style>
