# UI/UX Design & User Flow - Team Hayavadana

## 1. Design Philosophy
The "Seva" app design balances **Traditional Devotion** with **Modern Simplicity**. 
- **Color Palette**: Deep Saffron (#FF9800), Temple Gold (#FFD700), and Sacred Indigo (#1A237E).
- **Typography**: Clean sans-serif (Inter) for readability, with traditional weights for religious titles.
- **Visuals**: High-resolution imagery of Sri Bhootarajaru and the lineage of Swamijis to establish immediate trust.

## 2. Core User Flows

### 2.1 Onboarding & Discovery
1. **App Entry**: Splash screen featuring the Matha Logo.
2. **Language Toggle**: Immediate selection between English & Kannada.
3. **Live Authentication**: Mobile Number -> SMS OTP (Firebase) -> profile creation with Astrological details.

### 2.2 Seva Booking Flow (Premium UX)
1. **Category Selection**: User chooses from Pooja, Alankara, etc.
2. **Details**: User selects specific Seva and date.
3. **Smart Autofill**: App pulls Rashi, Nakshatra, and Gotra from user profile to ensure accuracy.
4. **Confirmation**: Instant Push Notification and Reference ID generation.

### 2.3 Guru Parampara Explorer
1. **Grid View**: Chronological order of pontiffs.
2. **Interconnected Search**: Clicking "Ashrama Guru" or "Shishya" triggers a recursive navigation deep into the lineage.
3. **Spatial Context**: Integration with Google Maps for Vrindavana locations.

## 3. Wireframe Structure (Hierarchy)
- **Home Tab**:
  - Global Search (Voice Enabled)
  - Flash News Slider
  - Current Timings Table
  - Social Quick-Links
- **Seva Tab**:
  - Service Catalog
  - Transaction History
- **Events Tab**:
  - Matha Calendar
  - Aradhana Alerts
- **More (Profile/Settings)**:
  - Devotee Dashboard
  - Tithinirnaya Panchanga
  - Literacy / Publications Library

## 4. Accessibility
- **Bilingual Interface**: 100% Karnataka-friendly native support.
- **Voice Search**: Hands-free navigation for elderly devotees.
- **High Contrast**: Optimized for outdoor readability during pilgrimage.
