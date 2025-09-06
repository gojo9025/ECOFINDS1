import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';
import type { AppContextType } from '../types';
import { COLORS, SIZES, SPACING } from '../theme';

export const LoginScreen: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const { login, register, user } = useContext(AppContext) as AppContextType;
    const navigation = useNavigation();
    
    useEffect(() => {
        if (user) {
            // This effect will trigger navigation if a user is already logged in
            // which happens when the AppNavigator switches stacks.
        }
    }, [user, navigation]);

    const handleSubmit = async () => {
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password, username);
            }
            // Navigation will be handled by the AppNavigator automatically upon user state change
        } catch (err: any) {
            Alert.alert('Authentication Failed', err.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <View style={styles.innerContainer}>
                    <View style={styles.header}>
                        <Text style={styles.logo}>EcoFinds</Text>
                        <Text style={styles.title}>{isLogin ? 'Welcome Back!' : 'Create an Account'}</Text>
                        <Text style={styles.subtitle}>{isLogin ? 'Sign in to continue' : 'Join our community'}</Text>
                    </View>
                    
                    {!isLogin && (
                        <TextInput
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                            style={styles.input}
                            autoCapitalize="none"
                            placeholderTextColor={COLORS.neutral[400]}
                        />
                    )}
                    <TextInput
                        placeholder="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor={COLORS.neutral[400]}
                    />
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}
                        secureTextEntry
                        placeholderTextColor={COLORS.neutral[400]}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
                    </TouchableOpacity>

                    <View style={styles.toggleContainer}>
                        <Text style={styles.toggleText}>
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                        </Text>
                        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                            <Text style={styles.toggleButtonText}>
                                {isLogin ? ' Sign up' : ' Login'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.neutral[100],
    },
    keyboardView: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: SPACING[6],
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING[8],
    },
    logo: {
        fontSize: SIZES['4xl'],
        fontWeight: '800',
        color: COLORS.primary[600],
    },
    title: {
        fontSize: SIZES['2xl'],
        fontWeight: 'bold',
        color: COLORS.neutral[800],
        marginTop: SPACING[4],
    },
    subtitle: {
        fontSize: SIZES.base,
        color: COLORS.neutral[500],
        marginTop: SPACING[1],
    },
    input: {
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING[4],
        paddingVertical: SPACING[3],
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.neutral[300],
        fontSize: SIZES.base,
        marginBottom: SPACING[4],
        color: COLORS.neutral[800],
    },
    button: {
        backgroundColor: COLORS.primary[600],
        paddingVertical: SPACING[4],
        borderRadius: 12,
        alignItems: 'center',
        marginTop: SPACING[2],
    },
    buttonText: {
        color: COLORS.white,
        fontSize: SIZES.lg,
        fontWeight: '600',
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: SPACING[6],
    },
    toggleText: {
        color: COLORS.neutral[600],
        fontSize: SIZES.sm,
    },
    toggleButtonText: {
        color: COLORS.primary[600],
        fontSize: SIZES.sm,
        fontWeight: '600',
    },
});
