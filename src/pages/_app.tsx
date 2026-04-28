import { ModalProvider } from "@/provider/ModalProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig, Fetcher } from "swr";
import { ThemeProvider } from "next-themes";
import { AppSettingsProvider } from "@/provider/AppSettingsProvider";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

const fetcher: Fetcher = async (url: string) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error(
      "An error occurred while fetching the data."
    ) as Error & { info: string; status: number };
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

const fontVariables = [
  instrumentSerif.variable,
  inter.variable,
  jetbrainsMono.variable,
].join(" ");

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      <AppSettingsProvider>
        <SWRConfig value={{ fetcher }}>
          <ModalProvider>
            <div className={fontVariables}>
              <Component {...pageProps} />
            </div>
          </ModalProvider>
        </SWRConfig>
      </AppSettingsProvider>
    </ThemeProvider>
  );
}
