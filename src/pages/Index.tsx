
import { Link } from "react-router-dom";
import { ArrowRight, Wallet, Upload, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 md:pt-32 pb-20 overflow-hidden">
        <div className="hero-glow top-20 left-1/2 -translate-x-1/2 animate-pulse-glow"></div>
        <div className="container px-4 text-center relative z-10">
          <div className="mb-8 flex justify-center">
            <img 
              src="/lovable-uploads/896a2a86-ba84-4f23-9d13-62f101838d70.png" 
              alt="MusicMoon Logo" 
              className="h-24 md:h-32 w-auto"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-3xl mx-auto">
            Turn Your Music Into <span className="text-musicmoon">NFTs</span> on the Solana Blockchain
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the next generation of music ownership and distribution. Create, sell, and collect digital music assets.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="rounded-full px-8 bg-musicmoon text-background hover:bg-musicmoon/90">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button size="lg" variant="outline" className="rounded-full px-8 border-musicmoon text-musicmoon hover:bg-musicmoon/10">
                Explore Marketplace
              </Button>
            </Link>
          </div>
          
          {/* Animated Floating NFT Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-16 md:mt-24 max-w-4xl mx-auto">
            {[
              { delay: "0s", img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" },
              { delay: "1s", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" },
              { delay: "2s", img: "https://images.unsplash.com/photo-1526394931762-8a4116f6e8c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" }
            ].map((item, index) => (
              <div 
                key={index}
                className="overflow-hidden rounded-lg shadow-xl animate-float"
                style={{ animationDelay: item.delay }}
              >
                <img
                  src={item.img}
                  alt={`Featured NFT ${index + 1}`}
                  className="w-full h-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              MusicMoon makes it easy to create, sell, and collect music NFTs on the Solana blockchain.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: <Upload className="h-8 w-8 text-musicmoon" />,
                title: "Create",
                description: "Upload your music, artwork, and details to create your NFT."
              },
              {
                icon: <img 
                  src="/lovable-uploads/896a2a86-ba84-4f23-9d13-62f101838d70.png" 
                  alt="MusicMoon Logo" 
                  className="h-8 w-8" 
                />,
                title: "Mint",
                description: "Mint your music as an NFT on the Solana blockchain."
              },
              {
                icon: <ShoppingBag className="h-8 w-8 text-musicmoon" />,
                title: "Sell",
                description: "List your NFT on the marketplace for collectors to purchase."
              },
              {
                icon: <Wallet className="h-8 w-8 text-musicmoon" />,
                title: "Collect",
                description: "Build your collection of unique music NFTs from favorite artists."
              }
            ].map((step, index) => (
              <div key={index} className="bg-card rounded-lg p-6 text-center">
                <div className="bg-muted rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artists Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Artists</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover amazing musicians who are leading the music NFT movement.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Astronaut Dreams",
                image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
                profile: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
                genre: "Electronic"
              },
              {
                name: "Pixel Wave",
                image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
                profile: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
                genre: "Hip-Hop"
              },
              {
                name: "Luna Mist",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
                profile: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
                genre: "Indie"
              }
            ].map((artist, index) => (
              <div key={index} className="bg-card rounded-lg overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={artist.profile}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{artist.name}</h3>
                      <p className="text-sm text-muted-foreground">{artist.genre}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full border-musicmoon text-musicmoon hover:bg-musicmoon/10">View Profile</Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/marketplace">
              <Button variant="outline" className="rounded-full px-8 border-musicmoon text-musicmoon hover:bg-musicmoon/10">
                View All Artists
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-20 relative overflow-hidden">
        <div className="hero-glow opacity-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="container px-4 relative z-10">
          <div className="max-w-4xl mx-auto bg-gradient rounded-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to launch your music NFTs?</h2>
            <p className="text-lg mb-8 max-w-xl mx-auto text-muted-foreground">
              Join MusicMoon today and start minting your music on the Solana blockchain.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="rounded-full px-8 bg-musicmoon text-background hover:bg-musicmoon/90">
                  Create Account
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button size="lg" variant="outline" className="rounded-full px-8 border-musicmoon text-musicmoon hover:bg-musicmoon/10">
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
