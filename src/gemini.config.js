// import { GoogleGenerativeAI } from "@google/generative-ai";

// // Initialize Gemini AI
// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// // Try multiple model options with fallback
// const MODEL_OPTIONS = [
//   "gemini-2.5-flash-lite",
//   "gemini-2.5-flash", 
//   "gemini-2.5-pro"
// ];

// // Get the generative model
// export const getGeminiModel = (modelIndex = 0) => {
//   const modelName = MODEL_OPTIONS[modelIndex] || "gemini-2.5-pro";
//   console.log('Trying model:', modelName);
//   return genAI.getGenerativeModel({ model: modelName });
// };

// // Generate study plan with automatic retry on different models
// export const generateStudyPlan = async (planData, modelIndex = 0) => {
//   try {
//     const model = getGeminiModel(modelIndex);
//     const prompt = createStudyPlanPrompt(planData);

//     console.log('Sending request to Gemini API...');
    
//     const result = await model.generateContent(prompt);
//     const response = result.response;
//     const text = response.text();

//     console.log('✓ Successfully received response from Gemini API');

//     return {
//       success: true,
//       schedule: parseScheduleResponse(text),
//       rawResponse: text
//     };
//   } catch (error) {
//     console.error("Gemini API Error:", error);
    
//     // If 404 error and we have more models to try, retry with next model
//     if (error.message.includes('404') && modelIndex < MODEL_OPTIONS.length - 1) {
//       console.log('Model not found, trying next model...');
//       return generateStudyPlan(planData, modelIndex + 1);
//     }
    
//     // More detailed error messages
//     if (error.message.includes('API key')) {
//       return {
//         success: false,
//         error: "Invalid API key. Please check your Gemini API key in .env file."
//       };
//     } else if (error.message.includes('404')) {
//       return {
//         success: false,
//         error: "No compatible models found. Your API key might need to be regenerated or may have restricted access."
//       };
//     } else if (error.message.includes('quota') || error.message.includes('429')) {
//       return {
//         success: false,
//         error: "API quota exceeded. Please try again later."
//       };
//     } else if (error.message.includes('403')) {
//       return {
//         success: false,
//         error: "API key doesn't have permission. Please check your API key settings in Google AI Studio."
//       };
//     }
    
//     return {
//       success: false,
//       error: error.message || "Failed to generate study plan"
//     };
//   }
// };

// // Create a detailed prompt for the AI
// const createStudyPlanPrompt = (planData) => {
//   const { goalTitle, startDate, endDate, subjects, studyHours, includeWeekends, preferMorning } = planData;

//   return `You are an expert academic planner. Create a detailed, personalized study schedule based on the following requirements:

// **Goal:** ${goalTitle}
// **Duration:** From ${startDate} to ${endDate}
// **Subjects/Topics:** ${subjects.join(", ")}
// **Study Hours per Week:** ${studyHours} hours
// **Include Weekends:** ${includeWeekends ? "Yes" : "No"}
// **Prefer Morning Sessions:** ${preferMorning ? "Yes" : "No"}

// Please create a comprehensive study plan that includes:
// 1. A weekly breakdown of study sessions
// 2. Recommended time slots for each subject
// 3. Balance between subjects based on complexity
// 4. Rest periods and breaks
// 5. Tips for effective studying

// Format the response as a structured JSON object with this exact structure:
// {
//   "weeklySchedule": [
//     {
//       "day": "Monday",
//       "sessions": [
//         {
//           "subject": "Subject Name",
//           "timeSlot": "9:00 AM - 11:00 AM",
//           "duration": "2 hours",
//           "topics": ["Topic 1", "Topic 2"]
//         }
//       ]
//     }
//   ],
//   "studyTips": ["Tip 1", "Tip 2", "Tip 3"],
//   "subjectDistribution": {
//     "Mathematics": "30%",
//     "History": "35%",
//     "Physics": "35%"
//   }
// }

// Make sure the schedule is realistic, balanced, and achievable. Consider break times and avoid burnout.`;
// };

// // Parse the AI response
// const parseScheduleResponse = (text) => {
//   try {
//     // Try to extract JSON from the response
//     const jsonMatch = text.match(/\{[\s\S]*\}/);
//     if (jsonMatch) {
//       return JSON.parse(jsonMatch[0]);
//     }

