# Ruwadverse - The #1 Entrepreneurship Platform in the Arab World

Ruwadverse is a comprehensive platform designed to empower entrepreneurs, investors, and skilled professionals in the MENA region. It combines social networking, AI-powered tools, and a marketplace to foster innovation and business growth.

## Features

- **RAED AI Co-founder**: An intelligent assistant to help validate ideas, draft contracts, and provide strategic advice.
- **Smart Matching**: Connect with the perfect co-founder, investor, or team member based on skills and interests.
- **Community Feed**: Share ideas, achievements, and insights with a specialized community.
- **Marketplace**: Buy and sell services, assets, and tools tailored for startups.
- **Real-time Chat**: Communicate instantly with connections and the RAED AI assistant.
- **Bilingual Support**: Fully localized for Arabic and English with RTL/LTR support.
- **Secure Authentication**: Robust user authentication and profile management.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion (for animations)
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context API (for Auth, Language, Theme)
- **AI Integration**: Google Gemini API (via @google/genai SDK)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ruwadverse.git
   cd ruwadverse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in your API keys (e.g., `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, etc. if applicable).
   - Note: The Gemini API key is handled by the platform in this demo, but for production, you would add `GEMINI_API_KEY` to your backend environment variables.

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── auth/       # Authentication related components
│   ├── community/  # Community feed components
│   ├── layout/     # Layout wrappers (Navbar, Sidebar, etc.)
│   └── ui/         # Generic UI elements (Buttons, Inputs, etc.)
├── contexts/       # React Context providers (Auth, Language, Theme)
├── hooks/          # Custom React hooks
├── lib/            # Utility libraries and configurations
├── pages/          # Page components (routes)
├── types/          # TypeScript type definitions
├── App.tsx         # Main application component
├── main.tsx        # Entry point
└── translations.ts # Internationalization strings
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
