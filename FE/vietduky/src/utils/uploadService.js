// UploadService.js
export const UploadService = {
    uploadImage: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
  
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
      return data.url; // URL ảnh sau khi upload
    },
  };
  