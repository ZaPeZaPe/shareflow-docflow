import { useState } from "react";
import { Plus, Search, Filter, FileText, Share2, PenTool, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocumentCard, Document } from "./DocumentCard";
import { UploadDialog } from "./UploadDialog";
import { ShareDialog } from "./ShareDialog";
import { useToast } from "@/hooks/use-toast";

// Dados mockados
const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Contrato de Prestação de Serviços - TI",
    status: "draft",
    lastModified: new Date(2024, 0, 25, 14, 30),
    author: "João Silva",
    version: 1,
    hasUnreadChanges: false,
  },
  {
    id: "2",
    title: "Acordo de Confidencialidade - Projeto Alpha",
    status: "shared",
    lastModified: new Date(2024, 0, 24, 10, 15),
    sharedWith: "Tech Solutions LTDA",
    author: "Maria Santos",
    version: 2,
    hasUnreadChanges: true,
  },
  {
    id: "3",
    title: "Proposta Comercial - Sistema CRM",
    status: "pending",
    lastModified: new Date(2024, 0, 23, 16, 45),
    sharedWith: "Inovação Digital SA",
    author: "Carlos Oliveira",
    version: 3,
    hasUnreadChanges: false,
  },
  {
    id: "4",
    title: "Contrato de Fornecimento - Hardware",
    status: "signed",
    lastModified: new Date(2024, 0, 22, 9, 20),
    sharedWith: "Hardware Plus LTDA",
    author: "Ana Costa",
    version: 4,
    hasUnreadChanges: false,
  },
];

interface DashboardProps {
  showOnlySent?: boolean;
}

export function Dashboard({ showOnlySent = false }: DashboardProps) {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const { toast } = useToast();

  // Filtrar documentos
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    const matchesSentFilter = !showOnlySent || doc.author === "João Silva"; // Simular usuário atual
    
    return matchesSearch && matchesStatus && matchesSentFilter;
  });

  // Estatísticas
  const stats = {
    total: documents.length,
    draft: documents.filter(d => d.status === "draft").length,
    shared: documents.filter(d => d.status === "shared").length,
    pending: documents.filter(d => d.status === "pending").length,
    signed: documents.filter(d => d.status === "signed").length,
    unread: documents.filter(d => d.hasUnreadChanges).length,
  };

  const handleUpload = (title: string, file: File) => {
    const newDoc: Document = {
      id: String(Date.now()),
      title,
      status: "draft",
      lastModified: new Date(),
      author: "João Silva",
      version: 1,
      hasUnreadChanges: false,
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  const handleShare = (cnpj: string, companyName: string) => {
    if (selectedDocument) {
      setDocuments(prev => prev.map(doc => 
        doc.id === selectedDocument.id 
          ? { ...doc, status: "shared" as const, sharedWith: companyName, version: doc.version + 1 }
          : doc
      ));
    }
  };

  const handleView = (id: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, hasUnreadChanges: false } : doc
    ));
    toast({
      title: "Documento visualizado",
      description: "Abrindo documento...",
    });
  };

  const handleStartShare = (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (doc) {
      setSelectedDocument(doc);
      setShareDialogOpen(true);
    }
  };

  const handleUpdate = (id: string) => {
    toast({
      title: "Atualizar documento",
      description: "Funcionalidade de atualização será implementada.",
    });
  };

  const handleSign = (id: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id 
        ? { ...doc, status: "pending" as const, version: doc.version + 1 }
        : doc
    ));
    toast({
      title: "Enviado para assinatura",
      description: "Documento foi enviado para a plataforma Certisign.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {showOnlySent ? "Minutas Enviadas" : "Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            {showOnlySent 
              ? "Documentos que você criou e enviou"
              : "Gerencie seus documentos e acompanhe o status"
            }
          </p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Novo Documento
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{stats.total}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-secondary rounded-full" />
            <span className="text-sm text-muted-foreground">Rascunhos</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{stats.draft}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Share2 className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Compartilhados</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{stats.shared}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <PenTool className="h-4 w-4 text-warning" />
            <span className="text-sm text-muted-foreground">Pendentes</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{stats.pending}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <span className="text-sm text-muted-foreground">Assinados</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{stats.signed}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-destructive rounded-full" />
            <span className="text-sm text-muted-foreground">Não lidos</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{stats.unread}</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="draft">Rascunho</SelectItem>
            <SelectItem value="shared">Compartilhado</SelectItem>
            <SelectItem value="pending">Aguardando Assinatura</SelectItem>
            <SelectItem value="signed">Assinado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de documentos */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchTerm || statusFilter !== "all" 
              ? "Nenhum documento encontrado" 
              : "Nenhum documento ainda"
            }
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== "all"
              ? "Tente ajustar os filtros de busca."
              : "Comece criando seu primeiro documento."
            }
          </p>
          {!searchTerm && statusFilter === "all" && (
            <Button onClick={() => setUploadDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Documento
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onView={handleView}
              onShare={handleStartShare}
              onUpdate={handleUpdate}
              onSign={handleSign}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUpload={handleUpload}
      />

      {selectedDocument && (
        <ShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          onShare={handleShare}
          documentTitle={selectedDocument.title}
        />
      )}
    </div>
  );
}