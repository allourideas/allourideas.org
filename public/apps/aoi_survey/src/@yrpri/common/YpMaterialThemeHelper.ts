
import {
  MaterialDynamicColors,
  argbFromHex,
  hexFromArgb,
  Hct,
  SchemeTonalSpot,
  DynamicColor,
  DynamicScheme,
  SchemeFidelity,
  SchemeVibrant,
  SchemeExpressive,
  SchemeNeutral,
  SchemeMonochrome,
  SchemeContent,
  Scheme as MatScheme,
  TonalPalette,
} from '@material/material-color-utilities';

export type Scheme = 'tonal'|'vibrant'|'expressive'|'content'|'neutral'|'monochrome'|'fidelity'|'dynamic';

function generateMaterialColors(scheme: DynamicScheme): {
  [key: string]: DynamicColor;
} {
  return {
    'highest-surface': MaterialDynamicColors.highestSurface(scheme),
    background: MaterialDynamicColors.background,
    'on-background': MaterialDynamicColors.onBackground,
    surface: MaterialDynamicColors.surface,
    'surface-dim': MaterialDynamicColors.surfaceDim,
    'surface-bright': MaterialDynamicColors.surfaceBright,
    'surface-container-lowest': MaterialDynamicColors.surfaceContainerLowest,
    'surface-container-low': MaterialDynamicColors.surfaceContainerLow,
    'surface-container': MaterialDynamicColors.surfaceContainer,
    'surface-container-high': MaterialDynamicColors.surfaceContainerHigh,
    'surface-container-highest': MaterialDynamicColors.surfaceContainerHighest,
    'on-surface': MaterialDynamicColors.onSurface,
    'surface-variant': MaterialDynamicColors.surfaceVariant,
    'on-surface-variant': MaterialDynamicColors.onSurfaceVariant,
    'inverse-surface': MaterialDynamicColors.inverseSurface,
    'inverse-on-surface': MaterialDynamicColors.inverseOnSurface,
    outline: MaterialDynamicColors.outline,
    'outline-variant': MaterialDynamicColors.outlineVariant,
    shadow: MaterialDynamicColors.shadow,
    scrim: MaterialDynamicColors.scrim,
    'surface-tint': MaterialDynamicColors.surfaceTintColor,
    primary: MaterialDynamicColors.primary,
    'on-primary': MaterialDynamicColors.onPrimary,
    'primary-container': MaterialDynamicColors.primaryContainer,
    'on-primary-container': MaterialDynamicColors.onPrimaryContainer,
    'inverse-primary': MaterialDynamicColors.inversePrimary,
    'inverse-on-primary': MaterialDynamicColors.inverseOnPrimary,
    secondary: MaterialDynamicColors.secondary,
    'on-secondary': MaterialDynamicColors.onSecondary,
    'secondary-container': MaterialDynamicColors.secondaryContainer,
    'on-secondary-container': MaterialDynamicColors.onSecondaryContainer,
    tertiary: MaterialDynamicColors.tertiary,
    'on-tertiary': MaterialDynamicColors.onTertiary,
    'tertiary-container': MaterialDynamicColors.tertiaryContainer,
    'on-tertiary-container': MaterialDynamicColors.onTertiaryContainer,
    error: MaterialDynamicColors.error,
    'on-error': MaterialDynamicColors.onError,
    'error-container': MaterialDynamicColors.errorContainer,
    'on-error-container': MaterialDynamicColors.onErrorContainer,
  };
}

/**
 * Convert a hex value to a hct truple
 */
export function hctFromHex(value: string) {
  const hct = Hct.fromInt(argbFromHex(value));
  return hct;
}

/**
 * Convert a hct truple to a hex value
 */
export function hexFromHct(hue: number, chroma: number, tone: number) {
  const hct = Hct.from(hue, chroma, tone);
  const value = hct.toInt();
  return hexFromArgb(value);
}

