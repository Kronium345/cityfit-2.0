import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  withTiming,
  withRepeat,
  useAnimatedStyle,
  useSharedValue,
  withSequence
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

// Blob Blurred Background Start
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const BlobBackground = () => {
  const blob1Animation = useSharedValue(0);
  const blob2Animation = useSharedValue(0);
  const blob3Animation = useSharedValue(0);

  useEffect(() => {
    const animate = (value, duration) => {
      'worklet';
      value.value = withRepeat(
        withTiming(1, { duration }),
        -1,
        true
      );
    };

    animate(blob1Animation, 15000);
    animate(blob2Animation, 25000);
    animate(blob3Animation, 20000);
  }, []);

  const createBlobStyle = (animation) => {
    const animatedStyles = useAnimatedStyle(() => ({
      transform: [
        { scale: 1 + animation.value * 0.2 },
        { rotate: `${animation.value * 360}deg` },
      ],
      opacity: 0.7 + animation.value * 0.2,
    }));

    return animatedStyles;
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.backgroundContainer}>
        <AnimatedSvg style={[styles.blob, createBlobStyle(blob1Animation)]}>
          <Circle r={100} cx={100} cy={100} fill="rgba(7, 94, 7, 0.4)" />
        </AnimatedSvg>
        <AnimatedSvg style={[styles.blob, styles.blob2, createBlobStyle(blob2Animation)]}>
          <Circle r={110} cx={110} cy={110} fill="rgba(6, 214, 37, 0.15)" />
        </AnimatedSvg>
        <AnimatedSvg style={[styles.blob, styles.blob3, createBlobStyle(blob3Animation)]}>
          <Circle r={90} cx={90} cy={90} fill="rgba(0, 0, 0, 0.4)" />
        </AnimatedSvg>
      </View>
      <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
    </View>
  );
};
// Blob Blurred Background End


