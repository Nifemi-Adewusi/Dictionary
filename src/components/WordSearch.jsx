
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const WordSearch = ({ onSearch, isLoading }) => {
  const [word, setWord] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(word);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-center">
        Look up any word
      </h2>
      <p className="text-center text-muted-foreground">
        Enter a word to get its definition, pronunciation, example usage, and more
      </p>
      
      <form onSubmit={handleSubmit} className="flex w-full max-w-lg mx-auto gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Search for a word..."
            className="w-full pl-4 pr-10"
            autoFocus
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Searching..." : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default WordSearch;
