import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from '../components/navigation/Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Activity, Calendar, Droplets, ShieldAlert, Sparkles, Sprout } from 'lucide-react';

const cropTranslations: Record<string, {
  mr: {
    description: string;
    varieties: string;
    seedBrands: string;
    expectedYield: string;
    category: string;
  };
  hi: {
    description: string;
    varieties: string;
    seedBrands: string;
    expectedYield: string;
    category: string;
  };
}> = {
  'Cotton (Kapus / कपास)': {
    mr: {
      category: 'नगदी पीक',
      expectedYield: '१०-१२ क्विंटल/एकर',
      description: 'कापूस हे भारतातील एक प्रमुख नगदी पीक आहे, जे उष्ण आणि उपोष्णकटिबंधीय प्रदेशात घेतले जाते. यासाठी पाण्याचा उत्तम निचरा होणारी काळी कसदार जमीन (रेगूर) आवश्यक असते.',
      varieties: 'बीटी कॉटन (कनक, बनी, मारुती), नॉन-बीटी (एनएचएच-४४)',
      seedBrands: 'राशी सीड्स (नियो, आरसीएच-६५९), माहिस्को (कनक), कावेरी सीड्स (जादू), नुझिवीडू सीड्स (भक्ती)'
    },
    hi: {
      category: 'नकदी फसल',
      expectedYield: '10-12 क्विंटल/एकड़',
      description: 'कपास भारत की एक प्रमुख नकदी फसल है, जो उष्णकटिबंधीय और उपोष्णकटिबंधीय क्षेत्रों में उगाई जाती है। इसके लिए जल निकासी वाली गहरी काली मिट्टी आवश्यक है।',
      varieties: 'बीटी कपास (कनक, बन्नी, मारुति), नॉन-बीटी (एनएचएच-44)',
      seedBrands: 'रासी सीड्स, माहिस्को, कावेरी सीड्स, नुजीविदु सीड्स'
    }
  },
  'Soybean (सोयाबीन)': {
    mr: {
      category: 'तेलबिया',
      expectedYield: '८-१० क्विंटल/एकर',
      description: 'सोयाबीन हे प्रथिनांनी समृद्ध असलेले एक महत्त्वाचे तेलबिया पीक आहे, ज्याची खरीप हंगामात मध्य भारतात मोठ्या प्रमाणावर लागवड केली जाते.',
      varieties: 'जेएस ३३५, जेएस ९३-०५, एमएसीएस ११८८, फुले संगम (केडीएस-७२६)',
      seedBrands: 'महाबीज, ईगल सीड्स, राशी सीड्स, राजकुमार सीड्स'
    },
    hi: {
      category: 'तिलहन',
      expectedYield: '8-10 क्विंटल/एकड़',
      description: 'सोयाबीन प्रोटीन से भरपूर एक महत्वपूर्ण तिलहन फसल है, जिसकी खेती मुख्य रूप से खरीफ सीजन में की जाती है।',
      varieties: 'जेएस 335, जेएस 93-05, एमएसीएस 1188, फुले संगम (केडीएस-726)',
      seedBrands: 'महाबीज, ईगल सीड्स, रासी सीड्स'
    }
  },
  'Wheat (Gahu / गेहूं)': {
    mr: {
      category: 'तृणधान्य',
      expectedYield: '१५-२० क्विंटल/एकर',
      description: 'गहू हे रब्बी हंगामातील एक महत्त्वाचे तृणधान्य पीक आहे, ज्यासाठी थंड हवामान, मध्यम पाऊस आणि चिकणमातीची जमीन आवश्यक असते.',
      varieties: 'लोक-१, जीडब्ल्यू ४९६, एचडी २१८९, एमएसीएस २४९६',
      seedBrands: 'महाबीज, श्रीराम सीड्स, जेके सीड्स, पायोनिअर'
    },
    hi: {
      category: 'अनाज',
      expectedYield: '15-20 क्विंटल/एकड़',
      description: 'गेहूं एक महत्वपूर्ण रबी अनाज फसल है, जिसे ठंडी जलवायु और दोमट मिट्टी की आवश्यकता होती है।',
      varieties: 'लोक-1, जीडब्ल्यू 496, एचडी 2189, एमएसीएस 2496',
      seedBrands: 'महाबीज, श्रीराम सीड्स, जेके सीड्स'
    }
  },
  'Rice (Bhat / धान / भात)': {
    mr: {
      category: 'तृणधान्य',
      expectedYield: '१८-२२ क्विंटल/एकर',
      description: 'भात हे मुख्य खरीप पीक असून त्यासाठी जास्त तापमान, जास्त आर्द्रता आणि सुरुवातीच्या काळात शेतात साठलेले पाणी आवश्यक असते.',
      varieties: 'इंद्रायणी, बासमती ३७०, जया, फुले समृद्धी',
      seedBrands: 'सिंजेंटा, बायर, माहिस्को, महाबीज'
    },
    hi: {
      category: 'अनाज',
      expectedYield: '18-22 क्विंटल/एकड़',
      description: 'धान (चावल) मुख्य खरीप फसल है जिसे उच्च तापमान, अधिक आर्द्रता और शुरुआती चरणों में पानी की आवश्यकता होती है।',
      varieties: 'इंद्रायणी, बासमती 370, जया, फुले समृद्धि',
      seedBrands: 'सिंजेंटा, बायर, माहिस्को, महाबीज'
    }
  },
  'Sugarcane (Us / ऊस)': {
    mr: {
      category: 'नगदी पीक',
      expectedYield: '४०-५० टन/एकर',
      description: 'ऊस हे दीर्घ मुदतीचे उष्णकटिबंधीय नगदी पीक असून त्यासाठी जास्त तापमान, मुबलक पाणी आणि सुपीक जमीन लागते.',
      varieties: 'को ८६०३२ (नीरा), कोएम ०२६५ (फुले २६५), को ९२००५',
      seedBrands: 'स्थानिक सहकारी साखर कारखाने, वसंतदादा शुगर इन्स्टिट्यूट (VSI) रोपवाटिका'
    },
    hi: {
      category: 'नकदी फसल',
      expectedYield: '40-50 टन/एकड़',
      description: 'गन्ना एक लंबी अवधि की उष्णकटिबंधीय नकदी फसल है जिसके लिए उच्च तापमान और प्रचुर पानी की आवश्यकता होती है।',
      varieties: 'को 86032, कोएम 0265, को 92005',
      seedBrands: 'स्थानीय सहकारी चीनी मिलें, वीएसआई नर्सरी'
    }
  },
  'Tur / Pigeon Pea (तूर)': {
    mr: {
      category: 'कडधान्य / डाळ',
      expectedYield: '६-८ क्विंटल/एकर',
      description: 'तूर हे प्रथिनांनी समृद्ध असलेले एक महत्त्वाचे कडधान्य पीक आहे, जे प्रामुख्याने निम-कोरड्या भागात कोरडवाहू पीक म्हणून घेतले जाते.',
      varieties: 'विपुला, बीडीएन ७११, बीएसएमआर ७३६ (मारुती), फुले राजेश्वरी',
      seedBrands: 'महाबीज, फुले सीड्स, स्थानिक मान्यताप्राप्त विक्रेते'
    },
    hi: {
      category: 'दलहन',
      expectedYield: '6-8 क्विंटल/एकड़',
      description: 'अरहर (तूर) प्रोटीन से भरपूर एक महत्वपूर्ण दलहन फसल है, जो मुख्य रूप से वर्षा आधारित क्षेत्रों में उगाई जाती है।',
      varieties: 'विपुला, बीडीएन 711, बीएसएमआर 736, फुले राजेश्वरी',
      seedBrands: 'महाबीज, फुले सीड्स'
    }
  },
  'Chickpea / Harbhara (हरभरा)': {
    mr: {
      category: 'कडधान्य / डाळ',
      expectedYield: '७-९ क्विंटल/एकर',
      description: 'हरभरा हे रब्बी हंगामातील मुख्य कडधान्य पीक असून ते थंड हवामान आणि जमिनीतील उरलेल्या ओलाव्यावर चांगले वाढते.',
      varieties: 'विजय, दिग्विजय, जेएकेआय ९२१८, फुले विक्रम',
      seedBrands: 'महाबीज, स्थानिक शेतकरी सहकारी संस्था'
    },
    hi: {
      category: 'दलहन',
      expectedYield: '7-9 क्विंटल/एकड़',
      description: 'चना (हरभरा) रबी सीजन की मुख्य दलहनी फसल है जो ठंडे मौसम और मिट्टी की अवशिष्ट नमी पर निर्भर करती है।',
      varieties: 'विजय, दिग्विजय, जेएकेआई 9218, फुले विक्रम',
      seedBrands: 'महाबीज, स्थानीय समितियों'
    }
  },
  'Groundnut (Bhuimug / भुईमूग)': {
    mr: {
      category: 'तेलबिया',
      expectedYield: '१०-१२ क्विंटल/एकर',
      description: 'भुईमूग हे एक महत्त्वाचे तेलबिया पीक आहे जे वालुकामय लोम मातीमध्ये चांगले वाढते आणि त्याला मध्यम पावसाची आवश्यकता असते.',
      varieties: 'टीएजी २४, फुले व्यास, एसबी ११, टीजी ३७ए',
      seedBrands: 'महाबीज, ईगल सीड्स, स्थानिक बियाणे विक्रेते'
    },
    hi: {
      category: 'तिलहन',
      expectedYield: '10-12 क्विंटल/एकड़',
      description: 'मूंगफली एक आवश्यक तिलहन फसल है जो बलुई दोमट मिट्टी में अच्छी तरह बढ़ती है और इसे मध्यम बारिश की आवश्यकता होती है।',
      varieties: 'टीएजी 24, फुले व्यास, एसबी 11, टीजी 37ए',
      seedBrands: 'महाबीज, ईगल सीड्स'
    }
  },
  'Onion (Kanda / कांदा)': {
    mr: {
      category: 'भाजीपाला',
      expectedYield: '१००-१२० क्विंटल/एकर',
      description: 'कांदा हे एक महत्त्वाचे नगदी भाजीपाला पीक असून ते चांगला निचरा होणाऱ्या मध्यम ते हलक्या जमिनीत तिन्ही हंगामात (खरीप, रांगडा, रब्बी) घेतले जाते.',
      varieties: 'एन-२-४-१, बसवंत ७८०, फुले सुवर्णा, भीमा किरण',
      seedBrands: 'पंचगंगा सीड्स, कलश सीड्स, सफल सीड्स, भीमा रेड (DOGR)'
    },
    hi: {
      category: 'सब्जी',
      expectedYield: '100-120 क्विंटल/एकड़',
      description: 'प्याज़ एक उच्च मूल्य वाली सब्जी फसल है जिसे जल निकास वाली दोमट मिट्टी में कई मौसमों में उगाया जाता है।',
      varieties: 'एन-2-4-1, बसवंत 780, फुले सुवर्णा, भीमा किरण',
      seedBrands: 'पंचगंगा सीड्स, कलश सीड्स, सफल सीड्स'
    }
  },
  'Tomato (टोमॅटो)': {
    mr: {
      category: 'भाजीपाला',
      expectedYield: '१५०-२०० क्विंटल/एकर',
      description: 'टोमॅटो हे मोठ्या प्रमाणावर घेतले जाणारे व्यावसायिक भाजीपाला पीक असून ते जास्त थंडी आणि पाणी साठून राहण्यास संवेदनशील असते.',
      varieties: 'अभिनव, जयश्री, फुले राजा, वैशाली',
      seedBrands: 'सिंजेंटा, सेमिनिस (बायर), नामधारी सीड्स'
    },
    hi: {
      category: 'सब्जी',
      expectedYield: '150-200 क्विंटल/एकड़',
      description: 'टमाटर एक व्यापक रूप से उगाई जाने वाली व्यावसायिक सब्जी है जो पाले और जलजमाव के प्रति संवेदनशील होती है।',
      varieties: 'अभिनव, जयश्री, फुले राजा, वैशाली',
      seedBrands: 'सिंजेंटा, सेमिनिस (बायर), नामधारी सीड्स'
    }
  },
  'Maize (Maka / मका)': {
    mr: {
      category: 'तृणधान्य',
      expectedYield: '२०-२५ क्विंटल/एकर',
      description: 'मका हे अन्नधान्य, चारा आणि औद्योगिक वापरासाठी लागणारे एक महत्त्वाचे पीक असून ते वेगवेगळ्या हवामानात चांगले येते.',
      varieties: 'राजर्षी, गंगा ११, पायोनिअर ३०V९२, डिकालब ९१०८',
      seedBrands: 'पायोनिअर, डिकालब/बायर, सिंजेंटा'
    },
    hi: {
      category: 'अनाज',
      expectedYield: '20-25 क्विंटल/एकड़',
      description: 'मक्का भोजन, चारा और औद्योगिक उपयोग के लिए उगाई जाने वाली बहुमुखी फसल है जो विभिन्न जलवायु में बढ़ती है।',
      varieties: 'राजर्षि, गंगा 11, पायनियर 30वी92, डेकाल्ब 9108',
      seedBrands: 'पायनियर, डेकाल्ब (बायर), सिंजेंटा'
    }
  },
  'Bajra (बाजरी)': {
    mr: {
      category: 'तृणधान्य',
      expectedYield: '८-१० क्विंटल/एकर',
      description: 'बाजरी हे कमी पावसात आणि हलक्या वालुकामय जमिनीत येणारे एक महत्त्वाचे दुष्काळ सहन करणारे तृणधान्य पीक आहे.',
      varieties: 'आयसीटीपी ८२०३, फुले आदिशक्ती, पायोनिअर ८६M८६, श्रद्धा',
      seedBrands: 'पायोनिअर, कावेरी सीड्स, देवगेन, श्रद्धा (माहिको)'
    },
    hi: {
      category: 'अनाज',
      expectedYield: '8-10 क्विंटल/एकड़',
      description: 'बाजरा एक सूखा-सहनशील अनाज फसल है जो रेतीली मिट्टी और गर्म क्षेत्रों में उगाई जाती है।',
      varieties: 'आईसीटीपी 8203, फुले आदिशक्ति, पायनियर 86एम86, श्रद्धा',
      seedBrands: 'पायनियर, कावेरी सीड्स, देवगेन'
    }
  },
  'Jowar (ज्वारी)': {
    mr: {
      category: 'तृणधान्य',
      expectedYield: '१०-१२ क्विंटल/एकर',
      description: 'ज्वारी हे कमी पाण्यात येणारे मुख्य अन्नधान्य आणि चारा पीक असून ते खरीप व रब्बी दोन्ही हंगामात घेतले जाते.',
      varieties: 'दगडी, फुले वसुधा, सीएसव्ही २०, मालदांडी (एम-३५-१)',
      seedBrands: 'माहिको, कावेरी सीड्स, महाबीज'
    },
    hi: {
      category: 'अनाज',
      expectedYield: '10-12 क्विंटल/एकड़',
      description: 'ज्वार एक सूखा-प्रतिरोधी खाद्य और चारा फसल है जो खरीफ और रबी दोनों मौसमों में उगाई जाती है।',
      varieties: 'दगड़ी, फुले वसुधा, सीएसवी 20, मालदांडी (एम-35-1)',
      seedBrands: 'माहिको, कावेरी सीड्स, महाबीज'
    }
  },
  'Grapes (Drakshe / द्राक्षे)': {
    mr: {
      category: 'फळ पीक',
      expectedYield: '१०-१२ टन/एकर',
      description: 'द्राक्षे हे एक उच्च दर्जाचे व्यावसायिक फळ पीक असून त्यासाठी उष्ण, कोरडे हवामान आणि मंडप/तार पद्धतीची आवश्यकता असते.',
      varieties: 'थॉमसन सीडलेस, शरद सीडलेस, तास-ए-गणेश, माणिक चमन',
      seedBrands: 'राष्ट्रीय द्राक्ष संशोधन केंद्र (NRC) पुणे, अधिकृत नर्सरी'
    },
    hi: {
      category: 'फल',
      expectedYield: '10-12 टन/एकड़',
      description: 'अंगूर एक उच्च मूल्य वाली व्यावसायिक फल फसल है जिसके लिए गर्म, शुष्क मौसम की आवश्यकता होती है।',
      varieties: 'थॉम्पसन सीडलेस, शरद सीडलेस, तस-ए-गणेश, माणिक चमन',
      seedBrands: 'एनआरसी अंगूर पुणे, प्रमाणित नर्सरी'
    }
  },
  'Pomegranate (Dalimb / डाळिंब)': {
    mr: {
      category: 'फळ पीक',
      expectedYield: '६-८ टन/एकर',
      description: 'डाळिंब हे कोरड्या व निम-कोरड्या हवामानात येणारे एक अत्यंत फायदेशीर आणि पाण्याचा ताण सहन करणारे पीक आहे.',
      varieties: 'भगवा (शेंदरी), गणेश, मृदुला, फुले आरक्ता',
      seedBrands: 'महात्मा फुले कृषी विद्यापीठ (MPKV) राहुरी नर्सरी, टीशू कल्चर लॅब्स'
    },
    hi: {
      category: 'फल',
      expectedYield: '6-8 टन/एकड़',
      description: 'अनार अर्ध-शुष्क क्षेत्रों के लिए उपयुक्त एक लचीली फल फसल है जो सूखे को सहन कर सकती है।',
      varieties: 'भगवा (शेंदरी), गणेश, मृदुला, फुले अरक्ता',
      seedBrands: 'एमपीकेवी राहुरी नर्सरी, टिशू कल्चर लैब'
    }
  },
  'Mango (Amba / आंबा)': {
    mr: {
      category: 'फळ पीक',
      expectedYield: '४-५ टन/एकर',
      description: 'आंबा हा फळांचा राजा असून तो बहुवार्षिक फळझाड म्हणून उष्ण हवामानात आणि कोरड्या हंगामात चांगला वाढतो.',
      varieties: 'हापूस (अल्फांसो), केशर, तोतापुरी, यारी',
      seedBrands: 'बाळासाहेब सावंत कोकण कृषी विद्यापीठ, अधिकृत सरकारी नर्सरी'
    },
    hi: {
      category: 'फल',
      expectedYield: '4-5 टन/एकड़',
      description: 'आम फलों का राजा है, जो गर्म जलवायु और फूल आने के दौरान शुष्क मौसम में बढ़ता है।',
      varieties: 'अल्फांसो (हापुस), केसर, तोतापुरी, पायरी',
      seedBrands: 'कृषि विश्वविद्यालय नर्सरी, सरकारी नर्सरी'
    }
  },
  'Banana (Keli / केळी)': {
    mr: {
      category: 'फळ पीक',
      expectedYield: '२५-३० टन/एकर',
      description: 'केळी हे मुबलक पाणी आणि खते लागणारे उष्णकटिबंधीय फळ पीक असून त्यासाठी सुपीक कसदार जमीन आणि वारा नसलेली जागा हवी.',
      varieties: 'ग्रँड नैन (जी-९), श्रीमंती, बसराई, रोबस्टा',
      seedBrands: 'जैन इरिगेशन सिस्टीम्स (टीशू कल्चर), अधिकृत लॅबोरेटरीज'
    },
    hi: {
      category: 'फल',
      expectedYield: '25-30 टन/एकड़',
      description: 'केला एक पानी-सघन उष्णकटिबंधीय फल है जिसके लिए उपजाऊ मिट्टी की आवश्यकता होती है।',
      varieties: 'ग्रैंड नैन (जी-9), श्रीमंती, बसराई, रोबस्टा',
      seedBrands: 'जैन इरीगेशन (टिशू कल्चर), अधिकृत लैब'
    }
  },
  'Turmeric (Halad / हळद)': {
    mr: {
      category: 'मसाले',
      expectedYield: '२०-२५ क्विंटल/एकर',
      description: 'हळद हे जमिनीखाली येणाऱ्या औषधी कंदांसाठी लावले जाणारे एक महत्त्वाचे व्यावसायिक मसाल्याचे पीक आहे.',
      varieties: 'सेलम, कृष्णा, फुले वायगाव, टेकुरपेट',
      seedBrands: 'भारतीय मसाला संशोधन संस्था (IISR), स्थानिक प्रमाणित प्रगतीशील शेतकरी'
    },
    hi: {
      category: 'मसाले',
      expectedYield: '20-25 क्विंटल/एकड़',
      description: 'हल्दी एक मूल्यवान व्यावसायिक मसाला फसल है जो अपनी औषधीय कंदों (rhizomes) के लिए उगाई जाती है।',
      varieties: 'सेलम, कृष्णा, फुले वायगांव, टेकुरपेट',
      seedBrands: 'आईआईएसआर कोझिकोड, प्रमाणित किसान'
    }
  },
  'Ginger (Ale / आले)': {
    mr: {
      category: 'मसाले',
      expectedYield: '१५-२० क्विंटल/एकर',
      description: 'आले हे सावलीत आणि चांगला निचरा होणाऱ्या जमिनीत याणारे नगदी मसाल्याचे पीक असून त्याला उष्ण व दमट हवामान लागते.',
      varieties: 'माहिम, वरदा, आयआयएसआर रजत, सुप्रभा',
      seedBrands: 'भारतीय मसाला संशोधन संस्था (IISR), स्थानिक बेणे उत्पादक'
    },
    hi: {
      category: 'मसाले',
      expectedYield: '15-20 क्विंटल/एकड़',
      description: 'अदरक एक महत्वपूर्ण नकदी मसाला फसल है जिसे गर्म, नम जलवायु और आंशिक छाया की आवश्यकता होती है।',
      varieties: 'माहिम, वरदा, आईआईएसआर रजत, सुप्रभा',
      seedBrands: 'आईआईएसआर कोझिकोड, स्थानीय उत्पादक'
    }
  },
  'Chilli (Mirchi / मिरची)': {
    mr: {
      category: 'भाजीपाला',
      expectedYield: '८-१० टन/एकर',
      description: 'मिरची हे तिखट आणि भाजी म्हणून वापरले जाणारे पीक असून त्यासाठी उष्ण हवामान आणि पाण्याचा उत्तम निचरा लागते.',
      varieties: 'ज्वाला, फुले मुक्ता, जी-४, संकेश्वरी',
      seedBrands: 'सिंजेंटा (हॉट पेपर), सेमिनिस, नामधारी सीड्स'
    },
    hi: {
      category: 'सब्जी',
      expectedYield: '8-10 टन/एकड़',
      description: 'मिर्च एक प्रमुख मसाला और सब्जी फसल है जिसे गर्म मौसम और अच्छी धूप की आवश्यकता होती है।',
      varieties: 'ज्वाला, फुले मुक्ता, जी-4, संकेश्वरी',
      seedBrands: 'सिंजेंटा, सेमिनिस, नामधारी सीड्स'
    }
  }
};

