import Root from "./ComponentesRoot/root.jsx";
import { Routes, Route } from "react-router-dom";
import DashboardAdmin from "./ComponentesAdmin/dashboardAdmin.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Root />} />
      <Route path="/dashboardAdmin" element={<DashboardAdmin />} />
    </Routes>
  );
}

export default App;
