import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, ShieldCheckIcon, QrCodeIcon } from "@heroicons/react/24/outline";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import useAuth from "../../hooks/useAuth";
import apiClient from "../../api/client";

const TwoFactorPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isEnabled, setIsEnabled] = useState(user?.two_factor_enabled ?? false);

  const handleEnable = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await apiClient.post("/api/auth/2fa/setup/");
      setQrCode(data.qr_code);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Erreur lors de l'activation du 2FA.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiClient.post("/api/auth/2fa/verify/", { code });
      setIsEnabled(true);
      setQrCode(null);
      setCode("");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Code invalide. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    if (!confirm("Êtes-vous sûr de vouloir désactiver l'authentification à deux facteurs ?")) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      await apiClient.post("/api/auth/2fa/disable/");
      setIsEnabled(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Erreur lors de la désactivation du 2FA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up max-w-3xl">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/parametres")}>
          <ArrowLeftIcon className="h-4 w-4" />
          Retour
        </Button>
        <div>
          <h2 className="text-2xl md:text-3xl font-black gradient-text">Authentification à deux facteurs</h2>
          <p className="text-sm text-gray-400 font-medium mt-1">
            Sécurisez votre compte avec le 2FA
          </p>
        </div>
      </header>

      {error && (
        <div className="rounded-lg border border-neon-pink/50 bg-neon-pink/10 p-3 text-sm text-neon-pink">
          {error}
        </div>
      )}

      <Card className="border-neon-purple/30 bg-[#1A1A2E]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ShieldCheckIcon className="h-5 w-5 text-neon-purple" />
            État actuel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">Authentification à deux facteurs</p>
              <p className="text-xs text-gray-400 mt-1">
                {isEnabled ? "Activée" : "Non activée"}
              </p>
            </div>
            <Badge variant={isEnabled ? "success" : "neutral"}>
              {isEnabled ? "Activé" : "Désactivé"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {!isEnabled && !qrCode && (
        <Card className="border-neon-cyan/30 bg-[#1A1A2E]">
          <CardHeader>
            <CardTitle className="text-white">Activer le 2FA</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 mb-6">
              L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire à votre compte.
              Vous devrez entrer un code depuis votre application d'authentification en plus de votre mot de passe.
            </p>
            <Button variant="primary" size="md" onClick={handleEnable} loading={loading}>
              <QrCodeIcon className="h-4 w-4" />
              Activer le 2FA
            </Button>
          </CardContent>
        </Card>
      )}

      {qrCode && (
        <Card className="border-neon-green/30 bg-[#1A1A2E]">
          <CardHeader>
            <CardTitle className="text-white">Scanner le QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-400">
              Scannez ce QR Code avec votre application d'authentification (Google Authenticator, Authy, etc.)
            </p>
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <img src={qrCode} alt="QR Code 2FA" className="w-64 h-64" />
            </div>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code de vérification</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Entrez le code à 6 chiffres"
                  maxLength={6}
                  required
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="md" type="button" onClick={() => setQrCode(null)}>
                  Annuler
                </Button>
                <Button variant="primary" size="md" type="submit" loading={loading}>
                  Vérifier et activer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isEnabled && (
        <Card className="border-neon-pink/30 bg-[#1A1A2E]">
          <CardHeader>
            <CardTitle className="text-white">Désactiver le 2FA</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 mb-4">
              Attention : La désactivation du 2FA réduira la sécurité de votre compte.
            </p>
            <Button variant="outline" size="md" onClick={handleDisable} loading={loading}>
              Désactiver le 2FA
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TwoFactorPage;

