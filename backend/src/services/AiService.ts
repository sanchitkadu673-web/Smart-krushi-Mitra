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
  public static async generateCropSchedule(
    cropName: string,
    sowingDate: string,
    soilType?: string,
    soilReportBase64?: string,
    soilReportMime?: string
  ): Promise<any> {
    try {
      let soilAnalysisText = "";

      // If a soil report is uploaded, scan it with Gemini first
      if (soilReportBase64 && apiKey && apiKey !== 'dummy_key') {
        try {
          const base64Data = soilReportBase64.includes(';base64,') 
            ? soilReportBase64.split(';base64,')[1] 
            : soilReportBase64;
            
          const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
          const scanPrompt = `
You are an expert agricultural soil analyst. Look at this soil test report (soil health card) image/document.
Extract the key soil parameters: pH, Organic Carbon (OC), Nitrogen (N), Phosphorus (P), and Potassium (K) levels if visible.
Provide a clear, brief diagnostic summary in Marathi language explaining if the soil is deficient in any nutrients and what general corrections are needed.
Keep it under 3-4 bullet points.
          `;
          
          const scanResult = await model.generateContent([
            {
              inlineData: {
                data: base64Data,
                mimeType: soilReportMime || 'image/jpeg'
              }
            },
            scanPrompt
          ]);
          
          soilAnalysisText = (await scanResult.response).text().trim();
        } catch (scanErr) {
          console.error("Failed to scan soil report with Gemini:", scanErr);
          soilAnalysisText = "माती परीक्षण अहवाल वाचण्यात अडचण आली, परंतु आम्ही तुमच्या पिकासाठी सर्वसाधारण खत वेळापत्रक तयार केले आहे.";
        }
      } else if (soilReportBase64) {
        // Fallback mock analysis if no API key
        soilAnalysisText = "• मातीचा सामू (pH) ७.२ आहे जो पीक वाढीसाठी अत्यंत योग्य आहे.\n• नायट्रोजन (N) आणि सेंद्रिय कर्ब (OC) चे प्रमाण अत्यंत कमी आहे, त्यामुळे नत्राचा वापर वाढवावा लागेल.\n• स्फुरद (P) आणि पालाश (K) चे प्रमाण मध्यम आहे.";
      }

      if (!apiKey || apiKey === 'dummy_key') {
        console.warn('GEMINI_API_KEY is not set. Returning mock AI data.');
        const mock = this.getMockData(cropName);
        if (soilType || soilAnalysisText) {
          mock.crop_info.general_advice += `\n\nमातीचा प्रकार: ${soilType || 'साधारण'}.\nअहवाल विश्लेषण:\n${soilAnalysisText}`;
          mock.soil_analysis = {
            soil_type: soilType,
            analysis_report: soilAnalysisText
          };
        }
        return mock;
      }

      // Using gemini-2.0-flash-lite as it is fast and cost-effective
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

      let prompt = `
You are an expert Indian agriculturist. 
The farmer has planted the crop: "${cropName}" on the date: "${sowingDate}".
`;

      if (soilType) {
        prompt += `The farmer's soil type is: "${soilType}". `;
      }
      if (soilAnalysisText) {
        prompt += `Here is the diagnostic summary from their soil report: "${soilAnalysisText}". Customize the fertilizer recommendations and soil management advice to address these specific deficiencies or soil conditions. `;
      }

      prompt += `
Generate a detailed and complete farming schedule in JSON format. Do not use markdown backticks in your response, just return valid JSON.

The JSON MUST exactly match this structure:
{
  "crop_info": {
    "name": "crop name in Marathi",
    "estimated_harvest_days": 90,
    "pre_sowing_tillage": "Detailed advice on pre-sowing tillage (पूर्व मशागत), soil preparation, and basal dose in Marathi adjusted for crop and soil type.",
    "sowing_method": "Detailed advice on sowing method, seed treatment, and spacing in Marathi.",
    "general_advice": "Other general advice in Marathi including remarks on the soil type/parameters if provided."
  },
  "stages": [
    {
      "stage_name": "Stage 1 (e.g., Growth) in Marathi",
      "start_day": 0,
      "end_day": 20,
      "water_requirement": "Detailed irrigation schedule in Marathi",
      "fertilizer_advice": "Detailed fertilizer advice in Marathi customized for soil conditions",
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

      const parsedJson = JSON.parse(text);

      if (soilType || soilAnalysisText) {
        parsedJson.soil_analysis = {
          soil_type: soilType,
          analysis_report: soilAnalysisText
        };
      }

      return parsedJson;
    } catch (error: any) {
      console.error('Error generating AI crop schedule:', error?.message || error);
      // Fallback to mock data if AI fails
      const mock = this.getMockData(cropName);
      if (soilType || soilReportBase64) {
        mock.soil_analysis = {
          soil_type: soilType,
          analysis_report: "माती अहवाल विश्लेषण उपलब्ध आहे परंतु पीक वेळापत्रक तयार करताना त्रुटी आली."
        };
      }
      return mock;
    }
  }

  private static getMockData(cropName: string): any {
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

  /**
   * Generate a localized weather advisory in Marathi for a district.
   */
  public static async generateWeatherAdvisory(district: string, forecastSummary: string): Promise<string> {
    try {
      if (!apiKey || apiKey === 'dummy_key') {
        console.warn('GEMINI_API_KEY is not set. Returning mock weather advisory.');
        return `पुढील ३ दिवसात ${district} जिल्ह्यात पावसाची शक्यता आहे. फवारणी पुढे ढकला आणि पिकांची योग्य काळजी घ्या.`;
      }

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

      const prompt = `
You are an expert agronomist in Maharashtra, India.
For the district "${district}", the weather forecast for the next 3 days shows: "${forecastSummary}".
Generate a short, urgent, and highly practical farming advice/alert in Marathi language.
Keep it under 3-4 sentences. Mention what action farmers should take regarding their crops (e.g., postpone spraying, cover harvested crops, manage irrigation, protect from wind, etc.).
Do not include any greeting or conversational filler, just return the Marathi text advisory.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error: any) {
      console.error('Error generating weather advisory with Gemini:', error?.message || error);
      return `पुढील ३ दिवसात ${district} जिल्ह्यात पावसाची शक्यता आहे. फवारणी पुढे ढकला आणि पिकांची योग्य काळजी घ्या.`;
    }
  }
}

