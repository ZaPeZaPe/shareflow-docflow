import { Clock, Eye, EyeOff, FileText, MoreHorizontal, Share2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface Document {
  id: string;
  title: string;
  status: "draft" | "shared" | "signed" | "pending";
  lastModified: Date;
  sharedWith?: string;
  hasUnreadChanges: boolean;
  author: string;
  version: number;
}

interface DocumentCardProps {
  document: Document;
  onView: (id: string) => void;
  onShare: (id: string) => void;
  onUpdate: (id: string) => void;
  onSign: (id: string) => void;
}

const statusConfig = {
  draft: {
    label: "Rascunho",
    variant: "secondary" as const,
    color: "text-muted-foreground",
  },
  shared: {
    label: "Compartilhado",
    variant: "default" as const,
    color: "text-primary",
  },
  pending: {
    label: "Aguardando Assinatura",
    variant: "default" as const,
    color: "text-warning",
  },
  signed: {
    label: "Assinado",
    variant: "default" as const,
    color: "text-success",
  },
};

export function DocumentCard({ document, onView, onShare, onUpdate, onSign }: DocumentCardProps) {
  const status = statusConfig[document.status];
  
  const handleAction = (action: string) => {
    switch (action) {
      case "view":
        onView(document.id);
        break;
      case "share":
        onShare(document.id);
        break;
      case "update":
        onUpdate(document.id);
        break;
      case "sign":
        onSign(document.id);
        break;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 relative">
      {document.hasUnreadChanges && (
        <div className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full border-2 border-background" />
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground truncate">{document.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant={status.variant}
                  className={status.color}
                >
                  {status.label}
                </Badge>
                {document.hasUnreadChanges && (
                  <Badge variant="destructive" className="text-xs">
                    <EyeOff className="h-3 w-3 mr-1" />
                    Não visualizado
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleAction("view")}>
                <Eye className="mr-2 h-4 w-4" />
                Visualizar
              </DropdownMenuItem>
              {document.status === "draft" && (
                <>
                  <DropdownMenuItem onClick={() => handleAction("update")}>
                    <FileText className="mr-2 h-4 w-4" />
                    Atualizar Arquivo
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction("share")}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartilhar
                  </DropdownMenuItem>
                </>
              )}
              {document.status === "shared" && (
                <DropdownMenuItem onClick={() => handleAction("sign")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Enviar para Assinatura
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{document.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>v{document.version}</span>
            </div>
          </div>
          
          {document.sharedWith && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Compartilhado com:</span> {document.sharedWith}
            </div>
          )}
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {formatDistanceToNow(document.lastModified, { 
                addSuffix: true, 
                locale: ptBR 
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}