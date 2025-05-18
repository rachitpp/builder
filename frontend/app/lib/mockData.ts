// Mock templates data for fallback when API fails
export const mockTemplates = [
  {
    _id: "template1",
    name: "Modern Resume",
    description:
      "A clean and modern resume template with a professional design.",
    thumbnailUrl:
      "https://placehold.co/600x400/1a73e8/FFFFFF?text=Modern+Resume",
    category: "professional",
    sections: [
      "personal",
      "experience",
      "education",
      "skills",
      "projects",
      "awards",
    ],
    isPremium: false,
    layout: {
      type: "single-column",
      colors: ["#1a73e8", "#333333", "#ffffff", "#f5f5f5"],
      fonts: ["Roboto", "Open Sans"],
    },
  },
  {
    _id: "template2",
    name: "Creative Portfolio",
    description: "A creative template perfect for designers and artists.",
    thumbnailUrl:
      "https://placehold.co/600x400/ff5722/FFFFFF?text=Creative+Portfolio",
    category: "creative",
    sections: ["personal", "portfolio", "experience", "education", "skills"],
    isPremium: true,
    layout: {
      type: "two-column",
      colors: ["#ff5722", "#212121", "#ffffff", "#eeeeee"],
      fonts: ["Montserrat", "Raleway"],
    },
  },
  {
    _id: "template3",
    name: "Simple Classic",
    description: "A traditional resume template with a timeless design.",
    thumbnailUrl:
      "https://placehold.co/600x400/212121/FFFFFF?text=Simple+Classic",
    category: "traditional",
    sections: ["personal", "experience", "education", "skills", "references"],
    isPremium: false,
    layout: {
      type: "single-column",
      colors: ["#000000", "#555555", "#ffffff", "#f9f9f9"],
      fonts: ["Times New Roman", "Arial"],
    },
  },
  {
    _id: "template4",
    name: "Tech Professional",
    description: "Specially designed for IT professionals and developers.",
    thumbnailUrl:
      "https://placehold.co/600x400/2196f3/FFFFFF?text=Tech+Professional",
    category: "professional",
    sections: [
      "personal",
      "skills",
      "experience",
      "education",
      "projects",
      "certifications",
    ],
    isPremium: false,
    layout: {
      type: "two-column",
      colors: ["#2196f3", "#263238", "#ffffff", "#eceff1"],
      fonts: ["Source Code Pro", "Roboto"],
    },
  },
  {
    _id: "template5",
    name: "Executive",
    description:
      "An elegant resume template for senior professionals and executives.",
    thumbnailUrl: "https://placehold.co/600x400/3f51b5/FFFFFF?text=Executive",
    category: "professional",
    sections: [
      "personal",
      "summary",
      "experience",
      "education",
      "skills",
      "achievements",
    ],
    isPremium: true,
    layout: {
      type: "single-column",
      colors: ["#3f51b5", "#212121", "#ffffff", "#f5f5f5"],
      fonts: ["Playfair Display", "Roboto"],
    },
  },
];
