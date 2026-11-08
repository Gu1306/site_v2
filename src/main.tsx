import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initGoogleTag } from './lib/tracking'

// Só carrega a tag do Google se VITE_GOOGLE_TAG_ID existir no build.
initGoogleTag();

createRoot(document.getElementById("root")!).render(<App />);
