export function getOptimizedCloudinaryUrl(url: string | null | undefined, width = 600): string {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com")) return url;
  
  // Replace '/upload/' with optimal width, format and quality filters
  return url.replace("/upload/", `/upload/q_auto,f_auto,w_${width},c_fill/`);
}
