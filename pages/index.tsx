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


export type WasteItemType = {
  name: string;
  category: string;
  // Add any other properties that your waste item should have
};
const wasteItems: WasteItemType[] = [
  // Wet Waste (50 items)
  { name: "Vegetable peels", category: "wet-waste" },
  { name: "Fruit scraps", category: "wet-waste" },
  { name: "Leftover dal", category: "wet-waste" },
  { name: "Tea leaves", category: "wet-waste" },
  { name: "Coffee grounds", category: "wet-waste" },
  { name: "Eggshells", category: "wet-waste" },
  { name: "Used paper tissues", category: "wet-waste" },
  { name: "Fallen leaves", category: "wet-waste" },
  { name: "Grass clippings", category: "wet-waste" },
  { name: "Cooked rice", category: "wet-waste" },
  { name: "Spoiled milk", category: "wet-waste" },
  { name: "Rotten vegetables", category: "wet-waste" },
  { name: "Fish bones", category: "wet-waste" },
  { name: "Meat scraps", category: "wet-waste" },
  { name: "Coconut shells", category: "wet-waste" },
  { name: "Used tea bags", category: "wet-waste" },
  { name: "Banana peels", category: "wet-waste" },
  { name: "Potato skins", category: "wet-waste" },
  { name: "Stale roti", category: "wet-waste" },
  { name: "Wilted flowers", category: "wet-waste" },
  { name: "Leftover sabzi", category: "wet-waste" },
  { name: "Mango seeds", category: "wet-waste" },
  { name: "Onion skins", category: "wet-waste" },
  { name: "Expired yogurt", category: "wet-waste" },
  { name: "Moldy paneer", category: "wet-waste" },
  { name: "Watermelon rinds", category: "wet-waste" },
  { name: "Paan spittle", category: "wet-waste" },
  { name: "Corn cobs", category: "wet-waste" },
  { name: "Sugarcane bagasse", category: "wet-waste" },
  { name: "Coconut husk", category: "wet-waste" },
  { name: "Jackfruit peels", category: "wet-waste" },
  { name: "Tamarind seeds", category: "wet-waste" },
  { name: "Betel nut remains", category: "wet-waste" },
  { name: "Leftover idli", category: "wet-waste" },
  { name: "Spoiled dosa batter", category: "wet-waste" },
  { name: "Used haldi (turmeric) powder", category: "wet-waste" },
  { name: "Discarded curry leaves", category: "wet-waste" },
  { name: "Rotten mangoes", category: "wet-waste" },
  { name: "Spoiled chutney", category: "wet-waste" },
  { name: "Used tea powder", category: "wet-waste" },
  { name: "Leftover poha", category: "wet-waste" },
  { name: "Spoiled sambar", category: "wet-waste" },
  { name: "Rotten tomatoes", category: "wet-waste" },
  { name: "Discarded lemon peels", category: "wet-waste" },
  { name: "Spoiled buttermilk", category: "wet-waste" },
  { name: "Used ginger-garlic paste", category: "wet-waste" },
  { name: "Leftover biryani", category: "wet-waste" },
  { name: "Rotten papaya", category: "wet-waste" },
  { name: "Spoiled raita", category: "wet-waste" },
  { name: "Used cardamom pods", category: "wet-waste" },

  // Dry Waste (50 items)
  { name: "Newspaper", category: "dry-waste" },
  { name: "Cardboard boxes", category: "dry-waste" },
  { name: "Plastic bottles", category: "dry-waste" },
  { name: "Glass jars", category: "dry-waste" },
  { name: "Aluminum cans", category: "dry-waste" },
  { name: "Magazine pages", category: "dry-waste" },
  { name: "Plastic bags", category: "dry-waste" },
  { name: "Tetrapak cartons", category: "dry-waste" },
  { name: "Metal bottle caps", category: "dry-waste" },
  { name: "Empty shampoo bottles", category: "dry-waste" },
  { name: "Plastic food containers", category: "dry-waste" },
  { name: "Broken ceramic cups", category: "dry-waste" },
  { name: "Old clothes", category: "dry-waste" },
  { name: "Shoes", category: "dry-waste" },
  { name: "Empty paint cans", category: "dry-waste" },
  { name: "Plastic toys", category: "dry-waste" },
  { name: "Styrofoam packaging", category: "dry-waste" },
  { name: "Rubber bands", category: "dry-waste" },
  { name: "CD/DVD discs", category: "dry-waste" },
  { name: "Plastic cutlery", category: "dry-waste" },
  { name: "Paper cups", category: "dry-waste" },
  { name: "Tin foil", category: "dry-waste" },
  { name: "Pens and pencils", category: "dry-waste" },
  { name: "Bubble wrap", category: "dry-waste" },
  { name: "Plastic straws", category: "dry-waste" },
  { name: "Empty ghee containers", category: "dry-waste" },
  { name: "Broken bangles", category: "dry-waste" },
  { name: "Old textbooks", category: "dry-waste" },
  { name: "Empty spice bottles", category: "dry-waste" },
  { name: "Plastic buckets", category: "dry-waste" },
  { name: "Broken plastic hangers", category: "dry-waste" },
  { name: "Empty oil cans", category: "dry-waste" },
  { name: "Discarded CFL bulbs", category: "dry-waste" },
  { name: "Old calendars", category: "dry-waste" },
  { name: "Broken plastic toys", category: "dry-waste" },
  { name: "Empty detergent packets", category: "dry-waste" },
  { name: "Plastic packaging of snacks", category: "dry-waste" },
  { name: "Broken plastic combs", category: "dry-waste" },
  { name: "Empty toothpaste tubes", category: "dry-waste" },
  { name: "Discarded plastic utensils", category: "dry-waste" },
  { name: "Old cassette tapes", category: "dry-waste" },
  { name: "Broken plastic chairs", category: "dry-waste" },
  { name: "Empty medicine blister packs", category: "dry-waste" },
  { name: "Discarded plastic folders", category: "dry-waste" },
  { name: "Broken plastic buckets", category: "dry-waste" },
  { name: "Empty plastic oil bottles", category: "dry-waste" },
  { name: "Discarded plastic pens", category: "dry-waste" },
  { name: "Broken plastic rulers", category: "dry-waste" },
  { name: "Empty plastic containers of cosmetics", category: "dry-waste" },
  { name: "Discarded plastic wrappers of sweets", category: "dry-waste" },

  // Hazardous Waste (40 items)
  { name: "Paint thinner", category: "hazardous-waste" },
  { name: "Pesticides", category: "hazardous-waste" },
  { name: "Motor oil", category: "hazardous-waste" },
  { name: "Antifreeze", category: "hazardous-waste" },
  { name: "Asbestos", category: "hazardous-waste" },
  { name: "Mercury thermometers", category: "hazardous-waste" },
  { name: "Lead-acid batteries", category: "hazardous-waste" },
  { name: "Fluorescent light bulbs", category: "hazardous-waste" },
  { name: "Pool chemicals", category: "hazardous-waste" },
  { name: "Bleach", category: "hazardous-waste" },
  { name: "Ammonia", category: "hazardous-waste" },
  { name: "Drain cleaners", category: "hazardous-waste" },
  { name: "Oven cleaners", category: "hazardous-waste" },
  { name: "Glue and adhesives", category: "hazardous-waste" },
  { name: "Photographic chemicals", category: "hazardous-waste" },
  { name: "Expired medications", category: "hazardous-waste" },
  { name: "Nail polish remover", category: "hazardous-waste" },
  { name: "Lighter fluid", category: "hazardous-waste" },
  { name: "Insecticides", category: "hazardous-waste" },
  { name: "Car batteries", category: "hazardous-waste" },
  { name: "Kerosene", category: "hazardous-waste" },
  { name: "Rat poison", category: "hazardous-waste" },
  { name: "Mosquito repellent coils", category: "hazardous-waste" },
  { name: "Hair dye", category: "hazardous-waste" },
  { name: "Expired sunscreen", category: "hazardous-waste" },
  { name: "Used engine oil", category: "hazardous-waste" },
  { name: "Expired cosmetics", category: "hazardous-waste" },
  { name: "Shoe polish", category: "hazardous-waste" },
  { name: "Fungicides", category: "hazardous-waste" },
  { name: "Expired cooking oil", category: "hazardous-waste" },
  { name: "Mothballs", category: "hazardous-waste" },
  { name: "Expired car care products", category: "hazardous-waste" },
  { name: "Expired household cleaners", category: "hazardous-waste" },
  { name: "Used lithium batteries", category: "hazardous-waste" },
  { name: "Expired fire extinguishers", category: "hazardous-waste" },
  { name: "Used printer cartridges", category: "hazardous-waste" },
  { name: "Expired perfumes", category: "hazardous-waste" },
  { name: "Used cooking oil", category: "hazardous-waste" },
  { name: "Expired pesticides", category: "hazardous-waste" },
  { name: "Used syringes", category: "hazardous-waste" },

  // E-Waste (30 items)
  { name: "Old smartphones", category: "e-waste" },
  { name: "Broken laptops", category: "e-waste" },
  { name: "Computer monitors", category: "e-waste" },
  { name: "Printers", category: "e-waste" },
  { name: "Keyboards", category: "e-waste" },
  { name: "Computer mice", category: "e-waste" },
  { name: "Tablets", category: "e-waste" },
  { name: "Digital cameras", category: "e-waste" },
  { name: "MP3 players", category: "e-waste" },
  { name: "Video game consoles", category: "e-waste" },
  { name: "Television sets", category: "e-waste" },
  { name: "DVD players", category: "e-waste" },
  { name: "Electric kettles", category: "e-waste" },
  { name: "Microwave ovens", category: "e-waste" },
  { name: "Electric toothbrushes", category: "e-waste" },
  { name: "Old remote controls", category: "e-waste" },
  { name: "Broken hair dryers", category: "e-waste" },
  { name: "Electric shavers", category: "e-waste" },
  { name: "Outdated smartwatches", category: "e-waste" },
  { name: "Defunct power banks", category: "e-waste" },
  { name: "Broken mixers/grinders", category: "e-waste" },
  { name: "Old CRT monitors", category: "e-waste" },
  { name: "Broken air conditioners", category: "e-waste" },
  { name: "Defunct solar inverters", category: "e-waste" },
  { name: "Old DTH set-top boxes", category: "e-waste" },
  { name: "Broken electric fans", category: "e-waste" },
  { name: "Outdated feature phones", category: "e-waste" },
  { name: "Broken induction cooktops", category: "e-waste" },
  { name: "Old digital calculators", category: "e-waste" },
  { name: "Defunct UPS systems", category: "e-waste" },

  // Sanitary Waste (30 items)
  { name: "Used diapers", category: "sanitary-waste" },
  { name: "Sanitary napkins", category: "sanitary-waste" },
  { name: "Tampons", category: "sanitary-waste" },
  { name: "Bandages", category: "sanitary-waste" },
  { name: "Cotton swabs", category: "sanitary-waste" },
  { name: "Disposable masks", category: "sanitary-waste" },
  { name: "Used gloves", category: "sanitary-waste" },
  { name: "Dental floss", category: "sanitary-waste" },
  { name: "Razor blades", category: "sanitary-waste" },
  { name: "Used tissues", category: "sanitary-waste" },
  { name: "Contact lenses", category: "sanitary-waste" },
  { name: "Hair from brushes", category: "sanitary-waste" },
  { name: "Nail clippings", category: "sanitary-waste" },
  { name: "Used toothbrushes", category: "sanitary-waste" },
  { name: "Wax strips", category: "sanitary-waste" },
  { name: "Used cotton balls", category: "sanitary-waste" },
  { name: "Disposable shoe covers", category: "sanitary-waste" },
  { name: "Used face masks", category: "sanitary-waste" },
  { name: "Disposable cleaning wipes", category: "sanitary-waste" },
  { name: "Used band-aids", category: "sanitary-waste" },
  { name: "Expired condoms", category: "sanitary-waste" },
  { name: "Used menstrual cups", category: "sanitary-waste" },
  { name: "Disposable underwear", category: "sanitary-waste" },
  { name: "Used tongue cleaners", category: "sanitary-waste" },
  { name: "Disposable bed sheets", category: "sanitary-waste" },
  { name: "Used ear buds", category: "sanitary-waste" },
  { name: "Disposable hair nets", category: "sanitary-waste" },
  { name: "Used dental picks", category: "sanitary-waste" },
  { name: "Disposable diapers", category: "sanitary-waste" },
  { name: "Used sanitary pads", category: "sanitary-waste" },
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
    ...wasteItems,
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

  const enableGuestMode = () => {
    setIsGuestMode(true);
  };

  useEffect(() => {
    selectRandomItem();
  }, []);

  useEffect(() => {
    console.log("Auth state:", { authenticated, user });
  }, [authenticated, user]);

  const selectRandomItem = () => {
    if (availableItems.length === 0) {
      setShowGameOverDialog(true); // Show game over dialog when no items are left
      return;
    }
    const randomIndex = Math.floor(Math.random() * availableItems.length);
    const newItem = availableItems[randomIndex];
    setCurrentItem(newItem);
    setAvailableItems(
      availableItems.filter((_, index) => index !== randomIndex)
    );
    setCorrectBin(null);
  };

  const handleDrop = (item: WasteItemType, binCategory: string) => {
    if (item.category === binCategory) {
      const newLevel = Math.min(binLevels[binCategory] + 100, 100);
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
          console.log("Saving score:", { address: user.wallet.address, newScore });
          saveUserScore(user.wallet.address, newScore, user?.farcaster?.username || null);
        }
      } 
      
      selectRandomItem();
    } else {
      setCorrectBin(item.category);
      setShowGameOverDialog(true);
      
      // Save the score when the game ends
      if (authenticated && !isGuestMode && user?.wallet?.address) {
        console.log("Saving score:", { address: user.wallet.address, score });
        saveUserScore(user.wallet.address, score, user?.farcaster?.username || null);
      }
    }
  };

  const handleTouchDrop = (item: WasteItemType) => {
    setCurrentItem(item);
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
    setAvailableItems([...wasteItems]);
    setCorrectBin(null);
    setShowWinnerDialog(false);
    setCompletedBin(null);
    setHasShownDialog(false);
    setShowGameOverDialog(false);
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

  return (
    <>
      <div className='game-background'></div>
      <div className='page-container'>
        {currentPage === 'play' && (
          <div className='game-container'>
            <h1 className='game-title'>
              How Wasted Are You?!
              <span className="info-icon">
                <FaInfoCircle className="icon-small" />
                <span className="tooltip">
                  A simple drag and drop game to educate about waste segregation. Double click on bins to see what goes in them. Fill a bin completely to win & Claim an NFT Keep playing to top the leaderboard.
                </span>
              </span>
            </h1>

            <div className='wallet-button-container'>
              {!authenticated && !isGuestMode && (
                <>
                  <button className={`${styles.gameButton} ${styles.green}`} onClick={login}>Login</button>
                  <button className={`${styles.gameButton} ${styles.orange}`} onClick={enableGuestMode}>Play as Guest</button>
                </>
              )}
              {authenticated && (
                <>
                  <button className={`${styles.gameButton} ${styles.red}`} onClick={logout}>Logout</button>
                  <div>{user?.farcaster?.displayName}</div>
                </>
              )}
            </div>

            {(authenticated || isGuestMode) ? (
              <>
                <div className='score'>Score: {score}</div>
                {currentItem && (
                  <WasteItem {...currentItem} onTouchDrop={handleTouchDrop} />
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
                  />
                )}

                {showWinnerDialog && completedBin && (
                  <WinnerDialog
                    score={score}
                    completedBin={completedBin}
                    onContinue={handleContinuePlaying}
                    onRestart={handleRestartGame}
                    isGuestMode={isGuestMode}
                  />
                )}

                <div className={styles.howToPlaySmall}>
                  <h3>How to Play:</h3>
                  <ol>
                    <li>Hold to Drag and drop waste items into the correct bins.</li>
                    <li>Double-click on bins to see what goes in them.</li>
                    <li>Fill a bin completely to win and claim an NFT.</li>
                    <li>Keep playing to top the leaderboard!</li>
                  </ol>
                </div>
              </>
            ) : (
              <div className='login-message'>
                <p>Please login or play as a guest to start the game.</p>
              </div>
            )}
          </div>
        )}

        {currentPage === 'about' && (
          <div className="info-section">
            <h1>Waste is smol pp, gotta clean it ~ @314yush</h1>
            
            <section className="government-policy">
              <h2>🏛️ India's efforts towards waste segregation</h2>
              <p>Buckle up! Here's how India's government is turning trash into treasure:</p>
              <ul>
                <li><strong>Swachh Bharat Mission (2014):</strong> The ultimate clean-up party! Aiming for a spotless India with 100% pro waste management.</li>
                <li><strong>Solid Waste Management Rules (2016):</strong> The "Sort It Out" saga! Waste now comes in three exciting flavors:
                  <ul>
                    <li>🥕 Biodegradable: Nature's snack</li>
                    <li>📦 Dry waste: Reduce, Reuse, Recycle squad</li>
                    <li>☢️ Domestic hazardous: The "Handle with Care" bunch</li>
                  </ul>
                </li>
                <li><strong>Extended Producer Responsibility (EPR):</strong> Companies, time to clean up your act! They make it, they take it (back).</li>
                <li><strong>Plastic Waste Management Rules (2016):</strong> Saying "Ta-ta!" to troublesome plastics. Multi-layered plastic, we're looking at you!</li>
              </ul>
              <div className="image-container">
                <img src="/path-to-image1.jpg" alt="Swachh Bharat Mission in action" />
                <img src="/path-to-image2.jpg" alt="Colorful waste segregation bins" />
              </div>
            </section>

            <section className="fun-facts">
              <h2>🎭 Trash Trivia: Impress Your Friends!</h2>
              <ul>
                <li>India generates enough waste annually to fill 3,000 Olympic-sized swimming pools! 🏊‍♂️</li>
                <li>A whopping 70% of India's plastic waste is recycled. Take that, global average of 9%! 💪</li>
                <li>Bengaluru, the 'Garden City', produces about 5,000 tonnes of waste daily. That's the weight of 1,000 elephants! 🐘</li>
                <li>India's first garbage café in Ambikapur offers free meals in exchange for plastic waste. Yum! 🍽️</li>
              </ul>
            </section>

            <section className="game-benefits">
              <h2>🎮 Why "How Wasted Are You?!" Is Your New Superhero Training</h2>
              <p>Ready to save the world, one trash sort at a time? Here's why our game is your secret weapon:</p>
              <ul>
                <li><strong>🧠 Trash Sorting Jedi:</strong> Master the art of waste segregation without getting your hands dirty. Yay for virtual learning!</li>
                <li><strong>📚 Policy Buff:</strong> Understand government trash talk (aka policies) while having fun. Who said learning can't be entertaining?</li>
                <li><strong>🌍 Earth's BFF:</strong> Learn how your sorting skills can make landfills less landfill-y and the environment more smiley.</li>
                <li><strong>🏆 Leaderboard Legend:</strong> Compete, conquer, and spread the word. Your high score could inspire the next waste warrior!</li>
                <li><strong>🦸 Habit Hero:</strong> Develop a trash-sorting sixth sense. Soon, you'll be categorizing waste in your sleep (in a good way)!</li>
              </ul>
              <div className="image-container">
                <img src="/path-to-image3.jpg" alt="Excited player mastering waste segregation" />
                <img src="/path-to-image4.jpg" alt="Before/After of clean environment thanks to proper waste management" />
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