import React, { useState, useEffect, useCallback } from "react";
import WasteItem from "../components/WasteItem";
import Bin from "../components/Bin";
import WinnerDialog from "../components/WinnerDialog";
import GameOverDialog from "../components/GameOverDialog";
import { saveUserScore, saveFarcasterUsername } from "../lib/userDataService";
import {
  usePrivy,
} from "@privy-io/react-auth";
import { Leaderboard } from '../components/Leaderboard'
import { FaInfoCircle } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import styles from './Home.module.css'; // Make sure to create this CSS module file
import HowToPlayDialog from '../components/HowToPlayDialog';

// Define difficulty levels
export type Difficulty = 'Easiest' | 'Easy' | 'Medium' | 'Difficult' | 'Most Difficult';

// Update WasteItemType to include difficulty
export interface WasteItemType {
  name: string;
  category: string;
  difficulty: Difficulty;
}

const wetWasteItems: WasteItemType[] = [
  // wet waste
  // Easiest
  { name: "Banana peel", category: "wet-waste", difficulty: "Easiest" },
  { name: "Tea leaves", category: "wet-waste", difficulty: "Easiest" },
  { name: "Vegetable peels", category: "wet-waste", difficulty: "Easiest" },
  { name: "Mango seed", category: "wet-waste", difficulty: "Easiest" },
  { name: "Leftover rice", category: "wet-waste", difficulty: "Easiest" },
  { name: "Used tea bags", category: "wet-waste", difficulty: "Easiest" },
  { name: "Coconut husk", category: "wet-waste", difficulty: "Easiest" },
  { name: "Wilted marigold flowers", category: "wet-waste", difficulty: "Easiest" },
  { name: "Curry leaves", category: "wet-waste", difficulty: "Easiest" },
  { name: "Lemon rinds", category: "wet-waste", difficulty: "Easiest" },

  // Easy
  { name: "Leftover dal", category: "wet-waste", difficulty: "Easy"  },
  { name: "Spoiled lassi", category: "wet-waste", difficulty: "Easy" },
  { name: "Rotten tomatoes", category: "wet-waste", difficulty: "Easy" },
  { name: "Used paan leaves", category: "wet-waste", difficulty: "Easy" },
  { name: "Wet newspapers", category: "wet-waste", difficulty: "Easy" },
  { name: "Tender coconut remains", category: "wet-waste", difficulty: "Easy" },
  { name: "Sugarcane bagasse", category: "wet-waste", difficulty: "Easy" },
  { name: "Stale flower garlands", category: "wet-waste", difficulty: "Easy" },
  { name: "Used jasmine strings", category: "wet-waste", difficulty: "Easy" },
  { name: "Soiled paper food trays", category: "wet-waste", difficulty: "Easy" },

  // Medium
  { name: "Fish bones from fish fry", category: "wet-waste", difficulty: "Medium" },
  { name: "Chicken bones from biryani", category: "wet-waste", difficulty: "Medium" },
  { name: "Spoiled curd", category: "wet-waste", difficulty: "Medium" },
  { name: "Moldy chapati", category: "wet-waste", difficulty: "Medium" },
  { name: "Wet paper dosa", category: "wet-waste", difficulty: "Medium" },
  { name: "Used betel nut", category: "wet-waste", difficulty: "Medium" },
  { name: "Coconut kernel", category: "wet-waste", difficulty: "Medium" },
  { name: "Soiled cardboard chai cups", category: "wet-waste", difficulty: "Medium" },
  { name: "Expired atta (wheat flour)", category: "wet-waste", difficulty: "Medium" },
  { name: "Used agarbatti (incense sticks)", category: "wet-waste", difficulty: "Medium" },

  // Difficult
  { name: "Expired mango pickle", category: "wet-waste", difficulty: "Difficult" },
  { name: "Used tea strainer contents", category: "wet-waste", difficulty: "Difficult" },
  { name: "Spoiled paneer", category: "wet-waste", difficulty: "Difficult" },
  { name: "Rancid ghee", category: "wet-waste", difficulty: "Difficult" },
  { name: "Wet supari (areca nut)", category: "wet-waste", difficulty: "Difficult" },
  { name: "Used mehendi (henna) paste", category: "wet-waste", difficulty: "Difficult" },
  { name: "Soiled banana leaf plates", category: "wet-waste", difficulty: "Difficult" },
  { name: "Bhutta (corn) cobs", category: "wet-waste", difficulty: "Difficult" },
  { name: "Expired coconut chutney", category: "wet-waste", difficulty: "Difficult" },
  { name: "Used cotton wicks from oil lamps", category: "wet-waste", difficulty: "Difficult" },

  // Most Difficult
  { name: "Spoiled soya chunks", category: "wet-waste", difficulty: "Most Difficult" },
  { name: "Wet kumkum powder", category: "wet-waste", difficulty: "Most Difficult" },
  { name: "Expired grated coconut", category: "wet-waste", difficulty: "Most Difficult" },
  { name: "Used clay for Ganesh idols", category: "wet-waste", difficulty: "Most Difficult" },
  { name: "Wet sandal (chandan) paste", category: "wet-waste", difficulty: "Most Difficult" },
  { name: "Biodegradable gulal from Holi", category: "wet-waste", difficulty: "Most Difficult" },
  { name: "Expired liquid jaggery", category: "wet-waste", difficulty: "Most Difficult" },
  { name: "Used natural sindhoor", category: "wet-waste", difficulty: "Most Difficult" },
  { name: "Expired liquid ayurvedic tonics", category: "wet-waste", difficulty: "Most Difficult" },
  { name: "Wet floral rangoli remains", category: "wet-waste", difficulty: "Most Difficult" },
  // dry waste
  // Easiest
  { name: "Old newspaper", category: "dry-waste", difficulty: "Easiest" },
  { name: "Empty plastic water bottle", category: "dry-waste", difficulty: "Easiest" },
  { name: "Cardboard box", category: "dry-waste", difficulty: "Easiest" },
  { name: "Used paper envelope", category: "dry-waste", difficulty: "Easiest" },
  { name: "Empty chips packet", category: "dry-waste", difficulty: "Easiest" },
  { name: "Plastic carry bag", category: "dry-waste", difficulty: "Easiest" },
  { name: "Used paper ticket", category: "dry-waste", difficulty: "Easiest" },
  { name: "Empty biscuit wrapper", category: "dry-waste", difficulty: "Easiest" },
  { name: "Broken pencil", category: "dry-waste", difficulty: "Easiest" },
  { name: "Used paper napkin", category: "dry-waste", difficulty: "Easiest" },

  // Easy
  { name: "Empty tetra pak of juice", category: "dry-waste", difficulty: "Easy" },
  { name: "Plastic bottle cap", category: "dry-waste", difficulty: "Easy" },
  { name: "Old magazine", category: "dry-waste", difficulty: "Easy" },
  { name: "Empty ghee container", category: "dry-waste", difficulty: "Easy" },
  { name: "Broken plastic comb", category: "dry-waste", difficulty: "Easy" },
  { name: "Used paper cup", category: "dry-waste", difficulty: "Easy" },
  { name: "Empty plastic milk packet", category: "dry-waste", difficulty: "Easy" },
  { name: "Discarded wedding card", category: "dry-waste", difficulty: "Easy" },
  { name: "Empty glass pickle jar", category: "dry-waste", difficulty: "Easy" },
  { name: "Used paper plate", category: "dry-waste", difficulty: "Easy" },

  // Medium
  { name: "Empty shampoo bottle", category: "dry-waste", difficulty: "Medium" },
  { name: "Broken plastic bucket", category: "dry-waste", difficulty: "Medium" },
  { name: "Old textbook", category: "dry-waste", difficulty: "Medium" },
  { name: "Empty aluminium foil roll", category: "dry-waste", difficulty: "Medium" },
  { name: "Discarded plastic toy", category: "dry-waste", difficulty: "Medium" },
  { name: "Used ball pen", category: "dry-waste", difficulty: "Medium" },
  { name: "Empty packet of detergent", category: "dry-waste", difficulty: "Medium" },
  { name: "Broken plastic hanger", category: "dry-waste", difficulty: "Medium" },
  { name: "Empty tin of cooking oil", category: "dry-waste", difficulty: "Medium" },
  { name: "Used paper calendar", category: "dry-waste", difficulty: "Medium" },

  // Difficult
  { name: "Empty toothpaste tube", category: "dry-waste", difficulty: "Difficult" },
  { name: "Broken ceramic cup", category: "dry-waste", difficulty: "Difficult" },
  { name: "Used disposable plastic cutlery", category: "dry-waste", difficulty: "Difficult" },
  { name: "Empty plastic container of spices", category: "dry-waste", difficulty: "Difficult" },
  { name: "Discarded CD/DVD", category: "dry-waste", difficulty: "Difficult" },
  { name: "Empty blister pack of tablets", category: "dry-waste", difficulty: "Difficult" },
  { name: "Broken glass bangle", category: "dry-waste", difficulty: "Difficult" },
  { name: "Used tent card from restaurant", category: "dry-waste", difficulty: "Difficult" },
  { name: "Empty aerosol spray can", category: "dry-waste", difficulty: "Difficult" },
  { name: "Discarded plastic folder", category: "dry-waste", difficulty: "Difficult" },

  // Most Difficult
  { name: "Empty packet of sindoor", category: "dry-waste", difficulty: "Most Difficult"   },
  { name: "Broken clay diya", category: "dry-waste", difficulty: "Most Difficult" },
  { name: "Used agarbatti (incense) stand", category: "dry-waste", difficulty: "Most Difficult" },
  { name: "Empty plastic container of kumkum", category: "dry-waste", difficulty: "Most Difficult" },
  { name: "Discarded rakhi (non-biodegradable)", category: "dry-waste", difficulty: "Most Difficult" },
  { name: "Empty foil packet of pan masala", category: "dry-waste", difficulty: "Most Difficult" },
  { name: "Broken plastic bindi box", category: "dry-waste", difficulty: "Most Difficult" },
  { name: "Used thermocol plate", category: "dry-waste", difficulty: "Most Difficult" },
  { name: "Empty packet of pooja items", category: "dry-waste", difficulty: "Most Difficult" },
  { name: "Discarded plastic garland", category: "dry-waste", difficulty: "Most Difficult" },
  // hazardous waste
  // Easiest
  { name: "Mosquito spray", category: "hazardous-waste", difficulty: "Easiest" },
  { name: "Tube light", category: "hazardous-waste", difficulty: "Easiest" },
  { name: "Rat poison", category: "hazardous-waste", difficulty: "Easiest" },
  { name: "Old painkillers", category: "hazardous-waste", difficulty: "Easiest" },
  { name: "Mosquito coil", category: "hazardous-waste", difficulty: "Easiest" },
  { name: "Roach spray", category: "hazardous-waste", difficulty: "Easiest" },
  { name: "Broken CFL", category: "hazardous-waste", difficulty: "Easiest" },
  { name: "Car battery", category: "hazardous-waste", difficulty: "Easiest" },

  // Easy
  { name: "Phenyl bottle", category: "hazardous-waste", difficulty: "Easy" },
  { name: "Paint brush", category: "hazardous-waste", difficulty: "Easy" },
  { name: "Kerosene can", category: "hazardous-waste", difficulty: "Easy" },
  { name: "Old cough syrup", category: "hazardous-waste", difficulty: "Easy" },
  { name: "Dandruff shampoo", category: "hazardous-waste", difficulty: "Easy" },
  { name: "Spray paint", category: "hazardous-waste", difficulty: "Easy" },
  { name: "Hair dye", category: "hazardous-waste", difficulty: "Easy" },
  { name: "Phone battery", category: "hazardous-waste", difficulty: "Easy" },

  // Medium
  { name: "Bleach bottle", category: "hazardous-waste", difficulty: "Medium" },
  { name: "Engine oil", category: "hazardous-waste", difficulty: "Medium" },
  { name: "Old insecticide", category: "hazardous-waste", difficulty: "Medium" },
  { name: "Nail polish remover", category: "hazardous-waste", difficulty: "Medium" },
  { name: "Mercury thermometer", category: "hazardous-waste", difficulty: "Medium" },
  { name: "Fertilizer pack", category: "hazardous-waste", difficulty: "Medium" },
  { name: "Toilet cleaner", category: "hazardous-waste", difficulty: "Medium" },
  { name: "Car air filter", category: "hazardous-waste", difficulty: "Medium" },

  // Difficult
  { name: "Pesticide can", category: "hazardous-waste", difficulty: "Difficult" },
  { name: "Inverter battery", category: "hazardous-waste", difficulty: "Difficult" },
  { name: "Industrial glue", category: "hazardous-waste", difficulty: "Difficult" },
  { name: "Wood preservative", category: "hazardous-waste", difficulty: "Difficult" },
  { name: "Photo chemicals", category: "hazardous-waste", difficulty: "Difficult" },
  { name: "Pool chemicals", category: "hazardous-waste", difficulty: "Difficult" },
  { name: "Paint thinner", category: "hazardous-waste", difficulty: "Difficult" },
  { name: "Oil filter", category: "hazardous-waste", difficulty: "Difficult" },

  // Most Difficult
  { name: "Asbestos sheets", category: "hazardous-waste", difficulty: "Most Difficult" },
  { name: "Mercury lamp", category: "hazardous-waste", difficulty: "Most Difficult" },
  { name: "Acid cleaner", category: "hazardous-waste", difficulty: "Most Difficult" },
  { name: "Lab glassware", category: "hazardous-waste", difficulty: "Most Difficult" },
  { name: "Industrial solvent", category: "hazardous-waste", difficulty: "Most Difficult" },
  { name: "Medical radiation", category: "hazardous-waste", difficulty: "Most Difficult" },
  { name: "PCB capacitors", category: "hazardous-waste", difficulty: "Most Difficult" },
  { name: "Industrial pesticide", category: "hazardous-waste", difficulty: "Most Difficult" },
  // Sanitary waste 
  // Easiest
  { name: "Used tissue", category: "sanitary-waste", difficulty: "Easiest" },
  { name: "Cotton swab", category: "sanitary-waste", difficulty: "Easiest" },
  { name: "Band-aid", category: "sanitary-waste", difficulty: "Easiest" },
  { name: "Disposable mask", category: "sanitary-waste", difficulty: "Easiest" },
  { name: "Used napkin", category: "sanitary-waste", difficulty: "Easiest" },
  { name: "Dental floss", category: "sanitary-waste", difficulty: "Easiest" },
  { name: "Cotton balls", category: "sanitary-waste", difficulty: "Easiest" },
  { name: "Face wipes", category: "sanitary-waste", difficulty: "Easiest" },
  { name: "Paper towel", category: "sanitary-waste", difficulty: "Easiest" },
  { name: "Disposable gloves", category: "sanitary-waste", difficulty: "Easiest" },

  // Easy
  { name: "Sanitary pad", category: "sanitary-waste", difficulty: "Easy" },
  { name: "Diaper", category: "sanitary-waste", difficulty: "Easy" },
  { name: "Shaving razor", category: "sanitary-waste", difficulty: "Easy" },
  { name: "Nose tissue", category: "sanitary-waste", difficulty: "Easy" },
  { name: "Makeup remover pad", category: "sanitary-waste", difficulty: "Easy" },
  { name: "Nail file", category: "sanitary-waste", difficulty: "Easy" },
  { name: "Toilet seat cover", category: "sanitary-waste", difficulty: "Easy" },
  { name: "Disposable comb", category: "sanitary-waste", difficulty: "Easy" },
  { name: "Earbuds", category: "sanitary-waste", difficulty: "Easy" },
  { name: "Sanitizer wipe", category: "sanitary-waste", difficulty: "Easy" },

  // Medium
  { name: "Tampon", category: "sanitary-waste", difficulty: "Medium" },
  { name: "Bandage", category: "sanitary-waste", difficulty: "Medium" },
  { name: "Contact lenses", category: "sanitary-waste", difficulty: "Medium" },
  { name: "Wax strips", category: "sanitary-waste", difficulty: "Medium" },
  { name: "Disposable underwear", category: "sanitary-waste", difficulty: "Medium" },
  { name: "Menstrual cup", category: "sanitary-waste", difficulty: "Medium" },
  { name: "Panty liner", category: "sanitary-waste", difficulty: "Medium" },
  { name: "Expired condom", category: "sanitary-waste", difficulty: "Medium" },
  { name: "Used toothbrush", category: "sanitary-waste", difficulty: "Medium" },
  { name: "Disposable razor", category: "sanitary-waste", difficulty: "Medium" },

  // Difficult
  { name: "Hair removal cream", category: "sanitary-waste", difficulty: "Difficult" },
  { name: "Incontinence pad", category: "sanitary-waste", difficulty: "Difficult" },
  { name: "Tongue cleaner", category: "sanitary-waste", difficulty: "Difficult" },
  { name: "Nail clippings", category: "sanitary-waste", difficulty: "Difficult" },
  { name: "Used lice comb", category: "sanitary-waste", difficulty: "Difficult" },
  { name: "Expired sunscreen", category: "sanitary-waste", difficulty: "Difficult" },
  { name: "Used lip balm", category: "sanitary-waste", difficulty: "Difficult" },
  { name: "Old loofah", category: "sanitary-waste", difficulty: "Difficult" },
  { name: "Disposable enema", category: "sanitary-waste", difficulty: "Difficult" },
  { name: "Expired eye drops", category: "sanitary-waste", difficulty: "Difficult" },

  // Most Difficult
  { name: "Colostomy bag", category: "sanitary-waste", difficulty: "Most Difficult" },
  { name: "Insulin syringe", category: "sanitary-waste", difficulty: "Most Difficult" },
  { name: "Wound dressing", category: "sanitary-waste", difficulty: "Most Difficult" },
  { name: "Expired cosmetics", category: "sanitary-waste", difficulty: "Most Difficult" },
  { name: "Blood glucose strip", category: "sanitary-waste", difficulty: "Most Difficult" },
  { name: "Intrauterine device", category: "sanitary-waste", difficulty: "Most Difficult" },
  { name: "Catheter bag", category: "sanitary-waste", difficulty: "Most Difficult" },
  { name: "Expired ointment", category: "sanitary-waste", difficulty: "Most Difficult" },
  { name: "Used inhaler", category: "sanitary-waste", difficulty: "Most Difficult" },
  { name: "Expired birth control", category: "sanitary-waste", difficulty: "Most Difficult" },
  { name: "Denture adhesive", category: "sanitary-waste", difficulty: "Most Difficult" },
  // e-waste
  // Easiest
  { name: "Old phone", category: "e-waste", difficulty: "Easiest" },
  { name: "Broken earphones", category: "e-waste", difficulty: "Easiest" },
  { name: "USB cable", category: "e-waste", difficulty: "Easiest" },
  { name: "Dead batteries", category: "e-waste", difficulty: "Easiest" },
  { name: "Old charger", category: "e-waste", difficulty: "Easiest" },
  { name: "Burnt bulb", category: "e-waste", difficulty: "Easiest" },
  { name: "Broken mouse", category: "e-waste", difficulty: "Easiest" },
  { name: "Old keyboard", category: "e-waste", difficulty: "Easiest" },
  { name: "Remote control", category: "e-waste", difficulty: "Easiest" },
  { name: "Memory card", category: "e-waste", difficulty: "Easiest" },

  // Easy
  { name: "Outdated laptop", category: "e-waste", difficulty: "Easy" },
  { name: "Old tablet", category: "e-waste", difficulty: "Easy" },
  { name: "Broken printer", category: "e-waste", difficulty: "Easy" },
  { name: "CRT monitor", category: "e-waste", difficulty: "Easy" },
  { name: "DVD player", category: "e-waste", difficulty: "Easy" },
  { name: "Old digital watch", category: "e-waste", difficulty: "Easy" },
  { name: "Broken calculator", category: "e-waste", difficulty: "Easy" },
  { name: "Electric kettle", category: "e-waste", difficulty: "Easy" },
  { name: "Old power bank", category: "e-waste", difficulty: "Easy" },
  { name: "Broken hair dryer", category: "e-waste", difficulty: "Easy" },

  // Medium
  { name: "Old TV set", category: "e-waste", difficulty: "Medium" },
  { name: "Broken microwave", category: "e-waste", difficulty: "Medium" },
  { name: "Old refrigerator", category: "e-waste", difficulty: "Medium" },
  { name: "Broken AC", category: "e-waste", difficulty: "Medium" },
  { name: "Old washing machine", category: "e-waste", difficulty: "Medium" },
  { name: "Broken mixer grinder", category: "e-waste", difficulty: "Medium" },
  { name: "Old desktop PC", category: "e-waste", difficulty: "Medium" },
  { name: "Broken table fan", category: "e-waste", difficulty: "Medium" },
  { name: "Old music system", category: "e-waste", difficulty: "Medium" },
  { name: "Broken vacuum cleaner", category: "e-waste", difficulty: "Medium" },

  // Difficult
  { name: "Old CCTV camera", category: "e-waste", difficulty: "Difficult" },
  { name: "Broken video camera", category: "e-waste", difficulty: "Difficult" },
  { name: "Old fax machine", category: "e-waste", difficulty: "Difficult" },
  { name: "Broken treadmill", category: "e-waste", difficulty: "Difficult" },
  { name: "Old inverter", category: "e-waste", difficulty: "Difficult" },
  { name: "Broken UPS", category: "e-waste", difficulty: "Difficult" },
  { name: "Old projector", category: "e-waste", difficulty: "Difficult" },
  { name: "Broken air purifier", category: "e-waste", difficulty: "Difficult" },
  { name: "Old scanner", category: "e-waste", difficulty: "Difficult" },
  { name: "Broken water purifier", category: "e-waste", difficulty: "Difficult" },

  // Most Difficult
  { name: "Old solar inverter", category: "e-waste", difficulty: "Most Difficult" },
  { name: "Broken ECG machine", category: "e-waste", difficulty: "Most Difficult" },
  { name: "Old server rack", category: "e-waste", difficulty: "Most Difficult" },
  { name: "Broken ATM machine", category: "e-waste", difficulty: "Most Difficult" },
  { name: "Old ticket machine", category: "e-waste", difficulty: "Most Difficult" },
  { name: "Broken X-ray machine", category: "e-waste", difficulty: "Most Difficult" },
  { name: "Old electric car parts", category: "e-waste", difficulty: "Most Difficult" },
  { name: "Broken 3D printer", category: "e-waste", difficulty: "Most Difficult" },
  { name: "Old EV charging station", category: "e-waste", difficulty: "Most Difficult" },
  { name: "Broken smart board", category: "e-waste", difficulty: "Most Difficult" }
  ];

