# 🩺 HealthTrack – Health Metrics Tracker

HealthTrack is a responsive React web application designed to help users input, track, and visualize their daily health metrics like step count, water intake, or heart rate. With an intuitive UI, interactive graphs, and filtering/sorting capabilities, HealthTrack makes personal health tracking simple and insightful.

---

## 📌 Features

### ✅ Health Data Input
- Add health metrics like Step Count , Water Intake , Heart Rate with timestamp and value.
- Input validation to prevent empty or invalid entries.

### 📊 Data Visualization
- View your data in a table sorted by the latest entry.
- Interactive line chart using **Recharts** showing trends over the last 24 hours.

### 🔍 Filtering & Sorting
- Filter data by time of day: Morning (5 AM–12 PM), Afternoon (12 PM–5 PM), Evening (5 PM–9 PM), Night (9 PM–5 AM).
- Sort by ascending or descending values.

### 💾 Data Persistence
- Health data is stored in `localStorage`, so it persists even after page reloads.

### 💡 UI/UX Design
- Clean, modern design built using **Tailwind CSS**.
- Fully responsive for mobile and desktop views.

### 🌟 Bonus Features
- Dark Mode toggle.
- Edit or delete existing entries.
- Export your data to a CSV file.

---

## 📦 Libraries Used

| Library                     | Description                                                                 |
|----------------------------|-----------------------------------------------------------------------------|
| **React**                  | A JavaScript library for building fast and interactive UIs using components. |
| **react-data-table-component** | For displaying tabular health data with pagination, sorting, and styling.       |
| **lucide-react**           | Provides beautiful, clean, and modern icons for improving the visual design of the app. |
| **date-fns**               | Lightweight JavaScript date utility library used for formatting and manipulating dates/times. |
| **recharts**               | A composable charting library built on React, used to render bar and line charts for health trends. |
| **tailwindcss**            | A utility-first CSS framework for building custom, responsive designs with ease. |


## 👨‍💻 Website Design

I focused on creating a clean and intuitive interface. Key design choices include:

- **Clean layout** for focused user interaction  
- **Card/grid structure** for easy scalability and content organization  
- **Minimalist UI** to ensure ease of use without distractions  
- **Responsive design** optimized for both desktop and mobile views  

This approach ensures a balance between functionality, performance, and user experience.


## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aroraarushi/Health-Tracker.git
   git checkout sprint
   npm install
   npm run dev
