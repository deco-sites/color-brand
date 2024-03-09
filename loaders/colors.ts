import { FnContext } from "deco/mod.ts";
import colorthief from "npm:colorthief";
import {
  findDissimilarColor,
  isDarkColor,
  RGBColor,
  rgbToHex,
} from "deco-sites/color-brand/sdk/colors.ts";

export interface Props {
  domain: string;
}

export interface ColorInfo {
  domain: string;
  faviconUrl: string;
  colors: {
    primary: {
      hex: string;
      rgb: RGBColor;
      isDark: boolean;
    };
    secondary: {
      hex: string;
      rgb: RGBColor;
      isDark: boolean;
    };
  };
}

export default async function ColorsLoader(
  { domain }: Props,
  _req: Request,
  _ctx: FnContext,
): Promise<ColorInfo> {
  const faviconUrl =
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  try {
    const [primaryColorRGB, paletteRGB] = await Promise.all([
      colorthief.getColor(faviconUrl) as Promise<RGBColor>,
      colorthief.getPalette(faviconUrl) as Promise<RGBColor[]>,
    ]);

    if (!primaryColorRGB || !paletteRGB) {
      throw new Error("Failed to extract colors from image");
    }

    const secondaryColorRGB = findDissimilarColor(primaryColorRGB, paletteRGB);

    return {
      domain,
      faviconUrl,
      colors: {
        primary: {
          hex: rgbToHex(primaryColorRGB),
          rgb: primaryColorRGB,
          isDark: isDarkColor(primaryColorRGB),
        },
        secondary: {
          hex: rgbToHex(secondaryColorRGB),
          rgb: secondaryColorRGB,
          isDark: isDarkColor(secondaryColorRGB),
        },
      },
    };
  } catch (error) {
    console.error("Error in ColorsLoader:", error);
    throw error;
  }
}
