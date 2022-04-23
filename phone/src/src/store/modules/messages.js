import PhoneAPI from "./../../PhoneAPI";

const state = {
	conversations: [],
};

const getters = {
	conversations: ({ conversations }) => conversations,
	nbMessagesUnread: ({ conversations }) => {
		return conversations.reduce((acc, conversation) => {
			return acc + conversation.messages.filter(message => message.isRead != 1).length;
		}, 0);
	},
	messagesCount: ({ conversations }) => {
		return conversations.reduce((acc, conversation) => {
			return acc + conversation.messages.length;
		}, 0);
	},
};

const actions = {
	setConversations({ commit }, messages) {
		commit("SET_CONVERSATIONS", messages);
	},
	deleteMessage({ commit }, { id, conversationId }) {
		PhoneAPI.deleteMessage(id);
		commit("DELETE_MESSAGE", { id, conversationId });
	},
	deleteConversation({ commit, state }, { id }) {
		PhoneAPI.deleteConversation(id);
		const index = state.conversations.findIndex(conversation => conversation.id == id);
		if (index != -1) state.conversations[index].messages = [];
		commit("SET_CONVERSATIONS", state.conversations);
	},
	deleteAllMessages({ commit }) {
		PhoneAPI.deleteAllMessages();
		commit("SET_CONVERSATIONS", []);
	},
	setMessageRead({ commit }, conversationId) {
		PhoneAPI.setMessageRead(conversationId);
		commit("SET_MESSAGES_READ", { conversationId });
	},
	resetMessage({ commit }) {
		commit("SET_MESSAGES", []);
	},
	createConversation({ commit }, { tempId, members }) {
		commit("ADD_CONVERSATION", {
			id: tempId,
			members,
			messages: [],
		});
	},
	tempConvCreated({ commit }, { tempId, id }) {
		commit("TEMP_CONV_CREATED", { tempId, id });
	},
};

const mutations = {
	ADD_CONVERSATION(state, conversation) {
		state.conversations.push(conversation);
	},
	TEMP_CONV_CREATED(state, { tempId, id }) {
		const index = state.conversations.findIndex(conversation => conversation.id == tempId);
		state.conversations[index].id = id;
	},
	SET_CONVERSATIONS(state, conversations) {
		state.conversations = conversations;
	},
	ADD_MESSAGE(state, payload) {
		const index = state.conversations.findIndex(c => c.id == payload.id);
		if (index != -1) {
			state.conversations[index].messages.push(payload.message);
		} else {
			state.conversations.push({
				id: payload.id,
				members: payload.members,
				messages: [payload.message],
			});
		}
	},
	DELETE_MESSAGE(state, { id, conversationId }) {
		const index = state.conversations.findIndex(c => c.id == conversationId);
		if (index != -1) {
			state.conversations[index].messages = state.conversations[index].messages.filter(message => message.id != id);
		}
	},
	SET_MESSAGES_READ(state, { conversationId }) {
		const index = state.conversations.findIndex(c => c.id == conversationId);
		if (index != -1) {
			state.conversations[index].messages = state.conversations[index].messages.map(m => ({ ...m, isRead: 1 }));
		}
	},
};

export default {
	state,
	getters,
	actions,
	mutations,
};

if (process.env.NODE_ENV !== "production") {
	const time = new Date().getTime() / 1000;
	const myPhone = "555-1234";
	state.conversations = [
		{
			id: 1,
			members: ["0000", myPhone],
			messages: [
				{ id: 1, sender: "0000", time: time - 120, message: "Salut", isRead: 1 },
				{ id: 2, sender: "0000", time: time - 120, message: "ça va ?", isRead: 1 },
				{ id: 3, sender: myPhone, time, message: "Oui", isRead: 1 },
			],
		},
		{
			id: 2,
			members: ["555-2222", "555-3333", myPhone],
			messages: [
				{ id: 4, sender: "555-2222", time: time, message: "YOYOYO", isRead: 1 },
				{ id: 5, sender: "555-3333", time: time, message: "YOYO", isRead: 1 },
				{ id: 6, sender: "555-3333", time, message: "Yo", isRead: 1 },
				{ id: 7, sender: myPhone, time, message: "yoyoyo", isRead: 0 },
				{ id: 8, sender: "555-2222", time, message: "yo", isRead: 0 },
			],
		},
		{
			id: 3,
			members: ["911", myPhone],
			messages: [{ id: 9, sender: myPhone, time, message: "ALED", isRead: 1 }],
		},
	];
}
