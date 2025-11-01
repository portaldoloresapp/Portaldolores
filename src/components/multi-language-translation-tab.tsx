
"use client";

import { multiLanguageTranslation } from "@/ai/flows/multi-language-translation";
import { useToast } from "@/hooks/use-toast";
import { languages } from "@/lib/languages";
import { Check, ChevronsUpDown, LoaderCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Skeleton } from "./ui/skeleton";
import { Textarea } from "./ui/textarea";

export function MultiLanguageTranslationTab() {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [sourceText, setSourceText] = useState("");
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);

  const [isTranslating, startTranslation] = useTransition();
  const { toast } = useToast();

  const handleTranslate = () => {
    if (!sourceText || selectedLanguages.length === 0) {
      return;
    }

    startTranslation(async () => {
      try {
        const result = await multiLanguageTranslation({
          text: sourceText,
          targetLanguages: selectedLanguages,
        });
        setTranslatedTexts(result);
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

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguages((prev) => {
      if (prev.includes(code)) {
        return prev.filter((lang) => lang !== code);
      }
      return [...prev, code];
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-6">
      <div className="flex flex-col gap-4">
        <Textarea
          placeholder="Digite o texto para traduzir"
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          className="min-h-[180px]"
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {selectedLanguages.length > 0
                ? `${selectedLanguages.length} idioma(s) selecionado(s)`
                : "Selecione os idiomas..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder="Buscar idiomas..." />
              <CommandList>
                <CommandEmpty>Nenhum idioma encontrado.</CommandEmpty>
                <CommandGroup>
                  {languages.map((lang) => (
                    <CommandItem
                      key={lang.code}
                      value={lang.name}
                      onSelect={() => handleLanguageSelect(lang.code)}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          selectedLanguages.includes(lang.code) ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      {lang.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Button onClick={handleTranslate} disabled={isTranslating || !sourceText || selectedLanguages.length === 0}>
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

      <div className="flex flex-col gap-4">
        {isTranslating ? (
          <div className="space-y-4">
             {selectedLanguages.map((langCode) => (
               <Skeleton key={langCode} className="h-24 w-full" />
             ))}
           </div>
        ) : (
          Object.entries(translatedTexts).map(([langCode, text]) => (
            <Card key={langCode}>
              <CardHeader className="p-4">
                <CardTitle className="text-base">{languages.find(l => l.code === langCode)?.name || langCode}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">{text}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
