import { useNavigation } from '@react-navigation/core'
import { Alert, KeyboardAvoidingView, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import React, { useState } from 'react'
import AppStyles from '../constants/AppStyles'
import { auth } from '../src/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import logo from '../assets/Au10GIF.png'
import Icon from 'react-native-vector-icons/FontAwesome';

const RegisterPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [emailError, setEmailError] = useState(''); // State for email validation error
  const navigation = useNavigation()
  const [emailAlreadyInUse, setEmailAlreadyInUse] = useState(false);

  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rePasswordVisibility, setRePasswordVisibility] = useState(true);

  const renderPasswordIcon = (isVisible, toggleVisibility) => (
    <TouchableOpacity onPress={toggleVisibility} style={styles.eyeIcon}>
      <Icon name={isVisible ? 'eye' : 'eye-slash'} size={20} color="grey" />
    </TouchableOpacity>
  );
  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  const toggleRePasswordVisibility = () => {
    setRePasswordVisibility(!rePasswordVisibility);
  };

  const validateEmail = (email) => {

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailRegex.test(email);
  }

  const handleRegister = () => {
    // Validate email format
    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      return;
    }

    if (password !== rePassword) {
      setPasswordMismatch(true);
      setEmailError(''); // Reset email error
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with:', user.email);
        navigation.replace("Account");
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          setEmailAlreadyInUse(true); // Set email already in use error
        } else {
          console.log(`Register Failed: ${error.message}`);
        }
        setPasswordMismatch(false); // Reset password mismatch error
        setEmailError(''); // Reset other email errors
      });


    console.log(`Email: ${email}, Password: ${password}`);

  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height"
      onStartShouldSetResponder={() => Keyboard.dismiss()}
    >
      <View style={styles.container}>
        <Image source={logo} style={styles.mainlogo} />
        <View style={styles.logoContainer}>
          <Text style={styles.textstyle}>
            Advanced Utilization System for Tracking Insights and Numbers
          </Text>
        </View>
        <View style={styles.inputContainer}>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={text => {
              setEmail(text);
              setEmailError(''); // Reset email error when typing
            }}
            style={[
              styles.input,
              emailError && styles.inputError // Apply the error style when there's an email error
            ]}
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
          <View style={styles.passwordInputContainer}>
            <TextInput
              placeholder="Enter Password"
              value={password}
              onChangeText={text => setPassword(text)}
              style={styles.input}
              secureTextEntry={!passwordVisibility}
            />
            {renderPasswordIcon(passwordVisibility, togglePasswordVisibility)}
          </View>
          <View style={styles.passwordInputContainer}>
            <TextInput
              placeholder="Re-enter Password"
              value={rePassword}
              onChangeText={text => setRePassword(text)}
              style={[
                styles.input,
                passwordMismatch && styles.inputError
              ]}
              secureTextEntry={!rePasswordVisibility}
            />
            {renderPasswordIcon(rePasswordVisibility, toggleRePasswordVisibility)}
          </View>
          {passwordMismatch && (
            <Text style={styles.errorText}>Password don't match</Text>
          )}
          {emailAlreadyInUse && (
            <Text style={styles.errorText}>This email is already registered</Text>
          )}
        </View>

        <View style={styles.loginContainer}>
          <TouchableOpacity
            onPress={handleRegister}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.registerContainer}>
          <Text style={styles.text}>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => navigation.replace("Login")}
          >
            <Text style={styles.registerText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>

  )
}

export default RegisterPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppStyles.color.background
  },
  logoContainer: {
    padding: 30,
  },
  inputContainer: {
    width: '70%',
    maxWidth: 600,
    padding: 15,
  },
  passwordInputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: AppStyles.color.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
    paddingLeft: 10,
  },
  loginContainer: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 5,
    height: '100%',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: AppStyles.color.accent,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    marginRight: 5,
  },
  registerContainer: {
    flexDirection: 'row',
    padding: 10,
    marginTop: 10,
  },
  registerText: {
    color: AppStyles.color.accent,
    fontWeight: '700',
    fontSize: 14,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  mainlogo: {
    height: 130,
    width: 130,
    borderRadius: 100,
    alignItems: 'baseline',
  },
  textstyle: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
  }
});
