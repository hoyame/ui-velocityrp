<template>
	<div
		class="home"
		v-bind:style="{
			background:
				'url(https://cdn.discordapp.com/attachments/622858678760112128/831112179171196949/Capture_decran_2021-04-12_a_12.22.52.png)',
		}"
	>
		<InfoBare />
		<span class="warningMess" v-if="messagesCount >= warningMessageCount">
			<div class="warningMess_icon"><i class="fa fa-warning"></i></div>
			<span class="warningMess_content">
				<span class="warningMess_title">{{ IntlString("PHONE_WARNING_MESSAGE") }}</span
				><br />
				<span class="warningMess_mess"
					>{{ messagesCount }} / {{ warningMessageCount }} {{ IntlString("PHONE_WARNING_MESSAGE_MESS") }}</span
				>
			</span>
		</span>

		<div class="home_applications">
			<div class="application">
				<img @click="openApp('appels')" src="../../static/img/icons/call.png" class="app-icon-image" />
				<span class="puce" v-if="AppsHome[0].puce !== undefined && AppsHome[0].puce !== 0">{{ AppsHome[0].puce }}</span>
				<p>Appels</p>
			</div>

			<div class="application">
				<img @click="openApp('calculator')" src="../../static/img/icons/calculator.png" class="app-icon-image" />
				<p>Calculette</p>
			</div>

			<div class="application">
				<img @click="openApp('messages')" src="../../static/img/icons/messages.png" class="app-icon-image" />
				<span class="puce" v-if="AppsHome[1].puce !== undefined && AppsHome[1].puce !== 0">{{ AppsHome[1].puce }}</span>
				<p>Messages</p>
			</div>

			<div class="application">
				<img @click="openApp('contacts')" src="../../static/img/icons/contacts.png" class="app-icon-image" />
				<p>Contacts</p>
			</div>

			<div class="application">
				<img @click="openApp('photo')" src="../../static/img/icons/camera.png" class="app-icon-image" />
				<p>Camera</p>
			</div>

			<div class="application">
				<img @click="openApp('twitter.splash')" src="../../static/img/icons/twitter.png" class="app-icon-image" />
				<p>Twitter</p>
			</div>

			<div class="application">
				<img @click="openApp('tchat')" src="../../static/img/icons/workspace.png" class="app-icon-image" />
				<p>DarkChat</p>
			</div>

			<div class="application">
				<img @click="openApp('parametre')" src="../../static/img/icons/settings.png" class="app-icon-image" />
				<p>Règlages</p>
			</div>

			<div class="application">
				<img @click="openApp('bank')" src="../../static/img/icons/wallet.png" class="app-icon-image" />
				<p>Banque</p>
			</div>

			<div class="application">
				<img @click="openCarte()" src="../../static/img/icons/maps.png" class="app-icon-image" />
				<p>Carte</p>
			</div>
		</div>

		<div class="home_buttons">
			<div>
				<img @click="openApp('appels')" src="../../static/img/icons/call.png" class="app-icon-image" />
				<span class="puce" v-if="AppsHome[0].puce !== undefined && AppsHome[0].puce !== 0">{{ AppsHome[0].puce }}</span>
			</div>

			<div>
				<img @click="openApp('messages')" src="../../static/img/icons/messages.png" class="app-icon-image" />
				<span class="puce" v-if="AppsHome[1].puce !== undefined && AppsHome[1].puce !== 0">{{ AppsHome[1].puce }}</span>
			</div>

			<div>
				<img @click="openApp('contacts')" src="../../static/img/icons/contacts.png" class="app-icon-image" />
			</div>

			<div>
				<img @click="openApp('twitter.splash')" src="../../static/img/icons/twitter.png" class="app-icon-image" />
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import InfoBare from "./InfoBare";

export default {
	components: {
		InfoBare,
	},
	data() {
		return {
			currentSelect: 0,
		};
	},
	computed: {
		...mapGetters(["IntlString", "useMouse", "nbMessagesUnread", "backgroundURL", "messagesCount", "AppsHome", "warningMessageCount"]),
	},
	methods: {
		...mapActions(["closePhone"]),
		openApp(app) {
			this.$router.push({ name: app });
		},
		onEnter() {
			this.openApp(this.AppsHome[this.currentSelect] || { routeName: "menu" });
		},
		onBack() {
			this.closePhone();
		},
		openCarte() {
			this.openCarte();
		},
	},
};
</script>

<style lang="scss" scoped>
.home {
	background-size: cover !important;
	background-position: center !important;
	position: relative;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-content: center;
	justify-content: center;
	color: gray;
}
.warningMess {
	background-color: white;
	position: absolute;
	left: 12px;
	right: 12px;
	top: 34px;
	min-height: 64px;
	display: flex;
	padding: 12px;
	border-radius: 4px;
	box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
.warningMess .warningMess_icon {
	display: flex;
	width: 16%;
	align-items: center;
	justify-content: center;
	font-size: 28px;
	height: 42px;
	width: 42px;
	border-radius: 50%;
}
.warningMess .warningMess_icon .fa {
	text-align: center;
	color: #f94b42;
}
.warningMess .warningMess_content {
	padding-left: 12px;
}
.warningMess_title {
	font-size: 20px;
}
.warningMess_mess {
	font-size: 16px;
}

.home_buttons {
	display: flex;
	padding: 15px 10px;
	height: 100px;
	width: 87%;
	bottom: 50px;
	border-radius: 25px;
	position: absolute;
	align-items: flex-end;
	flex-flow: row;
	flex-wrap: wrap;
	margin-bottom: 0px;
	background-color: rgba(255, 255, 255, 0.685);
	justify-content: space-between;
	transition: all 0.5s ease-in-out;
}

.home_applications {
	display: inline-block;
	position: absolute;
	top: 85px;
	height: 350px;
	width: 95%;
	padding: 15px 15px;
}

.app_btn {
	outline: none;
	position: relative;
	margin: 10px;
	border: none;
	width: 65px;
	height: 15px;
	border-radius: 10px;
	color: white;
	background-size: 30px 30px;
	background-image: linear-gradient(to bottom, #e67e22, #e74c3c, #c0392b);
	background-size: cover;
	background-repeat: no-repeat;
	font-size: 14px;
	padding-top: 60px;
	font-weight: 700;
	text-align: center;
}

.app_btn_img {
	padding-top: 60px;
	background-position: 9px 16px;
	position: relative;
	background-repeat: no-repeat;
	background-size: 30px 30px;
	margin-top: -60px;
	transition: 0.1s;
}

.app-icon-image {
	height: 70px;
	width: 70px;
	margin: 0 8px;
	-webkit-transition-duration: 200ms;
	transition-duration: 200ms;
	border-radius: 15px;

	&:hover {
		cursor: pointer;

		z-index: 10;
		opacity: 0.5;
	}
}

.application {
	display: inline-block;
	text-align: center;
	width: 85px;
	height: 115px;
	margin: 0 3px;
	margin-bottom: 15px;
}

p {
	margin: 2px;
	font-family: "SF-Pro-Display-Regular";
	font-weight: 500;
	color: #fff;
	font-size: 16px;
}

.puce {
	position: absolute;
	display: block;
	background-color: #e0137a;
	font-size: 15px;
	color: #fff;
	width: 25px;
	height: 25px;
	line-height: 25px;
	text-align: center;
	border-radius: 50%;
	margin-left: 60px;
	margin-top: -85px;
}
</style>