// Similarly, create arrays for other waste categories (dry-waste, hazardous-waste, etc.)
// const dryWasteItems: WasteItemType[] = [ ... ];
// const hazardousWasteItems: WasteItemType[] = [ ... ];
// ...

// Combine all waste items
const allWasteItems: WasteItemType[] = [
  ...wetWasteItems,
  // ...dryWasteItems,
  // ...hazardousWasteItems,
  // ...
];

type WasteCategory = 'wet-waste' | 'dry-waste' | 'hazardous-waste' | 'sanitary-waste' | 'e-waste';

const categories: WasteCategory[] = [
  "wet-waste",
  "dry-waste",
  "hazardous-waste",
  "sanitary-waste",
  "e-waste",
];


export default function Home() {
  const [currentPage, setCurrentPage] = useState<string>('play');
  const [currentItem, setCurrentItem] = useState<WasteItemType | null>(null);
  const [score, setScore] = useState<number>(0);
  const [binLevels, setBinLevels] = useState<Record<string, number>>({
    "wet-waste": 0,
    "dry-waste": 0,
    "hazardous-waste": 0,
    "sanitary-waste": 0,
    "e-waste": 0,
  });
  const [availableItems, setAvailableItems] = useState<WasteItemType[]>([
    ...allWasteItems,
  ]);
  const [correctBin, setCorrectBin] = useState<string | null>(null);
  const [showWinnerDialog, setShowWinnerDialog] = useState<boolean>(false);
  const [completedBin, setCompletedBin] = useState<string | null>(null);
  const [hasShownDialog, setHasShownDialog] = useState(false);
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);

  const { authenticated, login, logout, user } = usePrivy();

  const [isGuestMode, setIsGuestMode] = useState(false);

  // Add this state near your other state declarations
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('Easiest');
  const [usedItems, setUsedItems] = useState<string[]>([]);

  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const enableGuestMode = () => {
    setIsGuestMode(true);
  };

  useEffect(() => {
    selectRandomItem();
  }, []);

  useEffect(() => {
    console.log("Auth state:", { authenticated, user });
  }, [authenticated, user]);

  const getNextItem = useCallback(() => {
    const difficultyLevels: Difficulty[] = ['Easiest', 'Easy', 'Medium', 'Difficult', 'Most Difficult'];
    const currentDifficultyIndex = difficultyLevels.indexOf(currentDifficulty);

    let itemsForCurrentDifficulty = availableItems.filter(item => 
      difficultyLevels.indexOf(item.difficulty) <= currentDifficultyIndex
    );

    if (itemsForCurrentDifficulty.length === 0) {
      if (currentDifficultyIndex < difficultyLevels.length - 1) {
        setCurrentDifficulty(difficultyLevels[currentDifficultyIndex + 1]);
        return getNextItem(); // Recursively call to get next item at new difficulty
      } else {
        // All items have been used, you might want to reset the game or show a completion message
        return null;
      }
    }

    const randomIndex = Math.floor(Math.random() * itemsForCurrentDifficulty.length);
    const selectedItem = itemsForCurrentDifficulty[randomIndex];

    // Remove the selected item from available items
    setAvailableItems(prev => prev.filter(item => item.name !== selectedItem.name));

    return selectedItem;
  }, [currentDifficulty, availableItems]);

  const selectRandomItem = () => {
    const newItem = getNextItem();
    if (newItem) {
      setCurrentItem(newItem);
    } else {
      // Handle game completion
      setShowGameOverDialog(true);
    }
  };

  const handleDrop = async (item: WasteItemType, binCategory: string) => {
    if (item.category === binCategory) {
      const newLevel = Math.min(binLevels[binCategory] + 10, 100);
      setBinLevels((prev) => ({
        ...prev,
        [binCategory]: newLevel,
      }));
      const newScore = score + 1;
      setScore(newScore);

      if (newLevel === 100 && !hasShownDialog) {
        setCompletedBin(binCategory);
        setShowWinnerDialog(true);
        setHasShownDialog(true);
        
        // Save the score when a bin is completed
        if (authenticated && !isGuestMode && user?.wallet?.address) {
          try {
            const response = await fetch('/api/updateUserScore', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: user.wallet.address,
                score: score,
                farcasterUsername: user?.farcaster?.username || null,
              }),
            });
            if (!response.ok) {
              throw new Error('Failed to update score');
            }
          } catch (error) {
            console.error('Error saving score:', error);
          }
        }
      } 
      
      selectRandomItem();
    } else {
      setCorrectBin(item.category);
      setShowGameOverDialog(true);
      
      // Save the score when the game ends
      if (authenticated && !isGuestMode && user?.wallet?.address) {
        try {
          const response = await fetch('/api/updateScore', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.wallet.address,
              score: score,
              farcasterUsername: user?.farcaster?.username || null,
            }),
          });
          if (!response.ok) {
            throw new Error('Failed to update score');
          }
        } catch (error) {
          console.error('Error saving score:', error);
        }
      }
    }
  };

  const handleTouchDrop = (item: WasteItemType, x: number, y: number) => {
    const dropTarget = document.elementFromPoint(x, y);
    const binCategory = dropTarget?.closest('.bin')?.getAttribute('data-category');
    if (binCategory) {
      handleDrop(item, binCategory as WasteCategory);
    }
  };

  const handleBinClick = (binCategory: string) => {
    if (currentItem) {
      handleDrop(currentItem, binCategory);
    }
  };

  const handleContinuePlaying = () => {
    setShowWinnerDialog(false);
    selectRandomItem();
  };

  const handleRestartGame = () => {
    setBinLevels({
      "wet-waste": 0,
      "dry-waste": 0,
      "hazardous-waste": 0,
      "sanitary-waste": 0,
      "e-waste": 0,
    });
    setScore(0);
    setAvailableItems([...allWasteItems]);
    setCorrectBin(null);
    setShowWinnerDialog(false);
    setCompletedBin(null);
    setHasShownDialog(false);
    setShowGameOverDialog(false);
    setCurrentDifficulty('Easiest');
    setUsedItems([]);
    selectRandomItem();
  };

  // Add this function to handle tooltip toggling
  const handleTooltipToggle = useCallback((binCategory: string) => {
    setActiveTooltip(prev => prev === binCategory ? null : binCategory);
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (!(event.target as Element).closest('.bin-wrapper')) {
      setActiveTooltip(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleClickOutside]);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (authenticated && user?.wallet?.address && user?.farcaster?.username) {
      saveFarcasterUsername(user.wallet.address, user.farcaster.username)
    }
  }, [authenticated, user])

  const updateGuestMode = (newGuestMode: boolean) => {
    setIsGuestMode(newGuestMode);
  };

  return (
    <>
      <div className='game-background'></div>
      <div className='page-container'>
        {currentPage === 'play' && (
          <div className='game-container'>
            <h1 className='game-title'>
              How Wasted Are You?!
              <span className="info-icon" onClick={() => setShowHowToPlay(true)}>
                <FaInfoCircle className="icon-small" />
              </span>
            </h1>

            <HowToPlayDialog isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} />

            <div className='wallet-button-container'>
              {!authenticated && !isGuestMode && (
                <>
                  <button className={`${styles.smallGameButton} ${styles.green}`} onClick={login}>Login</button>
                  <button className={`${styles.smallGameButton} ${styles.orange}`} onClick={enableGuestMode}>Play as Guest</button>
                </>
              )}
              {authenticated && (
                <>
                  <button className={`${styles.smallGameButton} ${styles.red}`} onClick={logout}>Logout</button>
                  <div>{user?.farcaster?.displayName}</div>
                </>
              )}
            </div>

            {(authenticated || isGuestMode) ? (
              <>
                <div className='score'>Score: {score}</div>
                {currentItem && (
                  <WasteItem {...currentItem} onTouchDrop={(item, x, y) => {
                    const dropTarget = document.elementFromPoint(x, y);
                    const binCategory = dropTarget?.closest('.bin')?.getAttribute('data-category');
                    if (binCategory) {
                      handleDrop(item, binCategory as WasteCategory);
                    }
                  }} />
                )}
                <div className='bins-container'>
                  {categories.map((category) => (
                    <Bin
                      key={category}
                      category={category}
                      onDrop={handleDrop}
                      fillLevel={binLevels[category]}
                      isCorrectBin={correctBin === category}
                      isTooltipActive={activeTooltip === category}
                      onTooltipToggle={handleTooltipToggle}
                    />
                  ))}
                </div>

                {showGameOverDialog && (
                  <GameOverDialog
                    score={score}
                    correctBin={correctBin}
                    onPlayAgain={handleRestartGame}
                    isGuestMode={isGuestMode}
                    updateGuestMode={updateGuestMode}  // Make sure this line is present
                  />
                )}

                {showWinnerDialog && completedBin && (
                  <WinnerDialog
                    score={score}
                    completedBin={completedBin}
                    onContinue={handleContinuePlaying}
                    onRestart={handleRestartGame}
                    isGuestMode={isGuestMode}
                    updateGuestMode={updateGuestMode}
                  />
                )}
              </>
            ) : (
              <div className='login-message'>
                <p>Please login or play as a guest to start the game.</p>
              </div>
            )}
          </div>
        )}

        {currentPage === 'about' && (
          <div className='info-section'>
            <h1 className="about-title">Trash Talk: India's Waste Saga</h1>

            <section className="about-section">
              <h2>The Great Indian Garbage Party</h2>
              <p>
                Picture this: India generates more trash than Bollywood produces movies! We're talking about 62 million tonnes of waste annually. That's like filling up the Taj Mahal with garbage 690 times every year. Yikes!
              </p>
              <p>
                Our cities are basically playing a never-ending game of Tetris with trash, and spoiler alert: we're not winning. Only about 70% of our waste gets collected, and a measly 30% gets treated. The rest? It's living its best life in open dumps, probably planning world domination.
              </p>
              <div className="image-container">
                <img src="https://img.staticmb.com/mbcontent/images/crop/uploads/2022/12/Solid-Waste-Management-in-India%20_0_1200.jpg" alt="Mountain of garbage" />
                <img src="https://media.licdn.com/dms/image/C5112AQE6ad6qqPkseQ/article-cover_image-shrink_600_2000/0/1564039604044?e=2147483647&v=beta&t=AvVCtKIBTjSGzikleZHUKlSV94ETUlVKpT7-VRRob0o" alt="Overflowing garbage bin" />
              </div>
            </section>

            <section className="about-section">
              <h2>India's Trash-tastic Initiatives</h2>
              <p>
                But wait! India isn't just sitting around watching this trash fire burn. We've got some cool plans up our sleeve:
              </p>
              <ul>
                <li>Swachh Bharat Abhiyan: Because nothing says "I love my country" like picking up litter.</li>
                <li>Smart Cities Mission: Making our cities so smart, they'll learn to take out their own trash!</li>
                <li>Plastic Waste Management Rules: Telling plastic it's not fantastic anymore.</li>
              </ul>
              <p>
                These initiatives are like India's version of the Avengers, but instead of fighting Thanos, they're battling garbage. Earth's mightiest heroes? More like Earth's tidiest heroes!
              </p>
              <div className="image-container">
                <img src="https://i.ytimg.com/vi/0JTc08LQYio/maxresdefault.jpg" alt="Swachh Bharat campaign" />
                <img src="https://greensutra.in/wp-content/uploads/2021/09/Ban-on-Single-Use-Plastic.jpeg" alt="Plastic ban initiative" />
              </div>
            </section>

            <section className="about-section">
              <h2>How This Game Saves the World (Sort of)</h2>
              <p>
                Now, you might be thinking, "How does playing with virtual trash help?" Well, dear waste warrior, here's how:
              </p>
              <ul>
                <li>Brain Training: You'll become a waste-sorting ninja in no time.</li>
                <li>Awareness Level: Over 9000! You'll start seeing the world in wet, dry, and e-waste.</li>
                <li>Habit Formation: Soon, you'll be sorting trash in your sleep (not recommended, but impressive).</li>
              </ul>
              <p>
                Plus, every time you play, a landfill somewhere sheds a happy tear. Probably.
              </p>
              <div className="image-container">
                <img src="https://cdn.downtoearth.org.in/library/large/2018-10-15/0.15112900_1539588449_waste-segregation.jpg" alt="Person sorting waste" />
                <img src="https://www.fabhotels.com/blog/wp-content/uploads/2019/03/New-Delhi.jpg" alt="Clean city street" />
              </div>
            </section>

            <section className="about-section">
              <h2>Eco-Awesome Trivia: India's Green Victories</h2>
              <ul>
                <li>Sikkim became India's first fully organic state in 2016. Talk about a natural glow-up!</li>
                <li>The world's largest solar park is in Karnataka, India. It's so bright, even the sun is jealous!</li>
                <li>Mawlynnong in Meghalaya is known as Asia's cleanest village. It's so clean, you could eat off the streets (but please don't).</li>
                <li>India's first recycled plastic road was built in Chennai in 2002. Who knew trash could pave the way to the future?</li>
                <li>The Coimbatore City Municipal Corporation turns food waste into biofuel for its buses. Talk about a tasty ride!</li>
                <li>Bengaluru's 'Wake Up, Clean Up' campaign involves 10,000 volunteers cleaning the city every week. That's what we call a clean sweep!</li>
              </ul>
              <div className="image-container">
                <img src="https://nomadicweekends.com/blog/wp-content/uploads/2019/10/m-3.jpg" alt="Mawlynnong - Asia's cleanest village" />
                <img src="https://media.licdn.com/dms/image/C4E12AQH9grzwrnBtTg/article-cover_image-shrink_600_2000/0/1520057612051?e=2147483647&v=beta&t=1nA8pMiMIlgQUV5JmKnKkuardbeBUrzVJZlhmknUfZI" alt="Plastic waste road in India" />
              </div>
            </section>
          </div>
        )}

        {currentPage === 'leaderboard' && (
          <Leaderboard />
        )}

        <Navbar currentPage={currentPage} onPageChange={handlePageChange} />
      </div>
    </>
  );
}