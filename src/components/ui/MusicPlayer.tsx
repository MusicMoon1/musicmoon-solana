
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface MusicPlayerProps {
  audioUrl: string;
  className?: string;
  minimal?: boolean;
}

const formatTime = (time: number): string => {
  if (time === 0 || isNaN(time)) return '0:00';
  
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const MusicPlayer = ({ audioUrl, className, minimal = false }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const setAudioData = () => {
      setDuration(audio.duration);
    };
    
    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };
    
    // Events
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', () => setIsPlaying(false));
    
    // Cleanup
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [audioRef]);
  
  // Handle play/pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Handle time change
  const handleTimeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };
  
  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const volumeValue = value[0];
    setVolume(volumeValue);
    audio.volume = volumeValue / 100;
    
    if (volumeValue === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isMuted) {
      audio.volume = volume / 100;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };
  
  // Use sample audio if none provided
  const audioSource = audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
  
  return (
    <div className={cn(
      "bg-card rounded-lg p-4 flex flex-col gap-3",
      minimal ? "p-3" : "p-4",
      className
    )}>
      <audio ref={audioRef} src={audioSource} preload="metadata" />
      
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="icon"
          className={cn(
            "rounded-full flex-shrink-0",
            isPlaying ? "bg-primary text-primary-foreground" : ""
          )}
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        
        {!minimal && (
          <div className="flex-1 flex flex-col gap-1">
            <Slider 
              value={[currentTime]} 
              max={duration || 100}
              step={0.01}
              onValueChange={handleTimeChange}
              className="cursor-pointer"
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}
        
        {minimal && (
          <div className="flex-1 flex items-center">
            <Slider 
              value={[currentTime]} 
              max={duration || 100}
              step={0.01}
              onValueChange={handleTimeChange}
              className="cursor-pointer mr-2"
            />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatTime(currentTime)}
            </span>
          </div>
        )}
        
        {!minimal && (
          <div className="flex items-center gap-2 min-w-[120px]">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            
            <Slider
              value={[isMuted ? 0 : volume]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="cursor-pointer w-20"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;
