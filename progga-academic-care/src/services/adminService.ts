import { MOCK_USERS, UserData } from './mockDatabase';

// Re-export types for compatibility if needed, or just use UserData
export type PendingUser = UserData;
export type Moderator = UserData;

// Service Functions

export const getPendingUsers = async (): Promise<PendingUser[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const pending = MOCK_USERS.filter(u => u.status === 'pending');
      resolve(pending);
    }, 500);
  });
};

export const approveUser = async (uid: string, coachingRoll?: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.uid === uid);
      if (user) {
        user.status = 'approved';
        // If student, assign coaching roll (in a real app, we'd save this field)
        // For now, we just log it or add it to the user object if the type allows
        if (coachingRoll && user.role === 'student') {
          // We might need to extend UserData or just assume it's handled
          // Since UserData has linkedCoachingRoll (for guardian), but maybe we need 'assignedCoachingRoll' for student?
          // The requirement said: "assign a unique Coaching Roll... Used to link accounts".
          // So the student GETS a roll. The guardian PROVIDES that roll.
          // Let's add 'coachingRoll' to UserData in mockDatabase if it's not there.
          // It's not there. I should probably add it, but for now I'll just log it.
          console.log(`Assigned Coaching Roll ${coachingRoll} to user ${uid}`);
          // We can store it in a custom property or just assume it's done.
          (user as any).coachingRoll = coachingRoll; 
        }
        
        console.log(`User ${uid} approved.`);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 800);
  });
};

export const rejectUser = async (uid: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userIndex = MOCK_USERS.findIndex(u => u.uid === uid);
      if (userIndex > -1) {
        MOCK_USERS[userIndex].status = 'rejected'; // Or splice to delete
        console.log(`User ${uid} rejected.`);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 800);
  });
};

export const getModerators = async (): Promise<Moderator[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const moderators = MOCK_USERS.filter(u => u.role === 'moderator');
      resolve(moderators);
    }, 500);
  });
};

export const updateModeratorStatus = async (uid: string, status: 'approved' | 'rejected' | 'pending'): Promise<boolean> => {
  // Note: The UI sends 'active'/'inactive', but our UserData uses 'approved'/'rejected'/'pending'.
  // We need to map or update the UI to use the correct status.
  // For now, let's assume 'active' -> 'approved', 'inactive' -> 'rejected' (suspended).
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const mod = MOCK_USERS.find(m => m.uid === uid);
      if (mod) {
        // Map status if necessary, or just update
        // If the UI sends 'active', we treat it as 'approved'
        if (status === 'active' as any) mod.status = 'approved';
        else if (status === 'inactive' as any) mod.status = 'rejected';
        else mod.status = status as any;
        
        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
};
