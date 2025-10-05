import { useMemo } from 'react';
import type { Language } from '../types';

// FIX: Replaced JSON module imports with direct object literals to resolve browser compatibility issues with `import ... assert`.
// This avoids the "Uncaught SyntaxError: Unexpected identifier 'assert'" by removing the unsupported syntax.
const en = {
  "header": {
    "title": "Sawan Planner",
    "newAssessment": "Start New Assessment"
  },
  "landingPage": {
    "heroTitle": "Assess Your Rooftop Rainwater Harvesting Potential",
    "heroSubtitle": "Get a data-driven analysis of how much water you can save and how to recharge groundwater, complete with personalized recommendations, cost estimates, and a feasibility score.",
    "startAssessment": "Start New Assessment",
    "howItWorksTitle": "How It Works",
    "feature1Title": "1. Location-Specific Analysis",
    "feature1Text": "Uses local rainfall and groundwater data to estimate your rainwater harvesting potential.",
    "feature2Title": "2. AI-Powered Recommendations",
    "feature2Text": "Calculates harvestable water, suggests suitable recharge structures, and provides cost estimates.",
    "feature3Title": "3. Detailed PDF Reports",
    "feature3Text": "Download a complete summary of your assessment for your records and planning."
  },
  "wizard": {
    "errorTitle": "Assessment Failed:",
    "step1": {
      "title": "Step 1: Location & Roof Details",
      "subtitle": "Use the map tools to outline your roof. The area will be calculated automatically, but you can adjust it manually below.",
      "locateMe": "Locate Me",
      "drawRoof": "Draw Roof Area",
      "clearSelection": "Clear Selection",
      "instruction": {
        "start": "Click 'Draw Roof Area' to start.",
        "drawing": "Click corner {{count}} of 4",
        "done": "Roof area drawn. You can now proceed."
      },
      "roofAreaLabel": "Rooftop Area (m²)",
      "roofAreaPlaceholder": "e.g., 150",
      "roofAreaHelper": "Auto-calculated from map, but can be edited.",
      "roofMaterialLabel": "Rooftop Material",
      "nextButton": "Next"
    },
    "step2": {
      "title": "Step 2: Site & Household Details",
      "subtitle": "Provide a few more details to refine the assessment.",
      "openSpaceLabel": "Available Open Ground Space (m²)",
      "openSpacePlaceholder": "e.g., 20",
      "openSpaceHelper": "Permeable ground area for recharge structures.",
      "householdSizeLabel": "Number of People in Household",
      "householdSizePlaceholder": "e.g., 4",
      "backButton": "Back",
      "getAssessmentButton": "Get Assessment"
    }
  },
  "loading": {
    "title": "Generating Your Report",
    "messages": [
      "Consulting our Hydrogeology AI...",
      "Analyzing local rainfall patterns...",
      "Estimating groundwater levels...",
      "Designing optimal recharge structures...",
      "Calculating your potential savings...",
      "Creating your custom rainwater harvesting plan..."
    ]
  },
  "results": {
    "title": "Assessment Results",
    "reportFor": "Report for: {{location}}",
    "feasibilityScore": "Feasibility Score:",
    "potential": {
      "High": "High Potential",
      "Moderate": "Moderate Potential",
      "Low": "Low Potential"
    },
    "feasibilitySubtitle": "Based on your inputs and publicly available data for the {{location}} region.",
    "rwhPotentialTitle": "Net RWH Potential",
    "annualHarvestVolume": "Annual Harvestable Volume:",
    "annualHarvestVolumeUnit": "{{volume}} m³ / year (~ {{liters}} Liters)",
    "monsoonHarvest": "Monsoon Harvest:",
    "monsoonHarvestUnit": "{{volume}} m³",
    "avgRainfall": "Avg. Annual Rainfall ({{location}}):",
    "avgRainfallUnit": "{{rainfall}} mm",
    "rwhNote": "Net estimate including roof type and 10% system loss factor.",
    "financialTitle": "Financial Snapshot",
    "annualSavings": "Estimated Annual Savings:",
    "paybackPeriod": "Payback Period:",
    "paybackPeriodValue": "{{period}} years",
    "notApplicable": "N/A",
    "estimatedCost": "Total Estimated Cost:",
    "rechargeTitle": "Recommended Recharge Unit(s)",
    "rechargeCount": "{{count}} × {{type}}",
    "totalCapacity": "Total Capacity: {{capacity}} m³",
    "dimensions": "Dimensions: {{dimensions}}",
    "noStructure": "No recharge structure is recommended based on the calculated runoff volume and available space.",
    "aquiferTitle": "Local Aquifer Data",
    "groundwaterDepth": "Avg. Depth to Groundwater ({{location}}):",
    "groundwaterDepthValue": "{{depth}} meters",
    "hydroNoteTitle": "Hydrogeologist's Note:",
    "hydroNoteDisclaimer": "(Note: This note is AI-generated in English for technical accuracy.)",
    "downloadPdfButton": "Download PDF Report",
    "startNewButton": "Start New Assessment"
  }
};
const hi = {
  "header": {
    "title": "सावन प्लानर",
    "newAssessment": "नया मूल्यांकन शुरू करें"
  },
  "landingPage": {
    "heroTitle": "अपनी छत पर वर्षा जल संचयन क्षमता का आकलन करें",
    "heroSubtitle": "आप कितना पानी बचा सकते हैं और भूजल को कैसे रिचार्ज कर सकते हैं, इसका डेटा-संचालित विश्लेषण प्राप्त करें, जिसमें व्यक्तिगत सिफारिशें, लागत अनुमान और एक व्यवहार्यता स्कोर शामिल है।",
    "startAssessment": "नया मूल्यांकन शुरू करें",
    "howItWorksTitle": "यह कैसे काम करता है",
    "feature1Title": "1. स्थान-विशिष्ट विश्लेषण",
    "feature1Text": "आपकी वर्षा जल संचयन क्षमता का अनुमान लगाने के लिए स्थानीय वर्षा और भूजल डेटा का उपयोग करता है।",
    "feature2Title": "2. एआई-संचालित सिफारिशें",
    "feature2Text": "संचयन योग्य पानी की गणना करता है, उपयुक्त रिचार्ज संरचनाओं का सुझाव देता है, और लागत अनुमान प्रदान करता है।",
    "feature3Title": "3. विस्तृत पीडीएफ रिपोर्ट",
    "feature3Text": "अपने रिकॉर्ड और योजना के लिए अपने मूल्यांकन का एक पूरा सारांश डाउनलोड करें।"
  },
  "wizard": {
    "errorTitle": "मूल्यांकन विफल:",
    "step1": {
      "title": "चरण 1: स्थान और छत का विवरण",
      "subtitle": "अपनी छत की रूपरेखा बनाने के लिए मानचित्र टूल का उपयोग करें। क्षेत्र की गणना स्वचालित रूप से हो जाएगी, लेकिन आप इसे नीचे मैन्युअल रूप से समायोजित कर सकते हैं।",
      "locateMe": "मुझे खोजें",
      "drawRoof": "छत का क्षेत्र बनाएं",
      "clearSelection": "चयन साफ़ करें",
      "instruction": {
        "start": "शुरू करने के लिए 'छत का क्षेत्र बनाएं' पर क्लिक करें।",
        "drawing": "4 में से कोना {{count}} पर क्लिक करें",
        "done": "छत का क्षेत्र बन गया। अब आप आगे बढ़ सकते हैं।"
      },
      "roofAreaLabel": "छत का क्षेत्रफल (m²)",
      "roofAreaPlaceholder": "उदा., 150",
      "roofAreaHelper": "मानचित्र से स्वतः गणना, लेकिन संपादित किया जा सकता है।",
      "roofMaterialLabel": "छत की सामग्री",
      "nextButton": "अगला"
    },
    "step2": {
      "title": "चरण 2: साइट और घरेलू विवरण",
      "subtitle": "मूल्यांकन को परिष्कृत करने के लिए कुछ और विवरण प्रदान करें।",
      "openSpaceLabel": "उपलब्ध खुली जमीन की जगह (m²)",
      "openSpacePlaceholder": "उदा., 20",
      "openSpaceHelper": "रिचार्ज संरचनाओं के लिए पारगम्य जमीन क्षेत्र।",
      "householdSizeLabel": "घर में लोगों की संख्या",
      "householdSizePlaceholder": "उदा., 4",
      "backButton": "वापस",
      "getAssessmentButton": "मूल्यांकन प्राप्त करें"
    }
  },
  "loading": {
    "title": "आपकी रिपोर्ट तैयार हो रही है",
    "messages": [
      "हमारे हाइड्रोजियोलॉजी एआई से परामर्श...",
      "स्थानीय वर्षा पैटर्न का विश्लेषण...",
      "भूजल स्तर का अनुमान...",
      "इष्टतम रिचार्ज संरचनाओं का डिजाइन...",
      "आपकी संभावित बचत की गणना...",
      "आपकी कस्टम वर्षा जल संचयन योजना बनाना..."
    ]
  },
  "results": {
    "title": "मूल्यांकन के परिणाम",
    "reportFor": "रिपोर्ट: {{location}}",
    "feasibilityScore": "व्यवहार्यता स्कोर:",
    "potential": {
      "High": "उच्च क्षमता",
      "Moderate": "मध्यम क्षमता",
      "Low": "कम क्षमता"
    },
    "feasibilitySubtitle": "आपके इनपुट और {{location}} क्षेत्र के लिए सार्वजनिक रूप से उपलब्ध डेटा के आधार पर।",
    "rwhPotentialTitle": "नेट RWH क्षमता",
    "annualHarvestVolume": "वार्षिक संचयन योग्य मात्रा:",
    "annualHarvestVolumeUnit": "{{volume}} m³ / वर्ष (~ {{liters}} लीटर)",
    "monsoonHarvest": "मानसून संचयन:",
    "monsoonHarvestUnit": "{{volume}} m³",
    "avgRainfall": "औसत वार्षिक वर्षा ({{location}}):",
    "avgRainfallUnit": "{{rainfall}} मिमी",
    "rwhNote": "छत के प्रकार और 10% सिस्टम हानि कारक सहित शुद्ध अनुमान।",
    "financialTitle": "वित्तीय स्नैपशॉट",
    "annualSavings": "अनुमानित वार्षिक बचत:",
    "paybackPeriod": "भुगतान वापसी की अवधि:",
    "paybackPeriodValue": "{{period}} वर्ष",
    "notApplicable": "लागू नहीं",
    "estimatedCost": "कुल अनुमानित लागत:",
    "rechargeTitle": "अनुशंसित रिचार्ज यूनिट",
    "rechargeCount": "{{count}} × {{type}}",
    "totalCapacity": "कुल क्षमता: {{capacity}} m³",
    "dimensions": "आयाम: {{dimensions}}",
    "noStructure": "गणना की गई अपवाह मात्रा और उपलब्ध स्थान के आधार पर किसी भी रिचार्ज संरचना की सिफारिश नहीं की जाती है।",
    "aquiferTitle": "स्थानीय जलभृत डेटा",
    "groundwaterDepth": "भूजल की औसत गहराई ({{location}}):",
    "groundwaterDepthValue": "{{depth}} मीटर",
    "hydroNoteTitle": "हाइड्रोजियोलॉजिस्ट की टिप्पणी:",
    "hydroNoteDisclaimer": "(नोट: यह टिप्पणी तकनीकी सटीकता के लिए एआई द्वारा अंग्रेजी में उत्पन्न की गई है।)",
    "downloadPdfButton": "पीडीएफ रिपोर्ट डाउनलोड करें",
    "startNewButton": "नया मूल्यांकन शुरू करें"
  }
};
const bn = {
  "header": {
    "title": "সাওয়ান প্ল্যানার",
    "newAssessment": "নতুন মূল্যায়ন শুরু করুন"
  },
  "landingPage": {
    "heroTitle": "আপনার ছাদের বৃষ্টির জল সংগ্রহের সম্ভাবনা মূল্যায়ন করুন",
    "heroSubtitle": "আপনি কতটা জল সঞ্চয় করতে পারেন এবং কীভাবে ভূগর্ভস্থ জল রিচার্জ করতে পারেন তার একটি ডেটা-চালিত বিশ্লেষণ পান, ব্যক্তিগতকৃত সুপারিশ, খরচ অনুমান এবং একটি সম্ভাব্যতা স্কোর সহ।",
    "startAssessment": "নতুন মূল্যায়ন শুরু করুন",
    "howItWorksTitle": "এটা যেভাবে কাজ করে",
    "feature1Title": "১. অবস্থান-নির্দিষ্ট বিশ্লেষণ",
    "feature1Text": "আপনার বৃষ্টির জল সংগ্রহের সম্ভাবনা অনুমান করতে স্থানীয় বৃষ্টিপাত এবং ভূগর্ভস্থ জলের ডেটা ব্যবহার করে।",
    "feature2Title": "২. এআই-চালিত সুপারিশ",
    "feature2Text": "সংগ্রহযোগ্য জলের পরিমাণ গণনা করে, উপযুক্ত রিচার্জ কাঠামোর পরামর্শ দেয় এবং খরচের অনুমান প্রদান করে।",
    "feature3Title": "৩. বিস্তারিত পিডিএফ রিপোর্ট",
    "feature3Text": "আপনার রেকর্ড এবং পরিকল্পনার জন্য আপনার মূল্যায়নের একটি সম্পূর্ণ সারসংক্ষেপ ডাউনলোড করুন।"
  },
  "wizard": {
    "errorTitle": "মূল্যায়ন ব্যর্থ হয়েছে:",
    "step1": {
      "title": "ধাপ ১: অবস্থান এবং ছাদের বিবরণ",
      "subtitle": "আপনার ছাদের রূপরেখা তৈরি করতে মানচিত্র সরঞ্জাম ব্যবহার করুন। এলাকাটি স্বয়ংক্রিয়ভাবে গণনা করা হবে, তবে আপনি নীচে এটি ম্যানুয়ালি সামঞ্জস্য করতে পারেন।",
      "locateMe": "আমাকে খুঁজুন",
      "drawRoof": "ছাদের এলাকা আঁকুন",
      "clearSelection": "নির্বাচন সাফ করুন",
      "instruction": {
        "start": "শুরু করতে 'ছাদের এলাকা আঁকুন' ক্লিক করুন।",
        "drawing": "৪টির মধ্যে {{count}} নং কোণায় ক্লিক করুন",
        "done": "ছাদের এলাকা আঁকা হয়েছে। আপনি এখন এগিয়ে যেতে পারেন।"
      },
      "roofAreaLabel": "ছাদের ক্ষেত্রফল (m²)",
      "roofAreaPlaceholder": "যেমন, ১৫০",
      "roofAreaHelper": "মানচিত্র থেকে স্বয়ংক্রিয়ভাবে গণনা করা হয়েছে, তবে সম্পাদনা করা যেতে পারে।",
      "roofMaterialLabel": "ছাদের উপাদান",
      "nextButton": "পরবর্তী"
    },
    "step2": {
      "title": "ধাপ ২: সাইট এবং পরিবারের বিবরণ",
      "subtitle": "মূল্যায়ন পরিমার্জন করতে আরও কিছু বিবরণ প্রদান করুন।",
      "openSpaceLabel": "উপলব্ধ খোলা জায়গার পরিমাণ (m²)",
      "openSpacePlaceholder": "যেমন, ২০",
      "openSpaceHelper": "রিচার্জ কাঠামোর জন্য ভেদ্য স্থল এলাকা।",
      "householdSizeLabel": "পরিবারের সদস্য সংখ্যা",
      "householdSizePlaceholder": "যেমন, ৪",
      "backButton": "ফিরে যান",
      "getAssessmentButton": "মূল্যায়ন পান"
    }
  },
  "loading": {
    "title": "আপনার রিপোর্ট তৈরি হচ্ছে",
    "messages": [
      "আমাদের হাইড্রোজোলজি এআই-এর সাথে পরামর্শ...",
      "স্থানীয় বৃষ্টিপাতের ধরণ বিশ্লেষণ...",
      "ভূগর্ভস্থ জলের স্তর অনুমান...",
      "সর্বোত্তম রিচার্জ কাঠামোর নকশা...",
      "আপনার সম্ভাব্য সঞ্চয় গণনা...",
      "আপনার কাস্টম বৃষ্টির জল সংগ্রহ পরিকল্পনা তৈরি..."
    ]
  },
  "results": {
    "title": "মূল্যায়নের ফলাফল",
    "reportFor": "রিপোর্ট: {{location}}",
    "feasibilityScore": "সম্ভাব্যতা স্কোর:",
    "potential": {
      "High": "উচ্চ সম্ভাবনা",
      "Moderate": "মাঝারি সম্ভাবনা",
      "Low": "কম সম্ভাবনা"
    },
    "feasibilitySubtitle": "আপনার ইনপুট এবং {{location}} অঞ্চলের জন্য সর্বজনীনভাবে উপলব্ধ ডেটার উপর ভিত্তি করে।",
    "rwhPotentialTitle": "নেট RWH সম্ভাবনা",
    "annualHarvestVolume": "বার্ষিক সংগ্রহযোগ্য আয়তন:",
    "annualHarvestVolumeUnit": "{{volume}} m³ / বছর (~ {{liters}} লিটার)",
    "monsoonHarvest": "বর্ষা সংগ্রহ:",
    "monsoonHarvestUnit": "{{volume}} m³",
    "avgRainfall": "গড় বার্ষিক বৃষ্টিপাত ({{location}}):",
    "avgRainfallUnit": "{{rainfall}} মিমি",
    "rwhNote": "ছাদের ধরন এবং ১০% সিস্টেম ক্ষতি ফ্যাক্টর সহ নেট অনুমান।",
    "financialTitle": "আর্থিক চিত্র",
    "annualSavings": "আনুমানিক বার্ষিক সঞ্চয়:",
    "paybackPeriod": "পরিশোধের সময়কাল:",
    "paybackPeriodValue": "{{period}} বছর",
    "notApplicable": "প্রযোজ্য নয়",
    "estimatedCost": "মোট আনুমানিক খরচ:",
    "rechargeTitle": "প্রস্তাবিত রিচার্জ ইউনিট(গুলি)",
    "rechargeCount": "{{count}} × {{type}}",
    "totalCapacity": "মোট ক্ষমতা: {{capacity}} m³",
    "dimensions": "মাত্রা: {{dimensions}}",
    "noStructure": "গণনা করা জলের পরিমাণ এবং উপলব্ধ স্থানের উপর ভিত্তি করে কোনও রিচার্জ কাঠামোর সুপারিশ করা হয়নি।",
    "aquiferTitle": "স্থানীয় ভূগর্ভস্থ জলস্তর ডেটা",
    "groundwaterDepth": "ভূগর্ভস্থ জলের গড় গভীরতা ({{location}}):",
    "groundwaterDepthValue": "{{depth}} মিটার",
    "hydroNoteTitle": "হাইড্রোজোলজিস্টের নোট:",
    "hydroNoteDisclaimer": "(দ্রষ্টব্য: এই নোটটি প্রযুক্তিগত নির্ভুলতার জন্য এআই দ্বারা ইংরেজিতে তৈরি করা হয়েছে।)",
    "downloadPdfButton": "পিডিএফ রিপোর্ট ডাউনলোড করুন",
    "startNewButton": "নতুন মূল্যায়ন শুরু করুন"
  }
};
const ta = {
  "header": {
    "title": "சாவன் பிளானர்",
    "newAssessment": "புதிய மதிப்பீட்டைத் தொடங்கு"
  },
  "landingPage": {
    "heroTitle": "உங்கள் கூரை மழைநீர் சேகரிப்பு திறனை மதிப்பிடுங்கள்",
    "heroSubtitle": "தனிப்பயனாக்கப்பட்ட பரிந்துரைகள், செலவு மதிப்பீடுகள் மற்றும் சாத்தியக்கூறு மதிப்பெண்ணுடன், நீங்கள் எவ்வளவு தண்ணீரை சேமிக்க முடியும் மற்றும் நிலத்தடி நீரை எவ்வாறு రీசார்ஜ் செய்வது என்பது குறித்த தரவு சார்ந்த பகுப்பாய்வைப் பெறுங்கள்.",
    "startAssessment": "புதிய மதிப்பீட்டைத் தொடங்கு",
    "howItWorksTitle": "இது எப்படி வேலை செய்கிறது",
    "feature1Title": "1. இருப்பிடம் சார்ந்த பகுப்பாய்வு",
    "feature1Text": "உங்கள் மழைநீர் சேகரிப்பு திறனை மதிப்பிடுவதற்கு உள்ளூர் மழைப்பொழிவு மற்றும் நிலத்தடி நீர் தரவைப் பயன்படுத்துகிறது.",
    "feature2Title": "2. AI-இயங்கும் பரிந்துரைகள்",
    "feature2Text": "சேகரிக்கக்கூடிய நீரைக் கணக்கிடுகிறது, பொருத்தமான రీசார்ஜ் கட்டமைப்புகளைப் பரிந்துரைக்கிறது மற்றும் செலவு மதிப்பீடுகளை வழங்குகிறது.",
    "feature3Title": "3. விரிவான PDF அறிக்கைகள்",
    "feature3Text": "உங்கள் பதிவுகள் மற்றும் திட்டமிடலுக்காக உங்கள் மதிப்பீட்டின் முழுமையான சுருக்கத்தைப் பதிவிறக்கவும்."
  },
  "wizard": {
    "errorTitle": "மதிப்பீடு தோல்வியடைந்தது:",
    "step1": {
      "title": "படி 1: இருப்பிடம் மற்றும் கூரை விவரங்கள்",
      "subtitle": "உங்கள் கூரையை கோடிட்டுக் காட்ட வரைபடக் கருவிகளைப் பயன்படுத்தவும். பகுதி தானாகவே கணக்கிடப்படும், ஆனால் நீங்கள் அதை கீழே கைமுறையாக சரிசெய்யலாம்.",
      "locateMe": "என்னைக் கண்டுபிடி",
      "drawRoof": "கூரைப் பகுதியை வரையவும்",
      "clearSelection": "தேர்வை அழிக்கவும்",
      "instruction": {
        "start": "தொடங்க 'கூரைப் பகுதியை வரையவும்' என்பதைக் கிளிக் செய்யவும்.",
        "drawing": "4 இல் {{count}} மூலையைக் கிளிக் செய்யவும்",
        "done": "கூரைப் பகுதி வரையப்பட்டது. நீங்கள் இப்போது தொடரலாம்."
      },
      "roofAreaLabel": "கூரைப் பகுதி (m²)",
      "roofAreaPlaceholder": "எ.கா., 150",
      "roofAreaHelper": "வரைபடத்திலிருந்து தானாகக் கணக்கிடப்பட்டது, ஆனால் திருத்தலாம்.",
      "roofMaterialLabel": "கூரைப் பொருள்",
      "nextButton": "அடுத்து"
    },
    "step2": {
      "title": "படி 2: தளம் மற்றும் வீட்டு விவரங்கள்",
      "subtitle": "மதிப்பீட்டைச் செம்மைப்படுத்த இன்னும் சில விவரங்களை வழங்கவும்.",
      "openSpaceLabel": "கிடைக்கக்கூடிய திறந்தவெளி நிலப் பகுதி (m²)",
      "openSpacePlaceholder": "எ.கா., 20",
      "openSpaceHelper": "ரீசார்ஜ் கட்டமைப்புகளுக்கான ஊடுருவக்கூடிய நிலப் பகுதி.",
      "householdSizeLabel": "வீட்டில் உள்ளவர்களின் எண்ணிக்கை",
      "householdSizePlaceholder": "எ.கா., 4",
      "backButton": "பின்னால்",
      "getAssessmentButton": "மதிப்பீட்டைப் பெறு"
    }
  },
  "loading": {
    "title": "உங்கள் அறிக்கை உருவாக்கப்படுகிறது",
    "messages": [
      "எங்கள் ஹைட்ரோஜியாலஜி AI உடன் கலந்தாலோசிக்கிறது...",
      "உள்ளூர் மழைப்பொழிவு முறைகளை பகுப்பாய்வு செய்கிறது...",
      "நிலத்தடி நீர் மட்டங்களை மதிப்பிடுகிறது...",
      "உகந்த రీசார்ஜ் கட்டமைப்புகளை வடிவமைக்கிறது...",
      "உங்கள் சாத்தியமான சேமிப்புகளைக் கணக்கிடுகிறது...",
      "உங்கள் தனிப்பயன் மழைநீர் சேகரிப்பு திட்டத்தை உருவாக்குகிறது..."
    ]
  },
  "results": {
    "title": "மதிப்பீட்டு முடிவுகள்",
    "reportFor": "அறிக்கை: {{location}}",
    "feasibilityScore": "சாத்தியக்கூறு மதிப்பெண்:",
    "potential": {
      "High": "அதிக திறன்",
      "Moderate": "மிதமான திறன்",
      "Low": "குறைந்த திறன்"
    },
    "feasibilitySubtitle": "உங்கள் உள்ளீடுகள் மற்றும் {{location}} பகுதிக்கான பொதுவில் கிடைக்கும் தரவுகளின் அடிப்படையில்.",
    "rwhPotentialTitle": "நிகர RWH திறன்",
    "annualHarvestVolume": "ஆண்டுதோறும் சேகரிக்கக்கூடிய அளவு:",
    "annualHarvestVolumeUnit": "{{volume}} m³ / ஆண்டு (~ {{liters}} லிட்டர்கள்)",
    "monsoonHarvest": "பருவமழை அறுவடை:",
    "monsoonHarvestUnit": "{{volume}} m³",
    "avgRainfall": "சராசரி ஆண்டு மழைப்பொழிவு ({{location}}):",
    "avgRainfallUnit": "{{rainfall}} மிமீ",
    "rwhNote": "கூரை வகை மற்றும் 10% அமைப்பு இழப்புக் காரணி உட்பட நிகர மதிப்பீடு.",
    "financialTitle": "நிதிப் படம்",
    "annualSavings": "மதிப்பிடப்பட்ட ஆண்டு சேமிப்பு:",
    "paybackPeriod": "திரும்பச் செலுத்தும் காலம்:",
    "paybackPeriodValue": "{{period}} ஆண்டுகள்",
    "notApplicable": "பொருந்தாது",
    "estimatedCost": "மொத்த மதிப்பிடப்பட்ட செலவு:",
    "rechargeTitle": "பரிந்துரைக்கப்பட்ட రీசார்ஜ் அலகு(கள்)",
    "rechargeCount": "{{count}} × {{type}}",
    "totalCapacity": "மொத்த கொள்ளளவு: {{capacity}} m³",
    "dimensions": "பரிமாணங்கள்: {{dimensions}}",
    "noStructure": "கணக்கிடப்பட்ட ஓடும் நீரின் அளவு மற்றும் கிடைக்கக்கூடிய இடத்தின் அடிப்படையில் எந்த రీசார்ஜ் கட்டமைப்பும் பரிந்துரைக்கப்படவில்லை.",
    "aquiferTitle": "உள்ளூர் நிலத்தடி நீர் தரவு",
    "groundwaterDepth": "நிலத்தடி நீரின் சராசரி ஆழம் ({{location}}):",
    "groundwaterDepthValue": "{{depth}} மீட்டர்கள்",
    "hydroNoteTitle": "ஹைட்ரோஜியாலஜிஸ்ட் குறிப்பு:",
    "hydroNoteDisclaimer": "(குறிப்பு: இந்தக் குறிப்பு தொழில்நுட்பத் துல்லியத்திற்காக AI மூலம் ஆங்கிலத்தில் உருவாக்கப்பட்டது.)",
    "downloadPdfButton": "PDF அறிக்கையைப் பதிவிறக்கு",
    "startNewButton": "புதிய மதிப்பீட்டைத் தொடங்கு"
  }
};
const te = {
  "header": {
    "title": "సావన్ ప్లానర్",
    "newAssessment": "కొత్త మదింపును ప్రారంభించండి"
  },
  "landingPage": {
    "heroTitle": "మీ పైకప్పు వర్షపు నీటి సేకరణ సామర్థ్యాన్ని మదింపు చేయండి",
    "heroSubtitle": "వ్యక్తిగతీకరించిన సిఫార్సులు, వ్యయ అంచనాలు మరియు సాధ్యత స్కోర్‌తో, మీరు ఎంత నీటిని ఆదా చేయవచ్చో మరియు భూగర్భ జలాలను ఎలా రీఛార్జ్ చేయాలో అనే దానిపై డేటా-ఆధారిత విశ్లేషణను పొందండి.",
    "startAssessment": "కొత్త మదింపును ప్రారంభించండి",
    "howItWorksTitle": "ఇది ఎలా పనిచేస్తుంది",
    "feature1Title": "1. ప్రదేశ-నిర్దిష్ట విశ్లేషణ",
    "feature1Text": "మీ వర్షపు నీటి సేకరణ సామర్థ్యాన్ని అంచనా వేయడానికి స్థానిక వర్షపాతం మరియు భూగర్భ జలాల డేటాను ఉపయోగిస్తుంది.",
    "feature2Title": "2. AI-ఆధారిత సిఫార్సులు",
    "feature2Text": "సేకరించగల నీటిని గణిస్తుంది, తగిన రీఛార్జ్ నిర్మాణాలను సూచిస్తుంది మరియు వ్యయ అంచనాలను అందిస్తుంది.",
    "feature3Title": "3. వివరణాత్మక PDF నివేదికలు",
    "feature3Text": "మీ రికార్డులు మరియు ప్రణాళిక కోసం మీ మదింపు యొక్క పూర్తి సారాంశాన్ని డౌన్‌లోడ్ చేయండి."
  },
  "wizard": {
    "errorTitle": "మదింపు విఫలమైంది:",
    "step1": {
      "title": "దశ 1: ప్రదేశం & పైకప్పు వివరాలు",
      "subtitle": "మీ పైకప్పును గీయడానికి మ్యాప్ సాధనాలను ఉపయోగించండి. ప్రాంతం స్వయంచాలకంగా గణించబడుతుంది, కానీ మీరు దాన్ని క్రింద మాన్యువల్‌గా సర్దుబాటు చేయవచ్చు.",
      "locateMe": "నన్ను గుర్తించండి",
      "drawRoof": "పైకప్పు ప్రాంతాన్ని గీయండి",
      "clearSelection": "ఎంపికను క్లియర్ చేయండి",
      "instruction": {
        "start": "ప్రారంభించడానికి 'పైకప్పు ప్రాంతాన్ని గీయండి' క్లిక్ చేయండి.",
        "drawing": "4లో {{count}}వ మూలను క్లిక్ చేయండి",
        "done": "పైకప్పు ప్రాంతం గీయబడింది. మీరు ఇప్పుడు కొనసాగవచ్చు."
      },
      "roofAreaLabel": "పైకప్పు వైశాల్యం (m²)",
      "roofAreaPlaceholder": "ఉదా., 150",
      "roofAreaHelper": "మ్యాప్ నుండి స్వయంచాలకంగా గణించబడింది, కానీ సవరించవచ్చు.",
      "roofMaterialLabel": "పైకప్పు పదార్థం",
      "nextButton": "తదుపరి"
    },
    "step2": {
      "title": "దశ 2: సైట్ & గృహ వివరాలు",
      "subtitle": "మదింపును మెరుగుపరచడానికి మరికొన్ని వివరాలను అందించండి.",
      "openSpaceLabel": "అందుబాటులో ఉన్న ఖాళీ నేల స్థలం (m²)",
      "openSpacePlaceholder": "ఉదా., 20",
      "openSpaceHelper": "రీఛార్జ్ నిర్మాణాల కోసం పారగమ్య నేల ప్రాంతం.",
      "householdSizeLabel": "ఇంట్లో వ్యక్తుల సంఖ్య",
      "householdSizePlaceholder": "ఉదా., 4",
      "backButton": "వెనుకకు",
      "getAssessmentButton": "మదింపును పొందండి"
    }
  },
  "loading": {
    "title": "మీ నివేదికను రూపొందిస్తోంది",
    "messages": [
      "మా హైడ్రోజియాలజీ AIని సంప్రదిస్తోంది...",
      "స్థానిక వర్షపాత నమూనాలను విశ్లేషిస్తోంది...",
      "భూగర్భ జల మట్టాలను అంచనా వేస్తోంది...",
      "ఉత్తమ రీఛార్జ్ నిర్మాణాలను రూపకల్పన చేస్తోంది...",
      "మీ సంభావ్య ఆదాలను గణిస్తోంది...",
      "మీ అనుకూల వర్షపు నీటి సేకరణ ప్రణాళికను సృష్టిస్తోంది..."
    ]
  },
  "results": {
    "title": "మదింపు ఫలితాలు",
    "reportFor": "నివేదిక: {{location}}",
    "feasibilityScore": "సాధ్యత స్కోర్:",
    "potential": {
      "High": "అధిక సామర్థ్యం",
      "Moderate": "మధ్యస్థ సామర్థ్యం",
      "Low": "తక్కువ సామర్థ్యం"
    },
    "feasibilitySubtitle": "మీ ఇన్‌పుట్‌లు మరియు {{location}} ప్రాంతం కోసం పబ్లిక్‌గా అందుబాటులో ఉన్న డేటా ఆధారంగా.",
    "rwhPotentialTitle": "నికర RWH సామర్థ్యం",
    "annualHarvestVolume": "వార్షికంగా సేకరించగల పరిమాణం:",
    "annualHarvestVolumeUnit": "{{volume}} m³ / సంవత్సరం (~ {{liters}} లీటర్లు)",
    "monsoonHarvest": "రుతుపవన సేకరణ:",
    "monsoonHarvestUnit": "{{volume}} m³",
    "avgRainfall": "సగటు వార్షిక వర్షపాతం ({{location}}):",
    "avgRainfallUnit": "{{rainfall}} మిమీ",
    "rwhNote": "పైకప్పు రకం మరియు 10% సిస్టమ్ నష్ట కారకంతో సహా నికర అంచనా.",
    "financialTitle": "ఆర్థిక స్నాప్‌షాట్",
    "annualSavings": "అంచనా వేయబడిన వార్షిక ఆదా:",
    "paybackPeriod": "తిరిగి చెల్లింపు కాలం:",
    "paybackPeriodValue": "{{period}} సంవత్సరాలు",
    "notApplicable": "వర్తించదు",
    "estimatedCost": "మొత్తం అంచనా వ్యయం:",
    "rechargeTitle": "సిఫార్సు చేయబడిన రీఛార్జ్ యూనిట్(లు)",
    "rechargeCount": "{{count}} × {{type}}",
    "totalCapacity": "మొత్తం సామర్థ్యం: {{capacity}} m³",
    "dimensions": "కొలతలు: {{dimensions}}",
    "noStructure": "గణించిన ప్రవాహ పరిమాణం మరియు అందుబాటులో ఉన్న స్థలం ఆధారంగా ఏ రీఛార్జ్ నిర్మాణం సిఫార్సు చేయబడలేదు.",
    "aquiferTitle": "స్థానిక జలాశయ డేటా",
    "groundwaterDepth": "భూగర్భ జలాల సగటు లోతు ({{location}}):",
    "groundwaterDepthValue": "{{depth}} మీటర్లు",
    "hydroNoteTitle": "హైడ్రోజియాలజిస్ట్ గమనిక:",
    "hydroNoteDisclaimer": "(గమనిక: ఈ గమనిక సాంకేతిక ఖచ్చితత్వం కోసం AI ద్వారా ఆంగ్లంలో రూపొందించబడింది.)",
    "downloadPdfButton": "PDF నివేదికను డౌన్‌లోడ్ చేయండి",
    "startNewButton": "కొత్త మదింపును ప్రారంభించండి"
  }
};

const translations = { en, hi, bn, ta, te };

// Helper to get a nested property from an object using a string path
const get = (obj: any, path: string) => {
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
        if (result === undefined || result === null) {
            return undefined;
        }
        result = result[key];
    }
    return result;
};


export const useTranslations = (lang: Language) => {
    // The translation function `t` is updated to correctly handle both string and array value types. This consolidates logic from the previous t and tArray functions.
    const t = useMemo(() => (key: string, replacements?: { [key: string]: string | number }): string | string[] => {
        const langFile = translations[lang] || en;
        let translation = get(langFile, key) || get(en, key);

        if (translation === undefined) {
            console.warn(`Translation key '${key}' not found for language '${lang}'.`);
            return key;
        }

        if (Array.isArray(translation)) {
            return translation;
        }

        if (typeof translation === 'string') {
            if (replacements) {
                Object.keys(replacements).forEach(placeholder => {
                    translation = (translation as string).replace(`{{${placeholder}}}`, String(replacements[placeholder]));
                });
            }
            return translation;
        }
        
        console.warn(`Translation key '${key}' does not resolve to a string or array for language '${lang}'.`);
        return key;
    }, [lang]);

    return t;
};