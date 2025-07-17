# ⚡ System for optimizing the routes of electric personal vehicles — Frontend

## Project Description

This project is a modern, responsive web application focused on routing for electric vehicles (EVs). It calculates optimal routes by considering the locations of charging stations and integrates real-time data with dynamic geolocation features. Developed as part of a diploma thesis, it also serves as a tool for planning EV charging infrastructure across Slovenia. The frontend is connected to a [Django-based backend](https://github.com/TimotejSustersic/DIPL-BE.git).

---

## 📁 Project Structure

```bash
/DIPL-FE
├── public/                  # Static assets (favicon, images, etc.)
├── src/                     # Application source code
│   ├── app/                 # App directory 
│   ├── components/          # Reusable UI components
│   ├── lib/                 # API clients, services, constants
│   ├── schemas/             # Zod schemas or form validation logic
│   └── routes.ts            # Route definitions
├── .env.local               # Local environment variables
└── next.config.js           # Next.js configuration
```

## 🔧 Tech Stack

| Layer         | Tech                                  |
|---------------|---------------------------------------|
| Framework     | [Next.js](https://nextjs.org/)        |
| UI Styling    | [Tailwind CSS](https://tailwindcss.com/) / [Shadcn.ui](https://ui.shadcn.com/) |
| Mapping       | [Leaflet.js](https://leafletjs.com/) |
| HTTP Client   | `fetch` |
| State Mgmt    | React Context |
| Deployment    | Vercel |

## ⚙️ Setup & Installation

1. **Clone the repo**

```bash
git clone https://github.com/TimotejSustersic/dipl-fe.git
```

2. **Install dependencies**

```bash
npm install
```

3. **Edit `.env.local` with the appropriate values:**

```env
NEXT_PUBLIC_API_URL="http://localhost:8000/"
```

4. **Run the dev server**

```bash
npm run dev
```

Visit `http://localhost:3000`

## 🚀 Features & Functionality

- **Routing:**  
  All route paths are defined in `src/routes.ts` for centralized management and type safety.

- **Page Structure:**  
  The main app pages are located in `src/app/home/`, each corresponding to a primary route:
  
```bash
src/
└── app/
    └── home/
        ├── cars/page.tsx
        ├── maps/page.tsx
        ├── infrastructure/page.tsx
        └── testing_evaluation/page.tsx
```

Each of these directories contains a `page.tsx` file responsible for rendering the actual content.

- **Components:**  
  - Shared UI components live in `src/components/`.
  - Generic Shadcn.ui components are organized under `src/components/ui/`.

```bash
src/
├── components/
    ├── ui/         # Shadcn.ui components
    └── ...         # Custom components (forms, maps)

```

- **API Utilities:**  
A generic API request handler is available at:  
`src/API/utils.ts`  
This function abstracts HTTP requests and is used across the app for all endpoint calls.

```bash
src/
└── API/
    └── utils.ts    # Generic fetch wrapper

```

## 📦 Deployment

- Deployed on [Vercel](https://vercel.com/).
- Uses CI/CD with GitHub Actions.


## 📚 References

- [OpenChargeMap API](https://openchargemap.org/site/develop/api)
- [EU EVSE datasets](https://data.europa.eu/data/datasets)
- [Google Maps API docs](https://developers.google.com/maps/documentation)

## 👨‍💻 Author

**Timotej Šušteršič**  

- [GitHub](https://github.com/TimotejSustersic/)

## 📄 License

This project is licensed under the MIT License. See `LICENSE` file for details.
