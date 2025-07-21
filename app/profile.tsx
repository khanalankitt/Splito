import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Alert,
    Switch,
    StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { deleteAccount } from "../utils/api";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function ProfilePage() {
    const { userName, userLogout } = useAuth();
    const { isDarkMode, toggleTheme, colors } = useTheme();
    const router = useRouter();

    const handleLogout = () => {
        Alert.alert(
            "Confirm Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: () => {
                        userLogout();
                        router.replace("/loginPage");
                    },
                },
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account? This action cannot be undone and will remove all your transaction data.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete Account",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const result = await deleteAccount(userName);
                            if (result.status) {
                                Alert.alert("Success", "Your account has been deleted successfully.", [
                                    {
                                        text: "OK",
                                        onPress: () => {
                                            userLogout();
                                            router.replace("/loginPage");
                                        },
                                    },
                                ]);
                            } else {
                                Alert.alert("Error", result.error || "Failed to delete account. Please try again.");
                            }
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete account. Please try again.");
                            console.error("Error deleting account:", error);
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar backgroundColor={colors.primary} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.primary }]}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <MaterialIcons name="arrow-back" size={35} style={{ fontWeight: "bold" }} color="white" />
                </Pressable>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            {/* Profile Content */}
            <View style={styles.content}>
                {/* Avatar and Name Section */}
                <View style={[styles.avatarSection, { backgroundColor: colors.surface }]}>
                    <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
                        <Text style={styles.avatarText}>
                            {userName.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <Text style={[styles.userName, { color: colors.text }]}>{userName}</Text>
                    <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                        @{userName.toLowerCase()}
                    </Text>
                </View>

                {/* Settings Section */}
                <View style={[styles.settingsSection, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>

                    {/* Dark Mode Toggle */}
                    <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
                        <View style={styles.settingLeft}>
                            <MaterialIcons
                                name={isDarkMode ? "dark-mode" : "light-mode"}
                                size={24}
                                color={colors.text}
                            />
                            <Text style={[styles.settingText, { color: colors.text }]}>
                                Dark Mode
                            </Text>
                        </View>
                        <Switch
                            value={isDarkMode}
                            onValueChange={toggleTheme}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={isDarkMode ? colors.accent : "#f4f3f4"}
                        />
                    </View>
                </View>

                {/* Actions Section */}
                <View style={[styles.actionsSection, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Actions</Text>

                    {/* Logout Button */}
                    <Pressable
                        style={[styles.actionButton, { backgroundColor: colors.primary }]}
                        onPress={handleLogout}
                    >
                        <MaterialIcons name="logout" size={24} color="white" />
                        <Text style={styles.actionButtonText}>Logout</Text>
                    </Pressable>

                    {/* Delete Account Button */}
                    <Pressable
                        style={[styles.actionButton, styles.deleteButton, { backgroundColor: colors.error }]}
                        onPress={handleDeleteAccount}
                    >
                        <MaterialIcons name="delete-forever" size={24} color="white" />
                        <Text style={styles.actionButtonText}>Delete Account</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 70,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
    },
    backButton: {
        position: "absolute",
        left: 30,
        top: 18,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "white",
    },
    content: {
        flex: 1,
        padding: 20,
        gap: 20,
    },
    avatarSection: {
        alignItems: "center",
        padding: 30,
        borderRadius: 15,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: "bold",
        color: "white",
    },
    userName: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 16,
    },
    settingsSection: {
        padding: 20,
        borderRadius: 15,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
    },
    settingItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
    },
    settingLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },
    settingText: {
        fontSize: 16,
        fontWeight: "500",
    },
    actionsSection: {
        padding: 20,
        borderRadius: 15,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        gap: 10,
    },
    deleteButton: {
        marginBottom: 0,
    },
    actionButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});
