import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const Subscription = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('yearly'); // 'yearly' or 'monthly'

  const handleBack = () => {
    router.push('/(drawer)/settings');
  };

  return (
    <LinearGradient
      colors={['#000000', '#004d00', '#003300']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <BlurView intensity={20} tint="light" style={styles.blurContainer}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </BlurView>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Subscription</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Intro Start */}
        <View style={styles.introSection}>
          <Text style={styles.introTitle}>One Goal. Achieve Faster.</Text>
          <Text style={styles.introSubtitle}>
            Experience personalised training, AI-driven nutrition, and distraction-free progress - all designed to accelerate your fitness goals.
          </Text>
        </View>
        {/* Intro End */}

        {/* Current Subscription Start */}
        <View style={styles.currentSubCard}>
          <Text style={styles.currentSubCardHeader}>Your Current Subscription</Text>
          <View style={styles.currentSubCardText}>
            <Text style={styles.currentSubTitle}>Free Subscription</Text>
            <Text style={styles.currentSubDesc}>Everyone starts with a free subscription</Text>
          </View>
        </View>
        {/* Current Subscription End */}

        {/* Subscription Outline Start */}
        <View style={styles.subOutlineSection}>
          <View style={styles.outlineItem}>
            <MaterialCommunityIcons name="crown" size={24} color="#FFD700" />

            <View style={styles.outlineText}>
              <Text style={styles.outlineTitle}>AI-Powered Training</Text>
              <Text style={styles.outlineDesc}>Get personalised workout plans, meal guidance, and intelligent insights tailored by Fitness One AI.</Text>
            </View>
          </View>

          <View style={styles.outlineItem}>
            <MaterialCommunityIcons name="crown" size={24} color="#FFD700" />
            <View style={styles.outlineText}>
              <Text style={styles.outlineTitle}>Smart Macro Tracking:</Text>
              <Text style={styles.outlineDesc}>Use the full power of our AI to guide you through your macros.</Text>
            </View>
          </View>

          <View style={styles.outlineItem}>
            <MaterialCommunityIcons name="crown" size={24} color="#FFD700" />
            <View style={styles.outlineText}>
              <Text style={styles.outlineTitle}>Zero Ads:</Text>
              <Text style={styles.outlineDesc}>Stay fitness focused with zero distractions.</Text>
            </View>
          </View>
        </View>
        {/* Subscription Outline End */}

        {/* Plan Selection Start */}
        <View style={styles.planSelection}>
          <Text style={styles.planTitle}>Select a plan for your free trial.</Text>

          <View style={styles.planCardsRow}>
            <TouchableOpacity
              style={[
                styles.planCard,
                styles.planCardFlex,
                selectedPlan === 'yearly' && styles.selectedPlan
              ]}
              onPress={() => setSelectedPlan('yearly')}
            >
              <View style={styles.savingsBadgeContainer}>
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsText}>34% OFF</Text>
                </View>
              </View>
              <View style={styles.planHeader}>
                <Text style={styles.planName}>YEARLY</Text>
                <View style={styles.radioContainer}>
                  {selectedPlan === 'yearly' ? (
                    <Ionicons name="radio-button-on" size={24} color="#0c6329" />
                  ) : (
                    <Ionicons name="radio-button-off" size={24} color="#666" />
                  )}
                </View>
              </View>
              <Text style={styles.planPrice}>£26.29/YR</Text>
              <Text style={styles.planOriginalPrice}>£39.99/y</Text>
              <Text style={styles.planBilling}>Billed yearly after free trial.</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.planCard,
                styles.planCardFlex,
                selectedPlan === 'monthly' && styles.selectedPlan
              ]}
              onPress={() => setSelectedPlan('monthly')}
            >
              <View style={styles.planHeader}>
                <Text style={styles.planName}>MONTHLY</Text>
                <View style={styles.radioContainer}>
                  {selectedPlan === 'monthly' ? (
                    <Ionicons name="radio-button-on" size={24} color="#0c6329" />
                  ) : (
                    <Ionicons name="radio-button-off" size={24} color="#666" />
                  )}
                </View>
              </View>
              <Text style={styles.planPrice}>£3.99/m</Text>
              <Text style={styles.planBilling}>Billed monthly after free trial.</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Plan Selection End */}

        {/* Info Start */}
        <View style={styles.infoSection}>
          <Text style={styles.infoBilling}>Billing starts at the end of your free trial unless you cancel. Plans renew automatically. Cancel via the App Store.</Text>

          <View style={styles.docLinks}>
            <TouchableOpacity>
              <Text style={styles.docLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.docLink}>Terms & Conditions</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.support}>
            <Text style={styles.supportText}>- If you face any issues -</Text>
            <TouchableOpacity onPress={() => Linking.openURL('mailto:corporate@fitnessoneltd.com')}>
              <Text style={styles.supportLink}>
                Contact us at:
                <Text style={styles.emailLink}>
                  support@fitnessoneltd.com
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Info End */}
      </ScrollView>

      <View style={styles.buttonBackground}>
        <TouchableOpacity style={styles.trialButton}>
          <Text style={styles.trialButtonText}>Start 2-Week Free Trial</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  blurContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    paddingVertical: 8,
    paddingRight: 10,
    paddingLeft: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },

  // Intro Start
  introSection: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 10,
  },
  introTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  introSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 22,
  },
  // Intro End

  // Current Subscription Start
  currentSubCard: {
    paddingTop: 8,
    paddingBottom: 16,
    backdropFilter: 'blur(4px)',

  },
  currentSubCardHeader: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 1)',
    marginLeft: 24,
    marginBottom: 12,
  },
  currentSubCardText: {
    backgroundColor: 'rgba(102, 102, 102, 0.4)',
    boxShadow: '0 0 14px rgba(0, 0, 0, 0.5)',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  currentSubTitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.75)',
    fontWeight: '600',
    marginBottom: 4,
  },
  currentSubDesc: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  // Current Subscription End

  // Subscription Outline Start
  subOutlineSection: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 8,
  },
  outlineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  outlineText: {
    flex: 1,
  },
  outlineTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  outlineDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  // Subscription Outline End

  // Plan Selection Start
  planSelection: {
    paddingHorizontal: 24,
  },
  planTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 4,
    fontWeight: '600',
  },
  planCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  planCard: {
    backgroundColor: 'rgba(102, 102, 102, 0.4)',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: 20,
  },
  planCardFlex: {
    flex: 1,
    minHeight: 160,
  },
  selectedPlan: {
    borderColor: '#fff',
    borderWidth: 2,
  },
  savingsBadgeContainer: {
    position: 'absolute',
    top: -15,
    left: 16,
    zIndex: 1,
  },
  savingsBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  savingsText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  radioContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
  },
  planPrice: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planOriginalPrice: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  planBilling: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  // Plan Selection End

  // Info Start
  infoSection: {
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  infoBilling: {
    fontSize: 12,
    fontWeight: 600,
    width: '90%',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 10,
    lineHeight: 16,
    textAlign: 'center',
  },
  docLinks: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  docLink: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  support: {
    alignItems: 'center',
    marginBottom: 100,
  },
  supportText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },

  supportLink: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  emailLink: {
    color: '#0c6329',
    fontWeight: 'bold',
    paddingLeft: 5,
  },
  // Info End

  // Start Trial Button Start
  buttonBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    marginHorizontal: 40,
    marginBottom: 22,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  trialButton: {
    backgroundColor: '#0c6329',
    width: '98%',
    alignSelf: 'center',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  trialButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  // Start Trial Button End
});

export default Subscription;
