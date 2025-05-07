import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

const WORD_OF_THE_DAY_POOL = [
  {
    word: "Serendipity",
    partOfSpeech: "noun",
    definition: "The occurrence of events by chance in a happy or beneficial way.",
    phonetic: "/ˌsɛr.ənˈdɪp.ɪ.ti/",
    example: "The discovery of penicillin was a serendipity.",
    funFact: "The term was coined by Horace Walpole in 1754 based on the Persian fairy tale 'The Three Princes of Serendip' whose heroes were always making discoveries by accident.",
  },
  {
    word: "Ephemeral",
    partOfSpeech: "adjective",
    definition: "Lasting for a very short time.",
    phonetic: "/ɪˈfɛm.ər.əl/",
    example: "The ephemeral beauty of cherry blossoms makes them special.",
    funFact: "It comes from the Greek word 'ephemeros', which means 'lasting only one day'.",
  },
  {
    word: "Resilience",
    partOfSpeech: "noun",
    definition: "The capacity to recover quickly from difficulties; toughness.",
    phonetic: "/rɪˈzɪl.i.əns/",
    example: "Her resilience helped her overcome countless obstacles.",
    funFact: "In physics, resilience refers to the ability of a material to absorb energy when deformed and release it when unloaded.",
  },
  {
    word: "Mellifluous",
    partOfSpeech: "adjective",
    definition: "Pleasant to hear; sweet or musical; smooth and rich.",
    phonetic: "/məˈlɪf.lu.əs/",
    example: "The mellifluous tones of the cello filled the concert hall.",
    funFact: "Derives from Latin 'mel' (honey) and 'fluere' (to flow), literally meaning 'flowing with honey'.",
  },
  {
    word: "Equanimity",
    partOfSpeech: "noun",
    definition: "Mental calmness, composure, and evenness of temper, especially in a difficult situation.",
    phonetic: "/ˌek.wəˈnɪm.ɪ.ti/",
    example: "She faced the crisis with remarkable equanimity.",
    funFact: "Equanimity is a core value in many Eastern philosophical traditions, especially Buddhism.",
  },
  {
    word: "Petrichor",
    partOfSpeech: "noun",
    definition: "The pleasant, earthy smell that follows rain falling on dry ground.",
    phonetic: "/ˈpɛtrɪkɔːr/",
    example: "After months of drought, the petrichor from the first rainfall was especially refreshing.",
    funFact: "The word combines the Greek 'petra' (stone) and 'ichor' (the fluid that flows in the veins of the gods in Greek mythology).",
  },
  {
    word: "Defenestration",
    partOfSpeech: "noun",
    definition: "The action of throwing someone or something out of a window.",
    phonetic: "/ˌdiːfɛnɪˈstreɪʃən/",
    example: "The defenestration of the printer was a dramatic response to office frustration.",
    funFact: "The word gained historical significance after the 'Defenestration of Prague' in 1618, an event that helped trigger the Thirty Years' War.",
  },
  {
    word: "Ubiquitous",
    partOfSpeech: "adjective",
    definition: "Present, appearing, or found everywhere.",
    phonetic: "/juːˈbɪkwɪtəs/",
    example: "Smartphones have become ubiquitous in modern society.",
    funFact: "The term comes from the Latin word 'ubique' meaning 'everywhere', which is also the motto of several military units.",
  },
  {
    word: "Eloquent",
    partOfSpeech: "adjective",
    definition: "Fluent or persuasive in speaking or writing.",
    phonetic: "/ˈɛləkwənt/",
    example: "Her eloquent speech moved the entire audience.",
    funFact: "The word derives from Latin 'eloqui', meaning 'to speak out', combining 'e' (out) and 'loqui' (to speak).",
  },
  {
    word: "Sonder",
    partOfSpeech: "noun",
    definition: "The realization that each random passerby is living a life as vivid and complex as your own.",
    phonetic: "/ˈsɒndər/",
    example: "Walking through the busy city, he was struck by a feeling of sonder.",
    funFact: "This word was coined by John Koenig for his Dictionary of Obscure Sorrows, trying to give a name to a universal human experience.",
  },
  {
    word: "Limerence",
    partOfSpeech: "noun",
    definition: "The state of being infatuated or obsessed with another person.",
    phonetic: "/ˈlɪmərəns/",
    example: "Her limerence for her colleague made it difficult to concentrate at work.",
    funFact: "The term was coined by psychologist Dorothy Tennov in her 1979 book 'Love and Limerence'.",
  },
  {
    word: "Apricity",
    partOfSpeech: "noun",
    definition: "The warmth of the sun in winter.",
    phonetic: "/əˈprɪsɪti/",
    example: "She basked in the apricity that streamed through the window.",
    funFact: "This beautiful, rare word comes from the Latin 'apricus', meaning 'warmed by the sun'.",
  },
  {
    word: "Sempiternal",
    partOfSpeech: "adjective",
    definition: "Eternal and unchanging; everlasting.",
    phonetic: "/ˌsɛmpɪˈtɜːnəl/",
    example: "The stars seem sempiternal, though even they will eventually die.",
    funFact: "The word combines Latin 'semper' (always) and 'aeternus' (eternal), emphasizing the concept of eternal continuity.",
  },
  {
    word: "Meraki",
    partOfSpeech: "noun",
    definition: "To do something with soul, creativity, or love; to put something of yourself into your work.",
    phonetic: "/meˈraki/",
    example: "The chef prepared each dish with meraki, explaining her food's exceptional quality.",
    funFact: "This is a modern Greek word that has no direct English equivalent but captures the essence of putting your heart into your work.",
  },
  {
    word: "Fernweh",
    partOfSpeech: "noun",
    definition: "An ache for distant places; a craving for travel.",
    phonetic: "/ˈfɛʁnveː/",
    example: "The travel photographs induced a feeling of fernweh in her.",
    funFact: "This German word literally translates to 'far-sickness' as opposed to 'homesickness' (heimweh).",
  }
];

