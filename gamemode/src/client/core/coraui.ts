import { calc, DrawRectg, DrawText2, RenderSprite, GetTextWidth, GetLineCount, breakString } from "./utils";

export interface IButton {
	name: string;
	description?: string | (() => string);
	rightText?: string | (() => string);
	checkbox?: any;
	statusCheckbox?: boolean;
	slider?: Array<string>;
	indexSlider?: number;
	slideNum?: number;
	backgroundColor?: [number, number, number];

	onClick?: (btn: IButton) => void;
	onSlide?: (index: number, btn: IButton) => void;
	onHover?: (btn: IButton) => void;
	onPourcentage?: any;
	valuePourcentage?: any;

	onColorPanel?: any;
	customColorPanel?: number[][];

	indexColorPanel?: number;
	showColorPanel?: number;
	lenghtColorPanel?: number;

	onHeritageSlider?: (value: number) => void;
	heritageSliderValue?: number;
}

export interface ICMenu {
	name: string;
	subtitle?: string;
	glare?: boolean;
	hideHeader?: boolean;
	submenus?: { [key: string]: ICMenu };
	buttons: IButton[];
	onOpen?: Function;
	onClose?: Function;
	heritagePanel?: any;
	closable?: boolean;
	indexHeritagePanel?: [number, number, number, number];

	position?: { x: number; y: number };
}

let init = true;

export class CoraUI {
	private static currentButtonIndex = 0;

	private static menuStack: ICMenu[] = [];

	public static get CurrentMenu() {
		return this.menuStack[this.menuStack.length - 1];
	}

	public static positionMenu = { x: 0, y: 0 };

	public static Config = {
		colors: {
			dark: {
				header: [16, 16, 16, 255],
			},

			white: {
				header: [250, 242, 117, 255],
			},
		},

		x: 0.14,
		y: 0.175,
		width: 0.225,
		bottomHeight: 0.029,
		headerHeight: 0.095,
		colorProps: 0.04,
		glare: true,

		SettingsCheckbox: {
			Dictionary: "commonmenu",
			TexturesUnchecked: "shop_box_blank",
			TexturesChecked: "shop_box_tick",
			TexturesCheckedOver: "shop_box_tickb",
		},

		SettingsPercentagePanel: {
			Text: {
				Middle: { X: 215.5, Y: 15, Scale: 0.35 },
			},
		},

		ColoursPanel: [
			[255, 255, 255, 255], // pure white
			[240, 240, 240, 255], // white
			[0, 0, 0, 255], // black
			[155, 155, 155, 255], // grey
			[205, 205, 205, 255], // LightGrey
			[77, 77, 77, 255], // DarkGrey
			[224, 50, 50, 255], //Red
			[240, 153, 153, 255], // RedLight
			[112, 25, 25, 255], // RedDark
			[93, 182, 229, 255], // Blue
			[174, 219, 242, 255], // LightBlue
			[47, 92, 115, 255], // DarkBlue
			[240, 200, 80, 255], // Yellow
			[254, 235, 169, 255], // LightYellow
			[126, 107, 41, 255], // DarkYellow
			[255, 133, 85, 255], // Orange
			[255, 194, 170, 255], // LightOrange
			[127, 66, 42, 255], // DarkOrange
			[114, 204, 114, 255], // Green
			[185, 230, 185, 255], // LightGreen
			[57, 102, 57, 255], // DarkGreen
			[132, 102, 226, 255], // Purple
			[192, 179, 239, 255], // LightPurple
			[67, 57, 111, 255], // DarkPurple
			[203, 54, 148, 255], // Pink
			[255, 215, 0, 255], // Gold
			[255, 228, 181, 255], // Moccasin
			[240, 230, 140, 255], // Khaki
		],
	};

