import { useState } from "react";
import { Share2, Building, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShare: (cnpj: string, companyName: string) => void;
  documentTitle: string;
}

export function ShareDialog({ open, onOpenChange, onShare, documentTitle }: ShareDialogProps) {
  const [cnpj, setCnpj] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    setCnpj(formatted);
    
    // Simular busca de empresa por CNPJ
    if (formatted.length === 18) {
      setTimeout(() => {
        setCompanyName("Fornecedor Exemplo LTDA");
      }, 500);
    } else {
      setCompanyName("");
    }
  };

  const validateCNPJ = (cnpj: string) => {
    const numbers = cnpj.replace(/\D/g, "");
    return numbers.length === 14;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCNPJ(cnpj)) {
      toast({
        title: "CNPJ inválido",
        description: "Por favor, digite um CNPJ válido.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simular compartilhamento
    setTimeout(() => {
      onShare(cnpj, companyName);
      setLoading(false);
      setCnpj("");
      setCompanyName("");
      onOpenChange(false);
      
      toast({
        title: "Documento compartilhado",
        description: `Acesso concedido para ${companyName}. Eles poderão editar o documento.`,
      });
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Compartilhar Documento
          </DialogTitle>
          <DialogDescription>
            Compartilhe "{documentTitle}" com um fornecedor para edição.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ do Fornecedor</Label>
            <Input
              id="cnpj"
              value={cnpj}
              onChange={handleCNPJChange}
              placeholder="00.000.000/0000-00"
              maxLength={18}
              required
            />
            <p className="text-sm text-muted-foreground">
              O fornecedor precisará inserir este CNPJ para acessar o documento.
            </p>
          </div>

          {companyName && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm font-medium text-success">Empresa encontrada</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{companyName}</span>
              </div>
            </div>
          )}

          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
            <h4 className="text-sm font-medium text-warning mb-1">Importante</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• O fornecedor poderá editar o documento</li>
              <li>• Você será notificado sobre as alterações</li>
              <li>• O acesso é seguro via validação de CNPJ</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!validateCNPJ(cnpj) || loading}
              className="flex-1"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Compartilhando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Compartilhar
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}