const WordOfTheDay = () => {
  const [wordOfTheDay, setWordOfTheDay] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWordOfTheDay = async () => {
      setIsLoading(true);
      
      try {
        // Check if we already have today's word
        const today = new Date().toDateString();
        const storedWord = localStorage.getItem('wordOfTheDay');
        const storedDate = localStorage.getItem('wordOfTheDay_date');
        
        // If we have a stored word and it's from today, use it
        if (storedWord && storedDate === today) {
          setWordOfTheDay(JSON.parse(storedWord));
          setIsLoading(false);
          return;
        }
        
        // Otherwise, pick a random word
        const randomIndex = Math.floor(Math.random() * WORD_OF_THE_DAY_POOL.length);
        const randomWord = WORD_OF_THE_DAY_POOL[randomIndex];
        
        // Store the word and today's date
        localStorage.setItem('wordOfTheDay', JSON.stringify(randomWord));
        localStorage.setItem('wordOfTheDay_date', today);
        
        setWordOfTheDay(randomWord);
      } catch (error) {
        console.error("Error fetching word of the day:", error);
        toast.error("Failed to load Word of the Day");
        
        // Fallback to a default word
        setWordOfTheDay(WORD_OF_THE_DAY_POOL[0]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWordOfTheDay();
  }, []);

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-7 bg-muted rounded w-2/5 mb-2"></div>
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

  if (!wordOfTheDay) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <CardTitle>Word of the Day</CardTitle>
        </div>
        <CardDescription>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold">{wordOfTheDay.word}</h3>
            <p className="text-sm text-muted-foreground">
              {wordOfTheDay.phonetic} • <span className="italic">{wordOfTheDay.partOfSpeech}</span>
            </p>
          </div>
          
          <div>
            <p className="font-medium">Definition:</p>
            <p>{wordOfTheDay.definition}</p>
          </div>
          
          {wordOfTheDay.example && (
            <div>
              <p className="font-medium">Example:</p>
              <p className="italic">"{wordOfTheDay.example}"</p>
            </div>
          )}
          
          <div className="pt-2 border-t border-border">
            <p className="font-medium">Did you know?</p>
            <p>{wordOfTheDay.funFact}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WordOfTheDay;
