import { db, auth } from './firebase.config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc,
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';

// Collection name
const SCHEDULES_COLLECTION = 'schedules';

// Save a new schedule to Firestore
export const saveSchedule = async (scheduleData, planData) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User must be logged in to save schedules');
    }

    const scheduleToSave = {
      userId: user.uid,
      userEmail: user.email,
      goalTitle: planData.goalTitle,
      startDate: planData.startDate,
      endDate: planData.endDate,
      subjects: planData.subjects,
      studyHours: planData.studyHours,
      includeWeekends: planData.includeWeekends,
      preferMorning: planData.preferMorning,
      schedule: scheduleData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, SCHEDULES_COLLECTION), scheduleToSave);
    
    console.log('Schedule saved with ID:', docRef.id);
    
    return {
      success: true,
      scheduleId: docRef.id,
      message: 'Schedule saved successfully!'
    };
  } catch (error) {
    console.error('Error saving schedule:', error);
    return {
      success: false,
      error: error.message || 'Failed to save schedule'
    };
  }
};

// Get all schedules for the current user
export const getUserSchedules = async () => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User must be logged in to view schedules');
    }

    const q = query(
      collection(db, SCHEDULES_COLLECTION),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const schedules = [];

    querySnapshot.forEach((doc) => {
      schedules.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      });
    });

    return {
      success: true,
      schedules
    };
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch schedules'
    };
  }
};

// Get a single schedule by ID
export const getScheduleById = async (scheduleId) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User must be logged in');
    }

    const docRef = doc(db, SCHEDULES_COLLECTION, scheduleId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Schedule not found');
    }

    const scheduleData = docSnap.data();

    // Verify the schedule belongs to the current user
    if (scheduleData.userId !== user.uid) {
      throw new Error('Unauthorized access to schedule');
    }

    return {
      success: true,
      schedule: {
        id: docSnap.id,
        ...scheduleData,
        createdAt: scheduleData.createdAt?.toDate(),
        updatedAt: scheduleData.updatedAt?.toDate()
      }
    };
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch schedule'
    };
  }
};

// Delete a schedule
export const deleteSchedule = async (scheduleId) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User must be logged in');
    }

    // First verify the schedule belongs to the user
    const scheduleDoc = await getScheduleById(scheduleId);
    
    if (!scheduleDoc.success) {
      throw new Error(scheduleDoc.error);
    }

    await deleteDoc(doc(db, SCHEDULES_COLLECTION, scheduleId));

    return {
      success: true,
      message: 'Schedule deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete schedule'
    };
  }
};