const translateStageName = (stageName: string, lang: string) => {
  if (!stageName) return '';
  if (lang !== 'mr' && lang !== 'hi') return stageName;

  const dictionary: Record<string, Record<string, string>> = {
    'sowing': { mr: 'पेरणी', hi: 'बुवाई' },
    'vegetative': { mr: 'शाकीय वाढ अवस्था', hi: 'वानस्पतिक वृद्धि चरण' },
    'flowering': { mr: 'फूल धारणा अवस्था', hi: 'फूल आने का चरण' },
    'pod formation': { mr: 'शेंगा भरणे अवस्था', hi: 'फली निर्माण चरण' },
    'maturity': { mr: 'परिपक्वता अवस्था', hi: 'परिपक्वता चरण' },
    'harvest': { mr: 'काढणी', hi: 'कटाई' },
    'active': { mr: 'सक्रिय', hi: 'सक्रिय' }
  };

  const lower = stageName.toLowerCase().trim();
  for (const [key, trans] of Object.entries(dictionary)) {
    if (lower.includes(key)) {
      return trans[lang];
    }
  }

  return stageName;
};

const translateGuideAndText = (text: string, lang: string) => {
  if (!text) return '';
  if (lang !== 'mr' && lang !== 'hi') return text;

  let translated = text;

  if (lang === 'mr') {
    translated = translated
      .replace('Deep ploughing in summer', 'उन्हाळ्यात खोल नांगरणी')
      .replace('Spacing of 90x60 cm or 120x60 cm', '९०x६० सेमी किंवा १२०x६० सेमी अंतर')
      .replace('Pre-sowing seed treatment with Imidacloprid (7g/kg) to protect against early sucking pests', 'सुरुवातीच्या रसशोषक किडींपासून संरक्षणासाठी इमिडाक्लोप्रिड (७ ग्रॅम/किलो) सह पेरणीपूर्व बीजप्रक्रिया')
      .replace('First spray at 25-30 days after sowing', 'पेरणीनंतर २५-३० दिवसांनी पहिली फवारणी')
      
      .replace('Ploughing followed by 2 harrowings', 'नांगरणी आणि त्यानंतर २ वेळा कुळवणी')
      .replace('Spacing of 45x15 cm', '४५x१५ सेमी अंतर')
      .replace('Sowing depth of 3-5 cm', '३-५ सेमी खोलीवर पेरणी')
      .replace('Seed treatment with Carboxin + Thiram (2g/kg) and Rhizobium culture', 'कार्बोक्सिन + थायरम (२ ग्रॅम/किलो) आणि रायझोबियम कल्चरसह बीजप्रक्रिया')
      .replace('First spray at 20 days after sowing', 'पेरणीनंतर २० दिवसांनी पहिली फवारणी')
      
      .replace('Fine seedbed preparation by 2-3 harrowings', '२-३ वेळा कुळवणी करून जमीन भुसभुशीत करणे')
      .replace('Sowing at spacing of 22.5 cm in lines', '२२.५ सेमी अंतरावर ओळीत पेरणी')
      .replace('Pre-irrigation required before sowing', 'पेरणीपूर्वी जमीन ओलवून घेणे आवश्यक')
      .replace('Seed treatment with Vitavax (2g/kg)', 'विटावॅक्स (२ ग्रॅम/किलो) सह बीजप्रक्रिया')
      .replace('First spray or weeding at 21 days', '२१ दिवसांनी पहिली फवारणी किंवा खुरपणी')
      
      .replace('Puddling of soil is critical', 'जमिनीची चिखलणी करणे अत्यंत महत्त्वाचे आहे')
      .replace('Sowing in nursery beds, then transplanting 21-25 days old seedlings into the main field with 20x15 cm spacing', 'रोपवाटिकेमध्ये पेरणी करणे, नंतर २१-२५ दिवसांची रोपे २०x१५ सेमी अंतरावर मुख्य शेतात लावणी करणे')
      .replace('Keep 2-5 cm of water level in the field', 'शेतात २-५ सेमी पाण्याची पातळी राखा')
      .replace('First spray at nursery stage', 'रोपवाटिका अवस्थेत पहिली फवारणी')
      
      .replace('Deep ploughing up to 30 cm', '३० सेमी पर्यंत खोल नांगरणी')
      .replace('Ridge and furrow method at 120 cm spacing', '१२० सेमी अंतरावर सरी-वरंबा पद्धत')
      .replace('Setts treatment with Carbendazim (0.1%) and Malathion (0.1%) for 15 mins before planting', 'लागवडीपूर्वी १५ मिनिटे कार्बेन्डाझिम (०.१%) आणि मॅलेथिऑन (०.१%) सह बेणे प्रक्रिया')
      .replace('First earthing up at 4 months', '४ महिन्यांनी पहिली बाळभरणी करणे')
      
      .replace('Grows best in deep, well-drained loamy soils', 'खोल, चांगला निचरा होणाऱ्या लोमी जमिनीत उत्तम वाढते')
      .replace('Spacing 90x20 cm or 120x30 cm', '९०x२० सेमी किंवा १२०x३० सेमी अंतर')
      .replace('Seed treatment with Trichoderma (5g/kg) and Rhizobium', 'ट्रायकोडर्मा (५ ग्रॅम/किलो) आणि रायझोबियमसह बीजप्रक्रिया')
      .replace('Intercropping with Soybean (1:2 ratio) is highly recommended', 'सोयाबीनसोबत आंतरपीक (१:२ प्रमाण) घेण्याची शिफारस केली जाते')
      
      .replace('Sow in residual soil moisture after Kharif harvest', 'खरीप काढणीनंतर जमिनीतील उर्वरित ओलाव्यावर पेरणी करावी')
      .replace('Spacing 30x10 cm', '३०x१० सेमी अंतर')
      .replace('Seed treatment with Trichoderma (5g/kg) and Ammonium Molybdate', 'ट्रायकोडर्मा (५ ग्रॅम/किलो) आणि अमोनियम मॉलिब्डेटसह बीजप्रक्रिया')
      .replace('Nipping of terminal buds at 30-35 days to promote branching', 'फांद्या वाढवण्यासाठी ३०-३५ दिवसांनी पिकाचा शेंडा खुडणे')
      
      .replace('Sandy loam soils are ideal', 'वालुकामय लोम जमीन आदर्श आहे')
      .replace('Seed treatment with Trichoderma (4g/kg)', 'ट्रायकोडर्मा (४ ग्रॅम/किलो) सह बीजप्रक्रिया')
      .replace('Apply Gypsum (200kg/acre) at flowering stage (40-45 days after sowing) to ensure proper pod development', 'शेंगांच्या योग्य विकासासाठी फूल धारणा अवस्थेत (पेरणीनंतर ४०-४५ दिवसांनी) जिप्सम (२०० किलो/एकर) टाकावे')
      
      .replace('Raise seedlings in nursery beds for 40-45 days', 'रोपवाटिकेत ४०-४५ दिवस रोपे तयार करावीत')
      .replace('Transplant in ridges/furrows at 15x10 cm spacing', 'सरी-वरंब्यावर १५x१० सेमी अंतरावर लावणी करावी')
      .replace('Requires light, well-drained soils', 'हलकी, पाण्याचा निचरा होणारी जमीन लागते')
      .replace('First weeding and light irrigation at 15 days post transplant', 'पुनर्लागवडीनंतर १५ दिवसांनी पहिली खुरपणी आणि हलके पाणी द्यावे')
      
      .replace('Raise nursery for 30 days', '३० दिवस रोपवाटिका तयार करा')
      .replace('Transplant at 60x45 cm spacing', '६०x४५ सेमी अंतरावर पुनर्लागवड करावी')
      .replace('Staking with bamboo poles is necessary at 30-35 days to support heavy fruiting', 'फळांच्या वजनामुळे झाडे पडू नयेत म्हणून ३०-३५ दिवसांनी बांबूच्या काठ्यांचा आधार देणे गरजेचे आहे')
      .replace('Drip irrigation and mulching sheets are highly recommended', 'ठिबक सिंचन आणि मल्चिंग पेपर वापरण्याची शिफारस केली जाते')
      
      .replace('Deep ploughing followed by harrowing', 'खोल नांगरणी आणि त्यानंतर कुळवणी')
      .replace('Spacing 60x20 cm', '६०x२० सेमी अंतर')
      .replace('Sow seeds at 5 cm depth', '५ सेमी खोलीवर बियाणे पेरावे')
      .replace('Seed treatment with Metalaxyl (4g/kg) against downy mildew', 'केवडा रोगाच्या प्रतिबंधासाठी मेटलॅक्सिल (४ ग्रॅम/किलो) सह बीजप्रक्रिया')
      .replace('First earthing up at 30 days', '३० दिवसांनी पहिली भरणी करणे')
      
      .replace('Requires light sandy loam soil', 'हलकी वालुकामय लोम जमीन लागते')
      .replace('Spacing 45x15 cm', '४५x१५ सेमी अंतर')
      .replace('Sowing depth of 2-3 cm', '२-३ सेमी खोलीवर पेरणी')
      .replace('Thrives in low moisture', 'कमी पाण्यातही चांगले उत्पादन येते')
      .replace('First inter-culturing and thinning at 15-20 days after sowing', 'पेरणीनंतर १५-२० दिवसांनी विरळणी आणि कोळपणी करावी')
      
      .replace('Sowing in well-drained clayey soils', 'उत्तम निचरा होणाऱ्या चिकणमातीत पेरणी')
      .replace('Seed treatment with Sulfur (3g/kg) for grain smut prevention', 'काणी रोगाच्या प्रतिबंधासाठी गंधक (३ ग्रॅम/किलो) सह बीजप्रक्रिया')
      .replace('First weeding and inter-culturing at 25-30 days', '२५-३० दिवसांनी पहिली खुरपणी आणि कोळपणी करावी')
      
      .replace('Requires training on Y-trellis or Bower system', 'वाय-ट्रेलीस किंवा मंडप पद्धतीवर वेली चढवणे आवश्यक')
      .replace('Spacing 3x1.8 meters', '३x१.८ मीटर अंतर')
      .replace('Pruning twice a year: Foundation pruning in April and Fruit pruning in October', 'वर्षातून दोनदा छाटणी: एप्रिलमध्ये खरड छाटणी आणि ऑक्टोबरमध्ये गोड छाटणी')
      .replace('Keep canopy open for sunlight', 'सूर्यप्रकाशासाठी झाडाची सावली मोकळी ठेवावी')
      
      .replace('Spacing of 4.5 x 3 meters', '४.५ x ३ मीटर अंतर')
      .replace('Sowing in pits of 60x60x60 cm', '६०x६०x६० सेमी आकाराच्या खड्ड्यात लागवड')
      .replace('Bahar management (Ambe/Mrig/Hasta bahar selection) based on water availability', 'पाण्याच्या उपलब्धतेनुसार बहार व्यवस्थापन करावे')
      .replace('Pruning after harvest is necessary', 'काढणीनंतर फांद्यांची छाटणी करणे गरजेचे आहे')
      
      .replace('Planting spacing of 10x10 meters (or 5x5 meters for high density)', '१०x१० मीटर अंतर (किंवा सघन लागवडीसाठी ५x५ मीटर)')
      .replace('Pit size of 1x1x1 meter filled with organic manure and bone meal', '१x१x१ मीटर आकाराचा खड्डा सेंद्रिय खत आणि बोन मीलने भरावा')
      .replace('Regular basin cleanings and mulching during dry seasons', 'कोरड्या हंगामात नियमित आळे साफ करणे आणि आच्छादन करणे')
      
      .replace('Spacing of 1.8x1.8 meters', '१.८x१.८ मीटर अंतर')
      .replace('Plant tissue culture plantlets in pits', 'खड्ड्यांमध्ये उती संवर्धन रोपे लावावीत')
      .replace('High requirements of Nitrogen and Potassium', 'नायट्रोजन आणि पोटॅशियमची जास्त गरज')
      .replace('Provide windbreak trees on borders', 'सीमांवर वारा रोखणारी झाडे लावावीत')
      .replace('Earthing up at 3-4 months to support stem', 'खोडाला आधार देण्यासाठी ३-४ महिन्यांनी मातीची भर द्यावी')
      
      .replace('Broad bed furrow (BBF) method is best', 'रुंद वरंबा सरी (BBF) पद्धत सर्वोत्तम आहे')
      .replace('Spacing of 30x15 cm on raised beds', 'गादीवाफ्यावर ३०x१५ सेमी अंतर')
      .replace('Mother rhizome sowing is preferred', 'मातृकंद लावण्यास प्राधान्य द्यावे')
      .replace('Mulching with leaves right after planting to retain moisture', 'लागवडीनंतर ओलावा टिकवून ठेवण्यासाठी पानांचे आच्छादन करावे')
      
      .replace('Grows best in partial shade', 'अंशतः सावलीत उत्तम वाढते')
      .replace('Sowing on raised beds of 15 cm height at 30x20 cm spacing', '१५ सेमी उंचीच्या गादीवाफ्यावर ३०x२० सेमी अंतरावर लागवड')
      .replace('Excellent drainage is essential to prevent rhizome rot', 'कंद सडणे टाळण्यासाठी पाण्याचा उत्कृष्ट निचरा असणे आवश्यक आहे')
      .replace('Organic mulching at sowing, 45, and 90 days', 'लागवडीच्या वेळी, ४५ व्या आणि ९० व्या दिवशी सेंद्रिय आच्छादन करावे')
      
      .replace('Transplant 30-35 days old seedlings', '३०-३५ दिवसांची रोपे पुनर्लागवड करावीत')
      .replace('Spacing 60x45 cm', '६०x४५ सेमी अंतर')
      .replace('Requires high potassium and calcium to prevent blossom end rot', 'फळ कुजणे रोखण्यासाठी जास्त पोटॅशियम आणि कॅल्शियमची आवश्यकता असते')
      .replace('Disease preventive sprays starting at 15 days post transplant', 'पुनर्लागवडीनंतर १५ दिवसांपासून रोग प्रतिबंधक फवारण्या सुरू कराव्यात');
  }

  return translated;
};

