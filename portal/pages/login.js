import Image from "next/image";
import { useState } from "react";
import Layout from "../components/layout";
import Login from "../components/login/login";
import styles from "../styles/Login.module.css";
import config from "@/components/config";

const LoginWrapper = () => {
  const [selectedPersona, setSelectedPersona] = useState({
    consonant: false,
    en: "official",
    hi: "अधिकारी",
    credentials: "Rozgar Saathi",
    applicationId: process.env.NEXT_PUBLIC_FUSIONAUTH_STATE_APP_ID,
    redirectUrl: `admin#/vacancy_details`,
  });
  if (selectedPersona) {
    return (
      <Layout>
        <Login persona={selectedPersona}></Login>
      </Layout>
    );
  }

  return (
    <Layout>
      <>
        <h2 className="text-center">Login &#47; लॉग इन</h2>
        <div className={`${styles.grid} ${styles["grid-two"]}`}>
          {config.personas.map((persona, index) => (
            <div
              onClick={() => {
                // console.log(persona)

                setSelectedPersona(persona);
              }}
              key={index}
              className={`card`}
            >
              <h2 className={"capitalize"}>
                {persona.en} &#47; <br />
                {persona.hi}&rarr;
              </h2>
              <p>
                I am a{persona.consonant ? "" : "n"} {persona.en}
                <br /> मैं राज्य में {persona.hi} हूँ{" "}
              </p>
            </div>
          ))}
        </div>
      </>
    </Layout>
  );
};

export default LoginWrapper;
