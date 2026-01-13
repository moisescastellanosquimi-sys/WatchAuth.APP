import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import {
  CheckCircle,
  XCircle,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  ArrowLeft,
  Info,
  ChevronDown,
  TrendingDown,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

import Colors from '@/constants/colors';
import type { WatchAnalysis } from '@/services/watch-analysis';
import { convertCurrency, formatCurrency, type Currency } from '@/constants/currencies';
import { moderateScale, moderateFontScale, wp, hp } from '@/utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_PADDING = moderateScale(16) * 2 + wp(5) * 2 + moderateScale(45);
const CHART_WIDTH = Math.max(SCREEN_WIDTH - CHART_PADDING, moderateScale(200));
const CHART_HEIGHT = moderateScale(100);

const AVAILABLE_CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CNY', 'AUD', 'CAD', 'HKD'];

function generatePriceHistory(currentMin: number, currentMax: number): { month: string; value: number }[] {
  const currentAvg = (currentMin + currentMax) / 2;
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  const history: { month: string; value: number }[] = [];
  
  let baseValue = currentAvg * (0.85 + Math.random() * 0.1);
  
  for (let i = 0; i < months.length; i++) {
    const fluctuation = 1 + (Math.random() - 0.4) * 0.08;
    baseValue = baseValue * fluctuation;
    
    if (i === months.length - 1) {
      baseValue = currentAvg;
    }
    
    history.push({
      month: months[i],
      value: Math.round(baseValue),
    });
  }
  
  return history;
}

export default function ResultsScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const data: WatchAnalysis = JSON.parse(params.data as string);
  
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(data.estimatedValue.currency as Currency || 'USD');
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [priceHistory] = useState(() => generatePriceHistory(data.estimatedValue.min, data.estimatedValue.max));
  
  const chartAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(chartAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [chartAnim]);

  console.log('Results data:', data);

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.back();
  };

  const handleCurrencySelect = (currency: Currency) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedCurrency(currency);
    setShowCurrencyModal(false);
  };

  const convertedMin = convertCurrency(
    data.estimatedValue.min,
    data.estimatedValue.currency as Currency,
    selectedCurrency
  );
  const convertedMax = convertCurrency(
    data.estimatedValue.max,
    data.estimatedValue.currency as Currency,
    selectedCurrency
  );

  const priceChange = priceHistory.length >= 2
    ? ((priceHistory[priceHistory.length - 1].value - priceHistory[0].value) / priceHistory[0].value) * 100
    : 0;
  const isPriceUp = priceChange >= 0;

  const isAuthentic = data.authenticity.isAuthentic;
  const authenticityColor = isAuthentic ? Colors.success : Colors.danger;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <LinearGradient
        colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
          >
            <ArrowLeft size={moderateScale(22)} color={Colors.gold} />
          </Pressable>
          <Text style={styles.headerTitle}>{t('watchAnalysis.results')}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.authenticityCard}>
            <LinearGradient
              colors={
                isAuthentic
                  ? ['#1A2A1A', '#0F1F0F']
                  : ['#2A1A1A', '#1F0F0F']
              }
              style={styles.authenticityGradient}
            >
              <View style={styles.authenticityHeader}>
                {isAuthentic ? (
                  <CheckCircle size={moderateScale(42)} color={Colors.success} strokeWidth={2} />
                ) : (
                  <XCircle size={moderateScale(42)} color={Colors.danger} strokeWidth={2} />
                )}
                <Text style={[styles.authenticityTitle, { color: authenticityColor }]}>
                  {isAuthentic ? t('watchAnalysis.likelyAuthentic') : t('watchAnalysis.potentialReplica')}
                </Text>
              </View>

              <View style={styles.confidenceContainer}>
                <Text style={styles.confidenceLabel}>{t('watchAnalysis.confidenceLevel')}</Text>
                <View style={styles.confidenceBarContainer}>
                  <View
                    style={[
                      styles.confidenceBar,
                      {
                        width: `${data.authenticity.confidence}%`,
                        backgroundColor: authenticityColor,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.confidenceText}>
                  {data.authenticity.confidence}%
                </Text>
              </View>
            </LinearGradient>
          </View>

          <Section title={t('watchAnalysis.watchIdentification')}>
            <InfoRow label={t('watchAnalysis.brand')} value={data.brand} />
            <InfoRow label={t('watchAnalysis.model')} value={data.model} />
            {data.referenceNumber && (
              <InfoRow label={t('watchAnalysis.reference')} value={data.referenceNumber} />
            )}
            <View style={styles.confidenceRow}>
              <Text style={styles.confidenceRowLabel}>{t('watchAnalysis.idConfidence')}</Text>
              <Text style={styles.confidenceRowValue}>
                {data.confidence}%
              </Text>
            </View>
          </Section>

          <Section title={t('watchAnalysis.marketValue')}>
            <View style={styles.valueContainer}>
              {isPriceUp ? (
                <TrendingUp size={moderateScale(24)} color={Colors.success} strokeWidth={2} />
              ) : (
                <TrendingDown size={moderateScale(24)} color={Colors.danger} strokeWidth={2} />
              )}
              <View style={styles.valueTextContainer}>
                <Pressable
                  style={styles.currencySelector}
                  onPress={() => setShowCurrencyModal(true)}
                >
                  <Text style={styles.valueCurrency}>{selectedCurrency}</Text>
                  <ChevronDown size={moderateScale(14)} color={Colors.gold} />
                </Pressable>
                <Text style={styles.valueAmount}>
                  {formatCurrency(convertedMin, selectedCurrency)} - {formatCurrency(convertedMax, selectedCurrency)}
                </Text>
                <View style={styles.priceChangeRow}>
                  <Text style={styles.valueLabel}>{t('watchAnalysis.estimatedRange')}</Text>
                  <Text style={[styles.priceChange, { color: isPriceUp ? Colors.success : Colors.danger }]}>
                    {isPriceUp ? '+' : ''}{priceChange.toFixed(1)}% (6M)
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Price History (6 Months)</Text>
              <PriceChart 
                data={priceHistory} 
                currency={selectedCurrency}
                baseCurrency={data.estimatedValue.currency as Currency}
                animValue={chartAnim}
              />
            </View>
          </Section>

          <Modal
            visible={showCurrencyModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowCurrencyModal(false)}
          >
            <Pressable 
              style={styles.modalOverlay}
              onPress={() => setShowCurrencyModal(false)}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Currency</Text>
                <ScrollView style={styles.currencyScrollList}>
                  {AVAILABLE_CURRENCIES.map((currency) => (
                    <Pressable
                      key={currency}
                      style={[
                        styles.currencyOption,
                        selectedCurrency === currency && styles.currencyOptionSelected,
                      ]}
                      onPress={() => handleCurrencySelect(currency)}
                    >
                      <Text style={[
                        styles.currencyOptionText,
                        selectedCurrency === currency && styles.currencyOptionTextSelected,
                      ]}>
                        {currency}
                      </Text>
                      {selectedCurrency === currency && (
                        <CheckCircle size={moderateScale(18)} color={Colors.gold} />
                      )}
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </Pressable>
          </Modal>

          <Section title={t('watchAnalysis.authenticityAnalysis')}>
            <View style={styles.reasoningContainer}>
              <Info size={moderateScale(18)} color={Colors.textSecondary} />
              <Text style={styles.reasoningText}>
                {data.authenticity.reasoning}
              </Text>
            </View>

            {data.authenticity.authenticityIndicators.length > 0 && (
              <View style={styles.listSection}>
                <View style={styles.listHeader}>
                  <ShieldCheck size={moderateScale(18)} color={Colors.success} strokeWidth={2} />
                  <Text style={styles.listTitle}>{t('watchAnalysis.authenticFeatures')}</Text>
                </View>
                {data.authenticity.authenticityIndicators.map((item, index) => (
                  <BulletPoint key={index} text={item} color={Colors.success} />
                ))}
              </View>
            )}

            {data.authenticity.redFlags.length > 0 && (
              <View style={styles.listSection}>
                <View style={styles.listHeader}>
                  <AlertTriangle size={moderateScale(18)} color={Colors.warning} strokeWidth={2} />
                  <Text style={styles.listTitle}>{t('watchAnalysis.redFlags')}</Text>
                </View>
                {data.authenticity.redFlags.map((item, index) => (
                  <BulletPoint key={index} text={item} color={Colors.warning} />
                ))}
              </View>
            )}
          </Section>

          {(data.details.material ||
            data.details.movement ||
            data.details.yearOfProduction ||
            data.details.condition ||
            data.details.notableFeatures.length > 0) && (
            <Section title={t('watchAnalysis.technicalDetails')}>
              {data.details.material && (
                <InfoRow label={t('watchAnalysis.material')} value={data.details.material} />
              )}
              {data.details.movement && (
                <InfoRow label={t('watchAnalysis.movement')} value={data.details.movement} />
              )}
              {data.details.yearOfProduction && (
                <InfoRow
                  label={t('watchAnalysis.year')}
                  value={data.details.yearOfProduction}
                />
              )}
              {data.details.condition && (
                <InfoRow label={t('watchAnalysis.condition')} value={data.details.condition} />
              )}
              {data.details.notableFeatures.length > 0 && (
                <View style={styles.featuresContainer}>
                  <Text style={styles.featuresLabel}>{t('watchAnalysis.notableFeatures')}</Text>
                  {data.details.notableFeatures.map((feature, index) => (
                    <BulletPoint
                      key={index}
                      text={feature}
                      color={Colors.gold}
                    />
                  ))}
                </View>
              )}
            </Section>
          )}

          {data.notes && (
            <Section title={t('watchAnalysis.additionalNotes')}>
              <Text style={styles.notesText}>{data.notes}</Text>
            </Section>
          )}

          <View style={styles.disclaimerContainer}>
            <Text style={styles.disclaimerText}>
              {t('watchAnalysis.disclaimer')}
            </Text>
          </View>
        </ScrollView>

        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, moderateScale(16)) }]}>
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [
              styles.analyzeButton,
              pressed && styles.analyzeButtonPressed,
            ]}
          >
            <LinearGradient
              colors={[Colors.gold, Colors.goldDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.analyzeButtonGradient}
            >
              <Text style={styles.analyzeButtonText}>{t('watchAnalysis.analyzeAnother')}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function BulletPoint({ text, color }: { text: string; color: string }) {
  return (
    <View style={styles.bulletPoint}>
      <View style={[styles.bullet, { backgroundColor: color }]} />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

function PriceChart({ 
  data, 
  currency, 
  baseCurrency,
  animValue 
}: { 
  data: { month: string; value: number }[]; 
  currency: Currency;
  baseCurrency: Currency;
  animValue: Animated.Value;
}) {
  const [chartWidth, setChartWidth] = useState(CHART_WIDTH);
  
  const convertedData = data.map(item => ({
    ...item,
    value: convertCurrency(item.value, baseCurrency, currency),
  }));
  
  const values = convertedData.map(d => d.value);
  const minValue = Math.min(...values) * 0.95;
  const maxValue = Math.max(...values) * 1.05;
  const range = maxValue - minValue;
  
  const chartInnerPadding = moderateScale(8);
  const usableWidth = chartWidth - chartInnerPadding * 2;
  const usableHeight = CHART_HEIGHT - chartInnerPadding * 2;
  
  const getY = (value: number) => {
    return chartInnerPadding + usableHeight - ((value - minValue) / range) * usableHeight;
  };
  
  const pointSpacing = usableWidth / (data.length - 1);
  
  const formatShortCurrency = (value: number, curr: Currency) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return formatCurrency(value, curr);
  };
  
  return (
    <View style={styles.chartWrapper}>
      <View 
        style={styles.chart}
        onLayout={(e) => setChartWidth(e.nativeEvent.layout.width)}
      >
        <View style={styles.chartLine}>
          {convertedData.map((item, index) => {
            const x = chartInnerPadding + index * pointSpacing;
            const y = getY(item.value);
            
            return (
              <Animated.View
                key={index}
                style={[
                  styles.chartPoint,
                  {
                    left: x - moderateScale(3),
                    top: animValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [CHART_HEIGHT / 2, y],
                    }),
                    opacity: animValue,
                  },
                ]}
              />
            );
          })}
          
          {convertedData.slice(0, -1).map((item, index) => {
            const x1 = chartInnerPadding + index * pointSpacing;
            const y1 = getY(item.value);
            const x2 = chartInnerPadding + (index + 1) * pointSpacing;
            const y2 = getY(convertedData[index + 1].value);
            
            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
            
            return (
              <Animated.View
                key={`line-${index}`}
                style={[
                  styles.chartLineSegment,
                  {
                    width: animValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, length],
                    }),
                    left: x1,
                    top: y1,
                    transform: [{ rotate: `${angle}deg` }],
                    transformOrigin: 'left center',
                  },
                ]}
              />
            );
          })}
        </View>
      </View>
      
      <View style={styles.chartLabels}>
        {data.map((item, index) => (
          <Text key={index} style={styles.chartLabel}>{item.month}</Text>
        ))}
      </View>
      
      <View style={styles.chartValueLabels}>
        <Text style={styles.chartValueLabel}>
          {formatShortCurrency(Math.round(maxValue), currency)}
        </Text>
        <Text style={styles.chartValueLabel}>
          {formatShortCurrency(Math.round(minValue), currency)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingVertical: moderateScale(10),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(18),
  },
  backButtonPressed: {
    opacity: 0.5,
  },
  headerTitle: {
    fontSize: moderateFontScale(16),
    fontWeight: '600' as const,
    color: Colors.text,
  },
  headerSpacer: {
    width: moderateScale(36),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: wp(5),
    paddingBottom: hp(12),
  },
  authenticityCard: {
    borderRadius: moderateScale(18),
    overflow: 'hidden',
    marginBottom: moderateScale(20),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  authenticityGradient: {
    padding: moderateScale(20),
  },
  authenticityHeader: {
    alignItems: 'center',
    marginBottom: moderateScale(20),
  },
  authenticityTitle: {
    fontSize: moderateFontScale(24),
    fontWeight: '700' as const,
    marginTop: moderateScale(14),
    textAlign: 'center',
  },
  confidenceContainer: {
    gap: moderateScale(6),
  },
  confidenceLabel: {
    fontSize: moderateFontScale(12),
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  confidenceBarContainer: {
    height: moderateScale(7),
    backgroundColor: Colors.surfaceLight,
    borderRadius: moderateScale(3.5),
    overflow: 'hidden',
  },
  confidenceBar: {
    height: '100%',
    borderRadius: moderateScale(3.5),
  },
  confidenceText: {
    fontSize: moderateFontScale(14),
    fontWeight: '600' as const,
    color: Colors.text,
    textAlign: 'center',
  },
  section: {
    marginBottom: moderateScale(20),
  },
  sectionTitle: {
    fontSize: moderateFontScale(18),
    fontWeight: '700' as const,
    color: Colors.gold,
    marginBottom: moderateScale(12),
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: Colors.surface,
    borderRadius: moderateScale(14),
    padding: moderateScale(16),
    gap: moderateScale(12),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: moderateFontScale(13),
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: moderateFontScale(13),
    fontWeight: '600' as const,
    color: Colors.text,
    flex: 1,
    textAlign: 'right',
  },
  confidenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: moderateScale(6),
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  confidenceRowLabel: {
    fontSize: moderateFontScale(13),
    color: Colors.textSecondary,
  },
  confidenceRowValue: {
    fontSize: moderateFontScale(13),
    fontWeight: '700' as const,
    color: Colors.gold,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(12),
  },
  valueTextContainer: {
    flex: 1,
  },
  valueCurrency: {
    fontSize: moderateFontScale(10),
    color: Colors.textTertiary,
    marginBottom: moderateScale(2),
  },
  valueAmount: {
    fontSize: moderateFontScale(20),
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: moderateScale(2),
  },
  valueLabel: {
    fontSize: moderateFontScale(11),
    color: Colors.textSecondary,
  },
  reasoningContainer: {
    flexDirection: 'row',
    gap: moderateScale(10),
    alignItems: 'flex-start',
  },
  reasoningText: {
    flex: 1,
    fontSize: moderateFontScale(13),
    color: Colors.textSecondary,
    lineHeight: moderateFontScale(20),
  },
  listSection: {
    gap: moderateScale(10),
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
  },
  listTitle: {
    fontSize: moderateFontScale(14),
    fontWeight: '600' as const,
    color: Colors.text,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: moderateScale(10),
  },
  bullet: {
    width: moderateScale(5),
    height: moderateScale(5),
    borderRadius: moderateScale(2.5),
    marginTop: moderateScale(6),
  },
  bulletText: {
    flex: 1,
    fontSize: moderateFontScale(12),
    color: Colors.textSecondary,
    lineHeight: moderateFontScale(18),
  },
  featuresContainer: {
    gap: moderateScale(10),
  },
  featuresLabel: {
    fontSize: moderateFontScale(13),
    fontWeight: '600' as const,
    color: Colors.text,
  },
  notesText: {
    fontSize: moderateFontScale(13),
    color: Colors.textSecondary,
    lineHeight: moderateFontScale(20),
  },
  disclaimerContainer: {
    backgroundColor: Colors.surface,
    borderRadius: moderateScale(10),
    padding: moderateScale(14),
    marginTop: moderateScale(6),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  disclaimerText: {
    fontSize: moderateFontScale(10),
    color: Colors.textTertiary,
    lineHeight: moderateFontScale(16),
    textAlign: 'center',
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(4),
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(6),
    alignSelf: 'flex-start',
    marginBottom: moderateScale(4),
  },
  priceChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceChange: {
    fontSize: moderateFontScale(12),
    fontWeight: '600' as const,
  },
  chartContainer: {
    marginTop: moderateScale(16),
    paddingTop: moderateScale(16),
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  chartTitle: {
    fontSize: moderateFontScale(13),
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: moderateScale(12),
  },
  chartWrapper: {
    position: 'relative',
    paddingLeft: moderateScale(40),
  },
  chart: {
    height: CHART_HEIGHT,
    width: '100%',
    maxWidth: CHART_WIDTH,
    backgroundColor: Colors.surfaceLight,
    borderRadius: moderateScale(8),
    overflow: 'hidden',
  },
  chartLine: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  chartPoint: {
    position: 'absolute',
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: Colors.gold,
    borderWidth: 1.5,
    borderColor: Colors.background,
  },
  chartLineSegment: {
    position: 'absolute',
    height: 2,
    backgroundColor: Colors.gold,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScale(8),
    paddingRight: moderateScale(4),
  },
  chartLabel: {
    fontSize: moderateFontScale(9),
    color: Colors.textTertiary,
    textAlign: 'center',
    minWidth: moderateScale(24),
  },
  chartValueLabels: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: CHART_HEIGHT,
    width: moderateScale(38),
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: moderateScale(4),
  },
  chartValueLabel: {
    fontSize: moderateFontScale(8),
    color: Colors.textTertiary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: moderateFontScale(18),
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: moderateScale(16),
    textAlign: 'center',
  },
  currencyScrollList: {
    maxHeight: moderateScale(300),
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: moderateScale(14),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(6),
    backgroundColor: Colors.surfaceLight,
  },
  currencyOptionSelected: {
    backgroundColor: 'rgba(212,175,55,0.15)',
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  currencyOptionText: {
    fontSize: moderateFontScale(16),
    color: Colors.text,
    fontWeight: '500' as const,
  },
  currencyOptionTextSelected: {
    color: Colors.gold,
    fontWeight: '700' as const,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: wp(5),
    paddingTop: moderateScale(16),
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  analyzeButton: {
    borderRadius: moderateScale(14),
    overflow: 'hidden',
    elevation: 8,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  analyzeButtonGradient: {
    paddingVertical: moderateScale(16),
    alignItems: 'center',
  },
  analyzeButtonText: {
    fontSize: moderateFontScale(15),
    fontWeight: '700' as const,
    color: Colors.background,
    letterSpacing: 0.5,
  },
  analyzeButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});
