import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
// Use a dummy key if not provided yet, so it doesn't crash on startup
const apiKey = process.env.GEMINI_API_KEY || 'dummy_key';
const genAI = new GoogleGenerativeAI(apiKey);

export class AiService {
  /**
   * Generate farming schedule and information for a specific crop.
   * Returns a JSON string with the structured schedule.
   */
  public static async generateCropSchedule(cropName: string, sowingDate: string): Promise<any> {
    try {
      if (apiKey === 'dummy_key' || !apiKey) {
        console.warn('GEMINI_API_KEY is not set. Returning mock AI data.');
        return this.getMockData(cropName);
      }

      // Using gemini-1.5-flash as it is fast and cost-effective
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
You are an expert Indian agriculturist. 
The farmer has planted the crop: "${cropName}" on the date: "${sowingDate}".
Generate a detailed and complete farming schedule in JSON format. Do not use markdown backticks in your response, just return valid JSON.

The JSON MUST exactly match this structure:
{
  "crop_info": {
    "name": "crop name in Marathi",
    "estimated_harvest_days": 90,
    "pre_sowing_tillage": "Detailed advice on pre-sowing tillage (पूर्व मशागत), soil preparation, and basal dose in Marathi.",
    "sowing_method": "Detailed advice on sowing method, seed treatment, and spacing in Marathi.",
    "general_advice": "Other general advice in Marathi"
  },
  "stages": [
    {
      "stage_name": "Stage 1 (e.g., Growth) in Marathi",
      "start_day": 0,
      "end_day": 20,
      "water_requirement": "Detailed irrigation schedule in Marathi",
      "fertilizer_advice": "Detailed fertilizer advice in Marathi",
      "spray_advice": "Detailed spray and pest control advice in Marathi",
      "intercultural_operations": "Weeding or other operations (खुरपणी, कोळपणी) in Marathi"
    }
    // add 4-6 appropriate stages covering the entire lifecycle till harvest
  ]
}
Ensure the entire response is purely valid JSON without any \`\`\`json wrappers. All advice must be in Marathi language to help the local Indian farmers. Provide a very comprehensive chart.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Clean up markdown JSON wrappers if Gemini accidentally adds them
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();

      return JSON.parse(text);
    } catch (error) {
      console.error('Error generating AI crop schedule:', error);
      // Fallback to mock data if AI fails
      return this.getMockData(cropName);
    }
  }

  private static getMockData(cropName: string) {
    return {
      "crop_info": {
        "name": cropName,
        "estimated_harvest_days": 100,
        "pre_sowing_tillage": "खोल नांगरणी आणि कुळवणी करून जमीन भुसभुशीत करा.",
        "sowing_method": "योग्य अंतरावर आणि बीजप्रक्रिया करून पेरणी करा.",
        "general_advice": "कृपया Google Gemini API Key .env फाईलमध्ये सेट करा. हा डमी डेटा आहे."
      },
      "stages": [
        {
          "stage_name": "सुरुवातीचा टप्पा",
          "start_day": 0,
          "end_day": 15,
          "water_requirement": "जमिनीच्या मगदुराप्रमाणे पाणी द्या.",
          "fertilizer_advice": "10:26:26 खत द्या.",
          "spray_advice": "सुरुवातीला कोणतीही फवारणी आवश्यक नाही.",
          "intercultural_operations": "१५ दिवसांनी पहिली खुरपणी करा."
        }
      ]
    };
  }
}
