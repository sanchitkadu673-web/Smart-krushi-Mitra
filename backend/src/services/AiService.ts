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
      if (!apiKey || apiKey === 'dummy_key') {
        console.warn('GEMINI_API_KEY is not set. Returning mock AI data.');
        return this.getMockData(cropName);
      }

      // Using gemini-2.0-flash-lite as it is fast and cost-effective
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

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
    } catch (error: any) {
      console.error('Error generating AI crop schedule:', error?.message || error);
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

  /**
   * Parse a base64 bill image to extract list of products.
   */
  public static async scanBill(base64Image: string, mimeType: string): Promise<any[]> {
    try {
      if (!apiKey || apiKey === 'dummy_key') {
        console.warn('GEMINI_API_KEY is not set. Returning mock bill data.');
        return this.getMockBillData();
      }

      // Extract raw base64 data if it contains data URI header
      const base64Data = base64Image.includes(';base64,') 
        ? base64Image.split(';base64,')[1] 
        : base64Image;

      // Using gemini-2.0-flash-lite since it supports multimodal input
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

      const prompt = `
You are an expert agriculture inventory digitizer. Look at this dealer purchase invoice/bill image and extract the agricultural items (fertilizers, pesticides, seeds, farming equipment, etc.) listed in the bill.
You must extract: product name, category, company, unit price, and quantity.
Return a valid JSON array of objects. Do not wrap in markdown backticks, just return valid JSON.

The JSON array MUST look exactly like this:
[
  {
    "name": "product name (e.g., Urea, NPK 10:26:26, Neem Oil, etc.)",
    "category": "Fertilizer | Pesticide | Seed | Equipment | Other",
    "company": "company name (e.g., IFFCO, Mahadhan, Bayer, Syngenta, etc. or 'Unknown')",
    "price": 1200, // item price per unit/bag as a number
    "quantity": 10 // item quantity as a number
  }
]
Only return valid JSON without markdown formatting.
`;

      const result = await model.generateContent([
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType || 'image/jpeg'
          }
        },
        prompt
      ]);

      const response = await result.response;
      let text = response.text();
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();

      return JSON.parse(text);
    } catch (error: any) {
      console.error('Error scanning bill with Gemini:', error?.message || error);
      return this.getMockBillData();
    }
  }

  private static getMockBillData() {
    return [
      {
        "name": "NPK 19:19:19",
        "category": "Fertilizer",
        "company": "Mahadhan",
        "price": 850,
        "quantity": 25
      },
      {
        "name": "Neem Liquid",
        "category": "Pesticide",
        "company": "Multiplex",
        "price": 420,
        "quantity": 15
      },
      {
        "name": "DAP 18:46:0",
        "category": "Fertilizer",
        "company": "IFFCO",
        "price": 1350,
        "quantity": 40
      }
    ];
  }
}
