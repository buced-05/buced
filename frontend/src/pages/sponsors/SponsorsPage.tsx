import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircleIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import InviteSponsorModal from "./InviteSponsorModal";
import { sponsorsService } from "../../api/services";
import type { SponsorProfile } from "../../types/api";
import { useThemeStore } from "../../stores/theme";
import { cn } from "../../utils/cn";

const SponsorsPage = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [sponsors, setSponsors] = useState<SponsorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    setIsLoading(true);
    try {
      const data = await sponsorsService.profiles();
      setSponsors(data.results || []);
    } catch (err) {
      console.error("Erreur lors du chargement des sponsors:", err);
      // Fallback sur les données mock si l'API échoue
      setSponsors([
        { id: 1, company: "Orange Côte d'Ivoire", total_budget: "45000000", interests: [], description: "", sponsorships: [], user: { id: 1, username: "", email: "", first_name: "", last_name: "", role: "sponsor" as const, date_joined: "" } } as SponsorProfile,
        { id: 2, company: "MTN Foundation", total_budget: "30000000", interests: [], description: "", sponsorships: [], user: { id: 2, username: "", email: "", first_name: "", last_name: "", role: "sponsor" as const, date_joined: "" } } as SponsorProfile,
        { id: 3, company: "Société Générale", total_budget: "25000000", interests: [], description: "", sponsorships: [], user: { id: 3, username: "", email: "", first_name: "", last_name: "", role: "sponsor" as const, date_joined: "" } } as SponsorProfile,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatBudget = (budget: string | number) => {
    const num = typeof budget === "string" ? parseFloat(budget) : budget;
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(0)} M XOF`;
    }
    return `${num.toLocaleString()} XOF`;
  };

  return (
  <div className="space-y-6 animate-fade-in-up">
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className={cn("text-2xl md:text-3xl font-black", theme === "dark" ? "gradient-text" : "text-gray-900")}>Sponsors & Partenaires</h2>
        <p className={cn("text-sm font-medium mt-1", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
          Identifiez les partenaires stratégiques et suivez leurs engagements.
        </p>
      </div>
      <Button variant="primary" size="md" onClick={() => setInviteModalOpen(true)}>
        Inviter un sponsor
      </Button>
    </header>

    <Card className={cn("overflow-hidden", theme === "dark" ? "border-neon-cyan/30 bg-[#1A1A2E]" : "border-gray-200 bg-white")}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className={cn("border-b", theme === "dark" ? "bg-[#2A2A3E] text-gray-400 border-neon-cyan/20" : "bg-gray-100 text-gray-600 border-gray-200")}>
              <tr>
                <th className="px-6 py-4 font-bold">Sponsor</th>
                <th className="px-6 py-4 font-bold">Budget engagé</th>
                <th className="px-6 py-4 font-bold">Projets soutenus</th>
                <th className="px-6 py-4 font-bold"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className={cn("inline-block animate-spin rounded-full h-8 w-8 border-4", theme === "dark" ? "border-neon-cyan border-t-transparent" : "border-blue-600 border-t-transparent")} />
                  </td>
                </tr>
              ) : sponsors.length === 0 ? (
                <tr>
                  <td colSpan={4} className={cn("px-6 py-12 text-center", theme === "dark" ? "text-gray-400" : "text-gray-600")}>
                    Aucun sponsor trouvé
                  </td>
                </tr>
              ) : (
                sponsors.map((sponsor) => (
                  <tr 
                    key={sponsor.id} 
                    className={cn("border-b transition-colors duration-300", theme === "dark" ? "border-neon-cyan/10 hover:bg-[#2A2A3E]/50" : "border-gray-200 hover:bg-gray-50")}
                  >
                    <td className={cn("px-6 py-4 font-bold", theme === "dark" ? "text-white" : "text-gray-900")}>{sponsor.company}</td>
                    <td className={cn("px-6 py-4 font-semibold", theme === "dark" ? "text-neon-cyan" : "text-blue-600")}>{formatBudget(sponsor.total_budget)}</td>
                    <td className={cn("px-6 py-4 font-semibold", theme === "dark" ? "text-neon-purple" : "text-purple-600")}>{sponsor.sponsorships?.length || 0}</td>
                    <td className="px-6 py-4">
                      <Button variant="dark" size="sm" className="group" onClick={() => navigate(`/sponsors/${sponsor.id}`)}>
                        <UserCircleIcon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                        <span>Voir le profil</span>
                        <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    <InviteSponsorModal
      open={inviteModalOpen}
      onClose={() => setInviteModalOpen(false)}
      onSuccess={() => {
        fetchSponsors();
      }}
    />
  </div>
  );
};

export default SponsorsPage;
