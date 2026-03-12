import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import DashboardCompany from "./DashboardCompany";
import DashboardFreelancer from "./DashboardFreelancer";
import DashboardAdmin from "./DashboardAdmin";

const Dashboard = () => {
  const { profile, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!profile) return <Navigate to="/auth" replace />;
  if (isAdmin) return <DashboardAdmin />;
  if (profile.type === "empresa") return <DashboardCompany />;
  return <DashboardFreelancer />;
};

export default Dashboard;