	public static drawHeader() {
		if (!this.CurrentMenu.hideHeader) {
			DrawRect(
				this.positionMenu.x,
				this.positionMenu.y,
				this.Config.width,
				this.Config.headerHeight,
				this.Config.colors.dark.header[0],
				this.Config.colors.dark.header[1],
				this.Config.colors.dark.header[2],
				this.Config.colors.dark.header[3]
			);

			if (!!this.CurrentMenu.glare) {
				const glareScaleForm = RequestScaleformMovie("MP_MENU_GLARE");
				PushScaleformMovieFunction(glareScaleForm, "initScreenLayout");
				PopScaleformMovieFunctionVoid();
				DrawScaleformMovie(
					glareScaleForm,
					this.positionMenu.x + 0.297,
					this.positionMenu.y + 0.3985,
					this.Config.width + 0.7,
					this.Config.headerHeight + 0.953,
					255,
					255,
					255,
					255,
					0
				);
			}

			DrawText2(
				this.CurrentMenu.name,
				this.positionMenu.x - 0.095,
				this.positionMenu.y - 0.024,
				0.75,
				1,
				[255, 255, 255, 255],
				false,
				2
			);
		}

		DrawRect(
			this.positionMenu.x,
			this.positionMenu.y + (this.Config.headerHeight - 0.03065),
			this.Config.width,
			this.Config.bottomHeight + 0.003,
			this.Config.colors.dark.header[0],
			this.Config.colors.dark.header[1],
			this.Config.colors.dark.header[2],
			230
		);
		if (!!this.CurrentMenu.subtitle)
			DrawText2(
				this.CurrentMenu.subtitle,
				this.positionMenu.x - 0.1075,
				this.positionMenu.y + (this.Config.headerHeight - 0.042),
				0.265,
				0,
				[255, 255, 255, 255],
				false,
				2
			);
		const subtitleRightText = this.currentButtonIndex + 1 + "/" + this.CurrentMenu.buttons.length;
		DrawText2(
			subtitleRightText,
			this.positionMenu.x + this.Config.width / 2 - 0.004 - GetTextWidth(subtitleRightText, 0, 0.265) / 2,
			this.positionMenu.y + (this.Config.headerHeight - 0.041),
			0.265,
			0,
			[255, 255, 255, 255],
			true,
			0
		);
	}

