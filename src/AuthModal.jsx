import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { supabase, supabaseConfigured } from "./supabase.js";

export default function AuthModal({ close, onSuccess, language = "ru" }) {
  const [method, setMethod] = useState("email");
  const [mode, setMode] = useState("signup");
  const [stage, setStage] = useState("form");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");

  const labels = {
    ru: {
      eyebrow: "АККАУНТ TWELVE",
      signup: "Создать аккаунт",
      login: "Войти",
      subtitle: "Сохраняйте места, публикуйте сигналы и следите за их решением.",
      email: "Почта",
      phone: "Телефон",
      name: "Ваше имя",
      emailPlaceholder: "name@example.com",
      phonePlaceholder: "+7 700 000 00 00",
      password: "Пароль",
      continue: "Продолжить",
      code: "Код из SMS",
      verify: "Подтвердить код",
      sent: "Код отправлен на",
      checkMail: "Проверьте почту",
      mailText: "Мы отправили ссылку подтверждения. После подтверждения вернитесь и войдите.",
      noConfig: "Supabase не настроен. Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY.",
      privacy: "Данные защищены Supabase Auth. Пароль не хранится в приложении.",
    },
    kz: {
      eyebrow: "TWELVE АККАУНТЫ",
      signup: "Аккаунт ашу",
      login: "Кіру",
      subtitle: "Орындарды сақтаңыз, белгі жариялаңыз және шешімін бақылаңыз.",
      email: "Пошта",
      phone: "Телефон",
      name: "Атыңыз",
      emailPlaceholder: "name@example.com",
      phonePlaceholder: "+7 700 000 00 00",
      password: "Құпиясөз",
      continue: "Жалғастыру",
      code: "SMS коды",
      verify: "Кодты растау",
      sent: "Код жіберілді:",
      checkMail: "Поштаңызды тексеріңіз",
      mailText: "Растау сілтемесін жібердік. Растағаннан кейін қайта кіріңіз.",
      noConfig: "Supabase бапталмаған. VITE_SUPABASE_URL және VITE_SUPABASE_ANON_KEY қосыңыз.",
      privacy: "Деректер Supabase Auth арқылы қорғалған. Құпиясөз қолданбада сақталмайды.",
    },
    en: {
      eyebrow: "TWELVE ACCOUNT",
      signup: "Create account",
      login: "Sign in",
      subtitle: "Save places, publish signals and follow every resolution.",
      email: "Email",
      phone: "Phone",
      name: "Your name",
      emailPlaceholder: "name@example.com",
      phonePlaceholder: "+7 700 000 00 00",
      password: "Password",
      continue: "Continue",
      code: "SMS code",
      verify: "Verify code",
      sent: "Code sent to",
      checkMail: "Check your email",
      mailText: "We sent a confirmation link. Confirm it, then return and sign in.",
      noConfig: "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
      privacy: "Protected by Supabase Auth. Your password is never stored in the app.",
    },
  }[language] || {};

  async function emailSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const values = new FormData(event.currentTarget);
    const email = values.get("email");
    const password = values.get("password");
    const name = values.get("name");
    try {
      if (!supabaseConfigured) throw new Error(labels.noConfig);
      if (mode === "signup") {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: window.location.origin,
          },
        });
        if (authError) throw authError;
        if (data.session) onSuccess?.(data.session);
        else setStage("email-sent");
      } else {
        const { data, error: authError } =
          await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        onSuccess?.(data.session);
      }
    } catch (authError) {
      setError(authError.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  async function phoneSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const values = new FormData(event.currentTarget);
    const fullPhone = values.get("phone");
    try {
      if (!supabaseConfigured) throw new Error(labels.noConfig);
      const { error: authError } = await supabase.auth.signInWithOtp({
        phone: fullPhone,
        options: {
          data: { name: values.get("name") || "twelve user" },
        },
      });
      if (authError) throw authError;
      setPhone(fullPhone);
      setStage("phone-code");
    } catch (authError) {
      setError(authError.message || "SMS could not be sent");
    } finally {
      setLoading(false);
    }
  }

  async function verifyPhone(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const code = new FormData(event.currentTarget).get("code");
      const { data, error: authError } = await supabase.auth.verifyOtp({
        phone,
        token: code,
        type: "sms",
      });
      if (authError) throw authError;
      onSuccess?.(data.session);
    } catch (authError) {
      setError(authError.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      className="auth-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => event.target === event.currentTarget && close()}
    >
      <motion.section
        className="auth-modal"
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16 }}
      >
        <button className="auth-close" onClick={close} aria-label="Close">
          <X />
        </button>
        <div className="auth-brand">
          <span>
            <i />
            <i />
            <i />
          </span>
          twelve
        </div>
        <span className="eyebrow">{labels.eyebrow}</span>
        <h2>{mode === "signup" ? labels.signup : labels.login}</h2>
        <p className="auth-subtitle">{labels.subtitle}</p>

        {stage === "email-sent" ? (
          <div className="auth-success">
            <i>
              <Mail />
            </i>
            <h3>{labels.checkMail}</h3>
            <p>{labels.mailText}</p>
            <button onClick={() => { setMode("login"); setStage("form"); }}>
              {labels.login}
              <ArrowRight />
            </button>
          </div>
        ) : stage === "phone-code" ? (
          <form onSubmit={verifyPhone}>
            <div className="otp-heading">
              <i><Phone /></i>
              <span>
                <b>{labels.code}</b>
                <small>{labels.sent} {phone}</small>
              </span>
            </div>
            <label>
              <span>{labels.code}</span>
              <div className="auth-input">
                <KeyRound />
                <input
                  name="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  minLength="6"
                  maxLength="6"
                  required
                  placeholder="000000"
                />
              </div>
            </label>
            {error && <p className="auth-error">{error}</p>}
            <button className="auth-submit" disabled={loading}>
              {loading ? "..." : labels.verify}
              <Check />
            </button>
          </form>
        ) : (
          <>
            <div className="auth-methods">
              <button
                className={method === "email" ? "active" : ""}
                onClick={() => { setMethod("email"); setError(""); }}
              >
                <Mail /> {labels.email}
              </button>
              <button
                className={method === "phone" ? "active" : ""}
                onClick={() => { setMethod("phone"); setError(""); }}
              >
                <Phone /> {labels.phone}
              </button>
            </div>

            <form onSubmit={method === "email" ? emailSubmit : phoneSubmit}>
              {mode === "signup" && (
                <label>
                  <span>{labels.name}</span>
                  <div className="auth-input">
                    <UserRound />
                    <input name="name" required autoComplete="name" />
                  </div>
                </label>
              )}

              {method === "email" ? (
                <>
                  <label>
                    <span>{labels.email}</span>
                    <div className="auth-input">
                      <Mail />
                      <input
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder={labels.emailPlaceholder}
                      />
                    </div>
                  </label>
                  <label>
                    <span>{labels.password}</span>
                    <div className="auth-input">
                      <KeyRound />
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength="8"
                        autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </label>
                </>
              ) : (
                <label>
                  <span>{labels.phone}</span>
                  <div className="auth-input">
                    <Phone />
                    <input
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder={labels.phonePlaceholder}
                    />
                  </div>
                </label>
              )}

              {error && <p className="auth-error">{error}</p>}
              <button className="auth-submit" disabled={loading}>
                {loading ? "..." : labels.continue}
                <ArrowRight />
              </button>
            </form>

            {method === "email" && (
              <button
                className="auth-switch"
                onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); }}
              >
                {mode === "signup" ? labels.login : labels.signup}
              </button>
            )}
          </>
        )}

        <footer>
          <ShieldCheck />
          <span>{labels.privacy}</span>
        </footer>
      </motion.section>
    </motion.div>
  );
}