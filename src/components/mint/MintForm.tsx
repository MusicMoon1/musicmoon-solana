import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ImageUploadField from './ImageUploadField';
import AudioUploadField from './AudioUploadField';
import CategorySelectField from './CategorySelectField';
import PriceInputField from './PriceInputField';
import { v4 as uuidv4 } from 'uuid';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Form schema definition
const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.coerce.number().min(0.1, {
    message: "Price must be at least 0.1 SOL.",
  }),
  category: z.string({
    required_error: "Please select a music category.",
  }),
  image: z.any(),
  audio: z.any(),
});

// Sample data for storage
const SAMPLE_IMAGE_URL = "https://picsum.photos/800/800";
const SAMPLE_AUDIO_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

// Mock user data
const mockUser = {
  id: "user-123",
  name: "Demo User",
  email: "demo@example.com",
};

const MintForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioName, setAudioName] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  
  // Store actual File objects for frontend preview
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: undefined,
      category: "",
    },
  });
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      form.setValue("image", file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      form.setValue("audio", file, { shouldValidate: true });
      setAudioName(file.name);
    }
  };
  
  const createNFT = async (
    title: string,
    description: string,
    price: number,
    category: string,
    creatorId: string
  ) => {
    try {
      const nftData = {
        id: uuidv4(),
        title,
        description,
        imageUrl: SAMPLE_IMAGE_URL,
        audioUrl: SAMPLE_AUDIO_URL,
        price,
        category,
        creatorId,
        creator: mockUser,
        ownerId: creatorId,
        owner: mockUser,
        createdAt: new Date().toISOString()
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, "nfts"), nftData);
      return { ...nftData, id: docRef.id };
    } catch (error) {
      console.error("Error creating NFT:", error);
      throw error;
    }
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsMinting(true);
    
    try {
      if (!imageFile || !audioFile) {
        throw new Error("Both image and audio files are required");
      }
      
      // Create the NFT in Firestore
      const newNFT = await createNFT(
        values.title,
        values.description,
        values.price,
        values.category,
        mockUser.id
      );
      
      toast({
        title: "NFT Created Successfully!",
        description: `Your NFT "${values.title}" has been created and listed on the marketplace.`,
      });
      
      // Reset form after successful submission
      form.reset();
      setImagePreview(null);
      setAudioName(null);
      setImageFile(null);
      setAudioFile(null);
      
      // Navigate to the NFT detail page
      navigate(`/nft/${newNFT.id}`);
      
    } catch (error) {
      console.error("Creation error:", error);
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "There was an error creating your NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };
  
  return (
    <div className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Image Upload and Title/Description Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImageUploadField
              control={form.control}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
              handleImageChange={handleImageChange}
              setValue={form.setValue}
            />
            
            <div className="space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NFT Title</FormLabel>
                    <FormControl>
                      <input 
                        type="text" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" 
                        placeholder="e.g., Cosmic Journey"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <textarea 
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none md:text-sm" 
                        placeholder="Describe your music NFT..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Audio Upload */}
              <AudioUploadField
                control={form.control}
                audioName={audioName}
                setAudioName={setAudioName}
                handleAudioChange={handleAudioChange}
                setValue={form.setValue}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <CategorySelectField control={form.control} />
            
            {/* Price */}
            <PriceInputField control={form.control} />
          </div>
          
          <div>
            <Button 
              type="submit" 
              className="w-full md:w-auto px-8"
              disabled={isMinting}
            >
              {isMinting ? (
                <>
                  <span className="loader inline-block mr-2 h-4 w-4 border-2 border-current border-b-transparent"></span>
                  Creating...
                </>
              ) : (
                "Create NFT"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MintForm;
