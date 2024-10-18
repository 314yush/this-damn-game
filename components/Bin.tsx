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
      "Your food scraps could power a local community garden for a week!",
      "Composting this bin reduces greenhouse gases equal to taking 5 cars off the road for a day!",
      "This waste could produce enough natural fertilizer for 100 houseplants!",
      "Composting at this rate could save your city $1000 in landfill costs annually!",
      "Your wet waste could generate enough biogas to cook meals for a family of four for a month!",
      "This bin's contents could create soil rich enough to grow 200 kg of organic vegetables!",
      "Composting this waste saves water equivalent to 500 showers!",
      "Your food scraps could feed a colony of beneficial insects, boosting local biodiversity!",
      "This compost could capture as much carbon as 10 mature trees in a year!",
      "Your wet waste could produce enough energy to charge your phone for 6 months!"
    ],
    'dry-waste': [
      "Recycling this bin saves energy equivalent to powering your home for two weeks!",
      "Your efforts here conserve water equal to 1000 loads of laundry!",
      "This recycled material could be transformed into playground equipment for 50 children!",
      "Recycling at this rate reduces CO2 emissions equal to planting 20 trees each month!",
      "Your dry waste could be upcycled into fashionable accessories for 100 people!",
      "This bin's contents could be turned into building materials for a small eco-home!",
      "Recycling this much saves oil equivalent to driving an electric car for 1000 km!",
      "Your efforts preserve natural habitats the size of two football fields!",
      "This recycled material could create 1000 reusable shopping bags, replacing single-use plastics!",
      "Recycling at this level saves enough energy to brew coffee for your entire office for a year!"
    ],
    'hazardous-waste': [
      "Proper disposal here prevents contamination of drinking water for 10,000 people!",
      "Your responsible action protects soil quality in an area as large as 5 city blocks!",
      "This bin's contents, if recycled, could recover metals to make 100 new smartphones!",
      "Correct disposal here prevents air pollution equivalent to 1000 car exhausts for a day!",
      "Your efforts safeguard local wildlife habitats covering an area of 10 football fields!",
      "Proper management of this waste prevents acid rain that could damage 1000 trees!",
      "Recycling batteries from this bin could power an electric car for a 500 km journey!",
      "Your responsible disposal here protects groundwater reserves for future generations!",
      "This bin's proper handling prevents toxic chemicals from entering the food chain of 100,000 organisms!",
      "Correct disposal here saves marine life in an area equivalent to 20 Olympic-sized swimming pools!"
    ],
    'sanitary-waste': [
      "Your responsible action here prevents the spread of harmful bacteria to 1000 people!",
      "Proper disposal in this bin protects water quality for an entire neighborhood!",
      "This waste management safeguards soil health in local parks and playgrounds!",
      "Your efforts here prevent contamination that could affect local food production!",
      "Correct sanitary waste handling protects the health of sanitation workers in your community!",
      "This bin's proper management reduces the risk of waterborne diseases in your area!",
      "Your responsible disposal here helps maintain hygiene standards in public spaces!",
      "Proper handling of this waste prevents the spread of antibiotic-resistant bacteria!",
      "This bin's contents, when properly treated, can be safely returned to the environment!",
      "Your efforts here contribute to maintaining clean and safe recreational water areas!"
    ],
    'e-waste': [
      "Recycling this bin recovers enough precious metals to make 50 new circuit boards!",
      "Your e-waste recycling here prevents toxic leaching equivalent to 100 car batteries!",
      "This bin's contents could be transformed into parts for 10 new electric vehicles!",
      "Proper disposal here recovers rare earth elements crucial for 500 wind turbine magnets!",
      "Your responsible e-waste management saves energy to power a school for a week!",
      "Recycling at this rate reduces mining impact equivalent to preserving a hectare of land!",
      "This e-waste could be upcycled into artistic installations for public spaces!",
      "Your efforts here recover enough copper to provide electricity to 50 homes!",
      "Proper e-waste handling prevents water pollution equivalent to 10,000 plastic bottles!",
      "Recycling this bin reduces CO2 emissions equal to planting 100 trees in urban areas!"
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
