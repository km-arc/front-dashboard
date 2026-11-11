"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, type FormEvent } from "react";
import {
  Alert,
  AlertDescription,
  Button,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@front-dashboard/ui";
import { useRouter } from "../../i18n/navigation";
import { normalizeIranMobile, normalizeOtpCode } from "../../lib/identity";
import { requestCodeAction, signInWithCodeAction, signInWithPasswordAction } from "./actions";
import { secondsLeft } from "./countdown";
import type { ActionResult, AuthErrorCode, Session } from "./service";

type Method = "code" | "password";
type CodeStep =
  { stage: "mobile" } | { stage: "code"; mobile: string; codeLength: number; readyAt: number };

/** Sign-in with a one-time code or with a password. `next` is a path on this site (already checked on the server). */
export function LoginForm({ next }: { next: string }) {
  const t = useTranslations("login");
  const router = useRouter();
  const [method, setMethod] = useState<Method>("code");
  const [error, setError] = useState<AuthErrorCode | null>(null);
  const [pending, setPending] = useState(false);
  const [mobile, setMobile] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<CodeStep>({ stage: "mobile" });
  const [now, setNow] = useState(() => Date.now());

  const waiting = step.stage === "code";
  useEffect(() => {
    if (!waiting) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [waiting]);

  function finish(result: ActionResult<Session>) {
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.replace(next);
    router.refresh();
  }

  async function submitMobile(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const normalized = normalizeIranMobile(mobile);
    if (!normalized) {
      setError("invalid_mobile");
      return;
    }
    setPending(true);
    const result = await requestCodeAction(normalized);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    const { codeLength, retryAfterSeconds } = result.data;
    setCode("");
    setNow(Date.now());
    setStep({
      stage: "code",
      mobile: normalized,
      codeLength,
      readyAt: Date.now() + retryAfterSeconds * 1000,
    });
  }

  async function submitCode(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (step.stage !== "code") return;
    const digits = normalizeOtpCode(code, step.codeLength);
    if (!digits) {
      setError("invalid_code");
      return;
    }
    setPending(true);
    const result = await signInWithCodeAction(step.mobile, digits);
    setPending(false);
    finish(result);
  }

  async function resend() {
    if (step.stage !== "code") return;
    setError(null);
    setPending(true);
    const result = await requestCodeAction(step.mobile);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setNow(Date.now());
    setStep({ ...step, readyAt: Date.now() + result.data.retryAfterSeconds * 1000 });
  }

  async function submitPassword(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const normalized = normalizeIranMobile(mobile);
    if (!normalized) {
      setError("invalid_mobile");
      return;
    }
    if (!password) {
      setError("invalid_credentials");
      return;
    }
    setPending(true);
    const result = await signInWithPasswordAction(normalized, password);
    setPending(false);
    finish(result);
  }

  const mobileProblem = error === "invalid_mobile";
  const mobileField = (id: string) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{t("mobileLabel")}</Label>
      <Input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        value={mobile}
        onChange={(event) => setMobile(event.target.value)}
        aria-invalid={mobileProblem}
        aria-describedby={`${id}-hint`}
      />
      <p id={`${id}-hint`} className="text-sm text-muted-foreground">
        {t("mobileHint")}
      </p>
    </div>
  );

  return (
    <Tabs
      value={method}
      onValueChange={(value) => {
        setMethod(value === "password" ? "password" : "code");
        setError(null);
      }}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="code">{t("methodCode")}</TabsTrigger>
        <TabsTrigger value="password">{t("methodPassword")}</TabsTrigger>
      </TabsList>

      {error ? (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{t(`errors.${error}`)}</AlertDescription>
        </Alert>
      ) : null}

      <TabsContent value="code" className="mt-4">
        {step.stage === "mobile" ? (
          <form onSubmit={submitMobile} className="space-y-4" noValidate>
            {mobileField("login-code-mobile")}
            <Button type="submit" className="w-full" disabled={pending}>
              {t("sendCode")}
            </Button>
          </form>
        ) : (
          <form onSubmit={submitCode} className="space-y-4" noValidate>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">
                {t("codeSentTo")} <span dir="ltr">{step.mobile}</span>
              </p>
              <Button
                type="button"
                variant="link"
                onClick={() => {
                  setStep({ stage: "mobile" });
                  setError(null);
                }}
              >
                {t("changeNumber")}
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-code">{t("codeLabel")}</Label>
              <Input
                id="login-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                maxLength={step.codeLength + 4}
                value={code}
                onChange={(event) => setCode(event.target.value)}
                aria-invalid={error === "invalid_code"}
                aria-describedby="login-code-hint"
              />
              <p id="login-code-hint" className="text-sm text-muted-foreground">
                {t("codeHint")}
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              {t("signIn")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={pending || secondsLeft(step.readyAt, now) > 0}
              onClick={resend}
            >
              {secondsLeft(step.readyAt, now) > 0
                ? t("resendIn", { seconds: secondsLeft(step.readyAt, now) })
                : t("resend")}
            </Button>
          </form>
        )}
      </TabsContent>

      <TabsContent value="password" className="mt-4">
        <form onSubmit={submitPassword} className="space-y-4" noValidate>
          {mobileField("login-password-mobile")}
          <div className="space-y-2">
            <Label htmlFor="login-password">{t("passwordLabel")}</Label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={error === "invalid_credentials"}
              aria-describedby="login-password-hint"
            />
            <p id="login-password-hint" className="text-sm text-muted-foreground">
              {t("passwordHint")}
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {t("signIn")}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}
