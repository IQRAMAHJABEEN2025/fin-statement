
import html2canvas from "html2canvas";

export const downloadDashboardImage = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Element not found");
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2, 
      useCORS: true,
      backgroundColor: '#f8fafc', // Default to light background
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
         const clonedElement = clonedDoc.getElementById(elementId);
         if (clonedElement) {
           clonedElement.style.height = 'auto';
           clonedElement.style.overflow = 'visible';
           // Ensure background color is set correctly based on current theme logic if needed
           if (document.documentElement.classList.contains('dark')) {
             clonedElement.style.backgroundColor = '#020617';
           }
         }
      }
    });

    const imgData = canvas.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.href = imgData;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (error) {
    console.error("Image Generation failed:", error);
    alert("Failed to generate image. Please try again.");
  }
};

// Generates a highly compressed JPEG Base64 string suitable for Realtime Database
export const generateCompressedBase64 = async (elementId: string): Promise<string | null> => {
  const element = document.getElementById(elementId);
  if (!element) return null;

  try {
    const canvas = await html2canvas(element, {
      scale: 1, // Lower scale to keep size small
      useCORS: true,
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
         const clonedElement = clonedDoc.getElementById(elementId);
         if (clonedElement) {
           clonedElement.style.height = 'auto';
           clonedElement.style.overflow = 'visible';
            // Force appropriate background
           if (document.documentElement.classList.contains('dark')) {
             clonedElement.style.backgroundColor = '#020617';
             clonedElement.classList.add('dark');
           } else {
             clonedElement.style.backgroundColor = '#f8fafc';
           }
         }
      }
    });

    // Convert to JPEG with 0.6 quality (High compression)
    return canvas.toDataURL('image/jpeg', 0.6);
  } catch (error) {
    console.error("Base64 Generation failed:", error);
    return null;
  }
};
