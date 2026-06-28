// confetti burst. Creates a temporary full-screen canvas overlay,
// animates falling particles, then removes itself. Call fireConfetti() on a celebratory moment.
const COLORS = ["#f97316", "#22c55e", "#3b82f6", "#a855f7", "#ec4899", "#eab308"];

export function fireConfetti({ particleCount = 140, duration = 4200 } = {}) {
	if (
		typeof document === "undefined" ||
		window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
	) {
		return;
	}

	const canvas = document.createElement("canvas");
	canvas.style.cssText =
		"position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999";
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	document.body.appendChild(canvas);
	const ctx = canvas.getContext("2d");

	const originX = canvas.width / 2;
	const originY = canvas.height * 0.32;
	const particles = Array.from({ length: particleCount }, () => {
		const angle = Math.random() * Math.PI * 2;
		const speed = 3 + Math.random() * 7;
		return {
			x: originX,
			y: originY,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed - 4,
			size: 4 + Math.random() * 6,
			color: COLORS[Math.floor(Math.random() * COLORS.length)],
			rotation: Math.random() * Math.PI,
			vr: (Math.random() - 0.5) * 0.3,
		};
	});

	const start = performance.now();
	let raf;
	const tick = (now) => {
		const elapsed = now - start;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		const fade = Math.max(0, 1 - elapsed / duration);
		for (const particle of particles) {
			particle.vy += 0.08; // gravity (low so the confetti drifts down slowly)
			particle.vx *= 0.992;
			particle.x += particle.vx;
			particle.y += particle.vy;
			particle.rotation += particle.vr;
			ctx.save();
			ctx.globalAlpha = fade;
			ctx.translate(particle.x, particle.y);
			ctx.rotate(particle.rotation);
			ctx.fillStyle = particle.color;
			ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.6);
			ctx.restore();
		}
		if (elapsed < duration) {
			raf = requestAnimationFrame(tick);
		} else {
			cancelAnimationFrame(raf);
			canvas.remove();
		}
	};
	raf = requestAnimationFrame(tick);
}
