export abstract class Voice {
	public static State = {
		Volume: {
			radio: parseInt(GetConvar("voice_defaultVolume", "0.3")),
			phone: parseInt(GetConvar("voice_defaultVolume", "0.3")),
		},

		Sumbix: {
			radio: (src: any) => {
				MumbleSetSubmixForServerId(src, Voice.State.Radio.effectId);
			},

			phone: (src: any) => {
				MumbleSetSubmixForServerId(src, Voice.State.Call.effectId);
			},
		},

		Mode: 2,
		CurrentGrid: 0,

		Radio: {
			effectId: CreateAudioSubmix("Radio"),
			data: {},
			enabled: false,
			pressed: false,
			channel: 0,
		},

		Call: {
			effectId: CreateAudioSubmix("Phone"),
			data: {},
			channel: 0,
		},
	};

	public static async initialize() {
		console.log("[GM] | [Module] - Voice Initialized");

		SetAudioSubmixEffectRadioFx(this.State.Radio.effectId, 0);
		SetAudioSubmixEffectParamInt(this.State.Radio.effectId, 0, GetHashKey("default"), 1);
		AddAudioSubmixOutput(this.State.Radio.effectId, 0);

		SetAudioSubmixEffectRadioFx(this.State.Call.effectId, 1);
		SetAudioSubmixEffectParamInt(this.State.Call.effectId, 1, GetHashKey("default"), 1);
		SetAudioSubmixEffectParamFloat(this.State.Call.effectId, 1, GetHashKey("freq_low"), 300.0);
		SetAudioSubmixEffectParamFloat(this.State.Call.effectId, 1, GetHashKey("freq_hi"), 6000.0);
		AddAudioSubmixOutput(this.State.Call.effectId, 1);
	}

	public static setVolume(value: number, type: any) {
		const volume = value;
		const checkType = typeof value;

		if (checkType !== "number") {
			return console.log("[GM][Voice] | [Error] - Number value is required");
		}

		if (type) {
			type == "radio" ? (this.State.Volume["radio"] = value) : (this.State.Volume["phone"] = value);
		} else {
			//this.State.Volume.map((v, k) => {
			//
			//})
		}
	}
}
