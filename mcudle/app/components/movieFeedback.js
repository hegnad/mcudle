import styles from './movieFeedback.module.css';

export default function MovieFeedback({ guess, feedback, guessNumber }) {
  const borderStyle = guess ? 'solid' : 'dashed';

  return (
    <div className={styles.feedbackRow} style={{ borderStyle }}>
      <div className={styles.feedbackCell}>
        {guess ? (
          <>
            {guess.title}
            {!feedback.correct && ' ❌'}
          </>
        ) : (
          `Guess ${guessNumber}`
        )}
      </div>
      <div className={styles.feedbackCell}>{guess ? feedback.releaseDate : ''}</div>
      <div className={styles.feedbackCell}>{guess ? feedback.userScore : ''}</div>
      <div className={styles.feedbackCell}>{guess ? feedback.actors : ''}</div>
    </div>
  );
}
