import React, { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, Platform, Image, TextInput, Modal, Dimensions, Linking, LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import YoutubePlayer from 'react-native-youtube-iframe';
import Voice from 'react-native-voice';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// Suppress specific Expo Go notification error
LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed',
]);

const originalConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('expo-notifications: Android Push notifications')) {
    return;
  }
  originalConsoleError(...args);
};

try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch (e) {
  console.log('Notification setup skipped (Demo Mode)');
}


// API Configuration
const API_URL = 'http://192.168.0.208:8080/api';

const FALLBACK_HISTORY_DATA = [
  {
    id: 1,
    title: "History of Sri Sode Vadiraja Matha",
    titleKa: "ಸೋದೆ ಶ್ರೀ ವಾದಿರಾಜ ಮಠದ ಚರಿತ್ರೆ",
    contentEn: "Sri Madhwacharya, the proponent of Dvaita philosophy, established the Ashta Mathas (Eight Mathas) of Udupi and appointed his direct disciples as the heads. Sri Vishnutirtha, the younger brother of Sri Madhwacharya, was the first HEAD of the Sode Matha. The Matha received its current name 'Sode Sri Vadiraja Matha' during the tenure of the great saint Sri Vadiraja Teertharu.",
    contentKa: "ಶ್ರೀ ಮಧ್ವಾಚಾರ್ಯರು ಉಡುಪಿಯ ಅಷ್ಟಮಠಗಳನ್ನು ಸ್ಥಾಪಿಸಿದರು ಮತ್ತು ತಮ್ಮ ನೇರ ಶಿಷ್ಯರನ್ನು ಅದರ ಮುಖ್ಯಸ್ಥರನ್ನಾಗಿ ನೇಮಿಸಿದರು. ಶ್ರೀ ಮಧ್ವಾಚಾರ್ಯರ ಕಿರಿಯ ಸಹೋದರರಾದ ಶ್ರೀವಿಷ್ಣುತೀರ್ಥರು ಸೋದೆ ಮಠದ ಮೊದಲ ಪೀಠಾಧಿಪತಿಗಳಾಗಿದ್ದರು. ಮಹಾನ್ ಸಂತ ಶ್ರೀ ವಾದಿರಾಜ ತೀರ್ಥರ ಕಾಲದಲ್ಲಿ ಮಠಕ್ಕೆ 'ಸೋದೆ ಶ್ರೀ ವಾದಿರಾಜ ಮಠ' ಎಂಬ ಹೆಸರು ಬಂದಿತು."
  },
  {
    id: 2,
    title: "Sri Vadiraja Teertharu (1481 - 1600)",
    titleKa: "ಶ್ರೀ ವಾದಿರಾಜ ತೀರ್ಥರು (1481 - 1600)",
    contentEn: "Sri Vadiraja Teertharu is one of the most celebrated saints in the Madhva tradition. Born in Huvinakere, he was a child prodigy and took sanyasa at a very young age. He lived for 120 years and is credited with many miracles and literary works like Yukti Mallika and Tirtha Prabandha. He established the system of biennial Paryaya in Udupi.",
    contentKa: "ಶ್ರೀ ವಾದಿರಾಜ ತೀರ್ಥರು ಮಧ್ವ ಪರಂಪರೆಯ ಅತ್ಯಂತ ಪ್ರಸಿದ್ಧ ಸಂತರಲ್ಲಿ ಒಬ್ಬರು. ಹೂವಿನಕೆರೆಯಲ್ಲಿ ಜನಿಸಿದ ಅವರು ಅಲ್ಪವಯಸ್ಸಿನಲ್ಲೇ ಸನ್ಯಾಸ ಸ್ವೀಕರಿಸಿದರು. 120 ವರ್ಷಗಳ ಕಾಲ ಬಾಳಿದ ಅವರು ಯುಕ್ತಿ ಮಲ್ಲಿಕಾ ಮತ್ತು ತೀರ್ಥ ಪ್ರಬಂಧದಂತಹ ಅನೇಕ ಕೃತಿಗಳನ್ನು ರಚಿಸಿದ್ದಾರೆ. ಉಡುಪಿಯಲ್ಲಿ ಎರಡು ವರ್ಷಕ್ಕೊಮ್ಮೆ ನಡೆಯುವ ಪರ್ಯಾಯ ಪದ್ಧತಿಯನ್ನು ಅವರು ಸ್ಥಾಪಿಸಿದರು."
  }
];

const FALLBACK_BHOOTARAJA_DATA = [
  {
    title: "Sri Bhootarajaru",
    titleKa: "ಶ್ರೀ ಭೂತರಾಜರು",
    contentEn: "Sri Bhootarajaru is the celestial protector of Sode. He was a great devotee and associate of Sri Vadiraja Teertharu. He protects the Matha and blesses the devotees who visit Sode. His presence is felt by many who surrender at his feet.",
    contentKa: "ಶ್ರೀ ಭೂತರಾಜರು ಸೋದೆಯ ದೈವೀ ರಕ್ಷಕರು. ಅವರು ಶ್ರೀ ವಾದಿರಾಜ ತೀರ್ಥರ ಪರಮ ಭಕ್ತ ಮತ್ತು ಸಖರಾಗಿದ್ದರು. ಅವರು ಮಠವನ್ನು ರಕ್ಷಿಸುತ್ತಾರೆ ಮತ್ತು ಸೋದೆಗೆ ಭೇಟಿ ನೀಡುವ ಭಕ್ತರನ್ನು ಹರಸುತ್ತಾರೆ.",
    imageUrl: "https://www.sodematha.in/images/bhootarajaru.jpg"
  }
];

const FALLBACK_PARAMPARA_DATA = [
  { id: 1, name: "Sri Vishnutirtha", nameKa: "ಶ್ರೀ ವಿಷ್ಣುತೀರ್ಥರು", period: "13th Century", descriptionEn: "Brother and direct disciple of Sri Madhwacharya. First pontiff of the Matha.", descriptionKa: "ಶ್ರೀ ಮಧ್ವಾಚಾರ್ಯರ ಸಹೋದರ ಮತ್ತು ನೇರ ಶಿಷ್ಯರು. ಮಠದ ಮೊದಲ ಪೀಠಾಧಿಪತಿಗಳು." },
  { id: 2, name: "Sri Vyasatirtha", nameKa: "ಶ್ರೀ ವ್ಯಾಸತೀರ್ಥರು", period: "1317-1327", descriptionEn: "Direct disciple of Sri Vishnutirtha.", descriptionKa: "ಶ್ರೀ ವಿಷ್ಣುತೀರ್ಥರ ನೇರ ಶಿಷ್ಯರು." },
  { id: 12, name: "Sri Ratnagarbhatirtha", nameKa: "ಶ್ರೀ ರತ್ನಗರ್ಭತೀರ್ಥರು", period: "1400s", descriptionEn: "Great yogi who performed penance in Narala.", descriptionKa: "ನಾರಲದಲ್ಲಿ ತಪಸ್ಸು ಮಾಡಿದ ಮಹಾನ್ ಯೋಗಿಗಳು." },
  { id: 19, name: "Sri Vagishatirtha", nameKa: "ಶ್ರೀ ವಾಗೀಶತೀರ್ಥರು", period: "1481-1518", descriptionEn: "Ashrama Guru of Sri Vadiraja Teertharu.", descriptionKa: "ಶ್ರೀ ವಾದಿರಾಜ ತೀರ್ಥರ ಆಶ್ರಮ ಗುರುಗಳು." },
  { id: 20, name: "Sri Vadirajatirtha", nameKa: "ಶ್ರೀ ವಾದಿರಾಜತೀರ್ಥರು", period: "1481-1600", descriptionEn: "The great saint who lived for 120 years. Established Sode as a major center.", descriptionKa: "120 ವರ್ಷಗಳ ಕಾಲ ಬಾಳಿದ ಮಹಾನ್ ಸಂತರು. ಸೋದೆಯನ್ನು ಪ್ರಮುಖ ಕೇಂದ್ರವನ್ನಾಗಿ ಮಾಡಿದರು.", isHighlight: true },
  { id: 32, name: "Sri Vishwapriyatirtha", nameKa: "ಶ್ರೀ ವಿಶ್ವಪ್ರಿಯತೀರ್ಥರು", period: "1774-1865", descriptionEn: "Popularly known as Vrindavanacharya.", descriptionKa: "ಬೃಂದಾವನಾಚಾರ್ಯ ಎಂದು ಜನಪ್ರಿಯರಾದವರು." },
  { id: 35, name: "Sri Vishwottamatirtha", nameKa: "ಶ್ರೀ ವಿಶ್ವೋತ್ತಮತೀರ್ಥರು", period: "1934-2007", descriptionEn: "Great scholar who performed 4 Paryayas.", descriptionKa: "4 ಪರ್ಯಾಯಗಳನ್ನು ಪೂರೈಸಿದ ಮಹಾನ್ ವಿದ್ವಾಂಸರು." },
  { id: 36, name: "Sri Vishwavallabhatirtha", nameKa: "ಶ್ರೀ ವಿಶ್ವವಲ್ಲಭತೀರ್ಥರು", period: "2006-Present", descriptionEn: "The current pontiff of Sri Sode Vadiraja Matha.", descriptionKa: "ಸೋದೆ ಶ್ರೀ ವಾದಿರಾಜ ಮಠದ ಈಗಿನ ಪೀಠಾಧಿಪತಿಗಳು.", isCurrent: true }
];

const FALLBACK_GALLERY_DATA = [
  { id: 1, title: "Sri Vadiraja Matha Sode", imageUrl: "https://www.sodematha.in/images/sode1.jpg", category: "Matha" },
  { id: 2, title: "Sri Bhootarajaru Sannidhi", imageUrl: "https://www.sodematha.in/images/bhoota1.jpg", category: "Deity" },
  { id: 3, title: "Dhavala Manuscript", imageUrl: "https://www.sodematha.in/images/dhavala.jpg", category: "Dhavala Gallery" },
  { id: 4, title: "Matha Architecture", imageUrl: "https://www.sodematha.in/images/arch.jpg", category: "Heritage" }
];

