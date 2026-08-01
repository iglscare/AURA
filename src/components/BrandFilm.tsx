import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const LOOP_DURATION = 0.3; // seconds to loop at the end

export default function BrandFilm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Ping-pong loop effect on last 0.3 seconds
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx2d = canvas.getContext('2d');
    if (!ctx2d) return;

    let animFrame: number;
    let loopStart = 0;
    let loopEnd = 0;
    let isReversing = false;
    let currentTime = 0;
    let lastTimestamp = 0;
    let isBouncing = false; // prevents starting multiple rAF loops

    const onLoadedMetadata = () => {
      loopEnd = video.duration;
      loopStart = Math.max(0, video.duration - LOOP_DURATION);
      canvas.width = video.videoWidth || 1920;
      canvas.height = video.videoHeight || 1080;
    };

    // Draw each frame as the video seeks
    const onSeeked = () => {
      ctx2d.drawImage(video, 0, 0, canvas.width, canvas.height);
    };

    // rAF loop: advance virtual time and seek the hidden video
    const renderLoop = (timestamp: number) => {
      const delta = lastTimestamp === 0 ? 0 : (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (!isReversing) {
        currentTime = Math.min(currentTime + delta, loopEnd);
        if (currentTime >= loopEnd) isReversing = true;
      } else {
        currentTime = Math.max(currentTime - delta, loopStart);
        if (currentTime <= loopStart) isReversing = false;
      }

      video.currentTime = currentTime;
      animFrame = requestAnimationFrame(renderLoop);
    };

    // When native playback reaches the loop window, take over
    const onTimeUpdate = () => {
      if (!isBouncing && video.currentTime >= loopStart) {
        isBouncing = true;
        video.pause();
        currentTime = loopStart;
        isReversing = false;
        lastTimestamp = 0;
        animFrame = requestAnimationFrame(renderLoop);
      }
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('seeked', onSeeked);

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('seeked', onSeeked);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  // IntersectionObserver to play/pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // GSAP scroll parallax on canvas
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(canvasRef.current, {
        scale: 1.1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-[90vh] w-full overflow-hidden bg-luxury-black">
      <div className="absolute inset-0 z-0">
        {/* Hidden video used as frame source */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="hidden"
        >
          <source src="https://cdn.pixabay.com/video/2021/04/12/70874-537443193_large.mp4" type="video/mp4" />
        </video>

        {/* Canvas renders frames (including reversed ones) */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover opacity-60"
          style={{ display: 'block' }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center mb-12 group cursor-pointer hover:bg-white hover:text-black transition-all duration-700">
          <Play size={32} className="fill-current" />
        </div>
        <span className="text-luxury-gold text-xs uppercase tracking-[0.8em] mb-6 font-light">
          The Aura Film
        </span>
        <h2 className="font-serif text-4xl md:text-6xl text-white mb-8 leading-tight">
          A Symphony of <br /> <span className="italic">Excellence</span>
        </h2>
      </div>
    </section>
  );
}
