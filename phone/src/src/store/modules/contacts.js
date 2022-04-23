import PhoneAPI from "./../../PhoneAPI";

const state = {
	contacts: [],
	defaultContacts: [],
};

const getters = {
	contacts: ({ contacts, defaultContacts }) => [...contacts, ...defaultContacts],
	contactsNameByPhone: ({ contacts }) => {
		return contacts.reduce((acc, contact) => {
			acc[contact.number] = contact.display;
			return acc;
		}, {});
	},
};

const actions = {
	updateContact(context, { id, display, number }) {
		PhoneAPI.updateContact(id, display, number);
	},
	addContact(context, { display, number }) {
		PhoneAPI.addContact(display, number);
	},
	deleteContact(context, { id }) {
		PhoneAPI.deleteContact(id);
	},
	resetContact({ commit }) {
		commit("SET_CONTACTS", []);
	},
};

const mutations = {
	SET_CONTACTS(state, contacts) {
		state.contacts = contacts.sort((a, b) => a.display.localeCompare(b.display));
	},
	SET_DEFAULT_CONTACTS(state, contacts) {
		state.defaultContacts = contacts;
	},
};

export default {
	state,
	getters,
	actions,
	mutations,
};

if (process.env.NODE_ENV !== "production") {
	// eslint-disable-next-line
	state.contacts = [
		{
			id: 2,
			number: "555-2222",
			display: "John doe",
		},
		{
			id: 4,
			number: "336-4553",
			display: "Nop user",
		},
		{
			id: 3,
			number: "0000",
			display: "Awi",
		},
	];
}
