import React, { useState, useEffect } from 'react';
import { WasteItemType } from '../pages/index';
import SpeechBubble from './SpeechBubble';

type WasteCategory = 'wet-waste' | 'dry-waste' | 'hazardous-waste' | 'sanitary-waste' | 'e-waste';

interface BinProps {
  category: WasteCategory;
  onDrop: (item: WasteItemType, binCategory: WasteCategory) => void;
  fillLevel: number;
  isCorrectBin: boolean;
  isTooltipActive: boolean;
  onTooltipToggle: (category: WasteCategory) => void;
  onBinClick: (category: WasteCategory) => void;
  isMobile: boolean;
}

const getBinColor = (category: WasteCategory): string => {
  switch(category) {
    case 'wet-waste': return 'rgba(0, 128, 0, 0.5)'; // Green
    case 'dry-waste': return 'rgba(0, 0, 255, 0.5)'; // Blue
    case 'hazardous-waste': return 'rgba(255, 0, 0, 0.5)'; // Red
    case 'sanitary-waste': return 'rgba(255, 165, 0, 0.5)'; // Orange
    case 'e-waste': return 'rgba(128, 0, 128, 0.5)'; // Purple
    default: return 'rgba(200, 200, 200, 0.5)'; // Grey
  }
};

const getBinDescription = (category: WasteCategory): string => {
  switch(category) {
    case 'wet-waste': return 'For biodegradable waste like food scraps and plant matter.';
    case 'dry-waste': return 'For recyclable materials like paper, plastic, and metal.';
    case 'hazardous-waste': return 'For dangerous materials like chemicals and batteries.';
    case 'sanitary-waste': return 'For personal hygiene products and medical waste.';
    case 'e-waste': return 'For electronic devices and components.';
    default: return 'Unknown waste category';
  }
};

const getRandomSpeechBubbleContent = (category: WasteCategory): string => {
  const contents = {
    'wet-waste': [
      "Composting this waste could feed a small garden for a month!",
      "Your banana peels could power a car for 1 km if converted to biofuel!",
      "If everyone composted, we'd reduce landfill waste by 30%!",
      "This waste can create enough compost to grow 50 tomatoes!",
      "Composting this bin saves as much CO2 as planting 5 trees!",
      "Your food scraps could generate enough electricity to charge 100 phones!",
      "This bin's contents could feed a colony of worms for a year!",
      "Composting this waste reduces methane emissions equal to taking 1 car off the road!",
      "Your wet waste could create soil rich enough to grow prize-winning pumpkins!",
      "If converted to biogas, this waste could cook 3 meals!"
    ],
    'dry-waste': [
      "Recycling 1 ton of paper saves 17 trees and 7,000 gallons of water!",
      "Your recycled plastic could make a trendy eco-friendly t-shirt!",
      "Recycling one aluminum can saves enough energy to run a TV for 3 hours!",
      "The energy saved from recycling one glass bottle can power a computer for 25 minutes!",
      "Recycling this bin could save enough energy to make 1,000 cups of coffee!",
      "Your recycled cardboard could become a cozy home for a shelter cat!",
      "Recycling this much plastic saves oil equivalent to a full tank of gas!",
      "The metal in this bin could be recycled into a shiny new bicycle!",
      "Your recycled paper could print enough books for a small library!",
      "Recycling this bin reduces CO2 emissions equal to planting 10 trees!"
    ],
    'hazardous-waste': [
      "Proper disposal of this waste prevents contamination of an Olympic-sized pool!",
      "One drop of motor oil can contaminate 1 million drops of water!",
      "Recycling one CFL bulb saves enough energy to light a room for 6 months!",
      "Proper disposal of this bin prevents toxins equal to 100 car exhausts!",
      "Your responsible disposal saves enough clean water for 1,000 people for a day!",
      "Recycling batteries from this bin could power a small village for a week!",
      "Proper e-waste disposal in this bin recovers gold equal to 5 wedding rings!",
      "Your hazardous waste management prevents soil contamination in an area as big as a football field!",
      "Recycling paint in this bin could repaint an entire classroom!",
      "Proper disposal here prevents chemicals from entering our food chain for generations!"
    ],
    'sanitary-waste': [
      "Proper disposal here prevents the spread of germs that could circle the globe twice!",
      "Your responsible action here protects water sources for 10,000 people!",
      "Correct sanitary waste disposal saves marine life in an area the size of 10 football fields!",
      "This bin's proper management prevents contamination equal to 100 swimming pools!",
      "Your action here stops pathogens that could affect a small town's population!",
      "Proper disposal in this bin protects soil quality for growing 1,000 trees!",
      "Managing this waste correctly prevents pollution equal to 50 car exhausts!",
      "Your responsible disposal here safeguards drinking water for an entire apartment block!",
      "Correct sanitary waste handling here protects wildlife in an area as big as Central Park!",
      "Proper disposal in this bin prevents the spread of antibiotic-resistant bacteria to 10,000 people!"
    ],
    'e-waste': [
      "Recycling one smartphone recovers enough gold to gild a wedding ring!",
      "Your e-waste recycling here saves energy equivalent to driving an electric car for 1,000 km!",
      "Proper disposal of this bin recovers rare earth metals to make 100 wind turbines!",
      "Recycling e-waste here prevents toxic leaching equivalent to 1,000 car batteries!",
      "Your responsible e-waste disposal saves water equal to 10,000 showers!",
      "This bin's contents could be recycled into 1,000 new circuit boards!",
      "Recycling e-waste here reduces CO2 emissions equal to planting a small forest!",
      "Your old gadgets here could be turned into critical parts for 50 solar panels!",
      "Proper e-waste disposal in this bin saves energy to power a school for a month!",
      "Recycling here recovers enough copper to wire 10 new homes!"
    ]
  };

  const categoryContents = contents[category];
  const randomIndex = Math.floor(Math.random() * categoryContents.length);
  return categoryContents[randomIndex];
};

const Bin: React.FC<BinProps> = ({ 
  category, 
  onDrop, 
  fillLevel, 
  isCorrectBin, 
  isTooltipActive, 
  onTooltipToggle,
  onBinClick,
  isMobile
}) => {
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [speechBubbleContent, setSpeechBubbleContent] = useState('');

  useEffect(() => {
    if ([30, 50, 70, 90].includes(fillLevel)) {
      const content = getRandomSpeechBubbleContent(category);
      setSpeechBubbleContent(content);
      setShowSpeechBubble(true);
      
      const timer = setTimeout(() => {
        setShowSpeechBubble(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [fillLevel, category]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData("text")) as WasteItemType;
    onDrop(item, category);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMobile) {
      onBinClick(category);
    } else {
      onTooltipToggle(category);
    }
  };

  const binColor = getBinColor(category);
  const binDescription = getBinDescription(category);

  return (
    <div className="bin-container" style={{ position: 'relative', display: 'inline-block' }}>
      {showSpeechBubble && (
        <SpeechBubble 
          message={speechBubbleContent} 
          position="top"
          large={false}
          rounded={true}
        />
      )}
      <div 
        className={`bin ${isCorrectBin ? 'correct-bin' : ''}`}
        style={{ 
          backgroundColor: binColor,
          position: 'relative',
          zIndex: 1
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="fill-level" style={{ height: `${fillLevel}%` }}></div>
        <div className="bin-label">{category.replace('-', ' ')}</div>
      </div>
      {isTooltipActive && !isMobile && (
        <div className="tooltip">
          <p>{binDescription}</p>
        </div>
      )}
    </div>
  );
};

export default Bin;
