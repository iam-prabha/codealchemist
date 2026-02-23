# CodeAlchemist - Free 100% Self-Hosted Deployment Guide (Vercel + AWS EC2 Free Tier)

This guide will teach you how to deploy the **frontend to Vercel (Free)** and the **Judge0 execution engine to an AWS EC2 `t2.micro` or `t3.micro` instance (1-Year Free Tier)**.

Because Judge0 is extremely memory-heavy, running it on a 1GB AWS instance usually crashes the server. However, we have included a custom setup script that automatically creates "Swap Space" (fake RAM using the SSD) to guarantee 100% stability.

---

### Step 1: Push Code to GitHub
1. Create a new repository on [GitHub](https://github.com/new).
2. Open your terminal in the CodeAlchemist folder and push the code:
   ```bash
   git remote add origin https://github.com/<your-username>/codealchemist.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy Frontend to Vercel (Free)
1. Go to [Vercel](https://vercel.com/) and create a new project.
2. Import your `codealchemist` GitHub repository.
3. Open the **Environment Variables** section and add the following:
   - `BETTER_AUTH_SECRET`: (Your 32-character secret from `.env`)
   - `DATABASE_URL`: (Your Supabase connection string)
   - `GOOGLE_CLIENT_ID`: (Your Google OAuth ID)
   - `GOOGLE_CLIENT_SECRET`: (Your Google OAuth Secret)
   - `GITHUB_CLIENT_ID`: (Your GitHub OAuth ID)
   - `GITHUB_CLIENT_SECRET`: (Your GitHub OAuth Secret)
4. Click **Deploy**.
5. Once Vercel gives you your URL (e.g., `https://codealchemist-production.vercel.app`), go back to your Vercel Project Settings > Environment Variables, and add one more:
   - `BETTER_AUTH_URL`: `https://your-vercel-domain.vercel.app`
6. (Optional) Update your Google and GitHub OAuth Callback URLs to match your new Vercel domain.

---

### Step 3: Launch Your AWS Free Tier Server
1. Go to the [AWS Management Console](https://aws.amazon.com/) and search for **EC2**.
2. Click **Launch Instance**.
3. **Name:** `Judge0-Execution-Engine`
4. **OS Images:** Select **Ubuntu** (24.04 LTS or 22.04 LTS).
5. **Instance Type:** Make sure it says **`t2.micro`** or **`t3.micro`** (Free tier eligible).
6. **Key Pair (Login):** Click "Create new key pair", name it `judge0-key`, and download the `.pem` file to your computer.
7. **Network Settings:**
   - Check the boxes for "Allow HTTP traffic" and "Allow HTTPS traffic".
   - **CRITICAL:** Click "Edit" on the Network Settings. Add a new Security Group Rule:
     - **Type:** Custom TCP
     - **Port Range:** `2358`
     - **Source Type:** Anywhere (`0.0.0.0/0`)
8. **Configure Storage:** Increase the size from 8 GiB to **30 GiB** (This is the maximum allowed on the free tier, and we need the extra space for our Swap File).
9. Click **Launch Instance**.

---

### Step 4: Run the 1-Click Installation Script
1. Once your AWS instance is running, copy its **Public IPv4 address**.
2. Open your terminal and SSH into the server using the `.pem` key you downloaded:
   ```bash
   # (Mac/Linux users may need to run `chmod 400 judge0-key.pem` first)
   ssh -i /path/to/judge0-key.pem ubuntu@<YOUR-AWS-PUBLIC-IP>
   ```
3. Once logged into the AWS server, copy and paste this exact command to download and run our custom setup script:
   ```bash
   curl -sSL https://raw.githubusercontent.com/<your-username>/codealchemist/main/scripts/setup-judge0-aws.sh | bash
   ```
   *(Make sure to replace `<your-username>` with your actual GitHub username).*

4. The script will take 2-3 minutes to run. It will install Docker, allocate 2GB of Swap space to prevent crashes, download Judge0, secure it with a random authentication token, and start the engine.

### Step 5: Connect Vercel to AWS
1. At the very end of the script output, it will print two highly important values:
   - `JUDGE0_API_URL` (Your AWS IP address on port 2358).
   - `JUDGE0_AUTH_TOKEN` (A randomly generated 32-character secret password).
2. Copy both of these values.
3. Go back to your **Vercel** dashboard -> Settings -> Environment Variables.
4. Add the two variables:
   - `JUDGE0_API_URL`: `http://<YOUR-AWS-IP>:2358`
   - `JUDGE0_AUTH_TOKEN`: `your-random-32-character-secret`
5. Go to Vercel -> Deployments -> Click the three dots on your latest deployment -> **Redeploy**.

🎉 **You are completely done!** The Next.js app is hosted for free on Vercel, and code execution is handled securely and flawlessly by your own unlimited, free AWS EC2 server!