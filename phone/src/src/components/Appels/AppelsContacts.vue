<template>
	<div>
		<list :list="contactsList" :showHeader="false" v-on:select="onSelect"></list>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { generateColorForStr } from "@/Utils";
import List from "./../ListContacts.vue";

export default {
	name: "Contacts",
	components: { List },
	data() {
		return {};
	},
	methods: {
		...mapActions(["startCall"]),
		onSelect(itemSelect) {
			if (itemSelect !== undefined) {
				if (itemSelect.custom === true) {
					this.$router.push({ name: "appels.number" });
				} else {
					this.startCall({ numero: itemSelect.number });
				}
			}
		},
		tri(a, b) {
			if (a.display < b.display) return -1;
			else if (a.display === b.display) return 0;
			else return 1;
		},
	},
	computed: {
		...mapGetters(["IntlString", "contacts"]),
		contactsList() {
			const cont = this.contacts.sort(this.tri);

			return [
				{
					display: this.IntlString("APP_PHONE_ENTER_NUMBER"),
					letter: "#",
					backgroundColor: "#D32F2F",
					custom: true,
				},
				...cont.map(c => {
					return c;
				}),
			];
		},
	},
	created() {},
	beforeDestroy() {},
};
</script>

<style scoped></style>
