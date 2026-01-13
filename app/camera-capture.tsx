import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  ActivityIndicator,
  Dimensions,
  Animated,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Zap, ZapOff, Camera, Sun, Move, Sparkles, AlertCircle, CheckCircle2, Focus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useMutation } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';

import Colors from '@/constants/colors';
import { analyzeWatch } from '@/services/watch-analysis';
import { moderateScale, moderateFontScale } from '@/utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GUIDE_SIZE = Math.min(SCREEN_WIDTH * 0.7, 280);

export default function CameraCaptureScreen() {
  const { t, i18n } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [isReady, setIsReady] = useState(false);
  const [showDetailedTips, setShowDetailedTips] = useState(true);
  const cameraRef = useRef<CameraView>(null);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.8,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    );

    pulseAnimation.start();
    glowAnimation.start();
    rotateAnimation.start();

    const tipTimer = setTimeout(() => {
      setShowDetailedTips(false);
    }, 8000);

    return () => {
      pulseAnimation.stop();
      glowAnimation.stop();
      rotateAnimation.stop();
      clearTimeout(tipTimer);
    };
  }, [pulseAnim, glowAnim, rotateAnim]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const analysisMutation = useMutation({
    mutationFn: async (uri: string) => {
      console.log('Starting watch analysis for image:', uri);
      const result = await analyzeWatch(uri, i18n.language);
      console.log('Analysis complete:', result);
      return result;
    },
    onSuccess: (data) => {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      router.replace({
        pathname: '/results' as any,
        params: { data: JSON.stringify(data) },
      });
    },
    onError: (error) => {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      console.error('Analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : '';
      
      if (errorMessage.includes('empty') || errorMessage.includes('blurry')) {
        alert(t('camera.errorBlurry'));
      } else if (errorMessage.includes('network') || errorMessage.includes('Network')) {
        alert(t('errors.networkIssue'));
      } else if (errorMessage.includes('timeout') || errorMessage.includes('too long')) {
        alert(t('camera.errorTimeout'));
      } else {
        alert(t('camera.errorNotDetected'));
      }
    },
  });

  const takePicture = async () => {
    if (!cameraRef.current || analysisMutation.isPending) return;

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    try {
      console.log('Taking picture...');
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
      });

      if (photo?.uri) {
        console.log('Photo taken:', photo.uri);
        analysisMutation.mutate(photo.uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      alert(t('errors.imageProcessing'));
    }
  };

  const toggleFlash = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setFlash((prev) => (prev === 'off' ? 'on' : 'off'));
  };

  const handleClose = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <LinearGradient
          colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']}
          style={StyleSheet.absoluteFillObject}
        />
        <SafeAreaView style={styles.permissionContent}>
          <Camera size={moderateScale(64)} color={Colors.gold} strokeWidth={1.5} />
          <Text style={styles.permissionTitle}>{t('camera.permissionRequired')}</Text>
          <Text style={styles.permissionText}>{t('camera.permissionDescription')}</Text>
          <Pressable style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>{t('camera.grantPermission')}</Text>
          </Pressable>
          <Pressable style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webFallback}>
        <LinearGradient
          colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']}
          style={StyleSheet.absoluteFillObject}
        />
        <SafeAreaView style={styles.permissionContent}>
          <Camera size={moderateScale(64)} color={Colors.gold} strokeWidth={1.5} />
          <Text style={styles.permissionTitle}>{t('camera.webNotSupported')}</Text>
          <Text style={styles.permissionText}>{t('camera.useLibrary')}</Text>
          <Pressable style={styles.cancelButton} onPress={handleClose}>
            <Text style={styles.cancelButtonText}>{t('common.back')}</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        flash={flash}
        onCameraReady={() => setIsReady(true)}
      />

      <View style={styles.overlay}>
        <SafeAreaView style={styles.topBar} edges={['top']}>
          <Pressable
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
            onPress={handleClose}
          >
            <X size={moderateScale(24)} color="#FFFFFF" strokeWidth={2} />
          </Pressable>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{t('camera.scanWatch')}</Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
            onPress={toggleFlash}
          >
            {flash === 'on' ? (
              <Zap size={moderateScale(24)} color={Colors.gold} strokeWidth={2} fill={Colors.gold} />
            ) : (
              <ZapOff size={moderateScale(24)} color="#FFFFFF" strokeWidth={2} />
            )}
          </Pressable>
        </SafeAreaView>

        <View style={styles.guideContainer}>
          <View style={styles.instructionBanner}>
            <Focus size={moderateScale(18)} color={Colors.gold} strokeWidth={2} />
            <Text style={styles.instructionBannerText}>{t('camera.fillFrame')}</Text>
          </View>

          <View style={styles.guideWrapper}>
            <Animated.View 
              style={[
                styles.guideCircleOuter,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              <Animated.View style={[styles.glowRing, { opacity: glowAnim }]} />
            </Animated.View>
            
            <View style={styles.guideCircle}>
              <View style={styles.guideInnerCircle} />
              
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />
              
              <Animated.View 
                style={[
                  styles.scanLine,
                  { transform: [{ rotate: rotateInterpolate }] }
                ]}
              />
              
              <View style={styles.watchIconContainer}>
                <Text style={styles.watchEmoji}>⌚</Text>
                <Text style={styles.watchHint}>{t('camera.placeHere')}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionTitle}>{t('camera.centerWatch')}</Text>
            <Text style={styles.instructionText}>{t('camera.makeDialVisible')}</Text>
          </View>
        </View>

        {showDetailedTips && (
          <View style={styles.tipsContainer}>
            <View style={styles.tipsHeader}>
              <CheckCircle2 size={moderateScale(16)} color={Colors.gold} strokeWidth={2} />
              <Text style={styles.tipsHeaderText}>{t('camera.tipsForBest')}</Text>
            </View>
            <View style={styles.tipRow}>
              <Sun size={moderateScale(16)} color={Colors.gold} strokeWidth={2} />
              <Text style={styles.tipText}>{t('camera.tip1Detail')}</Text>
            </View>
            <View style={styles.tipRow}>
              <Move size={moderateScale(16)} color={Colors.gold} strokeWidth={2} />
              <Text style={styles.tipText}>{t('camera.tip2Detail')}</Text>
            </View>
            <View style={styles.tipRow}>
              <Sparkles size={moderateScale(16)} color={Colors.gold} strokeWidth={2} />
              <Text style={styles.tipText}>{t('camera.tip3Detail')}</Text>
            </View>
          </View>
        )}

        {!showDetailedTips && (
          <View style={styles.quickTipContainer}>
            <AlertCircle size={moderateScale(14)} color="rgba(255,255,255,0.7)" strokeWidth={2} />
            <Text style={styles.quickTipText}>{t('camera.quickTip')}</Text>
          </View>
        )}

        <SafeAreaView style={styles.bottomBar} edges={['bottom']}>
          {analysisMutation.isPending ? (
            <View style={styles.analyzingContainer}>
              <ActivityIndicator size="large" color={Colors.gold} />
              <Text style={styles.analyzingText}>{t('watchAnalysis.analyzing')}</Text>
            </View>
          ) : (
            <Pressable
              style={({ pressed }) => [
                styles.captureButton,
                pressed && styles.captureButtonPressed,
                !isReady && styles.captureButtonDisabled,
              ]}
              onPress={takePicture}
              disabled={!isReady}
            >
              <View style={styles.captureButtonInner}>
                <Camera size={moderateScale(28)} color={Colors.background} strokeWidth={2.5} />
              </View>
            </Pressable>
          )}
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  permissionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(32),
    gap: moderateScale(16),
  },
  permissionTitle: {
    fontSize: moderateFontScale(22),
    fontWeight: '700' as const,
    color: Colors.text,
    textAlign: 'center',
    marginTop: moderateScale(16),
  },
  permissionText: {
    fontSize: moderateFontScale(15),
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: moderateFontScale(22),
  },
  permissionButton: {
    backgroundColor: Colors.gold,
    paddingVertical: moderateScale(14),
    paddingHorizontal: moderateScale(32),
    borderRadius: moderateScale(12),
    marginTop: moderateScale(16),
  },
  permissionButtonText: {
    fontSize: moderateFontScale(16),
    fontWeight: '600' as const,
    color: Colors.background,
  },
  cancelButton: {
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(24),
  },
  cancelButtonText: {
    fontSize: moderateFontScale(15),
    color: Colors.textSecondary,
  },
  webFallback: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(8),
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: moderateFontScale(17),
    fontWeight: '600' as const,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  iconButton: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonPressed: {
    opacity: 0.7,
  },
  guideContainer: {
    alignItems: 'center',
    gap: moderateScale(16),
  },
  instructionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(25),
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
  },
  instructionBannerText: {
    fontSize: moderateFontScale(14),
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  guideWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideCircleOuter: {
    position: 'absolute',
    width: GUIDE_SIZE + 20,
    height: GUIDE_SIZE + 20,
    borderRadius: (GUIDE_SIZE + 20) / 2,
    borderWidth: 2,
    borderColor: 'rgba(212,175,55,0.4)',
  },
  glowRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: (GUIDE_SIZE + 20) / 2,
    borderWidth: 4,
    borderColor: Colors.gold,
  },
  guideCircle: {
    width: GUIDE_SIZE,
    height: GUIDE_SIZE,
    borderRadius: GUIDE_SIZE / 2,
    borderWidth: 3,
    borderColor: Colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    overflow: 'hidden',
  },
  guideInnerCircle: {
    width: GUIDE_SIZE * 0.65,
    height: GUIDE_SIZE * 0.65,
    borderRadius: (GUIDE_SIZE * 0.65) / 2,
    borderWidth: 1.5,
    borderColor: 'rgba(212,175,55,0.4)',
    borderStyle: 'dashed' as const,
    position: 'absolute',
  },
  cornerTL: {
    position: 'absolute',
    top: moderateScale(15),
    left: moderateScale(15),
    width: moderateScale(25),
    height: moderateScale(25),
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: Colors.gold,
    borderTopLeftRadius: moderateScale(8),
  },
  cornerTR: {
    position: 'absolute',
    top: moderateScale(15),
    right: moderateScale(15),
    width: moderateScale(25),
    height: moderateScale(25),
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: Colors.gold,
    borderTopRightRadius: moderateScale(8),
  },
  cornerBL: {
    position: 'absolute',
    bottom: moderateScale(15),
    left: moderateScale(15),
    width: moderateScale(25),
    height: moderateScale(25),
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: Colors.gold,
    borderBottomLeftRadius: moderateScale(8),
  },
  cornerBR: {
    position: 'absolute',
    bottom: moderateScale(15),
    right: moderateScale(15),
    width: moderateScale(25),
    height: moderateScale(25),
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: Colors.gold,
    borderBottomRightRadius: moderateScale(8),
  },
  scanLine: {
    position: 'absolute',
    width: 2,
    height: GUIDE_SIZE * 0.4,
    backgroundColor: 'rgba(212,175,55,0.5)',
    top: '50%',
    marginTop: -(GUIDE_SIZE * 0.4) / 2,
  },
  watchIconContainer: {
    alignItems: 'center',
    gap: moderateScale(4),
  },
  watchEmoji: {
    fontSize: moderateFontScale(40),
    opacity: 0.4,
  },
  watchHint: {
    fontSize: moderateFontScale(11),
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500' as const,
  },
  instructionContainer: {
    alignItems: 'center',
    gap: moderateScale(6),
  },
  instructionTitle: {
    fontSize: moderateFontScale(18),
    fontWeight: '700' as const,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  instructionText: {
    fontSize: moderateFontScale(14),
    color: 'rgba(255,255,255,0.85)',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  tipsContainer: {
    marginHorizontal: moderateScale(20),
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
    marginBottom: moderateScale(12),
    paddingBottom: moderateScale(10),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tipsHeaderText: {
    fontSize: moderateFontScale(14),
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: moderateScale(12),
    paddingVertical: moderateScale(6),
  },
  tipText: {
    fontSize: moderateFontScale(13),
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
    lineHeight: moderateFontScale(18),
  },
  quickTipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8),
    marginHorizontal: moderateScale(20),
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(20),
  },
  quickTipText: {
    fontSize: moderateFontScale(12),
    color: 'rgba(255,255,255,0.8)',
  },
  bottomBar: {
    alignItems: 'center',
    paddingBottom: moderateScale(20),
  },
  captureButton: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    backgroundColor: Colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  captureButtonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    backgroundColor: Colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzingContainer: {
    alignItems: 'center',
    gap: moderateScale(12),
  },
  analyzingText: {
    fontSize: moderateFontScale(15),
    fontWeight: '600' as const,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
