
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DictionaryResult = ({ word, data, isLoading }) => {
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    if (data && data[0]?.phonetics) {
      // Find the first audio URL that exists
      const audioUrl = data[0].phonetics.find(p => p.audio)?.audio || null;
      setAudio(audioUrl);
    } else {
      setAudio(null);
    }
  }, [data]);

  const playAudio = () => {
    if (audio) {
      const sound = new Audio(audio);
      sound.play().catch(err => console.error("Error playing audio:", err));
    }
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-7 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-5 bg-muted rounded w-1/4"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
          <div className="h-4 bg-muted rounded w-4/6"></div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Results Found</CardTitle>
          <CardDescription>
            We couldn't find any definitions for "{word}".
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">{data[0].word}</CardTitle>
              <CardDescription className="text-lg">
                {data[0].phonetic || data[0].phonetics.find(p => p.text)?.text || ''}
              </CardDescription>
            </div>
            {audio && (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={playAudio}
                className="rounded-full hover:bg-primary/10"
                aria-label="Listen to pronunciation"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              {data[0].meanings.map((meaning, i) => (
                <TabsTrigger key={i} value={meaning.partOfSpeech}>
                  {meaning.partOfSpeech}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {data[0].meanings.map((meaning, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="font-semibold text-lg capitalize">{meaning.partOfSpeech}</h3>
                  <div className="space-y-2">
                    {meaning.definitions.map((def, i) => (
                      <div key={i} className="pl-4 border-l-2 border-primary/30">
                        <p>{i + 1}. {def.definition}</p>
                        {def.example && (
                          <p className="text-muted-foreground mt-1 text-sm italic">
                            "{def.example}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {meaning.synonyms?.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm font-medium">Synonyms: </span>
                      <span className="text-sm text-primary">
                        {meaning.synonyms.join(", ")}
                      </span>
                    </div>
                  )}
                  
                  {meaning.antonyms?.length > 0 && (
                    <div>
                      <span className="text-sm font-medium">Antonyms: </span>
                      <span className="text-sm text-primary">
                        {meaning.antonyms.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>

            {data[0].meanings.map((meaning, i) => (
              <TabsContent key={i} value={meaning.partOfSpeech} className="space-y-4">
                {meaning.definitions.map((def, j) => (
                  <div key={j} className="pl-4 border-l-2 border-primary/30">
                    <p>{j + 1}. {def.definition}</p>
                    {def.example && (
                      <p className="text-muted-foreground mt-1 text-sm italic">
                        "{def.example}"
                      </p>
                    )}
                  </div>
                ))}
                
                {meaning.synonyms?.length > 0 && (
                  <div className="mt-2">
                    <span className="text-sm font-medium">Synonyms: </span>
                    <span className="text-sm text-primary">
                      {meaning.synonyms.join(", ")}
                    </span>
                  </div>
                )}
                
                {meaning.antonyms?.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Antonyms: </span>
                    <span className="text-sm text-primary">
                      {meaning.antonyms.join(", ")}
                    </span>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      {data[0].sourceUrls && data[0].sourceUrls.length > 0 && (
        <div className="text-sm text-muted-foreground">
          <span>Source: </span>
          <a 
            href={data[0].sourceUrls[0]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-primary transition-colors"
          >
            {data[0].sourceUrls[0]}
          </a>
        </div>
      )}
    </div>
  );
};

export default DictionaryResult;
