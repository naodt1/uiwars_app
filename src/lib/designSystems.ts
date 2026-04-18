import type { DesignSystem } from "./types";

export const DESIGN_SYSTEMS: DesignSystem[] = [
  {
    name: "Minimal",
    colors: [
      { name: "Primary", value: "#111111" },
      { name: "Secondary", value: "#555555" },
      { name: "Surface", value: "#F5F5F5" },
      { name: "Background", value: "#FFFFFF" },
      { name: "Accent", value: "#0066FF" },
    ],
    typography: {
      fontFamily: "Inter, sans-serif",
      sizes: [
        { label: "Display", value: "48px" },
        { label: "Heading", value: "32px" },
        { label: "Body", value: "16px" },
        { label: "Caption", value: "12px" },
      ],
    },
    borderRadius: "4px",
    spacingUnit: "8px",
  },
  {
    name: "Vibrant",
    colors: [
      { name: "Primary", value: "#FF3366" },
      { name: "Secondary", value: "#6C63FF" },
      { name: "Tertiary", value: "#00D4AA" },
      { name: "Background", value: "#0F0F1A" },
      { name: "Surface", value: "#1A1A2E" },
      { name: "Text", value: "#FFFFFF" },
    ],
    typography: {
      fontFamily: "Space Grotesk, sans-serif",
      sizes: [
        { label: "Display", value: "56px" },
        { label: "Heading", value: "36px" },
        { label: "Body", value: "16px" },
        { label: "Caption", value: "13px" },
      ],
    },
    borderRadius: "12px",
    spacingUnit: "8px",
  },
  {
    name: "Corporate",
    colors: [
      { name: "Primary", value: "#0052CC" },
      { name: "Secondary", value: "#0747A6" },
      { name: "Success", value: "#00875A" },
      { name: "Warning", value: "#FF8B00" },
      { name: "Danger", value: "#DE350B" },
      { name: "Background", value: "#FAFBFC" },
    ],
    typography: {
      fontFamily: "Roboto, sans-serif",
      sizes: [
        { label: "Display", value: "40px" },
        { label: "Heading", value: "28px" },
        { label: "Body", value: "14px" },
        { label: "Caption", value: "11px" },
      ],
    },
    borderRadius: "3px",
    spacingUnit: "4px",
  },
  {
    name: "Retro",
    colors: [
      { name: "Primary", value: "#D4380D" },
      { name: "Secondary", value: "#D48806" },
      { name: "Tertiary", value: "#237804" },
      { name: "Background", value: "#FFF7E6" },
      { name: "Surface", value: "#FFE7BA" },
      { name: "Ink", value: "#261201" },
    ],
    typography: {
      fontFamily: "Georgia, serif",
      sizes: [
        { label: "Display", value: "52px" },
        { label: "Heading", value: "34px" },
        { label: "Body", value: "17px" },
        { label: "Caption", value: "13px" },
      ],
    },
    borderRadius: "0px",
    spacingUnit: "12px",
  },
  {
    name: "Pastel",
    colors: [
      { name: "Primary", value: "#B5838D" },
      { name: "Secondary", value: "#6D6875" },
      { name: "Peach", value: "#E5989B" },
      { name: "Lavender", value: "#C9B1FF" },
      { name: "Mint", value: "#A7D7C5" },
      { name: "Background", value: "#FAF0F2" },
    ],
    typography: {
      fontFamily: "Nunito, sans-serif",
      sizes: [
        { label: "Display", value: "44px" },
        { label: "Heading", value: "30px" },
        { label: "Body", value: "16px" },
        { label: "Caption", value: "12px" },
      ],
    },
    borderRadius: "20px",
    spacingUnit: "8px",
  },
  {
    name: "Neon Dark",
    colors: [
      { name: "Primary", value: "#00FF87" },
      { name: "Secondary", value: "#FF00C8" },
      { name: "Tertiary", value: "#00D4FF" },
      { name: "Warning", value: "#FFE600" },
      { name: "Background", value: "#050510" },
      { name: "Surface", value: "#0D0D1F" },
    ],
    typography: {
      fontFamily: "JetBrains Mono, monospace",
      sizes: [
        { label: "Display", value: "48px" },
        { label: "Heading", value: "32px" },
        { label: "Body", value: "14px" },
        { label: "Caption", value: "11px" },
      ],
    },
    borderRadius: "2px",
    spacingUnit: "8px",
  },
];

export const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