	public static drawButtons() {
		let startIndex = Math.max(0, this.currentButtonIndex - 9);
		let endIndex = Math.min(this.CurrentMenu.buttons.length, startIndex + 10);
		let startY = this.positionMenu.y + (this.Config.bottomHeight + 0.0055);

		if (this.CurrentMenu.heritagePanel == true) {
			startY += 0.203;
		}

		for (let i = startIndex; i < endIndex; i++) {
			const btn = this.CurrentMenu.buttons[i];

			if (btn.checkbox !== null && init) {
				btn.statusCheckbox = false;
				init = false;
			}

			const color_def = i == this.currentButtonIndex ? [255, 255, 255, 255] : [16, 16, 16, 120];
			let color_cust: any;
			if (!!btn.backgroundColor) {
				color_cust =
					i == this.currentButtonIndex
						? [btn.backgroundColor[0], btn.backgroundColor[1], btn.backgroundColor[2], 255]
						: [btn.backgroundColor[0], btn.backgroundColor[1], btn.backgroundColor[2], 100];
			}

			const color = btn.backgroundColor ? color_cust : color_def;
			const colorText = i == this.currentButtonIndex ? [0, 0, 0, 255] : [255, 255, 255, 255];
			const checkboxColor = i == this.currentButtonIndex ? [0, 0, 0, 255] : [255, 255, 255, 255];

			DrawRect(
				this.positionMenu.x,
				startY + (this.Config.bottomHeight * (i - startIndex + 1) + 0.033),
				this.Config.width,
				this.Config.bottomHeight + 0.0011,
				color[0],
				color[1],
				color[2],
				color[3]
			);
			DrawText2(
				btn.name,
				this.positionMenu.x - 0.1075,
				startY + 0.022 + this.Config.bottomHeight * (i - startIndex + 1),
				0.265,
				0,
				[colorText[0], colorText[1], colorText[2], colorText[3]],
				false,
				2
			);

			if (!!btn.description && i == this.currentButtonIndex) {
				const descriptionText = typeof btn.description == "string" ? btn.description : btn.description();
				if (descriptionText.length < 100) {
					const colorfordescback = [16, 16, 16, 165];
					const colorfordesctext = [255, 255, 255, 255];
					const buttonsLenght = this.CurrentMenu.buttons.length > 10 ? 10 : this.CurrentMenu.buttons.length;

					let DescLineCount = GetLineCount(
						descriptionText,
						this.positionMenu.x - 0.1075,
						startY + (this.Config.bottomHeight * (buttonsLenght + 1) - 0.208) + 0.235
					);

					if (DescLineCount == 1) {
						DrawRect(
							this.positionMenu.x,
							startY + (this.Config.bottomHeight * (buttonsLenght + 1) - 0.208) + 0.245,
							this.Config.width,
							this.Config.bottomHeight + 0.0011,
							colorfordescback[0],
							colorfordescback[1],
							colorfordescback[2],
							colorfordescback[3]
						);
						DrawText2(
							descriptionText,
							this.positionMenu.x - 0.1075,
							startY + (this.Config.bottomHeight * (buttonsLenght + 1) - 0.208) + 0.235,
							0.265,
							0,
							[colorfordesctext[0], colorfordesctext[1], colorfordesctext[2], colorfordesctext[3]],
							false,
							2
						);
					} else if (DescLineCount >= 2) {
						DrawRect(
							this.positionMenu.x,
							startY + (this.Config.bottomHeight * (buttonsLenght + 1) - 0.208) + 0.2545,
							this.Config.width,
							this.Config.bottomHeight + 0.0201,
							colorfordescback[0],
							colorfordescback[1],
							colorfordescback[2],
							colorfordescback[3]
						);
						DrawText2(
							breakString(descriptionText, 60),
							this.positionMenu.x - 0.1075,
							startY + (this.Config.bottomHeight * (buttonsLenght + 1) - 0.208) + 0.235,
							0.265,
							0,
							[colorfordesctext[0], colorfordesctext[1], colorfordesctext[2], colorfordesctext[3]],
							false,
							2
						);
					}
				}
			}

			if (btn.checkbox) {
				if (btn.statusCheckbox) {
					if (i == this.currentButtonIndex) {
						RenderSprite(
							this.Config.SettingsCheckbox.Dictionary,
							this.Config.SettingsCheckbox.TexturesCheckedOver,
							this.positionMenu.x + 0.094,
							startY + (this.Config.bottomHeight * (i - startIndex + 1) + 0.018),
							this.Config.width - 0.2078,
							this.Config.bottomHeight + 0.0014,
							0,
							255,
							255,
							255,
							255
						);
					} else {
						RenderSprite(
							this.Config.SettingsCheckbox.Dictionary,
							this.Config.SettingsCheckbox.TexturesChecked,
							this.positionMenu.x + 0.094,
							startY + (this.Config.bottomHeight * (i - startIndex + 1) + 0.018),
							this.Config.width - 0.2078,
							this.Config.bottomHeight + 0.0014,
							0,
							255,
							255,
							255,
							255
						);
					}
				} else {
					RenderSprite(
						this.Config.SettingsCheckbox.Dictionary,
						this.Config.SettingsCheckbox.TexturesUnchecked,
						this.positionMenu.x + 0.094,
						startY + (this.Config.bottomHeight * (i - startIndex + 1) + 0.018),
						this.Config.width - 0.2078,
						this.Config.bottomHeight + 0.0014,
						90,
						checkboxColor[0],
						checkboxColor[1],
						checkboxColor[2],
						checkboxColor[3]
					);
				}
			}

			const textScale = 0.235;
			let rightX = this.positionMenu.x + this.Config.width / 2 - 0.004;
			if (btn.slider) {
				const slider = btn.slider || [];
				const index = btn.indexSlider || 0;
				const spriteWidth = 0.009;

				rightX += spriteWidth / 4;
				DrawSprite(
					"commonmenu",
					"arrowright",
					rightX - spriteWidth / 2,
					startY + 0.032 + this.Config.bottomHeight * (i - startIndex + 1),
					spriteWidth,
					0.018,
					0.0,
					colorText[0],
					colorText[1],
					colorText[2],
					colorText[3]
				);
				rightX -= spriteWidth;

				const text = slider[index] || "";
				DrawText2(
					text,
					rightX - GetTextWidth(text, 0, textScale) / 2,
					startY + 0.023 + this.Config.bottomHeight * (i - startIndex + 1),
					textScale,
					0,
					[colorText[0], colorText[1], colorText[2], colorText[3]],
					true,
					0
				);
				rightX -= GetTextWidth(text, 0, textScale);

				DrawSprite(
					"commonmenu",
					"arrowleft",
					rightX - spriteWidth / 2,
					startY + 0.032 + this.Config.bottomHeight * (i - startIndex + 1),
					spriteWidth,
					0.018,
					0.0,
					colorText[0],
					colorText[1],
					colorText[2],
					colorText[3]
				);
				rightX -= spriteWidth;
			}

			if (!!btn.rightText) {
				const text = typeof btn.rightText == "string" ? btn.rightText : btn.rightText();
				DrawText2(
					text,
					rightX - GetTextWidth(text, 0, textScale) / 2,
					startY + 0.023 + this.Config.bottomHeight * (i - startIndex + 1),
					textScale,
					0,
					[colorText[0], colorText[1], colorText[2], colorText[3]],
					true,
					0
				);
			}

			if (btn.slideNum) {
				let slider: any = [];
				const index = btn.indexSlider || 0;
				const slideNum = btn.slideNum || 0;

				for (let z = 0; z <= slideNum; z++) {
					slider.push(z.toString());
				}

				DrawSprite(
					"commonmenu",
					"arrowleft",
					this.positionMenu.x + 0.089,
					startY + 0.033 + this.Config.bottomHeight * (i - startIndex + 1),
					0.009,
					0.018,
					0.0,
					colorText[0],
					colorText[1],
					colorText[2],
					colorText[3]
				);
				DrawText2(
					slider[index] || "",
					this.positionMenu.x + 0.097,
					startY + 0.023 + this.Config.bottomHeight * (i - startIndex + 1),
					0.235,
					0,
					[colorText[0], colorText[1], colorText[2], colorText[3]],
					true,
					2
				);
				DrawSprite(
					"commonmenu",
					"arrowright",
					this.positionMenu.x + 0.1045,
					startY + 0.033 + this.Config.bottomHeight * (i - startIndex + 1),
					0.009,
					0.018,
					0.0,
					colorText[0],
					colorText[1],
					colorText[2],
					colorText[3]
				);
			}

			if (btn.onPourcentage !== undefined && i == this.currentButtonIndex) {
				if (this.CurrentMenu.buttons[this.currentButtonIndex].valuePourcentage == undefined) {
					this.CurrentMenu.buttons[this.currentButtonIndex].valuePourcentage = 0;
				}

				this.DrawPercentagePanel(this.CurrentMenu.buttons[this.currentButtonIndex].valuePourcentage + "%");
			}

			if (btn.onColorPanel !== undefined && i == this.currentButtonIndex) {
				this.DrawColorPanel(undefined, btn.customColorPanel);
			}

			if (!!btn.onHeritageSlider) {
				const value = btn.heritageSliderValue || 0;
				const sliderValue = Math.max(0, Math.min(10, value));

				const bgWidth = 0.0703;
				const sliderWidth = 0.018;
				const sliderOffset = (bgWidth - sliderWidth) / 10;

				DrawRect(
					this.positionMenu.x + 0.064,
					startY + (this.Config.bottomHeight * (i - startIndex + 1) + 0.0342),
					bgWidth,
					this.Config.bottomHeight / 4,
					4,
					32,
					57,
					255
				); // background

				DrawRect(
					this.positionMenu.x + 0.03785 + sliderOffset * sliderValue,
					startY + (this.Config.bottomHeight * (i - startIndex + 1) + 0.0342),
					sliderWidth,
					this.Config.bottomHeight / 4,
					57,
					119,
					200,
					255
				); // background

				const spriteColor = i == this.currentButtonIndex ? 0 : 255;

				DrawSprite(
					"mpleaderboard",
					"leaderboard_female_icon",
					this.positionMenu.x + 0.0218,
					startY + (this.Config.bottomHeight * (i - startIndex + 1) + 0.0342),
					0.019,
					0.028,
					0,
					spriteColor,
					spriteColor,
					spriteColor,
					255
				);

				DrawSprite(
					"mpleaderboard",
					"leaderboard_male_icon",
					this.positionMenu.x + 0.106,
					startY + (this.Config.bottomHeight * (i - startIndex + 1) + 0.0342),
					0.019,
					0.028,
					0,
					spriteColor,
					spriteColor,
					spriteColor,
					255
				);
			}

			if (this.CurrentMenu.heritagePanel) {
				this.DrawHeritagePanel();
			}
		}
	}

