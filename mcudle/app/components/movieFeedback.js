export default function MovieFeedback({ guess, feedback }) {
  return (
    <div className="feedbackRow">
      <div>{guess.title}</div>
      <div>{feedback.releaseDate === 'yellow' ? 'Close' : feedback.releaseDate === 'correct' ? 'Correct!' : 'Far'}</div>
      <div>{feedback.userScore && feedback.userScore.includes('yellow') ? feedback.userScore.includes('down') ? 'Close (Down)' : 'Close (Up)' : feedback.userScore === 'correct' ? 'Correct!' : 'Far'}</div>
      <div>{feedback.actors && feedback.actors.includes('yellow') ? `Close - ${feedback.actors.split(' - ')[1]}` : feedback.actors === 'correct' ? 'Correct!' : 'Far'}</div>
    </div>
  );
}
