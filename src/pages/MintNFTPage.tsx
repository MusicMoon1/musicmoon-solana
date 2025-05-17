import { MintNFTForm } from '@/components/MintNFTForm';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export const MintNFTPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Mint New NFT</h1>
      <MintNFTForm />
    </div>
  );
}; 