	public static DrawColorPanel(Title?: string, Colors?: number[][]) {
		const buttonsLenght = this.CurrentMenu.buttons.length > 10 ? 10 : this.CurrentMenu.buttons.length;

		const ColorArray = Colors || this.Config.ColoursPanel;

		this.CurrentMenu.buttons[this.currentButtonIndex].lenghtColorPanel = ColorArray.length;
		const colorText = [255, 255, 255, 255];
		const lenghtforTitle2 = Title || "Couleurs";
		const lenghtforTitle = lenghtforTitle2.length || 0;

		this.CurrentMenu.buttons[this.currentButtonIndex].showColorPanel = 8;
		const indexAColorPanel = this.CurrentMenu.buttons[this.currentButtonIndex].indexColorPanel || 0;

		DrawRect(
			this.positionMenu.x,
			this.positionMenu.y + (this.Config.bottomHeight * (buttonsLenght + 1) - 0.201) + 0.304,
			this.Config.width - 0.45,
			this.Config.bottomHeight + 0.065,
			0,
			0,
			0,
			105
		); // background

		DrawText2(
			Title || "Couleurs",
			this.positionMenu.x - 0.004 - lenghtforTitle / 1000,
			this.positionMenu.y + (this.Config.bottomHeight * (buttonsLenght + 1) - 0.201) + 0.263,
			this.Config.SettingsPercentagePanel.Text.Middle.Scale,
			6,
			[colorText[0], colorText[1], colorText[2], colorText[3]],
			false,
			2
		);
		DrawSprite(
			"commonmenu",
			"arrowleft",
			this.positionMenu.x - 0.105,
			this.positionMenu.y + (this.Config.bottomHeight * (buttonsLenght + 1) - 0.188) + 0.263,
			0.009,
			0.018,
			0.0,
			colorText[0],
			colorText[1],
			colorText[2],
			colorText[3]
		);
		DrawSprite(
			"commonmenu",
			"arrowright",
			this.positionMenu.x + 0.105,
			this.positionMenu.y + (this.Config.bottomHeight * (buttonsLenght + 1) - 0.188) + 0.263,
			0.009,
			0.018,
			0.0,
			colorText[0],
			colorText[1],
			colorText[2],
			colorText[3]
		);

		const startIndex = Math.max(0, indexAColorPanel - 7);
		const endIndex = Math.min(ColorArray.length, startIndex + 8);
		const rectWidth = this.Config.colorProps - 0.0175;
		const startX = this.positionMenu.x - rectWidth * 3.5;

		for (let ColorIndex = startIndex; ColorIndex < endIndex; ColorIndex++) {
			let rgb =
				ColorIndex == indexAColorPanel
					? [
							ColorArray[ColorIndex][0],
							ColorArray[ColorIndex][1],
							ColorArray[ColorIndex][2],
							ColorArray[ColorIndex].length > 3 ? ColorArray[ColorIndex][3] - 150 : 105,
					  ]
					: [
							ColorArray[ColorIndex][0],
							ColorArray[ColorIndex][1],
							ColorArray[ColorIndex][2],
							ColorArray[ColorIndex].length > 3 ? ColorArray[ColorIndex][3] : 255,
					  ];
			DrawRect(
				startX + rectWidth * (ColorIndex - startIndex),
				this.positionMenu.y + (this.Config.bottomHeight * (buttonsLenght + 1) - 0.201) + 0.3185,

				rectWidth,
				this.Config.colorProps,
				rgb[0],
				rgb[1],
				rgb[2],
				rgb[3]
			); // Colors
		}

		DrawRect(
			startX + rectWidth * Math.min(indexAColorPanel, 7),
			this.positionMenu.y + (this.Config.bottomHeight * (buttonsLenght + 1) - 0.201) + 0.3185 - this.Config.colorProps / 2 - 0.002,
			rectWidth,
			0.004,
			255,
			255,
			255,
			255
		); // Colors
	}