const TRANSLATIONS = {
  EN: {
    appName: 'Sode Sri Vadiraja Matha',
    subtitle: 'Bhavisameera',
    officialApp: 'Official Mobile Application',
    home: 'Home',
    seva: 'Seva',
    events: 'Events',
    more: 'More',
    gallery: 'Gallery',
    panchanga: 'Panchanga',
    quiz: 'Youth Quiz',
    branches: 'Branches',
    placesToVisit: 'Places to Visit',
    history: 'History',
    rooms: 'Rooms',
    highlights: 'Highlights',
    select: 'SELECT',
    darshanaTimings: 'Darshana Timings',
    prasadaTimings: 'Prasada Timings',
    morning: 'Morning',
    afternoon: 'Afternoon',
    night: 'Night',
    evening: 'Evening',
    newsTitle: 'News & Updates',
    refresh: 'Refresh',
    emptyNews: 'Tap "Refresh" to fetch updates',
    back: 'Back',
    moreOptions: 'More Options',
    language: 'Language',
    profile: 'Profile',
    publications: 'Publications',
    settings: 'Settings',
    tithinirnaya: 'Tithinirnaya Panchanga',
    branchDict: 'Branch Dictionary',
    histParam: 'History & Parampara',
    sevaBooking: 'Online Seva Booking',
    bookNow: 'Book Now',
    sodeSevas: 'Sevas in Sode',
    udupiSevas: 'Sevas in Udupi Paryaya',
    devoteeDetails: 'Devotee Details',
    amount: 'Amount',
    date: 'Date',
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    city: 'City',
    state: 'State',
    pincode: 'Pincode',
    rashi: 'Rashi',
    nakshatra: 'Nakshatra',
    gotra: 'Gotra',
    prasadamCollection: 'Prasadam Collection',
    visit: 'By Personal Visit',
    post: 'By Post',
    proceedPayment: 'Proceed to Payment',
    cancel: 'Cancel',
    upcomingEvents: 'Upcoming Events',
    roomBooking: 'Room Booking',
    requestAcc: 'Request Accommodation',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    roomType: 'Room Type',
    noOfRooms: 'No. of Rooms',
    adults: 'Adults',
    children: 'Children',
    submitRequest: 'Submit Request',
    uploadId: 'Upload ID Proofs',
    idUploaded: 'ID Proof Uploaded',
    aadhaarHint: 'For verification at the counter. Only last 4 digits visible to admin.',
    settingsTitle: 'Settings',
    tabHistory: 'History',
    tabParampara: 'Parampara',
    tabBhootaraja: 'Bhootarajaru',
    historyHeader: 'History of Sri Matha',
    loginTitle: 'Login',
    mobilePlace: 'Enter Mobile Number',
    otpPlace: 'Enter OTP',
    getOtp: 'Get OTP',
    verifyOtp: 'Verify & Login',
    sendingOtp: 'Sending OTP...',
    verifying: 'Verifying...',
    enterValidMobile: 'Please enter a valid 10-digit mobile number.',
    pushNotif: 'Push Notifications',
    on: 'ON',
    off: 'OFF',
    panchangaTitle: 'Tithinirnaya Panchanga',
    panchangaDesc: "Seamless integration with Sri Matha's Tithinirnaya Panchanga App.",
    todaysPanchanga: "Today's Panchanga",
    openApp: 'Open Full App',
    publicationsTitle: 'Artefacts & Publications',
    author: 'Author',
    type: 'Type',
    readOnline: 'Read Online',
    download: 'Download',
    quizTitle: 'Youth Quiz',
    question: 'Question',
    restartQuiz: 'Restart Quiz',
    yourScore: 'Your Score',
    quizCompleted: 'Quiz Completed!',
    historyTitle: 'History of Sri Matha',
    backList: 'Back to List',
    viewMap: 'View on Google Maps',
    guru: 'Guru',
    shishya: 'Shishya',
    poorvashrama: 'Poorvashrama Name',
    aaradhane: 'Aaradhane',
    keyWorks: 'Key Works',
    vrindavana: 'Vrindavana / Location',
    devoteeProfile: 'Devotee Profile',
    astroDetails: 'Astrological Details',
    postalSame: 'Postal Address same as above?',
    enterPostal: 'Enter Postal Address',
    selectDate: 'Select Date',
    paymentGateway: 'Payment Gateway',
    proceedPay: 'Proceed to pay',
    payNow: 'Pay Now',
    requiredFields: 'Please fill in all required fields.',
    successSeva: 'Seva booked successfully! Receipt sent to email.',
    errorLoadSevas: 'Could not load sevas',
    success: 'Success',
    error: 'Error',
    yourProfile: 'Your Profile',
    devoteeReg: 'Devotee Registration',
    enterName: 'Enter Name',
    enterMobile: 'Enter Mobile',
    enterEmail: 'Enter Email',
    houseStreet: 'House No / Street',
    selectRashi: 'Select Rashi',
    selectNakshatra: 'Select Nakshatra',
    selectGotra: 'Select Gotra',
    volunteerSignup: 'Volunteer Signup',
    subscribeUpdates: 'Subscribe to Updates',
    termsAndPrivacy: 'I agree to the Terms & Privacy Policy',
    readTerms: 'Read Terms',
    readPrivacy: 'Read Privacy Policy',
    consent: 'I consent to data storage for communications.',
    unsubscribe: 'Unsubscribe from Messages',
    updateProfile: 'Update Profile',
    register: 'Register',
    comingSoon: 'Coming Soon...',
    getDirections: 'Get Directions',
    myBookings: 'My Bookings',
    roomBookings: 'Room Bookings',
    sevaBookings: 'Seva Bookings',
    status: 'Status',
    pending: 'Pending',
    confirmed: 'Confirmed',
    rejected: 'Rejected',
    noBookings: 'No bookings found.',
    notifications: 'Notifications',
    notificationHistory: 'Notification History',
    noNotifications: 'No notifications yet.',
    logout: 'Logout',
    todayPanchanga: "Today's Panchanga",
    panchangaPopupTitle: 'Daily Panchanga',
    viewFullPanchanga: 'View Full Panchanga',
    closePanchanga: 'Close',
    minPeopleError: 'Minimum 2 people required for room booking',
    totalPeople: 'Total People',
    aboutSodeMatha: 'About Sode Matha',
    educationalInstitutions: 'Educational Institutions',
    visitWebsite: 'Visit Website',
    eKanike: 'E-Kanike',
    donateNow: 'Donate Now',
    renovation: 'Renovation',
    renovationProgress: 'Renovation Progress',
    goalAmount: 'Goal Amount',
    contributors: 'Contributors',
    newsletter: 'Newsletter',
    subscribeNewsletter: 'Subscribe to Newsletter',
    videos: 'Videos',
    watchVideo: 'Watch Video',
    keyFeatures: 'Key Features',
    readMore: 'Read More',
    readLess: 'Read Less',
    goshaale: 'Goshaale (Cow Shelter)',
    adoptACow: 'Adopt a Cow',
    cowCare: 'Cow Care',
    feedingSchedule: 'Feeding Schedule',
    healthCare: 'Health Care',
    donate: 'Donate',
    donationPurpose: 'Donation Purpose',
    enterAmount: 'Enter Amount',
    selectPurpose: 'Select Purpose',
    general: 'General',
    cowFeed: 'Cow Feed',
    cowMedicine: 'Cow Medicine',
    infrastructure: 'Infrastructure',
    yourName: 'Your Name',
    yourEmail: 'Your Email',
    proceedToPay: 'Proceed to Pay',
    donationHistory: 'Donation History',
    recentDonations: 'Recent Donations',
    totalCows: 'Total Cows',
    healthyCows: 'Healthy Cows',
    subscribeEmail: 'Subscribe with Email',
    enterEmailAddress: 'Enter Email Address',
    subscribe: 'Subscribe',
    preferences: 'Preferences',
    eventsUpdates: 'Events Updates',
    newsUpdates: 'News Updates',
    sevaUpdates: 'Seva Updates',
    videoGallery: 'Video Gallery',
    playVideo: 'Play Video',
    institution: 'Institution',
    contactInfo: 'Contact Information',
    aadhaar: 'Aadhaar Card',
    // Enhanced History & Parampara Keys
    dailyWorship: 'Daily Worship',
    registerVisit: 'Register Visit',
    visitDate: 'Visit Date',
    numberOfPeople: 'Number of People',
    placeFrom: 'Place (From)',
    visitHeading: 'Register Your Visit',
    visitSuccess: 'Visit registered successfully!',
    poojaTimings: 'Pooja Timings',
    annaPrasadaTimings: 'Anna Prasada Timings',
    devoteeVisit: 'Devotee Visit',
    homeTitle: 'Home',
    worshipDeities: 'Worshipped Deities',
    sriVadiraja: 'Sri Vadirajatirtharu',
    completeHistory: 'Complete History',
    earlyLife: 'Early Life',
    education: 'Education',
    majorAchievements: 'Major Achievements',
    literaryWorks: 'Literary Works',
    finalDays: 'Final Days',
    birthDate: 'Birth Date',
    birthName: 'Birth Name',
    birthPlace: 'Birth Place',
    parents: 'Parents',
    father: 'Father',
    mother: 'Mother',
    upanayanam: 'Upanayanam',
    samnyasashrama: 'Samnyasashrama',
    miracles: 'Miracles',
    honors: 'Honors & Titles',
    achievements: 'Achievements',
    works: 'Works',
    timeline: 'Timeline',
    biography: 'Biography',
    lifeSpan: 'Life Span',
    years: 'Years',
    pontiff: 'Pontiff',
    parampara: 'Parampara',
    vrindavanaLocation: 'Vrindavana Location',
    viewDetails: 'View Details',
    currentPontiff: 'Current Pontiff',
    formerPontiff: 'Former Pontiff',
    succession: 'Succession',
    era: 'Era',
    period: 'Period',
    reign: 'Reign',
    vedantaWorks: 'Vedanta Works',
    commentaries: 'Commentaries',
    upanishadCommentaries: 'Upanishad Commentaries',
    glosses: 'Glosses',
    kavyas: 'Kavyas',
    mahakavyas: 'Mahakavyas',
    khandaKavya: 'Khanda Kavya',
    prameyaKavya: 'Prameya Kavya',
    kannadaWorks: 'Kannada Works',
    otherLanguages: 'Other Languages',
    viewAll: 'View All',
    collapse: 'Collapse',
    expand: 'Expand',
    paryayas: 'Paryayas',
    paryayaSystem: 'Paryaya System',
    urdhvabadari: 'Urdhvabadari Visit',
    hayagrivaAppearance: 'Hayagriva Appearance',
    vyasamushti: 'Vyasamushti',
    rukminishavijaya: 'Rukminishavijaya',
    savingLives: 'Saving Lives',
    templeInstallations: 'Temple Installations',
    royalBlessings: 'Royal Blessings',
    financialMiracles: 'Financial Miracles',
    healingMiracles: 'Healing Miracles',
    vrindavanaEntry: 'Vrindavana Entry',
    fiveForms: 'Five Forms',
    lordsForms: "Lord's Forms",
    vayuForms: "Vayu's Forms",
    totalWorks: 'Total Works',
    categories: 'Categories',
    searchWorks: 'Search Works',
    workDetails: 'Work Details',
    downloadPDF: 'Download PDF',
    audioVersion: 'Audio Version',
    shareStory: 'Share Story',
    favorites: 'Favorites',
    allPontiffs: 'All Pontiffs',
    pontiffDetails: 'Pontiff Details',
    viewTimeline: 'View Timeline',
    listView: 'List View',
    timelineView: 'Timeline View',
    pooja: 'Pooja',
    alankara: 'Alankara',
    annadana: 'Annadana',
    goshalaSeva: 'Goshala Seva',
    otherSevas: 'Other Sevas',
    loadingPanchanga: 'Bringing you today\'s sacred alignments...',
    errorFetchingPanchanga: 'Could not retrieve Panchanga',
    noPanchangaData: 'Panchanga data is currently unavailable',
    tithiName: 'Tithi',
    tithiEnds: 'Ends at',
    nakshatraName: 'Nakshatra',
    nakshatraEnds: 'Ends at',
    yogaName: 'Yoga',
    yogaEnds: 'Ends at',
    karanaName: 'Karana',
    karanaEnds: 'Ends at',
    rahuKala: 'Rahu Kala',
    gulikaKala: 'Gulika Kala',
    yamaGanda: 'Yama Ganda',
    startTime: 'Start',
    endTime: 'End',
    muhurthas: 'Auspicious Muhurthas',
    festivals: 'Festivals & Observances',
    sunriseSunset: 'Sunrise & Sunset',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    location: 'Location (Sirsi/Sode)',
    tithi: 'Tithi',
    nakshatra: 'Nakshatra',
    yoga: 'Yoga',
    karana: 'Karana',
    mobileNumber: 'Mobile Number',
    submit: 'Submit',
    newsLabel: 'NEWS',
    connect: 'Connect with Sri Matha',
    designedBy: 'Designed & Developed by Team Hayavadana',
  },
  KA: {
    appName: 'ಸೋದೆ ಶ್ರೀ ವಾದಿರಾಜ ಮಠ',
    subtitle: 'ಭಾವಿಸಮೀರ',
    officialApp: 'ಅಧಿಕೃತ ಮೊಬೈಲ್ ಅಪ್ಲಿಕೇಶನ್',
    home: 'ಮುಖಪುಟ',
    seva: 'ಸೇವೆ',
    events: 'ಕಾರ್ಯಕ್ರಮಗಳು',
    more: 'ಇನ್ನಷ್ಟು',
    gallery: 'ಚಿತ್ರಸಂಪುಟ',
    panchanga: 'ಪಂಚಾಂಗ',
    quiz: 'ರಸಪ್ರಶ್ನೆ',
    branches: 'ಶಾಖೆಗಳು',
    placesToVisit: 'ನೋಡಬೇಕಾದ ಸ್ಥಳಗಳು',
    history: 'ಚರಿತ್ರೆ',
    rooms: 'ವಸತಿ',
    highlights: 'ಮುಖ್ಯಾಂಶಗಳು',
    select: 'ಆಯ್ಕೆಮಾಡಿ',
    darshanaTimings: 'ದರ್ಶನ ಸಮಯ',
    prasadaTimings: 'ಪ್ರಸಾದ ಸಮಯ',
    morning: 'ಬೆಳಿಗ್ಗೆ',
    afternoon: 'ಮಧ್ಯಾಹ್ನ',
    night: 'ರಾತ್ರಿ',
    evening: 'ಸಂಜೆ',
    newsTitle: 'ಸುದ್ದಿಗಳು',
    refresh: 'ನವೀಕರಿಸಿ',
    emptyNews: 'ಸುದ್ದಿಗಳನ್ನು ಪಡೆಯಲು "ನವೀಕರಿಸಿ" ಟ್ಯಾಪ್ ಮಾಡಿ',
    back: 'ಹಿಂದಕ್ಕೆ',
    moreOptions: 'ಹೆಚ್ಚಿನ ಆಯ್ಕೆಗಳು',
    language: 'ಭಾಷೆ (Language)',
    profile: 'ಪ್ರೊಫೈಲ್',
    publications: 'ಪ್ರಕಟಣೆಗಳು',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    tithinirnaya: 'ತಿಥಿನಿರ್ಣಯ ಪಂಚಾಂಗ',
    branchDict: 'ಶಾಖಾ ವಿವರಗಳು',
    histParam: 'ಚರಿತ್ರೆ ಮತ್ತು ಪರಂಪರೆ',
    sevaBooking: 'ಆನ್ಲೈನ್ ಸೇವಾ ಬುಕಿಂಗ್',
    bookNow: 'ಬುಕ್ ಮಾಡಿ',
    sodeSevas: 'ಸೋದೆ ಕ್ಷೇತ್ರದಲ್ಲಿರುವ ಸೇವೆಗಳು',
    udupiSevas: 'ಉಡುಪಿ ಪರ್ಯಾಯದಲ್ಲಿರುವ ಸೇವೆಗಳು',
    devoteeDetails: 'ಭಕ್ತರ ವಿವರಗಳು',
    amount: 'ಮೊತ್ತ',
    date: 'ದಿನಾಂಕ',
    name: 'ಹೆಸರು',
    phone: 'ದೂರವಾಣಿ',
    email: 'ಇಮೇಲ್',
    address: 'ವಿಳಾಸ',
    city: 'ಊರು',
    state: 'ರಾಜ್ಯ',
    pincode: 'ಪಿನ್ ಕೋಡ್',
    rashi: 'ರಾಶಿ',
    nakshatra: 'ನಕ್ಷತ್ರ',
    gotra: 'ಗೋತ್ರ',
    prasadamCollection: 'ಪ್ರಸಾದ ಸ್ವೀಕಾರ',
    visit: 'ಸ್ವತಃ ಬಂದು ಪಡೆಯುವುದು',
    post: 'ಅಂಚೆ ಮೂಲಕ',
    proceedPayment: 'ಪಾವತಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    upcomingEvents: 'ಮುಂಬರುವ ಕಾರ್ಯಕ್ರಮಗಳು',
    roomBooking: 'ವಸತಿ ಕಾಯ್ದಿರಿಸುವಿಕೆ',
    requestAcc: 'ವಸತಿಗಾಗಿ ವಿನಂತಿ',
    checkIn: 'ಚೆಕ್-ಇನ್',
    checkOut: 'ಚೆಕ್-ಔಟ್',
    roomType: 'ಕೊಠಡಿ ಪ್ರಕಾರ',
    noOfRooms: 'ಕೊಠಡಿಗಳ ಸಂಖ್ಯೆ',
    adults: 'ದೊಡ್ಡವರು',
    children: 'ಮಕ್ಕಳು',
    submitRequest: 'ವಿನಂತಿಯನ್ನು ಸಲ್ಲಿಸಿ',
    uploadId: 'ಐಡಿ ಪುರಾವೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    idUploaded: 'ಐಡಿ ಪುರಾವೆ ಅಪ್‌ಲೋಡ್ ಆಗಿದೆ',
    aadhaarHint: 'ಕೌಂಟರ್‌ನಲ್ಲಿ ಪರಿಶೀಲನೆಗಾಗಿ. ನಿರ್ವಾಹಕರಿಗೆ ಕೊನೆಯ 4 ಅಂಕೆಗಳು ಮಾತ್ರ ಕಾಣಿಸುತ್ತವೆ.',
    settingsTitle: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    tabHistory: 'ಚರಿತ್ರೆ',
    tabParampara: 'ಪರಂಪರೆ',
    tabBhootaraja: 'ಭೂತರಾಜರು',
    historyHeader: 'ಶ್ರೀ ಮಠದ ಚರಿತ್ರೆ',
    loginTitle: 'ಲಾಗಿನ್',
    mobilePlace: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ',
    otpPlace: 'OTP ನಮೂದಿಸಿ',
    getOtp: 'OTP ಪಡೆಯಿರಿ',
    verifyOtp: 'ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಲಾಗಿನ್ ಮಾಡಿ',
    sendingOtp: 'OTP ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...',
    verifying: 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
    enterValidMobile: 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ 10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.',
    pushNotif: 'ಪುಶ್ ಅಧಿಸೂಚನೆಗಳು',
    on: 'ಆನ್',
    off: 'ಆಫ್',
    panchangaTitle: 'ತಿಥಿನಿರ್ಣಯ ಪಂಚಾಂಗ',
    panchangaDesc: "ಶ್ರೀ ಮಠದ ತಿಥಿನಿರ್ಣಯ ಪಂಚಾಂಗದೊಂದಿಗೆ ಸುಗಮ ಬಳಕೆ.",
    todaysPanchanga: "ಇಂದಿನ ಪಂಚಾಂಗ",
    openApp: 'ಪೂರ್ಣ ಆಪ್ ತೆರೆಯಿರಿ',
    publicationsTitle: 'ಗ್ರಂಥಗಳು ಮತ್ತು ಪ್ರಕಟಣೆಗಳು',
    author: 'ಲೇಖಕರು',
    type: 'ವಿಧ',
    readOnline: 'ಆನ್‌ಲೈನ್ ಓದಿ',
    download: 'ಡೌನ್‌ಲೋಡ್',
    quizTitle: 'ಯುವ ರಸಪ್ರಶ್ನೆ',
    question: 'ಪ್ರಶ್ನೆ',
    restartQuiz: 'ರಸಪ್ರಶ್ನೆ ಮರುಪ್ರಾರಂಭಿಸಿ',
    yourScore: 'ನಿಮ್ಮ ಸ್ಕೋರ್',
    quizCompleted: 'ರಸಪ್ರಶ್ನೆ ಮುಗಿದಿದೆ!',
    historyTitle: 'ಶ್ರೀ ಮಠದ ಚರಿತ್ರೆ',
    backList: 'ಪಟ್ಟಿಗೆ ಹಿಂತಿರುಗಿ',
    viewMap: 'ಗೂಗಲ್ ಮ್ಯಾಪ್‌ನಲ್ಲಿ ನೋಡಿ',
    guru: 'ಗುರುಗಳು',
    shishya: 'ಶಿಷ್ಯರು',
    poorvashrama: 'ಪೂರ್ವಾಶ್ರಮದ ಹೆಸರು',
    aaradhane: 'ಆರಾಧನೆ',
    keyWorks: 'ಪ್ರಮುಖ ಕೃತಿಗಳು',
    vrindavana: 'ವೃಂದಾವನ / ಸ್ಥಳ',
    devoteeProfile: 'ಭಕ್ತರ ಪ್ರೊಫೈಲ್',
    astroDetails: 'ಜ್ಯೋತಿಷ್ಯ ವಿವರಗಳು',
    postalSame: 'ಅಂಚೆ ವಿಳಾಸ ಮೇಲಿನಂತೆಯೇ?',
    enterPostal: 'ಅಂಚೆ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ',
    selectDate: 'ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ',
    paymentGateway: 'ಪಾವತಿ ಗೇಟ್ವೇ',
    proceedPay: 'ಪಾವತಿಸಲು ಮುಂದುವರಿಯಿರಿ',
    payNow: 'ಈಗ ಪಾವತಿಸಿ',
    requiredFields: 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳನ್ನು ತುಂಬಿರಿ.',
    successSeva: 'ಸೇವೆ ಯಶಸ್ವಿಯಾಗಿ ಬುಕ್ ಆಗಿದೆ! ರಶೀದಿಯನ್ನು ಇಮೇಲ್ ಮಾಡಲಾಗಿದೆ.',
    errorLoadSevas: 'ಸೇವೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ',
    success: 'ಯಶಸ್ಸು',
    error: 'ದೋಷ',
    yourProfile: 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್',
    devoteeReg: 'ಭಕ್ತರ ನೋಂದಣಿ',
    enterName: 'ಹೆಸರು ನಮೂದಿಸಿ',
    enterMobile: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ',
    enterEmail: 'ಇಮೇಲ್ ನಮೂದಿಸಿ',
    houseStreet: 'ಮನೆ ಸಂಖ್ಯೆ / ರಸ್ತೆ',
    selectRashi: 'ರಾಶಿ ಆಯ್ಕೆಮಾಡಿ',
    selectNakshatra: 'ನಕ್ಷತ್ರ ಆಯ್ಕೆಮಾಡಿ',
    selectGotra: 'ಗೋತ್ರ ಆಯ್ಕೆಮಾಡಿ',
    volunteerSignup: 'ಸ್ವಯಂಸೇವಕ ನೋಂದಣಿ',
    subscribeUpdates: 'ಅಪ್‌ಡೇಟ್‌ಗಳಿಗೆ ಚಂದಾದಾರರಾಗಿ',
    termsAndPrivacy: 'ನಾನು ನಿಯಮಗಳು ಮತ್ತು ಗೌಪ್ಯತಾ ನೀತಿಗೆ ಒಪ್ಪುತ್ತೇನೆ',
    readTerms: 'ನಿಯಮಗಳನ್ನು ಓದಿ',
    readPrivacy: 'ಗೌಪ್ಯತಾ ನೀತಿ ಓದಿ',
    consent: 'ಸಂವಹನಕ್ಕಾಗಿ ಡೇಟಾ ಸಂಗ್ರಹಣೆಗೆ ನಾನು ಒಪ್ಪುತ್ತೇನೆ.',
    unsubscribe: 'ಸಂದೇಶಗಳಿಂದ ಅನ್‌ಸಬ್‌ಸ್ಕ್ರೈಬ್ ಮಾಡಿ',
    updateProfile: 'ಪ್ರೊಫೈಲ್ ನವೀಕರಿಸಿ',
    register: 'ನೋಂದಾಯಿಸಿ',
    comingSoon: 'ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ...',
    getDirections: 'ದಾರಿ ತೋರಿಸಿ',
    myBookings: 'ನನ್ನ ಬುಕಿಂಗ್‌ಗಳು',
    roomBookings: 'ರೂಮ್ ಬುಕಿಂಗ್‌ಗಳು',
    sevaBookings: 'ಸೇವಾ ಬುಕಿಂಗ್‌ಗಳು',
    status: 'ಸ್ಥಿತಿ',
    pending: 'ಬಾಕಿ ಇದೆ',
    confirmed: 'ಖಚಿತಪಡಿಸಲಾಗಿದೆ',
    rejected: 'ತಿರಸ್ಕರಿಸಲಾಗಿದೆ',
    noBookings: 'ಯಾವುದೇ ಬುಕಿಂಗ್‌ಗಳು ಕಂಡುಬಂದಿಲ್ಲ.',
    notifications: 'ಅಧಿಸೂಚನೆಗಳು',
    notificationHistory: 'ಅಧಿಸೂಚನೆಗಳ ಇತಿಹಾಸ',
    noNotifications: 'ಇನ್ನೂ ಯಾವುದೇ ಅಧಿಸೂಚನೆಗಳಿಲ್ಲ.',
    logout: 'ನಿರ್ಗಮಿಸಿ',
    todayPanchanga: 'ಇಂದಿನ ಪಂಚಾಂಗ',
    panchangaPopupTitle: 'ದೈನಂದಿನ ಪಂಚಾಂಗ',
    viewFullPanchanga: 'ಸಂಪೂರ್ಣ ಪಂಚಾಂಗ ವೀಕ್ಷಿಸಿ',
    closePanchanga: 'ಮುಚ್ಚಿ',
    minPeopleError: 'ಕೊಠಡಿ ಬುಕಿಂಗ್‌ಗೆ ಕನಿಷ್ಠ 2 ಜನರು ಅಗತ್ಯ',
    totalPeople: 'ಒಟ್ಟು ಜನರು',
    aboutSodeMatha: 'ಸೋದೆ ಮಠದ ಬಗ್ಗೆ',
    educationalInstitutions: 'ಶೈಕ್ಷಣಿಕ ಸಂಸ್ಥೆಗಳು',
    visitWebsite: 'ವೆಬ್‌ಸೈಟ್ ಭೇಟಿ ನೀಡಿ',
    eKanike: 'ಇ-ಕಾಣಿಕೆ',
    donateNow: 'ಈಗ ದಾನ ಮಾಡಿ',
    renovation: 'ನವೀಕರಣ',
    renovationProgress: 'ನವೀಕರಣ ಪ್ರಗತಿ',
    goalAmount: 'ಗುರಿ ಮೊತ್ತ',
    contributors: 'ಕೊಡುಗೆದಾರರು',
    newsletter: 'ಸುದ್ದಿಪತ್ರ',
    subscribeNewsletter: 'ಸುದ್ದಿಪತ್ರಕ್ಕೆ ಚಂದಾದಾರರಾಗಿ',
    videos: 'ವೀಡಿಯೊಗಳು',
    watchVideo: 'ವೀಡಿಯೊ ವೀಕ್ಷಿಸಿ',
    keyFeatures: 'ಪ್ರಮುಖ ವೈಶಿಷ್ಟ್ಯಗಳು',
    readMore: 'ಇನ್ನಷ್ಟು ಓದಿ',
    readLess: 'ಕಡಿಮೆ ಓದಿ',
    goshaale: 'ಗೋಶಾಲೆ',
    adoptACow: 'ಗೋವನ್ನು ದತ್ತು ತೆಗೆದುಕೊಳ್ಳಿ',
    cowCare: 'ಗೋ ಸೇವೆ',
    feedingSchedule: 'ಆಹಾರ ವೇಳಾಪಟ್ಟಿ',
    healthCare: 'ಆರೋಗ್ಯ ಸೇವೆ',
    donate: 'ದಾನ ಮಾಡಿ',
    donationPurpose: 'ದಾನದ ಉದ್ದೇಶ',
    enterAmount: 'ಮೊತ್ತ ನಮೂದಿಸಿ',
    selectPurpose: 'ಉದ್ದೇಶ ಆಯ್ಕೆಮಾಡಿ',
    general: 'ಸಾಮಾನ್ಯ',
    cowFeed: 'ಗೋ ಆಹಾರ',
    cowMedicine: 'ಗೋ ಔಷಧ',
    infrastructure: 'ಮೂಲಸೌಕರ್ಯ',
    yourName: 'ನಿಮ್ಮ ಹೆಸರು',
    yourEmail: 'ನಿಮ್ಮ ಇಮೇಲ್',
    proceedToPay: 'ಪಾವತಿಗೆ ಮುಂದುವರಿಯಿರಿ',
    donationHistory: 'ದಾನ ಇತಿಹಾಸ',
    recentDonations: 'ಇತ್ತೀಚಿನ ದಾನಗಳು',
    totalCows: 'ಒಟ್ಟು ಗೋಗಳು',
    healthyCows: 'ಆರೋಗ್ಯವಂತ ಗೋಗಳು',
    subscribeEmail: 'ಇಮೇಲ್‌ನೊಂದಿಗೆ ಚಂದಾದಾರರಾಗಿ',
    enterEmailAddress: 'ಇಮೇಲ್ ವಿಳಾಸ ನಮೂದಿಸಿ',
    subscribe: 'ಚಂದಾದಾರರಾಗಿ',
    preferences: 'ಆದ್ಯತೆಗಳು',
    eventsUpdates: 'ಕಾರ್ಯಕ್ರಮ ನವೀಕರಣಗಳು',
    newsUpdates: 'ಸುದ್ದಿ ನವೀಕರಣಗಳು',
    sevaUpdates: 'ಸೇವಾ ನವೀಕರಣಗಳು',
    videoGallery: 'ವೀಡಿಯೊ ಗ್ಯಾಲರಿ',
    playVideo: 'ವೀಡಿಯೊ ಪ್ಲೇ ಮಾಡಿ',
    institution: 'ಸಂಸ್ಥೆ',
    contactInfo: 'ಸಂಪರ್ಕ ಮಾಹಿತಿ',
    aadhaar: 'ಆಧಾರ್ ಕಾರ್ಡ್',
    // Enhanced History & Parampara Keys
    dailyWorship: 'ದೈನಂದಿನ ಪೂಜೆ',
    registerVisit: 'ಭೇಟಿ ನೋಂದಾಯಿಸಿ',
    visitDate: 'ಭೇಟಿ ನೀಡುವ ದಿನಾಂಕ',
    numberOfPeople: 'ಜನರ ಸಂಖ್ಯೆ',
    placeFrom: 'ಊರು',
    visitHeading: 'ನಿಮ್ಮ ಭೇಟಿಯನ್ನು ನೋಂದಾಯಿಸಿ',
    visitSuccess: 'ಭೇಟಿ ಯಶಸ್ವಿಯಾಗಿ ನೋಂದಾಯಿಸಲ್ಪಟ್ಟಿದೆ!',
    poojaTimings: 'ಪೂಜಾ ಸಮಯ',
    annaPrasadaTimings: 'ಅನ್ನ ಪ್ರಸಾದದ ಸಮಯ',
    devoteeVisit: 'ಭಕ್ತರ ಭೇಟಿ',
    homeTitle: 'ಮುಖಪುಟ',
    worshipDeities: 'ಪೂಜಿಸಲ್ಪಡುವ ದೇವತೆಗಳು',
    sriVadiraja: 'ಶ್ರೀ ವಾದಿರಾಜತೀರ್ಥರು',
    completeHistory: 'ಸಂಪೂರ್ಣ ಚರಿತ್ರೆ',
    earlyLife: 'ಆರಂಭಿಕ ಜೀವನ',
    education: 'ಶಿಕ್ಷಣ',
    majorAchievements: 'ಪ್ರಮುಖ ಸಾಧನೆಗಳು',
    literaryWorks: 'ಸಾಹಿತ್ಯ ಕೃತಿಗಳು',
    finalDays: 'ಅಂತಿಮ ದಿನಗಳು',
    birthDate: 'ಜನ್ಮ ದಿನಾಂಕ',
    birthName: 'ಜನ್ಮ ನಾಮ',
    birthPlace: 'ಜನ್ಮ ಸ್ಥಳ',
    parents: 'ಪೋಷಕರು',
    father: 'ತಂದೆ',
    mother: 'ತಾಯಿ',
    upanayanam: 'ಉಪನಯನ',
    samnyasashrama: 'ಸಂನ್ಯಾಸಾಶ್ರಮ',
    miracles: 'ಅದ್ಭುತಗಳು',
    honors: 'ಗೌರವಗಳು ಮತ್ತು ಬಿರುದುಗಳು',
    achievements: 'ಸಾಧನೆಗಳು',
    works: 'ಕೃತಿಗಳು',
    timeline: 'ಕಾಲಮಾನ',
    biography: 'ಜೀವನ ಚರಿತ್ರೆ',
    lifeSpan: 'ಆಯುಷ್ಯ',
    years: 'ವರ್ಷಗಳು',
    pontiff: 'ಪೀಠಾಧಿಪತಿ',
    parampara: 'ಪರಂಪರೆ',
    vrindavanaLocation: 'ವೃಂದಾವನ ಸ್ಥಳ',
    viewDetails: 'ವಿವರಗಳನ್ನು ನೋಡಿ',
    currentPontiff: 'ಪ್ರಸ್ತುತ ಪೀಠಾಧಿಪತಿ',
    formerPontiff: 'ಹಿಂದಿನ ಪೀಠಾಧಿಪತಿ',
    succession: 'ಉತ್ತರಾಧಿಕಾರ',
    era: 'ಯುಗ',
    period: 'ಅವಧಿ',
    reign: 'ಆಳ್ವಿಕೆ',
    vedantaWorks: 'ವೇದಾಂತ ಕೃತಿಗಳು',
    commentaries: 'ಭಾಷ್ಯಗಳು',
    upanishadCommentaries: 'ಉಪನಿಷತ್ ಭಾಷ್ಯಗಳು',
    glosses: 'ಟೀಕೆಗಳು',
    kavyas: 'ಕಾವ್ಯಗಳು',
    mahakavyas: 'ಮಹಾಕಾವ್ಯಗಳು',
    khandaKavya: 'ಖಂಡಕಾವ್ಯ',
    prameyaKavya: 'ಪ್ರಮೇಯ ಕಾವ್ಯ',
    kannadaWorks: 'ಕನ್ನಡ ಕೃತಿಗಳು',
    otherLanguages: 'ಇತರ ಭಾಷೆಗಳು',
    viewAll: 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ',
    collapse: 'ಮುಚ್ಚಿ',
    expand: 'ವಿಸ್ತರಿಸಿ',
    paryayas: 'ಪರ್ಯಾಯಗಳು',
    paryayaSystem: 'ಪರ್ಯಾಯ ವ್ಯವಸ್ಥೆ',
    urdhvabadari: 'ಊರ್ಧ್ವಬದರಿ ಭೇಟಿ',
    hayagrivaAppearance: 'ಹಯಗ್ರೀವ ಪ್ರತ್ಯಕ್ಷತೆ',
    vyasamushti: 'ವ್ಯಾಸಮುಷ್ಟಿ',
    rukminishavijaya: 'ರುಕ್ಮಿಣೀಶವಿಜಯ',
    savingLives: 'ಜೀವ ರಕ್ಷಣೆ',
    templeInstallations: 'ದೇವಾಲಯ ಪ್ರತಿಷ್ಠಾಪನೆಗಳು',
    royalBlessings: 'ರಾಜಾಶ್ರಯ',
    financialMiracles: 'ಆರ್ಥಿಕ ಅದ್ಭುತಗಳು',
    healingMiracles: 'ಗುಣಪಡಿಸುವ ಅದ್ಭುತಗಳು',
    vrindavanaEntry: 'ವೃಂದಾವನ ಪ್ರವೇಶ',
    fiveForms: 'ಪಂಚರೂಪಗಳು',
    lordsForms: 'ಭಗವಂತನ ರೂಪಗಳು',
    vayuForms: 'ವಾಯುದೇವರ ರೂಪಗಳು',
    totalWorks: 'ಒಟ್ಟು ಕೃತಿಗಳು',
    categories: 'ವರ್ಗಗಳು',
    searchWorks: 'ಕೃತಿಗಳನ್ನು ಹುಡುಕಿ',
    workDetails: 'ಕೃತಿ ವಿವರಗಳು',
    downloadPDF: 'PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    audioVersion: 'ಆಡಿಯೊ ಆವೃತ್ತಿ',
    shareStory: 'ಕಥೆ ಹಂಚಿಕೊಳ್ಳಿ',
    favorites: 'ನೆಚ್ಚಿನವುಗಳು',
    allPontiffs: 'ಎಲ್ಲಾ ಪೀಠಾಧಿಪತಿಗಳು',
    pontiffDetails: 'ಪೀಠಾಧಿಪತಿ ವಿವರಗಳು',
    viewTimeline: 'ಕಾಲಮಾನ ವೀಕ್ಷಿಸಿ',
    listView: 'ಪಟ್ಟಿ ನೋಟ',
    timelineView: 'ಕಾಲಮಾನ ನೋಟ',
    pooja: 'ಪೂಜೆ',
    alankara: 'ಅಲಂಕಾರ',
    annadana: 'ಅನ್ನದಾನ',
    goshalaSeva: 'ಗೋಸೇವೆ',
    otherSevas: 'ಇತರ ಸೇವೆಗಳು',
    loadingPanchanga: 'ಇಂದಿನ ಪಂಚಾಂಗದ ವಿವರಗಳನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ...',
    errorFetchingPanchanga: 'ಪಂಚಾಂಗವನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ',
    noPanchangaData: 'ಪಂಚಾಂಗದ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ',
    tithiName: 'ತಿಥಿ',
    tithiEnds: 'ಅಂತ್ಯ ಸಮಯ',
    nakshatraName: 'ನಕ್ಷತ್ರ',
    nakshatraEnds: 'ಅಂತ್ಯ ಸಮಯ',
    yogaName: 'ಯೋಗ',
    yogaEnds: 'ಅಂತ್ಯ ಸಮಯ',
    karanaName: 'ಕರಣ',
    karanaEnds: 'ಅಂತ್ಯ ಸಮಯ',
    rahuKala: 'ರಾಹು ಕಾಲ',
    gulikaKala: 'ಗುಳಿಕ ಕಾಲ',
    yamaGanda: 'ಯಮಗಂಡ',
    startTime: 'ಪ್ರಾರಂಭ',
    endTime: 'ಅಂತ್ಯ',
    muhurthas: 'ಶುಭ ಮುಹೂರ್ತಗಳು',
    festivals: 'ಹಬ್ಬಗಳು ಮತ್ತು ವಿಶೇಷಗಳು',
    sunriseSunset: 'ಸೂರ್ಯೋದಯ ಮತ್ತು ಸೂರ್ಯಾಸ್ತ',
    sunrise: 'ಸೂರ್ಯೋದಯ',
    sunset: 'ಸೂರ್ಯಾಸ್ತ',
    location: 'ಸ್ಥಳ (ಶಿರಸಿ/ಸೋದೆ)',
    tithi: 'ತಿಥಿ',
    nakshatra: 'ನಕ್ಷತ್ರ',
    yoga: 'ಯೋಗ',
    karana: 'ಕರಣ',
    mobileNumber: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    submit: 'ಸಲ್ಲಿಸಿ',
    newsLabel: 'ಸುದ್ದಿ',
    connect: 'ಶ್ರೀ ಮಠದ ಸಂಪರ್ಕದಲ್ಲಿರಿ',
    designedBy: 'ವಿನ್ಯಾಸ ಮತ್ತು ಅಭಿವೃದ್ಧಿ: ಟೀಮ್ ಹಯವದನ',
  }
};

