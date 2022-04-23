var CONFIG = {
	serverName: "Adversity Life",
	serverLink: "https://boutique.adversitylife.net",
	volume: 0.3,
	videoVolume: 0.1,

	backgroundCard: [
		{ bg: "img/background_card/b-1.jpg", character: "img/background_card/char1.png", loadcolor: "rgb(230,230,176)" },
		{ bg: "img/background_card/b-2.jpg", character: "img/background_card/char2.png", loadcolor: "rgb(226,71,77)" },
		{ bg: "img/background_card/b-3.jpg", character: "img/background_card/char3.png", loadcolor: "rgb(177,132,199)" },
	],

	audioList: [
		// { name: "RADIO MIAMI", link: "https://vofile.ru/ukraine/radio-maiami-ua/icecast.audio" },
		// { name: "Lil jon - Alive", link: "music/lil_jon_alive.mp3" },
		{ name: "Musique : Kaaris", link: "music/1.mp3" },
	],

	contacts: [
		{ avatar: "img/avatars/1.jpg", discord: "RmD#3120", title: "Fondateur", desc: "Je fait pas les deban !" },
		{ avatar: "img/avatars/4.jpg", discord: "Gérant-Staff", title: "Baka#1111, Napol#0001", desc: "" },
		{
			avatar: "img/avatars/2.jpg",
			discord: "Staff",
			title: "Kami#4594, Roméo#0507, Vincent Cn#5701",
			desc: "",
		},
		{
			avatar: "img/avatars/3.jpg",
			discord: "Modo",
			title: "Ogami_#0621, Καδαακα#1322, ByLegZ#8042, -FuRy#2903, Julo#5594, νв Katsuki#3910, letioze#8707, Tor#2332, Douwass#3468, Andrew Wilson#6327",
			desc: "",
		},
	],

	news: [
		{ img: "img/news/2.gif", title: "Mise à jour #1", desc: "ajoutajoutajoutajoutajoutajoutajoutajoutajou" },
		// { img: "", title: "Title 2", desc: "detailed description of the news. detailed description of the news." },
		// { img: "", title: "Title 3", desc: "detailed description of the news." },
		// { img: "img/news/1.jpg", title: "Title 4", desc: "description description description." },
		// { img: "", title: "Title 5", desc: "detailed description of the." },
		// {
		// 	img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQLcbj38Y06op2LjJ7bbYVZpduonaPSUjmOg&usqp=CAU",
		// 	title: "Title 4",
		// 	desc: "description description description.",
		// },
	],

	rules: [
		{
			title: "1. Lexique RP 1",
			text: [
				{ t: "1.1 Le metagaming" },
				{ t: "1.2 Le powergaming" },
				{ t: "1.3 Le freeloot" },
				{ t: "1.4 Le freekill" },
				{ t: "1.5 Le masse RP" },
				{ t: "1.6 Le no fear" },
				{ t: "1.7 Le usebug" },
				{ t: "1.8 Le powerstock" },
				{ t: "1.9 Le carkill" },


			],
		},
		{
			title: "2. Lexique RP 2",
			text: [
				{ t: "2.1 Le bunny hop" },
				{ t: "2.2 Le pain RP" },
				{ t: "2.3 Le revenge kill" },
				{ t: "2.4 Le force RP" },
				{ t: "2.5 Le fear police" },
			],
		},
		{
			title: "3. Coma",
			text: [
				{ t: "3.1 Coma" },
				{ t: "3.2 Coma" },
				{ t: "3.3 Coma" },
				{ t: "3.4 Coma" },
				{ t: "3.5 Coma" },
			],
		},
	],
};

