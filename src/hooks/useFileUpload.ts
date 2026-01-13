import { useState, useCallback } from 'react';
import { uploadFile } from '@/api/files.api';
import { validateFile } from '@/utils/validators';
import { useAuth } from './useAuth';
import { SharedFile } from '@/types';

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export function useFileUpload() {
  const { staff } = useAuth();
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  const upload = useCallback(
    async (
      file: File,
      recipientIds: string[],
      description?: string
    ): Promise<SharedFile | null> => {
      if (!staff) {
        setState(prev => ({ ...prev, error: 'Not authenticated' }));
        return null;
      }

      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        setState(prev => ({ ...prev, error: validation.error || 'Invalid file' }));
        return null;
      }

      setState({ isUploading: true, progress: 0, error: null });

      // Simulate progress
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90),
        }));
      }, 100);

      try {
        const response = await uploadFile(
          file,
          recipientIds,
          staff.id,
          `${staff.firstName} ${staff.lastName}`,
          description
        );

        clearInterval(progressInterval);

        if (response.success && response.data) {
          setState({ isUploading: false, progress: 100, error: null });
          return response.data;
        }

        setState({
          isUploading: false,
          progress: 0,
          error: response.error || 'Upload failed',
        });
        return null;
      } catch (error) {
        clearInterval(progressInterval);
        setState({
          isUploading: false,
          progress: 0,
          error: 'An error occurred during upload',
        });
        return null;
      }
    },
    [staff]
  );

  const resetState = useCallback(() => {
    setState({ isUploading: false, progress: 0, error: null });
  }, []);

  return {
    ...state,
    upload,
    resetState,
  };
}
