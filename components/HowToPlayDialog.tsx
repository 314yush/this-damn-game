import React from 'react';
import styles from './HowToPlayDialog.module.css';
import homeStyles from '../pages/Home.module.css';

interface HowToPlayDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const HowToPlayDialog: React.FC<HowToPlayDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialogContent}>
        <h2 className={styles.dialogTitle}>How to Play</h2>
        <ol className={styles.dialogList}>
          <li className={styles.dialogListItem}>Drag and drop waste items into the correct bins.</li>
          <li className={styles.dialogListItem}>Double-click on bins to see what goes in them.</li>
          <li className={styles.dialogListItem}>Fill a bin completely to win and claim an NFT.</li>
          <li className={styles.dialogListItem}>Keep playing to top the leaderboard!</li>
        </ol>
        <button 
          onClick={onClose} 
          className={`${homeStyles.gameButton} ${homeStyles.green} ${styles.closeButton}`}
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

export default HowToPlayDialog;