var BG = {
	onLoadPage: function () {
		document.querySelectorAll(".servername").forEach(elem => {
			elem.innerText = CONFIG.serverName;
		});
		serverLink.innerText = CONFIG.serverLink;
		musicVolumeSlider.value = CONFIG.volume;

		// videoOne.volume = CONFIG.videoVolume;
		// videoTwo.volume = CONFIG.videoVolume;

		BG.onLoadContent();
		BG.effectCard();

		window.addEventListener("message", e => {
			(LOAD.handlers[e.data.eventName] || function () {})(e.data);
		});

		window.addEventListener("mousemove", function (e) {
			cursor.style.left = e.clientX + "px";
			cursor.style.top = e.clientY + "px";
		});
	},

	onLoadContent: function () {
		let idx = BG.getRandomInRange(0, CONFIG.backgroundCard.length - 1);
		cardCharacter.src = CONFIG.backgroundCard[idx].character;
		progressBar.style.backgroundColor = CONFIG.backgroundCard[idx].loadcolor;

		document.querySelectorAll(".background-img").forEach(elem => {
			elem.src = CONFIG.backgroundCard[idx].bg;
		});
		idx = BG.getRandomInRange(0, CONFIG.audioList.length - 1);
		audioblock.src = CONFIG.audioList[idx].link;
		musicDesc.innerText = CONFIG.audioList[idx].name;

		CONFIG.news.forEach(element => {
			let img = element.img == "" ? `` : `<img class="news-img" src="${element.img}"/>`;
			newsContainer.innerHTML += `<div class="warp-news-item">							
							<div class="news-item">
								${img}
								<div class="news-info">
									<div class="news-title">${element.title}</div>
									<div class="news-desc">${element.desc}</div>
								</div>
							</div>
						</div>`;
		});

		CONFIG.rules.forEach(element => {
			rulesContainer.innerHTML +=
				`<div class="item-rules"><div class="rules-tittle">${element.title}</div>` + BG.resultText(element.text);
			+`</div>`;
		});

		CONFIG.contacts.forEach(element => {
			contactContainer.innerHTML += `<div class="content-item">
							<img class="contact-avatar" src="${element.avatar}"/>
							<div style="width: 20px;"></div>
							<div class="content-info">
								<div class="contact-discord">${element.discord}</div>
								<div class="contact-title">${element.title}</div>
								<div class="contact-desc">${element.desc}</div>
							</div>
						</div>`;
		});

		V.onChangeVolume(CONFIG.volume);
		if (localStorage.getItem("loadscreen-muted") == "1") {
			V.onMuted();
		}
	},

	onClickPageMenu: function (data, page) {
		document.querySelectorAll(".menu-item").forEach(elem => {
			elem.classList.remove("menu-item-active");
		});
		data.classList.add("menu-item-active");
		document.querySelectorAll(".content-page").forEach(elem => {
			elem.style.display = "none";
		});
		let p = document.getElementById(`page_${page}`);
		p.style.display = "flex";

		if (VIDEO.isPlayOne == true || VIDEO.isPlayTwo == true) {
			videoOne.pause();
			videoTwo.pause();
			VIDEO.isPlayOne = false;
			VIDEO.isPlayTwo = false;
			V.onUnmuted();
		}
	},

	effectCard: function () {
		banner.addEventListener("mousemove", e => {
			let mouseCoord = { x: e.offsetX, y: e.offsetY };
			mouseCoord.x = mouseCoord.x < 0 ? 0 : mouseCoord.x;
			mouseCoord.x = mouseCoord.x > banner.scrollWidth ? banner.scrollWidth : mouseCoord.x;
			mouseCoord.y = mouseCoord.y < 0 ? 0 : mouseCoord.y;
			mouseCoord.y = mouseCoord.y > banner.scrollHeight ? banner.scrollHeight : mouseCoord.y;

			let transformCard = "scale3d(1.08, 1.08, 1.08) perspective(700px)";
			transformCard += "rotateX(" + ((mouseCoord.y / banner.scrollHeight) * 6 - 3) + "deg)";
			transformCard += "rotateY(" + ((mouseCoord.x / banner.scrollWidth) * 8 - 4) * -1 + "deg)";
			transformCard += "translateX(" + ((mouseCoord.x / banner.scrollWidth) * 2 - 1) + "px)";
			transformCard += "translateY(" + ((mouseCoord.y / banner.scrollHeight) * 3 - 1.5) + "px)";
			banner.style.transform = transformCard;

			let transformCardImage = "rotateX(" + ((mouseCoord.y / banner.scrollHeight) * 3 - 1.5) * -1 + "deg)";
			transformCardImage += "rotateY(" + ((mouseCoord.x / banner.scrollWidth) * 8 - 4) * -1 + "deg)";
			cardBackground.style.transform = transformCardImage;

			let backgroundShineLayerOpacity = (mouseCoord.y / banner.scrollHeight) * 0.05;
			let backgroundShineLayerDegree =
				(Math.atan2(mouseCoord.y - banner.scrollHeight / 2, mouseCoord.x - banner.scrollWidth / 2) * 180) / Math.PI - 90;
			backgroundShineLayerDegree = backgroundShineLayerDegree < 0 ? (backgroundShineLayerDegree += 360) : backgroundShineLayerDegree;
			let backgroundShineLayer =
				"linear-gradient(" +
				backgroundShineLayerDegree +
				"deg, rgba(255,255,255," +
				backgroundShineLayerOpacity +
				") 0%, rgba(255,255,255,0) 80%)";
			overlayShine.style.background = backgroundShineLayer;
		});

		banner.addEventListener("mouseenter", e => {
			banner.classList.remove("overlay-gray");
		});

		banner.addEventListener("mouseleave", e => {
			banner.classList.add("overlay-gray");
			banner.style.transform = "scale3d(1, 1, 1)";
			cardBackground.style.transform = "";

			overlayShine.style.background = "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 80%)";
		});
	},

	resultText: function (elText) {
		let result = "";
		for (let i = 0; i < elText.length; i++) result += `<div class="rules-text">${elText[i].t}</div>`;
		return result;
	},

	getRandomInRange: function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
};