	public static DrawPercentagePanel(TextHeader?: string) {
		const colorText = [255, 255, 255, 255];
		const lenghtforPercentage2 = TextHeader || "Percentage";
		const lenghtforPercentage = lenghtforPercentage2.length || 0;
		const buttonsLenght = this.CurrentMenu.buttons.length > 10 ? 10 : this.CurrentMenu.buttons.length;

		const percentage = this.CurrentMenu.buttons[this.currentButtonIndex].valuePourcentage || 100;

		DrawRect(
			this.positionMenu.x,
			this.positionMenu.y + (this.Config.bottomHeight * (buttonsLenght + 1) - 0.208) + 0.2935,
			this.Config.width - 0.45,
			this.Config.bottomHeight + 0.0294,
			0,
			0,
			0,
			105
		); // background
		DrawRectg(
			this.positionMenu.x - 0.103,
			this.positionMenu.y + (this.Config.bottomHeight * (buttonsLenght + 1) - 0.201) + 0.2935,
			this.Config.width - 0.017,
			0.008,
			[0, 0, 0, 120]
		);
		DrawRectg(
			this.positionMenu.x - 0.103,
			this.positionMenu.y + (this.Config.bottomHeight * (buttonsLenght + 1) - 0.201) + 0.2935,
			(this.Config.width - 0.017) / calc(percentage),
			0.008,
			[255, 255, 255, 255]
		);

		DrawText2(
			TextHeader || "Percentage",
			this.positionMenu.x - 0.004 - lenghtforPercentage / 1000,
			this.positionMenu.y + (this.Config.bottomHeight * (buttonsLenght + 1) - 0.208) + 0.2695,
			this.Config.SettingsPercentagePanel.Text.Middle.Scale,
			6,
			[colorText[0], colorText[1], colorText[2], colorText[3]],
			false,
			2
		);
		DrawText2(
			"0%",
			this.positionMenu.x - 0.1045,
			this.positionMenu.y + (this.Config.bottomHeight * (buttonsLenght + 1) - 0.208) + 0.2695,
			this.Config.SettingsPercentagePanel.Text.Middle.Scale,
			6,
			[colorText[0], colorText[1], colorText[2], colorText[3]],
			false,
			2
		);
		DrawText2(
			"100%",
			this.positionMenu.x + 0.087,
			this.positionMenu.y + (this.Config.bottomHeight * (buttonsLenght + 1) - 0.208) + 0.2695,
			this.Config.SettingsPercentagePanel.Text.Middle.Scale,
			6,
			[colorText[0], colorText[1], colorText[2], colorText[3]],
			false,
			2
		);
	}