// Dropdown Data
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];


// State-wise Cities
const CITIES_BY_STATE: { [key: string]: string[] } = {
  'Karnataka': [
    'Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi',
    'Davanagere', 'Ballari', 'Vijayapura', 'Shivamogga', 'Tumakuru',
    'Raichur', 'Bidar', 'Hosapete', 'Gadag', 'Hassan',
    'Bhadravati', 'Chitradurga', 'Udupi', 'Kolar', 'Mandya'
  ],
  'Andhra Pradesh': [
    'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool',
    'Rajahmundry', 'Tirupati', 'Kadapa', 'Kakinada', 'Anantapur',
    'Vizianagaram', 'Eluru', 'Ongole', 'Nandyal', 'Machilipatnam'
  ],
  'Tamil Nadu': [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
    'Tirunelveli', 'Tiruppur', 'Erode', 'Vellore', 'Thoothukudi',
    'Thanjavur', 'Dindigul', 'Ranipet', 'Sivakasi', 'Karur'
  ],
  'Kerala': [
    'Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam',
    'Palakkad', 'Alappuzha', 'Malappuram', 'Kannur', 'Kottayam',
    'Kasaragod', 'Pathanamthitta', 'Idukki', 'Wayanad'
  ],
  'Telangana': [
    'Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar',
    'Ramagundam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet',
    'Siddipet', 'Miryalaguda', 'Jagtial', 'Mancherial'
  ],
  'Maharashtra': [
    'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad',
    'Solapur', 'Amravati', 'Kolhapur', 'Sangli', 'Jalgaon',
    'Akola', 'Latur', 'Dhule', 'Ahmednagar', 'Chandrapur'
  ],
  'Gujarat': [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar',
    'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Nadiad',
    'Morbi', 'Surendranagar', 'Bharuch', 'Vapi', 'Navsari'
  ],
  'Rajasthan': [
    'Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer',
    'Udaipur', 'Bhilwara', 'Alwar', 'Bharatpur', 'Sikar',
    'Pali', 'Tonk', 'Kishangarh', 'Beawar', 'Hanumangarh'
  ],
  'Uttar Pradesh': [
    'Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi',
    'Meerut', 'Prayagraj', 'Bareilly', 'Aligarh', 'Moradabad',
    'Saharanpur', 'Gorakhpur', 'Noida', 'Firozabad', 'Jhansi'
  ],
  'Madhya Pradesh': [
    'Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain',
    'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa',
    'Murwara', 'Singrauli', 'Burhanpur', 'Khandwa', 'Bhind'
  ],
  'West Bengal': [
    'Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri',
    'Bardhaman', 'Malda', 'Baharampur', 'Habra', 'Kharagpur',
    'Shantipur', 'Dankuni', 'Dhulian', 'Ranaghat', 'Haldia'
  ],
  'Punjab': [
    'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda',
    'Mohali', 'Hoshiarpur', 'Batala', 'Pathankot', 'Moga',
    'Abohar', 'Malerkotla', 'Khanna', 'Phagwara', 'Muktsar'
  ],
  'Haryana': [
    'Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Yamunanagar',
    'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Panchkula',
    'Bhiwani', 'Sirsa', 'Bahadurgarh', 'Jind', 'Thanesar'
  ],
  'Bihar': [
    'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga',
    'Purnia', 'Arrah', 'Begusarai', 'Katihar', 'Munger',
    'Chhapra', 'Danapur', 'Bettiah', 'Saharsa', 'Hajipur'
  ],
  'Odisha': [
    'Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur', 'Sambalpur',
    'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda',
    'Jeypore', 'Bargarh', 'Rayagada', 'Balangir', 'Paradip'
  ],
  'Assam': [
    'Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon',
    'Tinsukia', 'Tezpur', 'Bongaigaon', 'Dhubri', 'Diphu',
    'North Lakhimpur', 'Karimganj', 'Sivasagar', 'Goalpara', 'Barpeta'
  ],
  'Jharkhand': [
    'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar',
    'Phusro', 'Hazaribagh', 'Giridih', 'Ramgarh', 'Medininagar',
    'Chirkunda', 'Gumia', 'Dumka', 'Sahibganj', 'Chaibasa'
  ],
  'Chhattisgarh': [
    'Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg',
    'Rajnandgaon', 'Raigarh', 'Jagdalpur', 'Ambikapur', 'Dhamtari',
    'Mahasamund', 'Chirmiri', 'Bhatapara', 'Dalli-Rajhara', 'Naila Janjgir'
  ],
  'Uttarakhand': [
    'Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur',
    'Kashipur', 'Rishikesh', 'Pithoragarh', 'Ramnagar', 'Manglaur',
    'Nainital', 'Almora', 'Tehri', 'Pauri', 'Chamoli'
  ],
  'Himachal Pradesh': [
    'Shimla', 'Mandi', 'Solan', 'Nahan', 'Sundarnagar',
    'Palampur', 'Kullu', 'Hamirpur', 'Dharamshala', 'Una',
    'Bilaspur', 'Chamba', 'Kangra', 'Baddi', 'Parwanoo'
  ],
  'Goa': [
    'Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda',
    'Bicholim', 'Curchorem', 'Sanquelim', 'Cuncolim', 'Quepem'
  ],
  'Tripura': [
    'Agartala', 'Dharmanagar', 'Udaipur', 'Kailasahar', 'Belonia',
    'Khowai', 'Ambassa', 'Ranir Bazar', 'Sonamura', 'Sabroom'
  ],
  'Meghalaya': [
    'Shillong', 'Tura', 'Nongstoin', 'Jowai', 'Baghmara',
    'Williamnagar', 'Nongpoh', 'Mairang', 'Resubelpara'
  ],
  'Manipur': [
    'Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Ukhrul',
    'Senapati', 'Tamenglong', 'Chandel', 'Jiribam', 'Kakching'
  ],
  'Nagaland': [
    'Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha',
    'Zunheboto', 'Phek', 'Mon', 'Longleng', 'Kiphire'
  ],
  'Mizoram': [
    'Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib',
    'Lawngtlai', 'Saiha', 'Mamit', 'Khawzawl', 'Hnahthial'
  ],
  'Arunachal Pradesh': [
    'Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro',
    'Bomdila', 'Tezu', 'Seppa', 'Along', 'Roing'
  ],
  'Sikkim': [
    'Gangtok', 'Namchi', 'Gyalshing', 'Mangan', 'Rangpo',
    'Jorethang', 'Singtam', 'Ravangla', 'Yuksom'
  ]
};

const RASHIS = [
  'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)',
  'Karka (Cancer)', 'Simha (Leo)', 'Kanya (Virgo)',
  'Tula (Libra)', 'Vrishchika (Scorpio)', 'Dhanu (Sagittarius)',
  'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'
];

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
  'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
  'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
  'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
  'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati'
];

const GOTRAS = [
  'Kashyapa', 'Vasistha', 'Bharadwaja', 'Vishwamitra', 'Gautama',
  'Jamadagni', 'Atri', 'Agastya', 'Angirasa', 'Bhrigu',
  'Kaundinya', 'Shandilya', 'Garga', 'Kaushika', 'Vatsa',
  'Harita', 'Mudgala', 'Parasara', 'Kasyapa', 'Dhananjaya'
];

// Custom Dropdown Component
function CustomDropdown({ label, value, options, onSelect, placeholder, premium }: any) {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <Text style={premium ? styles.formLabel : styles.label}>{label}</Text>
      <TouchableOpacity
        style={premium ? styles.premiumDropdown : styles.dropdownButton}
        onPress={() => setVisible(true)}
      >
        <Text style={value ? styles.dropdownText : styles.dropdownPlaceholder} numberOfLines={1}>
          {value || placeholder || 'Select...'}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.dropdownModalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.dropdownModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={styles.modalCloseIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.optionsList}>
              {options.map((option: string, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionItem,
                    value === option && styles.optionItemSelected
                  ]}
                  onPress={() => {
                    onSelect(option);
                    setVisible(false);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    value === option && styles.optionTextSelected
                  ]}>
                    {option}
                  </Text>
                  {value === option && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}


export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [history, setHistory] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [language, setLanguage] = useState<'EN' | 'KA'>('EN'); // Added Language State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPanchangaPopup, setShowPanchangaPopup] = useState(false);
  const [dailyPanchanga, setDailyPanchanga] = useState<any>(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const savedMobile = await AsyncStorage.getItem('userMobile');
      if (savedMobile) {
        const response = await fetch(`${API_URL}/users/mobile/${savedMobile}`);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsLoggedIn(true);
          // Fetch and show daily Panchanga on login
          await fetchDailyPanchanga();
          setShowPanchangaPopup(true);
        }
      }
    } catch (e) {
      console.log('Auto-login error:', e);
    } finally {
      setTimeout(() => setIsSplashVisible(false), 2000);
    }
  };

  const fetchDailyPanchanga = async () => {
    try {
      const response = await fetch(`${API_URL}/panchanga`);
      if (response.ok) {
        setDailyPanchanga(await response.json());
      } else {
        // Fallback static data if API fails
        const today = new Date();
        setDailyPanchanga({
          date: today.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          tithi: { name: 'Shukla Paksha Dashami' },
          nakshatra: { name: 'Rohini' },
          yoga: { name: 'Siddha' },
          karana: { name: 'Taitila' },
          sunrise: '6:15 AM',
          sunset: '6:30 PM'
        });
      }
    } catch (e) {
      console.log('Panchanga fetch error:', e);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userMobile');
    setIsLoggedIn(false);
    setUser(null);
    setCurrentTab('home');
  };

  const navigate = (tab: string) => {
    setHistory(prev => [...prev, currentTab]);
    setCurrentTab(tab);
  };

  const goBack = () => {
    if (history.length > 0) {
      const newHistory = [...history];
      const prevTab = newHistory.pop();
      setHistory(newHistory);
      setCurrentTab(prevTab || 'home');
    } else {
      setCurrentTab('home');
    }
  };

  const switchTab = (tab: string) => {
    setHistory([]);
    setCurrentTab(tab);
  };

  useEffect(() => {
    if (user && isLoggedIn) {
      registerForPushNotifications();
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [user, isLoggedIn]);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/notifications/user/${user.mobileNumber}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: any) => !n.isRead).length);
      }
    } catch (e: any) {
      console.log('Error fetching notifications:', e);
    }
  };

  const registerForPushNotifications = async () => {
    if (!user || !user.id) return;
    const mockToken = `DEVICE_${Platform.OS.toUpperCase()}_${user.mobileNumber}`;
    try {
      await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, deviceToken: mockToken })
      });
    } catch (e) {
      console.log('Push Registration Error:', e);
    }
  };


  if (isSplashVisible) {
    return <CustomSplashScreen />;
  }

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <AuthScreen
          onLogin={(userData: any) => {
            setIsLoggedIn(true);
            setUser(userData);
          }}
          language={language}
          setLanguage={setLanguage}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      {/* Main Content */}
      <View style={{ flex: 1 }}>
        {currentTab === 'home' && <HomeScreen setCurrentTab={navigate} language={language} unreadCount={unreadCount} navigateToNotifications={() => switchTab('notifications')} />}
        {currentTab === 'seva' && <SevaScreen user={user} language={language} setCurrentTab={navigate} goBack={goBack} />}
        {currentTab === 'events' && <EventsScreen language={language} goBack={() => setCurrentTab('home')} />}
        {currentTab === 'myBookings' && <MyBookingsScreen user={user} setCurrentTab={navigate} goBack={goBack} language={language} />}
        {currentTab === 'profile' && <ProfileScreen user={user} setUser={setUser} setCurrentTab={navigate} goBack={goBack} language={language} logout={logout} />}
        {currentTab === 'roomBooking' && <RoomBookingScreen user={user} setCurrentTab={navigate} goBack={goBack} language={language} />}
        {currentTab === 'gallery' && <GalleryScreen setCurrentTab={navigate} goBack={goBack} language={language} />}
        {currentTab === 'history' && <HistoryScreen setCurrentTab={navigate} goBack={goBack} language={language} />}
        {currentTab === 'branches' && <BranchScreen setCurrentTab={navigate} goBack={goBack} language={language} />}
        {currentTab === 'quiz' && <QuizScreen user={user} setCurrentTab={navigate} goBack={goBack} language={language} />}
        {currentTab === 'publications' && <PublicationsScreen setCurrentTab={navigate} goBack={goBack} language={language} />}
        {currentTab === 'panchanga' && <PanchangaScreen setCurrentTab={navigate} goBack={goBack} language={language} />}
        {currentTab === 'settings' && <SettingsScreen setCurrentTab={navigate} goBack={goBack} language={language} />}
        {currentTab === 'notifications' && <NotificationScreen notifications={notifications} goBack={goBack} language={language} />}
        {currentTab === 'more' && <MoreScreen setCurrentTab={navigate} language={language} setLanguage={setLanguage} logout={logout} unreadCount={unreadCount} />}
        {currentTab === 'educationalInstitutions' && <EducationalInstitutionsScreen setCurrentTab={navigate} goBack={goBack} language={language} />}
        {currentTab === 'eKanike' && <EKanikeScreen user={user} setCurrentTab={navigate} goBack={goBack} language={language} />}
        {currentTab === 'renovation' && <RenovationScreen setCurrentTab={navigate} goBack={goBack} language={language} />}
        {currentTab === 'videos' && <VideosScreen setCurrentTab={navigate} goBack={goBack} language={language} />}
        {currentTab === 'newsletter' && <NewsletterScreen user={user} setCurrentTab={navigate} goBack={goBack} language={language} />}
        {currentTab === 'goshaale' && <GoshaaleScreen user={user} setCurrentTab={navigate} goBack={goBack} language={language} />}
        {currentTab === 'literaryWorks' && <LiteraryWorksScreen setCurrentTab={navigate} goBack={goBack} language={language} />}
        {currentTab === 'miracles' && <MiraclesScreen setCurrentTab={navigate} goBack={goBack} language={language} />}
        {currentTab === 'dailyWorship' && <DailyWorshipScreen setCurrentTab={navigate} goBack={goBack} language={language} />}
        {currentTab === 'devoteeVisit' && <DailyVisitScreen user={user} goBack={goBack} language={language} />}
        {currentTab === 'poojaTimings' && <PoojaTimingsScreen goBack={goBack} language={language} />}
        {currentTab === 'institutions' && <InstitutionsScreen goBack={goBack} language={language} />}
        {currentTab === 'placesToVisit' && <PlacesToVisitScreen goBack={goBack} language={language} />}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => switchTab('home')}
        >
          <Text style={[styles.tabText, currentTab === 'home' && styles.tabTextActive]}>🏠 {TRANSLATIONS[language as keyof typeof TRANSLATIONS].home}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => switchTab('seva')}
        >
          <Text style={[styles.tabText, currentTab === 'seva' && styles.tabTextActive]}>🙏 {TRANSLATIONS[language as keyof typeof TRANSLATIONS].seva}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setCurrentTab('events')}
        >
          <Text style={[styles.tabText, currentTab === 'events' && styles.tabTextActive]}>📅 {TRANSLATIONS[language as keyof typeof TRANSLATIONS].events}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setCurrentTab('more')}
        >
          <Text style={[styles.tabText, currentTab === 'more' && styles.tabTextActive]}>⋮ {TRANSLATIONS[language as keyof typeof TRANSLATIONS].more}</Text>
        </TouchableOpacity>
      </View>

      {/* Daily Panchanga Popup */}
      <Modal
        visible={showPanchangaPopup}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPanchangaPopup(false)}
      >
        <View style={styles.panchangaModalOverlay}>
          <View style={styles.panchangaModalContent}>
            <View style={styles.panchangaHeader}>
              <Text style={styles.panchangaTitle}>{TRANSLATIONS[language as keyof typeof TRANSLATIONS].panchangaPopupTitle}</Text>
              <TouchableOpacity onPress={() => setShowPanchangaPopup(false)}>
                <Text style={styles.panchangaCloseIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            {dailyPanchanga && (
              <ScrollView style={styles.panchangaBody}>
                <Text style={styles.panchangaDate}>{dailyPanchanga.date}</Text>

                <View style={styles.panchangaItem}>
                  <Text style={styles.panchangaLabel}>Tithi:</Text>
                  <Text style={styles.panchangaValue}>{dailyPanchanga.tithi?.name || dailyPanchanga.tithi}</Text>
                </View>
                <View style={styles.panchangaItem}>
                  <Text style={styles.panchangaLabel}>Nakshatra:</Text>
                  <Text style={styles.panchangaValue}>{dailyPanchanga.nakshatra?.name || dailyPanchanga.nakshatra}</Text>
                </View>
                <View style={styles.panchangaItem}>
                  <Text style={styles.panchangaLabel}>Yoga:</Text>
                  <Text style={styles.panchangaValue}>{dailyPanchanga.yoga?.name || dailyPanchanga.yoga}</Text>
                </View>
                <View style={styles.panchangaItem}>
                  <Text style={styles.panchangaLabel}>Karana:</Text>
                  <Text style={styles.panchangaValue}>{dailyPanchanga.karana?.name || dailyPanchanga.karana}</Text>
                </View>

                <View style={styles.panchangaDivider} />

                <View style={styles.panchangaItem}>
                  <Text style={styles.panchangaLabel}>Sunrise:</Text>
                  <Text style={styles.panchangaValue}>{dailyPanchanga.sunrise}</Text>
                </View>

                <View style={styles.panchangaItem}>
                  <Text style={styles.panchangaLabel}>Sunset:</Text>
                  <Text style={styles.panchangaValue}>{dailyPanchanga.sunset}</Text>
                </View>

                <View style={styles.panchangaItem}>
                  <Text style={styles.panchangaLabel}>Moonrise:</Text>
                  <Text style={styles.panchangaValue}>{dailyPanchanga.moonrise}</Text>
                </View>

                <View style={styles.panchangaItem}>
                  <Text style={styles.panchangaLabel}>Moonset:</Text>
                  <Text style={styles.panchangaValue}>{dailyPanchanga.moonset}</Text>
                </View>
              </ScrollView>
            )}

            <View style={styles.panchangaFooter}>
              <TouchableOpacity
                style={styles.panchangaFullButton}
                onPress={() => {
                  setShowPanchangaPopup(false);
                  switchTab('panchanga');
                }}
              >
                <Text style={styles.panchangaFullButtonText}>{TRANSLATIONS[language as keyof typeof TRANSLATIONS].viewFullPanchanga}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.panchangaCloseButton}
                onPress={() => setShowPanchangaPopup(false)}
              >
                <Text style={styles.panchangaCloseButtonText}>{TRANSLATIONS[language as keyof typeof TRANSLATIONS].closePanchanga}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Notification History Screen
