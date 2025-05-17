
import React from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MintHeader from "@/components/mint/MintHeader";
import MintForm from "@/components/mint/MintForm";

const Mint = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-4xl px-4">
          <MintHeader />
          <MintForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Mint;
