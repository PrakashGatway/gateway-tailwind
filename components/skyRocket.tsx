import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
    size: number;
}

interface Rocket {
    x: number;
    y: number;
    targetY: number;
    color: string;
    exploded: boolean;
    size: number;
}

// Create a single audio context and buffer for explosion sound
let audioContext: AudioContext | null = null;
let explosionSoundBuffer: AudioBuffer | null = null;

const playExplosionSound = () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // Generate a short "pop" sound if no buffer exists
    if (!explosionSoundBuffer) {
        const sampleRate = audioContext.sampleRate;
        const duration = 0.2; // seconds
        const numSamples = Math.floor(duration * sampleRate);
        const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
        const data = buffer.getChannelData(0);

        // Simple decaying noise + tone for "firework pop"
        for (let i = 0; i < numSamples; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t * 20); // fast decay
            const noise = (Math.random() * 2 - 1) * 0.3;
            const tone = Math.sin(t * 1000) * 0.2; // ~1kHz tone
            data[i] = (noise + tone) * envelope;
        }
        explosionSoundBuffer = buffer;
    }

    const source = audioContext.createBufferSource();
    source.buffer = explosionSoundBuffer;
    source.connect(audioContext.destination);
    source.start();
};

const SkyRocketCelebration = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        const diwaliColors = [
            "hsla(45, 100%, 60%, 1)",
            "hsla(30, 100%, 60%, 1)",
            "hsla(15, 100%, 60%, 1)",
            "hsla(280, 80%, 70%, 1)",
            "hsla(50, 100%, 70%, 1)",
            "hsla(340, 80%, 70%, 1)",
            "hsla(200, 80%, 70%, 1)",
            "hsla(120, 60%, 60%, 1)",
        ];

        const rockets: Rocket[] = [];
        const particles: Particle[] = [];

        const MAX_ROCKETS = 5;
        const MAX_PARTICLES = 800; // Increased slightly to accommodate bigger explosions

        const createRocket = () => {
            if (rockets.length >= MAX_ROCKETS) return;

            const size = 0.8 + Math.random() * 0.4;
            rockets.push({
                x: Math.random() * canvas.width,
                y: canvas.height,
                targetY: Math.random() * canvas.height * 0.3 + 60,
                color: diwaliColors[Math.floor(Math.random() * diwaliColors.length)],
                exploded: false,
                size,
            });
        };

        const createSparkle = (x: number, y: number, color: string) => {
            // 🔥 INCREASED explosion size: more particles
            const sparkleCount = 80 + Math.random() * 120; // Was 30–90, now 80–200
            for (let i = 0; i < sparkleCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const velocity = 0.8 + Math.random() * 2.5; // Slightly faster
                const size = 0.6 + Math.random() * 1.4; // Slightly larger

                particles.push({
                    x,
                    y,
                    vx: Math.cos(angle) * velocity,
                    vy: Math.sin(angle) * velocity,
                    life: 0.9 + Math.random() * 0.5, // Slightly longer life
                    color,
                    size,
                });
            }
        };

        const animate = () => {
            ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = rockets.length - 1; i >= 0; i--) {
                const rocket = rockets[i];

                if (!rocket.exploded) {
                    rocket.y -= 4;

                    // Trail
                    ctx.beginPath();
                    ctx.strokeStyle = rocket.color;
                    ctx.lineWidth = rocket.size;
                    ctx.moveTo(rocket.x, rocket.y);
                    ctx.lineTo(rocket.x, rocket.y + 2 * rocket.size);
                    ctx.stroke();

                    // Head with glow
                    ctx.shadowColor = rocket.color;
                    ctx.shadowBlur = 8;
                    ctx.beginPath();
                    ctx.arc(rocket.x, rocket.y, 1.5 * rocket.size, 0, Math.PI * 2);
                    ctx.fillStyle = rocket.color;
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    if (Math.random() > 0.85) {
                        particles.push({
                            x: rocket.x + (Math.random() - 0.5) * 3,
                            y: rocket.y + Math.random() * 10,
                            vx: (Math.random() - 0.5) * 0.5,
                            vy: Math.random() * 0.5,
                            life: 0.3,
                            color: rocket.color,
                            size: 0.5 + Math.random() * 1,
                        });
                    }

                    if (rocket.y <= rocket.targetY) {
                        rocket.exploded = true;
                        createSparkle(rocket.x, rocket.y, rocket.color);
                        // playExplosionSound(); // 🔊 Play sound on explode
                        rockets.splice(i, 1);
                    }
                }
            }

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];

                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.02;
                p.life -= 0.015;

                if (p.life <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.globalAlpha = p.life;
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 3;
                ctx.fillStyle = p.color;
                ctx.beginPath();

                if (Math.random() > 0.3) {
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                } else {
                    ctx.rect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
                }
                ctx.fill();
            }

            if (particles.length > MAX_PARTICLES) {
                particles.splice(0, particles.length - MAX_PARTICLES);
            }

            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            requestAnimationFrame(animate);
        };

        const rocketInterval = setInterval(() => {
            createRocket();
            if (Math.random() > 0.6) {
                const count = 1 + Math.floor(Math.random() * 2);
                for (let i = 1; i <= count; i++) {
                    setTimeout(createRocket, i * 100);
                }
            }
        }, 800);

        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            clearInterval(rocketInterval);
            // Optional: close audio context if needed (not strictly necessary)
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-50"
            style={{
                mixBlendMode: "multiply",
                background: "transparent",
            }}
        />
    );
};

