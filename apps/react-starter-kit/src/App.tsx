import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import BlockDagInfo from "./features/BlockDagInfo";
import BalanceChecker from "./features/BalanceChecker";
import DaaScore from "./features/DaaScore";
import BlockAdded from "./features/BlockAdded";
import VirtualChainChanged from "./features/VirtualChainChanged";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { Menu } from "lucide-react";

const featureComponents: { [key: string]: React.FC } = {
  BlockDagInfo,
  BalanceChecker,
  DaaScore,
  BlockAdded,
  VirtualChainChanged,
};

function App() {
  const [selectedFeature, setSelectedFeature] =
    useState<string>("BlockDagInfo");

  const FeatureComponent = featureComponents[selectedFeature];

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-background text-foreground">
      <div className="hidden border-r bg-muted/40 md:block">
        <Sidebar onSelectFeature={setSelectedFeature} />
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <Sidebar onSelectFeature={setSelectedFeature} />
            </SheetContent>
          </Sheet>
          <Header />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {FeatureComponent ? (
            <FeatureComponent />
          ) : (
            <div>
              <h2 className="text-3xl">
                Welcome to the Kaspa React Starter Kit
              </h2>
              <p>Select a feature from the sidebar to get started.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