	public static DrawHeritagePanel() {
		const indexHeritagePanel = this.CurrentMenu.indexHeritagePanel || [0, 0, 0, 0];
		// DrawRect(
		//     this.positionMenu.x,
		//     this.positionMenu.y +
		//         (this.Config.bottomHeight + 0.0055) +
		//         (this.Config.bottomHeight * (i - startIndex + 1) + 0.033),
		//     this.Config.width,
		//     this.Config.bottomHeight + 0.0011,
		//     color[0],
		//     color[1],
		//     color[2],
		//     color[3]
		// );

		DrawSprite(
			"pause_menu_pages_char_mom_dad",
			"mumdadbg",
			this.positionMenu.x,
			this.positionMenu.y + (this.Config.bottomHeight + 0.0055) + 0.10894 + 0.0385,
			0.225,
			0.2,
			0.0,
			255,
			255,
			255,
			255
		);

		DrawSprite(
			"pause_menu_pages_char_mom_dad",
			"vignette",
			this.positionMenu.x,
			this.positionMenu.y + (this.Config.bottomHeight + 0.0055) + 0.10895 + 0.0385,
			0.225,
			0.2,
			0.0,
			255,
			255,
			255,
			255
		);

		DrawSprite(
			"char_creator_portraits",
			"male_" + +indexHeritagePanel[0],
			this.positionMenu.x - 0.04,
			this.positionMenu.y + (this.Config.bottomHeight + 0.0055) + 0.10892 + 0.0385,
			0.11,
			0.2,
			0.0,
			255,
			255,
			255,
			255
		);

		DrawSprite(
			"char_creator_portraits",
			"female_" + indexHeritagePanel[1],
			this.positionMenu.x + 0.04,
			this.positionMenu.y + (this.Config.bottomHeight + 0.0055) + 0.10892 + 0.0385,
			0.11,
			0.2,
			0.0,
			255,
			255,
			255,
			255
		);
	}

