import { Dimensions, PixelRatio, useWindowDimensions } from 'react-native';
import { useMemo } from 'react';

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const getScreenDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return { width, height };
};

const createScaleFunctions = (screenWidth: number, screenHeight: number) => {
  const widthScale = screenWidth / BASE_WIDTH;
  const heightScale = screenHeight / BASE_HEIGHT;

  const scale = (size: number): number => {
    return Math.round(size * widthScale);
  };

  const verticalScale = (size: number): number => {
    return Math.round(size * heightScale);
  };

  const moderateScale = (size: number, factor: number = 0.5): number => {
    return Math.round(size + (scale(size) - size) * factor);
  };

  const fontScale = (size: number): number => {
    const newSize = size * widthScale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  };

  const moderateFontScale = (size: number, factor: number = 0.4): number => {
    const scaledSize = size + (fontScale(size) - size) * factor;
    const minSize = size * 0.85;
    const maxSize = size * 1.3;
    return Math.round(Math.min(Math.max(scaledSize, minSize), maxSize));
  };

  const wp = (percentage: number): number => {
    return Math.round((percentage / 100) * screenWidth);
  };

  const hp = (percentage: number): number => {
    return Math.round((percentage / 100) * screenHeight);
  };

  return {
    scale,
    verticalScale,
    moderateScale,
    fontScale,
    moderateFontScale,
    wp,
    hp,
    screenWidth,
    screenHeight,
    isSmallDevice: screenWidth < 375,
    isMediumDevice: screenWidth >= 375 && screenWidth < 414,
    isLargeDevice: screenWidth >= 414,
  };
};

const initialDimensions = getScreenDimensions();
const initialFunctions = createScaleFunctions(initialDimensions.width, initialDimensions.height);

export const scale = initialFunctions.scale;
export const verticalScale = initialFunctions.verticalScale;
export const moderateScale = initialFunctions.moderateScale;
export const fontScale = initialFunctions.fontScale;
export const moderateFontScale = initialFunctions.moderateFontScale;
export const wp = initialFunctions.wp;
export const hp = initialFunctions.hp;
export const screenWidth = initialFunctions.screenWidth;
export const screenHeight = initialFunctions.screenHeight;
export const isSmallDevice = initialFunctions.isSmallDevice;
export const isMediumDevice = initialFunctions.isMediumDevice;
export const isLargeDevice = initialFunctions.isLargeDevice;

export const getResponsiveValue = <T>(small: T, medium: T, large: T): T => {
  const { width } = getScreenDimensions();
  if (width < 375) return small;
  if (width >= 375 && width < 414) return medium;
  return large;
};

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  
  return useMemo(() => {
    const fns = createScaleFunctions(width, height);
    return {
      ...fns,
      getResponsiveValue: <T>(small: T, medium: T, large: T): T => {
        if (width < 375) return small;
        if (width >= 375 && width < 414) return medium;
        return large;
      },
    };
  }, [width, height]);
};

export const getTabBarHeight = (): number => {
  const { height } = getScreenDimensions();
  const baseHeight = 60;
  const scaleFactor = height / BASE_HEIGHT;
  const scaledHeight = Math.round(baseHeight * Math.min(Math.max(scaleFactor, 0.85), 1.15));
  return Math.max(56, Math.min(scaledHeight, 72));
};

export const getScaledTabFontSize = (): number => {
  const { width } = getScreenDimensions();
  const baseSize = 11;
  const scaleFactor = width / BASE_WIDTH;
  return Math.round(baseSize * Math.min(Math.max(scaleFactor, 0.9), 1.15));
};
