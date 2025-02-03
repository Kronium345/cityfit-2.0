import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Subscription = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('yearly'); // 'yearly' or 'monthly'

  const handleBack = () => {
    router.push('/(drawer)/settings');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Subscription</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Train Smarter. Achieve Faster.</Text>
          <Text style={styles.heroSubtitle}>
          Experience personalised training, AI-driven nutrition, and distraction-free progress - all designed to accelerate your fitness goals.
          </Text>
        </View>

        {/* Current Subscription Section */}
        <View style={styles.currentSubscriptionSection}>
          <Text style={styles.sectionTitle}>Your Current Subscription</Text>
          <View style={styles.subscriptionCard}>
            <Text style={styles.freeTitle}>Free Subscription</Text>
            <Text style={styles.freeDescription}>Everyone starts with a free subscription</Text>
          </View>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <View style={styles.benefitItem}>
            <Ionicons name="crown" size={24} color="#FFD700" />
            <View style={styles.benefitText}>
              <Text style={styles.benefitTitle}>AI-Powered Training</Text>
              <Text style={styles.benefitDescription}>Get personalised workout plans, meal guidance, and intelligent insights tailored by Fitness One AI.</Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Ionicons name="crown" size={24} color="#FFD700" />
            <View style={styles.benefitText}>
              <Text style={styles.benefitTitle}>Smart Macro Tracking:</Text>
              <Text style={styles.benefitDescription}>Use the full power of our AI to guide you through your macros.</Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Ionicons name="crown" size={24} color="#FFD700" />
            <View style={styles.benefitText}>
              <Text style={styles.benefitTitle}>Zero Ads:</Text>
              <Text style={styles.benefitDescription}>Stay fitness focused with zero distractions.</Text>
            </View>
          </View>
        </View>

        {/* Plan Selection Section */}
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
                  <Text style={styles.savingsText}>66% SAVINGS</Text>
                </View>
              </View>
              <View style={styles.planHeader}>
                <Text style={styles.planName}>YEARLY</Text>
                <View style={styles.radioContainer}>
                  {selectedPlan === 'yearly' ? (
                    <Ionicons name="radio-button-on" size={24} color="#007AFF" />
                  ) : (
                    <Ionicons name="radio-button-off" size={24} color="#666" />
                  )}
                </View>
              </View>
              <Text style={styles.planPrice}>£64.99/YR</Text>
              <Text style={styles.planOriginalPrice}>£191.88/YR</Text>
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
                    <Ionicons name="radio-button-on" size={24} color="#007AFF" />
                  ) : (
                    <Ionicons name="radio-button-off" size={24} color="#666" />
                  )}
                </View>
              </View>
              <Text style={styles.planPrice}>£15.99/MO</Text>
              <Text style={styles.planBilling}>Billed monthly after free trial.</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>Billing starts at the end of your free trial unless you cancel. Plans renew automatically. Cancel via the App Store.</Text>
          
          <View style={styles.links}>
            <TouchableOpacity>
              <Text style={styles.link}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.link}>Terms & Conditions</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.support}>
            <Text style={styles.supportText}>Having issues with your subscription?</Text>
            <TouchableOpacity>
              <Text style={styles.supportLink}>Contact us at hello@hevyapp.com</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Original Subscription Cards */}
        <Text style={styles.sectionTitle}>Additional Options</Text>
        <TouchableOpacity style={styles.subscriptionCard}>
          <View style={styles.subscriptionHeader}>
            <View style={styles.planNameContainer}>
              <Text style={styles.proText}>PRO</Text>
              <Text style={styles.planType}>Monthly</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>£2.99</Text>
              <Text style={styles.billingPeriod}>Billed Monthly</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.subscriptionCard}>
          <View style={styles.subscriptionHeader}>
            <View style={styles.planNameContainer}>
              <Text style={styles.proText}>PRO</Text>
              <Text style={styles.planType}>Yearly</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>£23.49</Text>
              <Text style={styles.billingPeriod}>Billed Annually</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.subscriptionCard}>
          <View style={styles.subscriptionHeader}>
            <View style={styles.planNameContainer}>
              <Text style={styles.proText}>PRO</Text>
              <Text style={styles.planType}>Lifetime</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>£74.99</Text>
              <Text style={styles.billingPeriod}>Pay Once</Text>
            </View>
          </View>
        </TouchableOpacity>

        

        <View style={styles.bottomPadding} />
      </ScrollView>

      <TouchableOpacity style={styles.trialButton}>
        <Text style={styles.trialButtonText}>Start 2-Week Free Trial</Text>
      </TouchableOpacity>

      <Text style={styles.finePrint}>
        Billing starts at the end of your free trial unless you cancel. Plans renew automatically. Cancel via the App Store.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#666',
    marginLeft: 24,
    marginBottom: 12,
  },
  subscriptionCard: {
    backgroundColor: '#1c1c1c',
    marginHorizontal: 24,
    borderRadius: 12,
    padding: 16,
  },
  freeTitle: {
    fontSize: 18,
    color: '#007AFF',
    marginBottom: 4,
  },
  freeDescription: {
    fontSize: 16,
    color: '#666',
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  proText: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  planType: {
    fontSize: 18,
    color: '#007AFF',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  billingPeriod: {
    fontSize: 14,
    color: '#666',
  },
  infoSection: {
    padding: 24,
    marginTop: 16,
    backgroundColor: '#121212',
  },
  infoTitle: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  links: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  link: {
    fontSize: 14,
    color: '#007AFF',
  },
  support: {
    alignItems: 'center',
  },
  supportText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  supportLink: {
    fontSize: 14,
    color: '#007AFF',
  },
  bottomPadding: {
    height: 100,
  },
  heroSection: {
    padding: 24,
    paddingTop: 16,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  currentSubscriptionSection: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  planSelection: {
    padding: 24,
    paddingTop: 8,
    backgroundColor: '#121212',
  },
  planTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 16,
    fontWeight: '600',
  },
  planCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  planCard: {
    backgroundColor: '#1c1c1c',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2c2c2c',
    marginTop: 20,
  },
  selectedPlan: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  savingsBadgeContainer: {
    position: 'absolute',
    top: -15,
    left: 16,
    zIndex: 1,
  },
  savingsBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  savingsText: {
    color: '#fff',
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
  planPrice: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planOriginalPrice: {
    fontSize: 16,
    color: '#666',
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  planBilling: {
    fontSize: 14,
    color: '#666',
  },
  trialButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#007AFF',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  trialButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  benefitsSection: {
    padding: 24,
    paddingTop: 8,
    backgroundColor: '#121212',
  },
  planCardFlex: {
    flex: 1,
    minHeight: 160, // Ensure consistent height
  },
  radioContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finePrint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginHorizontal: 24,
    lineHeight: 18,
  },
});

export default Subscription;
