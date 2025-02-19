import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
    withTiming,
    withRepeat,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

// Blob Blurred Background Start
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const BlobBackground = () => {
    const blob1Animation = useSharedValue(0);
    const blob2Animation = useSharedValue(0);
    const blob3Animation = useSharedValue(0);

    useEffect(() => {
        const animate = (value: any, duration: number) => {
            'worklet';
            value.value = withRepeat(
                withTiming(1, { duration }),
                -1,
                true
            );
        };

        animate(blob1Animation, 8000);
        animate(blob2Animation, 12000);
        animate(blob3Animation, 10000);
    }, []);

    const createBlobStyle = (animation: any) => {
        'worklet';
        const animatedStyles = useAnimatedStyle(() => ({
            transform: [
                { translateX: animation.value * 40 - 20 },
                { translateY: animation.value * 40 - 20 }
            ]
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


const AccountIntegrations = () => {
    const router = useRouter();
    const [integrations, setIntegrations] = useState({
        apple: false,
        google: false,
        instagram: false,
        twitter: false,
    });

    // Simulate fetching user's current integrations
    useEffect(() => {
        const fetchIntegrations = async () => {
            try {
                const savedIntegrations = await AsyncStorage.getItem('integrations');
                if (savedIntegrations) {
                    setIntegrations(JSON.parse(savedIntegrations));
                }
            } catch (error) {
                console.error('Error fetching integrations:', error);
            }
        };
        fetchIntegrations();
    }, []);

    const handleToggleIntegration = async (platform: string) => {
        try {
            // Here you would typically handle the OAuth flow for each platform
            const newIntegrations = {
                ...integrations,
                [platform]: !integrations[platform as keyof typeof integrations],
            };
            setIntegrations(newIntegrations);
            await AsyncStorage.setItem('integrations', JSON.stringify(newIntegrations));
        } catch (error) {
            console.error(`Error toggling ${platform} integration:`, error);
        }
    };

    // Render Integration Item Start
    const renderIntegrationItem = (
        platform: string,
        icon: string,
        title: string,
        description: string,
        isConnected: boolean
    ) => (
        <View style={styles.integrationItem}>
            <BlurView intensity={10} tint="light" style={styles.blurBackground} />
            <View style={styles.integrationContent}>
                <View style={styles.integrationHeader}>
                    <Ionicons name={icon} size={24} color="#fff" style={styles.icon} />
                    <View style={styles.integrationTextContainer}>
                        <Text style={styles.integrationTitle}>{title}</Text>
                        <Text style={styles.integrationDescription}>{description}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={[styles.connectButton, isConnected && styles.connectedButton]}
                    onPress={() => handleToggleIntegration(platform)}
                >
                    <Text style={styles.connectButtonText}>
                        {isConnected ? 'Disconnect' : 'Connect'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
    // Render Integration Item End


    return (
        <View style={styles.container}>
            <BlobBackground />
            {/* Header Start */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.push('/(drawer)/settings')}
                    style={styles.backButton}
                >
                    <BlurView intensity={20} tint="light" style={styles.blurContainer}>
                        <Ionicons name="chevron-back" size={24} color="#fff" />
                    </BlurView>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Account Integrations</Text>
            </View>
            {/* Header End */}

            <ScrollView style={styles.scrollView}>
                {/* Auth Providers Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Authentication Providers</Text>
                    {renderIntegrationItem(
                        'apple',
                        'logo-apple',
                        'Sign in with Apple',
                        'Use your Apple ID to sign in securely',
                        integrations.apple
                    )}
                    {renderIntegrationItem(
                        'google',
                        'logo-google',
                        'Sign in with Google',
                        'Connect your Google account',
                        integrations.google
                    )}
                </View>

                {/* Social Media Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Social Media</Text>
                    {renderIntegrationItem(
                        'instagram',
                        'logo-instagram',
                        'Instagram',
                        'Share your workouts and progress',
                        integrations.instagram
                    )}
                    {renderIntegrationItem(
                        'twitter',
                        'logo-twitter',
                        'X (Twitter)',
                        'Share achievements with your followers',
                        integrations.twitter
                    )}
                </View>
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

    // Header Start
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingTop: 20,
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
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
        textAlign: 'center',
    },
    // Header End

    scrollView: {
        paddingTop: 10,
        flex: 1,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.6)',
        marginLeft: 16,
        textTransform: 'uppercase',
        marginBottom: 12,
    },
    integrationItem: {
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    blurBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    integrationContent: {
        padding: 16,
        position: 'relative',
        zIndex: 1,
    },
    integrationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    icon: {
        marginRight: 12,
    },
    integrationTextContainer: {
        flex: 1,
    },
    integrationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    integrationDescription: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    connectButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    connectedButton: {
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
    },
    connectButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default AccountIntegrations;
