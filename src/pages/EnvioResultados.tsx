import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, CheckCircle, X, Loader2 } from "lucide-react";
import logoCareFit from "@/assets/logocarefitclub.png";

const TIPOS_ATIVIDADE = [
  "Corrida de Rua",
  "Trail Run",
  "Triathlon",
  "Duathlon",
  "Outro",
];

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface FilePreview {
  file: File;
  preview: string;
  type: "image" | "video";
}

const EnvioResultados = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form state
  const [nome, setNome] = useState("");
  const [prova, setProva] = useState("");
  const [dataProva, setDataProva] = useState("");
  const [distancia, setDistancia] = useState("");
  const [tipo, setTipo] = useState("");
  const [tipoOutro, setTipoOutro] = useState("");
  const [tempoHH, setTempoHH] = useState("");
  const [tempoMM, setTempoMM] = useState("");
  const [tempoSS, setTempoSS] = useState("");
  const [avaliacao, setAvaliacao] = useState("");
  const [rpe, setRpe] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [files, setFiles] = useState<FilePreview[]>([]);

  // noindex, nofollow
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;

    const newFiles: FilePreview[] = [];
    const currentCount = files.length;

    for (let i = 0; i < selected.length && currentCount + newFiles.length < MAX_FILES; i++) {
      const file = selected[i];
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} excede o limite de 10MB.`,
          variant: "destructive",
        });
        continue;
      }
      const isVideo = file.type.startsWith("video/");
      const preview = URL.createObjectURL(file);
      newFiles.push({ file, preview, type: isVideo ? "video" : "image" });
    }

    if (currentCount + newFiles.length > MAX_FILES) {
      toast({
        title: "Limite de arquivos",
        description: `Máximo de ${MAX_FILES} arquivos permitidos.`,
        variant: "destructive",
      });
    }

    setFiles((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const validateForm = (): boolean => {
    if (!nome.trim()) { toast({ title: "Campo obrigatório", description: "Preencha o nome do atleta.", variant: "destructive" }); return false; }
    if (!prova.trim()) { toast({ title: "Campo obrigatório", description: "Preencha o nome da prova.", variant: "destructive" }); return false; }
    if (!dataProva) { toast({ title: "Campo obrigatório", description: "Preencha a data da prova.", variant: "destructive" }); return false; }
    if (!distancia.trim()) { toast({ title: "Campo obrigatório", description: "Preencha a distância.", variant: "destructive" }); return false; }
    if (!tipo) { toast({ title: "Campo obrigatório", description: "Selecione o tipo de atividade.", variant: "destructive" }); return false; }
    if (tipo === "Outro" && !tipoOutro.trim()) { toast({ title: "Campo obrigatório", description: "Especifique o tipo de atividade.", variant: "destructive" }); return false; }
    if (!tempoHH || !tempoMM || !tempoSS) { toast({ title: "Campo obrigatório", description: "Preencha o tempo de conclusão.", variant: "destructive" }); return false; }
    if (files.length === 0) { toast({ title: "Campo obrigatório", description: "Envie pelo menos uma foto ou vídeo.", variant: "destructive" }); return false; }
    if (!avaliacao) { toast({ title: "Campo obrigatório", description: "Selecione sua avaliação de desempenho.", variant: "destructive" }); return false; }
    if (!rpe) { toast({ title: "Campo obrigatório", description: "Selecione o esforço percebido (RPE).", variant: "destructive" }); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // 1) Upload files to Storage
      const submissionId = crypto.randomUUID();
      const arquivos: Array<{ path: string; mime: string; size: number; originalName: string }> = [];

      for (const f of files) {
        const ext = f.file.name.split(".").pop() || "bin";
        const storagePath = `${submissionId}/${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("resultados-atletas")
          .upload(storagePath, f.file, { contentType: f.file.type });

        if (uploadError) throw uploadError;

        arquivos.push({
          path: storagePath,
          mime: f.file.type,
          size: f.file.size,
          originalName: f.file.name,
        });
      }

      // 2) Insert record into DB
      const tempo = `${tempoHH.padStart(2, "0")}:${tempoMM.padStart(2, "0")}:${tempoSS.padStart(2, "0")}`;
      const tipoFinal = tipo === "Outro" ? tipoOutro : tipo;

      const { error: dbError } = await supabase
        .from("envio_resultados" as any)
        .insert({
          id: submissionId,
          nome: nome.trim(),
          prova: prova.trim(),
          data_prova: dataProva,
          distancia: distancia.trim(),
          tipo: tipoFinal,
          tempo,
          avaliacao: Number(avaliacao),
          rpe: Number(rpe),
          observacoes: observacoes.trim() || null,
          arquivos,
        } as any);

      if (dbError) throw dbError;

      // 3) Send email notification via edge function
      const [year, month, day] = dataProva.split("-");
      const dataFormatada = `${day}/${month}/${year}`;

      await supabase.functions.invoke("enviar-resultado", {
        body: {
          nome: nome.trim(),
          prova: prova.trim(),
          data_prova: dataFormatada,
          distancia: distancia.trim(),
          tipo: tipoFinal,
          tempo,
          avaliacao: Number(avaliacao),
          rpe: Number(rpe),
          observacoes: observacoes.trim(),
          num_arquivos: arquivos.length,
        },
      });

      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Erro ao enviar resultado:", error);
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar seu resultado. Tente novamente ou entre em contato via WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNome("");
    setProva("");
    setDataProva("");
    setDistancia("");
    setTipo("");
    setTipoOutro("");
    setTempoHH("");
    setTempoMM("");
    setTempoSS("");
    setAvaliacao("");
    setRpe("");
    setObservacoes("");
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center px-4 py-20">
        <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Recebemos seu resultado!
          </h2>
          <p className="text-muted-foreground mb-2">
            Obrigado por compartilhar sua conquista.
          </p>
          <p className="text-muted-foreground mb-8">
            Ela pode aparecer no post de segunda-feira da CareFit Run Base.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={resetForm} variant="hero" size="lg">
              Enviar outro resultado
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="/">Voltar ao site</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <div className="bg-primary py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <img src={logoCareFit} alt="CareFit Run Base" className="h-12 mx-auto mb-6" />
          <h1 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-4">
            Envio de Resultados
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Olá, atleta! Use este formulário para nos enviar seu resultado e sua melhor foto da prova.
            Suas conquistas são nosso orgulho e essas informações nos ajudam a celebrá-las em nossas redes sociais. Contamos com você!
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Dados do Atleta */}
          <section className="bg-card rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-foreground border-b border-border pb-2">Dados do Atleta</h2>
            <div>
              <Label htmlFor="nome">Nome do Atleta (Nome e 1 Sobrenome) *</Label>
              <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: João Silva" maxLength={100} className="mt-1" />
            </div>
          </section>

          {/* Dados da Prova */}
          <section className="bg-card rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-foreground border-b border-border pb-2">Dados da Prova</h2>
            <div>
              <Label htmlFor="prova">Nome da Prova *</Label>
              <Input id="prova" value={prova} onChange={(e) => setProva(e.target.value)} placeholder="Ex: Maratona de São Paulo" maxLength={200} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="data">Data da Prova *</Label>
              <Input id="data" type="date" value={dataProva} onChange={(e) => setDataProva(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="distancia">Distância da Prova *</Label>
              <Input id="distancia" value={distancia} onChange={(e) => setDistancia(e.target.value)} placeholder="Ex: 42km, 21km, 10km" maxLength={50} className="mt-1" />
            </div>
          </section>

          {/* Tipo de Atividade */}
          <section className="bg-card rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-foreground border-b border-border pb-2">Tipo de Atividade *</h2>
            <RadioGroup value={tipo} onValueChange={setTipo} className="space-y-3">
              {TIPOS_ATIVIDADE.map((t) => (
                <div key={t} className="flex items-center space-x-3">
                  <RadioGroupItem value={t} id={`tipo-${t}`} />
                  <Label htmlFor={`tipo-${t}`} className="cursor-pointer">{t}</Label>
                </div>
              ))}
            </RadioGroup>
            {tipo === "Outro" && (
              <Input value={tipoOutro} onChange={(e) => setTipoOutro(e.target.value)} placeholder="Especifique o tipo de atividade" maxLength={100} className="mt-2" />
            )}
          </section>

          {/* Tempo */}
          <section className="bg-card rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-foreground border-b border-border pb-2">Tempo de Conclusão *</h2>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Label htmlFor="hh" className="text-xs text-muted-foreground">Horas</Label>
                <Input id="hh" type="number" min={0} max={99} value={tempoHH} onChange={(e) => setTempoHH(e.target.value)} placeholder="HH" className="mt-1 text-center" />
              </div>
              <span className="text-2xl font-bold text-muted-foreground mt-5">:</span>
              <div className="flex-1">
                <Label htmlFor="mm" className="text-xs text-muted-foreground">Min</Label>
                <Input id="mm" type="number" min={0} max={59} value={tempoMM} onChange={(e) => setTempoMM(e.target.value)} placeholder="MM" className="mt-1 text-center" />
              </div>
              <span className="text-2xl font-bold text-muted-foreground mt-5">:</span>
              <div className="flex-1">
                <Label htmlFor="ss" className="text-xs text-muted-foreground">Seg</Label>
                <Input id="ss" type="number" min={0} max={59} value={tempoSS} onChange={(e) => setTempoSS(e.target.value)} placeholder="SS" className="mt-1 text-center" />
              </div>
            </div>
          </section>

          {/* Upload */}
          <section className="bg-card rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-foreground border-b border-border pb-2">Envie sua melhor foto/vídeo da prova *</h2>
            <p className="text-sm text-muted-foreground">Até {MAX_FILES} arquivos • Imagem ou vídeo • Máx 10MB por arquivo</p>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />

            {files.length < MAX_FILES && (
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full border-dashed border-2 h-20 gap-2">
                <Upload className="w-5 h-5" />
                Selecionar arquivos ({files.length}/{MAX_FILES})
              </Button>
            )}

            {files.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {files.map((f, i) => (
                  <div key={i} className="relative rounded-lg overflow-hidden border border-border aspect-square bg-muted">
                    {f.type === "image" ? (
                      <img src={f.preview} alt={f.file.name} className="w-full h-full object-cover" />
                    ) : (
                      <video src={f.preview} className="w-full h-full object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 truncate">
                      {f.file.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Avaliação de Desempenho */}
          <section className="bg-card rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-foreground border-b border-border pb-2">Avaliação de Desempenho *</h2>
            <p className="text-sm text-muted-foreground">1 = Insatisfatório • 5 = Excelente</p>
            <RadioGroup value={avaliacao} onValueChange={setAvaliacao} className="flex flex-wrap gap-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="flex flex-col items-center gap-1">
                  <RadioGroupItem value={String(n)} id={`av-${n}`} />
                  <Label htmlFor={`av-${n}`} className="text-sm cursor-pointer">{n}</Label>
                </div>
              ))}
            </RadioGroup>
          </section>

          {/* RPE */}
          <section className="bg-card rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-foreground border-b border-border pb-2">Esforço Percebido (RPE) *</h2>
            <p className="text-sm text-muted-foreground">1 = Muito fácil • 10 = Máximo</p>
            <RadioGroup value={rpe} onValueChange={setRpe} className="flex flex-wrap gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <div key={n} className="flex flex-col items-center gap-1">
                  <RadioGroupItem value={String(n)} id={`rpe-${n}`} />
                  <Label htmlFor={`rpe-${n}`} className="text-sm cursor-pointer">{n}</Label>
                </div>
              ))}
            </RadioGroup>
          </section>

          {/* Observações */}
          <section className="bg-card rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-foreground border-b border-border pb-2">Notas ou Comentários Adicionais</h2>
            <Textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} placeholder="Opcional – Compartilhe como foi sua experiência!" maxLength={1000} rows={4} />
          </section>

          {/* Submit */}
          <Button type="submit" variant="hero" size="lg" className="w-full text-lg py-6" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Enviando...
              </>
            ) : (
              "Enviar Resultado"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Ao enviar, você concorda que suas informações e mídias podem ser usadas nas redes sociais da CareFit Run Base.
          </p>
        </form>
      </div>
    </div>
  );
};

export default EnvioResultados;
