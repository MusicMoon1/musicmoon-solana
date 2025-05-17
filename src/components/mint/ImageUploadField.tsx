
import { Upload } from "lucide-react";
import { Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ImageUploadFieldProps {
  control: Control<any>;
  imagePreview: string | null;
  setImagePreview: (preview: string | null) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: (name: string, value: any) => void;
}

const ImageUploadField = ({
  control,
  imagePreview,
  setImagePreview,
  handleImageChange,
  setValue
}: ImageUploadFieldProps) => {
  return (
    <FormField
      control={control}
      name="image"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cover Image</FormLabel>
          <FormControl>
            <div className="flex flex-col items-center justify-center">
              {imagePreview ? (
                <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-2 right-2"
                    onClick={() => {
                      setImagePreview(null);
                      setValue("image", null);
                    }}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <label htmlFor="image-upload" className="w-full">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground text-center">
                      <span className="text-primary font-medium">Click to upload</span>{' '}
                      or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      PNG, JPG or WEBP (1:1 ratio recommended)
                    </p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ImageUploadField;
