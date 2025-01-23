import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    View,
  } from "react-native";
  import React, { useState } from "react";
  import { useRouter } from "expo-router"; // Import the router from expo-router
  
  const Mental = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const router = useRouter(); // Use router for navigation
  
    const handleNext = () => {
      // Navigate to the next page (use your actual next screen name here)
      router.push("/mentalHomePage"); // Replace "/nextScreen" with your desired screen
    };
  
    return (
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require("../assets/images/mental-health-logo.jpg")} style={styles.logo} />
        </View>
        <View style={styles.bodyContainer}>
          {/* Welcome text */}
          <Text style={styles.welcome}>Welcome to Head Space</Text>
          <Text style={styles.subtitle}>
            Please enter your details below to proceed
          </Text>
  
  
          {/* "Next" Button */}
          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };
  
  export default Mental;
  
  const styles = StyleSheet.create({
    container: {
      margin: 30,
      height: "92%",
      flexDirection: "column",
      justifyContent: "center",
    },
    logoContainer: {
      alignItems: "center",
    },
    logo: {
      width: 150,
      height: 110,
    },
    bodyContainer: {
      marginTop: 30,
      width: "100%",
    },
  
    welcome: {
      fontSize: 24,
      textAlign: "center",
      fontWeight: "bold",
    },
  
    subtitle: {
      marginTop: 5,
      fontSize: 16,
    },
  
    input: {
      backgroundColor: "#EFF1F5",
      color: "gray",
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 5,
      marginTop: 5,
      fontWeight: "500",
    },
  
    btnContainer: {
      width: "100%",
      marginTop: 30,
    },
    button: {
      backgroundColor: "#FC734D",
      paddingVertical: 12,
      borderRadius: 5,
      minWidth: 150,
    },
    buttonText: {
      textAlign: "center",
      fontSize: 16,
      fontWeight: "600",
      color: "white",
    },
  });
  