# NutriFlex run commands (Windows PowerShell)

Open **two PowerShell terminals** in the `Desktop\Nutriflex` project folder.

## One-time setup — backend terminal

```powershell
cd D:\JAYANSH\NutriFlex\Desktop\Nutriflex\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
python seed.py
```

If PowerShell blocks activation, replace `python` in the commands with `.\.venv\Scripts\python.exe` from the backend folder after creating the environment.

## Start the backend

In the backend terminal:

```powershell
cd D:\JAYANSH\NutriFlex\Desktop\Nutriflex\backend
.\.venv\Scripts\Activate.ps1
python run.py
```

The backend API runs at `http://127.0.0.1:5000`.

## One-time setup — frontend terminal

```powershell
cd D:\JAYANSH\NutriFlex\Desktop\Nutriflex\frontend
npm install
```

## Start the frontend

In the frontend terminal:

```powershell
cd D:\JAYANSH\NutriFlex\Desktop\Nutriflex\frontend
npm run dev
```

Open the local address Vite prints (usually `http://localhost:5173`). Keep both terminals running while using the site. Press `Ctrl+C` in a terminal to stop that server.

## Demo admin account

After running the seed command:

- Email: `admin@example.com`
- Password: `admin123`

Mock checkout is enabled by default and is labelled as a demo; it does not charge money. To use Razorpay test checkout, add test keys to `backend/.env` and set `PAYMENT_MODE=razorpay`.
