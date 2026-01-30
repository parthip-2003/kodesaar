# 🔗 How to Sync Kodesaar Instagram Posts & Videos

To automatically show your latest Instagram content on your website, you need to connect to the **Instagram Basic Display API**. This is a free service from Meta.

## 📋 Steps to get your Access Token

### 1. Facebook Developer Setup
1. Go to [Meta for Developers](https://developers.facebook.com/).
2. Log in with your Facebook account.
3. Click **"My Apps"** and then **"Create App"**.
4. Select **"Other"** -> **"Consumer"** (or "None") as the app type.
5. Give your app a name (e.g., "Kodesaar Website").

### 2. Add Instagram Basic Display
1. In the App Dashboard, find **"Instagram Basic Display"** and click **"Set Up"**.
2. Scroll to the bottom and click **"Create New App"**.
3. Enter your app name again.

### 3. Add an Instagram Test User
1. In the sidebar, go to **Instagram Basic Display** -> **Basic Display**.
2. Scroll down to **"User Token Generator"**.
3. Click **"Add or Remove Instagram Testers"**.
4. Click **"Add Instagram Testers"** and search for your account: `kodesaaroufficial`.
5. **CRITICAL**: Open Instagram on your phone/browser, go to **Settings** -> **Apps and Websites** -> **Tester Invites**, and **Accept** the invite.

### 4. Generate the Token
1. Go back to the Meta for Developers dashboard.
2. Go to **Instagram Basic Display** -> **Basic Display**.
3. Under **User Token Generator**, you should now see your account.
4. Click **"Generate Token"**.
5. Copy the long string of letters and numbers.

---

## 🛠️ Update your Website
Once you have the token:
1. Open [script.js](file:///C:/Users/PARTHIP%20SASIDHARAN/OneDrive/Documents/projects/parthip/kodesarr/script.js).
2. Find the line: `const INSTAGRAM_ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN_HERE';`
3. Replace `'YOUR_ACCESS_TOKEN_HERE'` with your actual token.

### 🚀 What happens next?
- Your website will **automatically** fetch your latest posts and reels.
- Videos will show a play icon and **auto-play** when someone hovers over them.
- Clicking any item will take the visitor directly to that post on Instagram.