export function themeFromSourceColorWithContrast(
    color: string|{primary: string, secondary: string, tertiary: string, neutral: string},
    isDark: boolean,
    scheme: Scheme,
    contrast: number
) {
  if (typeof color !== 'string' && scheme !== 'dynamic' || typeof color !== 'object' && scheme === 'dynamic') {
    throw new Error('color / scheme type mismatch');
  }
  /* import and use other schemas from m-c-u for the scheme you want, but this is the "default"
     https://github.com/material-foundation/material-color-utilities/tree/main/typescript/scheme
   */
  let colorScheme: MatScheme;
  if (scheme === 'tonal') {
    //@ts-ignore
    colorScheme = new SchemeTonalSpot(
      //@ts-ignore
      Hct.fromInt(argbFromHex(color)),
      isDark,
      contrast
    );
  }
  else if (scheme === 'fidelity') {
    //@ts-ignore
    colorScheme = new SchemeFidelity(
      //@ts-ignore
      Hct.fromInt(argbFromHex(color)),
      isDark,
      contrast
    );
  } else if (scheme === 'vibrant') {
    //@ts-ignore
    colorScheme = new SchemeVibrant(
      //@ts-ignore
      Hct.fromInt(argbFromHex(color)),
      isDark,
      contrast
    );
  } else if (scheme === 'expressive') {
    //@ts-ignore
    colorScheme = new SchemeExpressive(
      //@ts-ignore
      Hct.fromInt(argbFromHex(color)),
      isDark,
      contrast
    );
  } else if (scheme === 'content') {
    //@ts-ignore
    colorScheme = new SchemeContent(
      //@ts-ignore
      Hct.fromInt(argbFromHex(color)),
      isDark,
      contrast
    );
  } else if (scheme === 'neutral') {
    //@ts-ignore
    colorScheme = new SchemeNeutral(
      //@ts-ignore
      Hct.fromInt(argbFromHex(color)),
      isDark,
      contrast
    );
  } else if (scheme === 'monochrome') {
    //@ts-ignore
    colorScheme = new SchemeMonochrome(
      //@ts-ignore
      Hct.fromInt(argbFromHex(color)),
      isDark,
      contrast
    );
  } else if (scheme === 'dynamic' && typeof color === 'object') {
    console.log(color);
    const primary = Hct.fromInt(argbFromHex(color.primary));
    const secondary = Hct.fromInt(argbFromHex(color.secondary));
    const tertiary = Hct.fromInt(argbFromHex(color.tertiary));
    const neutral = Hct.fromInt(argbFromHex(color.neutral));
    console.log(color.primary);
    //@ts-ignore
    colorScheme = new DynamicScheme({
      sourceColorArgb: argbFromHex(color.primary),
      variant: 5, // Variant.FIDELITY https://github.com/material-foundation/material-color-utilities/blob/main/typescript/scheme/variant.ts
      contrastLevel: contrast,
      isDark,
      primaryPalette: TonalPalette.fromHueAndChroma(
          primary.hue, primary.chroma),
      secondaryPalette: TonalPalette.fromHueAndChroma(
          secondary.hue, secondary.chroma),
      tertiaryPalette: TonalPalette.fromHueAndChroma(
          tertiary.hue, tertiary.chroma),
      neutralPalette: TonalPalette.fromHueAndChroma(
          neutral.hue, neutral.chroma),
      neutralVariantPalette: TonalPalette.fromHueAndChroma(
          neutral.hue, neutral.chroma / 8.0 + 4.0),
    });
  }

  return themeFromScheme(colorScheme);
}

export function themeFromScheme(colorScheme: MatScheme) {
  //@ts-ignore
  const colors = generateMaterialColors(colorScheme);
  const theme: { [key: string]: string } = {};

  for (const [key, value] of Object.entries(colors)) {
    //@ts-ignore
    theme[key] = hexFromArgb(value.getArgb(colorScheme));
  }

  return theme;
}

export function applyThemeWithContrast(
  doc: DocumentOrShadowRoot,
  theme: {[name: string]: string},
  ssName = 'material-theme'
) {
  let styleString = ':root{';
  for (const [key, value] of Object.entries(theme)) {
    styleString += `--md-sys-color-${key}:${value};`;
  }
  styleString += '}';

  applyThemeString(doc, styleString, ssName);
}

export function applyThemeString(doc: DocumentOrShadowRoot, themeString: string, ssName: string) {
    //@ts-ignore
    let ss = window[ssName] as CSSStyleSheet|undefined;

  if (!ss) {
    ss = new CSSStyleSheet();
    doc.adoptedStyleSheets.push(ss);
    //@ts-ignore
    window[ssName] = ss;
  }

  ss.replace(themeString);
}