export default SkyRocketCelebration;



// import { useEffect, useRef } from "react";

// interface Particle {
//   x: number;
//   y: number;
//   vx: number;
//   vy: number;
//   life: number;
//   color: string;
//   size: number;
// }

// interface Rocket {
//   x: number;
//   y: number;
//   targetY: number;
//   color: string;
//   exploded: boolean;
//   size: number;
// }

// 🔊 Audio setup — uses your file from /public/sounds/explosion.mp3
// let explosionAudio: HTMLAudioElement | null = null;

// const playExplosionSound = () => {
//   if (!explosionAudio) {
//     explosionAudio = new Audio('/sounds/explosion.mp3');
//     explosionAudio.preload = 'auto';
//   }

//   const sound = explosionAudio.cloneNode() as HTMLAudioElement;
//   sound.volume = 0.7; // Adjust as needed (0.0 to 1.0)
//   // Play sound; suppress autoplay errors silently
//   sound.play().catch(() => {
//     // Optional: log or trigger on user interaction
//   });
// };

// const SkyRocketCelebration = () => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     const resizeCanvas = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };
//     resizeCanvas();
//     window.addEventListener("resize", resizeCanvas);

//     const diwaliColors = [
//       "hsla(45, 100%, 60%, 1)",
//       "hsla(30, 100%, 60%, 1)",
//       "hsla(15, 100%, 60%, 1)",
//       "hsla(280, 80%, 70%, 1)",
//       "hsla(50, 100%, 70%, 1)",
//       "hsla(340, 80%, 70%, 1)",
//       "hsla(200, 80%, 70%, 1)",
//       "hsla(120, 60%, 60%, 1)",
//     ];

//     const rockets: Rocket[] = [];
//     const particles: Particle[] = [];

//     const MAX_ROCKETS = 5;
//     const MAX_PARTICLES = 800;

//     const createRocket = () => {
//       if (rockets.length >= MAX_ROCKETS) return;

//       const size = 0.8 + Math.random() * 0.4;
//       rockets.push({
//         x: Math.random() * canvas.width,
//         y: canvas.height,
//         targetY: Math.random() * canvas.height * 0.3 + 60,
//         color: diwaliColors[Math.floor(Math.random() * diwaliColors.length)],
//         exploded: false,
//         size,
//       });
//     };

