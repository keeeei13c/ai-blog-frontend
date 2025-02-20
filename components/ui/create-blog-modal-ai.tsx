import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface CreateBlogModalProps {
  onSuccess?: () => void;
}

interface FormValues {
  topic?: string;
}

interface FormErrors {
  topic?: string;
}

export const CreateBlogModal = ({ onSuccess }: CreateBlogModalProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormValues>({});
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (data: FormValues): FormErrors => {
    const errors: FormErrors = {};

    if (!data.topic) {
      errors.topic = "Please enter a topic";
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
                value={formData.topic || ''}
                onChange={(e) => handleChange('topic', e.target.value)}
                className={errors.topic ? 'border-red-500' : ''}
              />
              {errors.topic && <p className="mt-1 text-sm text-red-500">{errors.topic}</p>}
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