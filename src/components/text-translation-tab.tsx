"use client";

import { detectLanguage } from "@/ai/flows/automatic-language-detection";
import { translateText } from "@/ai/flows/translate-text";
import { useDebounce } from "@/hooks/use-debounce";
import { useToast } from "@/hooks/use-toast";
import { languages, type Language } from "@/lib/languages";
import { ArrowLeftRight, LoaderCircle } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Skeleton } from "./ui/skeleton";
import { Textarea } from "./ui/textarea";

export function TextTranslationTab() {
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("pt");
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [detectedLang, setDetectedLang] = useState<Language | null>(null);

  const [isTranslating, startTranslation] = useTransition();
  const [isDetecting, startDetection] = useTransition();

  const debouncedSourceText = useDebounce(sourceText, 500);
  const { toast } = useToast();

  useEffect(() => {
    if (debouncedSourceText && sourceLang === "auto") {
      startDetection(async () => {
        try {
          const { language } = await detectLanguage({ text: debouncedSourceText });
          const foundLang = languages.find(l => l.code === language);
          setDetectedLang(foundLang || { code: language, name: language });
        } catch (error) {
          console.error("Language detection failed:", error);
          setDetectedLang(null);
        }
      });
    } else {
      setDetectedLang(null);
    }
  }, [debouncedSourceText, sourceLang]);

  const handleTranslate = () => {
    if (!sourceText) return;

    startTranslation(async () => {
      try {
        const { translation } = await translateText({ text: sourceText, targetLanguage: targetLang });
        setTranslatedText(translation);
      } catch (error) {
        console.error("Translation failed:", error);
        toast({
          variant: "destructive",
          title: "Erro na Tradução",
          description: "Não foi possível traduzir o texto. Por favor, tente novamente.",
        });
      }
    });
  };

  const handleSwapLanguages = () => {
    if (sourceLang === 'auto') return;
    const newSourceLang = targetLang;
    const newTargetLang = sourceLang;
    setSourceLang(newSourceLang);
    setTargetLang(newTargetLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };
  
  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-[1fr_auto_1fr]">
          <div className="flex flex-col gap-4">
            <Select value={sourceLang} onValueChange={setSourceLang}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Detectar Idioma</SelectItem>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative">
              <Textarea
                placeholder="Digite o texto para traduzir"
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                className="pr-20"
              />
              {sourceLang === 'auto' && (
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                  {isDetecting ? "Detectando..." : (detectedLang ? `Detectado: ${detectedLang.name}` : '')}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Button variant="ghost" size="icon" onClick={handleSwapLanguages} aria-label="Trocar idiomas" disabled={sourceLang === 'auto'}>
              <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            <Select value={targetLang} onValueChange={setTargetLang}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o idioma" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative">
              {isTranslating ? (
                <div className="space-y-2">
                  <Skeleton className="h-[180px] w-full" />
                </div>
              ) : (
                <Textarea
                  placeholder="Tradução"
                  readOnly
                  value={translatedText}
                />
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleTranslate} disabled={isTranslating || !sourceText}>
            {isTranslating ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Traduzindo...
              </>
            ) : (
              "Traduzir"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
