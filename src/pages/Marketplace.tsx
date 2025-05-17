import { useState, useEffect } from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NFTCard from "@/components/ui/NFTCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { NFT } from "@/types";
import { Search, Filter, Music } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useNFT } from "@/hooks/useNFT";
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Marketplace = () => {
  const { toast } = useToast();
  const { fetchAllNFTs, loading: isLoading } = useNFT();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("recent");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10]);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const { publicKey, connected } = useWallet();
  const walletAddress = publicKey?.toBase58();
  
  // Fetch NFTs
  useEffect(() => {
    const loadNFTs = async () => {
      try {
        const allNFTs = await fetchAllNFTs();
        setNfts(allNFTs);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        toast({
          title: "Error",
          description: "Failed to load NFTs. Please try again later.",
          variant: "destructive",
        });
      }
    };
    
    loadNFTs();
  }, []);
  
  // Filter and sort NFTs
  const filteredNFTs = nfts
    .filter(nft => 
      (searchQuery === "" || 
        nft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.creator?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      ) &&
      (selectedCategory === null || nft.category === selectedCategory) &&
      (nft.price >= priceRange[0] && nft.price <= priceRange[1])
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'priceAsc':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        default:
          return 0;
      }
    });
  
  // Get unique categories from the actual NFT data
  const categories = Array.from(new Set(nfts.map(nft => nft.category)));
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4">
          {/* Marketplace Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3">NFT Marketplace</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover and collect unique music NFTs from artists around the world.
              Each piece is tokenized on the Solana blockchain.
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search by title, artist or description..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className={cn("gap-2 md:w-auto w-full", showFilters && "bg-muted")}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden md:inline">Filters</span>
                  <span className="md:hidden">Filters</span>
                </Button>
                
                <Select 
                  value={sortBy} 
                  onValueChange={setSortBy}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recently Added</SelectItem>
                    <SelectItem value="priceAsc">Price: Low to High</SelectItem>
                    <SelectItem value="priceDesc">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {showFilters && (
              <div className="p-4 bg-card rounded-lg border border-border mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Categories */}
                  <div>
                    <h3 className="font-medium mb-3 text-sm">Categories</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Button 
                          variant="ghost" 
                          className={cn(
                            "text-sm w-full justify-start h-8",
                            selectedCategory === null ? "text-primary" : "text-foreground"
                          )}
                          onClick={() => setSelectedCategory(null)}
                        >
                          All Categories
                        </Button>
                      </div>
                      {categories.map((category, index) => (
                        <div key={index} className="flex items-center">
                          <Button 
                            variant="ghost" 
                            className={cn(
                              "text-sm w-full justify-start h-8",
                              selectedCategory === category ? "text-primary" : "text-foreground"
                            )}
                            onClick={() => setSelectedCategory(category)}
                          >
                            {category}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Price Range */}
                  <div>
                    <h3 className="font-medium mb-3 text-sm">Price Range (SOL)</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Min: {priceRange[0]} SOL</span>
                        <span className="text-sm text-muted-foreground">Max: {priceRange[1]} SOL</span>
                      </div>
                      {/* Simple buttons for price ranges in this demo */}
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: "All", range: [0, 10] },
                          { label: "< 1 SOL", range: [0, 1] },
                          { label: "1-2 SOL", range: [1, 2] },
                          { label: "2-5 SOL", range: [2, 5] },
                          { label: "> 5 SOL", range: [5, 10] },
                        ].map((item, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant={priceRange[0] === item.range[0] && priceRange[1] === item.range[1] ? "default" : "outline"}
                            onClick={() => setPriceRange(item.range as [number, number])}
                          >
                            {item.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Misc Filters - Placeholder for demo */}
                  <div>
                    <h3 className="font-medium mb-3 text-sm">Other Filters</h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="py-2 text-sm">Artist Verification</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Button variant="ghost" className="text-sm w-full justify-start h-8">
                                All Artists
                              </Button>
                            </div>
                            <div className="flex items-center">
                              <Button variant="ghost" className="text-sm w-full justify-start h-8">
                                Verified Only
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger className="py-2 text-sm">Minting Date</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Button variant="ghost" className="text-sm w-full justify-start h-8">
                                All Time
                              </Button>
                            </div>
                            <div className="flex items-center">
                              <Button variant="ghost" className="text-sm w-full justify-start h-8">
                                Last 30 Days
                              </Button>
                            </div>
                            <div className="flex items-center">
                              <Button variant="ghost" className="text-sm w-full justify-start h-8">
                                Last 7 Days
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button 
                    variant="outline" 
                    className="mr-2"
                    onClick={() => {
                      setSelectedCategory(null);
                      setPriceRange([0, 10]);
                      setSearchQuery("");
                    }}
                  >
                    Reset Filters
                  </Button>
                  <Button onClick={() => setShowFilters(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* NFT Gallery */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="loader mb-4"></div>
              <p className="text-muted-foreground">Loading NFTs...</p>
            </div>
          ) : filteredNFTs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNFTs.map(nft => (
                <NFTCard key={nft.id} nft={nft} showBuyButton={true} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Music className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No NFTs found</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                We couldn't find any NFTs matching your criteria. Try adjusting your filters or search term.
              </p>
              <Button variant="outline" onClick={() => {
                setSelectedCategory(null);
                setPriceRange([0, 10]);
                setSearchQuery("");
              }}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Marketplace;