function NotificationScreen({ notifications, goBack, language }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  return (
    <View style={styles.screen}>
      <View style={styles.rowHeader}>
        <TouchableOpacity onPress={goBack}>
          <Text style={styles.loadButton}>← {t.back}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.notificationHistory}</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 15 }}>
        {notifications.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 50, color: '#666' }}>{t.noNotifications}</Text>
        ) : (
          notifications.map((n: any) => (
            <View key={n.id} style={[styles.card, { padding: 15, marginBottom: 10, borderLeftWidth: 5, borderLeftColor: '#ff9800' }]}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 5 }}>{n.title}</Text>
              <Text style={{ color: '#555', marginBottom: 5 }}>{n.message}</Text>
              <Text style={{ fontSize: 10, color: '#888', textAlign: 'right' }}>
                {new Date(n.timestamp).toLocaleString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

// Home Screen
function HomeScreen({ setCurrentTab, language, unreadCount, navigateToNotifications }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/news`);
      if (response.ok) {
        const data = await response.json();
        const newsData = data.map((item: any) => ({
          id: item.id,
          title: item.title || '',
          content: item.content || '',
          imageUrl: item.imageUrl || '',
          publishedAt: item.publishedAt || new Date().toISOString(),
          flashUpdate: item.flashUpdate === true
        }));
        setNews(newsData);
      } else {
        Alert.alert('Error', 'Failed to load news');
      }
    } catch (error) {
      console.log('Fetch news error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    Voice.onSpeechResults = (e: any) => {
      if (e.value && e.value.length > 0) {
        setSearchText(e.value[0]);
      }
    };
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechError = (e: any) => {
      console.log('Voice Error:', e);
      setIsListening(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const flashUpdates = news.filter((n: any) => n.flashUpdate === true).slice(0, 5);
  const regularNews = news.filter((n: any) => n.flashUpdate !== true).slice(0, 4);

  const startVoiceSearch = async () => {
    if (isListening) {
      try {
        await Voice.stop();
      } catch (e) { }
      setIsListening(false);
      return;
    }

    // Permission check for Android
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Microphone Permission",
            message: "App needs access to your microphone for voice search.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(t.error, "Microphone permission is required for voice search");
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    setIsListening(true);
    try {
      await Voice.destroy();
      await Voice.start(language === 'KA' ? 'kn-IN' : 'en-US');
    } catch (e: any) {
      console.log('Voice start error:', e);
      setIsListening(false);
      Alert.alert(t.error, `Voice search failed: ${e.message || 'Unknown error'}`);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
        {/* Header with Search & Voice */}
        <View style={[styles.headerContainer, { paddingBottom: 15 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 15 }}>
            <Image
              source={require('./assets/matha-logo.png')}
              style={{ width: 50, height: 50 }}
              resizeMode="contain"
            />
            <View style={{ flex: 1, marginHorizontal: 15, position: 'relative' }}>
              <TextInput
                style={{ backgroundColor: '#fff', borderRadius: 25, paddingLeft: 15, paddingRight: 40, height: 40, fontSize: 14 }}
                placeholder={language === 'KA' ? 'ಹುಡುಕಿ...' : 'Search...'}
                value={searchText}
                onChangeText={setSearchText}
              />
              <TouchableOpacity
                onPress={startVoiceSearch}
                style={{ position: 'absolute', right: 10, top: 10 }}
              >
                <Text style={{ fontSize: 20 }}>{isListening ? '🎙️' : '🎤'}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={navigateToNotifications} style={{ position: 'relative' }}>
              <Text style={{ fontSize: 24 }}>🔔</Text>
              {unreadCount > 0 && (
                <View style={{ position: 'absolute', right: -2, top: -2, backgroundColor: 'red', borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.mathaTitle}>{t.appName}</Text>
          <Text style={styles.mathaSubtitle}>{t.subtitle}</Text>
          <Text style={{
            textAlign: 'center',
            color: '#fff',
            fontSize: 15,
            marginTop: 8,
            marginBottom: 12,
            lineHeight: 26,
            fontWeight: 'bold',
            textShadowColor: 'rgba(0, 0, 0, 0.75)',
            textShadowOffset: { width: -1, height: 1 },
            textShadowRadius: 10
          }}>
            {'ತಪೋವಿದ್ಯಾವಿರಕ್ತ್ಯಾದಿಸದ್ಗುಣೌಘಾಕರಾನಹಮ್ |\nವಾದಿರಾಜಗುರೂನ್ ವಂದೇ ಹಯಗ್ರೀವದಯಾಶ್ರಯಾನ್ ||'}
          </Text>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10, backgroundColor: '#fff', padding: 10, borderRadius: 15, width: '95%', alignItems: 'center', justifyContent: 'center' }}>
            <Image source={require('./assets/swamijis.png')} style={{ width: '100%', height: 100, borderRadius: 10 }} resizeMode="cover" />
          </View>
        </View>

        {/* Flash Updates Marquee-like row */}
        {
          flashUpdates.length > 0 && (
            <View style={{ backgroundColor: '#1a237e', paddingVertical: 8, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ backgroundColor: '#ffca28', paddingHorizontal: 10, paddingVertical: 2, marginRight: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{t.newsLabel}</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {flashUpdates.map((item: any) => (
                  <Text key={item.id} style={{ color: '#fff', marginRight: 30, fontSize: 14, fontWeight: '500' }}>
                    ⚡ {item.title}
                  </Text>
                ))}
              </ScrollView>
            </View>
          )
        }

        <View style={styles.quickActionsGrid}>
          {[
            { id: 'seva', icon: '🙏', label: t.seva },
            { id: 'roomBooking', icon: '🏨', label: t.rooms },
            { id: 'panchanga', icon: '📅', label: t.panchanga },
            { id: 'quiz', icon: '🎯', label: t.quiz },
            { id: 'branches', icon: '🏛️', label: t.branches },
            { id: 'events', icon: '🎊', label: t.events },
            { id: 'placesToVisit', icon: '🗺️', label: t.placesToVisit },
            { id: 'gallery', icon: '📸', label: t.gallery },
            { id: 'history', icon: '📖', label: t.history },
          ].map(action => (
            <TouchableOpacity key={action.id} style={styles.actionItem} onPress={() => setCurrentTab(action.id)}>
              <View style={{ backgroundColor: '#fdf3e7', padding: 12, borderRadius: 20, marginBottom: 8 }}>
                <Text style={{ fontSize: 24 }}>{action.icon}</Text>
              </View>
              <Text style={[styles.actionLabel, { fontSize: 12 }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* News Tiles Grid (Requirement Match) */}
        <View style={{ padding: 15 }}>
          <View style={styles.rowHeader}>
            <Text style={styles.sectionTitle}>{t.newsTitle}</Text>
            <TouchableOpacity onPress={() => setCurrentTab('newsFull')}>
              <Text style={styles.loadButton}>{t.viewAll}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 10 }}>
            {regularNews.map((item: any) => (
              <TouchableOpacity
                key={item.id}
                style={{ width: '48%', backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, overflow: 'hidden' }}
                onPress={() => Alert.alert(item.title, item.content)}
              >
                <Image
                  source={item.imageUrl ? { uri: item.imageUrl } : require('./assets/matha-logo.png')}
                  style={{ width: '100%', height: 100, backgroundColor: '#f0f0f0' }}
                  resizeMode="cover"
                />
                <View style={{ padding: 10 }}>
                  <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>{item.title}</Text>
                  <Text style={{ fontSize: 10, color: '#999', marginTop: 5 }}>{new Date(item.publishedAt).toLocaleDateString()}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ paddingHorizontal: 15, marginTop: 10 }}>
          <View style={styles.rowHeader}>
            <Text style={styles.sectionTitle}>{t.poojaTimings}</Text>
            <TouchableOpacity onPress={() => setCurrentTab('poojaTimings')}>
              <Text style={styles.loadButton}>{t.viewAll}</Text>
            </TouchableOpacity>
          </View>
          <DarshanaTimingsCard language={language} />
        </View>

        <WorshipCarousel setCurrentTab={setCurrentTab} language={language} />

        {/* Social Feed Simulation / Footer */}
        <View style={{ padding: 20, alignItems: 'center', backgroundColor: '#fdf3e7', marginTop: 10, borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1a237e', marginBottom: 15 }}>
            {t.connect}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
            <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com/sodesrimatha')} style={{ marginHorizontal: 15, alignItems: 'center' }}>
              <View style={{ backgroundColor: '#fff', padding: 10, borderRadius: 50, elevation: 2 }}>
                <Image source={{ uri: 'https://img.icons8.com/color/48/facebook-new.png' }} style={{ width: 24, height: 24 }} />
              </View>
              <Text style={{ fontSize: 10, marginTop: 5, color: '#666' }}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.youtube.com/@SriSodeVadirajaMatha')} style={{ marginHorizontal: 15, alignItems: 'center' }}>
              <View style={{ backgroundColor: '#fff', padding: 10, borderRadius: 50, elevation: 2 }}>
                <Image source={{ uri: 'https://img.icons8.com/color/48/youtube-play.png' }} style={{ width: 24, height: 24 }} />
              </View>
              <Text style={{ fontSize: 10, marginTop: 5, color: '#666' }}>YouTube</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/sodematha/')} style={{ marginHorizontal: 15, alignItems: 'center' }}>
              <View style={{ backgroundColor: '#fff', padding: 10, borderRadius: 50, elevation: 2 }}>
                <Image source={{ uri: 'https://img.icons8.com/color/48/instagram-new.png' }} style={{ width: 24, height: 24 }} />
              </View>
              <Text style={{ fontSize: 10, marginTop: 5, color: '#666' }}>Instagram</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://x.com/sodematha')} style={{ marginHorizontal: 15, alignItems: 'center' }}>
              <View style={{ backgroundColor: '#fff', padding: 10, borderRadius: 50, elevation: 2 }}>
                <Image source={{ uri: 'https://img.icons8.com/color/48/twitterx--v1.png' }} style={{ width: 24, height: 24 }} />
              </View>
              <Text style={{ fontSize: 10, marginTop: 5, color: '#666' }}>X (Twitter)</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 12, color: '#999', textAlign: 'center' }}>© {new Date().getFullYear()} Sode Sri Vadiraja Matha. All Rights Reserved.</Text>
          <Text style={{ fontSize: 11, color: '#ff9800', textAlign: 'center', marginTop: 8, fontWeight: 'bold' }}>{t.designedBy}</Text>
        </View>
        <View style={{ height: 60 }} />
      </ScrollView >
    </View >
  );
}


// Seva Screen
function SevaScreen({ user, language, setCurrentTab, goBack }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [sevas, setSevas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSeva, setSelectedSeva] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleBookingSubmit = async (data: any) => {
    setLoading(true);
    try {
      const payload = {
        user: { id: user.id },
        seva: { id: data.sevaId },
        bookingDate: data.date,
        sankalpaDetails: `${data.name}, ${data.gotra}, ${data.nakshatra}`,
        status: 'PENDING'
      };

      const res = await fetch(`${API_URL}/seva-bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        Alert.alert(t.success, t.successSeva);
        setSelectedSeva(null);
      } else {
        const err = await res.text();
        Alert.alert(t.error, err || 'Failed to book seva');
      }
    } catch (e) {
      Alert.alert(t.error, 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSevas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/sevas`);
      if (res.ok) {
        const data = await res.json();
        const sevasData = data.map((item: any) => ({
          ...item,
          active: item.active === true
        }));
        setSevas(sevasData);
      }
    } catch (e) {
      Alert.alert(t.error, t.errorLoadSevas);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSevas();
  }, []);

  if (selectedSeva) {
    return <SevaBookingForm seva={selectedSeva} user={user} onBack={() => setSelectedSeva(null)} onSubmit={handleBookingSubmit} language={language} />;
  }

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'POOJA': return t.pooja;
      case 'ALANKARA': return t.alankara;
      case 'ANNADANA': return t.annadana;
      case 'GOSHALA': return t.goshalaSeva;
      default: return t.otherSevas;
    }
  };

  const categories = Array.from(new Set(sevas.map((s: any) => s.type || 'OTHER')));

  // Filter sevas by category if one is selected
  const filteredSevas = selectedCategory ? sevas.filter((s: any) => (s.type || 'OTHER') === selectedCategory) : [];

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.premiumHeader}>
        <TouchableOpacity onPress={selectedCategory ? () => setSelectedCategory(null) : goBack}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.premiumHeaderTitle}>{selectedCategory ? getCategoryLabel(selectedCategory) : t.sevaBooking}</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#ff9800" style={{ marginTop: 20 }} />
        ) : (
          !selectedCategory ? (
            <View style={{ padding: 10 }}>
              {categories.sort().map((cat: any) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.premiumCard, { padding: 25, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1a237e' }}>{getCategoryLabel(cat)}</Text>
                    <Text style={{ fontSize: 13, color: '#666', marginTop: 5 }}>
                      {sevas.filter((s: any) => (s.type || 'OTHER') === cat).length} {language === 'KA' ? 'ಸೇವೆಗಳು ಲಭ್ಯವಿದೆ' : 'Services Available'}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 24, color: '#ff9800' }}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={{ padding: 10 }}>
              <Text style={[styles.sectionTitle, { color: '#1a237e', marginBottom: 10, paddingHorizontal: 5 }]}>{getCategoryLabel(selectedCategory)}</Text>
              {filteredSevas.map((item: any) => (
                <View key={item.id} style={styles.card}>
                  <View style={styles.row}>
                    <Text style={styles.sevaName}>{language === 'KA' ? (item.nameKa || item.name) : item.name}</Text>
                    <Text style={styles.sevaAmount}>₹{item.amount}</Text>
                  </View>
                  <Text style={styles.sevaDesc}>{language === 'KA' ? (item.descriptionKa || item.description) : item.description}</Text>
                  {item.location && (
                    <Text style={{ fontSize: 11, color: '#888', fontStyle: 'italic', marginBottom: 5 }}>
                      📍 {item.location === 'UDUPI' ? t.udupiSevas : t.sodeSevas}
                    </Text>
                  )}
                  <TouchableOpacity style={styles.bookButton} onPress={() => setSelectedSeva(item)}>
                    <Text style={styles.buttonText}>{t.bookNow}</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {filteredSevas.length === 0 && (
                <Text style={{ textAlign: 'center', marginTop: 30, color: '#999' }}>{language === 'KA' ? 'ಯಾವುದೇ ಸೇವೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ' : 'No sevas found'}</Text>
              )}
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}


// Seva Booking Form Component
function SevaBookingForm({ seva, user, onBack, onSubmit, language }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [formData, setFormData] = useState({
    date: '',
    name: user?.name || '',
    phone: user?.mobileNumber || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || 'Karnataka',
    pincode: user?.pincode || '',
    rashi: user?.rashi || '',
    nakshatra: user?.nakshatra || '',
    gotra: user?.gotra || '',
    paymentMode: 'Online',
    collectPrasadam: 'visit', // visit | post
    postalAddress: '',
    sameAsAbove: true,
    sevaId: seva?.id
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = () => {
    if (!formData.name || !formData.date || !formData.phone) {
      Alert.alert(t.error, t.requiredFields);
      return;
    }
    Alert.alert(
      t.paymentGateway,
      `${t.proceedPay} ₹${seva.amount}?`,
      [
        { text: t.cancel, style: 'cancel' },
        { text: t.payNow, onPress: () => onSubmit(formData) }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={styles.premiumHeader}>
        <TouchableOpacity onPress={onBack}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.premiumHeaderTitle}>{t.bookNow}</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.premiumCard}>
          <View style={styles.formSectionHeader}>
            <Text style={styles.formSectionTitle}>1. {language === 'KA' ? 'ಸೇವಾ ವಿವರಗಳು' : 'Seva Details'}</Text>
          </View>
          <View style={styles.formPadding}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1a237e' }}>{language === 'KA' ? (seva.nameKa || seva.name) : seva.name}</Text>
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 10 }}>{language === 'KA' ? (seva.descriptionKa || seva.description) : seva.description}</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ff9800' }}>₹{seva.amount}</Text>

            <Text style={styles.formLabel}>{t.date} *</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.premiumDropdown}>
              <Text style={{ color: formData.date ? '#000' : '#999' }}>{formData.date || t.selectDate}</Text>
              <Text style={{ color: '#666' }}>📅</Text>
            </TouchableOpacity>
            <ModalDatePicker visible={showDatePicker} onClose={() => setShowDatePicker(false)} onSelect={(d: string) => setFormData({ ...formData, date: d })} language={language} />
          </View>

          <View style={styles.formSectionHeader}>
            <Text style={styles.formSectionTitle}>2. {t.devoteeDetails}</Text>
          </View>
          <View style={styles.formPadding}>
            <Text style={styles.formLabel}>{t.phone} *</Text>
            <TextInput style={styles.premiumInput} keyboardType="phone-pad" value={formData.phone} onChangeText={t => setFormData({ ...formData, phone: t })} placeholder="10-digit mobile number" />

            <Text style={styles.formLabel}>{t.name} *</Text>
            <TextInput style={styles.premiumInput} value={formData.name} onChangeText={t => setFormData({ ...formData, name: t })} placeholder="Devotee Name" />

            <Text style={styles.formLabel}>{t.email}</Text>
            <TextInput style={styles.premiumInput} keyboardType="email-address" value={formData.email} onChangeText={t => setFormData({ ...formData, email: t })} placeholder="Optional" />

            <Text style={styles.formLabel}>{t.address}</Text>
            <TextInput style={[styles.premiumInput, { height: 60 }]} multiline value={formData.address} onChangeText={t => setFormData({ ...formData, address: t })} placeholder="Full Address" />

            <View style={styles.inputRow}>
              <View style={styles.inputCol}>
                <Text style={styles.formLabel}>{t.city}</Text>
                <TextInput style={styles.premiumInput} value={formData.city} onChangeText={t => setFormData({ ...formData, city: t })} />
              </View>
              <View style={styles.inputCol}>
                <Text style={styles.formLabel}>{t.pincode}</Text>
                <TextInput style={styles.premiumInput} keyboardType="numeric" value={formData.pincode} onChangeText={t => setFormData({ ...formData, pincode: t })} />
              </View>
            </View>

            <Text style={styles.formLabel}>{t.state}</Text>
            <CustomDropdown
              premium
              value={formData.state}
              options={INDIAN_STATES}
              onSelect={(s: string) => setFormData({ ...formData, state: s })}
            />
          </View>

          <View style={styles.formSectionHeader}>
            <Text style={styles.formSectionTitle}>3. {t.astroDetails}</Text>
          </View>
          <View style={styles.formPadding}>
            <View style={styles.inputRow}>
              <View style={styles.inputCol}>
                <CustomDropdown
                  premium
                  label={t.rashi}
                  value={formData.rashi}
                  options={RASHIS}
                  onSelect={(s: string) => setFormData({ ...formData, rashi: s })}
                  placeholder="Select Rashi"
                />
              </View>
              <View style={styles.inputCol}>
                <CustomDropdown
                  premium
                  label={t.nakshatra}
                  value={formData.nakshatra}
                  options={NAKSHATRAS}
                  onSelect={(s: string) => setFormData({ ...formData, nakshatra: s })}
                  placeholder="Select Nakshatra"
                />
              </View>
            </View>
            <CustomDropdown
              premium
              label={t.gotra}
              value={formData.gotra}
              options={GOTRAS}
              onSelect={(s: string) => setFormData({ ...formData, gotra: s })}
              placeholder="Select Gotra"
            />
          </View>

          <View style={styles.formSectionHeader}>
            <Text style={styles.formSectionTitle}>4. {t.prasadamCollection}</Text>
          </View>
          <View style={styles.formPadding}>
            <View style={styles.radioRow}>
              <TouchableOpacity style={styles.radioItem} onPress={() => setFormData({ ...formData, collectPrasadam: 'visit' })}>
                <View style={[styles.radioOuter, formData.collectPrasadam === 'visit' && styles.radioActive]} />
                <Text style={styles.radioLabel}>{t.visit}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.radioItem} onPress={() => setFormData({ ...formData, collectPrasadam: 'post' })}>
                <View style={[styles.radioOuter, formData.collectPrasadam === 'post' && styles.radioActive]} />
                <Text style={styles.radioLabel}>{t.post}</Text>
              </TouchableOpacity>
            </View>

            {formData.collectPrasadam === 'post' && (
              <View>
                <TouchableOpacity style={styles.checkboxRow} onPress={() => setFormData({ ...formData, sameAsAbove: !formData.sameAsAbove })}>
                  <View style={[styles.checkbox, formData.sameAsAbove && styles.checkboxActive]} />
                  <Text style={styles.checkboxLabel}>{t.postalSame}</Text>
                </TouchableOpacity>
                {!formData.sameAsAbove && (
                  <TextInput style={[styles.premiumInput, { height: 80 }]} multiline placeholder={t.enterPostal} value={formData.postalAddress} onChangeText={t => setFormData({ ...formData, postalAddress: t })} />
                )}
              </View>
            )}

            <View style={styles.divider} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Total Amount</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1a237e' }}>₹{seva.amount}</Text>
            </View>

            <TouchableOpacity style={styles.premiumSubmitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>{t.proceedPayment}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginTop: 15 }} onPress={() => Linking.openURL('https://sodematha.in/refund-policy')}>
              <Text style={{ color: '#1a237e', textAlign: 'center', textDecorationLine: 'underline', fontSize: 12 }}>
                Cancellation & Refund Policy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}


// Events Screen
function EventsScreen({ language, goBack }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [events, setEvents] = useState([
    { id: 1, title: 'Sri Vadiraja Jayanthi', description: 'Grand celebration of Sri Vadiraja Teertha Swamiji Jayanthi.', eventDate: '2024-02-23', location: 'Sode Matha' },
    { id: 2, title: 'Aradhana Mahotsava', description: 'Annual Aradhana celebrations with special poojas.', eventDate: '2024-03-15', location: 'Sode Matha' },
    { id: 3, title: 'Laksha Deepotsava', description: 'Lighting of one lakh lamps in the holy precincts.', eventDate: '2024-11-23', location: 'Udupi Krishna Matha' }
  ]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/events`);
      if (res.ok) {
        setEvents(await res.json());
      }
    } catch (e) {
      Alert.alert('Error', 'Could not load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <ScrollView style={styles.screen}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <TouchableOpacity onPress={goBack} style={{ marginRight: 10 }}>
          <Ionicons name="arrow-back" size={24} color="#ff6f00" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.upcomingEvents}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ff9800" />
      ) : (
        events.map((e: any) => (
          <View key={e.id} style={styles.card}>
            <Text style={styles.eventTitle}>{e.title}</Text>
            <Text style={styles.eventDate}>{e.eventDate}</Text>
            <Text>{e.description}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

// Quiz Screen
function QuizScreen({ user, setCurrentTab, goBack, language }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, [language]);

  const fetchQuestions = () => {
    setLoading(true);
    setFinished(false);
    setCurrentQ(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);

    fetch(`${API_URL}/quiz/play?lang=${language}`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(err => {
        console.log('Quiz fetch error', err);
        setLoading(false);
      });
  };

  const submitScore = async (finalScore: number) => {
    if (!user) return;
    setSubmitting(true);
    try {
      await fetch(`${API_URL}/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          score: finalScore,
          total: questions.length
        })
      });
      fetchLeaderboard();
    } catch (e) {
      console.log('Score submit error', e);
    } finally {
      setSubmitting(false);
    }
  };

  const fetchLeaderboard = () => {
    fetch(`${API_URL}/quiz/leaderboard`)
      .then(res => res.json())
      .then(data => setLeaderboard(data))
      .catch(() => { });
  };

  const handleAnswer = (selectedOption: string) => {
    if (selectedAnswer) return; // Prevent multiple clicks

    const q = questions[currentQ];
    const correctMap: any = { 'A': q.optionA, 'B': q.optionB, 'C': q.optionC, 'D': q.optionD };
    const correctVal = correctMap[q.correctAnswer];

    setSelectedAnswer(selectedOption);
    const correct = selectedOption === correctVal;
    setIsCorrect(correct);

    let newScore = score;
    if (correct) {
      newScore = score + 1;
      setScore(newScore);
    }

    // Delay for feedback animation
    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setFinished(true);
        if (user) submitScore(newScore);
        else fetchLeaderboard();
      }
    }, 1000);
  };

  if (loading) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator size="large" color="#ff9800" style={{ marginTop: 100 }} />
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.screen}>
        <View style={styles.rowHeader}>
          <TouchableOpacity onPress={goBack}>
            <Text style={styles.loadButton}>← {t.back}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.quizTitle}</Text>
        </View>
        <View style={styles.card}>
          <Text style={{ textAlign: 'center', padding: 20 }}>{language === 'KA' ? 'ಪ್ರಶ್ನೆಗಳು ಲಭ್ಯವಿಲ್ಲ' : 'No questions available at the moment.'}</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Dynamic Header with Gradient-like feel */}
      <View style={{ backgroundColor: '#ff9800', padding: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, elevation: 4 }}>
        <StatusBar style="light" />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <TouchableOpacity onPress={goBack ? goBack : () => setCurrentTab('home')} style={{ padding: 5 }}>
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#fff', marginLeft: 10 }}>{t.quizTitle}</Text>
        </View>
        {!finished && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 15 }}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Question {currentQ + 1} / {questions.length}</Text>
            </View>
            <View style={{ backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 15 }}>
              <Text style={{ fontWeight: 'bold', color: '#ff9800' }}>Score: {score}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={{ padding: 16 }}>
        {!finished ? (
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 25, lineHeight: 28 }}>
              {questions[currentQ].question}
            </Text>

            {[questions[currentQ].optionA, questions[currentQ].optionB, questions[currentQ].optionC, questions[currentQ].optionD].filter(Boolean).map((opt, i) => {
              const isActive = selectedAnswer === opt;
              let bgColor = '#f5f5f5';
              let borderColor = '#eee';
              let iconColor = '#999';
              let iconText = ['A', 'B', 'C', 'D'][i];

              if (isActive) {
                if (isCorrect) {
                  bgColor = '#e8f5e9';
                  borderColor = '#4caf50';
                  iconColor = '#4caf50';
                  iconText = '✓';
                } else {
                  bgColor = '#ffebee';
                  borderColor = '#f44336';
                  iconColor = '#f44336';
                  iconText = '✗';
                }
              }

              return (
                <TouchableOpacity
                  key={i}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: bgColor,
                    borderWidth: 2,
                    borderColor: borderColor,
                    padding: 16,
                    borderRadius: 12,
                    marginBottom: 12,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                  onPress={() => handleAnswer(opt)}
                  disabled={selectedAnswer !== null}
                >
                  <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginRight: 15, borderWidth: 1, borderColor: borderColor }}>
                    <Text style={{ fontWeight: 'bold', color: iconColor, fontSize: 16 }}>{iconText}</Text>
                  </View>
                  <Text style={{ fontSize: 16, color: '#333', flex: 1, fontWeight: '500' }}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={{ alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 30, elevation: 3 }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#4caf50', marginBottom: 10 }}>{t.quizCompleted}</Text>
            <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: '#fff8e1', justifyContent: 'center', alignItems: 'center', marginVertical: 20, borderWidth: 4, borderColor: '#ff9800' }}>
              <Text style={{ fontSize: 48, fontWeight: 'bold', color: '#ff9800' }}>{Math.round((score / questions.length) * 100)}%</Text>
            </View>
            <Text style={{ fontSize: 20, color: '#555', marginBottom: 30 }}>{t.yourScore}: <Text style={{ fontWeight: 'bold' }}>{score} / {questions.length}</Text></Text>

            {submitting && <ActivityIndicator color="#ff9800" style={{ marginBottom: 20 }} />}

            <TouchableOpacity
              style={{
                backgroundColor: '#ff9800',
                paddingVertical: 15,
                paddingHorizontal: 40,
                borderRadius: 30,
                marginBottom: 30,
                elevation: 5
              }}
              onPress={fetchQuestions}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>{t.restartQuiz}</Text>
            </TouchableOpacity>

            <View style={{ width: '100%' }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1a237e', marginBottom: 15, textAlign: 'center' }}>🏆 Leaderboard</Text>
              {leaderboard.map((entry, index) => (
                <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: index === 0 ? '#fffde7' : 'transparent', borderRadius: 8, marginBottom: 5 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontWeight: 'bold', width: 30, color: index === 0 ? '#ff9800' : '#777', fontSize: 16 }}>#{index + 1}</Text>
                    <Text style={{ fontWeight: index === 0 ? 'bold' : 'normal', fontSize: 16, color: '#333' }}>{entry.user?.name || 'Unknown'}</Text>
                  </View>
                  <Text style={{ fontWeight: 'bold', color: '#ff9800', fontSize: 16 }}>{entry.score}/{entry.totalQuestions}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// Publications Screen
function PublicationsScreen({ setCurrentTab, goBack, language }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const books = [
    { title: 'Yukti Mallika', author: 'Sri Vadiraja Swamiji', type: 'Philosophy' },
    { title: 'Tirtha Prabandha', author: 'Sri Vadiraja Swamiji', type: 'Travelogue' }
  ];
  return (
    <ScrollView style={styles.screen}>
      <View style={styles.rowHeader}>
        <TouchableOpacity onPress={goBack ? goBack : () => setCurrentTab('home')}>
          <Text style={styles.loadButton}>← {t.back}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.publicationsTitle}</Text>
      </View>
      {books.map((b, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.newsTitle}>{b.title}</Text>
          <Text style={styles.label}>{t.author}: {b.author}</Text>
          <Text style={styles.label}>{t.type}: {b.type}</Text>
          <TouchableOpacity style={styles.bookButton} onPress={() => Alert.alert(t.download, t.comingSoon)}>
            <Text style={styles.buttonText}>{t.readOnline}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

// More Screen
function MoreScreen({ setCurrentTab, language, setLanguage, logout, unreadCount }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const toggleLanguage = () => {
    Alert.alert('Language', 'Choose your preferred language', [
      { text: 'English', onPress: () => setLanguage('EN') },
      { text: 'Kannada (ಕನ್ನಡ)', onPress: () => setLanguage('KA') }
    ]);
  };

  return (
    <ScrollView style={styles.screen}>
      <Text style={styles.headerTitle}>{t.moreOptions}</Text>
      <View style={styles.card}>
        <TouchableOpacity onPress={toggleLanguage} style={[styles.menuItem, { flexDirection: 'row', justifyContent: 'space-between' }]}>
          <Text style={{ fontSize: 16 }}>{t.language}</Text>
          <Text style={{ fontWeight: 'bold', color: '#ff9800' }}>{language === 'KA' ? 'ಕನ್ನಡ' : 'English'}</Text>
        </TouchableOpacity>

        <View style={{ height: 10 }} />

        <TouchableOpacity onPress={() => setCurrentTab('myBookings')}>
          <Text style={styles.menuItem}>📋 {t.myBookings}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('notifications')} style={[styles.menuItem, { flexDirection: 'row', justifyContent: 'space-between' }]}>
          <Text style={{ fontSize: 16 }}>🔔 {t.notifications}</Text>
          {unreadCount > 0 && (
            <View style={{ backgroundColor: 'red', borderRadius: 10, minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5 }}>
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('history')}>
          <Text style={styles.menuItem}>📖 {t.histParam}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('branches')}>
          <Text style={styles.menuItem}>🏛️ {t.branchDict}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('gallery')}>
          <Text style={styles.menuItem}>📸 {t.gallery}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('roomBooking')}>
          <Text style={styles.menuItem}>🏨 {t.rooms}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('profile')}>
          <Text style={styles.menuItem}>👤 {t.profile}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('quiz')}>
          <Text style={styles.menuItem}>🎯 {t.quiz}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('publications')}>
          <Text style={styles.menuItem}>📚 {t.publications}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('panchanga')}>
          <Text style={styles.menuItem}>📅 {t.tithinirnaya}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('educationalInstitutions')}>
          <Text style={styles.menuItem}>🎓 {t.educationalInstitutions}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('placesToVisit')}>
          <Text style={styles.menuItem}>🗺️ {t.placesToVisit}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('eKanike')}>
          <Text style={styles.menuItem}>💰 {t.eKanike}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('renovation')}>
          <Text style={styles.menuItem}>🏗️ {t.renovation}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('videos')}>
          <Text style={styles.menuItem}>🎥 {t.videos}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('goshaale')}>
          <Text style={styles.menuItem}>🐄 {t.goshaale}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('newsletter')}>
          <Text style={styles.menuItem}>📧 {t.newsletter}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentTab('settings')}>
          <Text style={styles.menuItem}>⚙️ {t.settings}</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />

        <View style={{ paddingVertical: 15, borderTopWidth: 1, borderTopColor: '#eee' }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 15, textAlign: 'center' }}>
            {language === 'KA' ? 'ಸಾಮಾಜಿಕ ಜಾಲತಾಣಗಳಲ್ಲಿ ನಮ್ಮನ್ನು ಅನುಸರಿಸಿ' : 'Follow Us on Social Media'}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com/sodesrimatha')} style={{ marginHorizontal: 15 }}>
              <MaterialCommunityIcons name="facebook" size={32} color="#1877F2" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.youtube.com/@SriSodeVadirajaMatha')} style={{ marginHorizontal: 15 }}>
              <MaterialCommunityIcons name="youtube" size={32} color="#FF0000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/sodematha/')} style={{ marginHorizontal: 15 }}>
              <MaterialCommunityIcons name="instagram" size={32} color="#C13584" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://x.com/sodematha')} style={{ marginHorizontal: 15 }}>
              <MaterialCommunityIcons name="twitter" size={32} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={logout} style={{ marginTop: 10 }}>
          <Text style={[styles.menuItem, { color: '#d32f2f', borderBottomWidth: 0, textAlign: 'center' }]}>🚪 {t.logout}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}
function AuthScreen({ onLogin, language, setLanguage }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Mobile, 2: OTP, 3: Register
  const [loading, setLoading] = useState(false);

  // Registration Data
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    address: '',
    rashi: '',
    nakshatra: '',
    gotra: '',
    volunteer: false,
    consent: true
  });

  const requestOtp = async () => {
    if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
      Alert.alert(t.error, t.enterValidMobile);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      Alert.alert(t.success, 'OTP: 123456 (Simulated)');
    }, 1000);
  };

  const verifyOtp = async () => {
    if (otp !== '123456') {
      Alert.alert(t.error, 'Invalid OTP (Demo: 123456)');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/mobile/${mobile}`);
      if (response.ok) {
        const userData = await response.json();
        await AsyncStorage.setItem('userMobile', mobile);
        onLogin(userData);
      } else if (response.status === 404) {
        setStep(3); // Go to registration
      } else {
        Alert.alert(t.error, 'Server error. Please try again later.');
      }
    } catch (e: any) {
      console.log('Login error:', e);
      Alert.alert(t.error, 'Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!regData.name || !regData.consent) {
      Alert.alert(t.error, t.requiredFields);
      return;
    }

    setLoading(true);
    try {
      const userData = {
        name: regData.name,
        mobileNumber: mobile,
        email: regData.email,
        address: regData.address,
        role: 'USER',
        volunteer: regData.volunteer,
        consentDataStorage: regData.consent,
        consentCommunications: true
      };

      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (res.ok) {
        const newUser = await res.json();
        await AsyncStorage.setItem('userMobile', mobile);
        onLogin(newUser);
      } else {
        const err = await res.text();
        Alert.alert(t.error, err || 'Registration failed');
      }
    } catch (e) {
      Alert.alert(t.error, 'Could not complete registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff3e0' }}>
      <View style={{ position: 'absolute', top: 40, right: 20, flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => setLanguage('EN')} style={{ padding: 10, backgroundColor: language === 'EN' ? '#ff9800' : '#fff', borderRadius: 5, marginRight: 5 }}>
          <Text style={{ fontWeight: 'bold' }}>EN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setLanguage('KA')} style={{ padding: 10, backgroundColor: language === 'KA' ? '#ff9800' : '#fff', borderRadius: 5 }}>
          <Text style={{ fontWeight: 'bold' }}>ಕನ್ನಡ</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={require('./assets/matha-logo.png')}
        style={[styles.logo, { alignSelf: 'center', width: 120, height: 120, marginBottom: 10 }]}
        resizeMode="contain"
      />
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#d84315', textAlign: 'center', marginBottom: 5 }}>
        {t.appName}
      </Text>
      <Text style={{ fontSize: 14, color: '#5d4037', textAlign: 'center', marginBottom: 30 }}>
        {t.officialApp}
      </Text>

      <View style={styles.card}>
        <Text style={[styles.sectionTitle, { textAlign: 'center', marginBottom: 20 }]}>
          {step === 1 ? t.loginTitle : step === 2 ? t.otpPlace : t.devoteeReg}
        </Text>

        {step === 1 && (
          <>
            <TextInput
              style={styles.input}
              placeholder={t.mobilePlace}
              keyboardType="phone-pad"
              maxLength={10}
              value={mobile}
              onChangeText={setMobile}
            />
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
              onPress={() => setRegData({ ...regData, consent: !regData.consent })}
            >
              <View style={{ width: 22, height: 22, borderWidth: 2, borderColor: '#ff9800', marginRight: 10, backgroundColor: regData.consent ? '#ff9800' : 'transparent', borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
                {regData.consent && <Text style={{ color: '#fff', fontSize: 12 }}>✓</Text>}
              </View>
              <Text style={{ fontSize: 12, flex: 1 }}>{t.termsAndPrivacy}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={requestOtp} disabled={loading || !regData.consent}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{t.getOtp}</Text>}
            </TouchableOpacity>
            {/* Firebase Recaptcha Removed */}
          </>
        )}

        {step === 2 && (
          <>
            <Text style={{ textAlign: 'center', marginBottom: 15, color: '#666' }}>{mobile}</Text>
            <TextInput
              style={styles.input}
              placeholder={t.otpPlace}
              keyboardType="numeric"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
            />
            <TouchableOpacity style={styles.button} onPress={verifyOtp} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{t.verifyOtp}</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStep(1)} style={{ marginTop: 15 }}>
              <Text style={{ textAlign: 'center', color: '#ff9800' }}>{t.back}</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 3 && (
          <ScrollView>
            <TextInput style={styles.input} placeholder={t.name + " *"} value={regData.name} onChangeText={t => setRegData({ ...regData, name: t })} />
            <TextInput style={styles.input} placeholder={t.email} keyboardType="email-address" value={regData.email} onChangeText={t => setRegData({ ...regData, email: t })} />
            <TextInput style={styles.input} placeholder={t.address} value={regData.address} onChangeText={t => setRegData({ ...regData, address: t })} />
            <View style={styles.inputRow}>
              <View style={styles.inputCol}>
                <CustomDropdown
                  label={t.rashi}
                  value={regData.rashi}
                  options={RASHIS}
                  onSelect={(s: string) => setRegData({ ...regData, rashi: s })}
                  placeholder={t.selectRashi}
                />
              </View>
              <View style={styles.inputCol}>
                <CustomDropdown
                  label={t.nakshatra}
                  value={regData.nakshatra}
                  options={NAKSHATRAS}
                  onSelect={(s: string) => setRegData({ ...regData, nakshatra: s })}
                  placeholder={t.selectNakshatra}
                />
              </View>
            </View>
            <CustomDropdown
              label={t.gotra}
              value={regData.gotra}
              options={GOTRAS}
              onSelect={(s: string) => setRegData({ ...regData, gotra: s })}
              placeholder={t.selectGotra}
            />

            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }} onPress={() => setRegData({ ...regData, volunteer: !regData.volunteer })}>
              <View style={{ width: 20, height: 20, borderWidth: 2, borderColor: '#ff9800', marginRight: 10, backgroundColor: regData.volunteer ? '#ff9800' : 'transparent', borderRadius: 4 }} />
              <Text>{t.volunteerSignup}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }} onPress={() => setRegData({ ...regData, consent: !regData.consent })}>
              <View style={{ width: 20, height: 20, borderWidth: 2, borderColor: '#ff9800', marginRight: 10, backgroundColor: regData.consent ? '#ff9800' : 'transparent', borderRadius: 4 }} />
              <Text style={{ fontSize: 12, flex: 1 }}>{t.consent}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{t.register}</Text>}
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
      <Text style={{ textAlign: 'center', marginTop: 20, color: '#d84315', fontWeight: 'bold' }}>Team Hayavadana</Text>
    </ScrollView>
  );
}


// Profile & Registration Screen
function ProfileScreen({ user, setUser, setCurrentTab, goBack, language, logout }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [formData, setFormData] = useState({
    name: user?.name || '',
    mobile: user?.mobileNumber || '',
    email: user?.email || '',
    address: user?.address || '',
    city: '', state: '', pincode: '',
    rashi: '', nakshatra: '', gotra: '',
    volunteer: user?.volunteer || false,
    updates: user?.consentCommunications || true,
    consent: user?.consentDataStorage || true
  });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!formData.name) {
      Alert.alert(t.error, t.requiredFields);
      return;
    }

    setLoading(true);
    try {
      const userData = {
        ...user,
        name: formData.name,
        email: formData.email,
        address: formData.address,
        volunteer: formData.volunteer,
        rashi: formData.rashi,
        nakshatra: formData.nakshatra,
        gotra: formData.gotra,
        consentDataStorage: formData.consent,
        consentCommunications: formData.updates
      };

      const res = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        Alert.alert(t.success, t.updateProfile);
      } else {
        Alert.alert(t.error, 'Failed to update profile');
      }
    } catch (e) {
      Alert.alert(t.error, 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.rowHeader}>
        <TouchableOpacity onPress={goBack ? goBack : () => setCurrentTab('home')}>
          <Text style={styles.loadButton}>← {t.back}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.yourProfile}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>{t.name} *</Text>
        <TextInput style={styles.input} value={formData.name} onChangeText={t => setFormData({ ...formData, name: t })} />

        <Text style={styles.label}>{t.phone}</Text>
        <TextInput style={[styles.input, { backgroundColor: '#eee' }]} value={formData.mobile} editable={false} />

        <Text style={styles.label}>{t.email}</Text>
        <TextInput style={styles.input} value={formData.email} onChangeText={t => setFormData({ ...formData, email: t })} />

        <Text style={styles.label}>{t.address}</Text>
        <TextInput style={styles.input} value={formData.address} onChangeText={t => setFormData({ ...formData, address: t })} />

        <View style={styles.inputRow}>
          <View style={styles.inputCol}>
            <CustomDropdown
              label={t.rashi}
              value={formData.rashi}
              options={RASHIS}
              onSelect={(s: string) => setFormData({ ...formData, rashi: s })}
              placeholder={t.selectRashi}
            />
          </View>
          <View style={styles.inputCol}>
            <CustomDropdown
              label={t.nakshatra}
              value={formData.nakshatra}
              options={NAKSHATRAS}
              onSelect={(s: string) => setFormData({ ...formData, nakshatra: s })}
              placeholder={t.selectNakshatra}
            />
          </View>
        </View>

        <CustomDropdown
          label={t.gotra}
          value={formData.gotra}
          options={GOTRAS}
          onSelect={(s: string) => setFormData({ ...formData, gotra: s })}
          placeholder={t.selectGotra}
        />

        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15 }} onPress={() => setFormData({ ...formData, volunteer: !formData.volunteer })}>
          <View style={{ width: 22, height: 22, borderWidth: 2, borderColor: '#ff9800', marginRight: 10, backgroundColor: formData.volunteer ? '#ff9800' : 'transparent', borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
            {formData.volunteer && <Text style={{ color: '#fff', fontSize: 12 }}>✓</Text>}
          </View>
          <Text>{t.volunteerSignup}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }} onPress={() => setFormData({ ...formData, updates: !formData.updates })}>
          <View style={{ width: 22, height: 22, borderWidth: 2, borderColor: '#ff9800', marginRight: 10, backgroundColor: formData.updates ? '#ff9800' : 'transparent', borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
            {formData.updates && <Text style={{ color: '#fff', fontSize: 12 }}>✓</Text>}
          </View>
          <Text>{t.subscribeUpdates}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{t.updateProfile}</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={logout} style={{ marginTop: 20 }}>
          <Text style={{ textAlign: 'center', color: '#d32f2f', fontWeight: 'bold' }}>🚪 {t.logout}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Settings Screen
function SettingsScreen({ setCurrentTab, goBack, language }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [notifications, setNotifications] = useState(true);
  return (
    <ScrollView style={styles.screen}>
      <View style={styles.rowHeader}>
        <TouchableOpacity onPress={goBack ? goBack : () => setCurrentTab('home')}>
          <Text style={styles.loadButton}>← {t.back}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.settingsTitle}</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>{t.pushNotif}</Text>
          <TouchableOpacity onPress={() => setNotifications(!notifications)}>
            <Text style={{ color: notifications ? 'green' : 'red', fontWeight: 'bold' }}>{notifications ? t.on : t.off}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// Educational Institutions Screen
function EducationalInstitutionsScreen({ setCurrentTab, goBack, language }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/institutions`)
      .then(res => res.json())
      .then(data => {
        setInstitutions(data);
        setLoading(false);
      })
      .catch(err => {
        console.log('Error fetching institutions:', err);
        setLoading(false);
      });
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.premiumHeader}>
        <TouchableOpacity onPress={goBack}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.premiumHeaderTitle}>{t.educationalInstitutions}</Text>
        <View style={{ width: 30 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ff9800" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 15 }}>
          {institutions.map((inst, index) => (
            <View key={index} style={[styles.card, { marginBottom: 15, padding: 15 }]}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ff9800', marginBottom: 5 }}>
                {inst.name}
              </Text>
              <Text style={{ fontSize: 12, color: '#666', marginBottom: 10, fontStyle: 'italic' }}>
                {inst.tagline}
              </Text>
              <Text style={{ fontSize: 12, color: '#999', marginBottom: 5 }}>
                📍 {inst.location}
              </Text>
              <Text style={{ fontSize: 12, color: '#999', marginBottom: 10 }}>
                📞 {inst.contact}
              </Text>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#1976d2' }]}
                onPress={() => Linking.openURL(inst.website)}
              >
                <Text style={styles.buttonText}>{t.visitWebsite}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// E-Kanike (Online Donation) Screen
function EKanikeScreen({ user, setCurrentTab, goBack, language }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('General');
  const [donorName, setDonorName] = useState(user?.name || '');
  const [donorEmail, setDonorEmail] = useState(user?.email || '');

  const purposes = [
    t.general,
    t.renovation,
    t.cowFeed,
    t.cowMedicine,
    t.infrastructure,
    'Seva',
    'Anna Daana'
  ];

  const handleDonate = async () => {
    if (!amount || !donorName || !donorEmail) {
      Alert.alert(t.error, t.requiredFields);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName,
          donorEmail,
          purpose,
          amount: parseFloat(amount)
        })
      });

      if (response.ok) {
        Alert.alert(
          t.success,
          `Thank you for your donation of ₹${amount} for ${purpose}!`,
          [{ text: 'OK', onPress: goBack }]
        );
      } else {
        Alert.alert(t.error, 'Failed to process donation record.');
      }
    } catch (e) {
      Alert.alert(t.error, 'Something went wrong.');
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.premiumHeader}>
        <TouchableOpacity onPress={goBack}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.premiumHeaderTitle}>{t.eKanike}</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.card}>
          <Text style={styles.label}>{t.yourName}</Text>
          <TextInput
            style={styles.input}
            value={donorName}
            onChangeText={setDonorName}
            placeholder={t.yourName}
          />

          <Text style={styles.label}>{t.yourEmail}</Text>
          <TextInput
            style={styles.input}
            value={donorEmail}
            onChangeText={setDonorEmail}
            placeholder={t.yourEmail}
            keyboardType="email-address"
          />

          <Text style={styles.label}>{t.donationPurpose}</Text>
          <CustomDropdown
            label={t.selectPurpose}
            value={purpose}
            options={purposes}
            onSelect={setPurpose}
          />

          <Text style={styles.label}>{t.amount} (₹)</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder={t.enterAmount}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={[styles.button, { marginTop: 20 }]}
            onPress={handleDonate}
          >
            <Text style={styles.buttonText}>{t.proceedToPay}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Renovation Screen
function RenovationScreen({ setCurrentTab, goBack, language }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [configs, setConfigs] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/config`).then(res => res.ok ? res.json() : []),
      fetch(`${API_URL}/renovation-updates`).then(res => res.ok ? res.json() : [])
    ]).then(([configData, updateData]) => {
      setConfigs(Array.isArray(configData) ? configData : []);
      setUpdates(Array.isArray(updateData) ? updateData : []);
      setLoading(false);
    }).catch((e) => {
      console.log('Renovation fetch error:', e);
      setLoading(false);
    });
  }, []);

  const getConfigVal = (key: string, def: string) => {
    const c = configs.find(x => x.configKey === key);
    return c ? c.configValue : def;
  };

  const goalAmount = parseFloat(getConfigVal('renovation_goal', '30'));
  const currentAmount = parseFloat(getConfigVal('renovation_collected', '15.6'));
  const contributors = getConfigVal('renovation_contributors', '520');
  const progress = (currentAmount / goalAmount) * 100;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.premiumHeader}>
        <TouchableOpacity onPress={goBack}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.premiumHeaderTitle}>{t.renovation}</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {loading ? <ActivityIndicator size="large" color="#ff9800" /> : (
          <>
            <View style={[styles.card, { padding: 20 }]}>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#ff9800', textAlign: 'center', marginBottom: 20 }}>
                {t.renovationProgress}
              </Text>

              <View style={{ marginBottom: 30 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600' }}>{t.goalAmount}</Text>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ff9800' }}>₹{goalAmount} Crores</Text>
                </View>

                <View style={{ height: 25, backgroundColor: '#e0e0e0', borderRadius: 15, overflow: 'hidden' }}>
                  <View style={{ width: `${progress}%`, height: '100%', backgroundColor: '#4caf50', borderRadius: 15 }} />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                  <Text style={{ fontSize: 14, color: '#666' }}>Collected: ₹{currentAmount} Crores</Text>
                  <Text style={{ fontSize: 14, color: '#666' }}>{progress.toFixed(1)}%</Text>
                </View>
              </View>

              <View style={{ backgroundColor: '#fff3e0', padding: 15, borderRadius: 10, marginBottom: 20, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ff9800', marginBottom: 5 }}>
                  {t.contributors}
                </Text>
                <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#333' }}>
                  {contributors}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#4caf50', marginTop: 0 }]}
                onPress={() => setCurrentTab('eKanike')}
              >
                <Text style={styles.buttonText}>{t.donateNow}</Text>
              </TouchableOpacity>
            </View>

            {updates.map((upd, i) => (
              <View key={i} style={[styles.card, { marginTop: 20, padding: 20 }]}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1a237e', marginBottom: 10 }}>
                  {upd.title}
                </Text>
                <Text style={{ fontSize: 14, color: '#444', lineHeight: 22, textAlign: 'justify' }}>
                  {upd.description}
                </Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Videos Screen
function VideosScreen({ setCurrentTab, goBack, language }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_URL}/videos`)
      .then(res => res.json())
      .then(data => setVideos(data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.premiumHeader}>
        <TouchableOpacity onPress={goBack}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.premiumHeaderTitle}>{t.videoGallery}</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 15 }}>
        {loading ? <ActivityIndicator size="large" color="#ff9800" /> : (
          videos.map((v) => (
            <TouchableOpacity
              key={v.id}
              style={[styles.card, { padding: 0, overflow: 'hidden', marginBottom: 20 }]}
              onPress={() => setPlayingVideo(v)}
            >
              <View style={{ width: '100%', height: 200, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
                {v.thumbnailUrl ? (
                  <Image source={{ uri: v.thumbnailUrl }} style={{ width: '100%', height: '100%' }} />
                ) : (
                  <Text style={{ color: '#fff' }}>▶️ Video Preview</Text>
                )}
                <View style={{ position: 'absolute', backgroundColor: 'rgba(0,0,0,0.5)', padding: 15, borderRadius: 40 }}>
                  <Text style={{ fontSize: 30 }}>▶️</Text>
                </View>
              </View>
              <View style={{ padding: 15, backgroundColor: '#fff' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
                  {language === 'KA' ? (v.titleKa || v.title) : v.title}
                </Text>
                <Text style={{ fontSize: 12, color: '#666', marginTop: 5 }}>{v.category}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Video Player Modal */}
      <Modal visible={!!playingVideo} transparent={false} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
          <View style={{ height: 60, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ color: '#fff', fontWeight: 'bold', flex: 1 }} numberOfLines={1}>
              {playingVideo && (language === 'KA' ? (playingVideo.titleKa || playingVideo.title) : playingVideo.title)}
            </Text>
            <TouchableOpacity onPress={() => setPlayingVideo(null)} style={{ padding: 10 }}>
              <Text style={{ color: '#fff', fontSize: 20 }}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, justifyContent: 'center' }}>
            {playingVideo && getYoutubeId(playingVideo.videoUrl) ? (
              <YoutubePlayer
                height={Dimensions.get('window').width * 0.5625}
                videoId={getYoutubeId(playingVideo.videoUrl)!}
                play={true}
              />
            ) : playingVideo && (
              <WebView
                javaScriptEnabled={true}
                domStorageEnabled={true}
                source={{ uri: playingVideo.videoUrl }}
                originWhitelist={['*']}
                allowsInlineMediaPlayback={true}
                style={{ flex: 1 }}
              />
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// Newsletter Screen
function NewsletterScreen({ user, setCurrentTab, goBack, language }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [email, setEmail] = useState(user?.email || '');
  const [preferences, setPreferences] = useState({
    events: true,
    news: true,
    sevas: true
  });

  const handleSubscribe = () => {
    if (!email) {
      Alert.alert(t.error, 'Please enter your email address');
      return;
    }
    Alert.alert(t.success, 'Successfully subscribed to newsletter!', [
      { text: 'OK', onPress: goBack }
    ]);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.premiumHeader}>
        <TouchableOpacity onPress={goBack}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.premiumHeaderTitle}>{t.newsletter}</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.card}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
            {t.subscribeNewsletter}
          </Text>

          <Text style={styles.label}>{t.enterEmailAddress}</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder={t.enterEmailAddress}
            keyboardType="email-address"
          />

          <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>
            {t.preferences}
          </Text>

          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
            onPress={() => setPreferences({ ...preferences, events: !preferences.events })}
          >
            <Text style={{ fontSize: 20, marginRight: 10 }}>
              {preferences.events ? '☑' : '☐'}
            </Text>
            <Text style={{ fontSize: 14 }}>{t.eventsUpdates}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
            onPress={() => setPreferences({ ...preferences, news: !preferences.news })}
          >
            <Text style={{ fontSize: 20, marginRight: 10 }}>
              {preferences.news ? '☑' : '☐'}
            </Text>
            <Text style={{ fontSize: 14 }}>{t.newsUpdates}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
            onPress={() => setPreferences({ ...preferences, sevas: !preferences.sevas })}
          >
            <Text style={{ fontSize: 20, marginRight: 10 }}>
              {preferences.sevas ? '☑' : '☐'}
            </Text>
            <Text style={{ fontSize: 14 }}>{t.sevaUpdates}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubscribe}
          >
            <Text style={styles.buttonText}>{t.subscribe}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Goshaale (Cow Shelter) Screen
function GoshaaleScreen({ user, setCurrentTab, goBack, language }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [configs, setConfigs] = useState<any[]>([]);
  const [gosevas, setGosevas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/sevas`)
      .then(res => res.json())
      .then(data => {
        const cows = data.filter((s: any) => s.type === 'GOSHALA');
        setGosevas(cows);
      })
      .catch(() => { });

    fetch(`${API_URL}/config`)
      .then(res => res.json())
      .then(data => setConfigs(data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const getConfigVal = (key: string, def: string) => {
    const c = configs.find(x => x.configKey === key);
    return c ? c.configValue : def;
  };

  const totalCows = getConfigVal('goshala_total_cows', '45');
  const healthyCows = getConfigVal('goshala_healthy_cows', '43');

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.premiumHeader}>
        <TouchableOpacity onPress={goBack}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.premiumHeaderTitle}>{t.goshaale}</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <View style={[styles.card, { flex: 1, marginRight: 10, padding: 20, alignItems: 'center' }]}>
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#ff9800' }}>{totalCows}</Text>
            <Text style={{ fontSize: 14, color: '#666', marginTop: 5 }}>{t.totalCows}</Text>
          </View>
          <View style={[styles.card, { flex: 1, marginLeft: 10, padding: 20, alignItems: 'center' }]}>
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#4caf50' }}>{healthyCows}</Text>
            <Text style={{ fontSize: 14, color: '#666', marginTop: 5 }}>{t.healthyCows}</Text>
          </View>
        </View>

        <View style={[styles.card, { padding: 20, marginBottom: 20 }]}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
            {language === 'KA' ? 'ನಮ್ಮ ಗೋಶಾಲೆಯ ಬಗ್ಗೆ' : 'About Our Goshaale'}
          </Text>
          <Text style={{ fontSize: 14, color: '#444', lineHeight: 22, textAlign: 'justify' }}>
            {language === 'KA'
              ? 'ಸೋದೆ ಮಠದ ಗೋಶಾಲೆಯು ಹಿಂದೂ ಸಂಪ್ರದಾಯದಲ್ಲಿ ಪವಿತ್ರವೆಂದು ಪರಿಗಣಿಸಲಾದ ಗೋವುಗಳ ಆರೈಕೆ ಮತ್ತು ರಕ್ಷಣೆಗಾಗಿ ಸಮರ್ಪಿಸಲಾಗಿದೆ. ನಾವು ಕೈಬಿಟ್ಟ ಮತ್ತು ಗಾಯಗೊಂಡ ಹಸುಗಳಿಗೆ ಆಶ್ರಯ, ಪೌಷ್ಟಿಕ ಆಹಾರ ಮತ್ತು ವೈದ್ಯಕೀಯ ಆರೈಕೆಯನ್ನು ನೀಡುತ್ತೇವೆ.'
              : 'The Sode Matha Goshaale is dedicated to the care and protection of cows, which are considered sacred in Hindu tradition. We provide shelter, nutritious food, and medical care to abandoned and injured cows.'}
          </Text>
        </View>

        <View style={[styles.card, { padding: 20, marginBottom: 20 }]}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
            {t.keyFeatures}
          </Text>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 5 }}>
              🌾 {t.feedingSchedule}
            </Text>
            <Text style={{ fontSize: 12, color: '#666' }}>
              Morning: 6:00 AM | Afternoon: 12:00 PM | Evening: 6:00 PM
            </Text>
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 5 }}>
              🏥 {t.healthCare}
            </Text>
            <Text style={{ fontSize: 12, color: '#666' }}>
              Regular veterinary checkups and medical care
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 5 }}>
              🐄 {t.cowCare}
            </Text>
            <Text style={{ fontSize: 12, color: '#666' }}>
              Clean shelter, fresh water, and loving care
            </Text>
          </View>
        </View>

        <View style={[styles.card, { padding: 20 }]}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
            {language === 'KA' ? 'ನಮ್ಮ ಗೋಶಾಲೆಗೆ ಬೆಂಬಲ ನೀಡಿ' : 'Support Our Goshaale'}
          </Text>

          {loading ? (
            <ActivityIndicator color="#ff9800" />
          ) : (
            gosevas.length > 0 ? gosevas.map((seva: any) => (
              <TouchableOpacity
                key={seva.id}
                style={[styles.button, { backgroundColor: '#4caf50', marginBottom: 10 }]}
                onPress={() => setCurrentTab('eKanike')}
              >
                <Text style={styles.buttonText}>
                  💰 {language === 'KA' ? seva.nameKa || seva.name : seva.name} - ₹{seva.amount}
                </Text>
              </TouchableOpacity>
            )) : (
              <Text style={{ textAlign: 'center', color: '#888' }}>
                {language === 'KA' ? 'ಯಾವುದೇ ಸೇವೆಗಳು ಲಭ್ಯವಿಲ್ಲ' : 'No sevas available at the moment'}
              </Text>
            )
          )}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#ff9800', marginTop: 10 }]}
            onPress={() => Alert.alert(t.adoptACow, language === 'KA' ? 'ಗೋವು ದತ್ತು ವಿವರಗಳಿಗಾಗಿ ಮಠದ ಕಛೇರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ' : 'Contact matha office for cow adoption details')}
          >
            <Text style={styles.buttonText}>🐄 {t.adoptACow}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 50 }} />
        <Text style={styles.label}>Nakshatra: Rohini</Text>
        <Text style={styles.label}>Yoga: Siddha</Text>
        <Text style={styles.label}>Karna: Taitila</Text>
        <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={() => Alert.alert('Open App', 'Opening Tithinirnaya App...')}>
          <Text style={styles.buttonText}>{t.openApp}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Panchanga Screen
