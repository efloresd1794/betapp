import { useState, useEffect } from 'react';
import { createBet, getBet, signBet, listBets } from './services/api';
import './App.css';

function App() {
  const [bets, setBets] = useState([]);
  const [newBet, setNewBet] = useState({
    topic: '',
    terms: '',
    participants: ''
  });
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBets();
  }, []);

  const fetchBets = async () => {
    try {
      setLoading(true);
      const fetchedBets = await listBets();
      setBets(fetchedBets);
    } catch (err) {
      setError('Failed to fetch bets');
      console.error('Error fetching bets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const betData = {
        ...newBet,
        participants: newBet.participants.split(',').map(p => p.trim())
      };
      const createdBet = await createBet(betData);
      setBets(prev => [...prev, createdBet]);
      setNewBet({ topic: '', terms: '', participants: '' });
    } catch (err) {
      setError('Failed to create bet');
      console.error('Error creating bet:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async (betId) => {
    if (!signature.trim()) return;
    try {
      setLoading(true);
      const updatedBet = await signBet(betId, signature);
      setBets(prev => prev.map(bet => 
        bet.id === betId ? updatedBet : bet
      ));
      setSignature('');
    } catch (err) {
      setError('Failed to sign bet');
      console.error('Error signing bet:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="main-title">Betting App</h1>

      {/* Create Bet Form */}
      <div className="form-container">
        <h2 className="section-title">Create New Bet</h2>
        <form onSubmit={handleSubmit} className="bet-form">
          <div className="form-group">
            <label>Topic:</label>
            <input
              type="text"
              value={newBet.topic}
              onChange={(e) => setNewBet(prev => ({...prev, topic: e.target.value}))}
              required
            />
          </div>
          <div className="form-group">
            <label>Terms:</label>
            <textarea
              value={newBet.terms}
              onChange={(e) => setNewBet(prev => ({...prev, terms: e.target.value}))}
              required
            />
          </div>
          <div className="form-group">
            <label>Participants (comma-separated):</label>
            <input
              type="text"
              value={newBet.participants}
              onChange={(e) => setNewBet(prev => ({...prev, participants: e.target.value}))}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Creating...' : 'Create Bet'}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Bets List */}
      <div className="bets-container">
        <h2 className="section-title">Active Bets</h2>
        {bets.map(bet => (
          <div key={bet.id} className="bet-card">
            <h3 className="bet-title">{bet.topic}</h3>
            <p className="bet-terms">{bet.terms}</p>
            <p className="bet-participants">
              Participants: {bet.participants.join(', ')}
            </p>
            <div className="signatures">
              <p>Signatures:</p>
              {Object.entries(bet.signatures || {}).map(([name, date]) => (
                <p key={name} className="signature-item">
                  {name} - {new Date(date).toLocaleDateString()}
                </p>
              ))}
            </div>
            <div className="signature-form">
              <input
                type="text"
                placeholder="Your initials"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                className="signature-input"
              />
              <button
                onClick={() => handleSign(bet.id)}
                disabled={loading}
                className="sign-button"
              >
                Sign
              </button>
            </div>
            <p className="shareable-link">
              Shareable Link: {bet.shareable_link}
            </p>
          </div>
        ))}
        {bets.length === 0 && !loading && (
          <p className="no-bets">No bets created yet</p>
        )}
      </div>
    </div>
  );
}

export default App;