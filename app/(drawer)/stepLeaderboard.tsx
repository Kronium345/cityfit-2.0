import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const StepLeaderboard = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Streaks');

    // Sample data for different tabs
    const leaderboardData = {
        streaks: [
            { id: 1, name: 'Name', value: 5, avatar: 'R' },
            { id: 2, name: 'Name', value: 4, avatar: 'K' },
            { id: 3, name: 'Name', value: 0, avatar: 'J' },
            { id: 4, name: 'Name', value: 0, avatar: 'A' },
            { id: 5, name: 'Name', value: 0, avatar: 'S' },
            { id: 6, name: 'Name', value: 0, avatar: 'T' },
            { id: 7, name: 'Name', value: 0, avatar: 'A' },
            { id: 8, name: 'Name', value: 0, avatar: 'K' },
            { id: 9, name: 'Name', value: 0, avatar: 'J' },
            { id: 10, name: 'Name', value: 0, avatar: 'T' },
            { id: 11, name: 'Name', value: 0, avatar: 'A' },
            { id: 12, name: 'Name', value: 0, avatar: 'K' },
        ],

        stepsToday: [
            { id: 1, name: 'Name', value: 9235, avatar: 'K' },
            { id: 2, name: 'Name', value: 8150, avatar: 'J' },
            { id: 3, name: 'Name', value: 7430, avatar: 'R' },
            { id: 4, name: 'Name', value: 9235, avatar: 'K' },
            { id: 5, name: 'Name', value: 8150, avatar: 'J' },
            { id: 6, name: 'Name', value: 7430, avatar: 'R' },
            { id: 7, name: 'Name', value: 9235, avatar: 'K' },
            { id: 8, name: 'Name', value: 8150, avatar: 'J' },
            { id: 9, name: 'Name', value: 7430, avatar: 'R' },
            { id: 10, name: 'Name', value: 9235, avatar: 'K' },
            { id: 11, name: 'Name', value: 8150, avatar: 'J' },
            { id: 12, name: 'Name', value: 7430, avatar: 'R' },
        ],

        stepsWeek: [
            { id: 1, name: 'Name', value: 45235, avatar: 'K' },
            { id: 2, name: 'Name', value: 32150, avatar: 'J' },
            { id: 3, name: 'Name', value: 28430, avatar: 'R' },
            { id: 4, name: 'Name', value: 45235, avatar: 'K' },
            { id: 5, name: 'Name', value: 32150, avatar: 'J' },
            { id: 6, name: 'Name', value: 28430, avatar: 'R' },
            { id: 7, name: 'Name', value: 45235, avatar: 'K' },
            { id: 8, name: 'Name', value: 32150, avatar: 'J' },
            { id: 9, name: 'Name', value: 28430, avatar: 'R' },
            { id: 10, name: 'Name', value: 45235, avatar: 'K' },
            { id: 11, name: 'Name', value: 32150, avatar: 'J' },
            { id: 12, name: 'Name', value: 28430, avatar: 'R' },
        ],
    };

    const renderFriendRow = (friend, index) => {
        const value = activeTab === 'Streaks'
            ? `${friend.value} streaks`
            : `${friend.value.toLocaleString()} steps`;

        return (
            <BlurView
                intensity={20}
                tint="dark"
                style={styles.friendRowContainer}
            >
                <View key={friend.id} style={styles.friendRow}>
                    <View style={styles.friendInfo}>
                        <Text style={styles.friendRank}>{index + 1}</Text>
                        <View style={styles.friendAvatar}>
                            <Text style={styles.avatarText}>{friend.avatar}</Text>
                        </View>
                        <Text style={styles.friendName}>{friend.name}</Text>
                    </View>
                    <Text style={styles.valueText}>{value}</Text>
                </View>
            </BlurView>
        );
    };

    const getCurrentData = () => {
        switch (activeTab) {
            case 'Streaks':
                return leaderboardData.streaks;
            case 'Steps today':
                return leaderboardData.stepsToday;
            case 'Steps this week':
                return leaderboardData.stepsWeek;
            default:
                return leaderboardData.streaks;
        }
    };

    return (
        <LinearGradient
            colors={['#000000', '#004d00', '#003300']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            {/* Fixed Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <BlurView intensity={20} tint="light" style={styles.blurContainer}>
                        <Ionicons name="chevron-back" size={24} color="#fff" />
                    </BlurView>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Leaderboard</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    {['Streaks', 'Steps today', 'Steps this week'].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.activeTab]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Leaderboard List */}
                <ScrollView
                    style={styles.leaderboardContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {getCurrentData().map((friend, index) => renderFriendRow(friend, index))}
                </ScrollView>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 12,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 4,
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 20,
    },
    activeTab: {
        backgroundColor: '#fff',
    },
    tabText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 16,
        fontWeight: '400',
    },
    activeTabText: {
        color: '#000',
        fontWeight: '600',
    },
    leaderboardContainer: {
        flex: 1,
    },
    friendRowContainer: {
        borderRadius: 15,
        marginBottom: 10,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    friendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
    },
    friendInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    friendRank: {
        color: '#fff',
        width: 30,
        fontSize: 16,
        fontWeight: '500',
    },
    friendAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    friendName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    valueText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
    },
    blurContainer: {
        borderRadius: 12,
        overflow: 'hidden',
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    headerTitle: {
        fontSize: 20,
        color: '#fff',
        fontWeight: '600',
    },
});

export default StepLeaderboard; 