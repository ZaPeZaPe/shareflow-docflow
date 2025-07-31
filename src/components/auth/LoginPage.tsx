import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Shield, Building } from "lucide-react";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [loading, setLoading] = useState(false);

  const handleMSALLogin = async () => {
    setLoading(true);
    // Simular autenticação MSAL
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo e título */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Sistema de Documentos</h2>
          <p className="mt-2 text-muted-foreground">Tramitação segura de minutas</p>
        </div>

        {/* Card de login */}
        <Card className="shadow-lg border-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Acesso ao Sistema</CardTitle>
            <CardDescription>
              Faça login com sua conta Microsoft corporativa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Botão MSAL */}
            <Button 
              onClick={handleMSALLogin}
              disabled={loading}
              className="w-full h-12 bg-primary hover:bg-primary-hover"
              size="lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Autenticando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Entrar com Microsoft
                </div>
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">ou</span>
              </div>
            </div>

            {/* Login de demonstração */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@empresa.com"
                  value="joao.silva@empresa.com"
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value="demo123"
                  readOnly
                  className="bg-muted"
                />
              </div>
              <Button 
                onClick={onLogin}
                variant="outline"
                className="w-full"
              >
                Demo - Acesso Direto
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recursos de segurança */}
        <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-success" />
            <span className="font-medium text-foreground">Segurança Corporativa</span>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Autenticação Microsoft Azure AD</li>
            <li>• Integração SharePoint segura</li>
            <li>• Assinaturas digitais certificadas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}