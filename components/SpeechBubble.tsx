import React from 'react';
import styles from './SpeechBubble.module.css';

interface SpeechBubbleProps {
  message: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  large?: boolean;
  rounded?: boolean;
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({ 
  message, 
  position = 'top', 
  large = false, 
  rounded = true 
}) => {
  const classNames = [
    styles.rounded,
    styles.bubble,
    styles[position]
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      {message}
    </div>
  );
};

export default SpeechBubble;
