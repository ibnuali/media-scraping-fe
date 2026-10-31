import { ExternalLink, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { NewsItem } from "@/types/keyword"
import { SentimentBadge } from "./SentimentBadge"

interface ArticleContentDialogProps {
  article: NewsItem
}

export function ArticleContentDialog({ article }: ArticleContentDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant="ghost" size="sm" className="gap-1.5" />}
      >
        <FileText className="size-3.5" />
        Read content
      </DialogTrigger>
      <DialogContent className="max-h-[85dvh] overflow-y-auto [overflow-wrap:anywhere] sm:max-w-2xl">
        <DialogHeader className="pr-6">
          <DialogTitle className="leading-snug">
            {article.title || "Article content"}
          </DialogTitle>
          <DialogDescription>
            Saved article content and optional AI analysis.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap items-center gap-3">
          <SentimentBadge sentiment={article.sentiment} />
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary underline-offset-4 hover:underline"
          >
            Open source <ExternalLink className="size-3" />
          </a>
        </div>
        {article.summary && (
          <section className="space-y-2">
            <h3 className="text-sm font-medium">AI summary</h3>
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-ink-2">
              {article.summary}
            </p>
          </section>
        )}
        <section className="space-y-2">
          <h3 className="text-sm font-medium">Full content</h3>
          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap text-ink-2">
            {article.description ||
              "Full content is unavailable for this article. Open the source to read it."}
          </p>
        </section>
      </DialogContent>
    </Dialog>
  )
}
