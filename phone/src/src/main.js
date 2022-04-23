import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import VueTimeago from "./TimeAgo";
import PhoneAPI from "./PhoneAPI";
import Notification from "./Notification";

import AutoFocus from "./directives/autofocus";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
	faBell,
	faWifi,
	faPhoneAlt,
	faVolumeUp,
	faSearch,
	faMousePointer,
	faTrashRestore,
	faLanguage,
} from "@fortawesome/free-solid-svg-icons";

library.add(faBell, faWifi, faPhoneAlt, faSearch, faVolumeUp, faMousePointer, faTrashRestore, faLanguage);

Vue.use(VueTimeago);
Vue.use(Notification);
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.config.productionTip = false;

Vue.prototype.$bus = new Vue();
Vue.prototype.$phoneAPI = PhoneAPI;
window.VueTimeago = VueTimeago;
window.Vue = Vue;
window.store = store;

Vue.directive("autofocus", AutoFocus);

/* eslint-disable no-new */
window.APP = new Vue({
	el: "#app",
	store,
	router,
	render: h => h(App),
});
