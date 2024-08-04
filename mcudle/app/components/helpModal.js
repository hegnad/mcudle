import React from 'react';
import styles from './helpModal.module.css';
import pageStyles from '../page.module.css';

const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={pageStyles.closeButton} onClick={onClose}>X</button>
        <h1>HOW TO PLAY</h1>
        <hr className={styles.headerLine} />
        <h2>Try to guess the Marvel Cinematic Universe movie in 4 guesses.</h2>
        <ul>
          <li><strong>✅ Correct!</strong> is an exact match.</li>
          <li><strong>🔺/🔻 Close!</strong> is a close match.</li>
          <br />
          <li> A close match means:</li>
          <br />
          <ul>
            <li><strong>Release Year</strong> indicates your guess was released within 3 years of the movie.</li>
            <li><strong>TMDB User Score</strong> indicates your guess is within 15% of the movie.</li>
            <li><strong>Shared Actors</strong> indicates the guessed movie shares one or more actors with the movie.</li>
          </ul>
        </ul>
        <br />
        <div className={styles.helpFinalDetails}>
            <p>The poster will be revealed after 2 guesses, partially blurred, and fully revealed after the fourth/final guess or when guessed correctly.</p>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
