import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useNFT } from '@/hooks/useNFT';
import { useStorage } from '@/hooks/useStorage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'react-hot-toast';

export const MintNFTForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mintNFT } = useNFT();
  const { uploadFile } = useStorage();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: null as File | null,
    audio: null as File | null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioName, setAudioName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
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
      setFormData((prev) => ({ ...prev, audio: file }));
      setAudioName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Upload files first
      if (!formData.image || !formData.audio) {
        throw new Error('Please select both image and audio files');
      }

      const [imageUrl, audioUrl] = await Promise.all([
        uploadFile(formData.image, 'nft-images'),
        uploadFile(formData.audio, 'nft-audio')
      ]);

      // Create NFT
      const nftData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        imageUrl,
        audioUrl,
        creatorId: user.id,
        ownerId: user.id
      };

      await mintNFT(nftData);
      toast.success('NFT created successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Error creating NFT:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create NFT');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter NFT title"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Enter NFT description"
          />
        </div>

        <div>
          <Label htmlFor="price">Price (ETH)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
            placeholder="Enter price in ETH"
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="">Select a category</option>
            <option value="Electronic">Electronic</option>
            <option value="Hip Hop">Hip Hop</option>
            <option value="Rock">Rock</option>
            <option value="Pop">Pop</option>
            <option value="Classical">Classical</option>
            <option value="Jazz">Jazz</option>
            <option value="Lo-Fi">Lo-Fi</option>
          </select>
        </div>

        <div>
          <Label htmlFor="image">Cover Image</Label>
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="audio">Audio File</Label>
          <Input
            id="audio"
            name="audio"
            type="file"
            accept="audio/*"
            onChange={handleAudioChange}
            required
          />
          {audioName && (
            <p className="mt-2 text-sm text-gray-600">{audioName}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating NFT...' : 'Create NFT'}
        </Button>
      </form>
    </Card>
  );
}; 