	public static controlMenu() {
		if (IsControlJustPressed(0, 27)) {
			if (this.currentButtonIndex <= 0) {
				this.currentButtonIndex = this.CurrentMenu.buttons.length - 1;
				this.CurrentMenu.buttons[this.currentButtonIndex].onHover &&
					this.CurrentMenu.buttons[this.currentButtonIndex].onHover?.(this.CurrentMenu.buttons[this.currentButtonIndex]);
			} else {
				this.currentButtonIndex--;
				this.CurrentMenu.buttons[this.currentButtonIndex].onHover &&
					this.CurrentMenu.buttons[this.currentButtonIndex].onHover?.(this.CurrentMenu.buttons[this.currentButtonIndex]);
			}
		} else if (IsControlJustPressed(0, 173)) {
			if (this.currentButtonIndex >= this.CurrentMenu.buttons.length - 1) {
				this.currentButtonIndex = 0;
				this.CurrentMenu.buttons[this.currentButtonIndex].onHover &&
					this.CurrentMenu.buttons[this.currentButtonIndex].onHover?.(this.CurrentMenu.buttons[this.currentButtonIndex]);
			} else {
				this.currentButtonIndex++;
				this.CurrentMenu.buttons[this.currentButtonIndex].onHover &&
					this.CurrentMenu.buttons[this.currentButtonIndex].onHover?.(this.CurrentMenu.buttons[this.currentButtonIndex]);
			}
		} else if (IsControlJustPressed(0, 201)) {
			if (this.CurrentMenu.buttons[this.currentButtonIndex].onClick) {
				this.CurrentMenu.buttons[this.currentButtonIndex].onClick?.(this.CurrentMenu.buttons[this.currentButtonIndex]);
			} else if (this.CurrentMenu.buttons[this.currentButtonIndex].checkbox) {
				this.CurrentMenu.buttons[this.currentButtonIndex].statusCheckbox =
					!this.CurrentMenu.buttons[this.currentButtonIndex].statusCheckbox;
				this.CurrentMenu.buttons[this.currentButtonIndex].checkbox(
					this.CurrentMenu.buttons[this.currentButtonIndex].statusCheckbox
				);
			}
		} else if (IsControlJustPressed(0, 202) && !this.CurrentMenu.closable) {
			if (this.menuStack.length > 1) {
				this.closeSubMenu();
			} else {
				this.closeMenu();
			}
		} else if (IsControlJustPressed(0, 174)) {
			if (this.CurrentMenu.buttons[this.currentButtonIndex].slider || this.CurrentMenu.buttons[this.currentButtonIndex].slideNum) {
				// Sliders

				const indexSlider = this.CurrentMenu.buttons[this.currentButtonIndex].indexSlider || 0;
				const lenghtSlider = this.CurrentMenu.buttons[this.currentButtonIndex].slider
					? this.CurrentMenu.buttons[this.currentButtonIndex].slider?.length || 0
					: this.CurrentMenu.buttons[this.currentButtonIndex].slideNum || 0;

				const idx = indexSlider > 0 ? indexSlider - 1 : lenghtSlider - 1;
				this.CurrentMenu.buttons[this.currentButtonIndex].indexSlider = idx;
				this.CurrentMenu.buttons?.[this.currentButtonIndex]?.onSlide?.(idx, this.CurrentMenu.buttons[this.currentButtonIndex]);
			}

			if (this.CurrentMenu.buttons[this.currentButtonIndex].onColorPanel) {
				const indexColorPanel = this.CurrentMenu.buttons[this.currentButtonIndex].indexColorPanel || 0;
				const lenghtColorPanel = this.CurrentMenu.buttons[this.currentButtonIndex].lenghtColorPanel || 0;

				if (indexColorPanel <= 0) {
					this.CurrentMenu.buttons[this.currentButtonIndex].indexColorPanel =
						this.CurrentMenu.buttons[this.currentButtonIndex].lenghtColorPanel;
				} else {
					if (indexColorPanel > 8) {
						this.CurrentMenu.buttons[this.currentButtonIndex].showColorPanel = -1;
					}
					this.CurrentMenu.buttons[this.currentButtonIndex].indexColorPanel = indexColorPanel - 1; // remove 1
				}

				this.CurrentMenu.buttons[this.currentButtonIndex].onColorPanel(indexColorPanel);
			}

			if (!!this.CurrentMenu.buttons[this.currentButtonIndex].onHeritageSlider) {
				this.CurrentMenu.buttons[this.currentButtonIndex].heritageSliderValue = Math.max(
					0,
					(this.CurrentMenu.buttons[this.currentButtonIndex].heritageSliderValue || 0) - 1
				);

				this.CurrentMenu.buttons[this.currentButtonIndex].onHeritageSlider?.(
					this.CurrentMenu.buttons[this.currentButtonIndex].heritageSliderValue || 0
				);
			}
		} else if (IsControlJustPressed(0, 175)) {
			// right just press
			if (this.CurrentMenu.buttons[this.currentButtonIndex].slider || this.CurrentMenu.buttons[this.currentButtonIndex].slideNum) {
				// Sliders
				const indexSlider = this.CurrentMenu.buttons[this.currentButtonIndex].indexSlider || 0;
				const lenghtSlider = this.CurrentMenu.buttons[this.currentButtonIndex].slider
					? this.CurrentMenu.buttons[this.currentButtonIndex].slider?.length || 0
					: this.CurrentMenu.buttons[this.currentButtonIndex].slideNum || 0;

				const idx = indexSlider >= lenghtSlider - 1 ? 0 : indexSlider + 1;
				this.CurrentMenu.buttons[this.currentButtonIndex].indexSlider = idx;

				this.CurrentMenu.buttons[this.currentButtonIndex].onSlide?.(idx, this.CurrentMenu.buttons[this.currentButtonIndex]);
			}

			if (this.CurrentMenu.buttons[this.currentButtonIndex].onColorPanel) {
				const indexColorPanel = this.CurrentMenu.buttons[this.currentButtonIndex].indexColorPanel || 0;
				const lenghtColorPanel = this.CurrentMenu.buttons[this.currentButtonIndex].lenghtColorPanel || 0;

				if (indexColorPanel >= lenghtColorPanel) {
					this.CurrentMenu.buttons[this.currentButtonIndex].indexColorPanel = 0;
				} else {
					if (indexColorPanel > 8) {
						this.CurrentMenu.buttons[this.currentButtonIndex].showColorPanel = +1;
					}
					this.CurrentMenu.buttons[this.currentButtonIndex].indexColorPanel = indexColorPanel + 1; // remove 1
				}

				this.CurrentMenu.buttons[this.currentButtonIndex].onColorPanel(indexColorPanel);
			}

			if (!!this.CurrentMenu.buttons[this.currentButtonIndex].onHeritageSlider) {
				this.CurrentMenu.buttons[this.currentButtonIndex].heritageSliderValue = Math.min(
					10,
					(this.CurrentMenu.buttons[this.currentButtonIndex].heritageSliderValue || 0) + 1
				);

				this.CurrentMenu.buttons[this.currentButtonIndex].onHeritageSlider?.(
					this.CurrentMenu.buttons[this.currentButtonIndex].heritageSliderValue || 0
				);
			}
		} else if (IsControlPressed(0, 174)) {
			// left press
			if (this.CurrentMenu.buttons[this.currentButtonIndex].onPourcentage) {
				if (this.CurrentMenu.buttons[this.currentButtonIndex].valuePourcentage <= 0) {
					this.CurrentMenu.buttons[this.currentButtonIndex].valuePourcentage = this.CurrentMenu.buttons[
						this.currentButtonIndex
					].valuePourcentage = 100;
					this.CurrentMenu.buttons[this.currentButtonIndex].onPourcentage(
						this.CurrentMenu.buttons[this.currentButtonIndex].valuePourcentage
					);
				} else {
					this.CurrentMenu.buttons[this.currentButtonIndex].valuePourcentage =
						this.CurrentMenu.buttons[this.currentButtonIndex].valuePourcentage - 1;
					this.CurrentMenu.buttons[this.currentButtonIndex].onPourcentage(
						this.CurrentMenu.buttons[this.currentButtonIndex].valuePourcentage
					);
				}
			}
		} else if (IsControlPressed(0, 175)) {
			// right press
			if (this.CurrentMenu.buttons[this.currentButtonIndex].onPourcentage) {
				if (this.CurrentMenu.buttons[this.currentButtonIndex].valuePourcentage >= 100) {
					this.CurrentMenu.buttons[this.currentButtonIndex].valuePourcentage = this.CurrentMenu.buttons[
						this.currentButtonIndex
					].valuePourcentage = 0;
					this.CurrentMenu.buttons[this.currentButtonIndex].onPourcentage(
						this.CurrentMenu.buttons[this.currentButtonIndex].valuePourcentage
					);
				} else {
					this.CurrentMenu.buttons[this.currentButtonIndex].valuePourcentage =
						this.CurrentMenu.buttons[this.currentButtonIndex].valuePourcentage + 1;
					this.CurrentMenu.buttons[this.currentButtonIndex].onPourcentage(
						this.CurrentMenu.buttons[this.currentButtonIndex].valuePourcentage
					);
				}
			}
		}
	}