//     // If no JSON found, return structured text
//     return {
//       rawSchedule: text,
//       parsed: false
//     };
//   } catch (error) {
//     console.error("Error parsing schedule:", error);
//     return {
//       rawSchedule: text,
//       parsed: false
//     };
//   }
// };
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Try multiple model options with fallback
const MODEL_OPTIONS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash", 
  "gemini-2.5-pro"
];

// Get the generative model
export const getGeminiModel = (modelIndex = 0) => {
  const modelName = MODEL_OPTIONS[modelIndex] || "gemini-pro";
  console.log('Trying model:', modelName);
  return genAI.getGenerativeModel({ model: modelName });
};

// Generate study plan with automatic retry on different models
export const generateStudyPlan = async (planData, modelIndex = 0) => {
  try {
    const model = getGeminiModel(modelIndex);
    const prompt = createStudyPlanPrompt(planData);

    console.log('Sending request to Gemini API...');
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log('✓ Successfully received response from Gemini API');

    return {
      success: true,
      schedule: parseScheduleResponse(text),
      rawResponse: text
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // If 404 error and we have more models to try, retry with next model
    if (error.message.includes('404') && modelIndex < MODEL_OPTIONS.length - 1) {
      console.log('Model not found, trying next model...');
      return generateStudyPlan(planData, modelIndex + 1);
    }
    
    // More detailed error messages
    if (error.message.includes('API key')) {
      return {
        success: false,
        error: "Invalid API key. Please check your Gemini API key in .env file."
      };
    } else if (error.message.includes('404')) {
      return {
        success: false,
        error: "No compatible models found. Your API key might need to be regenerated or may have restricted access."
      };
    } else if (error.message.includes('quota') || error.message.includes('429')) {
      return {
        success: false,
        error: "API quota exceeded. Please try again later."
      };
    } else if (error.message.includes('403')) {
      return {
        success: false,
        error: "API key doesn't have permission. Please check your API key settings in Google AI Studio."
      };
    }
    
    return {
      success: false,
      error: error.message || "Failed to generate study plan"
    };
  }
};

// Create a detailed prompt for the AI
const createStudyPlanPrompt = (planData) => {
  const { goalTitle, startDate, endDate, subjects, studyHours, includeWeekends, preferMorning, customPrompt } = planData;

  let prompt = `You are an expert academic planner. Create a detailed, personalized study schedule based on the following requirements:

**Goal:** ${goalTitle}
**Duration:** From ${startDate} to ${endDate}
**Subjects/Topics:** ${subjects.join(", ")}
**Study Hours per Week:** ${studyHours} hours
**Include Weekends:** ${includeWeekends ? "Yes" : "No"}
**Prefer Morning Sessions:** ${preferMorning ? "Yes" : "No"}`;

  // Add custom instructions if provided
  if (customPrompt && customPrompt.trim()) {
    prompt += `\n\n**Additional Requirements/Constraints:**\n${customPrompt.trim()}`;
  }

  prompt += `\n\nPlease create a comprehensive study plan that includes:
1. A weekly breakdown of study sessions
2. Recommended time slots for each subject
3. Balance between subjects based on complexity
4. Rest periods and breaks
5. Tips for effective studying

Format the response as a structured JSON object with this exact structure:
{
  "weeklySchedule": [
    {
      "day": "Monday",
      "sessions": [
        {
          "subject": "Subject Name",
          "timeSlot": "9:00 AM - 11:00 AM",
          "duration": "2 hours",
          "topics": ["Topic 1", "Topic 2"]
        }
      ]
    }
  ],
  "studyTips": ["Tip 1", "Tip 2", "Tip 3"],
  "subjectDistribution": {
    "Mathematics": "30%",
    "History": "35%",
    "Physics": "35%"
  }
}

Make sure the schedule is realistic, balanced, and achievable. Consider break times and avoid burnout.`;

  return prompt;
};

// Parse the AI response
const parseScheduleResponse = (text) => {
  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // If no JSON found, return structured text
    return {
      rawSchedule: text,
      parsed: false
    };
  } catch (error) {
    console.error("Error parsing schedule:", error);
    return {
      rawSchedule: text,
      parsed: false
    };
  }
};