function PanchangaScreen({ goBack, language }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [panchangaData, setPanchangaData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPanchanga = async () => {
      try {
        const response = await fetch(`${API_URL}/panchanga`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPanchangaData(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPanchanga();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar style="light" />
        <View style={styles.premiumHeader}>
          <TouchableOpacity onPress={goBack}>
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.premiumHeaderTitle}>{t.panchanga}</Text>
          <View style={{ width: 30 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#ff9800" />
          <Text style={{ marginTop: 10, color: '#666' }}>{t.loadingPanchanga}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar style="light" />
        <View style={styles.premiumHeader}>
          <TouchableOpacity onPress={goBack}>
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.premiumHeaderTitle}>{t.panchanga}</Text>
          <View style={{ width: 30 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ color: 'red', textAlign: 'center' }}>{t.errorFetchingPanchanga}: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!panchangaData) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar style="light" />
        <View style={styles.premiumHeader}>
          <TouchableOpacity onPress={goBack}>
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.premiumHeaderTitle}>{t.panchanga}</Text>
          <View style={{ width: 30 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ color: '#666', textAlign: 'center' }}>{t.noPanchangaData}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderPanchangaDetail = (label: string, value: string) => (
    <View style={styles.panchangaDetailRow}>
      <Text style={styles.panchangaDetailLabel}>{label}:</Text>
      <Text style={styles.panchangaDetailValue}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.premiumHeader}>
        <TouchableOpacity onPress={goBack}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.premiumHeaderTitle}>{t.panchanga}</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.card}>
          <Text style={styles.panchangaDate}>{panchangaData.date}</Text>
          <Text style={styles.panchangaLocation}>{panchangaData.location}</Text>

          <View style={styles.panchangaSection}>
            <Text style={styles.panchangaSectionTitle}>{t.tithi}</Text>
            {renderPanchangaDetail(t.tithiName, panchangaData.tithi.name)}
            {renderPanchangaDetail(t.tithiEnds, panchangaData.tithi.ends)}
          </View>

          <View style={styles.panchangaSection}>
            <Text style={styles.panchangaSectionTitle}>{t.nakshatra}</Text>
            {renderPanchangaDetail(t.nakshatraName, panchangaData.nakshatra.name)}
            {renderPanchangaDetail(t.nakshatraEnds, panchangaData.nakshatra.ends)}
          </View>

          <View style={styles.panchangaSection}>
            <Text style={styles.panchangaSectionTitle}>{t.yoga}</Text>
            {renderPanchangaDetail(t.yogaName, panchangaData.yoga.name)}
            {renderPanchangaDetail(t.yogaEnds, panchangaData.yoga.ends)}
          </View>

          <View style={styles.panchangaSection}>
            <Text style={styles.panchangaSectionTitle}>{t.karana}</Text>
            {renderPanchangaDetail(t.karanaName, panchangaData.karana.name)}
            {renderPanchangaDetail(t.karanaEnds, panchangaData.karana.ends)}
          </View>

          <View style={styles.panchangaSection}>
            <Text style={styles.panchangaSectionTitle}>{t.rahuKala}</Text>
            {renderPanchangaDetail(t.startTime, panchangaData.rahuKala.start)}
            {renderPanchangaDetail(t.endTime, panchangaData.rahuKala.end)}
          </View>

          <View style={styles.panchangaSection}>
            <Text style={styles.panchangaSectionTitle}>{t.gulikaKala}</Text>
            {renderPanchangaDetail(t.startTime, panchangaData.gulikaKala.start)}
            {renderPanchangaDetail(t.endTime, panchangaData.gulikaKala.end)}
          </View>

          <View style={styles.panchangaSection}>
            <Text style={styles.panchangaSectionTitle}>{t.yamaGanda}</Text>
            {renderPanchangaDetail(t.startTime, panchangaData.yamaGanda.start)}
            {renderPanchangaDetail(t.endTime, panchangaData.yamaGanda.end)}
          </View>

          <View style={styles.panchangaSection}>
            <Text style={styles.panchangaSectionTitle}>{t.sunriseSunset}</Text>
            {renderPanchangaDetail(t.sunrise, panchangaData.sunrise)}
            {renderPanchangaDetail(t.sunset, panchangaData.sunset)}
          </View>

          {panchangaData.muhurthas && panchangaData.muhurthas.length > 0 && (
            <View style={styles.panchangaSection}>
              <Text style={styles.panchangaSectionTitle}>{t.muhurthas}</Text>
              {panchangaData.muhurthas.map((muhurtha: any, index: number) => (
                <Text key={index} style={styles.panchangaDetailValue}>• {muhurtha.name}: {muhurtha.time}</Text>
              ))}
            </View>
          )}

          {panchangaData.festivals && panchangaData.festivals.length > 0 && (
            <View style={styles.panchangaSection}>
              <Text style={styles.panchangaSectionTitle}>{t.festivals}</Text>
              {panchangaData.festivals.map((festival: string, index: number) => (
                <Text key={index} style={styles.panchangaDetailValue}>• {festival}</Text>
              ))}
            </View>
          )}
        </View>
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Room Booking Screen
// Room Booking Screen
// Room Booking Screen
function RoomBookingScreen({ user, setCurrentTab, goBack, language }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [formData, setFormData] = useState({
    devoteeName: user?.name || '', mobile: user?.mobileNumber || '', checkInDate: '', checkOutDate: '',
    numberOfRooms: '1', roomType: 'Non-AC',
    adults: '1', children: '0',
    aadhaar: '', idProof: '',
    purposeOfVisit: '',
    remarks: '',
    consent: true
  });
  const [loading, setLoading] = useState(false);
  const [dateField, setDateField] = useState<'checkIn' | 'checkOut' | null>(null);

  useEffect(() => {
    if (user?.mobileNumber) {
      fetch(`${API_URL}/users`)
        .then(res => res.json())
        .then(users => {
          const profile = users.find((u: any) => u.mobileNumber === user.mobileNumber);
          if (profile) {
            setFormData(prev => ({ ...prev, devoteeName: profile.name }));
          }
        })
        .catch(e => console.log('Error fetching profile:', e));
    }
  }, [user]);

  const handleUpload = () => {
    // Mock File Upload
    Alert.alert('Upload', 'Image Selected: id_proof.jpg');
    setFormData({ ...formData, idProof: 'https://example.com/mock-id-proof.jpg' });
  };

  const handleBooking = async () => {
    // Detailed validation for each field
    if (!formData.devoteeName || formData.devoteeName.trim() === '') {
      Alert.alert('Error', language === 'KA' ? 'ದಯವಿಟ್ಟು ಹೆಸರನ್ನು ನಮೂದಿಸಿ.' : 'Please enter devotee name.');
      return;
    }
    if (!formData.mobile || formData.mobile.trim() === '') {
      Alert.alert('Error', language === 'KA' ? 'ದಯವಿಟ್ಟು ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.' : 'Please enter mobile number.');
      return;
    }
    if (!formData.aadhaar || formData.aadhaar.trim() === '') {
      Alert.alert('Error', language === 'KA' ? 'ದಯವಿಟ್ಟು ಆಧಾರ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.' : 'Please enter Aadhaar number.');
      return;
    }
    if (formData.aadhaar.trim().length !== 12) {
      Alert.alert('Error', language === 'KA' ? 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ 12-ಅಂಕಿಯ ಆಧಾರ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.' : 'Please enter valid 12-digit Aadhaar number.');
      return;
    }
    if (!formData.numberOfRooms || formData.numberOfRooms.trim() === '') {
      Alert.alert('Error', language === 'KA' ? 'ದಯವಿಟ್ಟು ಕೊಠಡಿಗಳ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.' : 'Please enter number of rooms.');
      return;
    }
    if (!formData.checkInDate || formData.checkInDate.trim() === '') {
      Alert.alert('Error', language === 'KA' ? 'ದಯವಿಟ್ಟು ಚೆಕ್-ಇನ್ ದಿನಾಂಕವನ್ನು ಆಯ್ಕೆಮಾಡಿ.' : 'Please select check-in date.');
      return;
    }
    if (!formData.checkOutDate || formData.checkOutDate.trim() === '') {
      Alert.alert('Error', language === 'KA' ? 'ದಯವಿಟ್ಟು ಚೆಕ್-ಔಟ್ ದಿನಾಂಕವನ್ನು ಆಯ್ಕೆಮಾಡಿ.' : 'Please select check-out date.');
      return;
    }

    // Validate minimum 2 people
    const totalPeople = (parseInt(formData.adults) || 0) + (parseInt(formData.children) || 0);
    if (totalPeople < 2) {
      const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
      Alert.alert('Error', t.minPeopleError);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        devoteeName: formData.devoteeName,
        mobileNumber: formData.mobile,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        checkOutDate: formData.checkOutDate,
        roomType: 'Non-AC', // Enforce Non-AC
        numberOfRooms: parseInt(formData.numberOfRooms) || 1,
        adults: parseInt(formData.adults) || 1,
        children: parseInt(formData.children) || 0,
        aadhaar: formData.aadhaar,
        idProofUrl: formData.idProof || '',
        purposeOfVisit: formData.purposeOfVisit, // New field, backend might need update or just append to remarks
        consentDataStorage: true
      };

      const res = await fetch(`${API_URL}/rooms/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const resData = await res.json();
        const refNo = resData.bookingReference || `ROOM-${Math.floor(1000 + Math.random() * 9000)}`;
        Alert.alert(
          t.success,
          (language === 'KA' ? 'ವಸತಿ ವಿನಂತಿಯನ್ನು ಸಲ್ಲಿಸಲಾಗಿದೆ! ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ: ' : 'Room Request Submitted! Ref No: ') + refNo +
          (language === 'KA' ? '\nಒಂದು ಪ್ರತಿಯನ್ನು office@sodematha.in ಗೆ ಇಮೇಲ್ ಮಾಡಲಾಗಿದೆ.' : '\nAn email copy has been sent to office@sodematha.in')
        );
        goBack ? goBack() : setCurrentTab('home');
      }
      else {
        const errorData = await res.text();
        console.log('Booking error:', errorData);
        Alert.alert(t.error, language === 'KA' ? 'ಬುಕಿಂಗ್ ವಿಫಲವಾಗಿದೆ.' : 'Booking failed. Please try again.');
      }
    } catch (e) {
      console.log('Booking exception:', e);
      Alert.alert(t.error, language === 'KA' ? 'ನೆಟ್‌ವರ್ಕ್ ದೋಷ.' : 'Network error. Please check your connection.');
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      {/* Premium Header */}
      <View style={styles.premiumHeader}>
        <TouchableOpacity onPress={goBack ? goBack : () => setCurrentTab('home')}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.premiumHeaderTitle}>{t.roomBooking}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.premiumCard}>
          {/* Section 1: Devotee Details */}
          <View style={styles.formSectionHeader}>
            <Text style={styles.formSectionTitle}>1. {language === 'KA' ? 'ವೈಯಕ್ತಿಕ ವಿವರಗಳು' : 'Devotee Details'}</Text>
          </View>

          <View style={styles.formPadding}>
            <Text style={styles.formLabel}>{t.name} *</Text>
            <TextInput
              style={styles.premiumInput}
              placeholder={t.name}
              value={formData.devoteeName}
              onChangeText={val => setFormData({ ...formData, devoteeName: val })}
            />

            <View style={styles.inputRow}>
              <View style={styles.inputCol}>
                <Text style={styles.formLabel}>{t.phone} *</Text>
                <TextInput
                  style={styles.premiumInput}
                  placeholder="9945xxxxxx"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={formData.mobile}
                  onChangeText={val => setFormData({ ...formData, mobile: val })}
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={styles.formLabel}>{t.aadhaar} *</Text>
                <TextInput
                  style={styles.premiumInput}
                  placeholder="12-Digit Aadhaar"
                  keyboardType="numeric"
                  maxLength={12}
                  value={formData.aadhaar}
                  onChangeText={val => setFormData({ ...formData, aadhaar: val })}
                />
              </View>
            </View>
          </View>

          {/* Section 2: Booking Details */}
          <View style={styles.formSectionHeader}>
            <Text style={styles.formSectionTitle}>2. {language === 'KA' ? 'ಬುಕಿಂಗ್ ವಿವರಗಳು' : 'Booking Details'}</Text>
          </View>

          <View style={styles.formPadding}>
            <View style={styles.inputRow}>
              <View style={styles.inputCol}>
                <Text style={styles.formLabel}>{t.checkIn} *</Text>
                <TouchableOpacity onPress={() => setDateField('checkIn')} style={styles.premiumDropdown}>
                  <Text style={{ color: formData.checkInDate ? '#333' : '#888', fontSize: 13 }}>
                    {formData.checkInDate || 'YYYY-MM-DD'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputCol}>
                <Text style={styles.formLabel}>{t.checkOut} *</Text>
                <TouchableOpacity onPress={() => setDateField('checkOut')} style={styles.premiumDropdown}>
                  <Text style={{ color: formData.checkOutDate ? '#333' : '#888', fontSize: 13 }}>
                    {formData.checkOutDate || 'YYYY-MM-DD'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <ModalDatePicker
              visible={!!dateField}
              onClose={() => setDateField(null)}
              onSelect={(d: string) => {
                setFormData(prev => ({
                  ...prev,
                  checkInDate: dateField === 'checkIn' ? d : prev.checkInDate,
                  checkOutDate: dateField === 'checkOut' ? d : prev.checkOutDate
                }));
                setDateField(null);
              }}
              language={language}
            />

            <View style={styles.inputRow}>
              <View style={styles.inputCol}>
                <Text style={styles.formLabel}>{t.roomType}</Text>
                <View style={[styles.premiumInput, { backgroundColor: '#e0e0e0' }]}>
                  <Text style={{ color: '#555' }}>Non-AC (Standard)</Text>
                </View>
                <Text style={{ fontSize: 10, color: '#d84315', marginTop: 2 }}>* {language === 'KA' ? 'ಎಸಿ ಕೊಠಡಿಗಳು ಲಭ್ಯವಿಲ್ಲ' : 'AC Rooms not available'}</Text>
              </View>
              <View style={styles.inputCol}>
                <Text style={styles.formLabel}>{language === 'KA' ? 'ಕೊಠಡಿಗಳ ಸಂಖ್ಯೆ' : 'No. of Rooms'}</Text>
                <TextInput
                  style={styles.premiumInput}
                  keyboardType="numeric"
                  value={formData.numberOfRooms}
                  onChangeText={val => setFormData({ ...formData, numberOfRooms: val })}
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputCol}>
                <Text style={styles.formLabel}>{t.adults}</Text>
                <TextInput
                  style={styles.premiumInput}
                  keyboardType="numeric"
                  value={formData.adults}
                  onChangeText={val => setFormData({ ...formData, adults: val })}
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={styles.formLabel}>{t.children}</Text>
                <TextInput
                  style={styles.premiumInput}
                  keyboardType="numeric"
                  value={formData.children}
                  onChangeText={val => setFormData({ ...formData, children: val })}
                />
              </View>
            </View>

            <View style={styles.divider} />

            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
              onPress={() => setFormData({ ...formData, consent: !formData.consent })}
            >
              <View style={{ width: 20, height: 20, borderWidth: 2, borderColor: '#1a237e', borderRadius: 4, marginRight: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: formData.consent ? '#1a237e' : 'transparent' }}>
                {formData.consent && <Text style={{ color: '#fff', fontSize: 12 }}>✓</Text>}
              </View>
              <Text style={{ fontSize: 12, color: '#333', flex: 1 }}>{t.consent}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.premiumSubmitBtn, { marginTop: 30 }]}
              onPress={handleBooking}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>{t.submitRequest}</Text>}
            </TouchableOpacity>

            <Text style={{ textAlign: 'center', fontSize: 10, color: '#666', marginTop: 15 }}>
              {language === 'KA' ? 'ವಿನಂತಿಯನ್ನು ಪರಿಶೀಲಿಸಿದ ನಂತರ ನಾವು ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತೇವೆ.' : 'Note: This is a request form. Final confirmation is subject to availability.'}
            </Text>
          </View>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
// My Bookings Screen
function MyBookingsScreen({ user, setCurrentTab, goBack, language }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [roomRequests, setRoomRequests] = useState<any[]>([]);
  const [sevaBookings, setSevaBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.mobileNumber) {
      Promise.all([
        fetch(`${API_URL}/rooms/user/${user.mobileNumber}`).then(res => res.json()),
        fetch(`${API_URL}/seva-bookings/user/${user.mobileNumber}`).then(res => res.json())
      ]).then(([rooms, sevas]) => {
        setRoomRequests(Array.isArray(rooms) ? rooms : []);
        setSevaBookings(Array.isArray(sevas) ? sevas : []);
        setLoading(false);
      }).catch(e => {
        console.log('Error fetching my bookings:', e);
        setLoading(false);
      });
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
      case 'CONFIRMED': return '#2e7d32';
      case 'REJECTED': return '#c62828';
      default: return '#ef6c00';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
      case 'CONFIRMED': return t.confirmed;
      case 'REJECTED': return t.rejected;
      default: return t.pending;
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.premiumHeader}>
        <TouchableOpacity onPress={goBack ? goBack : () => setCurrentTab('more')}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.premiumHeaderTitle}>{t.myBookings}</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#1a237e" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 15 }}>
          {/* Seva Bookings */}
          <Text style={[styles.sectionTitle, { marginBottom: 15 }]}>{t.sevaBookings}</Text>
          {sevaBookings.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#666', marginBottom: 20 }}>{t.noBookings}</Text>
          ) : (
            sevaBookings.map((sb, i) => (
              <View key={i} style={[styles.card, { marginBottom: 15, padding: 15 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{sb.seva?.name}</Text>
                  <View style={{ backgroundColor: getStatusColor(sb.status) + '20', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                    <Text style={{ color: getStatusColor(sb.status), fontSize: 12, fontWeight: 'bold' }}>
                      {getStatusLabel(sb.status)}
                    </Text>
                  </View>
                </View>
                <Text style={{ color: '#666', marginTop: 5 }}>{t.date}: {sb.bookingDate}</Text>
                <Text style={{ color: '#666' }}>{t.gotra}: {sb.sankalpaDetails}</Text>
              </View>
            ))
          )}

          {/* Room Requests */}
          <Text style={[styles.sectionTitle, { marginBottom: 15, marginTop: 10 }]}>{t.roomBookings}</Text>
          {roomRequests.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#666' }}>{t.noBookings}</Text>
          ) : (
            roomRequests.map((rr, i) => (
              <View key={i} style={[styles.card, { marginBottom: 15, padding: 15 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{rr.numberOfRooms}x {rr.roomType}</Text>
                  <View style={{ backgroundColor: getStatusColor(rr.status) + '20', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                    <Text style={{ color: getStatusColor(rr.status), fontSize: 12, fontWeight: 'bold' }}>
                      {getStatusLabel(rr.status)}
                    </Text>
                  </View>
                </View>
                <Text style={{ color: '#666', marginTop: 5 }}>{t.checkIn}: {rr.checkInDate}</Text>
                <Text style={{ color: '#666' }}>{t.checkOut}: {rr.checkOutDate}</Text>
                <Text style={{ color: '#666' }}>{rr.adults} {t.adults}, {rr.children} {t.children}</Text>
              </View>
            ))
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// Custom Date Picker Component
// Custom Date Picker Component
function ModalDatePicker({ visible, onClose, onSelect, language }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS['EN'];
  const today = new Date();
  const dates = Array.from({ length: 90 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const MONTHS_KA = ['ಜನವರಿ', 'ಫೆಬ್ರವರಿ', 'ಮಾರ್ಚ್', 'ಏಪ್ರಿಲ್', 'ಮೇ', 'ಜೂನ್', 'ಜುಲೈ', 'ಆಗಸ್ಟ್', 'ಸೆಪ್ಟೆಂಬರ್', 'ಅಕ್ಟೋಬರ್', 'ನವೆಂಬರ್', 'ಡಿಸೆಂಬರ್'];
  const getMonthName = (date: string) => {
    const d = new Date(date);
    if (language === 'KA') return MONTHS_KA[d.getMonth()];
    return d.toLocaleDateString('en-US', { month: 'short' });
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View style={{ backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' }}>{t.selectDate}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
            {dates.map(date => (
              <TouchableOpacity key={date} onPress={() => { onSelect(date); onClose(); }} style={{
                padding: 15, marginHorizontal: 5, backgroundColor: '#f0f0f0', borderRadius: 10, alignItems: 'center'
              }}>
                <Text style={{ fontWeight: 'bold' }}>{new Date(date).getDate()}</Text>
                <Text style={{ fontSize: 12 }}>{getMonthName(date)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={onClose} style={[styles.button, { backgroundColor: '#ccc', marginTop: 0 }]}>
            <Text style={styles.buttonText}>{t.cancel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Gallery Screen
function GalleryScreen({ setCurrentTab, goBack, language }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch(`${API_URL}/gallery`);
      if (res.ok) {
        const data = await res.json();
        setGallery(Array.isArray(data) && data.length > 0 ? data : FALLBACK_GALLERY_DATA);
      } else {
        setGallery(FALLBACK_GALLERY_DATA as any);
      }
    } catch (e) {
      console.log('Gallery fetch error:', e);
      Alert.alert('Error', 'Could not connect to server for gallery');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.rowHeader}>
        <TouchableOpacity onPress={goBack ? goBack : () => setCurrentTab('home')}>
          <Text style={styles.loadButton}>← {t.back}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.gallery}</Text>
      </View>

      {loading ? <ActivityIndicator color="#ff9800" /> : (
        <ScrollView contentContainerStyle={styles.galleryGrid}>
          {gallery.map((item: any) => (
            <TouchableOpacity key={item.id} style={styles.galleryItem} onPress={() => setSelectedImage(item)}>
              <Image source={{ uri: item.imageUrl }} style={styles.galleryImage} />
              <Text style={styles.galleryTitle} numberOfLines={1}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <Modal visible={!!selectedImage} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalClose} onPress={() => setSelectedImage(null)}>
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>
          {selectedImage && (
            <View style={styles.modalContent}>
              <Image source={{ uri: selectedImage.imageUrl }} style={styles.fullImage} resizeMode="contain" />
              <Text style={styles.fullTitle}>{selectedImage.title}</Text>
              <Text style={styles.fullDesc}>{selectedImage.category}</Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

// History & Parampara Screen
// History & Parampara Screen
// ENHANCED HISTORY & PARAMPARA Data
// Literary Works Screen
function LiteraryWorksScreen({ setCurrentTab, goBack, language }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [works, setWorks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/literary-works`)
      .then(res => res.json())
      .then(data => { setWorks(data); setLoading(false); })
      .catch(e => { console.log(e); setLoading(false); });
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.premiumHeader}>
        <TouchableOpacity onPress={goBack}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.premiumHeaderTitle}>{language === 'KA' ? 'ಸಾಹಿತ್ಯ ಕೃತಿಗಳು' : 'Literary Works'}</Text>
        <View style={{ width: 30 }} />
      </View>
      {loading ? <ActivityIndicator size="large" color="#ff9800" style={{ marginTop: 20 }} /> : (
        <ScrollView contentContainerStyle={{ padding: 15 }}>
          {works.map((w, i) => (
            <View key={i} style={[styles.card, { padding: 15, marginBottom: 15 }]}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#3e2723' }}>{language === 'KA' ? w.titleKa : w.title}</Text>
              <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 10 }}>
                <View style={{ backgroundColor: '#efebe9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                  <Text style={{ fontSize: 10, color: '#5d4037', fontWeight: 'bold' }}>{w.category}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 14, color: '#555', lineHeight: 20 }}>{w.description}</Text>
              {w.url && w.url.length > 0 && (
                <TouchableOpacity onPress={() => Linking.openURL(w.url)} style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: '#1976d2', fontWeight: 'bold' }}>View Resource →</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// Miracles Screen
function MiraclesScreen({ setCurrentTab, goBack, language }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [miracles, setMiracles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/miracles`)
      .then(res => res.json())
      .then(data => { setMiracles(data); setLoading(false); })
      .catch(e => { console.log(e); setLoading(false); });
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.premiumHeader}>
        <TouchableOpacity onPress={goBack}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.premiumHeaderTitle}>{language === 'KA' ? 'ಪವಾಡಗಳು' : 'Miracles'}</Text>
        <View style={{ width: 30 }} />
      </View>
      {loading ? <ActivityIndicator size="large" color="#ff9800" style={{ marginTop: 20 }} /> : (
        <ScrollView contentContainerStyle={{ padding: 15 }}>
          {miracles.map((m, i) => (
            <View key={i} style={[styles.card, { padding: 15, marginBottom: 15 }]}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#ff9800', marginBottom: 10 }}>{language === 'KA' ? m.titleKa : m.title}</Text>
              <Text style={{ fontSize: 14, lineHeight: 22, color: '#444', textAlign: 'justify' }}>{language === 'KA' ? m.descriptionKa : m.descriptionEn}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// History Screen Refactored
function HistoryScreen({ setCurrentTab, goBack, language }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [activeTab, setActiveTab] = useState('history'); // history | parampara | bhootaraja
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [paramparaData, setParamparaData] = useState<any[]>([]);
  const [bhootarajaData, setBhootarajaData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuru, setSelectedGuru] = useState<any>(null);

  useEffect(() => {
    setSelectedGuru(null);
  }, [activeTab]);

  useEffect(() => {
    const fetchAll = async () => {

      try {
        const [hRes, pRes, bRes] = await Promise.all([
          fetch(`${API_URL}/history`),
          fetch(`${API_URL}/parampara`),
          fetch(`${API_URL}/bhootarajaru`)
        ]);
        const hData = await hRes.json().catch(() => []);
        const pData = await pRes.json().catch(() => []);
        const bData = await bRes.json().catch(() => []);

        setHistoryData(Array.isArray(hData) && hData.length > 0 ? hData : FALLBACK_HISTORY_DATA);
        setParamparaData(Array.isArray(pData) && pData.length > 0 ? pData.sort((a: any, b: any) => a.id - b.id) : FALLBACK_PARAMPARA_DATA);
        setBhootarajaData(Array.isArray(bData) && bData.length > 0 ? bData : FALLBACK_BHOOTARAJA_DATA);
      } catch (e) { console.log(e); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.premiumHeader}>
        <TouchableOpacity onPress={goBack ? goBack : () => setCurrentTab('home')}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.premiumHeaderTitle}>{t.histParam}</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => setActiveTab('history')} style={[styles.tabButton, activeTab === 'history' && { borderBottomWidth: 2, borderBottomColor: '#ff9800' }]}>
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>{t.tabHistory}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('parampara')} style={[styles.tabButton, activeTab === 'parampara' && { borderBottomWidth: 2, borderBottomColor: '#ff9800' }]}>
          <Text style={[styles.tabText, activeTab === 'parampara' && styles.tabTextActive]}>{t.tabParampara}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('bhootaraja')} style={[styles.tabButton, activeTab === 'bhootaraja' && { borderBottomWidth: 2, borderBottomColor: '#ff9800' }]}>
          <Text style={[styles.tabText, activeTab === 'bhootaraja' && styles.tabTextActive]}>{t.tabBhootaraja}</Text>
        </TouchableOpacity>
      </View>

      {loading ? <ActivityIndicator size="large" color="#ff9800" style={{ marginTop: 20 }} /> : (
        <ScrollView contentContainerStyle={{ padding: 15 }}>
          {activeTab === 'history' ? (
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                <TouchableOpacity style={[styles.card, { flex: 1, padding: 20, backgroundColor: '#fff3e0', alignItems: 'center', marginRight: 5 }]} onPress={() => setCurrentTab('literaryWorks')}>
                  <Text style={{ fontSize: 24, marginBottom: 5 }}>📚</Text>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#d84315', textAlign: 'center' }}>{language === 'KA' ? 'ಸಾಹಿತ್ಯ ಕೃತಿಗಳು' : 'Literary Works'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.card, { flex: 1, padding: 20, backgroundColor: '#e0f7fa', alignItems: 'center', marginLeft: 5 }]} onPress={() => setCurrentTab('miracles')}>
                  <Text style={{ fontSize: 24, marginBottom: 5 }}>✨</Text>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#006064', textAlign: 'center' }}>{language === 'KA' ? 'ಪವಾಡಗಳು' : 'Miracles'}</Text>
                </TouchableOpacity>
              </View>

              {historyData.map((h, i) => (
                <View key={i} style={[styles.card, { padding: 15, marginBottom: 15 }]}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' }}>
                    {language === 'KA' ? (h.titleKa || t.historyTitle) : (h.title || t.historyTitle)}
                  </Text>
                  <Text style={{ fontSize: 15, lineHeight: 24, color: '#555', textAlign: 'justify' }}>
                    {language === 'KA' ? (h.contentKa || h.content) : (h.contentEn || h.content)}
                  </Text>
                </View>
              ))}
            </View>
          ) : activeTab === 'parampara' ? (
            <View>
              {selectedGuru ? (
                <View style={[styles.card, { padding: 20 }]}>
                  <TouchableOpacity onPress={() => setSelectedGuru(null)} style={{ marginBottom: 15 }}>
                    <Text style={{ color: '#1a237e', fontWeight: 'bold' }}>← {t.back}</Text>
                  </TouchableOpacity>
                  {selectedGuru.photoUrl && <Image source={{ uri: selectedGuru.photoUrl }} style={{ width: '100%', height: 250, borderRadius: 10, marginBottom: 15 }} resizeMode="cover" />}
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1a237e', marginBottom: 5, textAlign: 'center' }}>
                    {(language === 'KA' && selectedGuru.nameKa) ? selectedGuru.nameKa : selectedGuru.name}
                  </Text>
                  {selectedGuru.period && <Text style={{ fontSize: 16, color: '#ff9800', fontWeight: 'bold', marginBottom: 15 }}>{selectedGuru.period}</Text>}

                  <View style={{ backgroundColor: '#f5f5f5', padding: 15, borderRadius: 8, marginBottom: 15 }}>
                    <TouchableOpacity
                      onPress={() => {
                        const prev = paramparaData.find(p => p.name === selectedGuru.guru || p.nameKa === selectedGuru.guru);
                        if (prev) setSelectedGuru(prev);
                      }}
                      style={{ paddingVertical: 5 }}
                    >
                      <Text style={{ fontSize: 14, color: '#666' }}>{t.guru}: <Text style={{ color: '#1a237e', fontWeight: 'bold', textDecorationLine: 'underline' }}>{selectedGuru.guru || '-'}</Text></Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        const next = paramparaData.find(p => p.name === selectedGuru.shishya || p.nameKa === selectedGuru.shishya);
                        if (next) setSelectedGuru(next);
                      }}
                      style={{ paddingVertical: 5 }}
                    >
                      <Text style={{ fontSize: 14, color: '#666', marginTop: 5 }}>{t.shishya}: <Text style={{ color: '#1a237e', fontWeight: 'bold', textDecorationLine: 'underline' }}>{selectedGuru.shishya || '-'}</Text></Text>
                    </TouchableOpacity>

                    <Text style={{ fontSize: 14, color: '#666', marginTop: 5 }}>{t.vrindavanaLocation}: <Text style={{ color: '#333', fontWeight: 'bold' }}>{selectedGuru.vrindavanaLocation || '-'}</Text></Text>
                  </View>

                  <Text style={{ fontSize: 16, lineHeight: 24, color: '#444', textAlign: 'justify' }}>
                    {language === 'KA' ? (selectedGuru.descriptionKa || selectedGuru.descriptionEn) : (selectedGuru.descriptionEn || selectedGuru.descriptionKa)}
                  </Text>

                  {selectedGuru.vrindavanaUrl && (
                    <TouchableOpacity
                      style={[styles.button, { marginTop: 20, backgroundColor: '#1a237e' }]}
                      onPress={() => Linking.openURL(selectedGuru.vrindavanaUrl)}
                    >
                      <Text style={styles.buttonText}>📍 {language === 'KA' ? 'ನಕ್ಷೆಯಲ್ಲಿ ವೃಂದಾವನ ವೀಕ್ಷಿಸಿ' : 'View Vrindavana on Maps'}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View>
                  {paramparaData.map((p, i) => (
                    <TouchableOpacity
                      key={p.id}
                      onPress={() => setSelectedGuru(p)}
                      style={[styles.card, {
                        padding: 15,
                        marginBottom: 15,
                        borderLeftWidth: (p.isCurrent || p.isHighlight) ? 6 : 0,
                        borderLeftColor: p.isCurrent ? '#4caf50' : '#ff9800',
                        flexDirection: 'row',
                        alignItems: 'center'
                      }]}
                    >
                      <View style={{
                        width: 60, height: 60, borderRadius: 30,
                        backgroundColor: (p.isCurrent || p.isHighlight) ? '#fff3e0' : '#f5f5f5',
                        justifyContent: 'center', alignItems: 'center', marginRight: 15,
                        borderWidth: 1, borderColor: '#eee'
                      }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, color: (p.isCurrent || p.isHighlight) ? '#ff9800' : '#999' }}>{p.id}</Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#1a237e', marginBottom: 4 }}>
                          {(language === 'KA' && p.nameKa) ? p.nameKa : p.name}
                        </Text>
                        {p.period && <Text style={{ fontSize: 12, color: '#666' }}>{p.period}</Text>}
                        {p.isCurrent && (
                          <View style={{ alignSelf: 'flex-start', backgroundColor: '#e8f5e9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginTop: 4 }}>
                            <Text style={{ fontSize: 10, fontWeight: 'bold', color: 'green' }}>CURRENT PEETADHIPATHI</Text>
                          </View>
                        )}
                      </View>

                      <Text style={{ color: '#bdbdbd', fontSize: 20 }}>›</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <View>
              {bhootarajaData.map((b, i) => (
                <View key={i} style={[styles.card, { padding: 15, marginBottom: 15 }]}>
                  {b.imageUrl && <Image source={{ uri: b.imageUrl }} style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 10 }} resizeMode="cover" />}
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>{b.name}</Text>
                  <Text style={{ fontSize: 14, lineHeight: 22, color: '#555' }}>
                    {language === 'KA' ? (b.descriptionKa || b.descriptionEn) : (b.descriptionEn || b.descriptionKa)}
                  </Text>
                </View>
              ))}
            </View>
          )}
          <View style={{ height: 50 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function DailyWorshipScreen({ setCurrentTab, goBack, language }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [deities, setDeities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/daily-worship`)
      .then(res => res.json())
      .then(data => setDeities(data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.premiumHeader}>
        <TouchableOpacity onPress={goBack}>
          <Text style={{ color: '#fff', fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.premiumHeaderTitle}>{t.worshipDeities}</Text>
        <View style={{ width: 30 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 15 }}>
        {loading ? <ActivityIndicator size="large" color="#ff9800" /> : (
          deities.map((d, i) => (
            <View key={i} style={[styles.card, { padding: 0, overflow: 'hidden', marginBottom: 20 }]}>
              {d.imageUrl && <Image source={{ uri: d.imageUrl }} style={{ width: '100%', height: 250 }} resizeMode="cover" />}
              <View style={{ padding: 15 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1a237e', marginBottom: 10 }}>
                  {language === 'KA' ? d.deityNameKa : d.deityName}
                </Text>
                <Text style={{ fontSize: 14, lineHeight: 22, color: '#444' }}>
                  {language === 'KA' ? d.descriptionKa : d.descriptionEn}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function DailyVisitScreen({ user, goBack, language }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [name, setName] = useState(user?.name || '');
  const [mobile, setMobile] = useState(user?.mobileNumber || '');
  const [place, setPlace] = useState('');
  const [people, setPeople] = useState('1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_URL}/visits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          devoteeName: name,
          mobileNumber: mobile,
          place,
          numberOfPeople: parseInt(people),
          visitDate: date
        })
      });
      if (res.ok) {
        Alert.alert(t.success, t.visitSuccess, [{ text: 'OK', onPress: goBack }]);
      }
    } catch (e) { }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.premiumHeader}>
        <TouchableOpacity onPress={goBack}>
          <Text style={{ color: '#fff', fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.premiumHeaderTitle}>{t.devoteeVisit}</Text>
        <View style={{ width: 30 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.card}>
          <Text style={styles.label}>{t.yourName}</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
          <Text style={styles.label}>{t.mobileNumber}</Text>
          <TextInput style={styles.input} value={mobile} onChangeText={setMobile} keyboardType="numeric" />
          <Text style={styles.label}>{t.placeFrom}</Text>
          <TextInput style={styles.input} value={place} onChangeText={setPlace} />
          <Text style={styles.label}>{t.numberOfPeople}</Text>
          <TextInput style={styles.input} value={people} onChangeText={setPeople} keyboardType="numeric" />
          <Text style={styles.label}>{t.visitDate}</Text>
          <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />

          <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{t.submit}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function WorshipCarousel({ setCurrentTab, language }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  return (
    <View style={{ marginVertical: 20 }}>
      <Text style={styles.sectionTitle}>{t.dailyWorship}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 15 }}>
        {['bhuvaraha', 'hayagriva', 'narasimha'].map(deity => (
          <TouchableOpacity key={deity} style={{ width: 150, marginRight: 15 }} onPress={() => setCurrentTab('dailyWorship')}>
            <View style={{ height: 150, backgroundColor: '#eee', borderRadius: 75, overflow: 'hidden', borderWidth: 2, borderColor: '#ff9800' }}>
              <Image source={{ uri: `https://www.sodematha.in/images/${deity}.jpg` }} style={{ width: '100%', height: '100%' }} />
            </View>
            <Text style={{ textAlign: 'center', marginTop: 10, fontWeight: 'bold', color: '#1a237e' }}>
              {language === 'KA' ? (deity === 'bhuvaraha' ? 'ಭೂವರಾಹ' : deity === 'hayagriva' ? 'ಹಯಗ್ರೀವ' : 'ನರಸಿಂಹ') : deity.charAt(0).toUpperCase() + deity.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function PoojaTimingsScreen({ language, goBack }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [timings, setTimings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/pooja-timings?lang=${language}`)
      .then(res => res.json())
      .then(data => setTimings(data))
      .catch(e => console.log(e))
      .finally(() => setLoading(false));
  }, [language]);

  // Group by Temple Name
  const groupedByTemple = timings.reduce((acc: any, curr: any) => {
    const name = curr.templeName;
    if (!acc[name]) acc[name] = [];
    acc[name].push(curr);
    return acc;
  }, {});

  const templeNames = Object.keys(groupedByTemple);

  // Custom sort to put "Special" poojas at the top if needed, or keeping standard order
  // For now, let's just render.

  const getSlotIcon = (slot: string) => {
    switch (slot?.toUpperCase()) {
      case 'MORNING': return '🌅';
      case 'AFTERNOON': return '☀️'; // Sun icon for afternoon
      case 'NIGHT': return '🌙';
      case 'EVENING': return '🌆';
      default: return '🕰️';
    }
  };

  const isSpecialPooja = (name: string) => {
    const lower = name.toLowerCase();
    return lower.includes('vishesha') || lower.includes('bhootaraja') || lower.includes('botaraja');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.premiumHeader}>
        <TouchableOpacity onPress={goBack}>
          <Text style={{ color: '#fff', fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.premiumHeaderTitle}>{t.poojaTimings}</Text>
        <View style={{ width: 30 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 15 }} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#ff9800" style={{ marginTop: 50 }} />
        ) : (
          <>
            {templeNames.map((templeName, index) => {
              const templeTimings = groupedByTemple[templeName];
              const isSpecial = isSpecialPooja(templeName);

              return (
                <View
                  key={index}
                  style={[
                    styles.card,
                    isSpecial ? {
                      borderColor: '#FFD700',
                      borderWidth: 2,
                      backgroundColor: '#FFFAE6',
                      elevation: 8,
                      shadowColor: '#FFD700',
                      shadowOpacity: 0.5
                    } : { borderLeftWidth: 5, borderLeftColor: '#ff9800' }
                  ]}
                >
                  {isSpecial && (
                    <View style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#FFD700', paddingHorizontal: 10, paddingVertical: 4, borderBottomLeftRadius: 10 }}>
                      <Text style={{ fontWeight: 'bold', color: '#5d4037', fontSize: 10 }}>⭐ SPECIAL</Text>
                    </View>
                  )}

                  <Text style={[styles.templeTitle, isSpecial && { color: '#BF360C', fontSize: 20 }]}>
                    {isSpecial ? '✨ ' : ''}{templeName}
                  </Text>

                  {/* Render Timings grouping by slot locally or just listing them efficiently */}
                  {templeTimings.map((tm: any, i: number) => (
                    <View key={i} style={styles.timingRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', width: '35%' }}>
                        <Text style={{ fontSize: 16, marginRight: 5 }}>{getSlotIcon(tm.slot)}</Text>
                        <Text style={[styles.timingLabel, { fontSize: 13 }]}>{tm.slot || 'TIMING'}</Text>
                      </View>
                      <Text style={[styles.timingValue, isSpecial && { fontWeight: '900', color: '#E65100' }]}>
                        {tm.timing}
                      </Text>
                    </View>
                  ))}
                </View>
              );
            })}

            {/* Anna Prasada (Simulated/Static if not in DB) */}
            {!templeNames.some(t => t.toLowerCase().includes('prasada')) && (
              <View style={[styles.card, { borderLeftWidth: 5, borderLeftColor: '#4CAF50' }]}>
                <Text style={styles.templeTitle}>🍲 {t.annaPrasadaTimings}</Text>
                <View style={styles.timingRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', width: '35%' }}>
                    <Text style={{ fontSize: 16, marginRight: 5 }}>🌅</Text>
                    <Text style={styles.timingLabel}>{t.morning}</Text>
                  </View>
                  <Text style={styles.timingValue}>11:30 AM TO 1:30 PM</Text>
                </View>
                <View style={styles.timingRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', width: '35%' }}>
                    <Text style={{ fontSize: 16, marginRight: 5 }}>🌙</Text>
                    <Text style={styles.timingLabel}>{t.night}</Text>
                  </View>
                  <Text style={styles.timingValue}>7:30 PM TO 9:00 PM</Text>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function DarshanaTimingsCard({ language }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  return (
    <View style={styles.premiumCard}>
      <View style={{ padding: 12, backgroundColor: '#1a237e' }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>{t.darshanaTimings}</Text>
      </View>
      <View style={{ padding: 15 }}>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontWeight: 'bold', color: '#1a237e', fontSize: 15 }}>Sri RamaTrivikrama Temple</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <Text style={{ fontSize: 18, marginRight: 8 }}>🌅</Text>
            <Text style={{ color: '#555', fontSize: 13 }}>5:30 AM - 1:30 PM</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Text style={{ fontSize: 18, marginRight: 8 }}>🌙</Text>
            <Text style={{ color: '#555', fontSize: 13 }}>7:30 PM - 8:30 PM</Text>
          </View>
        </View>
        <View style={{ height: 1, backgroundColor: '#eee', marginVertical: 8 }} />
        <View>
          <Text style={{ fontWeight: 'bold', color: '#1a237e', fontSize: 15 }}>Sri Vadirajaru Sannidhi</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <Text style={{ fontSize: 18, marginRight: 8 }}>🌅</Text>
            <Text style={{ color: '#555', fontSize: 13 }}>6:30 AM - 12:30 PM</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Text style={{ fontSize: 18, marginRight: 8 }}>🌙</Text>
            <Text style={{ color: '#555', fontSize: 13 }}>6:30 PM - 8:30 PM</Text>
          </View>
        </View>
      </View>
      <View style={{ padding: 10, backgroundColor: '#fdf3e7', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f0e0d0' }}>
        <Text style={{ fontSize: 12, color: '#e65100', fontWeight: '600' }}>
          🍲 {t.annaPrasadaTimings}: 11:30 AM | 7:30 PM
        </Text>
      </View>
    </View>
  );
}

// Branch Dictionary Screen
function BranchScreen({ setCurrentTab, goBack, language }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [searchQuery, setSearchQuery] = useState('');
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/branches`)
      .then(res => res.json())
      .then(data => {
        setBranches(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
        setLoading(false);
        // Fallback static data if backend is empty
        setBranches([
          { id: 1, name: 'Sode Moola Matha', location: 'Sode, Sirsi, Karnataka', contact: '08384-230000' },
          { id: 2, name: 'Udupi Matha', location: 'Car Street, Udupi', contact: '0820-252000' }
        ]);
      });
  }, []);

  const filteredBranches = branches.filter(b =>
    (b.name && b.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (b.location && b.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <View style={styles.premiumHeader}>
        <TouchableOpacity onPress={goBack}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.premiumHeaderTitle}>{t.branchDict}</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={{ padding: 15 }}>
        <TextInput
          style={[styles.input, { borderRadius: 25, paddingHorizontal: 20, backgroundColor: '#fff', elevation: 2 }]}
          placeholder={language === 'KA' ? 'ಶಾಖೆಯನ್ನು ಹುಡುಕಿ...' : "Search branches..."}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? <ActivityIndicator size="large" color="#ff9800" /> : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 30 }}>
          {filteredBranches.length > 0 ? filteredBranches.map((b) => (
            <View key={b.id} style={[styles.card, { padding: 15, marginBottom: 15 }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1a237e' }}>{language === 'KA' ? b.nameKa || b.name : b.name}</Text>
                  <Text style={{ fontSize: 14, color: '#666', marginTop: 5 }}>📍 {language === 'KA' ? b.locationKa || b.location : b.location}</Text>
                  {b.contact && <Text style={{ fontSize: 14, color: '#666', marginTop: 3 }}>📞 {b.contact}</Text>}
                </View>
                <TouchableOpacity
                  style={{ backgroundColor: '#1a237e', padding: 10, borderRadius: 10 }}
                  onPress={() => {
                    const query = encodeURIComponent(b.name + ' ' + (b.location || ''));
                    const url = Platform.select({
                      ios: `maps:0,0?q=${query}`,
                      android: `geo:0,0?q=${query}`
                    });
                    if (url) Linking.openURL(url);
                  }}
                >
                  <Text style={{ color: '#fff' }}>🧭</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.divider, { marginVertical: 10 }]} />

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity onPress={() => b.contact && Linking.openURL(`tel:${b.contact}`)}>
                  <Text style={{ color: '#1a237e', fontWeight: 'bold' }}>{language === 'KA' ? 'ಕರೆ ಮಾಡಿ' : 'Call Now'} ›</Text>
                </TouchableOpacity>
              </View>
            </View>
          )) : (
            <Text style={{ textAlign: 'center', color: '#999', marginTop: 20 }}>No branches found.</Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}


function InstitutionsScreen({ goBack, language }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/institutions`)
      .then(res => res.json())
      .then(data => setInstitutions(data))
      .catch(e => console.log(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.premiumHeader}>
        <TouchableOpacity onPress={goBack}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.premiumHeaderTitle}>{t.educationalInstitutions}</Text>
        <View style={{ width: 30 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 15 }}>
        {loading ? <ActivityIndicator size="large" color="#ff9800" /> : (
          institutions.map((inst, i) => (
            <View key={i} style={[styles.card, { padding: 15, marginBottom: 15 }]}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1a237e', marginBottom: 5 }}>{inst.name}</Text>
              <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>📍 {inst.location}</Text>
              {inst.contact && <Text style={{ fontSize: 13, color: '#555', marginBottom: 5 }}>📞 {inst.contact}</Text>}
              {inst.tagline && <Text style={{ fontSize: 12, fontStyle: 'italic', color: '#888', marginBottom: 10 }}>"{inst.tagline}"</Text>}

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                {inst.website && (
                  <TouchableOpacity
                    style={[styles.button, { flex: 1, marginRight: 5, backgroundColor: '#ff9800', marginTop: 0 }]}
                    onPress={() => Linking.openURL(inst.website)}
                  >
                    <Text style={styles.buttonText}>{t.visitWebsite}</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.button, { flex: 1, marginLeft: 5, backgroundColor: '#4caf50', marginTop: 0 }]}
                  onPress={() => {
                    const query = encodeURIComponent(inst.name + ' ' + inst.location);
                    const url = Platform.select({
                      ios: `maps:0,0?q=${query}`,
                      android: `geo:0,0?q=${query}`
                    });
                    Linking.openURL(url!).catch(err => console.error(err));
                  }}
                >
                  <Text style={styles.buttonText}>{t.viewMap}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function PlacesToVisitScreen({ goBack, language }: any) {
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/places`)
      .then(res => res.json())
      .then(data => {
        setPlaces(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(e => {
        console.log('Error fetching places:', e);
        setLoading(false);
      });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <View style={styles.premiumHeader}>
        <TouchableOpacity onPress={goBack}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.premiumHeaderTitle}>{t.placesToVisit}</Text>
        <View style={{ width: 30 }} />
      </View>

      {loading ? <ActivityIndicator size="large" color="#ff9800" style={{ marginTop: 50 }} /> : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 30, paddingTop: 15 }}>
          {places.length > 0 ? places.map((p) => (
            <View key={p.id} style={[styles.card, { padding: 0, overflow: 'hidden', marginBottom: 20 }]}>
              {p.imageUrl && <Image source={{ uri: p.imageUrl }} style={{ width: '100%', height: 200 }} resizeMode="cover" />}
              <View style={{ padding: 15 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1a237e' }}>{language === 'KA' ? p.nameKa || p.name : p.name}</Text>
                    {p.distance && <Text style={{ fontSize: 13, color: '#e65100', fontWeight: 'bold', marginTop: 3 }}>📍 {p.distance}</Text>}
                  </View>
                  {p.mapUrl && (
                    <TouchableOpacity
                      style={{ backgroundColor: '#1a237e', padding: 10, borderRadius: 10 }}
                      onPress={() => Linking.openURL(p.mapUrl)}
                    >
                      <Text style={{ color: '#fff' }}>🧭</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={{ fontSize: 14, color: '#555', marginTop: 10, lineHeight: 20 }}>
                  {language === 'KA' ? p.descriptionKa || p.descriptionEn : p.descriptionEn || p.descriptionKa}
                </Text>
              </View>
            </View>
          )) : (
            <Text style={{ textAlign: 'center', color: '#999', marginTop: 50 }}>{language === 'KA' ? 'ಯಾವುದೆ ಸ್ಥಳಗಳು ಕಂಡುಬಂದಿಲ್ಲ' : 'No places found.'}</Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function CustomSplashScreen() {
  return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff3e0' }]}>
      <Image
        source={require('./assets/matha-logo.png')}
        style={{ width: 180, height: 180, marginBottom: 20 }}
        resizeMode="contain"
      />
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#d84315', textAlign: 'center' }}>
        Sode Sri Vadiraja Matha
      </Text>
      <Text style={{ fontSize: 16, color: '#5d4037', marginTop: 10 }}>
        Official Mobile Application
      </Text>
      <ActivityIndicator size="large" color="#ff9800" style={{ marginTop: 50 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff3e0',
  },
  screen: {
    flex: 1,
    backgroundColor: '#fff5e6',
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#ff9800',
    alignItems: 'center',
    // borderBottomLeftRadius: 30, // Removed curve
    // borderBottomRightRadius: 30, // Removed curve
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  mathaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  mathaSubtitle: {
    fontSize: 14,
    color: '#ffe0b2',
    textAlign: 'center',
    marginBottom: 15,
  },
  swamijiContainer: {
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 15,
    width: '90%',
  },
  swamijiImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  swamijiCaption: {
    fontSize: 12,
    color: '#5d4037',
    textAlign: 'center',
    marginTop: 5,
    fontWeight: '500',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
    gap: 15, // Added gap explicitly
  },
  actionItem: {
    width: '22%',
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    padding: 10,
    elevation: 3,
    shadowRadius: 2,
  },
  actionIconSize: {
    fontSize: 24,
    marginBottom: 5,
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#5d4037',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    marginTop: 15,
    marginBottom: 10,
    color: '#5d4037',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5d4037',
    margin: 15,
  },
  card: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  label: {
    fontWeight: 'bold',
    color: '#5d4037',
  },
  value: {
    color: '#333',
  },
  loadButton: {
    color: '#ff9800',
    fontWeight: 'bold',
    fontSize: 16,
    padding: 10, // Added padding for better touch area
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  newsCard: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 8,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5d4037',
    marginBottom: 5,
  },
  newsDate: {
    color: '#888',
    fontSize: 12,
    marginBottom: 5,
  },
  sevaName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  sevaAmount: {
    color: '#ff9800',
    fontWeight: 'bold',
  },
  sevaDesc: {
    color: '#666',
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#ff9800',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButton: {
    backgroundColor: '#ff9800',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5d4037',
  },
  eventDate: {
    fontSize: 12,
    color: '#888',
    marginVertical: 5,
  },
  menuItem: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'android' ? 10 : 5,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  tabTextActive: {
    color: '#ff9800',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
    color: '#333',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ff9800',
    borderRadius: 4,
    marginRight: 10,
  },
  checkboxActive: {
    backgroundColor: '#ff9800',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#5d4037',
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
  },
  galleryItem: {
    width: '50%',
    padding: 5,
  },
  galleryImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  galleryTitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    color: '#5d4037',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 30,
  },
  modalContent: {
    width: '100%',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: 400,
  },
  fullTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  fullDesc: {
    color: '#ccc',
    fontSize: 14,
  },
  content: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 10,
  },
  sliderWrapper: {
    position: 'relative',
    alignItems: 'center',
    paddingVertical: 10,
  },
  sideArrowLeft: {
    position: 'absolute',
    left: 5,
    top: '40%',
    zIndex: 10,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 5,
    padding: 5,
  },
  sideArrowRight: {
    position: 'absolute',
    right: 5,
    top: '40%',
    zIndex: 10,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 5,
    padding: 5,
  },
  arrowIcon: {
    fontSize: 32,
    color: '#4caf50',
    fontWeight: 'bold',
  },
  newsTile: {
    width: Dimensions.get('window').width * 0.75,
    height: 320,
    marginRight: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  tileTopLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a237e',
    textAlign: 'center',
  },
  tileImageArea: {
    width: '100%',
    height: 180,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  tileFullImage: {
    width: '100%',
    height: '100%',
  },
  placeholderTileArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileSelectButton: {
    backgroundColor: '#32CD32',
    width: '90%',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 4,
  },
  tileSelectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  sliderContainer: {
    marginVertical: 10,
  },
  sliderContent: {
    paddingLeft: 40,
    paddingRight: 20,
  },
  tileImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#eee',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  tileContent: {
    padding: 10,
    alignItems: 'center',
  },
  tileTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  tileButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  tileButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  guruTile: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  guruTileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  guruTileName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    color: '#333',
  },
  guruTilePeriod: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ff9800',
    backgroundColor: '#fff',
  },
  radioActive: {
    backgroundColor: '#ff9800',
  },
  // Dropdown Styles
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  dropdownPlaceholder: {
    fontSize: 14,
    color: '#999',
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
    marginLeft: 10,
  },
  dropdownModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  dropdownModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseIcon: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  optionsList: {
    paddingHorizontal: 20,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionItemSelected: {
    backgroundColor: '#fff3e0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  optionTextSelected: {
    color: '#ff9800',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 18,
    color: '#ff9800',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  // Premium Development Styles
  premiumHeader: {
    backgroundColor: '#1a237e',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  premiumHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  premiumCard: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formSectionHeader: {
    backgroundColor: '#1a237e',
    padding: 12,
  },
  formSectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formPadding: {
    padding: 15,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  inputCol: {
    width: '48%',
  },
  formLabel: {
    fontSize: 12,
    color: '#1a237e',
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 8,
  },
  premiumInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1a237e',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    color: '#333',
    minHeight: 40,
  },
  premiumDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1a237e',
    borderRadius: 4,
    padding: 8,
    minHeight: 40,
  },
  radioRow: {
    flexDirection: 'row',
    gap: 20,
    marginVertical: 10,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioLabel: {
    fontSize: 14,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 15,
  },
  premiumSubmitBtn: {
    backgroundColor: '#1a237e',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Panchanga Popup Styles
  panchangaModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  panchangaModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  panchangaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ff9800',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panchangaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  panchangaCloseIcon: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  panchangaBody: {
    padding: 20,
    maxHeight: 400,
  },
  panchangaDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff9800',
    marginBottom: 15,
    textAlign: 'center',
  },
  panchangaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  panchangaLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  panchangaValue: {
    fontSize: 15,
    color: '#666',
  },
  panchangaDivider: {
    height: 1,
    backgroundColor: '#ff9800',
    marginVertical: 15,
  },
  panchangaFooter: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  panchangaFullButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  panchangaFullButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  panchangaCloseButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  panchangaCloseButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  panchangaLocation: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  panchangaSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff8e1',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffe082',
  },
  panchangaSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#827717',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fbc02d',
    paddingBottom: 5,
  },
  panchangaDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  panchangaDetailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  panchangaDetailValue: {
    fontSize: 14,
    color: '#555',
  },
  timingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timingCardLeft: {
    flex: 1,
  },
  templeNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  timingSlotText: {
    fontSize: 12,
    color: '#666',
  },
  timingCardRight: {
    backgroundColor: '#fff3e0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffe0b2',
  },
  timingValueText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e65100',
  },
  // New Styles for Grouped Timings
  templeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 5,
  },
  timingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 4,
  },
  timingLabel: {
    fontWeight: '600',
    color: '#666',
  },
  timingValue: {
    color: '#333',
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden', // for borderRadius on text (iOS needs View wrapper usually, but works on Android Text sometimes, safer on View but keeping simple refactor)
  }
});
