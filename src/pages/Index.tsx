
import { useState } from "react";
import { toast } from "sonner";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import WordSearch from "@/components/WordSearch";
import WordOfTheDay from "@/components/WordOfTheDay";
import RecentSearches from "@/components/RecentSearches";
import DictionaryResult from "@/components/DictionaryResult";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  const [searchedWord, setSearchedWord] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [wordData, setWordData] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

  const handleSearch = async (word) => {
    if (!word.trim()) {
      toast.error("Please enter a word to search");
      return;
    }
    
    setIsLoading(true);
    setSearchedWord(word);
    
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      
      if (!response.ok) {
        throw new Error('Word not found');
      }
      
      const data = await response.json();
      setWordData(data);
      
      // Add to recent searches if not already there
      if (!recentSearches.includes(word.toLowerCase())) {
        const updatedSearches = [word.toLowerCase(), ...recentSearches.slice(0, 4)];
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      }
      
    } catch (error) {
      toast.error(error.message === 'Word not found' 
        ? `No definition found for "${word}"` 
        : "Failed to fetch word data. Please try again.");
      setWordData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            WordWise
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 pt-8 pb-24">
        <section className="max-w-3xl mx-auto space-y-8">
          <WordSearch onSearch={handleSearch} isLoading={isLoading} />

          {searchedWord && wordData ? (
            <DictionaryResult word={searchedWord} data={wordData} isLoading={isLoading} />
          ) : (
            <>
              <WordOfTheDay />
              {recentSearches.length > 0 && <RecentSearches searches={recentSearches} onSearch={handleSearch} />}
            </>
          )}
        </section>
      </main>
      
      {/* Footer */}
      <footer className="py-6 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} WordWise Dictionary. Powered by Free Dictionary API.</p>
        </div>
      </footer>

      {/* Scroll to top button */}
      <Button
        variant="secondary"
        size="icon"
        className="fixed bottom-6 right-6 rounded-full shadow-md"
        onClick={scrollToTop}
      >
        <ArrowUp size={18} />
      </Button>
    </div>
  );
};

export default Index;
