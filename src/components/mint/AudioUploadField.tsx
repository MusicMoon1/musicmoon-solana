
import { Music } from "lucide-react";
import { Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface AudioUploadFieldProps {
  control: Control<any>;
  audioName: string | null;
  setAudioName: (name: string | null) => void;
  handleAudioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: (name: string, value: any) => void;
}

const AudioUploadField = ({
  control,
  audioName,
  setAudioName,
  handleAudioChange,
  setValue
}: AudioUploadFieldProps) => {
  return (
    <FormField
      control={control}
      name="audio"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Audio File</FormLabel>
          <FormControl>
            <div className="flex flex-col">
              <label htmlFor="audio-upload">
                <div className={`border border-border rounded-lg p-4 flex items-center gap-3 ${!audioName ? 'cursor-pointer hover:border-primary' : ''}`}>
                  <Music className="h-5 w-5 text-muted-foreground" />
                  {audioName ? (
                    <div className="flex-1 flex items-center justify-between">
                      <span className="text-sm truncate max-w-[180px]">{audioName}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          setAudioName(null);
                          setValue("audio", null);
                        }}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Upload audio file
                    </span>
                  )}
                </div>
                <input
                  id="audio-upload"
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleAudioChange}
                />
              </label>
              <FormDescription className="text-xs mt-2">
                MP3, WAV or FLAC. Max 50MB.
              </FormDescription>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AudioUploadField;
