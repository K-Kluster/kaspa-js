import React from "react";
import { Button } from "@/components/ui/Button";

interface SidebarProps {
  onSelectFeature: (feature: string) => void;
}

const features = [
  "BlockDagInfo",
  "BalanceChecker",
  "DaaScore",
  "BlockAdded",
  "VirtualChainChanged",
];

const Sidebar: React.FC<SidebarProps> = ({ onSelectFeature }) => {
  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <a href="/" className="flex items-center gap-2 font-semibold">
          <span className="">Kaspa Kit</span>
        </a>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {features.map((feature) => (
            <Button
              key={feature}
              variant="ghost"
              className="justify-start"
              onClick={() => onSelectFeature(feature)}
            >
              {feature}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
