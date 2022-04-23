<template>
	<div class="phone_app">
		<div class="elements">
			<div
				class="element"
				:class="{ active: selectIndex === key }"
				v-for="(histo, key) in historique"
				:key="key"
				@click.stop="selectItem(histo)"
			>
				<div @click.stop="selectItem(histo)" class="elem-content">
					<font-awesome-icon class="icon" icon="phone-alt" />

					<div class="elem-content-container">
						<div>
							<div @click.stop="selectItem(histo)" class="elem-content-p">{{ histo.display }}</div>
							<div @click.stop="selectItem(histo)" class="elem-content-p-desc">portable</div>
						</div>

						<div @click.stop="selectItem(histo)" class="elem-content-s">
							<div v-if="histo.lastCall.length !== 0" class="lastCall">
								<timeago :since="histo.lastCall[0].date" :auto-update="20"></timeago>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { groupBy, generateColorForStr } from "@/Utils";
import Modal from "@/components/Modal/index.js";

export default {
	name: "Recents",
	components: {},
	data() {
		return {
			ignoreControls: false,
			selectIndex: 0,
		};
	},
	methods: {
		...mapActions(["startCall", "appelsDeleteHistorique", "appelsDeleteAllHistorique"]),
		getContact(num) {
			const find = this.contacts.find(e => e.number === num);
			return find;
		},
		scrollIntoViewIfNeeded: function () {
			this.$nextTick(() => {
				this.$el.querySelector(".active").scrollIntoViewIfNeeded();
			});
		},
		onUp() {
			if (this.ignoreControls === true) return;
			this.selectIndex = Math.max(0, this.selectIndex - 1);
			this.scrollIntoViewIfNeeded();
		},
		onDown() {
			if (this.ignoreControls === true) return;
			this.selectIndex = Math.min(this.historique.length - 1, this.selectIndex + 1);
			this.scrollIntoViewIfNeeded();
		},
		async selectItem(item) {
			const numero = item.num;
			const isValid = numero.startsWith("#") === false;
			this.ignoreControls = true;
			let choix = [
				{ id: 1, title: this.IntlString("APP_PHONE_DELETE"), icons: "fa-trash", color: "orange" },
				{ id: 2, title: this.IntlString("APP_PHONE_DELETE_ALL"), icons: "fa-trash", color: "red" },
				{ id: 3, title: this.IntlString("APP_PHONE_CANCEL"), icons: "fa-undo" },
				{ id: 4, title: this.IntlString("APP_PHONE_ADD"), icons: "fa-undo" },
			];
			if (isValid === true) {
				choix = [{ id: 0, title: this.IntlString("APP_PHONE_CALL"), icons: "fa-phone" }, ...choix];
			}
			const rep = await Modal.CreateModal({ choix });
			this.ignoreControls = false;
			switch (rep.id) {
				case 0:
					this.startCall({ numero });
					break;
				case 1:
					this.appelsDeleteHistorique({ numero });
					break;
				case 2:
					this.appelsDeleteAllHistorique();
					break;
				case 4:
					this.save(numero);
			}
		},
		async onEnter() {
			if (this.ignoreControls === true) return;
			this.selectItem(this.historique[this.selectIndex]);
		},
		save(numero) {
			if (this.id !== -1) {
				this.$router.push({
					name: "contacts.view",
					params: {
						id: 0,
						number: numero,
					},
				});
			} else {
				console.log("No añadido");
			}
		},
		stylePuce(data) {
			data = data || {};
			if (data.icon !== undefined) {
				return {
					backgroundImage: `url(${data.icon})`,
					backgroundSize: "cover",
					color: "rgba(0,0,0,0)",
				};
			}
			return {
				color: data.color || this.color,
				backgroundColor: data.backgroundColor || this.backgroundColor,
				borderRadius: "50%",
			};
		},
	},
	computed: {
		...mapGetters(["IntlString", "useMouse", "appelsHistorique", "contacts"]),
		historique() {
			let grpHist = groupBy(this.appelsHistorique, "num");
			let hist = [];
			for (let key in grpHist) {
				const hg = grpHist[key];
				const histoByDate = hg
					.map(e => {
						e.date = new Date(e.time);
						return e;
					})
					.sort((a, b) => {
						return b.date - a.date;
					})
					.slice(0, 6);
				const contact = this.getContact(key) || { letter: "#" };
				hist.push({
					num: key,
					display: contact.display || key,
					lastCall: histoByDate,
					letter: contact.letter || contact.display[0],
					backgroundColor: contact.backgroundColor || generateColorForStr(key),
					icon: contact.icon,
				});
			}
			hist.sort((a, b) => {
				return b.lastCall[0].time - a.lastCall[0].time;
			});
			return hist;
		},
	},
	created() {
		if (!this.useMouse) {
			this.$bus.$on("keyUpArrowDown", this.onDown);
			this.$bus.$on("keyUpArrowUp", this.onUp);
			this.$bus.$on("keyUpEnter", this.onEnter);
		} else {
			this.selectIndex = -1;
		}
	},
	beforeDestroy() {
		this.$bus.$off("keyUpArrowDown", this.onDown);
		this.$bus.$off("keyUpArrowUp", this.onUp);
		this.$bus.$off("keyUpEnter", this.onEnter);
	},
};
</script>

<style scoped>
.content {
	height: 100%;
}
.elements {
	overflow-y: auto;
}
.fa-phone {
	color: #485460;
}
.element {
	height: 55px;
	line-height: 58px;
	display: flex;
	align-items: center;
	background: #fff;
	padding: 0 10px;
	position: relative;
	border-radius: 2px;
	border-bottom: 0.5px solid #dddddd;
}

.element:hover {
	cursor: pointer;
	background-color: #f1f1f1;
}

.elem-pic {
	margin-left: 12px;
	height: 40px;
	width: 40px;
	text-align: center;
	line-height: 48px;
	font-weight: 700;
	border-radius: 50%;
	color: white;
}

.elem-content {
	display: flex;
	flex-direction: row;
	margin-left: 12px;
	width: 100%;
}

.elem-content-container {
	display: flex;
	flex-direction: row;
	width: 100%;
	justify-content: space-between;
	padding: 0 15px;
}

.elem-content-p {
	font-size: 18px;
	font-family: "SF-Pro-Text-Semibold";
	line-height: 20px;
	margin-bottom: 3px;
}

.elem-content-p-desc {
	font-size: 15px;
	font-family: "SF-Pro-Text-Regular";
	font-weight: 300;
	line-height: 14px;
}

.elem-content-s {
	font-size: 12px;
	line-height: 18px;
	color: rgb(192, 192, 192);
	display: flex;
}
.elem-histo-pico {
	display: flex;
	flex-direction: column;
}
.elem-histo-pico svg {
	width: 16px;
	height: 16px;
}
.lastCall {
	padding-left: 4px;
}
.elem-icon {
	width: 28px;
}

.icon {
	width: 16px;
	height: 16px;
	margin-top: 2px;
	color: rgb(192, 192, 192);
}
</style>
