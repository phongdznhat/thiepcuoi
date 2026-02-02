const defaultConfig = {
	groom_name: "Minh Quân",
	bride_name: "Thùy Linh",
	wedding_date: "Chủ Nhật, 15 Tháng 12, 2024",
	wedding_time: "10:00 Sáng",
	venue_name: "Trung Tâm Tiệc Cưới Diamond Palace",
	venue_address: "123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
	invitation_message:
		"kính mời quý khách đến dự lễ thành hôn của chúng tôi và chung vui trong ngày trọng đại này.",
	background_color: "#fdf8f3",
	card_color: "#fffcf8",
	text_color: "#6b5b4f",
	accent_color: "#c9956c",
	highlight_color: "#8b5a2b",
	font_family: "Cormorant Garamond",
	font_size: 16,
};

// Countdown timer function
function startCountdown() {
	// Parse the Vietnamese date format: "Chủ Nhật, 15 Tháng 12, 2024"
	const dateStr = document.getElementById("wedding-date").textContent;
	console.debug("startCountdown: wedding-date text=", dateStr);
	const weddingDate = parseVietnameseDate(dateStr);
	console.debug("startCountdown: parsed weddingDate=", weddingDate);

	if (!weddingDate) return;

	function updateCountdown() {
		const now = new Date().getTime();
		const timeLeft = weddingDate.getTime() - now;

		if (timeLeft <= 0) {
			document.getElementById("countdown-days").textContent = "0";
			document.getElementById("countdown-hours").textContent = "0";
			document.getElementById("countdown-minutes").textContent = "0";
			document.getElementById("countdown-seconds").textContent = "0";
			return;
		}

		const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
		const hours = Math.floor(
			(timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

		document.getElementById("countdown-days").textContent = days;
		document.getElementById("countdown-hours").textContent = hours;
		document.getElementById("countdown-minutes").textContent = minutes;
		document.getElementById("countdown-seconds").textContent = seconds;
	}

	updateCountdown();
	setInterval(updateCountdown, 1000);
}

function parseVietnameseDate(dateStr) {
	// Parse format: "Chủ Nhật, 15 Tháng 12, 2024"
	const lowerStr = dateStr.toLowerCase();
	const dayMatch = lowerStr.match(/(\d+)\s*tháng/);
	const monthMatch = lowerStr.match(/tháng\s*(\d+)/);
	const yearMatch = lowerStr.match(/(\d{4})/);

	if (dayMatch && monthMatch && yearMatch) {
		const day = parseInt(dayMatch[1]);
		const month = parseInt(monthMatch[1]) - 1;
		const year = parseInt(yearMatch[1]);
		return new Date(year, month, day, 10, 0, 0);
	}
	// Fallback: try common numeric formats like "19/3/2026" or "19-3-2026"
	const alt = lowerStr.match(/(\d{1,2})\D+(\d{1,2})\D+(\d{4})/);
	if (alt) {
		const day = parseInt(alt[1]);
		const month = parseInt(alt[2]) - 1;
		const year = parseInt(alt[3]);
		console.debug("parseVietnameseDate: fallback parsed", { day, month, year });
		return new Date(year, month, day, 10, 0, 0);
	}
	console.warn("parseVietnameseDate: could not parse date string:", dateStr);
	return null;
}

async function onConfigChange(config) {
	// Update text content
	document.getElementById("groom-name").textContent =
		config.groom_name || defaultConfig.groom_name;
	document.getElementById("bride-name").textContent =
		config.bride_name || defaultConfig.bride_name;
	document.getElementById("wedding-date").textContent =
		config.wedding_date || defaultConfig.wedding_date;
	document.getElementById("wedding-time").textContent =
		config.wedding_time || defaultConfig.wedding_time;
	document.getElementById("venue-name").textContent =
		config.venue_name || defaultConfig.venue_name;
	document.getElementById("venue-address").textContent =
		config.venue_address || defaultConfig.venue_address;
	document.getElementById("invitation-message").textContent =
		config.invitation_message || defaultConfig.invitation_message;

	// Update colors
	const bgColor = config.background_color || defaultConfig.background_color;
	const cardColor = config.card_color || defaultConfig.card_color;
	const textColor = config.text_color || defaultConfig.text_color;
	const accentColor = config.accent_color || defaultConfig.accent_color;
	const highlightColor = config.highlight_color || defaultConfig.highlight_color;

	const wrapper = document.getElementById("app-wrapper");
	wrapper.style.background = `linear-gradient(135deg, ${bgColor} 0%, ${adjustColor(
		bgColor,
		-5
	)} 50%, ${bgColor} 100%)`;

	// Update fonts
	const fontFamily = config.font_family || defaultConfig.font_family;
	const fontSize = config.font_size || defaultConfig.font_size;

	document.querySelectorAll(".font-display").forEach((el) => {
		el.style.fontFamily = `${fontFamily}, Cormorant Garamond, serif`;
	});

	document.querySelectorAll(".font-body").forEach((el) => {
		el.style.fontSize = `${fontSize}px`;
	});

	// Update accent colors on text elements
	document.querySelectorAll('[style*="color: #c9956c"]').forEach((el) => {
		el.style.color = accentColor;
	});

	document.querySelectorAll('[style*="color: #8b5a2b"]').forEach((el) => {
		el.style.color = highlightColor;
	});

	document.querySelectorAll('[style*="color: #6b5b4f"]').forEach((el) => {
		el.style.color = textColor;
	});

	// Restart countdown when date changes
	startCountdown();
}

function adjustColor(hex, percent) {
	const num = parseInt(hex.replace("#", ""), 16);
	const amt = Math.round(2.55 * percent);
	const R = Math.min(255, Math.max(0, (num >> 16) + amt));
	const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
	const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
	return (
		"#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)
	);
}

function mapToCapabilities(config) {
	return {
		recolorables: [
			{
				get: () => config.background_color || defaultConfig.background_color,
				set: (value) => {
					config.background_color = value;
					window.elementSdk.setConfig({ background_color: value });
				},
			},
			{
				get: () => config.card_color || defaultConfig.card_color,
				set: (value) => {
					config.card_color = value;
					window.elementSdk.setConfig({ card_color: value });
				},
			},
			{
				get: () => config.text_color || defaultConfig.text_color,
				set: (value) => {
					config.text_color = value;
					window.elementSdk.setConfig({ text_color: value });
				},
			},
			{
				get: () => config.accent_color || defaultConfig.accent_color,
				set: (value) => {
					config.accent_color = value;
					window.elementSdk.setConfig({ accent_color: value });
				},
			},
			{
				get: () => config.highlight_color || defaultConfig.highlight_color,
				set: (value) => {
					config.highlight_color = value;
					window.elementSdk.setConfig({ highlight_color: value });
				},
			},
		],
		borderables: [],
		fontEditable: {
			get: () => config.font_family || defaultConfig.font_family,
			set: (value) => {
				config.font_family = value;
				window.elementSdk.setConfig({ font_family: value });
			},
		},
		fontSizeable: {
			get: () => config.font_size || defaultConfig.font_size,
			set: (value) => {
				config.font_size = value;
				window.elementSdk.setConfig({ font_size: value });
			},
		},
	};
}

function mapToEditPanelValues(config) {
	return new Map([
		["groom_name", config.groom_name || defaultConfig.groom_name],
		["bride_name", config.bride_name || defaultConfig.bride_name],
		["wedding_date", config.wedding_date || defaultConfig.wedding_date],
		["wedding_time", config.wedding_time || defaultConfig.wedding_time],
		["venue_name", config.venue_name || defaultConfig.venue_name],
		["venue_address", config.venue_address || defaultConfig.venue_address],
		[
			"invitation_message",
			config.invitation_message || defaultConfig.invitation_message,
		],
	]);
}

// Initialize SDK
if (window.elementSdk) {
	window.elementSdk.init({
		defaultConfig,
		onConfigChange,
		mapToCapabilities,
		mapToEditPanelValues,
	});
}

// Start countdown when page loads
window.addEventListener("load", startCountdown);

// Cloudflare iframe injection (moved from inline)
(function () {
	function c() {
		var b = a.contentDocument || a.contentWindow.document;
		if (b) {
			var d = b.createElement("script");
			d.innerHTML =
				"window.__CF$cv$params={r:'9c7a643541ed08d9',t:'MTc3MDA0MjY3OS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
			b.getElementsByTagName("head")[0].appendChild(d);
		}
	}
	if (document.body) {
		var a = document.createElement("iframe");
		a.height = 1;
		a.width = 1;
		a.style.position = "absolute";
		a.style.top = 0;
		a.style.left = 0;
		a.style.border = "none";
		a.style.visibility = "hidden";
		document.body.appendChild(a);
		if ("loading" !== document.readyState) c();
		else if (window.addEventListener) document.addEventListener("DOMContentLoaded", c);
		else {
			var e = document.onreadystatechange || function () {};
			document.onreadystatechange = function (b) {
				e(b);
				"loading" !== document.readyState && ((document.onreadystatechange = e), c());
			};
		}
	}
})();

