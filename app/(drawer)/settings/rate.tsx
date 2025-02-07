import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

export default function RateScreen() {
  const router = useRouter();
  const [selectedRating, setSelectedRating] = useState(0);

  const handleBack = () => {
    router.push('/(drawer)/settings');
  };

  const renderStars = () => {
    return Array(5).fill(0).map((_, index) => (
      <TouchableOpacity 
        key={index}
        onPress={() => setSelectedRating(index + 1)}
      >
        <Ionicons 
          name={index < selectedRating ? "star" : "star-outline"} 
          size={34} 
          color="#fff" 
          style={styles.star}
        />
      </TouchableOpacity>
    ));
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
        <Text style={styles.headerTitle}>Rate Fitness One</Text>
      </View>

      <View style={styles.ratingSection}>
        <Text style={styles.ratingTitle}>Tell us about your experience</Text>
        <View style={styles.starsContainer}>
          {renderStars()}
        </View>
        <TouchableOpacity 
          style={[styles.sendButton, selectedRating === 0 && styles.sendButtonDisabled]}
          disabled={selectedRating === 0}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.storeSection}>
        <Text style={styles.storeTitle}>Review our app on the store</Text>
        <Text style={styles.storeSubtitle}>Your review helps others discover our app</Text>
        
        <View style={styles.storeButtons}>
          <TouchableOpacity style={styles.storeButton}>
            <View style={styles.storeBadgeContainer}>
              <Ionicons name="logo-apple" size={24} color="#fff" />
              <Text style={styles.storeBadgeText}>App Store</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.storeButton}>
            <View style={styles.storeBadgeContainer}>
              <Ionicons name="logo-google-playstore" size={24} color="#fff" />
              <Text style={styles.storeBadgeText}>Play Store</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

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
  ratingSection: {
    alignItems: 'center',
    marginTop: 50,
  },
  ratingTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  star: {
    marginHorizontal: 8,
  },
  sendButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    width: '80%',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  storeSection: {
    marginTop: 60,
    paddingHorizontal: 20,
  },
  storeTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  storeSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  storeButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  storeButton: {
    height: 40,
    minWidth: 135,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
  },
  storeBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    gap: 8,
  },
  storeBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
