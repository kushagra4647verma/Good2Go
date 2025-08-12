import { createRoot } from "react-dom/client";

import { Provider } from "./components/ui/provider";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(<App />);
