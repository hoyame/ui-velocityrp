<template>
	<div class="contact">
		<list
			:list="lcontacts"
			:title="IntlString('APP_MESSAGE_CONTACT_TITLE')"
			v-on:select="onSelect"
			@back="back"
			@createGroup="createGroup"
			:isGroupSelection="$route.name.endsWith('Group')"
		></list>
	</div>
</template>

<script>
import List from "./../ListContacts.vue";
import { mapGetters, mapActions } from "vuex";
import Modal from "@/components/Modal/index.js";

export default {
	components: {
		List,
	},
	data() {
		return {
			groupCreating: false,
		};
	},
	computed: {
		...mapGetters(["IntlString", "contacts", "myPhoneNumber"]),
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

			const addContact = {
				display: this.IntlString("APP_MESSAGE_CONTRACT_ENTER_NUMBER"),
				letter: "+",
				backgroundColor: "orange",
				num: -1,
			};
			return this.$route.name.endsWith("Group") ? array3.sort(this.tri) : [addContact, ...array3.sort(this.tri)];
		},
	},
	methods: {
		...mapActions(["createConversation"]),
		tri(a, b) {
			if (a.display < b.display) return -1;
			else if (a.display === b.display) return 0;
			else return 1;
		},
		onSelect(contact) {
			if (contact.num === -1) {
				Modal.CreateTextModal({
					title: this.IntlString("APP_PHONE_ENTER_NUMBER"),
					limit: 10,
				}).then(data => {
					const phone = data.text.trim();
					if (phone !== "") {
						this.createGroup([phone]);
					}
				});
			} else if (contact.id !== -1) {
				this.createGroup([contact.number]);
			}
		},
		back() {
			history.back();
		},
		createGroup(numbers) {
			const tempId = -Date.now();
			this.createConversation({ tempId, members: [...numbers, this.myPhoneNumber] });
			this.$router.push({ name: "messages.view", params: { id: tempId } });
		},
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
