import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { COLORS } from "../../assets/constants";
import { UpdateUser, UpdateUserPassword } from "../../../api/Api";
import { useAuth } from "../../context/AuthContext";
import {
  PasswordValidationText,
  isPasswordValid,
} from "../../util/PasswordCheck";
import { IsEmailValid } from "../../util/EmailCheck";

//Show userdetails and functionailty to update profile information and/or password

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 55,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  header: {
    top: 4,
    color: COLORS.steelblue,
    fontSize: 38,
    fontWeight: "bold",
    alignSelf: "center",
  },
  form: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 1,
  },
  textInput: {
    fontSize: 20,
    width: 250,
    borderRadius: 5,
    padding: 4,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginBottom: 5,
    backgroundColor: "white",
  },

  button: {
    backgroundColor: COLORS.testgreen,
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.lightGray,
  },
  passwordChange: {
    marginTop: 15,
    flexGrow: 1,
  },
  error: {
    color: "darkred",
    fontSize: 20,
    flexShrink: 1,
  },
  result: {
    color: "darkgreen",
    fontSize: 20,
    flexShrink: 1,
  },
});

export default ({ navigation }) => {
  const [changePassword, setChangePassword] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
  });

  const [passwordForm, setPasswordForm] = useState({
    oldpassword: "",
    password: "",
    passwordconfirm: "",
  });

  const submitUpdate = async (e) => {
    setLoading(true);
    setError("");
    setResult("");

    const { password, passwordconfirm } = passwordForm;

    const validPassword = isPasswordValid(passwordForm);

    if (changePassword) {
      if (password === passwordconfirm && validPassword) {
        UpdateUserPassword(token, passwordForm)
          .then((e) => {
            setLoading(false);
          })
          .catch((e) => {
            if (e.response.status === 400) {
              setError("Oude wachtwoord onjuist");
              setLoading(false);
            }
          });
      } else if (password !== passwordconfirm) {
        setError("Wachtwoorden komen niet overeen");
        setLoading(false);
        return;
      } else {
        setError("Wachtwoord voldoet niet aan eisen");
        setLoading(false);
        return;
      }
    }

    const validEmail = IsEmailValid(form.email);
    if (!validEmail) {
      setError("email adres niet geldig");
      setLoading(false);
      return;
    }

    UpdateUser(token, form)
      .then((e) => {
        setResult("Profiel bijwerkt");
        setLoading(false);
      })
      .catch((e) => {
        setError("Er is iets fout gegaan");
        setLoading(false);
        console.log(e);
      });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View>
          <Text style={styles.header}>Profiel</Text>
          <View>
            <Text style={styles.header}>{loading && "Laden..."}</Text>

            <Text style={styles.result}>{result}</Text>
            <Text style={styles.error}>{error}</Text>
          </View>
        </View>
        <View style={styles.form}>
          <View>
            <TextInput
              value={form.name}
              onChangeText={(t) => setForm({ ...form, ["name"]: t })}
              autoCapitalize="none"
              style={styles.textInput}
              placeholder="voornaam achternaam"
            />
            <TextInput
              value={form.email}
              onChangeText={(t) => setForm({ ...form, ["email"]: t })}
              autoCapitalize="none"
              style={styles.textInput}
              placeholder="info@email.com"
            />
          </View>
          <View style={styles.passwordChange}>
            {changePassword && (
              <View>
                <TextInput
                  value={form.password}
                  onChangeText={(t) =>
                    setPasswordForm({ ...passwordForm, ["oldpassword"]: t })
                  }
                  autoCapitalize="none"
                  style={styles.textInput}
                  placeholder="huidig wachtwoord"
                  secureTextEntry={true}
                />
                <TextInput
                  value={form.password}
                  onChangeText={(t) =>
                    setPasswordForm({ ...passwordForm, ["password"]: t })
                  }
                  autoCapitalize="none"
                  style={styles.textInput}
                  placeholder="nieuw wachtwoord"
                  secureTextEntry={true}
                />
                <TextInput
                  value={form.passwordconfirm}
                  onChangeText={(t) =>
                    setPasswordForm({ ...passwordForm, ["passwordconfirm"]: t })
                  }
                  autoCapitalize="none"
                  style={styles.textInput}
                  placeholder="herhaal nieuw wachtwoord"
                  secureTextEntry={true}
                />
                <PasswordValidationText passwordForm={passwordForm} />
              </View>
            )}
            <TouchableOpacity
              onPress={() => setChangePassword(!changePassword)}
              style={[
                styles.button,
                {
                  backgroundColor: changePassword ? COLORS.gray2 : COLORS.white,
                },
              ]}
            >
              <Text
                numberOfLines={2}
                style={[
                  styles.buttonText,
                  { color: changePassword ? COLORS.white : COLORS.gray2 },
                ]}
              >
                {`Wachtwoord ${changePassword ? "niet " : ""}bijwerken`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexGrow: 1 }}>
          <TouchableOpacity
            disabled={loading}
            style={styles.button}
            onPress={() => submitUpdate()}
          >
            <Text style={styles.buttonText}>Gegevens bijwerken</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
