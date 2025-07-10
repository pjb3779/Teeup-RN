import { useEffect, useState } from 'react';
import { fetchBuddyRecommendations } from '../services/matchService';

export default function useBuddyRecommendations(loginId) {
  const [buddies, setBuddies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const data = await fetchBuddyRecommendations(loginId);
        setBuddies(data);
      } catch (error) {
        console.error('버디 추천 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [loginId]);

  return { buddies, loading };
}
