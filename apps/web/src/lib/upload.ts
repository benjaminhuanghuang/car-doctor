import fetchApi from './api';

export async function uploadFileToCloudinary(
  file: File,
  timestamp: number,
  signature: string,
  folder = 'carDoctor',
) {
  // Prepare form data
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  formData.append('folder', folder);

  // Upload to Cloudinary
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    },
  );

  const data = await response.json();
  return data.secure_url; // URL of uploaded image
}

export async function getCloudinarySignature() {
  // Get signature from backend
  const { data } = await fetchApi<{ timestamp: number; signature: string }>(
    '/cloudinary-signature',
    {
      method: 'GET',
    },
  );

  return data; // { timestamp, signature }
}

export function deleteFile(url: string) {
  return fetchApi<{ message: string }>('/delete-file', {
    method: 'DELETE',
    body: JSON.stringify({ cloudinaryUrl: url }),
  });
}
