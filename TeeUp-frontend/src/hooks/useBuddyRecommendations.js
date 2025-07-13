import { useState, useEffect } from 'react';
import { fetchBuddyRecommendations } from '../services/matchService';

export default function useBuddyRecommendations(loginId) {
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBuddies = async () => {
      try {
        const res = await fetchBuddyRecommendations(loginId);
        setBuddies(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadBuddies();
  }, [loginId]);

  return {
    buddies,
    loading,
    setBuddies, // ★ 추가!
  };
}