// var VIDEO = {

// 	isPlayOne: false,
// 	isPlayTwo: false,

// 	onClickPlay: function(data, idx)
// 	{
// 		console.log("onClickPlay");

// 		if (idx == 0)
// 		{
// 			if(VIDEO.isPlayTwo == true)
// 			{
// 				VIDEO.isPlayTwo = false;
// 				videoTwo.pause();
// 			}

// 			if(VIDEO.isPlayOne == false) videoOne.play();
// 			else videoOne.pause();
// 			VIDEO.isPlayOne = !VIDEO.isPlayOne;
// 		}
// 		else
// 		{
// 			if(VIDEO.isPlayOne == true)
// 			{
// 				VIDEO.isPlayOne = false;
// 				videoOne.pause();
// 			}

// 			if(VIDEO.isPlayTwo == false) videoTwo.play();
// 			else videoTwo.pause();
// 			VIDEO.isPlayTwo = !VIDEO.isPlayTwo;
// 		}

// 		if (VIDEO.isPlayOne == true || VIDEO.isPlayTwo == true) V.onMuted();
// 		else V.onUnmuted();
// 	}
// };

var V = {
	isMuted: false,

	onClickMute: function () {
		if (V.isMuted) V.onUnmuted();
		else V.onMuted();

		localStorage.setItem("loadscreen-muted", V.isMuted ? "1" : "0");
	},

	onMuted: function () {
		CONFIG.volume = musicVolumeSlider.value;

		musicVolumeSlider.value = 0;
		audioblock.volume = 0;

		musicVolumeIcon.src = "img/icons/volume-mute.png";
		V.isMuted = true;
	},

	onUnmuted: function () {
		musicVolumeSlider.value = CONFIG.volume;
		audioblock.volume = CONFIG.volume;

		V.updateIcon();
		V.isMuted = false;
	},

	updateIcon: function () {
		if (CONFIG.volume <= 0) musicVolumeIcon.src = "img/icons/volume-mute.png";
		else if (CONFIG.volume < 0.5) musicVolumeIcon.src = "img/icons/volume-low.png";
		else musicVolumeIcon.src = "img/icons/volume-loud.png";
	},

	onChangeVolume: function (value) {
		CONFIG.volume = value;
		audioblock.volume = value;
		if (V.isMuted == true && value > 0) V.isMuted = false;
		audioblock.play(); // debug
		V.updateIcon();
	},

	onChangeVolumeMouseSlider: function (value) {
		if (event.buttons == 1) V.onChangeVolume(value);
	},
};

var LOAD = {
	count: 0,
	thisCount: 0,

	handlers: {
		startInitFunctionOrder(data) {
			LOAD.count = data.count;
		},

		initFunctionInvoking(data) {
			let localdata = (data.idx / LOAD.count) * 100;
			LOAD.updateProgress(localdata);
		},

		startDataFileEntries(data) {
			LOAD.count = data.count;
		},

		performMapLoadFunction(data) {
			++LOAD.thisCount;
			let localdata = (LOAD.thisCount / LOAD.count) * 100;
			LOAD.updateProgress(localdata);
		},
	},

	updateProgress: function (data) {
		progressBar.style.left = "0%";
		progressBar.style.width = data + "%";
		//console.log(data+"%");
	},
};
