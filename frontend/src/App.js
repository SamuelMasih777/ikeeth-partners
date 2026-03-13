import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import InvestmentPage from "./pages/InvestmentPage";
import PortfolioPage from "./pages/PortfolioPage";
import FoundersPage from "./pages/FoundersPage";
import InvestorsPage from "./pages/InvestorsPage";
import InsightsPage from "./pages/InsightsPage";
import TeamPage from "./pages/TeamPage";
import ContactPage from "./pages/ContactPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPortfolio from "./pages/admin/AdminPortfolio";
import AdminTeam from "./pages/admin/AdminTeam";
import AdminInsights from "./pages/admin/AdminInsights";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminPitches from "./pages/admin/AdminPitches";
import AdminNewsletter from "./pages/admin/AdminNewsletter";
import AdminSettings from "./pages/admin/AdminSettings";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <div className="App noise-overlay min-h-screen bg-[#030303]">
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<><Navbar /><HomePage /><Footer /></>} />
            <Route path="/about" element={<><Navbar /><AboutPage /><Footer /></>} />
            <Route path="/investment" element={<><Navbar /><InvestmentPage /><Footer /></>} />
            <Route path="/portfolio" element={<><Navbar /><PortfolioPage /><Footer /></>} />
            <Route path="/founders" element={<><Navbar /><FoundersPage /><Footer /></>} />
            <Route path="/investors" element={<><Navbar /><InvestorsPage /><Footer /></>} />
            <Route path="/insights" element={<><Navbar /><InsightsPage /><Footer /></>} />
            <Route path="/team" element={<><Navbar /><TeamPage /><Footer /></>} />
            <Route path="/contact" element={<><Navbar /><ContactPage /><Footer /></>} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="portfolio" element={<AdminPortfolio />} />
              <Route path="team" element={<AdminTeam />} />
              <Route path="insights" element={<AdminInsights />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="pitches" element={<AdminPitches />} />
              <Route path="newsletter" element={<AdminNewsletter />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
          <Toaster position="bottom-right" theme="dark" />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
