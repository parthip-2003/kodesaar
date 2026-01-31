# 🚀 Deployment Guide: Kodesaar

Since your project is already connected to GitHub, going live is extremely easy. Follow these 3 simple steps to see your website on the internet!

---

## Step 1: Push your latest changes
First, make sure all the hard work we did today is uploaded to GitHub.
Run these commands in your terminal (inside the `kodesarr` folder):

```bash
git add .
git commit -m "Final polish and admin updates"
git push origin main
```

---

## Step 2: Enable GitHub Pages
1. Go to your repository on GitHub: [github.com/parthip-2003/kodesaar](https://github.com/parthip-2003/kodesaar)
2. Click on the ⚙️ **Settings** tab at the top.
3. On the left sidebar, click **Pages**.
4. Under **Build and deployment** > **Branch**:
   - Ensure it says `main`.
   - Ensure the folder is `/ (root)`.
5. Click **Save**.

---

## Step 3: Your Site is LIVE!
* GitHub will take about 1-2 minutes to build your site.
* Refresh the **Pages** settings page until you see: 
  > **"Your site is live at: https://parthip-2003.github.io/kodesaar/"**

---

## 💡 Important Notes for Supabase
Because your site uses Supabase, everything will work perfectly once deployed! 
- **Admin Panel**: Your admin credentials (`pathu@2003`) remain the same.
- **Messages**: Contact form messages will continue to go to your Supabase dashboard.
- **Gallery**: Any photo you upload via the Admin Panel will appear on the live site automatically.

**Happy Deploying, Friend! ⚜️**