export const CropDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();

  const [crop, setCrop] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'fertilizer' | 'spray' | 'irrigation' | 'pests' | 'diseases'>('fertilizer');

  // Edit Crop fields state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    sowingDate: '',
    area: '',
    variety: '',
    status: 'active'
  });

  const handleEditClick = () => {
    if (!crop) return;
    setEditForm({
      sowingDate: crop.sowing_date,
      area: crop.area || '',
      variety: crop.variety || '',
      status: crop.status || 'active'
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/crops/${id}`, {
        sowingDate: editForm.sowingDate,
        area: editForm.area ? parseFloat(editForm.area) : undefined,
        variety: editForm.variety || undefined,
        status: editForm.status
      });
      setCrop(res.data);
      
      // Refetch recommendations immediately
      const recsRes = await axios.get(`/api/recommendations/${id}`);
      setRecommendations(recsRes.data);
      
      setIsEditing(false);
      toast.success('Crop details updated!');
    } catch (err) {
      toast.error('Failed to update details');
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [cropRes, recsRes] = await Promise.all([
          axios.get(`/api/crops/${id}`),
          axios.get(`/api/recommendations/${id}`)
        ]);
        setCrop(cropRes.data);
        setRecommendations(recsRes.data);
      } catch (err) {
        toast.error('Failed to load crop recommendation timeline');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!crop || !recommendations) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="text-center py-20">
          <p className="text-gray-500">Crop recommendations not found.</p>
          <Link to="/dashboard" className="text-primary hover:underline mt-4 inline-block">Go back to dashboard</Link>
        </div>
      </div>
    );
  }

  const trans = cropTranslations[crop.crop_master.name]?.[i18n.language as 'mr' | 'hi'];
  const description = trans?.description || crop.crop_master.description;
  const varieties = trans?.varieties || crop.crop_master.varieties;
  const seedBrands = trans?.seedBrands || recommendations.seedBrands;
  const category = trans?.category || crop.crop_master.category;
  const expectedYield = trans?.expectedYield || crop.crop_master.expected_yield;
  const cultivationGuide = translateGuideAndText(recommendations.cultivationGuide, i18n.language);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t('dashboard')}
        </Link>

        {/* Header Header */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex gap-4 items-center">
            <span className="text-4xl">🌱</span>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">{crop.crop_master.name}</h1>
              <p className="text-sm text-gray-500 mt-1">Sown on: {crop.sowing_date} • {crop.area ? `${crop.area} ${i18n.language === 'mr' ? 'एकर' : i18n.language === 'hi' ? 'एकड़' : 'Acres'}` : 'No area specified'}</p>
              <button 
                onClick={handleEditClick}
                className="text-xs bg-primary/10 text-primary font-bold px-3 py-1.5 rounded-lg mt-2 hover:bg-primary/20 transition-all flex items-center gap-1.5"
              >
                ✏️ Edit Details
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full md:w-auto">
            <div className="bg-green-50/50 p-4 rounded-xl border border-green-100/50 text-center">
              <span className="block text-xs font-bold text-gray-400 uppercase">{t('cropAge')}</span>
              <span className="text-lg font-black text-primary mt-1 block">{recommendations.daysSinceSowing} {t('days')}</span>
            </div>
            <div className="bg-green-50/50 p-4 rounded-xl border border-green-100/50 text-center">
              <span className="block text-xs font-bold text-gray-400 uppercase">{t('expectedHarvest')}</span>
              <span className="text-sm font-black text-primary mt-1 block">{recommendations.harvestDate}</span>
            </div>
            <div className="bg-green-50/50 p-4 rounded-xl border border-green-100/50 text-center col-span-2 sm:col-span-1">
              <span className="block text-xs font-bold text-gray-400 uppercase">{t('currentStage')}</span>
              <span className="text-xs font-black text-primary mt-1 block truncate">
                {translateStageName(recommendations.currentStage?.stageName || 'Sowing', i18n.language)}
              </span>
            </div>
          </div>
        </div>

        {/* Crop Information Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            ℹ️ {i18n.language === 'mr' ? 'पिकाची माहिती आणि मशागत मार्गदर्शिका' : i18n.language === 'hi' ? 'फसल की जानकारी और जुताई गाइड' : 'Crop Information & Cultivation Guide'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                <span className="font-bold text-gray-800 block mb-1">{i18n.language === 'mr' ? 'वर्णन' : i18n.language === 'hi' ? 'विवरण' : 'Description'}:</span>
                {description || 'No description available.'}
              </p>
              <p className="text-gray-600 leading-relaxed">
                <span className="font-bold text-gray-800 block mb-1">{i18n.language === 'mr' ? 'लागवड व मशागत मार्गदर्शिका' : i18n.language === 'hi' ? 'जुताई व खेती गाइड' : 'Cultivation Guide'}:</span>
                {cultivationGuide || 'General tillage practices recommended.'}
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                <span className="font-bold text-gray-800 block">{i18n.language === 'mr' ? 'शिफारस केलेल्या जाती' : i18n.language === 'hi' ? 'अनुशंसित किस्में' : 'Recommended Varieties'}:</span>
                <span className="text-primary font-semibold block mt-1">{varieties || 'N/A'}</span>
              </p>
              <p className="text-gray-600">
                <span className="font-bold text-gray-800 block">{i18n.language === 'mr' ? 'प्रमुख बियाणे कंपन्या व ब्रँड्स' : i18n.language === 'hi' ? 'प्रमुख बीज कंपनियां और ब्रांड' : 'Top Seed Companies & Brands'}:</span>
                <span className="text-gray-750 font-semibold block mt-1">{seedBrands || 'N/A'}</span>
              </p>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-bold">{i18n.language === 'mr' ? 'वर्ग' : i18n.language === 'hi' ? 'श्रेणी' : 'Category'}</span>
                  <span className="text-gray-700 font-bold">{category}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-bold">{i18n.language === 'mr' ? 'अपेक्षित उत्पन्न' : i18n.language === 'hi' ? 'अपेक्षित उपज' : 'Expected Yield'}</span>
                  <span className="text-gray-700 font-bold">{expectedYield}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar timeline */}
        {recommendations.currentStage && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> {i18n.language === 'mr' ? 'चालू टप्प्याची प्रगती' : i18n.language === 'hi' ? 'वर्तमान चरण की प्रगति' : 'Active Stage Progress'}
            </h3>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (recommendations.daysSinceSowing / crop.crop_master.duration_days) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-3 text-xs text-gray-500 font-semibold">
              <span>{i18n.language === 'mr' ? 'पेरणी (दिवस ०)' : i18n.language === 'hi' ? 'बुवाई (दिन 0)' : 'Sowing (Day 0)'}</span>
              <span>{translateStageName(recommendations.currentStage.stageName, i18n.language)}</span>
              <span>{i18n.language === 'mr' ? `काढणी (दिवस ${crop.crop_master.duration_days})` : i18n.language === 'hi' ? `कटाई (दिन ${crop.crop_master.duration_days})` : `Harvest (Day ${crop.crop_master.duration_days})`}</span>
            </div>
          </div>
        )}

        {/* Tabs and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation tab links */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm h-fit space-y-1">
            {[
              { id: 'fertilizer', label: t('fertilizers'), icon: Sparkles },
              { id: 'spray', label: t('sprays'), icon: Sprout },
              { id: 'irrigation', label: t('irrigation'), icon: Droplets },
              { id: 'pests', label: t('pests'), icon: ShieldAlert },
              { id: 'diseases', label: t('diseases'), icon: ShieldAlert }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2.5 ${
                    activeTab === tab.id 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content panel */}
          <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[300px]">
            {activeTab === 'fertilizer' && (
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-900">{t('fertilizers')}</h3>
                {recommendations.fertilizers.length === 0 ? (
                  <p className="text-gray-400 text-sm">No fertilizer recommendations required at this stage.</p>
                ) : (
                  <div className="space-y-4">
                    {recommendations.fertilizers.map((f: any) => (
                      <div key={f.id} className="p-4 rounded-xl bg-green-50/20 border border-green-100/50">
                        <h4 className="font-extrabold text-gray-900">{f.fertilizer_name}</h4>
                        <p className="text-sm text-gray-600 mt-1">Recommended Quantity: <span className="font-bold text-primary">{f.quantity}</span></p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'spray' && (
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-900">{t('sprays')}</h3>
                {recommendations.sprays.length === 0 ? (
                  <p className="text-gray-400 text-sm">No sprays schedules defined for current stage.</p>
                ) : (
                  <div className="space-y-4">
                    {recommendations.sprays.map((s: any) => (
                      <div key={s.id} className="p-4 rounded-xl bg-green-50/20 border border-green-100/50">
                        <h4 className="font-extrabold text-gray-900">{s.spray_name}</h4>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'irrigation' && (
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-900">{t('irrigation')}</h3>
                {recommendations.irrigation.length === 0 ? (
                  <p className="text-gray-400 text-sm">Standard rainfall suffices. No extra irrigation schedules active.</p>
                ) : (
                  <div className="space-y-4">
                    {recommendations.irrigation.map((i: any) => (
                      <div key={i.id} className="p-4 rounded-xl bg-green-50/20 border border-green-100/50">
                        <h4 className="font-extrabold text-gray-900">Water Requirement:</h4>
                        <p className="text-sm text-gray-600 mt-1">{i.water_requirement}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'pests' && (
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-900">Pests to watch out for</h3>
                {recommendations.pests.length === 0 ? (
                  <p className="text-gray-400 text-sm">No common pests reported for this crop type.</p>
                ) : (
                  <div className="space-y-6">
                    {recommendations.pests.map((p: any) => (
                      <div key={p.id} className="p-5 rounded-xl border border-red-100 bg-red-50/10">
                        <h4 className="font-extrabold text-red-700 text-lg">{p.name}</h4>
                        <p className="text-sm text-gray-600 mt-2"><span className="font-bold">Symptoms:</span> {p.symptoms}</p>
                        <p className="text-sm text-gray-600 mt-1"><span className="font-bold">Control Method:</span> {p.control_method}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'diseases' && (
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-900">Diseases risk & prevention</h3>
                {recommendations.diseases.length === 0 ? (
                  <p className="text-gray-400 text-sm">No common diseases reported for this crop type.</p>
                ) : (
                  <div className="space-y-6">
                    {recommendations.diseases.map((d: any) => (
                      <div key={d.id} className="p-5 rounded-xl border border-red-100 bg-red-50/10">
                        <h4 className="font-extrabold text-red-700 text-lg">{d.name}</h4>
                        <p className="text-sm text-gray-600 mt-2"><span className="font-bold">Symptoms:</span> {d.symptoms}</p>
                        <p className="text-sm text-gray-600 mt-1"><span className="font-bold">Treatment:</span> {d.treatment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Details Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-150 p-6 max-w-md w-full relative animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Edit Crop Details</h3>
            <p className="text-sm text-gray-500 mb-6">Modify details for your registered crop. Sowing date shifts will recalculate the stages timeline.</p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Sowing Date</label>
                <input 
                  type="date"
                  required
                  value={editForm.sowingDate}
                  onChange={e => setEditForm({ ...editForm, sowingDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Area (Acres)</label>
                  <input 
                    type="number"
                    step="0.1"
                    value={editForm.area}
                    onChange={e => setEditForm({ ...editForm, area: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Variety</label>
                  <input 
                    type="text"
                    value={editForm.variety}
                    onChange={e => setEditForm({ ...editForm, variety: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Crop Status</label>
                <select
                  value={editForm.status}
                  onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary bg-white font-medium"
                >
                  <option value="active">Active (सक्रिय)</option>
                  <option value="harvested">Harvested (काढणी झालेले)</option>
                  <option value="abandoned">Abandoned (सोडून दिलेले)</option>
                </select>
              </div>

              <div className="flex gap-3.5 justify-end pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="w-2/3 bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-xl text-sm transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