//     const createSparkle = (x: number, y: number, color: string) => {
//       // 💥 Bigger explosion: 80–200 particles
//       const sparkleCount = 80 + Math.random() * 120;
//       for (let i = 0; i < sparkleCount; i++) {
//         const angle = Math.random() * Math.PI * 2;
//         const velocity = 0.8 + Math.random() * 2.5;
//         const size = 0.6 + Math.random() * 1.4;

//         particles.push({
//           x,
//           y,
//           vx: Math.cos(angle) * velocity,
//           vy: Math.sin(angle) * velocity,
//           life: 0.9 + Math.random() * 0.5,
//           color,
//           size,
//         });
//       }
//     };

//     const animate = () => {
//       // Light fade for white background
//       ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       // Update rockets
//       for (let i = rockets.length - 1; i >= 0; i--) {
//         const rocket = rockets[i];

//         if (!rocket.exploded) {
//           rocket.y -= 4;

//           // Trail
//           ctx.beginPath();
//           ctx.strokeStyle = rocket.color;
//           ctx.lineWidth = rocket.size;
//           ctx.moveTo(rocket.x, rocket.y);
//           ctx.lineTo(rocket.x, rocket.y + 2 * rocket.size);
//           ctx.stroke();

//           // Glowing head
//           ctx.shadowColor = rocket.color;
//           ctx.shadowBlur = 8;
//           ctx.beginPath();
//           ctx.arc(rocket.x, rocket.y, 1.5 * rocket.size, 0, Math.PI * 2);
//           ctx.fillStyle = rocket.color;
//           ctx.fill();
//           ctx.shadowBlur = 0;

//           // Trail sparkles
//           if (Math.random() > 0.85) {
//             particles.push({
//               x: rocket.x + (Math.random() - 0.5) * 3,
//               y: rocket.y + Math.random() * 10,
//               vx: (Math.random() - 0.5) * 0.5,
//               vy: Math.random() * 0.5,
//               life: 0.3,
//               color: rocket.color,
//               size: 0.5 + Math.random() * 1,
//             });
//           }

//           // Explode at target
//           if (rocket.y <= rocket.targetY) {
//             rocket.exploded = true;
//             createSparkle(rocket.x, rocket.y, rocket.color);
//             playExplosionSound(); // 🔊 YOUR SOUND
//             rockets.splice(i, 1);
//           }
//         }
//       }

//       // Update particles
//       for (let i = particles.length - 1; i >= 0; i--) {
//         const p = particles[i];

//         p.x += p.vx;
//         p.y += p.vy;
//         p.vy += 0.02;
//         p.life -= 0.015;

//         if (p.life <= 0) {
//           particles.splice(i, 1);
//           continue;
//         }

//         ctx.globalAlpha = p.life;
//         ctx.shadowColor = p.color;
//         ctx.shadowBlur = 3;
//         ctx.fillStyle = p.color;
//         ctx.beginPath();

//         if (Math.random() > 0.3) {
//           ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
//         } else {
//           ctx.rect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
//         }
//         ctx.fill();
//       }

//       // Enforce particle limit
//       if (particles.length > MAX_PARTICLES) {
//         particles.splice(0, particles.length - MAX_PARTICLES);
//       }

//       ctx.globalAlpha = 1;
//       ctx.shadowBlur = 0;
//       requestAnimationFrame(animate);
//     };

//     const rocketInterval = setInterval(() => {
//       createRocket();
//       if (Math.random() > 0.6) {
//         const count = 1 + Math.floor(Math.random() * 2);
//         for (let i = 1; i <= count; i++) {
//           setTimeout(createRocket, i * 100);
//         }
//       }
//     }, 800);

//     animate();

//     return () => {
//       window.removeEventListener("resize", resizeCanvas);
//       clearInterval(rocketInterval);
//     };
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="fixed inset-0 pointer-events-none z-50"
//       style={{
//         mixBlendMode: "multiply",
//         background: "transparent",
//       }}
//     />
//   );
// };

// export default SkyRocketCelebration;