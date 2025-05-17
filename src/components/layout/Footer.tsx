
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/896a2a86-ba84-4f23-9d13-62f101838d70.png" 
                alt="MusicMoon Logo" 
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              The premier NFT marketplace for musicians and music collectors.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-musicmoon">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-musicmoon">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-musicmoon">
                <Github size={18} />
              </a>
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Marketplace</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/marketplace" className="text-sm text-muted-foreground hover:text-musicmoon">
                  All NFTs
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-musicmoon">
                  Top Artists
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-musicmoon">
                  New Releases
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-musicmoon">
                  Featured
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-musicmoon">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-musicmoon">
                  Solana Guide
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-musicmoon">
                  Artist Resources
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-musicmoon">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-musicmoon">
                  About
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-musicmoon">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-musicmoon">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-musicmoon">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} MusicMoon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
