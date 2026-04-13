import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RichTextEditor from '@/components/RichTextEditor';
import { toast } from 'sonner';

const AUTHOR_OPTIONS = [
  { value: 'rebecca joseph', label: 'rebecca joseph' },
  { value: 'isha jain', label: 'isha jain' },
  { value: 'rebecca and isha', label: 'rebecca and isha' },
];

type ContentType = 'post' | 'quote' | 'book' | 'article';

interface EditDialogProps {
  type: ContentType;
  item: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

const EditDialog = ({ type, item, open, onOpenChange, onUpdated }: EditDialogProps) => {
  const [title, setTitle] = useState<string>(item?.title ?? '');
  const [content, setContent] = useState<string>(item?.content ?? '');
  const [postAuthor, setPostAuthor] = useState<string>(item?.author ?? 'rebecca joseph');

  const [text, setText] = useState<string>(item?.text ?? '');
  const [quoteAuthor, setQuoteAuthor] = useState<string>(item?.author ?? '');
  const [source, setSource] = useState<string>(item?.source ?? '');
  const [description, setDescription] = useState<string>(item?.description ?? '');
  const [link, setLink] = useState<string>(item?.link ?? '');

  const [bookAuthor, setBookAuthor] = useState<string>(item?.author ?? '');
  const [rating, setRating] = useState<number>(item?.rating ?? 0);

  const [articleAuthor, setArticleAuthor] = useState<string>(item?.author ?? '');
  const [articleDescription, setArticleDescription] = useState<string>(item?.description ?? '');
  const [articleLink, setArticleLink] = useState<string>(item?.link ?? '');

  const [taggedAuthor, setTaggedAuthor] = useState<string>(item?.tagged_author ?? '');

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      let error: any;

      if (type === 'post') {
        ({ error } = await supabase.from('posts').update({
          title,
          content,
          author: postAuthor,
        }).eq('id', item.id));
      } else if (type === 'quote') {
        ({ error } = await supabase.from('quotes').update({
          text,
          author: quoteAuthor || null,
          source: source || null,
          description: description || null,
          link: link || null,
          tagged_author: taggedAuthor || null,
        }).eq('id', item.id));
      } else if (type === 'book') {
        ({ error } = await supabase.from('books').update({
          title,
          author: bookAuthor,
          rating: rating || null,
          link: link || null,
          tagged_author: taggedAuthor || null,
        }).eq('id', item.id));
      } else if (type === 'article') {
        ({ error } = await supabase.from('articles').update({
          title,
          author: articleAuthor || null,
          description: articleDescription || null,
          link: articleLink || null,
          tagged_author: taggedAuthor || null,
        }).eq('id', item.id));
      }

      if (error) throw error;
      toast.success('updated ✿');
      onUpdated();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-normal tracking-wider" style={{ fontFamily: 'var(--font-mono)' }}>
            edit {type}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {type === 'post' && (
            <>
              <Input
                placeholder="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-border bg-transparent"
                style={{ fontFamily: 'var(--font-serif)' }}
              />
              <Select value={postAuthor} onValueChange={setPostAuthor}>
                <SelectTrigger className="border-border" style={{ fontFamily: 'var(--font-body)' }}>
                  <SelectValue placeholder="author" />
                </SelectTrigger>
                <SelectContent>
                  {AUTHOR_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <RichTextEditor content={content} onChange={setContent} placeholder="write…" />
            </>
          )}

          {type === 'quote' && (
            <>
              <Textarea
                placeholder="the quote…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="border-border bg-transparent min-h-[100px]"
                style={{ fontFamily: 'var(--font-serif)' }}
              />
              <Input placeholder="quote author" value={quoteAuthor} onChange={(e) => setQuoteAuthor(e.target.value)} className="border-border bg-transparent" style={{ fontFamily: 'var(--font-body)' }} />
              <Input placeholder="source" value={source} onChange={(e) => setSource(e.target.value)} className="border-border bg-transparent" style={{ fontFamily: 'var(--font-body)' }} />
              <Input placeholder="description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} className="border-border bg-transparent" style={{ fontFamily: 'var(--font-body)' }} />
              <Input placeholder="link (optional)" value={link} onChange={(e) => setLink(e.target.value)} className="border-border bg-transparent" style={{ fontFamily: 'var(--font-mono)' }} />
              <Select value={taggedAuthor} onValueChange={setTaggedAuthor}>
                <SelectTrigger className="border-border" style={{ fontFamily: 'var(--font-body)' }}>
                  <SelectValue placeholder="tagged by…" />
                </SelectTrigger>
                <SelectContent>
                  {AUTHOR_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          {type === 'book' && (
            <>
              <Input placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} className="border-border bg-transparent" style={{ fontFamily: 'var(--font-serif)' }} />
              <Input placeholder="author" value={bookAuthor} onChange={(e) => setBookAuthor(e.target.value)} className="border-border bg-transparent" style={{ fontFamily: 'var(--font-body)' }} />
              <div>
                <p className="text-xs text-muted-foreground mb-2" style={{ fontFamily: 'var(--font-body)' }}>rating</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRating(r === rating ? 0 : r)}
                      className={`text-lg transition-colors ${r <= rating ? 'text-foreground' : 'text-muted-foreground/30'}`}
                    >
                      ✿
                    </button>
                  ))}
                </div>
              </div>
              <Input placeholder="link (optional)" value={link} onChange={(e) => setLink(e.target.value)} className="border-border bg-transparent" style={{ fontFamily: 'var(--font-mono)' }} />
              <Select value={taggedAuthor} onValueChange={setTaggedAuthor}>
                <SelectTrigger className="border-border" style={{ fontFamily: 'var(--font-body)' }}>
                  <SelectValue placeholder="tagged by…" />
                </SelectTrigger>
                <SelectContent>
                  {AUTHOR_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          {type === 'article' && (
            <>
              <Input placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} className="border-border bg-transparent" style={{ fontFamily: 'var(--font-serif)' }} />
              <Input placeholder="article author (optional)" value={articleAuthor} onChange={(e) => setArticleAuthor(e.target.value)} className="border-border bg-transparent" style={{ fontFamily: 'var(--font-body)' }} />
              <Input placeholder="description (optional)" value={articleDescription} onChange={(e) => setArticleDescription(e.target.value)} className="border-border bg-transparent" style={{ fontFamily: 'var(--font-body)' }} />
              <Input placeholder="link (optional)" value={articleLink} onChange={(e) => setArticleLink(e.target.value)} className="border-border bg-transparent" style={{ fontFamily: 'var(--font-mono)' }} />
              <Select value={taggedAuthor} onValueChange={setTaggedAuthor}>
                <SelectTrigger className="border-border" style={{ fontFamily: 'var(--font-body)' }}>
                  <SelectValue placeholder="tagged by…" />
                </SelectTrigger>
                <SelectContent>
                  {AUTHOR_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full"
            style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.1em' }}
          >
            {loading ? 'saving…' : 'save ✿'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
