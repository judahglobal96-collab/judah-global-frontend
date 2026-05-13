import { useEffect } from "react";

function App() {
  useEffect(() => {
    console.log(import.meta.env.VITE_API_BASE_URL);

    fetch(`${import.meta.env.VITE_API_BASE_URL}`)
      .then((res) => res.text())
      .then((data) => console.log("API RESPONSE:", data))
      .catch((err) => console.error("API ERROR:", err));
  }, []);

  return <div>Judah Global Frontend Running</div>;
}

export default App;