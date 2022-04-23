<template>
	<input v-on="$listeners" :value="value" @input="$emit('update', $event.target.value)" @blur="onBlur()" @focus="onFocus()" />
</template>

<script>
export default {
	props: ["value"],
	model: {
		prop: "value",
		event: "update",
	},
	methods: {
		onBlur() {
			this.$phoneAPI.setTyping(false);
		},
		onFocus() {
			this.$phoneAPI.setTyping(true);
		},
	},
	beforeDestroy() {
		this.$phoneAPI.setTyping(false);
	},
};
</script>
