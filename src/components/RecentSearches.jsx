
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClockIcon } from "lucide-react";

const RecentSearches = ({ searches, onSearch }) => {
  if (!searches || searches.length === 0) return null;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ClockIcon className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Recent Searches</CardTitle>
        </div>
        <CardDescription>Your recent word lookups</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {searches.map((word, index) => (
            <Button 
              key={index} 
              variant="outline" 
              onClick={() => onSearch(word)}
              className="capitalize"
            >
              {word}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentSearches;
