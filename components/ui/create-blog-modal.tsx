import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreateBlogModalProps {
  onSuccess?: () => void;
}

const categories = ['Technology', 'Design', 'Business', 'Lifestyle', 'Health'] as const;
type Category = typeof categories[number];

interface FormValues {
  title?: string;
  content?: string;
  category?: Category;
  image?: string;
  metaDescription?: string;
}

interface FormErrors {
  title?: string;
  content?: string;
  category?: string;
  image?: string;
  metaDescription?: string;
}

export const CreateBlogModal = ({ onSuccess }: CreateBlogModalProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormValues>({});
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (data: FormValues): FormErrors => {
    const errors: FormErrors = {};
    
    if (data.title && data.title.length > 100) {
      errors.title = "タイトルは100文字以内で入力してください";
    }
    
    if (data.content && data.content.length > 10000) {
      errors.content = "本文は10000文字以内で入力してください";
    }
    
    if (data.image && !data.image.startsWith('http')) {
      errors.image = "有効なURLを入力してください";
    }
    
    if (data.metaDescription && data.metaDescription.length > 160) {
      errors.metaDescription = "メタ説明は160文字以内で入力してください";
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create blog post');
      }

      setOpen(false);
      setFormData({});
      onSuccess?.();

    } catch (error) {
      console.error('Error creating blog post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (name: keyof FormValues, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white hover:bg-blue-700"
      >
        ブログを作成
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 bg-white p-6 shadow-lg duration-200 sm:rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">ブログ記事の作成</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">タイトル</label>
              <Input
                placeholder="記事のタイトルを入力"
                value={formData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">カテゴリー</label>
              <Select 
                value={formData.category}
                onValueChange={(value) => handleChange('category', value)}
              >
                <SelectTrigger className="bg-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <SelectValue placeholder="カテゴリーを選択" />
                </SelectTrigger>
                <SelectContent 
                  className="bg-white z-[100] shadow-lg border border-gray-200"
                  position="popper"
                  sideOffset={4}
                >
                  {categories.map((category) => (
                    <SelectItem 
                      key={category} 
                      value={category}
                      className="hover:bg-blue-50 cursor-pointer"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">画像URL</label>
              <Input
                placeholder="画像のURLを入力"
                value={formData.image || ''}
                onChange={(e) => handleChange('image', e.target.value)}
                className={errors.image ? 'border-red-500' : ''}
              />
              {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">メタ説明</label>
              <Input
                placeholder="記事の要約を入力"
                value={formData.metaDescription || ''}
                onChange={(e) => handleChange('metaDescription', e.target.value)}
                className={errors.metaDescription ? 'border-red-500' : ''}
              />
              {errors.metaDescription && <p className="mt-1 text-sm text-red-500">{errors.metaDescription}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">本文</label>
              <Textarea 
                placeholder="記事の本文を入力" 
                className={`min-h-[120px] ${errors.content ? 'border-red-500' : ''}`}
                value={formData.content || ''}
                onChange={(e) => handleChange('content', e.target.value)}
              />
              {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
            </div>

            <DialogFooter className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setFormData({});
                  setErrors({});
                }}
                disabled={isLoading}
              >
                キャンセル
              </Button>
              <Button 
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? '作成中...' : '作成する'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};