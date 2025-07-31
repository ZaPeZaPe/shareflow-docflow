import { useState } from "react";
import { Upload, X, FileText, CheckCircle } from "lucide-react";
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

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (title: string, file: File) => void;
  mode?: "upload" | "update";
  currentTitle?: string;
}

export function UploadDialog({ 
  open, 
  onOpenChange, 
  onUpload, 
  mode = "upload",
  currentTitle = ""
}: UploadDialogProps) {
  const [title, setTitle] = useState(currentTitle);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && 
        selectedFile.type !== "application/msword") {
      toast({
        title: "Formato inválido",
        description: "Apenas arquivos Word (.doc, .docx) são aceitos.",
        variant: "destructive",
      });
      return;
    }
    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !file) return;

    setUploading(true);
    
    // Simular upload
    setTimeout(() => {
      onUpload(title.trim(), file);
      setUploading(false);
      setTitle("");
      setFile(null);
      onOpenChange(false);
      
      toast({
        title: mode === "upload" ? "Documento enviado" : "Documento atualizado",
        description: mode === "upload" 
          ? "Arquivo carregado com sucesso no SharePoint." 
          : "Nova versão do arquivo foi carregada.",
      });
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "upload" ? "Enviar Novo Documento" : "Atualizar Documento"}
          </DialogTitle>
          <DialogDescription>
            {mode === "upload" 
              ? "Faça upload de um arquivo Word para iniciar a tramitação."
              : "Atualize a versão do documento com um novo arquivo."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Documento</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Contrato de Prestação de Serviços"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Arquivo Word</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragOver 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
            >
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle className="h-6 w-6 text-success" />
                  <div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-foreground font-medium">
                    Arraste um arquivo Word aqui
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ou clique para selecionar
                  </p>
                  <input
                    type="file"
                    accept=".doc,.docx"
                    onChange={(e) => {
                      const selectedFile = e.target.files?.[0];
                      if (selectedFile) {
                        handleFileSelect(selectedFile);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
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
              disabled={!title.trim() || !file || uploading}
              className="flex-1"
            >
              {uploading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  {mode === "upload" ? "Enviando..." : "Atualizando..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {mode === "upload" ? "Enviar" : "Atualizar"}
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}