import { useCallback, useEffect, useState } from "react";
import { ChevronUp, ChevronDown, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function formatDate(timestamp) {
  try {
    const date = new Date(parseInt(timestamp));
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    const options = { 
      hour: '2-digit', 
      minute: '2-digit', 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    };
    return new Intl.DateTimeFormat('en-GB', options).format(date).replace(',', ' |');
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}

function Recommendations({ selectedTags }) {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastKey, setLastKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchArticles = useCallback(
    async (key) => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/recommendation?lastKey=${key ? JSON.stringify(key) : ""}` +
          `&tags=${selectedTags ? JSON.stringify(selectedTags) : ""}`
        );
        
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        
        const data = await res.json();
        setArticles((prevArticles) => [...prevArticles, ...(data.articles || [])]);
        setLastKey(data.lastKey);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching articles:", err);
      } finally {
        setLoading(false);
      }
    },
    [selectedTags]
  );

  useEffect(() => {
    setArticles([]);
    setCurrentIndex(0);
    setLastKey(null);
    fetchArticles();
  }, [fetchArticles, selectedTags]);

  const nextArticle = () => {
    if (currentIndex < articles.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else if (lastKey && !loading) {
      fetchArticles(lastKey);
    }
  };

  const previousArticle = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  // Prefetch next image
  useEffect(() => {
    const nextIndex = currentIndex + 1;
    if (articles[nextIndex] && articles[nextIndex].image_url) {
      const img = new Image();
      img.src = articles[nextIndex].image_url;
    }
  }, [currentIndex, articles]);

  const currentArticle = articles[currentIndex];

  if (error) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <CardContent className="pt-6 text-center">
          <p className="text-destructive">Error loading articles: {error}</p>
          <Button onClick={() => fetchArticles()} className="mt-4">Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full container p-4 grid grid-cols-1 md:grid-cols-[1fr,auto] gap-4 lg:max-w-[90%] lg:mx-auto">
      {console.log("Articles:", currentArticle)}
      {loading && articles.length === 0 ? (
        <ArticleSkeleton />
      ) : currentArticle ? (
        <Card className="h-full min-h-[70vh]">
          <div className="grid grid-cols-1 lg:grid-cols-[40%,60%] h-full">
            <div className="relative h-[200px] sm:h-full bg-muted">
              {currentArticle.image_url ? (
                <img
                  src={currentArticle.image_url}
                  alt={currentArticle.title}
                  className="object-cover rounded-t-lg md:rounded-t-none md:rounded-l-lg h-full w-full absolute inset-0"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">No image available</p>
                </div>
              )}
            </div>
            
            <div className="flex flex-col p-6 overflow-auto">
              <CardHeader className="p-0 pb-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  {currentArticle.tags?.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <CardTitle className="text-2xl md:text-4xl lg:text-5xl pb-8 font-bold tracking-tight">
                  {currentArticle.title}
                </CardTitle>
                <div className="text-sm text-muted-foreground mt-2 flex items-center">
                  <span>By {currentArticle.author}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(currentArticle.published_date)}</span>
                </div>
              </CardHeader>
              
              <CardContent className="p-0 flex-grow">
                <p className="text-muted-foreground leading-relaxed w-full text-justify text-sm md:text-base lg:text-lg">
                  {currentArticle.content}
                </p>
              </CardContent>
              
              <CardFooter className="p-0 pt-4 flex justify-end">
                <Link 
                  href={currentArticle.url} 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="inline-flex items-center"
                >
                  <Button variant="outline" className="gap-2">
                    <span>Read Full Article</span>
                    <ExternalLink size={16} />
                  </Button>
                </Link>
              </CardFooter>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="h-full min-h-[70vh] flex items-center justify-center">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No articles available for the selected tags</p>
          </CardContent>
        </Card>
      )}

      <div className="flex md:flex-col items-center justify-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={previousArticle}
          disabled={currentIndex === 0}
          aria-label="Previous article"
          className="rounded-full h-12 w-12"
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
        
        <div className="text-center bg-muted rounded-md px-3 py-1">
          <span className="text-sm font-medium">
            {articles.length > 0 ? `${currentIndex + 1}/${articles.length}` : "0/0"}
          </span>
        </div>
        
        <Button
          size="icon"
          variant="default"
          onClick={nextArticle}
          disabled={loading || (currentIndex === articles.length - 1 && !lastKey)}
          aria-label="Next article"
          className="rounded-full h-12 w-12"
        >
          <ChevronDown className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}

function ArticleSkeleton() {
  return (
    <Card className="h-full min-h-[70vh] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[40%,60%] h-full">
        <Skeleton className="h-[200px] lg:h-full rounded-tl-lg rounded-tr-lg lg:rounded-tr-none lg:rounded-bl-lg" />
        <div className="flex flex-col p-6">
          <div className="pb-4">
            <div className="flex gap-2 mb-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-5 w-16 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-4/5 mb-2" />
            <Skeleton className="h-10 w-3/5 mb-4" />
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
          <div className="flex-grow space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="pt-4 flex justify-end">
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default Recommendations;
