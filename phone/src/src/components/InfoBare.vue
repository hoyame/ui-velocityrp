<template>
	<div class="phone_infoBare barre-header">
		<div class="informations" :style="{ fill: Dark ? '#000' : '#fff', color: Dark ? '#000' : '#fff' }">
			<span class="time">
				<current-time></current-time>
			</span>

			<div class="stbar">
				<div data-v-1ea35661="">
					<svg data-v-1ea35661="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 125.923 81.83" height="9" class="icon">
						<g data-v-1ea35661="" data-name="Groupe 6">
							<path
								data-v-1ea35661=""
								data-name="Tracé 34"
								d="M107.564 81.793h11.67c4.443 0 6.689-2.492 6.689-7.477V7.477c0-4.985-2.246-7.477-6.689-7.477h-11.67c-4.443 0-6.689 2.492-6.689 7.477v66.839c0 4.984 2.246 7.477 6.689 7.477zm-33.691 0h11.718c4.443 0 6.689-2.492 6.689-7.477V25.432c0-4.985-2.246-7.423-6.689-7.423H73.875c-4.395 0-6.689 2.438-6.689 7.423v48.884c-.003 4.984 2.289 7.477 6.689 7.477zm-33.643 0H51.9c4.443 0 6.738-2.492 6.738-7.477V44.08c0-5.039-2.295-7.477-6.738-7.477H40.23c-4.443 0-6.689 2.438-6.689 7.477v30.236c0 4.984 2.246 7.477 6.689 7.477z"
							></path>
							<path
								data-v-1ea35661=""
								data-name="Tracé 37"
								d="M6.689 81.83h11.67c4.443 0 6.738-2.246 6.738-6.738v-17c0-4.541-2.295-6.74-6.738-6.74H6.689c-4.443 0-6.689 2.2-6.689 6.74v17c0 4.492 2.246 6.738 6.689 6.738z"
							></path>
						</g>
					</svg>
					<svg data-v-1ea35661="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 85.196 61.621" height="9" class="icon">
						<path
							data-v-1ea35661=""
							d="M5.757 26.221a1.723 1.723 0 002.588-.049 45.992 45.992 0 0134.229-14.648 46.2 46.2 0 0134.375 14.7 1.726 1.726 0 002.49-.049l5.225-5.273a1.557 1.557 0 00.146-2.2C76.119 8.009 59.859.002 42.574.002c-17.236 0-33.5 8.008-42.187 18.7a1.557 1.557 0 00.146 2.2zM21.04 41.553a1.682 1.682 0 002.637-.146 25.907 25.907 0 0118.9-8.4 26.475 26.475 0 0119.092 8.545 1.615 1.615 0 002.49 0l5.859-5.81a1.511 1.511 0 00.146-2.2c-5.615-6.836-15.918-12.061-27.588-12.061-11.621 0-21.924 5.225-27.539 12.061a1.513 1.513 0 00.146 2.2zm21.534 20.068c.879 0 1.66-.439 3.076-1.855l9.033-8.691a1.588 1.588 0 00.244-2.148 16.123 16.123 0 00-12.354-5.957 15.81 15.81 0 00-12.5 6.25 1.446 1.446 0 00.44 1.856l8.984 8.69c1.465 1.416 2.247 1.855 3.077 1.855z"
						></path>
					</svg>
					<svg data-v-1ea35661="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 119.629 59.863" height="14" class="ico">
						<path
							data-v-1ea35661=""
							d="M20.019 59.863h67.92c6.738 0 11.914-.684 15.625-4.395 3.76-3.76 4.395-8.887 4.395-15.625V20.019c0-6.738-.635-11.914-4.395-15.625C99.853.683 94.677-.001 87.939-.001H19.873c-6.543 0-11.768.684-15.479 4.395S0 13.281 0 19.824v20.02c0 6.738.635 11.914 4.346 15.625 3.759 3.71 8.935 4.394 15.673 4.394zm-1.025-5.42c-4.248 0-8.3-.635-10.645-2.978s-2.93-6.348-2.93-10.6V19.14c0-4.394.586-8.447 2.881-10.791 2.344-2.344 6.494-2.93 10.84-2.93h69.824c4.2 0 8.3.635 10.645 2.93 2.344 2.344 2.93 6.4 2.93 10.645v21.877c0 4.248-.635 8.252-2.93 10.6-2.344 2.344-6.445 2.978-10.645 2.978zm-.537-4.834h71.045c3.271 0 5.029-.44 6.445-1.758 1.367-1.367 1.758-3.174 1.758-6.445v-23c0-3.223-.44-5.029-1.758-6.4-1.367-1.367-3.174-1.758-6.445-1.758H18.457c-3.271 0-5.078.391-6.445 1.758s-1.758 3.174-1.758 6.4v23c0 3.271.391 5.078 1.758 6.445 1.367 1.32 3.173 1.758 6.445 1.758zm94.336-10.5c2.929-.146 6.836-3.906 6.836-9.57s-3.907-9.424-6.836-9.57z"
						></path>
					</svg>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import Wifi from "../../static/img/icons/wifi.svg";
import Signal from "../../static/img/icons/signal.svg";
import Battery from "../../static/img/icons/battery.svg";
import CurrentTime from "./CurrentTime";

export default {
	props: ["Dark", "Zfff"],
	computed: mapGetters(["config"]),
	components: {
		Wifi,
		Signal,
		Battery,
		CurrentTime,
	},
};
</script>
<style scoped>
.informations {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	color: red;
	fill: red;
}

.barre-header {
	height: 55px;
	font-size: 18px;
	line-height: 24px;
	font-weight: 600;
	padding: 18px 20px 0px 24px;
	width: 100%;
	position: relative;
}
.barre-header hr {
	position: absolute;
	display: inline-block;
}
.time {
	text-align: left;
	float: left;
	padding-left: 12px;
}

.batterie1 {
	height: 10px;
	width: 7px;
	right: 78px;
	background-color: rgb(255, 255, 255);
	color: rgb(255, 255, 255);
	border-radius: 0.5px;
	border: none;
}

.batterie2 {
	height: 13px;
	width: 5px;
	right: 79px;
	bottom: 0px;
	background-color: rgba(255, 255, 255, 0.6);
	border: 0.5px solid white;
	border-radius: 1px;
}

.stbar {
	float: left;
}

.icon {
	margin-top: 3px;
	height: 20px;
	width: 20px;
}

.ico {
	margin-bottom: 3px;
}
</style>
