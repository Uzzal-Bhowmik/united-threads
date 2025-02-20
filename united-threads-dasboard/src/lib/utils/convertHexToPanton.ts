/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-ignore
import * as simpleColorConverter from "simple-color-converter";

export default function generatePantoneColor(hexColor?: string) {
  // Default Pantone Color Object
  let pantoneColorObject = {
    pantone: "Unknown",
    hex: "000000",
  };

  if (hexColor) {
    try {
      // Convert Hex to Pantone
      const pantoneColor = new simpleColorConverter({
        hex6: hexColor,
        to: "pantone",
      });

      // If pantone color conversion is successful
      if (pantoneColor) {
        // Convert Pantone back to Hex for visual consistency
        const pantoneToHex = new simpleColorConverter({
          pantone: `pantone ${pantoneColor?.color}`,
          to: "hex6",
        });

        // Set the Pantone Color Object with Hex and Pantone values
        pantoneColorObject = {
          pantone: pantoneColor?.color || "Unknown",
          hex: pantoneToHex?.color || "000000",
        };
      }
    } catch (error) {
      console.error("Pantone color conversion error:", error);
    }
  }

  // Return Pantone Color Object
  return pantoneColorObject;
}


export const convertPantoneToHex = (pantoneColor?: string) => {
  let hexColor = "000000"; // Default to black if conversion fails

  try {
    // Convert Pantone to Hex
    const pantoneToHex = new simpleColorConverter({
      pantone: `pantone ${pantoneColor}`,
      to: "hex6",
    });

    // Set the hex color if the conversion is successful
    if (pantoneToHex) {
      hexColor = pantoneToHex.color || "000000";
    }
  } catch (error) {
    console.error("Pantone to Hex conversion error:", error);
  }

  return hexColor;
};
