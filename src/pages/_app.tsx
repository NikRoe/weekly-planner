import { ModalProvider } from "@/provider/ModalProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig, Fetcher } from "swr";

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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher }}>
      <ModalProvider>
        <Component {...pageProps} />
      </ModalProvider>
    </SWRConfig>
  );
}