const Settings = () => {
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState('automatic');

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
    // Here you can add logic to actually change the theme
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const renderSettingItem = (icon, title, route, isPro = false) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={() => router.push(route)}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color="#fff" style={styles.icon} />
        <Text style={styles.settingText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="rgba(255, 255, 255, 1)" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <BlobBackground />
      {/* Header Start */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push('/(drawer)/(tabs)/profileScreen')}
          style={styles.backButton}
        >
          <BlurView intensity={20} tint="light" style={styles.blurContainer}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </BlurView>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      {/* Header End */}

      {/* New Premium Promo Cell */}
      <BlurView intensity={20} tint="dark" style={styles.premiumPromoContainer}>
        <View style={styles.premiumPromoContent}>
          <View style={styles.premiumPromoTextContainer}>
            <Text style={styles.premiumPromoTitle}>Get the all in one experience</Text>
            <Text style={styles.premiumPromoSubtitle}>For less than a cup of coffee</Text>
          </View>
          <TouchableOpacity
            style={styles.tryPremiumButton}
            onPress={() => router.push('/(drawer)/settings/subscription')}
          >
            <Text style={styles.tryPremiumText}>Try Premium</Text>
          </TouchableOpacity>
        </View>
      </BlurView>

      <ScrollView style={styles.scrollView}>
        {/* Account Settings Tab Start*/}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          {renderSettingItem('person-outline', 'Profile', '/(drawer)/settings/profile')}
          {renderSettingItem('lock-closed-outline', 'Account', '/(drawer)/settings/account')}
          {renderSettingItem('card-outline', 'Manage Subscription', '/settings/subscription')}
          {renderSettingItem('notifications-outline', 'Notifications', '/(drawer)/settings/notifications')}
          {renderSettingItem('share-social-outline', 'Account Integrations', '/(drawer)/settings/integrations')}
        </View>
        {/* Account Settings Tab End*/}

        {/* Appearance Selection Start*/}
        <View style={[styles.section, { marginBottom: 20 }]}>
          <Text style={[styles.sectionTitle, { border: 'none', paddingBottom: 0 }]}>Appearance</Text>
          <View style={styles.appearanceContainer}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                selectedTheme === 'automatic' && styles.themeButtonActive
              ]}
              onPress={() => handleThemeSelect('automatic')}
            >
              <Text style={styles.themeButtonText}>Automatic</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                selectedTheme === 'light' && styles.themeButtonActive
              ]}
              onPress={() => handleThemeSelect('light')}
            >
              <Text style={styles.themeButtonText}>Light</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                selectedTheme === 'dark' && styles.themeButtonActive
              ]}
              onPress={() => handleThemeSelect('dark')}
            >
              <Text style={styles.themeButtonText}>Dark</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Appearance Selection End*/}


        {/* Information Tab Start*/}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information</Text>
          {renderSettingItem('star-outline', 'Rate Fitness One', '/(drawer)/settings/rate')}
          {renderSettingItem('barbell-outline', 'Workouts', '/workouts')}
          {renderSettingItem('shield-outline', 'Privacy & Social', '/privacy')}
          {renderSettingItem('options-outline', 'Units', '/units')}
          {renderSettingItem('language-outline', 'Language', '/language')}
          {renderSettingItem('heart-outline', 'Health', '/health')}
        </View>
        {/* Information Tab End*/}


        {/* Social Links Start */}
        <View style={styles.socialSection}>
          <View style={styles.socialIconsContainer}>
            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() => Linking.openURL('https://fitnessoneltd.com')}
            >
              <Ionicons name="globe-outline" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() => Linking.openURL('https://chat.whatsapp.com/CQhtTVwImtp2XRyoJFTg1v')}
            >
              <Ionicons name="logo-whatsapp" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() => Linking.openURL('https://instagram.com/fitnessoneltd')}
            >
              <Ionicons name="logo-instagram" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() => Linking.openURL('https://linkedin.com/company/fitness-one/')}
            >
              <Ionicons name="logo-linkedin" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Social Links End */}


        {/* Logout Button Start */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
        {/* Logout Button End */}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 26, 0, 1)',
  },
  // Blob Blurred Background Start
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    width: 200,
    height: 200,
    left: '10%',
    top: '20%',
  },
  blob2: {
    left: '60%',
    top: '45%',
  },
  blob3: {
    left: '30%',
    top: '70%',
  },
  // Blob Blurred Background End

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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textShadow: 'rgba(0, 0, 0, 0.8)',
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },

  // Premium Promo Box Start
  premiumPromoContainer: {
    backgroundColor: 'rgba(102, 102, 102, 0.4)',
    backdropFilter: 'blur(4px)',
    boxShadow: '0 0 14px rgba(0, 0, 0, 0.5)',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 12,

    overflow: 'hidden',
  },
  premiumPromoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: 'rgba(102, 102, 102, 0.4)',
  },
  premiumPromoTextContainer: {
    flex: 1,
  },
  premiumPromoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  premiumPromoSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 2,
  },
  tryPremiumButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 50,
  },
  tryPremiumText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  // Premium Promo Box End

  // Tab Styling Start
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 16,
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    marginHorizontal: 20,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
    color: '#fff',
  },
  settingText: {
    fontSize: 16,
    color: '#fff',
  },
  blurContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    paddingVertical: 8,
    paddingRight: 10,
    paddingLeft: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  // Tab Styling End

  // Appearance Tab Styling Start
  appearanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    borderRadius: 20,
    padding: 4,
    marginHorizontal: 20,
    marginTop: 10,
  },
  themeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 16,
  },
  themeButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  themeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  // Appearance Tab Styling End

  // Social Links Start
  socialSection: {
    marginBottom: 24,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  socialIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    boxShadow: '0 0 14px rgba(0, 0, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  // Social Links End

  // Logout Button Start
  logoutButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    marginHorizontal: 60,
    marginBottom: 40,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',

  },
  logoutButtonText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '500',
  },
  // Logout Button End
});

export default Settings;
