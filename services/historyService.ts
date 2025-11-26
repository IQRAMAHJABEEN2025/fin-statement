

import { ref, push, get, child } from 'firebase/database';
import { db } from '../firebaseConfig';
import { HistoryItem } from '../types';

// Save History directly to Realtime Database
export const saveAnalysisToHistory = async (
  userId: string,
  imageBase64: string,
  companyName: string,
  period: string,
  userEmail?: string
) => {
  if (!userId) return false;

  try {
    // We create a path: users_history -> userId -> auto_generated_id
    const historyRef = ref(db, `users_history/${userId}`);
    
    await push(historyRef, {
      companyName,
      period,
      imageUrl: imageBase64, // Storing the base64 string directly
      createdAt: new Date().toISOString(),
      userEmail
    });

    return true;
  } catch (error) {
    console.error("Error saving to Realtime Database:", error);
    throw error;
  }
};

// Fetch History from Realtime Database
export const getUserHistory = async (userId: string): Promise<HistoryItem[]> => {
  if (!userId) return [];

  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `users_history/${userId}`));

    if (snapshot.exists()) {
      const data = snapshot.val();
      // Convert Object of Objects to Array
      const historyList: HistoryItem[] = Object.keys(data).map(key => ({
        id: key,
        companyName: data[key].companyName,
        period: data[key].period,
        createdAt: data[key].createdAt,
        imageUrl: data[key].imageUrl,
        userEmail: data[key].userEmail
      }));
      
      // Sort by newest first
      return historyList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
};
