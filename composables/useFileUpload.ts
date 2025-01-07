import { ref } from "vue";
import { storage } from "~/utils/firebase";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export function useFileUpload() {
  const uploading = ref(false);
  const error = ref<string | null>(null);
  const progress = ref(0);

  const uploadFile = async (file: File): Promise<string> => {
    try {
      uploading.value = true;
      error.value = null;
      progress.value = 0;

      const maxSizeMB = 5;
      if (file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`File size exceeds ${maxSizeMB} MB`);
      }

      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed");
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const fileRef = storageRef(storage, `products/${fileName}`);

      const uploadTask = uploadBytesResumable(fileRef, file);

      return new Promise<string>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            progress.value =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (err) => {
            error.value = err.message;
            reject(err);
          },
          async () => {
            const downloadUrl = await getDownloadURL(fileRef);
            progress.value = 100;
            resolve(downloadUrl);
          },
        );
      });
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      uploading.value = false;
    }
  };

  const deleteFile = async (filePath: string): Promise<void> => {
    try {
      const fileRef = storageRef(storage, filePath);
      await deleteObject(fileRef);
      console.log(`Файл ${filePath} успешно удалён.`);
    } catch (e: any) {
      console.error("Ошибка при удалении файла:", e.message);
      throw e;
    }
  };

  return {
    uploading,
    error,
    progress,
    uploadFile,
    deleteFile,
  };
}