	public static drawMenu() {
		if (this.menuStack.length > 0) {
			this.drawHeader();
			this.drawButtons();
			this.controlMenu();

			//this.DrawPercentagePanel("Pipi, caca");
			//this.DrawColorPanel();
		}
	}

	public static async openSubmenu(name: string) {
		const submenu = this.CurrentMenu?.submenus?.[name];
		if (!submenu) {
			console.error(`submenu '${name}' not found.`);
			return;
		}

		this.currentButtonIndex = 0;
		this.menuStack.push(submenu);
		submenu.onOpen?.();
		this.CurrentMenu?.buttons?.[this.currentButtonIndex]?.onHover?.(this.CurrentMenu.buttons[this.currentButtonIndex]);
	}

	public static closeSubMenu() {
		this.CurrentMenu?.onClose?.();
		this.currentButtonIndex = 0;
		this.menuStack.pop();
		if (this.menuStack.length > 0) this.menuStack[this.menuStack.length - 1].onOpen?.();
	}

	public static openMenu(obj: ICMenu) {
		SetStreamedTextureDictAsNoLongerNeeded("pause_menu_pages_char_mom_dad");
		SetStreamedTextureDictAsNoLongerNeeded("commonmenu");
		SetStreamedTextureDictAsNoLongerNeeded("mpleaderboard");
		SetStreamedTextureDictAsNoLongerNeeded("char_creator_portraits");
		RequestStreamedTextureDict("pause_menu_pages_char_mom_dad", false);
		RequestStreamedTextureDict("commonmenu", false);
		RequestStreamedTextureDict("mpleaderboard", false);
		RequestStreamedTextureDict("char_creator_portraits", false);

		this.menuStack.push(obj);
		this.drawMenu();

		this.positionMenu = {
			x: obj.position ? obj.position.x : this.Config.x,
			y: obj.position ? obj.position.y : this.Config.y,
		};

		obj.onOpen?.();
	}

	public static updateIndexHeritagePanel(i: number, c: number) {
		if (this.CurrentMenu.indexHeritagePanel !== undefined) {
			this.CurrentMenu.indexHeritagePanel[i] = c;
		}
	}

	public static closeMenu() {
		this.CurrentMenu?.onClose?.();
		this.currentButtonIndex = 0;
		this.menuStack = [];
	}
}

setTick(() => {
	CoraUI.drawMenu();
});
