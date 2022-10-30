import React from "react";
import { useHistory } from "react-router-dom";

import "./style.scss";

const Realisations = () => {
	const history = useHistory();
	const close = () => {
		fetch(`https://${location.hostname.replace("cfx-nui-", "")}/leaverealisation`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},

			body: JSON.stringify(true),
		});
	};

	const back = () => {
		history.push("/menu");
	};

	document.addEventListener("keydown", function (event) {
		if (event.keyCode == 27) close();
	});
	document.addEventListener("keydown", function (event) {
		// if (event.keyCode == 8) back();
	});

	const Component = () => {
		return (
			<>
				<div style={{ marginTop: 12.5 }} className="component">
					<svg width="119" height="120" viewBox="0 0 119 120" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M0 11C0 4.92486 4.92487 0 11 0H114V120H10C4.47716 120 0 115.523 0 110V11Z"
							fill="url(#paint0_linear_94_2)"
						/>
						<rect x="114" width="5" height="120" fill="#2B2B2B" />
						<defs>
							<linearGradient
								id="paint0_linear_94_2"
								x1="57"
								y1="135.5"
								x2="4.99999"
								y2="-6.2886e-07"
								gradientUnits="userSpaceOnUse"
							>
								<stop offset="0.0360829" stop-color="#E449FD" stop-opacity="0.57" />
								<stop offset="0.701519" stop-color="#7B1E8A" stop-opacity="0.56" />
								<stop offset="1" stop-color="#491052" stop-opacity="0.73" />
							</linearGradient>
						</defs>

						<foreignObject height={120} width={120}>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									height: 120,
									width: 120,
								}}
							>
								<svg width="84" height="84" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
									<g clip-path="url(#clip0_18_385)">
										<path
											d="M36.9241 59.6839C36.8114 59.3443 36.8264 58.9859 36.9655 58.6776C37.0971 58.3857 37.3264 58.1739 37.6121 58.0786C37.7537 58.0323 37.9016 58.016 38.057 58.0335L39.4579 58.1964L38.6397 57.0473C37.6647 55.6764 36.0344 54.9747 34.3941 55.2165C33.2199 55.3882 32.1836 56.0047 31.4756 56.9558C30.7676 57.907 30.4706 59.0761 30.6423 60.249C30.8139 61.422 31.4317 62.4583 32.3828 63.1676C33.1573 63.7452 34.0783 64.0485 35.0257 64.0485C35.2412 64.0485 35.4592 64.0322 35.676 64.0009C37.171 63.7828 38.4404 62.8255 39.0707 61.442L39.6046 60.2703L38.3527 60.5736C37.7675 60.7118 37.1372 60.3258 36.9241 59.6839ZM35.4931 62.7606C34.6598 62.8822 33.8126 62.6716 33.1297 62.1616C32.4467 61.6529 32.0044 60.9085 31.8816 60.0677C31.7575 59.2256 31.9693 58.386 32.4793 57.7043C32.9893 57.0226 33.7324 56.579 34.5745 56.4549C34.7262 56.4324 34.8778 56.4223 35.0294 56.4223C35.6973 56.4223 36.3439 56.6366 36.8828 57.0276C36.4179 57.2682 36.0495 57.6592 35.8226 58.1592C35.552 58.7569 35.5206 59.4373 35.7337 60.0777C36.0056 60.8972 36.6459 61.5025 37.3941 61.7418C36.9041 62.2882 36.2374 62.6528 35.4931 62.7606Z"
											fill="#fff"
										/>
										<path
											d="M63.73 46.7971C64.1322 46.44 64.6372 45.9914 65.2676 45.43L67.9467 43.0503L57.8265 45.4275C57.4794 45.5089 56.9844 45.6179 56.5108 45.7207L58.1799 43.0315L57.0007 43.0791C56.0584 43.1167 34.2428 43.4889 27.3231 45.9863C20.4924 48.4525 6.20307 58.8596 5.67801 63.1979C5.54894 63.3583 5.59029 64.3483 5.59029 64.3483C5.5928 64.3508 5.62914 64.3759 5.65295 64.3922C5.65295 64.3922 14.8132 70.4698 24.3432 72.3971C24.3846 72.4058 24.4259 72.4096 24.4685 72.4096C24.7567 72.4096 25.0174 72.2053 25.0763 71.9109C25.144 71.5738 24.9272 71.2467 24.5901 71.179C15.9197 69.4259 8.93612 65.0964 6.91734 63.7518C14.104 58.4624 19.1553 55.5176 23.5776 53.8447C22.3909 56.1792 21.9435 58.8133 22.3282 61.4573C22.8232 64.8433 24.6051 67.8332 27.3494 69.8783C29.5838 71.545 32.2391 72.4209 34.9772 72.4209C35.6 72.4209 36.2265 72.3758 36.8531 72.2843C40.239 71.7906 43.2302 70.0074 45.2753 67.2643C47.3204 64.5212 48.1738 61.1453 47.6813 57.7594C47.4445 56.1354 46.8868 54.6153 46.0911 53.2356C50.7076 54.0289 55.6749 54.7306 59.9543 54.0928C61.0659 54.7331 61.9267 55.2782 62.4255 55.6103C61.0796 57.2356 56.5108 62.426 49.893 66.4936C49.6011 66.6741 49.5083 67.0563 49.6888 67.3495C49.8692 67.6427 50.2527 67.7305 50.5447 67.5538C58.6611 62.5651 63.8152 55.6867 64.022 55.4148C64.022 55.4148 63.0633 54.5777 61.7601 53.7294C65.4969 52.7607 68.5244 50.5038 70.0206 45.9676L70.4505 44.6668L69.1848 45.1931C68.1109 45.6367 65.755 46.3908 63.73 46.7971ZM46.4507 57.9398C46.4996 58.2694 46.5259 58.599 46.546 58.9286L40.4257 58.9812C40.229 58.9824 40.0711 59.1428 40.0736 59.3396C40.0749 59.5351 40.234 59.6917 40.4282 59.6917C40.4295 59.6917 40.4307 59.6917 40.4307 59.6917L46.5598 59.6391C46.5585 60.9548 46.3455 62.2506 45.9081 63.4786L40.2766 61.2268C40.0912 61.1528 39.8881 61.2418 39.8142 61.4248C39.7415 61.6077 39.8305 61.8145 40.0122 61.8872L45.6387 64.1365C45.2816 64.9711 44.8355 65.7743 44.2791 66.5212C44.056 66.8207 43.8192 67.1052 43.5723 67.3783L39.3481 63.2242C39.2064 63.0864 38.9821 63.0877 38.8456 63.228C38.709 63.3684 38.7102 63.5927 38.8493 63.7305L43.0723 67.8833C42.0034 68.9297 40.754 69.748 39.3781 70.3069L37.2591 64.4874C37.1914 64.3044 36.9859 64.2092 36.8042 64.2756C36.62 64.3433 36.5235 64.5463 36.5912 64.7317L38.714 70.56C38.0573 70.7806 37.3781 70.951 36.6777 71.0537C36.1188 71.1352 35.5624 71.1615 35.0072 71.1628L34.9546 65.02C34.9534 64.8245 34.7942 64.6678 34.6 64.6678C34.5987 64.6678 34.5975 64.6678 34.5975 64.6678C34.4007 64.6691 34.2428 64.8295 34.2454 65.0262L34.298 71.1515C33.0549 71.0775 31.8431 70.7943 30.6915 70.3294L32.9258 64.7418C32.9985 64.5588 32.9095 64.3521 32.7278 64.2794C32.5436 64.2079 32.3381 64.2944 32.2654 64.4774L30.0361 70.0537C29.3607 69.7304 28.7103 69.3395 28.0963 68.8821C27.7003 68.5863 27.3344 68.2618 26.9835 67.9247L31.209 63.6265C31.3456 63.4861 31.3444 63.2618 31.204 63.124C31.0649 62.9862 30.8394 62.9874 30.7028 63.1278L26.4823 67.4209C25.6076 66.4698 24.9109 65.3821 24.4009 64.2017L29.9196 61.8358C30.1013 61.7581 30.184 61.5488 30.1063 61.3684C30.0286 61.1879 29.8181 61.104 29.6401 61.1817L24.1302 63.5438C23.8683 62.817 23.6766 62.0588 23.5625 61.2769C23.4923 60.7957 23.4623 60.3145 23.4522 59.8358L29.5574 59.7832C29.7542 59.7819 29.9121 59.6215 29.9096 59.4248C29.9083 59.2293 29.7492 59.0727 29.5549 59.0727C29.5537 59.0727 29.5524 59.0727 29.5524 59.0727L23.4535 59.1253C23.5024 57.8985 23.7467 56.6967 24.1753 55.5539L29.9158 57.8484C29.9597 57.8659 30.0035 57.8747 30.0474 57.8747C30.1878 57.8747 30.3218 57.7907 30.3782 57.6516C30.4509 57.4687 30.3619 57.2619 30.1802 57.1892L24.4497 54.8985C24.7091 54.3196 25.0211 53.7607 25.3783 53.2231C26.1139 52.9925 26.8382 52.797 27.5562 52.6279L31.0938 56.1053C31.1639 56.1729 31.2542 56.208 31.3431 56.208C31.4346 56.208 31.5261 56.1729 31.5963 56.1015C31.7329 55.9612 31.7316 55.7369 31.5925 55.599L28.3833 52.4437C29.2542 52.2632 30.1226 52.1166 31.001 52.0038L32.4835 54.8872C32.5461 55.0101 32.6702 55.0802 32.7993 55.0802C32.8544 55.0802 32.9095 55.0677 32.9622 55.0401C33.1363 54.9512 33.204 54.7369 33.115 54.5614L31.7542 51.9161C32.382 51.8472 33.0148 51.7845 33.6614 51.7382C35.7328 51.5853 38.3431 51.9149 41.1814 52.3835L38.0887 55.3647C37.9471 55.5013 37.9433 55.7256 38.0786 55.8672C38.1488 55.9399 38.2415 55.9762 38.3343 55.9762C38.4232 55.9762 38.5122 55.9436 38.5799 55.876L42.051 52.5301C42.7528 52.6504 43.462 52.7745 44.1838 52.9011C44.269 52.9161 44.3555 52.9311 44.4395 52.9462C44.7766 53.4236 45.0723 53.9274 45.3342 54.4512L39.6325 56.896C39.4508 56.9737 39.3681 57.183 39.4458 57.3634C39.5034 57.4975 39.635 57.5789 39.7729 57.5789C39.8192 57.5789 39.8668 57.5702 39.912 57.5501L45.6512 55.089C46.0334 55.99 46.3054 56.9446 46.4507 57.9398ZM44.3994 51.6667C40.3418 50.95 36.5085 50.2745 33.5687 50.4888C24.8282 51.1241 18.5551 53.7858 7.63162 61.6754C10.5614 57.2757 21.6452 48.8472 27.6276 46.8823C34.6213 44.5854 51.086 44.6029 55.8654 44.3836L53.8968 47.5565L55.3303 47.2558C55.3303 47.2558 57.21 46.861 58.1122 46.6492L63.4142 45.4036C62.5094 46.2094 58.6787 48.45 58.6787 48.45L61.7651 48.3247C63.5846 48.2507 66.433 47.4838 68.3415 46.8372C64.5721 55.2243 53.8805 53.3409 44.3994 51.6667Z"
											fill="#fff"
										/>
										<path
											d="M79.6992 21.3563C79.2795 21.1759 78.812 21.1708 78.3822 21.3413C77.9549 21.5117 77.6203 21.8375 77.4386 22.2586C77.2607 22.6721 77.2557 23.1295 77.4198 23.5443C77.5877 23.964 77.911 24.2936 78.3321 24.4703C78.5451 24.5605 78.7707 24.6056 78.995 24.6056C79.2118 24.6056 79.4286 24.5643 79.6366 24.4816C80.5113 24.1332 80.9436 23.1445 80.599 22.2773C80.4323 21.8613 80.1128 21.5339 79.6992 21.3563ZM79.3722 23.8224C79.1253 23.9214 78.8521 23.9202 78.6078 23.8162C78.3647 23.7134 78.1767 23.5242 78.0815 23.2811C77.985 23.0417 77.9887 22.7786 78.0915 22.5392C78.198 22.2924 78.3948 22.1007 78.6466 22.0004C78.7694 21.9515 78.896 21.9265 79.0238 21.9265C79.1579 21.9265 79.292 21.954 79.4186 22.0079C79.6566 22.1107 79.8421 22.2999 79.9373 22.5392C80.1391 23.043 79.8847 23.6182 79.3722 23.8224Z"
											fill="#fff"
										/>
										<path
											d="M83.2331 21.2259C82.8822 20.345 82.2018 19.6558 81.3183 19.2836C80.4399 18.9127 79.4637 18.9039 78.5527 19.2673L56.454 29.1895C55.9728 28.8975 55.4928 28.5943 55.0054 28.3286C53.0806 27.3098 51.251 26.5417 49.4077 25.9828C46.9428 25.2497 44.6321 24.9226 42.285 24.9715L41.8125 24.9916C41.2724 25.0129 40.7148 25.0354 40.3389 25.1043L38.4454 25.4026C37.2361 25.6532 36.0131 26.0229 34.7086 26.5316C32.4668 27.385 30.547 28.3888 28.5132 29.4514L28.1385 29.6469C26.1523 30.7221 24.101 31.9564 22.0358 33.321C21.898 33.415 6.86556 44.0427 4.25657 46.6705C4.0072 46.9224 3.75157 47.1692 3.49593 47.4174C2.56987 48.3121 1.61124 49.2394 0.915758 50.391C0.0648908 51.802 -0.461419 53.9248 0.566138 55.5564L1.11124 56.6478L1.66888 56.2594C1.66888 56.2594 2.64631 55.5789 4.28414 54.3584L7.57984 51.9536C8.61492 51.198 9.75776 50.3647 11.0109 49.4863C12.3906 48.4963 13.9031 47.4575 15.4958 46.3723C17.1336 45.262 18.8341 44.1442 20.5559 43.0502C22.0897 42.064 23.6937 41.0966 25.3202 40.1167L27.4731 38.8586C28.8804 38.0465 30.3352 37.2057 31.8139 36.4363C33.7161 35.4012 35.7312 34.3285 37.5682 33.494C38.5657 33.0591 39.4354 32.7283 40.2173 32.4852L41.5845 32.1569C41.9303 32.0729 42.1722 32.0403 42.404 32.0065C42.5619 31.984 42.716 31.9627 42.8564 31.9351C44.4554 31.7183 46.2749 31.7271 48.1182 31.9614C48.4039 31.9965 48.7084 32.0529 49.0029 32.0992L46.6258 32.8787C46.5405 32.9125 46.0581 33.108 45.9165 33.1656L43.4579 33.6894C43.4579 33.6894 40.2148 34.3122 38.5168 34.9902C34.8089 36.4701 32.5207 39.1718 33.3064 41.143C33.7124 42.1605 34.8251 42.7871 36.4367 42.9049C36.6209 42.9187 36.8113 42.9249 37.0043 42.9249C38.3314 42.9249 39.8414 42.6104 41.3213 42.0189C43.0168 41.3422 45.8 39.5616 45.8 39.5616L47.8764 38.2834C48.0518 38.2132 48.6032 37.9914 48.6784 37.9613L52.5806 36.1719C52.7848 36.0904 53.0066 35.9739 53.0981 35.7283C53.1006 35.7233 53.0994 35.7182 53.1006 35.7132L57.3462 34.2245C57.4038 34.2433 57.4665 34.2621 57.5229 34.2809L60.9552 35.4313C61.5466 35.6481 62.0742 35.8172 62.5128 35.9588C62.7797 36.0453 63.0128 36.1192 63.2296 36.1957L66.4952 37.2145L64.6569 35.41C64.6218 35.3761 63.7772 34.5491 62.1907 33.2421L62.1644 33.2195C61.979 33.0692 61.7785 32.9075 61.5717 32.7408L81.2068 25.8562C82.094 25.5016 82.7945 24.8249 83.178 23.9502C83.5664 23.0743 83.5852 22.1056 83.2331 21.2259ZM48.2711 30.7305C46.3263 30.4824 44.3952 30.4724 42.6584 30.7092C42.5055 30.738 42.3702 30.7568 42.2311 30.7756C41.9654 30.8132 41.6872 30.8521 41.305 30.9448C41.305 30.9448 38.4166 31.6628 37.062 32.3583C35.2236 33.3032 33.141 34.2982 31.2299 35.3382C29.7387 36.1139 28.2701 36.961 26.8516 37.7818L24.6786 39.0525C23.0421 40.0387 21.4281 41.0111 19.8867 42.0023C18.1587 43.1013 16.4469 44.2254 14.7978 45.3431C13.1938 46.4359 11.6738 47.4797 10.2916 48.4722C9.03847 49.3519 7.88811 50.1902 6.84677 50.9483L3.54731 53.3568C2.68516 53.9984 2.00848 54.4884 1.56487 54.8079C0.937061 53.5811 1.38192 52.026 1.98091 51.0323C2.59118 50.0198 3.45082 49.1902 4.35933 48.3118C4.62123 48.0574 4.88313 47.8043 5.14002 47.5461C7.55603 45.1101 21.9832 34.8608 22.7263 34.3545C24.7551 33.015 26.7751 31.7982 28.7212 30.7456L29.0871 30.5538C31.0883 29.5087 32.9768 28.5213 35.1547 27.6917C36.3991 27.2068 37.5569 26.8559 38.6923 26.6215L40.5318 26.3333C40.8514 26.2744 41.389 26.2544 41.8614 26.2356L42.3313 26.2155C42.4792 26.2118 42.6283 26.2105 42.7774 26.2105C44.815 26.2105 46.8726 26.5276 49.0493 27.1754C50.8112 27.7105 52.5693 28.4473 54.4152 29.426C54.637 29.5463 54.855 29.6829 55.0743 29.8107L51.6846 31.3333C50.4678 31.0613 49.3488 30.8608 48.2711 30.7305ZM51.1495 32.8937L49.9064 32.7371L50.8262 32.4351C50.8801 32.4464 50.934 32.4576 50.9866 32.4689C50.9979 32.504 51.0079 32.5366 51.023 32.5754L51.1495 32.8937ZM48.6082 33.1628C48.6257 33.1678 51.3475 33.4899 51.3826 33.4749L51.6194 34.0676L47.3864 33.5626L48.6082 33.1628ZM40.8577 40.8573C39.3326 41.465 37.79 41.7508 36.5294 41.6568C35.4379 41.5766 34.6873 41.2207 34.4718 40.6806C34.0282 39.5691 35.7713 37.4375 38.983 36.1556C40.7925 35.4338 42.4115 35.2584 43.5895 35.4175L44.7123 38.232C43.9629 39.1556 42.6596 40.138 40.8577 40.8573ZM47.4829 37.4939L45.7874 38.5315L44.1584 34.4488L46.1734 34.014C46.226 33.994 46.2787 34.0015 46.3325 34.0015C46.4102 34.4062 46.5681 34.9488 46.8814 35.7345C47.1132 36.3122 47.3613 36.8398 47.5819 37.222C47.607 37.2658 47.6433 37.3222 47.6759 37.3761C47.627 37.4187 47.5656 37.4588 47.4829 37.4939ZM48.5242 37.0575C48.4578 36.9711 48.3801 36.8407 48.2987 36.6929L49.1646 36.7643L48.5242 37.0575ZM50.236 36.2734C50.2122 36.2659 48.0668 36.103 48.018 36.128C47.9102 35.8924 47.8012 35.6443 47.6984 35.3862L51.3463 35.7646L50.236 36.2734ZM47.4892 34.8273C47.4027 34.5854 47.3325 34.3611 47.2749 34.1581C47.2749 34.1581 51.8149 34.6631 51.85 34.6481L52.0568 35.1656C52.0668 35.1907 52.0768 35.2082 52.0869 35.232C52.0869 35.2333 47.5418 34.7969 47.4892 34.8273ZM61.3687 34.2593L59.2635 33.5538L60.1757 33.2343C60.6156 33.5751 61.0329 33.9034 61.385 34.1879L61.4075 34.2054C61.4564 34.2455 61.504 34.2856 61.5517 34.3257C61.4915 34.3047 61.4301 34.2822 61.3687 34.2593ZM82.0426 23.454C81.7908 24.0279 81.3321 24.4715 80.7745 24.6946L52.7548 34.519L51.9741 32.5629L79.0364 20.4127C79.3221 20.2986 79.6191 20.2422 79.9161 20.2422C80.2281 20.2422 80.5389 20.3049 80.8346 20.4289C81.4086 20.6708 81.8509 21.1169 82.0765 21.6858V21.6871C82.3058 22.256 82.292 22.8826 82.0426 23.454Z"
											fill="#fff"
										/>
									</g>
									<defs>
										<clipPath id="clip0_18_385">
											<rect width="83.484" height="83.484" fill="white" />
										</clipPath>
									</defs>
								</svg>
							</div>
						</foreignObject>
					</svg>

					<div
						className="flex-row"
						style={{
							justifyContent: "space-between",
							alignItems: "center",
							width: "95%",
						}}
					>
						<div style={{ display: "block", width: 250, marginLeft: 20 }}>
							<p className="title">VISAGE EN CUIR</p>
							<p className="subtitle">FAIRE DE LA CHIRURGIE PLASTIQUE</p>
						</div>

						<div className="flex-column flex-align">
							<p style={{ color: "#fff" }}>RÊCOMPENSE</p>
							<p style={{ color: "#fff", fontSize: 27.5 }}>$1000</p>
						</div>
					</div>
				</div>

				<div
					style={{
						marginTop: 10,
						height: 3,
						width: "90%",
						background: "rgba(217, 217, 217, 0.18)",
					}}
				></div>
			</>
		);
	};

	return (
		<div id="realisations">
			<img style={{ height: 825 }} src="https://cdn.discordapp.com/attachments/749017234743099423/1020012142344273920/unknown.png" />
			<div style={{ display: "flex", marginTop: -715 }}>
				<div className="list">
					<Component />
					<Component />
					<Component />
					<Component />
					<Component />
				</div>

				<div className="sublist">
					<svg
						style={{ marginLeft: -25 }}
						width="105"
						height="48"
						viewBox="0 0 122 48"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M0.26 21.0001V4.80012H2.52V19.3801H6.66V21.0001H0.26ZM10.2292 21.0001L13.6692 4.80012H15.8492L19.3092 21.0001H17.1692L16.4292 16.9201H13.1292L12.3492 21.0001H10.2292ZM13.4292 15.3001H16.1292L14.7692 8.00012L13.4292 15.3001ZM31.3233 21.0001V4.80012H34.8433C36.0433 4.80012 36.9899 4.98679 37.6833 5.36012C38.3899 5.72012 38.8899 6.26679 39.1833 7.00012C39.4899 7.73345 39.6433 8.64679 39.6433 9.74012V15.7001C39.6433 16.8468 39.4899 17.8135 39.1833 18.6001C38.8899 19.3868 38.4033 19.9868 37.7233 20.4001C37.0566 20.8001 36.1566 21.0001 35.0233 21.0001H31.3233ZM33.5833 19.3801H34.8633C35.6899 19.3801 36.2766 19.2201 36.6233 18.9001C36.9699 18.5801 37.1766 18.1135 37.2433 17.5001C37.3233 16.8868 37.3633 16.1468 37.3633 15.2801V10.0201C37.3633 9.18012 37.3099 8.50012 37.2033 7.98012C37.0966 7.46012 36.8633 7.08012 36.5033 6.84012C36.1433 6.60012 35.5766 6.48012 34.8033 6.48012H33.5833V19.3801ZM44.7702 21.0001V4.80012H51.0502V6.48012H47.0302V11.8401H50.2902V13.4401H47.0302V19.3801H51.0902V21.0001H44.7702ZM55.8147 21.0001V4.80012H59.0747C60.1547 4.80012 61.048 4.94679 61.7547 5.24012C62.4614 5.52012 62.9814 5.98012 63.3147 6.62012C63.6614 7.24679 63.8347 8.07345 63.8347 9.10012C63.8347 9.72679 63.768 10.3001 63.6347 10.8201C63.5014 11.3268 63.288 11.7601 62.9947 12.1201C62.7014 12.4668 62.3147 12.7201 61.8347 12.8801L64.1347 21.0001H61.9547L59.8347 13.4001H58.0747V21.0001H55.8147ZM58.0747 11.7801H58.9347C59.5747 11.7801 60.0947 11.7001 60.4947 11.5401C60.8947 11.3801 61.188 11.1068 61.3747 10.7201C61.5614 10.3335 61.6547 9.79345 61.6547 9.10012C61.6547 8.15346 61.4814 7.47346 61.1347 7.06012C60.788 6.63345 60.1014 6.42012 59.0747 6.42012H58.0747V11.7801ZM69.0858 21.0001V4.80012H70.6258L75.2258 15.5601V4.80012H77.1058V21.0001H75.6658L71.0058 9.94012V21.0001H69.0858ZM82.6722 21.0001V4.80012H84.8922V21.0001H82.6722ZM90.4131 21.0001V4.80012H96.6931V6.48012H92.6731V11.8401H95.9331V13.4401H92.6731V19.3801H96.7331V21.0001H90.4131ZM90.8131 3.66012L92.5331 0.160121H94.7131L96.4531 3.66012H94.8331L93.6131 1.24012L92.4131 3.66012H90.8131ZM101.458 21.0001V4.80012H104.718C105.798 4.80012 106.691 4.94679 107.398 5.24012C108.104 5.52012 108.624 5.98012 108.958 6.62012C109.304 7.24679 109.478 8.07345 109.478 9.10012C109.478 9.72679 109.411 10.3001 109.278 10.8201C109.144 11.3268 108.931 11.7601 108.638 12.1201C108.344 12.4668 107.958 12.7201 107.478 12.8801L109.778 21.0001H107.598L105.478 13.4001H103.718V21.0001H101.458ZM103.718 11.7801H104.578C105.218 11.7801 105.738 11.7001 106.138 11.5401C106.538 11.3801 106.831 11.1068 107.018 10.7201C107.204 10.3335 107.298 9.79345 107.298 9.10012C107.298 8.15346 107.124 7.47346 106.778 7.06012C106.431 6.63345 105.744 6.42012 104.718 6.42012H103.718V11.7801ZM114.729 21.0001V4.80012H121.009V6.48012H116.989V11.8401H120.249V13.4401H116.989V19.3801H121.049V21.0001H114.729ZM0.26 47.0001V30.8001H3.52C4.6 30.8001 5.49333 30.9468 6.2 31.2401C6.90667 31.5201 7.42667 31.9801 7.76 32.6201C8.10667 33.2468 8.28 34.0735 8.28 35.1001C8.28 35.7268 8.21333 36.3001 8.08 36.8201C7.94667 37.3268 7.73333 37.7601 7.44 38.1201C7.14667 38.4668 6.76 38.7201 6.28 38.8801L8.58 47.0001H6.4L4.28 39.4001H2.52V47.0001H0.26ZM2.52 37.7801H3.38C4.02 37.7801 4.54 37.7001 4.94 37.5401C5.34 37.3801 5.63333 37.1068 5.82 36.7201C6.00667 36.3335 6.1 35.7935 6.1 35.1001C6.1 34.1535 5.92667 33.4735 5.58 33.0601C5.23333 32.6335 4.54667 32.4201 3.52 32.4201H2.52V37.7801ZM13.5311 47.0001V30.8001H19.8111V32.4801H15.7911V37.8401H19.0511V39.4401H15.7911V45.3801H19.8511V47.0001H13.5311ZM13.9311 29.6601L15.6511 26.1601H17.8311L19.5711 29.6601H17.9511L16.7311 27.2401L15.5311 29.6601H13.9311ZM23.6956 47.0001L27.1356 30.8001H29.3156L32.7756 47.0001H30.6356L29.8956 42.9201H26.5956L25.8156 47.0001H23.6956ZM26.8956 41.3001H29.5956L28.2356 34.0001L26.8956 41.3001ZM37.3194 47.0001V30.8001H39.5794V45.3801H43.7194V47.0001H37.3194ZM48.2886 47.0001V30.8001H50.5086V47.0001H48.2886ZM59.8495 47.1801C58.9162 47.1801 58.1362 46.9801 57.5095 46.5801C56.8962 46.1801 56.4295 45.6268 56.1095 44.9201C55.7895 44.2135 55.6029 43.3935 55.5495 42.4601L57.5495 41.9201C57.5895 42.4935 57.6762 43.0468 57.8095 43.5801C57.9562 44.1135 58.1895 44.5535 58.5095 44.9001C58.8295 45.2335 59.2762 45.4001 59.8495 45.4001C60.4362 45.4001 60.8762 45.2401 61.1695 44.9201C61.4762 44.5868 61.6295 44.1135 61.6295 43.5001C61.6295 42.7668 61.4629 42.1801 61.1295 41.7401C60.7962 41.2868 60.3762 40.8335 59.8695 40.3801L57.1495 37.9801C56.6162 37.5135 56.2229 37.0068 55.9695 36.4601C55.7162 35.9001 55.5895 35.2135 55.5895 34.4001C55.5895 33.2135 55.9295 32.2935 56.6095 31.6401C57.2895 30.9868 58.2162 30.6601 59.3895 30.6601C60.0295 30.6601 60.5895 30.7468 61.0695 30.9201C61.5629 31.0801 61.9695 31.3335 62.2895 31.6801C62.6229 32.0268 62.8829 32.4668 63.0695 33.0001C63.2695 33.5201 63.4029 34.1335 63.4695 34.8401L61.5495 35.3601C61.5095 34.8268 61.4295 34.3401 61.3095 33.9001C61.1895 33.4468 60.9762 33.0868 60.6695 32.8201C60.3762 32.5401 59.9495 32.4001 59.3895 32.4001C58.8295 32.4001 58.3895 32.5535 58.0695 32.8601C57.7629 33.1535 57.6095 33.5935 57.6095 34.1801C57.6095 34.6735 57.6895 35.0801 57.8495 35.4001C58.0229 35.7201 58.2962 36.0468 58.6695 36.3801L61.4095 38.7801C62.0229 39.3135 62.5629 39.9535 63.0295 40.7001C63.4962 41.4335 63.7295 42.3068 63.7295 43.3201C63.7295 44.1201 63.5629 44.8135 63.2295 45.4001C62.8962 45.9735 62.4362 46.4135 61.8495 46.7201C61.2762 47.0268 60.6095 47.1801 59.8495 47.1801ZM67.5027 47.0001L70.9427 30.8001H73.1227L76.5827 47.0001H74.4427L73.7027 42.9201H70.4027L69.6227 47.0001H67.5027ZM70.7027 41.3001H73.4027L72.0427 34.0001L70.7027 41.3001ZM82.2619 47.0001V32.4801H79.5219V30.8001H87.1819V32.4801H84.5219V47.0001H82.2619ZM91.7636 47.0001V30.8001H93.9836V47.0001H91.7636ZM103.645 47.1801C102.551 47.1801 101.678 46.9668 101.025 46.5401C100.371 46.1135 99.9045 45.5068 99.6245 44.7201C99.3445 43.9201 99.2045 42.9868 99.2045 41.9201V35.7801C99.2045 34.7135 99.3445 33.8001 99.6245 33.0401C99.9179 32.2668 100.385 31.6801 101.025 31.2801C101.678 30.8668 102.551 30.6601 103.645 30.6601C104.738 30.6601 105.605 30.8668 106.245 31.2801C106.885 31.6935 107.345 32.2801 107.625 33.0401C107.918 33.8001 108.065 34.7135 108.065 35.7801V41.9401C108.065 42.9935 107.918 43.9135 107.625 44.7001C107.345 45.4868 106.885 46.1001 106.245 46.5401C105.605 46.9668 104.738 47.1801 103.645 47.1801ZM103.645 45.4001C104.245 45.4001 104.698 45.2801 105.005 45.0401C105.311 44.7868 105.518 44.4401 105.625 44.0001C105.731 43.5468 105.785 43.0201 105.785 42.4201V35.3201C105.785 34.7201 105.731 34.2068 105.625 33.7801C105.518 33.3401 105.311 33.0068 105.005 32.7801C104.698 32.5401 104.245 32.4201 103.645 32.4201C103.045 32.4201 102.585 32.5401 102.265 32.7801C101.958 33.0068 101.751 33.3401 101.645 33.7801C101.538 34.2068 101.485 34.7201 101.485 35.3201V42.4201C101.485 43.0201 101.538 43.5468 101.645 44.0001C101.751 44.4401 101.958 44.7868 102.265 45.0401C102.585 45.2801 103.045 45.4001 103.645 45.4001ZM113.186 47.0001V30.8001H114.726L119.326 41.5601V30.8001H121.206V47.0001H119.766L115.106 35.9401V47.0001H113.186Z"
							fill="#7E9DB8"
						/>
					</svg>
				</div>
			</div>
		</div>
	);
};

export default Realisations;
