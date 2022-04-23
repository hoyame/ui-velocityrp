<template>
	<div>
		<list :list="callList" :showHeader="false" :disable="ignoreControls" v-on:select="onSelect"></list>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import List from "./../ListContacts.vue";
import Modal from "@/components/Modal/index.js";

export default {
	name: "Favoris",
	components: { List },
	data() {
		return {
			ignoreControls: false,
		};
	},
	computed: {
		...mapGetters(["IntlString", "config", "myPhoneNumber"]),
		callList() {
			return this.config.serviceCall || [];
		},
	},
	methods: {
		...mapActions(["createConversation"]),
		onSelect: async function (itemSelect) {
			if (this.ignoreControls) return;
			this.ignoreControls = true;

			const rep = await Modal.CreateModal({
				choix: [
					...itemSelect.subMenu,
					{
						action: "cancel",
						title: this.IntlString("CANCEL"),
						icons: "fa-undo",
					},
				],
			});

			this.ignoreControls = false;
			switch (rep.action) {
				case "call":
					return this.$phoneAPI.callEvent(rep.eventName, rep.type);
				case "sendMessage":
					const tempId = -Date.now();
					this.createConversation({ tempId, members: [rep.type.number, this.myPhoneNumber] });
					this.$router.push({ name: "messages.view", params: { id: tempId } });
			}
		},
	},

	created() {},

	beforeDestroy() {},
};
</script>

<style scoped></style>
