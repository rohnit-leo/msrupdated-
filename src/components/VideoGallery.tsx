/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, Film } from 'lucide-react';

const VIDEO_URLS = [
  'https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/v/WhatsApp%20Video%202026-07-26%20at%2010.43.31%20PM.mp4',
  'https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/v/WhatsApp%20Video%202026-07-26%20at%2010.48.12%20PM.mp4',
  'https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/v/WhatsApp%20Video%202026-07-26%20at%2010.48.13%20PM.mp4',
  'https://falh4wp7xhmztgpi.public.blob.vercel-storage.com/v/WhatsApp%20Video%202026-07-26%20at%2010.48.22%20PM.mp4'
];

interface SingleVideoPlayerProps {
  url: string;
  key?: React.Key;
}

function SingleVideoPlayer({ url }: SingleVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMute = !isMuted;
    videoRef.current.muted = newMute;
    setIsMuted(newMute);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      if (val === 0) {
        setIsMuted(true);
        videoRef.current.muted = true;
      } else {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setProgress((curr / dur) * 100);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const val = parseFloat(e.target.value);
    const dur = videoRef.current.duration || 1;
    videoRef.current.currentTime = (val / 100) * dur;
    setProgress(val);
  };

  const toggleFullScreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error);
    } else {
      containerRef.current.requestFullscreen().catch(console.error);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="group relative bg-black rounded-2xl overflow-hidden border border-neutral-200/50 shadow-lg aspect-[9/16] sm:aspect-[3/4] flex flex-col justify-end"
    >
      <video
        ref={videoRef}
        src={url}
        playsInline
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        className="w-full h-full object-cover cursor-pointer"
        onClick={togglePlay}
      />

      {/* Center Big Play Button when paused */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 text-white backdrop-blur-md flex items-center justify-center hover:bg-[#B71C1C] hover:scale-110 transition-all duration-300 shadow-2xl z-10 cursor-pointer"
          aria-label="Play Video"
        >
          <Play size={28} className="ml-1 fill-white" />
        </button>
      )}

      {/* Control Overlay Bar at Bottom */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 opacity-90 group-hover:opacity-100 transition-opacity duration-300 z-20 space-y-2">
        {/* Progress Scrubber */}
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#B71C1C]"
        />

        {/* Buttons Controls */}
        <div className="flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-3">
            {/* Play/Pause toggle */}
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} className="fill-white" />}
            </button>

            {/* Mute/Unmute */}
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            {/* Volume slider */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 sm:w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#E0A106]"
            />
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullScreen}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
            aria-label="Fullscreen"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VideoGallery() {
  return (
    <section id="gallery" className="py-24 bg-white border-t border-b border-neutral-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] uppercase font-extrabold tracking-[0.25em] text-[#B71C1C] block mb-2 flex items-center justify-center gap-1.5">
            <Film size={14} /> Heritage Visual Gallery
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-[#1B1B1B]">
            Authentic Spice Journey
          </h2>
          <div className="w-12 h-[1px] bg-[#B71C1C] mx-auto mt-4 mb-4"></div>
          <p className="text-xs sm:text-sm text-neutral-500 font-medium">
            Experience our traditional Telangana harvest, sun-drying solar tents, and low-temperature milling processes in action.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VIDEO_URLS.map((url, idx) => (
            <SingleVideoPlayer key={idx} url={url} />
          ))}
        </div>

      </div>
    </section>
  );
}
